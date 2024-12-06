<template>
  <form class="container sm-container">
    <component :page-refresh="renderComponent" v-for="(_objectTemplate, key, index) in objectTemplates" :key="`${key}-${index}-${_objectTemplate.Stats[statTypeEnum.Tag].Data}`" :is="getComponent(_objectTemplate.Region, _objectTemplate.ObjectEnum)" :entity="resolveEntities(_objectTemplate)" :object="_objectTemplate"> </component>
  </form>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator'
import '@fortawesome/fontawesome-free/css/all.css'
import '/node_modules/bootstrap-icons/font/bootstrap-icons.css'
import LoadingComponent from '@/components/LoadingComponent.vue'
import { ActionTypeEnum, MechanicAbstract, ObjectTemplate, ObjectTypeEnum, RegionEnum, RegionType, StatType, StatTypeEnum, SubObjectTypeEnum } from '@cybertale/interface'
import { Manager } from '@/mechanics/modalMechanic'

@Component({
  components: {
    Loading: LoadingComponent
  }
})
export default class PaymentComponent extends Vue {
  mechanic: MechanicAbstract = new Manager.Mechanic.ModalMechanic(this.reRender.bind(this))
  renderComponent = true
  objectTemplates!: ObjectTemplate[] = []
  statTypeEnum = StatTypeEnum
  belongsTo: { [key: string]: ObjectTemplate[] } = {}
  entity!: ObjectTemplate[]

