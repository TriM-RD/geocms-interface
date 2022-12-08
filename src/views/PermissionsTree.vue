<template>
  <!--
  <h1>Basic</h1>
  <button @click="logData"> log permissionsTreeData</button>
  <div>
    <blocks-tree :data="permissionsTreeData" :horizontal="treeOrientation=='1'"  :collapsable="true" ></blocks-tree>
  </div>
  -->
  <!--FlashMessage position="right top" strategy="single" /-->
  <button class="btn btn-primary btn-lg " @click="saveButton">Save changes</button>
  <h1>Current tree</h1>
  <div>
    <blocks-tree   @node-click="show" :data="permissionsTreeData" :horizontal="treeOrientation=='1'" :collapsable="true" :props="{
        label: 'label', expand: 'expand', children: 'children',  key:'some_id', permission: 'permission'}">
      <template class="test"  #node="{data}" >
        <div class="container justify-content-center">
            <div class="row" >
              <label >
                  {{data.permission.lft}} {{data.label}} {{data.permission.rgt}}
              </label>
            </div>
            <div class="row" v-show="data.expand">
              <label  >Rename:
                <input class="m-1"  type="text" v-model="data.rename" style="width: 100px"/>
                <button type="button" class="btn btn-primary m-1"  @click="renameButton(data)" > Rename</button>
              </label>
            </div>
            <div class="row" v-show="data.expand">
              <label  >Child name:
                <input class="m-1"  type="text" v-model="data.newChildName" style="width: 100px"/>
                <button type="button" class="btn btn-primary m-1"  @click="addChildButton(data)" > Add child</button>
              </label>
            </div>
            <div class="row" v-show="data.expand">
                <button v-show="showDelete(data)" type="button" class="btn btn-danger m-1"  @click="deleteData(data)" > Delete this</button>
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
import { reactive, ref } from 'vue'
import permission, { TreeData } from '@/components/tree/Permission'
import http from '@/http-common'
import { v4 as uuidv4 } from 'uuid'
import { Vue } from 'vue-class-component'
export default class PermissionsTree extends Vue {
  index = uuidv4()
  preorderNumber = 0
  treeOrientation = ref('0')
  permissionsTreeData = reactive <TreeData>(
    {
      label: 'root',
      expand: true,
      some_id: this.index,
      newChildName: '',
      rename: '',
      permission: {
        id: this.index,
        name: 'string',
        lft: 4,
        rgt: 5
      },
      children: []
    }
  )

  databaseData = reactive<permission[]>([])
  newDatabaseData = reactive<permission[]>([])

  addChild (data: TreeData):[string, string, string] {
    if (data.newChildName === '') {
      return ['error',
        'Child error',
        'Child name input field cannot be empty'
      ]
    }
    const newChild = this.newPermission(data)

    data.newChildName = ''
    data.children.push(newChild)
    this.startPreorder()
    return ['success',
      'Child added successfuly',
      `Child " ${newChild.label} " successfuly added to " ${data.label} "`
    ]
  }

