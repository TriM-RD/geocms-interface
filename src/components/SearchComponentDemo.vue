<template>
  <div>
    <button type="button" class="btn btn-primary position-absolute top-2 start-2" style="z-index: 99" data-bs-toggle="modal" data-bs-target="#searchModal" @click="showModal()">Search</button>
    <!--div v-if="modal">
      <ModalComponent></ModalComponent>
    </div-->
    <div class="modal fade overflow-hidden" id="searchModal" tabindex="-1" aria-labelledby="searchModalLabel" aria-hidden="true">
      <div class="modal-dialog mb-0 mt-0 pt-2 pb-2">
        <div class="modal-content h-100 custom-rounded">
          <div class="modal-body d-flex flex-column h-100">
            <div class="container search-modal">
              <div class="row">
                <div class="col-md-6 col-md-offset-3">
                  <div class="search-header">
                    <button class="close-modal" @click="closeModal">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path d="M447.1 256C447.1 273.7 433.7 288 416 288H109.3l105.4 105.4c12.5 12.5 12.5 32.75 0 45.25C208.4 444.9 200.2 448 192 448s-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L109.3 224H416C433.7 224 447.1 238.3 447.1 256z" fill="#0bae81" stroke="#0bae81" stroke-width="8"></path>
                      </svg>
                    </button>
                    <h3 class="text-center">Search</h3>
                  </div>
                  <div class="form-group write mt-3">
                    <div class="search-div">
                      <i class="fas fa-search"></i>
                    </div>
                    <InputText placeholder="Enter pitch number or feature..." type="text" v-model="searchValue" />
                    <div class="delete" v-if="searchValue.length > 0" @click="clearSearch">
                      <i class="fas fa-times-circle"></i>
                    </div>
                  </div>
                  <div class="feature-buttons centered">
                    <template v-for="icon in icons" :key="icon.category">
                      <div class="feature-button" @click="featureClick(icon)" :class="{ active: selectedFeatures.includes(icon) }" v-if="!isUnit(icon.category)">
                        <i :class="'fas ' + icon.name"></i>
                        <span>
                          <span>{{ icon.category }}</span>
                          <small>{{ getEntitiesInCategory(icon.category) }}</small>
                        </span>
                      </div>
                    </template>
                  </div>
                  <div v-if="searchValue.length === 0 && selectedFeatures.length === 0" class="filter-text-heading">Recommended</div>
                  <div v-else class="filter-text-heading green">Found items</div>
                  <div class="entity-container">
                    <div v-for="entity in filteredEntities" :key="entity.id" class="filtered-entities">
                      <div class="card card-body mb-4">
                        <div class="filtered-entities-content">
                          <i v-if="entity.properties.hasOwnProperty('brand')" class="fas fa-caravan"></i>
                          <i v-else-if="entity.properties.hasOwnProperty('name')" :class="'fas ' + getIcon(entity.properties.category)"></i>
                          <h2 v-if="entity.properties.hasOwnProperty('brand')">{{ entity.properties.brand }} {{ entity.properties.number }}</h2>
                          <h2 v-if="entity.properties.hasOwnProperty('name')">{{ entity.properties.name }}</h2>
                          <span class="udaljenost">
                            <span v-if="entity.properties.hasOwnProperty('brand')" :style="getCategoryColor(entity.properties.color)">{{ entity.properties.brand }}</span>
                            {{ entity.properties.distance > 0 ? 'x ' + entity.properties.distance + ' km' : '' }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator'
import { Modal } from 'bootstrap'
import InputText from 'primevue/inputtext'
import gj from '../polidor_1_2d.json'
import { useStoreColors } from '@/stores/storeColors'
import { useStoreMapObjects } from '@/stores/storeMapObjects'
import { centroid } from '@turf/centroid'
import ModalComponent from '@/components/ModalComponent.vue'

interface Icon {
  category: string
  name: string
}

interface Entity {
  name: string
  category: string
  distance: number
  recommended: boolean
  lng: number
  lat: number
  type: string
}

@Component({
  components: { ModalComponent, InputText }
})
export default class SearchComponentDemo extends Vue {
  modalInstance: Modal | null = null
  modal: boolean = false
  searchValue = ''
  userLat: number | null = null
  userLng: number | null = null
  locationWatcher: number | null = null
  private classColorsStore = useStoreColors()
  private mapObjectsStore = useStoreMapObjects()
  classColors = {}

  showModal() {
    this.modal = true
  }

  icons: Icon[] = [
    { category: 'Recepcija', name: 'fa-circle-info' },
    { category: 'Restoran', name: 'fa-utensils' },
    { category: 'Sanitarija', name: 'fa-restroom' },
    { category: 'Masaža', name: 'fa-spa' }
  ]

  categories: Icon[] = []

  entities: Entity[] = [
    { name: 'Market Čikat', category: 'Market', distance: 0, recommended: true, lng: 14.448795604823943, lat: 44.53607283742093, type: 'Object' },
    { name: 'Restaurant Silver Bay', category: 'Restaurant', distance: 0, recommended: true, lng: 14.447068751462496, lat: 44.53490087800006, type: 'Object' },
    { name: 'Bakery -', category: 'Bakery', distance: 0, recommended: true, lng: 14.448098551570382, lat: 44.53506898707451, type: 'Object' },
    { name: 'Pitch 191', category: 'Superior', distance: 0, recommended: false, lng: 14.446451301726427, lat: 44.536085127276976, type: 'unit' }
  ]

  gjEntites = []

  selectedFeatures: Icon[] = []

  get filteredEntities() {
    const searchTerm = this.searchValue.toLowerCase()
    const selectedCategories = this.selectedFeatures.map((feature) => feature.category)

    if (this.searchValue.length === 0 && selectedCategories.length === 0) {
      return this.gjEntites.filter((entity) => entity.properties.recommended).sort((a, b) => a.properties.distance - b.properties.distance)
    }

    return this.gjEntites
      .filter((entity) => {
        if (!entity.properties.hasOwnProperty('type')) return false

        let matchesSearch = false

        if (entity.properties.type === 'unit') {
          if (searchTerm.length > 0 && selectedCategories.length === 0) {
            matchesSearch = entity.properties.brand.toLowerCase().includes(searchTerm) || entity.properties.number === searchTerm || searchTerm === entity.properties.brand.toLowerCase() + ' ' + entity.properties.number
            return matchesSearch
          }
        }

        if (entity.properties.type === 'Object') {
          matchesSearch = entity.properties.name.toLowerCase().includes(searchTerm)
          const matchesFeature = selectedCategories.length === 0 || selectedCategories.includes(entity.properties.category)

          if (searchTerm.length > 0) {
            return matchesSearch && matchesFeature
          } else {
            return matchesFeature
          }
        }

        return false
      })
      .sort((a, b) => a.properties.distance - b.properties.distance)
  }

  getIcon(category: string) {
    return this.icons.find((icon) => icon.category === category)?.name || ''
  }

  getEntitiesInCategory(category: string) {
    let entityCount = this.gjEntites.filter((entity) => entity.properties.category === category).length
    return entityCount > 1 ? entityCount + ' places' : entityCount + ' place'
  }

  getCategoryColor(color: string) {
    // const color = this.categoryColors.find(color => color.category === category)?.color || ''
    return color.length > 0 ? 'background-color: ' + color + ';padding: 4px;border-radius: 5px;color: #fff;font-size: 12px;' : ''
  }

  isUnit(category: string) {
    return this.gjEntites.filter((entity) => entity.properties.category === category && entity.properties.type === 'unit')?.length > 0
  }

  clearSearch() {
    this.searchValue = ''
  }

  featureClick(feature: Icon) {
    const index = this.selectedFeatures.indexOf(feature)
    if (index !== -1) {
      this.selectedFeatures.splice(index, 1)
    } else {
      this.selectedFeatures.push(feature)
    }
    console.log(this.selectedFeatures)
  }

  mounted() {
    const modalElement = document.getElementById('searchModal')
    if (modalElement) {
      this.modalInstance = new Modal(modalElement, { keyboard: false })
    }

    this.classColors = this.classColorsStore.getColors

    for (let obj of gj.features) {
      let objectCentroid = centroid(obj.geometry)
      obj.properties['lng'] = objectCentroid.geometry.coordinates[0]
      obj.properties['lat'] = objectCentroid.geometry.coordinates[1]

      if (obj.properties.hasOwnProperty('brand')) {
        obj.properties['color'] = this.classColorsStore.getColors[obj.properties.brand]
        obj.properties['type'] = 'unit'
        obj.properties['icon'] = 'fa-caravan'
        this.gjEntites.push(obj)
      } else {
        if (obj.properties.class.includes('objekt')) {
          let objectName = this.mapObjectsStore.getMapObjects.find((o: any) => obj.id === o.mapaId)
          if (objectName) {
            obj.properties['name'] = objectName.naziv
            obj.properties['category'] = objectName.nazivVrste
            obj.properties['recommended'] = objectName.recommended !== '0'
            obj.properties['type'] = 'Object'
          }
        }
        this.gjEntites.push(obj)
      }
    }

    for (let c of this.mapObjectsStore.getMapObjects) {
      let categoryExists = this.categories.find((cat) => c.naziv === cat.name)
      if (!categoryExists) {
        this.categories.push({ category: c.naziv, name: '' })
      }
    }

    console.log(this.gjEntites)
    console.log(this.categories)
    console.log(this.mapObjectsStore.getMapObjects)

    this.watchUserLocation()
  }

  beforeDestroy() {
    if (this.locationWatcher !== null) {
      navigator.geolocation.clearWatch(this.locationWatcher)
    }
  }

  closeModal() {
    this.modalInstance?.hide()
  }

  watchUserLocation() {
    if (navigator.geolocation) {
      this.locationWatcher = navigator.geolocation.watchPosition(
        (position) => {
          this.userLat = position.coords.latitude
          this.userLng = position.coords.longitude
          this.updateDistances()
        },
        (error) => {
          console.error('Error getting location: ', error)
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      )
    } else {
      console.error('Geolocation is not supported by this browser.')
    }
  }

  updateDistances() {
    if (this.userLat !== null && this.userLng !== null) {
      this.gjEntites.forEach((entity) => {
        entity.properties.distance = Number(this.calculateDistance(this.userLat as number, this.userLng as number, entity.properties.lat, entity.properties.lng))
      })
    }
  }

  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
    const toRad = (value: number) => (value * Math.PI) / 180
    const R = 6371

    const dLat = toRad(lat2 - lat1)
    const dLng = toRad(lng2 - lng1)

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c

    return distance.toFixed(2)
  }
}
</script>

<style scoped>
.search-modal {
  margin-top: 30px;
}

.delete,
.search-div {
  position: absolute;
  width: 40px;
  height: 100%;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #ccc;
  transition: all 0.3s;
}

.delete {
  right: 5px;
  font-size: 22px;
}

.search-div {
  left: 5px;
}

.form-group {
  position: relative;
}

.form-group input {
  width: 100%;
  height: 45px;
  padding: 0 20px 0 40px;
  font-size: 16px;
  line-height: 1.42857143;
  color: #555;
  background: #efefef;
  border: none;
  border-radius: 40px;
  box-shadow: none;
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
}

#searchModal .col-md-6.col-md-offset-3 {
  width: 100%;
  margin: 0;
  padding: 0 30px;
}

