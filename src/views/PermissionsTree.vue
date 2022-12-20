<template>
  <button class="btn btn-primary btn-lg " @click="saveButton">Save changes</button>

  <h1>Current tree</h1>
  <div>
    <blocks-tree   @node-click="show"  :data="permissionsTreeData" :horizontal="treeOrientation=='1'" :collapsable="false" :props="{
        label: 'label', expand: 'expand', children: 'children',  key:'some_id', permission: 'permission'}">
      <template class="test"  #node="{data}">
        <div class="container justify-content-center">
          <div class="row">
              <label  style=" padding-bottom: 10px">
                   {{data.label}}
              </label>
          </div>
          <div v-show="data.expand" class="input-group mb-3" style="width: 280px" >
            <div class="input-group-prepend">
              <span class="input-group-text" id="inputGroup-sizing-default" >Rename</span>
            </div>
            <input type="text" class="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default" v-model="data.rename" style="width: 100px">
            <div class="input-group-append">
              <button class="btn btn-outline-secondary" @click="rename(data)" type="button" id="inputGroup-sizing-default" >Rename</button>
            </div>
          </div>
          <div v-show="data.expand" class="input-group mb-3" style="width: 280px" >
            <div class="input-group-prepend">
              <span class="input-group-text" id="inputGroup-sizing-default" >Child name</span>
            </div>
            <input type="text" class="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default" v-model="data.newChildName" style="width: 100px">
            <div class="input-group-append">
              <button class="btn btn-outline-secondary" type="button" id="inputGroup-sizing-default" @click="addChild(data)" >Create</button>
            </div>
          </div>
            <div  v-show="data.expand">
                <button  v-show="showDelete(data)" style="width: 100px" type="button" data-bs-toggle="modal" data-bs-target="#delete-modal" class="btn btn-danger m-1"  @click="deleteDataCheck(data)" > Delete this</button>

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

  <ToastComponent id="tComponent"  title="a" message="aa" :custom-class="customClass"></ToastComponent>

</template>

<script lang="ts" >
import { reactive, ref } from 'vue'
import permission, { TreeData } from '@/components/tree/Permission'
import http from '@/http-common'
import { v4 as uuidv4 } from 'uuid'
import { Options, Vue } from 'vue-class-component'
import ToastComponent from '@/components/ToastComponent.vue'
import * as bootstrap from 'bootstrap'
@Options({
  components: {
    ToastComponent
  }
})

