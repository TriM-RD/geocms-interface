<template>
  <Loading v-model:active="renderComponent" />
  <table class="table table-hover" v-if="!renderComponent">
    <thead class="table-light">
      <tr>
        <th></th>
        <th v-for="(header, key) in headers" :key="`${key}-${header}-${Math.random().toString(36).slice(2, 7)}`" scope="col">
          {{ header }}
        </th>
      </tr>
    </thead>
    <tbody>
      <component :rerender="changeRender" v-for="(entity, key, index) in entities" :key="`${key}-${index}-${Math.random().toString(36).slice(2, 7)}`" :is="getComponent(regionEnum.Table, objectTypeEnum.Row)" :entity="entity" :index="key"></component>
    </tbody>
  </table>
  <!--button class="btn btn-outline-secondary" @click.prevent="scroll()">Load</button-->
</template>

<script lang="ts">
import LoadingComponent from '@/components/LoadingComponent.vue'
import { Options, Vue } from 'vue-class-component'
import { Manager } from '@/mechanics/tableMechanic'
import { ObjectTemplate, MechanicAbstract, ObjectType, StatTypeEnum, ObjectTypeEnum, RegionType, RegionEnum } from '@cybertale/interface'
import router from '@/router'
import { Definitions } from '@geocms/components'
import { $t } from '@geocms/localization'
@Options({
  computed: {
    $t() {
      return $t
    }
  },
  components: {
    Loading: LoadingComponent
  }
})
export default class TableComponent extends Vue {
  headers: string[] = []
  regionEnum = RegionEnum
  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  mechanic: MechanicAbstract = new Manager.Mechanic.TableMechanic(this.reRender.bind(this))
  renderComponent = true
  loadingComponents = true
  objectTemplates!: ObjectTemplate[]
  entities: ObjectTemplate[][] = []
  currentPage = 1
  isInitRunning = false
  orderBy = 'asc'
  isLoading = false
  groupTypeFilter: { [key: string]: string } = { all: '', group: 'group', template: 'template' }
  filters = { code: '', group: '', division: '' }
  onScroll: ((this: Window, ev: Event) => any) | null = null

  beforeUnmount() {
    this.mechanic.UnsubscribeConditions()
    if (this.onScroll) {
      window.removeEventListener('scroll', this.onScroll)
    }
  }

  created() {
    this.Init()
  }

