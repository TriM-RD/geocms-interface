interface Permission{
  id: number,
  title: string,
  // eslint-disable-next-line camelcase
  parent_id: number,
  lft: number,
  rgt: number,
  children?: Permission[]
}

export default Permission
