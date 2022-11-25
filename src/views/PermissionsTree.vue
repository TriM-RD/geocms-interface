<template>
  <!--
  <h1>Basic</h1>
  <button @click="logData"> log permissionsTreeData</button>
  <div>
    <blocks-tree :data="permissionsTreeData" :horizontal="treeOrientation=='1'"  :collapsable="true" ></blocks-tree>
  </div>
  -->
  <button class="btn btn-primary btn-lg " @click="save">Save changes</button>
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
                <button type="button" class="btn btn-primary m-1"  @click="rename(data)" > Rename</button>
              </label>
            </div>
            <div class="col" v-show="data.expand">
              <label class="col" >Child name:
                <input class="m-1"  type="text" v-model="data.newChildName" style="width: 100px"/>
                <button type="button" class="btn btn-primary m-1"  @click="addChildButton(data)" > Add child</button>
              </label>
            </div>
            <div class="col" v-show="data.expand">
                <button v-if="data.parent !== undefined" type="button" class="btn btn-danger m-1"  @click="deleteData(data)" > Delete this</button>
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
// eslint-disable-next-line import/no-duplicates
import Permission from '@/components/tree/Permission'
import Tree from '@/views/Tree.vue'
import { index } from 'd3'

export default defineComponent({
  name: 'PermissionsTree',
  setup: function () {
    const selected = ref([])
    let index = '50'
    let preorderNumber = 0
    const dragData = ref()
    const treeOrientation = ref('0')
    const permissionsTreeData = reactive <TreeData>(
      {
        label: 'root',
        expand: true,
        some_id: '0',
        newChildName: '',
        rename: '',
        permission: {
          id: '0',
          title: 'string',
          lft: 4,
          rgt: 5
        },
        children: []
      }
    )

    const databaseData = reactive <permission[]>([
      {
        id: '1',
        title: 'root',
        // eslint-disable-next-line camelcase
        lft: 1,
        rgt: 1
      },
      {
        id: '2',
        title: 'b',
        // eslint-disable-next-line camelcase
        parent_id: '1',
        lft: 1,
        rgt: 1
      },
      {
        id: '3',
        title: 'c',
        // eslint-disable-next-line camelcase
        parent_id: '2',
        lft: 1,
        rgt: 1
      },
      {
        id: '4',
        title: 'd',
        // eslint-disable-next-line camelcase
        parent_id: '2',
        lft: 1,
        rgt: 1
      },
      {
        id: '5',
        title: 'e',
        // eslint-disable-next-line camelcase
        parent_id: '1',
        lft: 1,
        rgt: 1
      },
      {
        id: '6',
        title: 'e',
        // eslint-disable-next-line camelcase
        parent_id: '5',
        lft: 1,
        rgt: 1
      }

    ])

    function addChildButton (data: TreeData):void{
      if (data.newChildName === '') {
        return
      }
      index = (parseInt(index) + 1).toString()
      const newPermission: TreeData = {
        label: data.newChildName,
        expand: false,
        some_id: index,
        newChildName: '',
        rename: '',
        permission: {
          id: index,
          title: data.newChildName,
          // eslint-disable-next-line camelcase
          parent_id: '20',
          lft: 4,
          rgt: 6
        },
        parent: data,
        children: []
      }
      data.newChildName = ''
      data.children.push(newPermission)
      startPreorder()
    }

    function show (e : any, data : any) {
      if (e.target.tagName.toLowerCase() === 'div' || (e.target.tagName.toLowerCase() === 'label' && !data.expand)) {
        data.expand = !data.expand
      }
    }
    function rename (data:TreeData) {
      if (data.rename === '') { return }
      data.label = data.rename
      data.rename = ''
    }

    function save (event:any) {
      alert('hello this is the save function thats not working yet')
      alert(event.target.tagName)
    }

    function logData () {
      console.log(permissionsTreeData)
    }

    function deleteData (data:TreeData) {
      if (data.parent === undefined) { return }
      const test = data.parent?.children.indexOf(data)
      // eslint-disable-next-line no-unused-expressions
      data.parent?.children.splice(test, 1)
    }

    function takeData (data:TreeData) {
      return data
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

    return {
      permissionsTreeData,
      selected,
      treeOrientation,
      addChildButton,
      show,
      logData,
      deleteData,
      index,
      databaseData,
      dragData,
      startPreorder,
      rename,
      save
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      // no brain aproach
      const treeObjects: TreeData[] = []
      treeObjects.push(this.permissionsTreeData)
      for (const perm of this.databaseData) {
        // this is for the first element so it seets it as root
        if (this.databaseData.indexOf(perm) === 0) {
          this.permissionsTreeData.some_id = perm.id
          this.permissionsTreeData.label = perm.title
          this.permissionsTreeData.permission = perm
          // eslint-disable-next-line brace-style
        }
        // this is for the rest
        else {
          const newTreeData: TreeData = {
            label: perm.title,
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

      this.startPreorder()
    }
  }
})
</script>
