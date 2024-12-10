
export interface NodeContext {
  isExpanded():boolean;
  toggleExpand():void;
}

interface Permission{
  id: string,
  name: string,
  // eslint-disable-next-line camelcase
  parent_id?: string,
  lft: number,
  rgt: number,
  firm?: string,
  _method?: string
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