.search-header {
  display: flex;
  align-items: center;
}

.search-header svg {
  width: 24px;
}

.search-header h3 {
  margin-left: -24px;
  width: 100%;
  font-size: 25px;
  color: #0bae81;
}

.modal-dialog {
  max-width: 600px;
}

.modal-content {
  border: none;
}

.modal-body {
  padding: 0;
}

/* Fancybox Styles */
.fancybox-container a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.feature-buttons.centered {
  display: flex;
  align-items: flex-start;
  flex-wrap: nowrap;
  margin: 0 -30px;
  padding-left: 25px;
}

.feature-buttons.centered div {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  margin: 20px 10px;
  background: #08d39b;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  border-radius: 50px;
  cursor: pointer;
  transition: background 0.3s;
}

.feature-buttons.centered div:hover {
  background: #0bae81;
}

.feature-buttons.centered div i {
  margin-right: 5px;
  font-size: 20px;
}

.feature-button > span {
  display: flex;
  font-weight: normal;
  flex-direction: column;
}

.feature-button.active {
  background: #0bae81 !important;
}

.feature-button span span {
  font-size: 13px;
}

@media (min-width: 768px) {
  .feature-buttons.centered div:first-of-type {
    margin-left: 5px;
  }

  .feature-buttons.centered {
    flex-wrap: wrap;
  }

  .feature-buttons.centered div:hover i,
  .feature-buttons.centered div:hover span,
  .feature-buttons.centered div:hover small {
    background: transparent;
    color: white;
  }
}