  countries = [
    { id: '1', name: 'Afghanistan' },
    { id: '2', name: 'Albania' },
    { id: '3', name: 'Algeria' },
    { id: '4', name: 'American Samoa' },
    { id: '5', name: 'Andorra' },
    { id: '6', name: 'Angola' },
    { id: '7', name: 'Anguilla' },
    { id: '8', name: 'Antarctica' },
    { id: '9', name: 'Antigua and Barbuda' },
    { id: '10', name: 'Argentina' },
    { id: '11', name: 'Armenia' },
    { id: '12', name: 'Aruba' },
    { id: '13', name: 'Australia' },
    { id: '14', name: 'Azerbaijan' },
    { id: '15', name: 'Bahamas' },
    { id: '16', name: 'Bahrain' },
    { id: '17', name: 'Bangladesh' },
    { id: '18', name: 'Barbados' },
    { id: '19', name: 'Belarus' },
    { id: '20', name: 'Belize' },
    { id: '21', name: 'Benin' },
    { id: '22', name: 'Bermuda' },
    { id: '23', name: 'Bhutan' },
    { id: '24', name: 'Bolivia, Plurinational State of' },
    { id: '25', name: 'Bonaire, Sint Eustatius and Saba' },
    { id: '26', name: 'Botswana' },
    { id: '27', name: 'Bouvet Island' },
    { id: '28', name: 'Brazil' },
    { id: '29', name: 'British Indian Ocean Territory' },
    { id: '30', name: 'Brunei Darussalam' },
    { id: '31', name: 'Bulgaria' },
    { id: '32', name: 'Burkina Faso' },
    { id: '33', name: 'Burundi' },
    { id: '34', name: 'Cabo Verde' },
    { id: '35', name: 'Cambodia' },
    { id: '36', name: 'Cameroon' },
    { id: '37', name: 'Canada' },
    { id: '38', name: 'Cayman Islands' },
    { id: '39', name: 'Central African Republic' },
    { id: '40', name: 'Chad' },
    { id: '41', name: 'Chile' },
    { id: '42', name: 'China' },
    { id: '43', name: 'Christmas Island' },
    { id: '44', name: 'Cocos (Keeling) Islands' },
    { id: '45', name: 'Colombia' },
    { id: '46', name: 'Comoros' },
    { id: '47', name: 'Congo' },
    { id: '48', name: 'Congo, the Democratic Republic of the' },
    { id: '49', name: 'Cook Islands' },
    { id: '50', name: 'Costa Rica' },
    { id: '51', name: "Cote d'Ivoire" },
    { id: '52', name: 'Cuba' },
    { id: '53', name: 'Curacao' },
    { id: '54', name: 'Cyprus' },
    { id: '55', name: 'Czech Republic' },
    { id: '56', name: 'Denmark' },
    { id: '57', name: 'Djibouti' },
    { id: '58', name: 'Dominica' },
    { id: '59', name: 'Dominican Republic' },
    { id: '60', name: 'Ecuador' },
    { id: '61', name: 'Egypt' },
    { id: '62', name: 'El Salvador' },
    { id: '63', name: 'Equatorial Guinea' },
    { id: '64', name: 'Eritrea' },
    { id: '65', name: 'Estonia' },
    { id: '66', name: 'Ethiopia' },
    { id: '67', name: 'Falkland Islands (Malvinas)' },
    { id: '68', name: 'Faroe Islands' },
    { id: '69', name: 'Fiji' },
    { id: '70', name: 'Finland' },
    { id: '71', name: 'French Guiana' },
    { id: '72', name: 'French Polynesia' },
    { id: '73', name: 'French Southern Territories' },
    { id: '74', name: 'Gabon' },
    { id: '75', name: 'Gambia' },
    { id: '76', name: 'Georgia' },
    { id: '77', name: 'Ghana' },
    { id: '78', name: 'Gibraltar' },
    { id: '79', name: 'Greece' },
    { id: '80', name: 'Greenland' },
    { id: '81', name: 'Grenada' },
    { id: '82', name: 'Guadeloupe' },
    { id: '83', name: 'Guam' },
    { id: '84', name: 'Guatemala' },
    { id: '85', name: 'Guernsey' },
    { id: '86', name: 'Guinea' },
    { id: '87', name: 'Guinea-Bissau' },
    { id: '88', name: 'Guyana' },
    { id: '89', name: 'Haiti' },
    { id: '90', name: 'Heard Island and McDonald Islands' },
    { id: '91', name: 'Holy See (Vatican City State)' },
    { id: '92', name: 'Honduras' },
    { id: '93', name: 'Hong Kong' },
    { id: '94', name: 'Iceland' },
    { id: '95', name: 'India' },
    { id: '96', name: 'Indonesia' },
    { id: '97', name: 'Iran, Islamic Republic of' },
    { id: '98', name: 'Iraq' },
    { id: '99', name: 'Ireland' },
    { id: '100', name: 'Isle of Man' },
    { id: '101', name: 'Israel' },
    { id: '102', name: 'Jamaica' },
    { id: '103', name: 'Japan' },
    { id: '104', name: 'Jersey' },
    { id: '105', name: 'Jordan' },
    { id: '106', name: 'Kazakhstan' },
    { id: '107', name: 'Kenya' },
    { id: '108', name: 'Kiribati' },
    { id: '109', name: "Korea, Democratic People's Republic of" },
    { id: '110', name: 'Korea, Republic of' },
    { id: '111', name: 'Kuwait' },
    { id: '112', name: 'Kyrgyzstan' },
    { id: '113', name: "Lao People's Democratic Republic" },
    { id: '114', name: 'Latvia' },
    { id: '115', name: 'Lebanon' },
    { id: '116', name: 'Lesotho' },
    { id: '117', name: 'Liberia' },
    { id: '118', name: 'Lithuania' },
    { id: '119', name: 'Luxembourg' },
    { id: '120', name: 'Macao' },
    { id: '121', name: 'Madagascar' },
    { id: '122', name: 'Malawi' },
    { id: '123', name: 'Malaysia' },
    { id: '124', name: 'Maldives' },
    { id: '125', name: 'Mali' },
    { id: '126', name: 'Malta' },
    { id: '127', name: 'Marshall Islands' },
    { id: '128', name: 'Martinique' },
    { id: '129', name: 'Mauritania' },
    { id: '130', name: 'Mauritius' },
    { id: '131', name: 'Mayotte' },
    { id: '132', name: 'Mexico' },
    { id: '133', name: 'Micronesia' },
    { id: '134', name: 'Moldova' },
    { id: '135', name: 'Monaco' },
    { id: '136', name: 'Mongolia' }
  ]

  reRender(): void {
    this.renderComponent = !this.renderComponent
  }

