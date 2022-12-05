<template>
  <!--
  <h1>Basic</h1>
  <button @click="logData"> log permissionsTreeData</button>
  <div>
    <blocks-tree :data="permissionsTreeData" :horizontal="treeOrientation=='1'"  :collapsable="true" ></blocks-tree>
  </div>
  -->
  <FlashMessage position="right top" strategy="single" />
  <button class="btn btn-primary btn-lg " @click="saveButton">Save changes</button>
  <h1>Current tree</h1>
  <div>
    <blocks-tree   @node-click="show" :data="permissionsTreeData" :horizontal="treeOrientation=='1'" :collapsable="true" :props="{
        label: 'label', expand: 'expand', children: 'children',  key:'some_id', permission: 'permission'}">
      <template class="test"  #node="{data}" >
        <div class="container justify-content-center">
          <div ckass="row">
            <div class="col" >
              <label >
                  {{data.permission.lft}} {{data.label}} {{data.permission.rgt}}
              </label>
            </div>
            <div class="col" v-show="data.expand">
              <label class="col" >Rename:
                <input class="m-1"  type="text" v-model="data.rename" style="width: 100px"/>
                <button type="button" class="btn btn-primary m-1"  @click="renameButton(data)" > Rename</button>
              </label>
            </div>
            <div class="col" v-show="data.expand">
              <label class="col" >Child name:
                <input class="m-1"  type="text" v-model="data.newChildName" style="width: 100px"/>
                <button type="button" class="btn btn-primary m-1"  @click="addChildButton(data)" > Add child</button>
              </label>
            </div>
            <div class="col" v-show="data.expand">
                <button v-show="showDelete(data)" type="button" class="btn btn-danger m-1"  @click="deleteData(data)" > Delete this</button>
            </div>
          </div>
        </div>
      </template>
    </blocks-tree>
  </div>

  <h1>Change orientation</h1>
  <select v-model="treeOrientation">
    <option value="0">Vertical</option>
    <option value="1">Horizontal</option>
  </select>

</template>

<script lang="ts" >
import { defineComponent, reactive, ref } from 'vue'
// eslint-disable-next-line import/no-duplicates
import permission, { TreeData } from '@/components/tree/Permission'
import http from '@/http-common'

// eslint-disable-next-line import/no-duplicates
import Permission from '@/components/tree/Permission'
import Tree from '@/views/Tree.vue'
import { index } from 'd3'
import { flashMessage } from '@smartweb/vue-flash-message'
import { v4 as uuidv4 } from 'uuid'

