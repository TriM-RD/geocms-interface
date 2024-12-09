import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import VueBlocksTree from 'vue3-blocks-tree'
import 'vue3-blocks-tree/dist/vue3-blocks-tree.css'
import Toast, { PluginOptions, POSITION, TYPE } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import { LabelComponent, FieldComponent, ButtonComponent, AlertComponent, CheckBoxComponent, DataListComponent, SelectListComponent, RadioComponent } from '@/@cybertale/form'
import RowComponent from '@/components/RowComponent.vue'
import ColumnComponent from '@/components/ColumnComponent.vue'
import ECabinetColumnComponent from '@/components/ECabinetColumnComponent.vue'
import ECabinetRowComponent from '@/components/ECabinetRowComponent.vue'
import ColumnButtonComponent from '@/components/ColumnButtonComponent.vue'
import ModalFormComponent from '@/components/ModalFormComponent.vue'
import MapPickerComponent from '@/components/MapPickerComponent.vue'
import { ObjectType, ObjectTypeEnum } from '@cybertale/interface'
import { UppyComponent } from '@/@geocms'
import InputGroupComponent from '@/components/InputGroupComponent.vue'

const defaultOptions = { nodeName: 'node-tree', treeName: 'blocks-tree' }
ObjectType.ObjectTypes[ObjectTypeEnum.Field](() => FieldComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.Button](() => ButtonComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.Row](() => RowComponent)
// ObjectType.ObjectTypes[ObjectTypeEnum.Text](() => TextAreaComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.Alert](() => AlertComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.CheckBox](() => CheckBoxComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.DataList](() => DataListComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.SelectList](() => SelectListComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.Radio](() => RadioComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.Column](() => ColumnComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.ECabinetColumn](() => ECabinetColumnComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.ECabinetRow](() => ECabinetRowComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.OutputGroup](() => ColumnButtonComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.InputGroup](() => InputGroupComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.ModalForm](() => ModalFormComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.MapPicker](() => MapPickerComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.UploadFile](() => UppyComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.Label](() => LabelComponent)

const options: PluginOptions = {
  position: POSITION.TOP_RIGHT,
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: true,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
  filterBeforeCreate: (toast, toasts) => {
    if (toasts.filter(
        t => t.type === TYPE.INFO
    ).length !== 0) {
      // Returning false discards the toast
      return false
    }
    // You can modify the toast if you want
    return toast
  }
}
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueBlocksTree, defaultOptions)
app.use(Toast, options)

app.mount('#app')