.filter-text-heading {
  margin-top: 40px;
  font-size: 18px;
  font-weight: 700;
  color: #2e2e2e;
}

.filter-text-heading.green {
  color: #0bae81;
}

.entity-container {
  padding: 10px 0 20px;
  margin: 0;
  background: white;
  border-radius: 0 0 20px 20px;
}

.filtered-entities:not(:last-of-type),
.filtered-entities .card {
  border: none;
}

.filtered-entities .card {
  display: flex;
  flex-direction: row;
  padding: 10px;
  margin: 0;
  background: #efefef;
  border-radius: 25px;
  overflow: hidden;
  position: relative;
}

.filtered-entities .card:before {
  content: '';
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNjc0LjRweCIgaGVpZ2h0PSI1MjguM3B4IiB2aWV3Qm94PSIwIDAgNjc0LjQgNTI4LjMiIHN0eWxlPSJvdmVyZmxvdzp2aXNpYmxlO2VuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNjc0LjQgNTI4LjM7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHBhdGggZmlsbD0iI2Y3ZjdmNyIgZD0iTTkyLjYsNDUyLjdjLTk0LjgtOTYuOS0xMzAtMjU2LjktNDIuMi0zNTZsMC41LTAuNmMwLjEtMC4yLDAuMy0wLjMsMC40LTAuNWMxOC4yLTIwLjMsNDEuNi0zOCw3MC44LTUyICBjODEuMi0zOSwyODYuMS04NC44LDQ0NC4yLDI0LjdjMTI4LjYsODkuMSwxMzMsMTg4LjQsNjIuMywyNzMuN2MwLDAsMCwwLDAsMEw2MTQuNCwzNThjLTI0LjUsMjUuNi01NS44LDQ5LjgtOTIuNSw3MS44ICBDMzQ5LDUzMy41LDIxMy41LDU3Ni40LDkyLjYsNDUyLjd6Ii8+Cjwvc3ZnPg==);
  background-size: cover;
  background-position: 0;
  background-repeat: no-repeat;
  position: absolute;
  width: 100px;
  height: 180px;
  right: 0;
  top: -20px;
}

.filtered-entities .card:hover {
  cursor: pointer;
}

.filtered-entities-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 10px;
  z-index: 1;
}

.filtered-entities-content > :not(i) {
  z-index: 1;
}

.filtered-entities-content h2 {
  margin: 0 0 0px;
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: -0.5px;
  color: #4e4e4e;
}

.filtered-entities i {
  position: absolute;
  right: 0;
  font-size: 32px;
  color: hsl(163deg 84% 37%);
  z-index: 0;
  margin-right: 20px;
}

span.udaljenost {
  margin: 5px 0;
  font-weight: 600;
}

.close-modal {
  background: none;
  outline: none;
  border: none;
  cursor: pointer;
  z-index: 999;
}

.delete {
  color: hsl(163deg 84% 37%);
  cursor: pointer;
}

.entity-container {
  overflow: hidden;
}
</style>