export default defineComponent({
  name: 'PermissionsTree',
  setup: function () {
    let index = uuidv4()
    let preorderNumber = 0
    const treeOrientation = ref('0')
    const permissionsTreeData = reactive <TreeData>(
      {
        label: 'root',
        expand: true,
        some_id: index,
        newChildName: '',
        rename: '',
        permission: {
          id: index,
          name: 'string',
          lft: 4,
          rgt: 5
        },
        children: []
      }
    )

    const databaseData = reactive<permission[]>([])

    const newDatabaseData = reactive<permission[]>([])

    function addChild (data: TreeData):[string, string, string] {
      if (data.newChildName === '') {
        return ['error',
          'Child error',
          'Child name input field cannot be empty'
        ]
      }
      const newChild = newPermission(data)

      data.newChildName = ''
      data.children.push(newChild)
      startPreorder()
      return ['success',
        'Child added successfuly',
        `Child " ${newChild.label} " successfuly added to " ${data.label} "`
      ]
    }

    function newPermission (data: TreeData):TreeData {
      index = uuidv4()
      return {
        label: data.newChildName,
        expand: false,
        some_id: index,
        newChildName: '',
        rename: '',
        permission: {
          id: index,
          name: data.newChildName,
          // eslint-disable-next-line camelcase
          parent_id: data.permission.id,
          // changed: true
          lft: 4,
          rgt: 6
        },
        parent: data,
        children: []
      }
    }

    function show (e : any, data : any) {
      if (e.target.tagName.toLowerCase() === 'div' || (e.target.tagName.toLowerCase() === 'label' && !data.expand)) {
        data.expand = !data.expand
      }
    }

    function rename (data:TreeData) :[string, string, string] {
      if (data.rename === '') {
        return ['error',
          'Rename error',
          'New name cannot be cannot be empty'
        ]
      }
      const temp = data.label
      data.label = data.rename
      data.permission.name = data.rename
      data.rename = ''

      return ['success',
        'Rename was successful',
        `Renamed " ${temp} " to " ${data.label} "`
      ]
    }

    async function save () : Promise<[string, string, string]> {
      newDatabaseData.length = 0
      addToNewDatabseData(permissionsTreeData)
      console.log('old data')
      console.log(databaseData)
      updateOldData(permissionsTreeData)
      console.log('old data but edited')
      console.log(databaseData)

      // sending to  backend oldDataForDeletion i newDatabaseData

      for (const data of databaseData) {
        data._method = 'PUT'
        http.post(`http://blog.test/api/permission/${data.id}`, data)
          .then(response => console.log(response))
          .catch((error) => { console.log(error); return (['error', 'Failed to edit', `Editing of "${data.name}" has failed, reason unknown. Try refreshing page`]) })
      }

      await new Promise(resolve => setTimeout(resolve, 500))

      return http.post('http://blog.test/api/permission', newDatabaseData)
        .then(response => {
          if (response.status === 200) {
            return ['success',
              'Save was success',
              'Data successfuly saved '
            ]
          } else {
            return ['error',
              'Error ',
              'Something went wrong, try refreshing the page '
            ]
          }
        })
    }

    function delay (time:number) {
      return new Promise(resolve => setTimeout(resolve, time))
    }

    function addToNewDatabseData (data:TreeData) {
      let isInOld = false
      // goes throu all the tree and checks if there are new children and then places them into newDatabaseData
      for (const oldData of databaseData) {
        if (oldData.id === data.permission.id) {
          isInOld = true
          break
        }
      }

      if (!isInOld) {
        newDatabaseData.push(data.permission)
      }

      for (const childData of data.children) {
        addToNewDatabseData(childData)
      }
    }

    function updateOldData (data:TreeData) {
      // goes throu all the tree and updates old data
      for (let oldData of databaseData) {
        if (oldData.id === data.permission.id) {
          oldData = data.permission
          break
        }
      }

      for (const child of data.children) {
        updateOldData(child)
      }
    }

    function logData () {
      console.log(permissionsTreeData)
    }

    async function deleteData (data: TreeData) : Promise<[string, string, string] > {
      if (data.parent === undefined) {
        return ['error',
          'Error',
          'This cannot be deleted']
      }
      //
      // delete check needs to be added here, by sending a get http request for this object
      // const response = await http.get('http://blog.test/api/permission')
      // curently this delets it in the browser but cant edit it in database
      const test = data.parent?.children.indexOf(data)
      // eslint-disable-next-line no-unused-expressions
      data.parent?.children.splice(test, 1)
      startPreorder()
      return ['success',
        'Success',
        'Object has been deleted successfuly']
    }

    function startPreorder () {
      if (preorderNumber !== 1) {
        preorderNumber = 1
      }
      givePreorderNumbers(permissionsTreeData)
    }

    function givePreorderNumbers (data:TreeData) {
      data.permission.lft = preorderNumber
      preorderNumber++
      for (const childData of data.children) {
        givePreorderNumbers(childData)
      }
      data.permission.rgt = preorderNumber
      preorderNumber++
    }

    function showDelete (data:TreeData) {
      if (data.parent === undefined || data.children.length > 0) {
        return false
      } else {
        return true
      }
    }

    return {
      permissionsTreeData,
      treeOrientation,
      addChild,
      show,
      logData,
      deleteData,
      index,
      databaseData,
      startPreorder,
      rename,
      save,
      newDatabaseData,
      showDelete
    }
  },
  async mounted () {
    this.start()
  },
  methods: {
    // ovo je funkcija za početak da se popuni permissionsTreeData objekt koji je ujedino i stablo

    async start () {
      const response = await http.get('http://blog.test/api/permission')
      if (this.permissionsTreeData.children.length > 0) {
        this.permissionsTreeData.children.splice(0)
      }
      this.init(response)
      console.log(response)
    },

    init (response: any) {
      console.log('WADUHEK!!')
      const temp = JSON.parse(JSON.stringify(response.data))

      if (this.databaseData.length > 0) {
        this.databaseData.splice(0)
      }
      for (const all of temp) {
        this.databaseData.push(all)
      }

      const treeObjects: TreeData[] = []
      treeObjects.push(this.permissionsTreeData)
      for (const perm of this.databaseData) {
        // this is for the first element so it seets it as root
        if (this.databaseData.indexOf(perm) === 0) {
          this.permissionsTreeData.some_id = perm.id
          this.permissionsTreeData.label = perm.name
          this.permissionsTreeData.permission = perm
          // eslint-disable-next-line brace-style
        }
        // this is for the rest
        else {
          const newTreeData: TreeData = {
            label: perm.name,
            expand: false,
            some_id: perm.id,
            newChildName: '',
            rename: '',
            permission: perm,
            children: []
          }

          for (const data of treeObjects) {
            if (data.some_id === perm.parent_id) {
              newTreeData.parent = data
              data.children.push(newTreeData)
              treeObjects.push(newTreeData)
              // console.log(treeObjects)
            }
          }
        }
      }
    },

    addChildButton (data: TreeData) {
      this.flashMessage(this.addChild(data))
    },
    renameButton (data:TreeData) {
      this.flashMessage(this.rename(data))
    },
    async saveButton () {
      this.flashMessage(['info', 'Waiting', 'Waiting for response from server'])
      this.flashMessage(await this.save())
      this.start()
    },
    async deleteDataButton (data: TreeData) {
      this.flashMessage(['info', 'Waiting', 'Checking if this data is used somewhere else'])
      this.flashMessage(await this.deleteData(data))
    },

    flashMessage (text: [string, string, string]) {
      this.$flashMessage.show({
        type: text[0],
        title: text[1],
        text: text[2],
        time: 3000
      })
    }
  }
})
</script>
