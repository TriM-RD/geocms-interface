import { ResolverAbstract } from '@/resolvers/resolverAbstract'
import {
  ActionTypeEnum,
  EventHandlerType,
  ObjectTemplate,
  ObjectTypeEnum,
  RegionEnum,
  StatType,
  StatTypeEnum,
  SubObjectTypeEnum
} from '@cybertale/interface'
import http from '@/http-common'
import { Definitions } from '@/definitions/appDefinitions'
import router from '@/router'
import { Modal } from 'bootstrap'
import { WrapperAbstract } from '@/resolvers/assignments/wrapperAbstract'
import { TagHelpers } from '@/definitions/tagHelpers'
import { v4 as uuidv4 } from 'uuid'

export abstract class HandlerAbstract extends ResolverAbstract {
  RowButton (wrapper: WrapperAbstract): Promise<ObjectTemplate[]> {
    return Promise.resolve(wrapper.objectTemplates)
  }

  public async FormSelectList (wrapper: WrapperAbstract): Promise<ObjectTemplate[]> {
    switch (wrapper.eventHandler.subObjectType) {
      case SubObjectTypeEnum.Middle:
        this.removeElementFromArray(wrapper.objectTemplates, TagHelpers.CyberTags.group)
        wrapper = this.updateValueData(wrapper)
        wrapper.refreshPage()
        wrapper.objectTemplates = wrapper.append((await http.get(process.env.VUE_APP_BASE_URL + 'form/entity/' + wrapper.eventHandler.payload.Stats[StatTypeEnum.Value].Data)).data)
        wrapper.refreshPage()
        break
      default:
        wrapper.objectTemplates = await super.FormSelectList(wrapper)
        break
    }
    return wrapper.objectTemplates
  }

  public async FormButton (wrapper: WrapperAbstract): Promise<ObjectTemplate[]> {
    let rowCount = 0
    let rowsExist = false
    switch (wrapper.eventHandler.subObjectType) {
      case SubObjectTypeEnum.Middle:
        wrapper = await this.resolveButtonMiddle(wrapper)
        break
      case SubObjectTypeEnum.Left:
        // Add it to Stats
        if (wrapper.eventHandler.payload.Stats[StatTypeEnum.Value]) { // TODO needs to be fixed, not working as expected
          if (wrapper.id !== 'formModalSubmit' + wrapper.eventHandler.payload.Stats[StatTypeEnum.Value].Data) { wrapper.eventHandler.payload.Stats[StatTypeEnum.Disabled].Data = 'true' }
        }
        await this.validateForm('entity', Definitions.Entity.Edit, wrapper.objectTemplates, wrapper.refreshPage, wrapper.append, wrapper.id, wrapper.inEdit, wrapper.eventHandler.payload)
        break
      case SubObjectTypeEnum.Right:
        await router.push({
          name: Definitions.Entity.Def
        })
        break
      case SubObjectTypeEnum.Up:
        wrapper.refreshPage()
        for (const row of wrapper.objectTemplates) {
          if (row.Stats[StatTypeEnum.Tag].Data === TagHelpers.EcabinetTags.ecabinetRow) {
            rowCount = Number(row.Stats[StatTypeEnum.Value].Data)
            rowsExist = true
          }
        }
        if (rowsExist) { rowCount += 1 }
        wrapper.objectTemplates = wrapper.append([
          new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.ECabinetRow, SubObjectTypeEnum.ParentObject, ActionTypeEnum.None, {
            [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Row'),
            [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData(TagHelpers.EcabinetTags.ecabinetRow),
            [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(rowCount.toString()),
            [StatTypeEnum.ItemList]: StatType.StatTypes[StatTypeEnum.ItemList]().CreateStat().InitData('')
          })
        ])
        wrapper.refreshPage()
        break
      case SubObjectTypeEnum.Down:
        wrapper.refreshPage()
        this.resolveButtonDown(wrapper.eventHandler, wrapper.eventHandler.payload.Stats[StatTypeEnum.Tag].Data.split('|'), wrapper.objectTemplates, wrapper.refreshPage, wrapper.id)
        wrapper.refreshPage()
        break
      default:
        break
    }
    return Promise.resolve(wrapper.objectTemplates)
  }

  protected async resolveButtonMiddle (wrapper: WrapperAbstract): Promise<WrapperAbstract> {
    switch (wrapper.eventHandler.payload.Stats[StatTypeEnum.Tag].Data) {
      case TagHelpers.EcabinetTags.replace:
        await router.push({
          name: Definitions.Entity.Replace,
          params: { parentId: wrapper.id }
        })
        break
      case TagHelpers.EcabinetTags.viewParent:
        await router.push({
          name: Definitions.Entity.Edit,
          params: { id: wrapper.eventHandler.payload.Stats[StatTypeEnum.Value].Data }
        })
        break
      case TagHelpers.ControllerTags.showControllerButton:
        // eslint-disable-next-line no-case-declarations
        const iframe = document.getElementById('yourIframeId') as HTMLIFrameElement
        if (iframe !== null) {
          if (iframe.contentWindow !== null) {
            iframe.contentWindow.postMessage({ command: 'openModalOrmar', code: this.specialTruncate(wrapper.eventHandler.payload.Stats[StatTypeEnum.Value].Data) }, '*')
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
      case TagHelpers.CyberTags.add + TagHelpers.CyberTags.division:
        this.addObjectTemplateInputGroup(wrapper)
        break
    }
    return wrapper
  }

  protected resolveButtonDown (eventHandler: EventHandlerType, strings: string[], objectTemplates: ObjectTemplate[], refreshPage: () => void, id: string): ObjectTemplate[] {
    switch (strings[0]) {
      case 'link':
        alert('test')
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

  private unlinkBelongs (eventHandler : EventHandlerType, tag : string, objectTemplates: ObjectTemplate[]): ObjectTemplate[] {
    const belongsIndex = objectTemplates.findIndex(
      element => element.Stats[StatTypeEnum.Tag].Data.split('|')[0] === tag)
    /* const tags = objectTemplates[belongsIndex].Stats[StatTypeEnum.Tag].Data.split('|')
    if (tags[1] === 'true') {
      objectTemplates[belongsIndex].Stats[StatTypeEnum.Tag].Data = tags[0] + ''
      eventHandler.payload.Stats[StatTypeEnum.Label].Data = 'Un-Link'
      eventHandler.payload.Stats[StatTypeEnum.Design].Data = 'btn btn-outline-danger me-2'
    } else {
      objectTemplates[belongsIndex].Stats[StatTypeEnum.Tag].Data = tags[0] + '-true'
      eventHandler.payload.Stats[StatTypeEnum.Label].Data = 'Link'
      eventHandler.payload.Stats[StatTypeEnum.Design].Data = 'btn btn-outline-info me-2'
    } */
    return objectTemplates
  }
}
