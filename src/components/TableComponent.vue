<template>
  <div class="my-4" v-if="checkRoute()">
    <div class="row">
      <div class="col-12 col-sm-9 d-flex justify-content-between align-items-center">
        <!-- CODE FILTER -->
        <input
          id="codeFilter"
          type="search"
          class="form-control flex-fill me-3"
          v-model.trim="filters.code"
          @input="onSearchInput"
          @search="onSearchInput"
          :placeholder="$t.filterByCode"
          aria-label="Search by code or name"
        />

        <!-- DIVISION FILTER -->
        <input
          id="divisionFilter"
          type="search"
          class="form-control flex-fill me-3"
          v-model.trim="filters.division"
          @input="onSearchInput"
          @search="onSearchInput"
          :placeholder="$t.filterByDivision"
          aria-label="Filter by division"
        />

        <!-- GROUP FILTER -->
        <input
          id="groupFilter"
          type="search"
          class="form-control flex-fill me-3"
          v-model.trim="filters.group"
          @input="onSearchInput"
          @search="onSearchInput"
          :placeholder="$t.filterByGroup"
          aria-label="Filter by group"
        />

        <!-- CSV UPLOAD -->
        <div class="d-flex flex-fill me-3 align-items-center">
          <input
            type="file"
            ref="csvFileInput"
            accept=".csv"
            @change="onCsvChange"
            class="form-control flex-fill"
          />
          <button
            class="btn btn-primary ms-2"
            :disabled="!csvFile"
            @click="uploadCsv"
          >
            {{ 'uploadCsv' }}
          </button>
        </div>
      </div>
      <div class="col-12 col-sm-3 mt-3 mt-sm-0">
        <select class="form-select" id="sortOrder" @change="handleFilterChange" v-model="orderBy">
          <option selected value="asc">{{$t.ascending}}</option>
          <option value="desc">{{ $t.descending }}</option>
        </select>
      </div>
      <div></div>
    </div>
  </div>
  <Loading v-model:active="renderComponent"
           :can-cancel="false"
           :is-full-page="false"/>
  <table class="table table-hover" v-if="!renderComponent">
    <thead class="table-light">
    <tr>
      <th></th>
      <th v-for="(header, key) in headers" :key="`${ key }-${ header }-${ Math.random().toString(36).slice(2, 7) }`" scope="col">
        {{ header }}</th>
    </tr>
    </thead>
    <tbody>
    <component :rerender="changeRender"  v-for="(entity, key, index) in entities" :key="`${ key }-${ index }-${ Math.random().toString(36).slice(2, 7) }`" :is="getComponent(regionEnum.Table, objectTypeEnum.Row)" :entity='entity' :index='key'></component>
    </tbody>
  </table>
  <!--button class="btn btn-outline-secondary" @click.prevent="scroll()">Load</button-->
</template>

<script lang="ts">
import Loading from 'vue-loading-overlay'
import { Options, Vue } from 'vue-class-component'
import { Manager } from '@/mechanics/tableMechanic'
import {
  ObjectTemplate,
  MechanicAbstract,
  ObjectType,
  StatTypeEnum,
  ObjectTypeEnum,
  RegionType,
  RegionEnum
} from '@cybertale/interface'
import router from '@/router'
import { TYPE, useToast } from 'vue-toastification'
import ToastComponent from '@/components/ToastComponent.vue'
import { Definitions } from '@geocms/components'
import { $t } from '@geocms/localization'
import { Provide } from 'vue-property-decorator'
import http, { updateHeaders } from '@/http-common'
@Options({
  computed: {
    $t () {
      return $t
    }
  },
  components: {
    Loading
  }
})
export default class TableComponent extends Vue {
  @Provide() http = http;
  headers: string[] = []
  regionEnum = RegionEnum
  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  mechanic: MechanicAbstract = new Manager.Mechanic.TableMechanic(this.reRender.bind(this))
  renderComponent= true
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
  debounceTimer: number | null = null

  csvFile: File | null = null

  onSearchInput (): void {
    // if there’s already a pending timer, cancel it
    if (this.debounceTimer !== null) {
      clearTimeout(this.debounceTimer)
    }
    // schedule a fresh call 250ms after the *last* keystroke
    this.debounceTimer = window.setTimeout(() => {
      this.handleFilterChange()
      this.debounceTimer = null
    }, 250)
  }

  onCsvChange (e: Event) {
    const files = (e.target as HTMLInputElement).files
    this.csvFile = files && files.length ? files[0] : null
  }

