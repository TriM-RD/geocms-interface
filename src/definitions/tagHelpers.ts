export namespace TagHelpers{

  export class Methods {
    public static multiTags (firstTag: string, secondTag = ''): string {
      return firstTag + '|' + secondTag
    }
  }
  export enum CyberTags {
    code = 'code',
    group = 'group',
    division = 'division',
    permission = 'permission',
    belongs = 'belongs',
    mapPicker = 'mapPicker',
    submitFormButton = 'submitFormButton',
    name = 'name',
    add = 'add',
    actions = 'actions',
    icon = 'icon',
    required = 'required',
    template = 'template',
    files = 'files',
    groupType = 'groupType',
    order = 'order',
    children = 'children',
    value = 'value',
    label = 'label',
  }

  export enum EcabinetTags {
    ecabinetColumnChild = 'ecabinetColumnChild',
    ecabinetRowChild = 'ecabinetRowChild',
    ecabinetRow = 'ecabinetRow',
    belongs = 'belongs',
    notBelongs = 'belongs-true',
    replace = 'replace',
    replacedEntity = 'replacedEntity',
    addEcabinetRow = 'addEcabinetRow',
    viewParent = 'viewParent',
    link = 'link',
  }

  export enum ControllerTags {
    showControllerButton = 'showControllerButton'
  }
}
