<template>
  <h1>Basic</h1>
  <button @click="logData"> log permissionsTreeData</button>
  <div>
    <blocks-tree :data="permissionsTreeData" :horizontal="treeOrientation=='1'"  :collapsable="true" ></blocks-tree>
  </div>

  <h1>With slots</h1>
  <div>
    <blocks-tree :data="permissionsTreeData" :horizontal="treeOrientation=='1'" :collapsable="true" :props="{
        label: 'label', expand: 'expand', children: 'children',  key:'some_id', permission: 'permission'}">
      <template  #node="{data}" ><!-- ",context" ovo je bilo next to data !-->
          <div >
          <div @click="show(data)" >
            {{data.label}}
          </div>

              <span v-if="data.expand">
                <p>Child name:
                <input type="text" v-model="data.newChildName" style="width: 100px"/>
                </p>
                <button @click="addChildButton(data, data.newChildName)" > Add child</button>

                <p></p>
                <button @click="deleteData(data)" > Delete this</button>
              </span>
          <!--<span v-if="data.children && data.children.length">
                  <a href="#" @click="context.toggleExpand">toggle expand</a>
              </span>!-->
          </div>
      </template>
    </blocks-tree>
    <div>
      Selected: {{selected}}
    </div>
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
    let index = 50
    const treeOrientation = ref('0')
    const permissionsTreeData = reactive <TreeData>(
      {
        label: 'root',
        expand: true,
        some_id: 0,
        newChildName: '',
        permission: {
          id: 0,
          title: 'string',
          lft: 4,
          rgt: 5
        },
        children: []
      }
    )

    const databaseData = reactive <permission[]>([
      {
        id: 1,
        title: 'a',
        // eslint-disable-next-line camelcase
        lft: 1,
        rgt: 1
      },
      {
        id: 2,
        title: 'b',
        // eslint-disable-next-line camelcase
        parent_id: 1,
        lft: 1,
        rgt: 1
      },
      {
        id: 3,
        title: 'c',
        // eslint-disable-next-line camelcase
        parent_id: 2,
        lft: 1,
        rgt: 1
      },
      {
        id: 4,
        title: 'd',
        // eslint-disable-next-line camelcase
        parent_id: 2,
        lft: 1,
        rgt: 1
      },
      {
        id: 5,
        title: 'e',
        // eslint-disable-next-line camelcase
        parent_id: 1,
        lft: 1,
        rgt: 1
      },
      {
        id: 6,
        title: 'e',
        // eslint-disable-next-line camelcase
        parent_id: 5,
        lft: 1,
        rgt: 1
      }

    ])

    function addChildButton (data: TreeData):void{
      if (data.newChildName === '') {
        return
      }
      index = index + 1
      const newPermission: TreeData = {
        label: data.newChildName,
        expand: false,
        some_id: index,
        newChildName: '',
        permission: {
          id: index,
          title: data.newChildName,
          // eslint-disable-next-line camelcase
          parent_id: 20,
          lft: 4,
          rgt: 6
        },
        parent: data,
        children: []
      }
      data.newChildName = ''
      data.children.push(newPermission)
    }

    function show (data:TreeData) {
      data.expand = !data.expand
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

    return {
      permissionsTreeData,
      selected,
      treeOrientation,
      addChildButton,
      show,
      logData,
      deleteData,
      index,
      databaseData
    }
  },
  mounted () {
    console.log('mounted')
    console.log(this.permissionsTreeData)
    // this.addChild(this.permissions, this.permissions[2])
    // this.addChild(this.permissions, this.permissions[1])
    console.log(this.permissionsTreeData)
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

        /* brain aproach
      let treeD:TreeData = this.permissionsTreeData
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
            expand: true,
            some_id: perm.id,
            permission: perm,
            children: []
          }
          // if treeD id is the same as parent id of curent object add child else search for id
          if (treeD.some_id === perm.parent_id) {
            newTreeData.parent = treeD
            treeD.children.push(newTreeData)
            treeD = treeD.children[treeD.children.indexOf((newTreeData))]
            console.log(treeD)
          } else {
            const test = this.findParent(treeD, perm.parent_id)
            console.log('find parent', test)
            treeD.children.push(newTreeData)
            treeD = treeD.children[treeD.children.indexOf((newTreeData))]
          }
          console.log('permissions', this.permissionsTreeData)
        }
        */
      }
      /*
    findParent (currentNode:any, id:any):TreeData {
      if (currentNode.children !== undefined) {
        for (const child of currentNode.children) {
          if (child.some_id === id) {
            console.log('its here', child)
            return child
          }
        }
      }
      return this.findParent(currentNode.parent, id)
    }

  }
  */
    }
  }
})
</script>