  mounted() {
    const entityTemp = [
      new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.Label, SubObjectTypeEnum.ParentObject, ActionTypeEnum.None, {
        [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Secure your spot'),
        [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('formHeader'),
        [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('fw-bold h2 text-center mb-3 mt-5'),
        [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData('formHeader')
      }),
      new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.InputGroup, SubObjectTypeEnum.ParentObject, ActionTypeEnum.None, {
        [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('inputNameGroup'),
        [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('form-control w-100'),
        [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData('inputNameGroup')
      }),
      new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.Field, SubObjectTypeEnum.Left, ActionTypeEnum.Insert, {
        [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('First Name*'),
        [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('firstNameField|'),
        [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('mb-3'),
        [StatTypeEnum.Placeholder]: StatType.StatTypes[StatTypeEnum.Placeholder]().CreateStat().InitData('Enter your first name'),
        [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(''),
        [StatTypeEnum.BelongsTo]: StatType.StatTypes[StatTypeEnum.BelongsTo]().CreateStat().InitData('inputNameGroup'),
        [StatTypeEnum.ErrorMessage]: StatType.StatTypes[StatTypeEnum.ErrorMessage]().CreateStat().InitData('Enter first name'),
        [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData('inputNameGroup')
      }),
      new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.Field, SubObjectTypeEnum.Left, ActionTypeEnum.Insert, {
        [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Last Name*'),
        [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('lastNameField|'),
        [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('mb-3'),
        [StatTypeEnum.Placeholder]: StatType.StatTypes[StatTypeEnum.Placeholder]().CreateStat().InitData('Enter your last name'),
        [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(''),
        [StatTypeEnum.BelongsTo]: StatType.StatTypes[StatTypeEnum.BelongsTo]().CreateStat().InitData('inputNameGroup'),
        [StatTypeEnum.ErrorMessage]: StatType.StatTypes[StatTypeEnum.ErrorMessage]().CreateStat().InitData('Enter last name'),
        [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData('inputNameGroup')
      }),
      new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.InputGroup, SubObjectTypeEnum.ParentObject, ActionTypeEnum.None, {
        [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('adressZipGroup'),
        [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('form-control w-100'),
        [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData('adressZipGroup')
      }),
      new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.Field, SubObjectTypeEnum.ParentObject, ActionTypeEnum.Insert, {
        [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Address'),
        [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('addressField|'),
        [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('mb-3'),
        [StatTypeEnum.Placeholder]: StatType.StatTypes[StatTypeEnum.Placeholder]().CreateStat().InitData('Enter your address'),
        [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(''),
        [StatTypeEnum.BelongsTo]: StatType.StatTypes[StatTypeEnum.BelongsTo]().CreateStat().InitData('adressZipGroup'),
        [StatTypeEnum.ErrorMessage]: StatType.StatTypes[StatTypeEnum.ErrorMessage]().CreateStat().InitData('Enter adress'),
        [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData('adressZipGroup')
      }),

      new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.Field, SubObjectTypeEnum.ParentObject, ActionTypeEnum.Insert, {
        [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('ZIP Code'),
        [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('zipCodeField|'),
        [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('mb-3'),
        [StatTypeEnum.Placeholder]: StatType.StatTypes[StatTypeEnum.Placeholder]().CreateStat().InitData('Enter ZIP code'),
        [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(''),
        [StatTypeEnum.BelongsTo]: StatType.StatTypes[StatTypeEnum.BelongsTo]().CreateStat().InitData('adressZipGroup'),
        [StatTypeEnum.ErrorMessage]: StatType.StatTypes[StatTypeEnum.ErrorMessage]().CreateStat().InitData('Enter ZIP code'),
        [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData('adressZipGroup')
      }),

      new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.InputGroup, SubObjectTypeEnum.ParentObject, ActionTypeEnum.None, {
        [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('countryCityGroup'),
        [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('form-control w-100'),
        [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData('countryCityGroup')
      }),
      new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.SelectList, SubObjectTypeEnum.ParentObject, ActionTypeEnum.Insert, {
        [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Country*'),
        [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('countryField|'),
        [StatTypeEnum.Placeholder]: StatType.StatTypes[StatTypeEnum.Placeholder]().CreateStat().InitData('Select a country'),
        [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('mb-3'),
        [StatTypeEnum.ItemList]: StatType.StatTypes[StatTypeEnum.ItemList]().CreateStat().InitData(JSON.stringify(this.countries)),
        [StatTypeEnum.BelongsTo]: StatType.StatTypes[StatTypeEnum.BelongsTo]().CreateStat().InitData('countryCityGroup'),
        [StatTypeEnum.ErrorMessage]: StatType.StatTypes[StatTypeEnum.ErrorMessage]().CreateStat().InitData('Enter Country'),
        [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData('countryCityGroup')
      }),

      new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.Field, SubObjectTypeEnum.ParentObject, ActionTypeEnum.Insert, {
        [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('City'),
        [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('cityField|'),
        [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('mb-3'),
        [StatTypeEnum.Placeholder]: StatType.StatTypes[StatTypeEnum.Placeholder]().CreateStat().InitData('Enter city name'),
        [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(''),
        [StatTypeEnum.BelongsTo]: StatType.StatTypes[StatTypeEnum.BelongsTo]().CreateStat().InitData('countryCityGroup'),
        [StatTypeEnum.ErrorMessage]: StatType.StatTypes[StatTypeEnum.ErrorMessage]().CreateStat().InitData('Enter city'),
        [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData('countryCityGroup')
      }),

      new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.InputGroup, SubObjectTypeEnum.ParentObject, ActionTypeEnum.None, {
        [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('emailGroup'),
        [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('form-control'),
        [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData('emailGroup')
      }),
      new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.Field, SubObjectTypeEnum.ParentObject, ActionTypeEnum.Insert, {
        [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Email'),
        [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('emailField|'),
        [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('mb-3'),
        [StatTypeEnum.Placeholder]: StatType.StatTypes[StatTypeEnum.Placeholder]().CreateStat().InitData('Enter email'),
        [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(''),
        [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData('emailGroup'),
        [StatTypeEnum.ErrorMessage]: StatType.StatTypes[StatTypeEnum.ErrorMessage]().CreateStat().InitData('Enter email'),
        [StatTypeEnum.BelongsTo]: StatType.StatTypes[StatTypeEnum.BelongsTo]().CreateStat().InitData('emailGroup')
      }),
      new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.Field, SubObjectTypeEnum.ParentObject, ActionTypeEnum.Insert, {
        [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Verify email'),
        [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('verifyEmailField|'),
        [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('mb-3'),
        [StatTypeEnum.Placeholder]: StatType.StatTypes[StatTypeEnum.Placeholder]().CreateStat().InitData('Verify email'),
        [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(''),
        [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData('emailGroup'),
        [StatTypeEnum.ErrorMessage]: StatType.StatTypes[StatTypeEnum.ErrorMessage]().CreateStat().InitData('Enter email'),
        [StatTypeEnum.BelongsTo]: StatType.StatTypes[StatTypeEnum.BelongsTo]().CreateStat().InitData('emailGroup')
      }),

      new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.Field, SubObjectTypeEnum.ParentObject, ActionTypeEnum.Insert, {
        [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Additional information'),
        [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('additionalInfoField'),
        [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('form-control rounded mb-3 h-40'),
        [StatTypeEnum.Placeholder]: StatType.StatTypes[StatTypeEnum.Placeholder]().CreateStat().InitData('Enter any additional information...'),
        [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(''),
        [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData('additionalInfo')
      }),
      new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.Button, SubObjectTypeEnum.Up, ActionTypeEnum.Click, {
        [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('book|'),
        [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData('Submit'),
        [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('btn btn-primary'),
        [StatTypeEnum.Tooltip]: StatType.StatTypes[StatTypeEnum.Tooltip]().CreateStat().InitData('Submit')
      })
    ]
    this.entity = entityTemp
    this.objectTemplates = this.mechanic.InitSet(this.extractChildren(entityTemp))
  }

  extractChildren(entities: ObjectTemplate[]): ObjectTemplate[] {
    const itemsToDelete = []

    for (let i = 0; i < entities.length; i++) {
      const item = entities[i]

      if (item.Stats[StatTypeEnum.BelongsTo] !== undefined) {
        const data = item.Stats[StatTypeEnum.BelongsTo].Data
        this.belongsTo[data] = this.belongsTo[data] || []
        if (
          !this.belongsTo[data].some(function (obj) {
            return obj.Stats[StatTypeEnum.Tag].Data === item.Stats[StatTypeEnum.Tag].Data
          })
        ) {
          this.belongsTo[data].push(item as ObjectTemplate)
        }

        // Add index to itemsToDelete array
        itemsToDelete.push(i)
      }
    }

    // Iterate in reverse to avoid issues with array modifications
    for (let i = itemsToDelete.length - 1; i >= 0; i--) {
      entities.splice(itemsToDelete[i], 1)
    }
    return entities
  }

  getComponent(_regionEnum: number, _objectEnum: number) {
    return RegionType.RegionTypes[_regionEnum].ObjectTypes[_objectEnum].GetComponent()
  }

  resolveEntities(_object: ObjectTemplate): ObjectTemplate[] {
    if (this.belongsTo) {
      for (const tag of Object.keys(this.belongsTo)) {
        if (_object.Stats[StatTypeEnum.Tag].Data.includes(tag)) {
          return this.belongsTo[tag]
        }
      }
    }

    return []
  }
}
</script>

<style>
  select {
    height: fit-content;
  }
</style>
