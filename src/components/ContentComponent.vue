<template>
  <Loading v-model:active="renderComponent" />
  <div v-if="!renderComponent" class="container d-flex flex-column flex-grow-1 overflow-hidden rounded-bottom-3">
    <div class="row mt-3">
      <div class="col text-center">
        <div class="btn-group d-flex" role="group" aria-label="Unit Information">
          <button v-for="(header, index) in headers" :key="index" type="button" class="btn btn-outline-camp btn-sm flex-grow-1" :class="{ active: activeTab === index }" @click="clickScroll(index)">
            {{ $t(header) }}
          </button>
        </div>
      </div>
    </div>
    <div class="scroll-container h-100 overflow-scroll">
      <!--component class="scroll-item" :rerender="changeRender" v-for="(entity, key, index) in entities" :key="`${key}-${index}-${Math.random().toString(36).slice(2, 7)}`" :is="getComponent(regionEnum.Table, objectTypeEnum.Row)" :entity="entity" :index="key"></component-->
      <!--div v-for="(content, index) in tabContents" :key="index" class="scroll-item">
        <p>{{ content }}</p>
      </div-->
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator'
import LoadingComponent from '@/components/LoadingComponent.vue'
import { MechanicAbstract, ObjectTemplate, ObjectType, ObjectTypeEnum, RegionEnum, StatTypeEnum } from '@cybertale/interface'
import { Manager } from '@/mechanics/tableMechanic'
import router from '@/router'
import { Definitions } from '@geocms/components'
import { $t } from '@/stores/storeTranslations'

@Component({
  methods: { $t },
  components: { Loading: LoadingComponent }
})
export default class ContentComponent extends Vue {
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
  activeTab = 0
  startDragging: ((e: MouseEvent | TouchEvent) => void) | null = null
  drag: ((e: MouseEvent | TouchEvent) => void) | null = null
  stopDragging: (() => void) | null = null
  scroll: (() => void) | null = null
  $t = $t

  mounted() {
    this.setupScroll()
  }

  setupScroll() {
    const scrollContainer = document.querySelector('.scroll-container') as HTMLElement
    if (!scrollContainer) return

    let isDragging = false
    let startX: number
    let scrollLeft: number

    this.startDragging = (e: MouseEvent | TouchEvent) => {
      isDragging = true
      scrollContainer.classList.add('active')
      startX = 'touches' in e ? e.touches[0].pageX : e.pageX
      scrollLeft = scrollContainer.scrollLeft
    }

    this.stopDragging = () => {
      isDragging = false
      scrollContainer.classList.remove('active')
    }

    this.drag = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return
      e.preventDefault()
      const x = 'touches' in e ? e.touches[0].pageX : e.pageX
      const walk = (x - startX) * 2 // Adjust scroll speed by multiplier
      scrollContainer.scrollLeft = scrollLeft - walk
    }

    const scrollItems = scrollContainer.querySelectorAll('.scroll-item') as NodeListOf<HTMLElement>
    this.scroll = () => {
      const containerWidth = scrollContainer.clientWidth
      const scrollPosition = scrollContainer.scrollLeft
      const currentItemIndex = Math.round(scrollPosition / containerWidth)
      this.setActiveTab(currentItemIndex)
      scrollItems.forEach((item, index) => {
        if (index === currentItemIndex) {
          item.scrollTop = 0
        }
      })
    }

    scrollContainer.addEventListener('mousedown', this.startDragging)
    scrollContainer.addEventListener('touchstart', this.startDragging)

    scrollContainer.addEventListener('mousemove', this.drag)
    scrollContainer.addEventListener('touchmove', this.drag)

    scrollContainer.addEventListener('mouseup', this.stopDragging)
    scrollContainer.addEventListener('mouseleave', this.stopDragging)
    scrollContainer.addEventListener('touchend', this.stopDragging)

    scrollContainer.addEventListener('scroll', this.scroll)
  }

  beforeDestroy() {
    const scrollContainer = document.querySelector('.scroll-container') as HTMLElement
    if (!scrollContainer) return

    if (this.startDragging && this.stopDragging && this.drag && this.scroll) {
      const startDragging = this.startDragging
      const stopDragging = this.stopDragging
      const drag = this.drag
      const scroll = this.scroll

      // Remove all event listeners to prevent memory leaks
      scrollContainer.removeEventListener('mousedown', startDragging)
      scrollContainer.removeEventListener('touchstart', startDragging)
      scrollContainer.removeEventListener('mousemove', drag)
      scrollContainer.removeEventListener('touchmove', drag)
      scrollContainer.removeEventListener('mouseup', stopDragging)
      scrollContainer.removeEventListener('mouseleave', stopDragging)
      scrollContainer.removeEventListener('touchend', stopDragging)
      scrollContainer.removeEventListener('scroll', scroll)
    }
  }

  setActiveTab(index: number) {
    this.activeTab = index
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

  clickScroll(index: number) {
    const scrollContainer = document.querySelector('.scroll-container') as HTMLElement
    const scrollItems = scrollContainer.querySelectorAll('.scroll-item') as NodeListOf<HTMLElement>
    const targetItem = scrollItems[index]
    if (targetItem) {
      const scrollLeft = targetItem.offsetLeft - scrollContainer.offsetLeft
      scrollContainer.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      })
    }
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

  getHeaders(): void {
    // TODO Needs to be reworked. @JosoMarich
    this.headers = []
    for (const header of this.objectTemplates) {
      if (this.headers.indexOf(header.Stats[StatTypeEnum.Label].Data) === -1 && header.Stats[StatTypeEnum.BelongsTo] === undefined) {
        this.headers[this.headers.length] = header.Stats[StatTypeEnum.Label].Data
      }
    }
  }
}
</script>

<style scoped>
.scroll-item {
  flex: 0 0 100%;
  scroll-snap-align: center;
}

.col {
  padding: 15px;
}

.scroll-container {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  cursor: grab;
  user-select: none;
}

.scroll-container:active {
  cursor: grabbing;
}

.scroll-item {
  flex: 0 0 100%;
  scroll-snap-align: center;
  transition: transform 0.3s ease;
  overflow-y: auto;
  max-height: 100%;
}

.scroll-item:active {
  transform: scale(0.98);
}

/* Scrollbar styling */
.scroll-container::-webkit-scrollbar,
.scroll-item::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}

.scroll-container::-webkit-scrollbar-thumb,
.scroll-item::-webkit-scrollbar-thumb {
  background: #4caf50;
  border-radius: 3px;
  border: 2px solid #ffffff;
}
</style>