export default class PermissionsTree extends Vue {
  index = uuidv4()
  preorderNumber = 0
  treeOrientation = ref('0')
  permissionsTreeData = reactive <TreeData>(
    {
      label: 'root',
      expand: false,
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
  change = false

  // unsuccesfull toast stuff
  toastTrigger:any
  toastLiveExample:any
  tComponent:any
  toastOptions = reactive({
    title: '',
    message: ''
  })
  //

  // creats a new child in the tree but does  not sent it to the database
  addChild (data: TreeData) {
    if (data.newChildName === '') {
      this.toast('Error', 'Cant do this')
      return
    }
    this.change = true
    const newChild = this.newPermission(data)

    data.newChildName = ''
    data.children.push(newChild)
    this.startPreorder()
    this.toast('Successfuly addad child', `Child " ${newChild.label} " successfuly added to " ${data.label} "`)
  }

  // used ti create the new child in tree
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

  // i think this is related to pressing parts of the tree for them to open
  show (e : any, data : any) : void {
    if (e.target.tagName.toLowerCase() === 'div' || (e.target.tagName.toLowerCase() === 'label' && !data.expand)) {
      console.log('first if')
      data.expand = !data.expand
    } else if (e.target.tagName.toLowerCase() === 'label' && data.expand) {
      console.log('second if')
      data.expand = !data.expand
    }
  }

  // renames a tree component BUT does not edit it in database
  rename (data:TreeData) {
    if (data.rename === '') {
      this.toast('Error', 'New name cannot be empty')
      return
    }
    this.change = true
    const temp = data.label
    data.label = data.rename
    data.permission.name = data.rename
    data.rename = ''

    this.toast('Success', `Renamed " ${temp} " to " ${data.label} "`)
  }

  // Saves all changes made to the tree
  async save () {
    this.newDatabaseData.length = 0
    this.addToNewDatabseData(this.permissionsTreeData)
    console.log('old data')
    console.log(this.databaseData)
    this.updateOldData(this.permissionsTreeData)
    console.log('old data but edited')
    console.log(this.databaseData)
    console.log('new data')
    console.log(this.newDatabaseData)

    // sending to  backend  newDatabaseData
    // edit old
    this.editExistingOnServer()
    await new Promise(resolve => setTimeout(resolve, 500))

    // saving new data
    this.saveNewToServer()

    this.change = false
  }

  editExistingOnServer () {
    http.post('http://blog.test/api/editAll/permission', this.databaseData)
      .then(response => {
        console.log(response)
        if (response.status === 200) {
          this.toast('Success', 'Edited old data successfuly')
        } else {
          this.toast('Error', 'Something went wrong during editing')
        }
      })
      .catch((error) => {
        console.log(error)
        this.toast('Error', 'Something went wrong during editing')
      })
  }

  saveNewToServer () {
    http.post('http://blog.test/api/permission', this.newDatabaseData)
      .then(response => {
        console.log(response)
        if (response.status === 200) {
          this.toast('Success', 'Saved new data successfuly')
        } else {
          this.toast('Error', 'Something went wrong during saving')
        }
      })
      .catch((error) => {
        console.log(error)
        this.toast('Error', 'Something went wrong during saving')
      })
  }

  // checks for new data in the tree and edits the arrays for them
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

  deleteCheckData =reactive<TreeData>({
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
  })

  exists = true

  // funcion in popup that deletes permision in database
  async deleteData () {
    console.log('Deletion')
    console.log(this.deleteCheckData)
    this.deleteOnServer()
    this.deleteLocal()
    this.startPreorder()
    this.updateOldData(this.permissionsTreeData)
    http.post('http://blog.test/api/editAll/permission', this.databaseData)
      .then(response => console.log(response))
  }

  async deleteOnServer () {
    const deleteTest = await http.post('http://blog.test/api/delete/permission', this.deleteCheckData.permission)
      .then(response => {
        console.log(response)
        if (response.status === 200) {
          this.toast('Success', 'Delete was successful')
        } else {
          this.toast('Error', 'Something went wrong during deleting')
        }
        return response.data
      })
      .catch((error) => {
        console.log(error)
        this.toast('Error', 'Something went wrong during deleting')
      })

    console.log(deleteTest)
  }

  deleteLocal () {
    const test = this.deleteCheckData.parent?.children.indexOf(this.deleteCheckData)
    // eslint-disable-next-line no-unused-expressions
    if (test !== undefined) { this.deleteCheckData.parent?.children.splice(test, 1) }
    console.log('object thtats being deleted in database')

    const temp = this.databaseData.find(item => item.id === this.deleteCheckData.permission.id)
    if (temp !== undefined) {
      this.databaseData.splice(this.databaseData.indexOf(temp), 1)
    }

    console.log(this.databaseData.indexOf(this.deleteCheckData.permission))
    if (this.databaseData.indexOf(this.deleteCheckData.permission) !== -1) {
      this.databaseData.splice(this.databaseData.indexOf(this.deleteCheckData.permission), 1)
    }
    console.log(this.databaseData)
  }

  // this function only checks if the data can be deleted and sets the proper true or false statment
  async deleteDataCheck (data: TreeData) {
    if (data.parent === undefined) {
      this.toast('Error', 'Cant delete this')
      return
    }
    //
    this.deleteCheckData = data
    const deleteCheckResponse = await http.post('http://blog.test/api/deleteCheck/permission', data.permission)
      .then(response => { return response.data })
      .catch((error) => console.log(error))

    console.log(deleteCheckResponse)

    this.deleteDataAlert(deleteCheckResponse)
  }

  deleteDataAlert (deleteCheckResponse:boolean) {
    // if deleteResponse is false that measn it can be deleted
    // and gives alert to confirm or reject
    if (deleteCheckResponse) {
      alert('It exists in another table so it canot be deleted')
      this.toast('Error', 'Cant delete this, it exists in another table')
    } else {
      const del = confirm(`Do u wona delete ${this.deleteCheckData.label}?`)
      if (del) {
        this.deleteData()
      }
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

  // only for showing the delete button
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

    this.toastTrigger = document.getElementById('liveToastBtn')
    this.toastLiveExample = document.getElementById('liveToast')
    this.tComponent = document.getElementById('tComponent')
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

  toast (title:string, message:string) {
    this.tComponent.title = title
    this.tComponent.message = message
    console.log(this.tComponent.title)
    console.log(title, message)

    const toast = new bootstrap.Toast(this.toastLiveExample)
    toast.show()
  }

  async saveButton () {
    /* this.flashMessage(['info', 'Waiting', 'Waiting for response from server'])
    this.flashMessage(await this.save()) */
    await this.save()
    await this.start()
  }

  attemptToGoBack () {
    console.log('it got unmunted')
    window.alert()
  }

  beforeUnmount () {
    console.log('beforeUnmount')
    window.addEventListener('beforeunload', event => {
      console.log('FUCKING ULOAD ALREDY!!!')
      alert('BRUWWWWW')
      event.returnValue = 'Are you sure you want to leave?'
    })
    this.hell()
  }

  hell () {
    console.log('beforeUnmount')
    if (this.change) {
      const saveChanges = confirm('There are unsaved changes. Do you want to save them?')
      console.log(saveChanges)
      if (saveChanges) {
        this.save()
      }
    }
  }

  protected beforeRouteLeave (to:any, from:any, next:any) {
    console.log('EYYYYYYYYYY')
    // called before the route that renders this component is navigated away from
  }
}
</script>
