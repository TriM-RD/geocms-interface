import { ResolverAbstract } from '@/resolvers/resolverAbstract'
import {
  ActionTypeEnum,
  EventHandlerType,
  ObjectTemplate,
  ObjectTypeEnum,
  RegionEnum, StatType,
  StatTypeEnum,
  SubObjectTypeEnum
} from '@cybertale/interface'
import http from '@/http-common'
import { Definitions } from '@/definitions/appDefinitions'
import router from '@/router'
import { Modal } from 'bootstrap'
import { TYPE, useToast } from 'vue-toastification'
import ToastComponent from '@/components/ToastComponent.vue'

export abstract class HandlerAbstract extends ResolverAbstract {
  public async SelectList (eventHandler: EventHandlerType, objectTemplates: ObjectTemplate[], refreshPage: () => void, append: (_objectTemplates: ObjectTemplate[]) => ObjectTemplate[]): Promise<ObjectTemplate[]> {
    switch (eventHandler.subObjectType) {
      case SubObjectTypeEnum.Middle:
        this.removeElementFromArray(objectTemplates, 'group')
        refreshPage()
        objectTemplates = append((await http.get(process.env.VUE_APP_BASE_URL + 'form/entity/' + eventHandler.payload.Stats[StatTypeEnum.Value].Data)).data)
        refreshPage()
        break
      default:
        break
    }
    return objectTemplates
  }

