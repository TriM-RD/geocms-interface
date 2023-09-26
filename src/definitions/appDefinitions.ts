export namespace Definitions{

  export enum Other {
    Any = 'Device',
    Home = 'Home'
  }
  export enum Device {
    Def = 'Device',
    Add = 'DeviceAdd',
    Edit = 'DeviceEdit',
    Replace = 'DeviceReplace',
    Modal = 'DeviceModal',
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

  export enum Permission {
    Def = 'Permission',
  }

  export enum Administration {
    Def = 'Administration',
    Add = 'AdministrationAdd',
    Edit = 'AdministrationEdit',
    AccountProfile = 'AccountProfile',
  }
}