  async uploadCsv () {
    if (!this.csvFile) return

    const form = new FormData()
    form.append('file', this.csvFile)
    // 1) show a persistent “Uploading…” toast
    const validatingToast = useToast()(
      {
        component: ToastComponent,
        props: {
          msg: {
            title: 'Uploading CSV',
            info: 'Please wait while we import your data…'
          }
        }
      },
      {
        type: TYPE.INFO,
        timeout: false, // don’t auto‐dismiss
        closeOnClick: false
      }
    )

    try {
      this.renderComponent = true
      const res = await http.post(process.env.VUE_APP_BASE_URL + 'import-csv/entity', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      // 2) clear loading toast & show success
      useToast().dismiss(validatingToast)
      useToast()(
        {
          component: ToastComponent,
          props: {
            msg: {
              title: 'Import Complete',
              info: res.data.message || 'CSV imported successfully.'
            }
          }
        },
        { type: TYPE.SUCCESS }
      )

      // refresh table
      this.changeRender()
    } catch (err: any) {
      // If we got a 422 with per‐row details, show each
      if (err.response?.status === 422 && Array.isArray(err.response.data.details)) {
        for (const detail of err.response.data.details) {
          useToast().dismiss(validatingToast)
          useToast()(
            {
              component: ToastComponent,
              props: {
                msg: {
                  title: `Row ${detail.row} error`,
                  info: detail.reason
                }
              }
            },
            { type: TYPE.ERROR }
          )
        }
      } else {
        useToast().dismiss(validatingToast)
        useToast()(
          {
            component: ToastComponent,
            props: {
              msg: {
                title: 'Import Failed',
                info: err.response?.data?.message || 'An unexpected error occurred.'
              }
            }
          },
          { type: TYPE.ERROR }
        )
      }
    } finally {
      this.renderComponent = false
      this.csvFile = null
      ;(this.$refs.csvFileInput as HTMLInputElement).value = ''
    }
  }

  beforeUnmount () {
    this.mechanic.UnsubscribeConditions()
    if (this.onScroll) {
      window.removeEventListener('scroll', this.onScroll)
    }
  }

  created () {
    this.Init()
  }

  mounted () {
    if (router.currentRoute.value.name === Definitions.Entity.Def) {
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

  reRender (reverseOrder: boolean) {
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

  changeRender () {
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

  async scroll () {
    if (this.isInitRunning) { return }
    await this.Init()
  }

  handleFilterChange (): void {
    // don't do anything if we're already mid‐request
    if (this.isInitRunning) return

    // blank out the table and start loading
    this.renderComponent = true
    this.entities = []
    this.objectTemplates = []
    this.headers = []

    // reset the paging/mechanic so filters apply cleanly
    this.mechanic = new Manager.Mechanic.TableMechanic(this.reRender.bind(this))

    // finally, fetch with the new filter
    this.Init()
  }

  checkRoute () {
    return router.currentRoute.value.name === Definitions.Entity.Def
  }

  get cleanedFilters (): Record<string, string> {
    const out: Record<string, string> = {}
    if (this.filters.code) out.code = this.filters.code
    if (this.filters.division) out.division = this.filters.division
    if (this.filters.group) out.group = this.filters.group
    return out
  }

  async Init () {
    if (this.isInitRunning) { return }
    this.isInitRunning = true
    switch (router.currentRoute.value.name) {
      case Definitions.Entity.Def:
        // console.log(this.orderBy)
        this.objectTemplates = this.mechanic.InitSet(await this.mechanic.InitGet('-1', JSON.stringify({ api: 'entity', filters: this.cleanedFilters, order: this.orderBy })))
        break
      case Definitions.Group.Def:
        this.objectTemplates = this.mechanic.InitSet(await this.mechanic.InitGet('-1', JSON.stringify({ api: 'group', filters: this.cleanedFilters, order: this.orderBy })))
        break
      case Definitions.Division.Def:
        this.objectTemplates = this.mechanic.InitSet(await this.mechanic.InitGet('-1', 'division'))
        break
      case Definitions.Group.Edit:
        this.objectTemplates = this.mechanic.InitSet(await this.mechanic.InitGet('-1', 'filter/attribute/' + router.currentRoute.value.params.id))
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
    if (this.objectTemplates.length === 0) {
      // no results: clear out the rows and reset all loading flags
      this.entities = []
      this.renderComponent = false
      this.loadingComponents = false
      this.isInitRunning = false
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

  reverseEntities () {
    if (!this.isInitRunning) {
      const groupValues = Object.values(this.groupTypeFilter)
      this.renderComponent = true
      const currentGroupIndex = groupValues.indexOf(this.cleanedFilters.group) + 1
      if (currentGroupIndex >= groupValues.length && this.cleanedFilters.group !== '') { // TODO something is not working (ORDER), most likely fixed
        this.cleanedFilters.group = groupValues[0]
      } else {
        this.cleanedFilters.group = groupValues[currentGroupIndex]
      }
      useToast()({
        component: ToastComponent,
        props: { msg: { title: 'Loading...', info: this.cleanedFilters.group === '' ? 'Loading all.' : 'Loading ' + this.cleanedFilters.group + ' only.' } }
      }, {
        type: TYPE.INFO
      })
      this.changeRender()
    }
  }

  getHeaders () : void { // TODO Needs to be reworked. @JosoMarich
    this.headers = []
    for (const header of this.objectTemplates) {
      if (this.headers.indexOf(header.Stats[StatTypeEnum.Label].Data) === -1 && header.Stats[StatTypeEnum.BelongsTo] === undefined) {
        this.headers[this.headers.length] = header.Stats[StatTypeEnum.Label].Data
      }
    }
  }

  getComponent (_regionEnum : number, _objectEnum: number) {
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
