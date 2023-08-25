export namespace Definitions{

  export enum Other {
    Any = 'Device'
  }
  export enum Device {
    Def = 'Device',
    Add = 'DeviceAdd',
    Edit = 'DeviceEdit',
    Replace = 'DeviceReplace',
  }

  export enum Group {
    Def = 'Group',
    Add = 'GroupAdd',
    Edit = 'GroupEdit',
  }

  export enum Division {
    Def = 'Division',
    Add = 'DivisionAdd',
    Edit = 'DivisionEdit',
  }

  export enum Attribute {
    Def = 'Attribute',
    Add = 'AttributeAdd',
    Edit = 'AttributeEdit',
  }

  export enum Administration {
    Def = 'Administration',
    Edit = 'AdministrationEdit',
    AccountProfile = 'AccountProfile',
  }
}
