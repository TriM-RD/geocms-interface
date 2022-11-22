export interface NodeContext {
  isExpanded():boolean;
  toggleExpand():void;
}

interface Permission{
  id: number,
  title: string,
  // eslint-disable-next-line camelcase
  parent_id?: number,
  lft: number,
  rgt: number
}

export interface TreeData{
  label: string,
  expand: boolean,
  // eslint-disable-next-line camelcase
  some_id: number,
  newChildName: string,
  permission: Permission,
  parent?: TreeData,
  children: TreeData[]
}
export default Permission