  newPermission (data: TreeData):TreeData {
    this.index = uuidv4()
    return {
      label: data.newChildName,
      expand: false,
      some_id: this.index,
      newChildName: '',
      rename: '',
      permission: {
        id: this.index,
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

  show (e : any, data : any) : void {
    if (e.target.tagName.toLowerCase() === 'div' || (e.target.tagName.toLowerCase() === 'label' && !data.expand)) {
      data.expand = !data.expand
    }
  }

  rename (data:TreeData) :[string, string, string] {
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

  async save () : Promise<[string, string, string]> {
    this.newDatabaseData.length = 0
    this.addToNewDatabseData(this.permissionsTreeData)
    console.log('old data')
    console.log(this.databaseData)
    this.updateOldData(this.permissionsTreeData)
    console.log('old data but edited')
    console.log(this.databaseData)
    console.log('new data')
    console.log(this.newDatabaseData)

    // sending to  backend oldDataForDeletion i newDatabaseData
    // edit old
    http.post('http://blog.test/api/editAll/permission', this.databaseData)
      .then(response => console.log(response))

    await new Promise(resolve => setTimeout(resolve, 500))

    return http.post('http://blog.test/api/permission', this.newDatabaseData)
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

  delay (time:number) : Promise<any> {
    return new Promise(resolve => setTimeout(resolve, time))
  }

  addToNewDatabseData (data:TreeData) : void {
    let isInOld = false
    // goes throu all the tree and checks if there are new children and then places them into newDatabaseData
    for (const oldData of this.databaseData) {
      if (oldData.id === data.permission.id) {
        isInOld = true
        break
      }
    }

    if (!isInOld) {
      this.newDatabaseData.push(data.permission)
    }

    for (const childData of data.children) {
      this.addToNewDatabseData(childData)
    }
  }

  updateOldData (data:TreeData) : void {
    // goes throu all the tree and updates old data
    for (let oldData of this.databaseData) {
      if (oldData.id === data.permission.id) {
        oldData = data.permission
        break
      }
    }

    for (const child of data.children) {
      this.updateOldData(child)
    }
  }

  logData () {
    console.log(this.permissionsTreeData)
  }

  async deleteData (data: TreeData) {
    if (data.parent === undefined) {
      return ['error',
        'Error',
        'This cannot be deleted']
    }
    //
    // delete check needs to be added here, by sending a get http request for this object
    // const response = await http.get('http://blog.test/api/permission')
    // curently this delets it in the browser but cant edit it in database
    console.log('this is the delete shit')
    const deleteTest = await http.post('http://blog.test/api/deleteCheck/permission', data.permission)
      .then(response => { return response.data })
      .catch((error) => console.log(error))

    console.log(deleteTest)

    // if delete is false its gona delete the data
    if (!deleteTest) {
      // needs a popup here to confirm deletion
      const test = data.parent?.children.indexOf(data)
      // eslint-disable-next-line no-unused-expressions
      data.parent?.children.splice(test, 1)
      this.startPreorder()
    } else {
      // might need a popup or something here that returns message
      console.log('it exists')
    }
  }

  startPreorder () : void {
    if (this.preorderNumber !== 1) {
      this.preorderNumber = 1
    }
    this.givePreorderNumbers(this.permissionsTreeData)
  }

  givePreorderNumbers (data:TreeData) : void {
    data.permission.lft = this.preorderNumber
    this.preorderNumber++
    for (const childData of data.children) {
      this.givePreorderNumbers(childData)
    }
    data.permission.rgt = this.preorderNumber
    this.preorderNumber++
  }

  showDelete (data:TreeData) : boolean {
    return !(data.parent === undefined || data.children.length > 0)
  }

  async mounted () {
    this.start()
  }

  async start () : Promise<void> {
    const response = await http.get('http://blog.test/api/permission')
    if (this.permissionsTreeData.children.length > 0) {
      this.permissionsTreeData.children.splice(0)
    }
    this.init(response)
    console.log(response)
  }

  init (response: any) : void {
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
  }

  addChildButton (data: TreeData) : void {
    // this.flashMessage(this.addChild(data))
    this.addChild(data)
  }

  renameButton (data:TreeData) : void {
    // this.flashMessage(this.rename(data))
    this.rename(data)
  }

  async saveButton () : Promise<void> {
    /* this.flashMessage(['info', 'Waiting', 'Waiting for response from server'])
    this.flashMessage(await this.save()) */
    await this.save()
    await this.start()
  }

  async deleteDataButton (data: TreeData) : Promise<void> {
    /* this.flashMessage(['info', 'Waiting', 'Checking if this data is used somewhere else'])
    this.flashMessage(await this.deleteData(data)) */
    await this.deleteData(data)
  }

  flashMessage (text: [string, string, string]) {
    /* this.$flashMessage.show({
      type: text[0],
      title: text[1],
      text: text[2],
      time: 3000
    }) */
  }
}

</script>