  mounted() {
    if (this.$route.name === Definitions.Entity.Def) {
      this.onScroll = async () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
        // Check if isLoading is false and user is at the bottom of the page
        if (!this.isLoading && !this.isInitRunning && !this.renderComponent && scrollHeight - window.innerHeight - scrollTop <= 5) {
          // Set isLoading to true
          this.isLoading = true

          // Fetch new data
          await this.scroll() // TODO scroll is disabling resorting on group

          // Set isLoading back to false
          this.isLoading = false
        }
      }

      // Subscribe to the scroll event
      window.addEventListener('scroll', this.onScroll)
    }
  }

  reRender(reverseOrder: boolean) {
    if (reverseOrder) {
      this.reverseEntities()
    } else {
      if (this.loadingComponents) {
        this.entities = []
        this.objectTemplates = []
        this.headers = []
        this.Init()
      } else {
        this.loadingComponents = true
      }
    }
  }

  changeRender() {
    if (this.renderComponent) {
      this.entities = []
      this.objectTemplates = []
      this.headers = []
      this.mechanic = new Manager.Mechanic.TableMechanic(this.reRender.bind(this))
      this.Init()
    } else {
      this.renderComponent = true
    }
  }

  async scroll() {
    if (this.isInitRunning) {
      return
    }
    await this.Init()
  }

  handleFilterChange(): void {
    if (!this.isInitRunning) {
      this.renderComponent = true
      this.changeRender()
      this.Init()
    }
  }

  checkRoute() {
    return router.currentRoute.value.name === Definitions.Entity.Def
  }

  async Init() {
    if (this.isInitRunning) {
      return
    }
    this.isInitRunning = true
    switch (router.currentRoute.value.name) {
      case Definitions.Entity.Def:
        // console.log(this.orderBy)
        this.objectTemplates = this.mechanic.InitSet(await this.mechanic.InitGet('-1', JSON.stringify({ api: 'entity', filters: this.filters, order: this.orderBy })))
        break
      case Definitions.Group.Def:
        this.objectTemplates = this.mechanic.InitSet(await this.mechanic.InitGet('-1', JSON.stringify({ api: 'group', filters: this.filters, order: this.orderBy })))
        break
      case Definitions.Division.Def:
        this.objectTemplates = this.mechanic.InitSet(await this.mechanic.InitGet('-1', 'division'))
        break
      case Definitions.Group.Edit:
        this.objectTemplates = this.mechanic.InitSet(await this.mechanic.InitGet('-1', 'filter/attribute/' + this.$route.params.id))
        break
      case Definitions.Group.Add:
        this.renderComponent = false
        return
      case Definitions.Administration.AccountProfile:
        this.objectTemplates = this.mechanic.InitSet(await this.mechanic.InitGet('-1', 'permissions/user'))
        break
      case Definitions.Administration.Def:
        this.objectTemplates = this.mechanic.InitSet(await this.mechanic.InitGet('-1', 'users'))
        break
    }
    if (Object.keys(this.objectTemplates).length === 0) {
      this.renderComponent = false
      return
    }
    let tempId = null
    let tempObjectTemplates = []
    for (const element of this.objectTemplates) {
      // console.log(element.Stats[StatTypeEnum.Tag].Data)
      if (element.Stats[StatTypeEnum.Id].Data === tempId) {
        tempObjectTemplates.push(JSON.parse(JSON.stringify(element)))
      } else {
        if ((this.entities === undefined || this.entities.length < 1) && tempObjectTemplates.length > 0) {
          this.entities = [tempObjectTemplates]
        } else if (this.entities !== undefined && tempObjectTemplates.length > 0) {
          this.entities.push(JSON.parse(JSON.stringify(tempObjectTemplates)))
        }
        tempObjectTemplates = []
        tempObjectTemplates.push(JSON.parse(JSON.stringify(element)))
      }
      tempId = element.Stats[StatTypeEnum.Id].Data
    }
    if (this.entities === undefined || this.entities.length < 1) {
      this.entities = [tempObjectTemplates]
    } else {
      this.entities[this.entities.length] = tempObjectTemplates
    }
    this.getHeaders()
    this.renderComponent = false
    this.loadingComponents = false
    this.isInitRunning = false
  }

  reverseEntities() {
    if (!this.isInitRunning) {
      const groupValues = Object.values(this.groupTypeFilter)
      this.renderComponent = true
      const currentGroupIndex = groupValues.indexOf(this.filters.group) + 1
      if (currentGroupIndex >= groupValues.length && this.filters.group !== '') {
        // TODO something is not working (ORDER), most likely fixed
        this.filters.group = groupValues[0]
      } else {
        this.filters.group = groupValues[currentGroupIndex]
      }
      this.changeRender()
    }
  }

  getHeaders(): void {
    // TODO Needs to be reworked. @JosoMarich
    this.headers = []
    for (const header of this.objectTemplates) {
      if (this.headers.indexOf(header.Stats[StatTypeEnum.Label].Data) === -1 && header.Stats[StatTypeEnum.BelongsTo] === undefined) {
        this.headers[this.headers.length] = header.Stats[StatTypeEnum.Label].Data
      }
    }
  }

  getComponent(_regionEnum: number, _objectEnum: number) {
    return RegionType.RegionTypes[_regionEnum].ObjectTypes[_objectEnum].GetComponent()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.table {
  margin-bottom: 5%;
}

@media (max-width: 767px) {
  .table {
    margin-bottom: calc(5% + 60px);
  }
}

.to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: none;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  background-color: #000;
  color: #fff;
  border-radius: 50%;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.to-top:hover {
  background-color: #444;
}

/* Show the button after scrolling down 200px */
@media screen and (min-width: 768px) {
  .to-top {
    display: flex;
  }
}

@media screen and (max-width: 767px) {
  /* For mobile: Full-width inputs, stacked vertically */
  .container > .d-flex {
    flex-direction: column;
  }

  .container > .d-flex > input,
  .container > .d-flex > select {
    margin-bottom: 10px;
  }
}
</style>
