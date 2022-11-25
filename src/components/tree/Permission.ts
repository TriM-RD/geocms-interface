export interface NodeContext {
  isExpanded():boolean;
  toggleExpand():void;
}

interface Permission{
  id: string,
  title: string,
  // eslint-disable-next-line camelcase
  parent_id?: string,
  lft: number,
  rgt: number
}

export interface TreeData{
  label: string,
  expand: boolean,
  // eslint-disable-next-line camelcase
  some_id: string,
  newChildName: string,
  rename:string,
  permission: Permission,
  parent?: TreeData,
  children: TreeData[]
}
export default Permission
