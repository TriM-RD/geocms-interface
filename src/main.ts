import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import VueBlocksTree from 'vue3-blocks-tree'
import 'vue3-blocks-tree/dist/vue3-blocks-tree.css'
import Toast, { PluginOptions, POSITION, TYPE } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import InputComponent from '@/components/formComponents/InputComponent.vue'
import SubmitButtonComponent from '@/components/formComponents/SubmitButtonComponent.vue'
import RowComponent from '@/components/RowComponent.vue'
import TextAreaComponent from '@/components/formComponents/TextAreaComponent.vue'
import AlertComponent from '@/components/formComponents/AlertComponent.vue'
import CheckBoxComponent from '@/components/formComponents/CheckBoxComponent.vue'
import DataListComponent from '@/components/formComponents/DataListComponent.vue'
import SelectListComponent from '@/components/formComponents/SelectListComponent.vue'
import RadioComponent from '@/components/formComponents/RadioComponent.vue'
import ColumnComponent from '@/components/ColumnComponent.vue'
import ECabinetColumnComponent from '@/components/ECabinetColumnComponent.vue'
import ECabinetRowComponent from '@/components/ECabinetRowComponent.vue'
import ColumnButtonComponent from '@/components/ColumnButtonComponent.vue'
import FieldButtonComponent from '@/components/FieldButtonComponent.vue'
import SelectButtonComponent from '@/components/SelectButtonComponent.vue'
import ListRowComponent from '@/components/ListRowComponent.vue'
import ModalFormComponent from '@/components/ModalFormComponent.vue'
import MapPickerComponent from '@/components/MapPickerComponent.vue'
import FieldCodeComponent from '@/components/FieldCodeComponent.vue'
import DataSelectComponent from '@/components/DataSelectComponent.vue'
import { RegionEnum, RegionType, ObjectType, ObjectTypeEnum } from '@/interface'

const defaultOptions = { treeName: 'blocks-tree' }

ObjectType.ObjectTypes[ObjectTypeEnum.Field](() => InputComponent)
console.log(ObjectType.ObjectTypes[ObjectTypeEnum.Field])
ObjectType.ObjectTypes[ObjectTypeEnum.Button](() => SubmitButtonComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.Row](() => RowComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.Text](() => TextAreaComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.Alert](() => AlertComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.CheckBox](() => CheckBoxComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.DataList](() => DataListComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.SelectList](() => SelectListComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.Radio](() => RadioComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.Column](() => ColumnComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.ECabinetColumn](() => ECabinetColumnComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.ECabinetRow](() => ECabinetRowComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.ColumnButton](() => ColumnButtonComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.FieldButton](() => FieldButtonComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.SelectButton](() => SelectButtonComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.ListRow](() => ListRowComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.ModalForm](() => ModalFormComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.MapPicker](() => MapPickerComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.FieldCode](() => FieldCodeComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.DataSelect](() => DataSelectComponent)
console.log(RegionType.RegionTypes[RegionEnum.Footer].ObjectTypes[ObjectTypeEnum.Button].GetVueComponent)
console.log(RegionType.RegionTypes[RegionEnum.Footer].ObjectTypes[ObjectTypeEnum.Button].GetVueComponent)
console.log(RegionType.RegionTypes[RegionEnum.Footer].ObjectTypes[ObjectTypeEnum.Button].GetVueComponent())

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

createApp(App)
  .use(store)
  .use(router)
  .use(VueBlocksTree, defaultOptions)
  .use(Toast, options)
  .mount('#app')