  public async Button (eventHandler: EventHandlerType, objectTemplates: ObjectTemplate[], refreshPage: () => void, append: (_objectTemplates: ObjectTemplate[]) => ObjectTemplate[], id: string, inEdit: boolean): Promise<ObjectTemplate[]> {
    let rowCount = 0
    let rowsExist = false
    switch (eventHandler.subObjectType) {
      case SubObjectTypeEnum.Middle:
        await this.resolveButtonMiddle(eventHandler, eventHandler.payload.Stats[StatTypeEnum.Tag].Data, objectTemplates, refreshPage, id)
        break
      case SubObjectTypeEnum.Left:
        // Add it to Stats
        if (eventHandler.payload.Stats[StatTypeEnum.Value]) { // TODO needs to be fixed, not working as expected
          if (id !== 'formModalSubmit' + eventHandler.payload.Stats[StatTypeEnum.Value].Data) { eventHandler.payload.Stats[StatTypeEnum.Disabled].Data = 'true' }
        }
        await this.validateForm('entity', Definitions.Device.Edit, objectTemplates, refreshPage, append, id, inEdit, eventHandler.payload)
        break
      case SubObjectTypeEnum.Right:
        await router.push({
          name: Definitions.Device.Def
        })
        break
      case SubObjectTypeEnum.Up:
        refreshPage()
        for (const row of objectTemplates) {
          if (row.Stats[StatTypeEnum.Tag].Data === 'ecabinetRow') {
            rowCount = Number(row.Stats[StatTypeEnum.Value].Data)
            rowsExist = true
          }
        }
        if (rowsExist) { rowCount += 1 }
        objectTemplates = append([
          new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.ECabinetRow, SubObjectTypeEnum.ParentObject, ActionTypeEnum.None, {
            [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Row'),
            [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('ecabinetRow'),
            [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(rowCount.toString()),
            [StatTypeEnum.ItemList]: StatType.StatTypes[StatTypeEnum.ItemList]().CreateStat().InitData('')
          })
        ])
        refreshPage()
        break
      case SubObjectTypeEnum.Down:
        refreshPage()
        this.resolveButtonDown(eventHandler, eventHandler.payload.Stats[StatTypeEnum.Tag].Data.split('-'), objectTemplates, refreshPage, id)
        refreshPage()
        break
      default:
        break
    }
    return objectTemplates
  }

  protected async resolveButtonMiddle (eventHandler: EventHandlerType, tag: string, objectTemplates: ObjectTemplate[], refreshPage: () => void, id: string) {
    switch (tag) {
      case 'replace':
        await router.push({
          name: 'DeviceReplace',
          params: { parentId: id }
        })
        break
      case 'viewParent':
        await router.push({
          name: 'DeviceEdit',
          params: { id: eventHandler.payload.Stats[StatTypeEnum.Value].Data }
        })
        break
      case 'showControllerButton':
        // eslint-disable-next-line no-case-declarations
        const iframe = document.getElementById('yourIframeId') as HTMLIFrameElement
        if (iframe !== null) {
          if (iframe.contentWindow !== null) {
            iframe.contentWindow.postMessage({ command: 'openModalOrmar', code: this.specialTruncate(eventHandler.payload.Stats[StatTypeEnum.Value].Data) }, '*')
          }
        }
        // Open the modal
        // eslint-disable-next-line no-case-declarations
        const myModalElement = document.getElementById('myModal')
        if (myModalElement !== null) {
          const myModal = new Modal(myModalElement, {})
          myModal.show()
        }
        break
      default:
        refreshPage()
        objectTemplates = this.Splice(2, objectTemplates, [// TODO while 2 is correct, it needs to be redone to make it programmatic
          new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.SelectButton, SubObjectTypeEnum.ParentObject, ActionTypeEnum.None, {
            [StatTypeEnum.ItemList]: StatType.StatTypes[StatTypeEnum.ItemList]().CreateStat().InitData(eventHandler.payload.Stats[StatTypeEnum.ItemList].Data),
            [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Division'),
            [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData(Math.random().toString(36).slice(2, 7).toString()),
            [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(''),
            [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData(eventHandler.payload.Stats[StatTypeEnum.Id].Data),
            [StatTypeEnum.ErrorMessage]: StatType.StatTypes[StatTypeEnum.ErrorMessage]().CreateStat().InitData(eventHandler.payload.Stats[StatTypeEnum.ErrorMessage].Data)
          })
        ])
        refreshPage()
        break
    }
  }

  protected resolveButtonDown (eventHandler: EventHandlerType, strings: string[], objectTemplates: ObjectTemplate[], refreshPage: () => void, id: string): ObjectTemplate[] {
    switch (strings[0]) {
      case 'codeButton':
        objectTemplates = this.generateCode(eventHandler, strings[0], objectTemplates)
        refreshPage()
        refreshPage()
        break
      case 'link':
        objectTemplates = this.unlinkBelongs(eventHandler, strings[1], objectTemplates)
        break
      default:
        objectTemplates = super.resolveButtonDown(eventHandler, strings, objectTemplates, refreshPage, id)
        break
    }
    return objectTemplates
  }

  specialTruncate (data: string): string {
    const regex = /^(http|https):\/\/[a-z0-9\-.]+\.[a-z]{2,}(:[0-9]{1,5})?(\/.*)?$/i
    if (regex.test(data)) {
      if (data.includes('?')) {
        const parts = data.split('?')
        return parts[1]
      }
    }
    return data
  }

  generateRandomString (inputString: string): string {
    const characters = inputString.split('')
    for (let i = characters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i)
      const temp = characters[i]
      characters[i] = characters[j]
      characters[j] = temp
    }
    return characters.join('')
  }

  private generateCode (eventHandler: EventHandlerType, string: string, objectTemplates: ObjectTemplate[]): ObjectTemplate[] {
    const temp = objectTemplates.findIndex(element => element.Stats[StatTypeEnum.Tag].Data === 'code')
    objectTemplates[temp].Stats[StatTypeEnum.Value].Data = this.generateRandomString(objectTemplates[temp].Stats[StatTypeEnum.Id].Data)
    return objectTemplates
  }

  private unlinkBelongs (eventHandler : EventHandlerType, tag : string, objectTemplates: ObjectTemplate[]): ObjectTemplate[] {
    const belongsIndex = objectTemplates.findIndex(
      element => element.Stats[StatTypeEnum.Tag].Data.split('-')[0] === tag)
    const tags = objectTemplates[belongsIndex].Stats[StatTypeEnum.Tag].Data.split('-')
    if (tags[1] === 'true') {
      objectTemplates[belongsIndex].Stats[StatTypeEnum.Tag].Data = tags[0] + ''
      eventHandler.payload.Stats[StatTypeEnum.Label].Data = 'Un-Link'
      eventHandler.payload.Stats[StatTypeEnum.Design].Data = 'btn btn-outline-danger me-2'
    } else {
      objectTemplates[belongsIndex].Stats[StatTypeEnum.Tag].Data = tags[0] + '-true'
      eventHandler.payload.Stats[StatTypeEnum.Label].Data = 'Link'
      eventHandler.payload.Stats[StatTypeEnum.Design].Data = 'btn btn-outline-info me-2'
    }
    return objectTemplates
  }
}
