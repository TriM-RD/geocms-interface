import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import { ObjectType, ObjectTypeEnum } from '@cybertale/interface'
import InputGroupComponent from '@/components/InputGroupComponent.vue'
import { FieldComponent, AlertComponent, ButtonComponent, CheckBoxComponent, DataListComponent, SelectListComponent, RadioComponent, LabelComponent } from '@/@cybertale/form'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import MultiMediaComponent from '@/components/MultiMediaComponent.vue'
// import GalleryComponent from '@/components/GalleryComponent.vue'
import RowComponent from '@/components/RowComponent.vue'
import ColumnComponent from '@/components/ColumnComponent.vue'
import ContentPartGroupComponent from '@/components/ContentPartGroupComponent.vue'
import ListItemComponent from '@/components/ListItemComponent.vue'
import ModalBookComponent from '@/components/ModalBookComponent.vue'
import './assets/styles/index.css'
import BookingRowComponent from '@/components/BookingRowComponent.vue'
import { VueReCaptcha } from 'vue-recaptcha-v3'
ObjectType.ObjectTypes[ObjectTypeEnum.Field](() => FieldComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.Alert](() => AlertComponent)
//ObjectType.ObjectTypes[ObjectTypeEnum.Text](() => TextAreaComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.Button](() => ButtonComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.ListItem](() => ListItemComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.CheckBox](() => CheckBoxComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.DataList](() => DataListComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.SelectList](() => SelectListComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.Radio](() => RadioComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.InputGroup](() => InputGroupComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.Label](() => LabelComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.MultiMedia](() => MultiMediaComponent)
//ObjectType.ObjectTypes[ObjectTypeEnum.Row](() => RowComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.Column](() => ColumnComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.Row](() => RowComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.ColumnGroup](() => ContentPartGroupComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.ECabinetColumn](() => ModalBookComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.ECabinetRow](() => BookingRowComponent) //TODO Josipe prepravi da se ne koristi ECabinetRow

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueReCaptcha, {
  siteKey: '6LfW7mMqAAAAAF-WEIB3GY3NO777ZgawckUq192T' // Replace with your actual site key
})

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: 'none'
    }
  },
  locale: {
    firstDayOfWeek: 1
  }
})

app.mount('#app')
