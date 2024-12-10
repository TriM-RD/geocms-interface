<template>
  <div v-if="renderComponent">
    <div class="row">
      <div class="col-lg-4"></div>
      <div class="col-lg-4">
        <div class="input-group mt-3 mb-1">
          <label class="input-group-text text-truncate">
            {{ $t.longitude }}
          </label>
          <input
              type="text"
              class="form-control"
              placeholder="Longitude"
              @input="updateMarker"
              v-model="lngLat[0]"
              aria-label="Longitude"
          />
          <label class="input-group-text">{{ $t.latitude }}</label>
          <input
              type="text"
              class="form-control"
              placeholder="Latitude"
              @input="updateMarker"
              v-model="lngLat[1]"
              aria-label="Latitude"
          />
          <button
              class="btn btn-outline-info"
              type="button"
              @click="geoLocate"
          >
            {{ $t.get }}
          </button>
        </div>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-12 p-0">
        <div id="map" style="height: 50vh;"></div>
      </div>
    </div>
    <div class="row" v-show="showImageButton">
      <div class="col-6">
        <button
            class="btn btn-outline-secondary"
            @click.prevent="toggleImageLayer"
        >
          {{ imageLayerVisible ? 'Hide' : 'Show' }} Image Layer
        </button>
      </div>
      <div class="col-6">
        <button
            class="btn btn-outline-secondary"
            @click.prevent="changeStyle"
        >
          {{ isSatelliteView ? 'Switch to Def View' : 'Switch to Sat View' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-facing-decorator';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import { Manager } from '@/mechanics/mapPickerMechanic';
import {
  ObjectTemplate,
  MechanicAbstract,
  ObjectType,
  StatTypeEnum,
  ObjectTypeEnum,
  RegionType,
  RegionEnum,
} from '@cybertale/interface';
import router from '@/router';
import Loading from 'vue-loading-overlay';
import { Definitions } from '@/@geocms';
import { $t } from '@geocms/localization';
import { MapFunctions } from '@campsabout/mapbox';

import koversadaImage from '../assets/koversada.png';
import koversadaBigImage from '../assets/koversadaBig.png';

let campsaboutObject: any = null;

@Component({
  components: {
    Loading,
  },
})
export default class MapPickerComponent extends Vue {
  @Prop()
  object!: ObjectTemplate;

  lngLat: [number, number] = [0, 0];
  mechanic: MechanicAbstract =
      new Manager.Mechanic.MapPickerMechanic();
  regionType = RegionType;
  regionEnum = RegionEnum;
  statTypeEnum = StatTypeEnum;
  objectTypeEnum = ObjectTypeEnum;
  objectType = ObjectType;
  renderComponent = false;
  map!: any;
  marker: mapboxgl.Marker | null = null;
  imageLayerVisible = true;
  showImageButton = false;
  isSatelliteView = false;

  private classColors = {
    obala: '#f3f2e7',
    zemlja: '#dedfc4',
    cesta: '#e2e6e8',
    vegetacija: '#98b87c',
    parking_podloga: '#e2e6e8',
    'objekt wc roof1': '#f28586',
    'objekt wc roof2': '#f28586',
    'objekt podloga': '#f28586',
    bazen_podloga: '#e4e9e8',
    bazen: '#8decfe',
    billboard: '#ffffff',
    // New classes
    periphery: '#A7DD88',
    campground: '#f3f2e7',
    road: '#e2e6e8',
    parking: '#e0e0e0',
    pool: '#8decfe',
    patio: '#dedfc4',
    line: '#ffffff',
    line_white: '#ffffff',
    line_black: '#000000',
    grass: '#B4D894',
    vegetation: '#709F50',
    unit_base_gray: '#e2e6e8',
    unit_base_green: '#95D07B',
    fence: '#000000',
    hedge: '#e2e6e8',
    treetop_light: '#8FBE72',
    treetop_dark: '#709F50',
    coastline: 'transparent',
    object_roof_light: '#f28586',
    object_roof_dark: '#CF7273',
    object_roof_light_gray: '#e0e0e0',
    object_roof_dark_gray: '#bbbbbb',
    object_base: '#F2F2F2',
    playground: '#68b29e',
    tennis: '#d2836f',
    barrier: '#ffffff',
    barrier_red: '#D20808',
    // Jadranka
    zone_Cikat: '#E6C29F',
    zone_Slatina: '#D24E3D',
    zone_Bijar1: '#D24E3D',
    zone_Bijar2: '#4CB8BE',
    // Atea
    gaia_green_villas: '#bbbbbb',
    // Oliva
    mhPremium: '#a6846b',
    mhComfort: '#da4456',
    mhStandard: '#d6915b',
    pitchZone1: '#371758',
    pitchZone2: '#427d9c',
    pitchZone3: '#989543',
  };

  private campGeojson = MapFunctions.getEmptyGeojson();
  private labelsGeojson = MapFunctions.getEmptyGeojson();
  private clickableIds: any = { openModal: {}, openPopup: {} };
  private numberArr: any = {};

  get $t() {
    return $t;
  }

  mounted() {
    this.renderComponent = true;
  }

  @Watch('renderComponent')
  onRenderComponentChange(newVal: boolean) {
    if (newVal) {
      this.$nextTick(() => {
        console.log(newVal);
        this.init();
      });
    }
  }

  async initializeCampsaboutObject() {
    await fetch(
        'https://campsabout.com/mapAPI/typeSJColors.php?id=1&group=zaton'
    ).then(async (response) => {
      if (!response.ok) return;
      const data = await response.json();
      const result: { [index: string]: string } = {};
      Object.keys(data).forEach((element: string) => {
        result[element] = data[element][0].color;
      });
      this.classColors = Object.assign(this.classColors, result);
    });
    await this.callApi(
        'https://campsabout.com/camp/zaton/1/assets/gj/Zaton.json'
    ).then((data) => (this.campGeojson = data));
    await this.callApi(
        'https://campsabout.com/mapAPI/natpisi.php?id=1&group=zaton'
    ).then((data) => (this.labelsGeojson = data));
    await this.callApi(
        'https://campsabout.com/mapAPI/revision/getFeatures.php?propertyId=1&group=zaton&mapaids=*'
    ).then((data) => {
      this.numberArr = {};
      data.forEach((feature: any) => {
        if (!feature.noClick) {
          if (feature.openModal) {
            this.clickableIds.openModal[feature.mapId] = true;
          } else {
            this.clickableIds.openPopup[feature.mapId] = true;
          }
        }
      });
      data.forEach((feature: any) => {
        if (feature.number) {
          this.numberArr[feature.mapId] = feature.number;
        }
      });
    });
    campsaboutObject = {
      map: this.map,
      campGeojson: this.campGeojson,
      colors: MapFunctions.matchColorsWithIDs(
          this.campGeojson,
          this.classColors
      ),
      sortedCampGeojson: MapFunctions.sortLayers(this.campGeojson),
      labelsGeojson: this.labelsGeojson,
      is3d: false,
      units3D: null,
      billboard3D: null,
      advertisement: null,
      geolocate: null,
      directions: null,
      poly: null,
      language: 'en',
      onRouteChangeDel: null,
      clickableIds: this.clickableIds,
      numberArr: this.numberArr,
    };
    await MapFunctions.initMap(campsaboutObject);
  }

  private async callApi(url: string): Promise<any | null> {
    if (!url) return null;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(
            `Error: Received status code ${response.status} from ${url}`
        );
        return null;
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
      return null;
    }
  }

  changeStyle() {
    this.map.once('styledata', () => {
      this.addImageLayer();
      this.imageLayerVisible = true;
    });
    if (this.isSatelliteView) {
      this.map.setStyle('mapbox://styles/joso/clyprewpl00a901r18zm5gczr');
      this.isSatelliteView = false;
    } else {
      this.map.setStyle('mapbox://styles/joso/cltzjanet00mw01qub77penk0');
      this.isSatelliteView = true;
    }
  }

  updateMarker() {
    if (this.marker) {
      this.marker.setLngLat(this.lngLat);
    }
    this.object.Stats[StatTypeEnum.Value].Data = JSON.stringify(
        this.lngLat
    );
  }

  init() {
    let temp = null;
    if (this.object.Stats[StatTypeEnum.Value].Data) {
      temp = JSON.parse(this.object.Stats[StatTypeEnum.Value].Data);
    }

    if (
        temp === null ||
        router.currentRoute.value.name === Definitions.Entity.Add ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(
            String(router.currentRoute.value.params.id)
        )
    ) {
      this.geoLocate();
    } else {
      this.lngLat = [temp[0], temp[1]];
      this.initMap();
    }
  }

  initMap() {
    mapboxgl.accessToken =
        'pk.eyJ1Ijoiam9zbyIsImEiOiJjbDBpN3NnbWMwMDJlM2ptcng2bGIxazJjIn0.xuMyew046jayaAFfWnsfJQ';
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/joso/clyprewpl00a901r18zm5gczr',
      center: this.lngLat,
      zoom: 9,
    });

    this.map.on('load', () => {
      this.addMarker();
      this.addGeolocateControl();
      this.addImageLayer();
      this.initializeCampsaboutObject();
    });
  }

  addMarker() {
    if (this.map) {
      this.marker = new mapboxgl.Marker({
        draggable: true,
      })
          .setLngLat(this.lngLat)
          .addTo(this.map);

      this.marker.on('dragend', () => {
        const lngLat = this.marker!.getLngLat();
        this.lngLat = [lngLat.lng, lngLat.lat];
        this.updateMarker();
      });
    }
  }

  addGeolocateControl() {
    if (this.map) {
      const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      });
      this.map.addControl(geolocate);
    }
  }

  addImageLayer() {
    if (this.map) {
      this.map.addSource('my-source', {
        type: 'image',
        url: koversadaImage,
        coordinates: [
          [13.610872533, 45.136310612],
          [13.617992154, 45.136625937],
          [13.618265563, 45.130452494],
          [13.611145971, 45.130137161],
        ],
      });

      this.map.addLayer({
        id: 'my-layer',
        type: 'raster',
        source: 'my-source',
        paint: {
          'raster-fade-duration': 0,
          'raster-opacity': 0.5,
        },
      });

      this.map.addSource('mapbox-tileset', {
        type: 'image',
        url: koversadaBigImage,
        coordinates: [
          [13.59431264, 45.14664839],
          [13.62086774, 45.14728560],
          [13.62173370, 45.12959157],
          [13.5951652, 45.1289459],
        ],
      });

      this.map.addLayer({
        id: 'tileset-layer',
        type: 'raster',
        source: 'mapbox-tileset',
        paint: {
          'raster-opacity': 0.5,
          'raster-fade-duration': 100,
        },
      });

      if (
          localStorage.getItem('firmName') === 'trim' ||
          localStorage.getItem('firmName') === 'zaton' ||
          localStorage.getItem('firmName') === 'test'
      ) {
        this.showImageButton = true;
      }
    }
  }

  toggleImageLayer() {
    if (this.map) {
      if (this.imageLayerVisible) {
        this.map.setLayoutProperty('my-layer', 'visibility', 'none');
        this.map.setLayoutProperty('tileset-layer', 'visibility', 'none');
        this.map.setPaintProperty('camp-fill-layer', 'fill-opacity', 0);
        this.imageLayerVisible = false;
      } else {
        this.map.setLayoutProperty('my-layer', 'visibility', 'visible');
        this.map.setLayoutProperty('tileset-layer', 'visibility', 'visible');
        this.map.setPaintProperty('camp-fill-layer', 'fill-opacity', 0.5);
        this.imageLayerVisible = true;
      }
    }
  }

  geoLocate() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
          (position) => {
            this.lngLat = [
              position.coords.longitude,
              position.coords.latitude,
            ];
            this.updateMarker();
            this.initMap();
          },
          (error: any) => {
            console.error('Error getting location: ', error);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  beforeUnmount() {
    this.mechanic.UnsubscribeConditions();
    if (this.map) {
      this.map.remove();
    }
  }

  getComponent(_regionEnum: number, _objectEnum: number) {
    return RegionType.RegionTypes[_regionEnum].ObjectTypes[
        _objectEnum
        ].GetComponent();
  }
}
</script>

<style scoped>
@media only screen and (max-width: 480px) {
  .input-group-text {
    font-size: 14px;
    display: inline-block;
    max-width: 70px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>