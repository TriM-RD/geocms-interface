<template>
  <Loading v-model:active="isLoading"
           :can-cancel="false"
           :is-full-page="false"
           :loader=" 'dots'"/>

  <div class="graph-container">
    <div class="graph-controls">
      <button
        v-for="option in timeOptions"
        :key="option.value"
        @click="updateTimeRange(option.value)"
        :class="['btn', selectedTime === option.value ? 'btn-primary' : 'btn-outline-primary']"
      >
        {{ option.label }}
      </button>
    </div>
    <v-chart
      v-if="chartOptions"
      :option="chartOptions"
      autoresize
      style="height: 400px; width: 100%;"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { use } from 'echarts/core'
import VChart from 'vue-echarts'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  DatasetComponent
} from 'echarts/components'
import Loading from 'vue-loading-overlay' // Import Loading component

use([
  CanvasRenderer,
  LineChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  DatasetComponent
])

interface DataPoint {
  x: number
  y: number
}

interface TimeOption {
  label: string
  value: number
}

export default defineComponent({
  name: 'GraphComponent',
  components: {
    Loading,
    VChart
  },

  setup () {
    const timeOptions = ref<TimeOption[]>([
      { label: '15 Min', value: 15 }, // Set 15 Min as the default
      { label: '30 Min', value: 30 },
      { label: '1 Hour', value: 60 },
      { label: '4 Hours', value: 240 },
      { label: '8 Hours', value: 480 },
      { label: '12 Hours', value: 720 },
      { label: '1 Day', value: 1440 },
      { label: '3 Days', value: 4320 },
      { label: '1 Week', value: 10080 }
    ])

    const selectedTime = ref(15) // Default selected time is 15 minutes
    const rawData = ref<DataPoint[]>([])
    const chartOptions = ref<any>(null)
    const isLoading = ref(false)

    const filterData = () => {
      const now = Date.now()
      const startTime = now - selectedTime.value * 60 * 1000

      // Convert timestamps to milliseconds and filter
      const filteredData = rawData.value
        .map(point => ({
          x: point.x * 1000, // Convert to milliseconds
          y: point.y
        }))
        .filter((point) => point.x >= startTime)
        .sort((a, b) => a.x - b.x) // Ensure data is sorted by timestamp

      chartOptions.value = {
        animation: true,
        tooltip: {
          trigger: 'axis',
          formatter: function (params: any) {
            const date = new Date(params[0].value[0])
            return `${date.toLocaleTimeString()}: ${params[0].value[1]} Clients`
          }
        },
        xAxis: {
          type: 'time',
          boundaryGap: false,
          axisLabel: {
            formatter: (value: number) => {
              return new Date(value).toLocaleTimeString()
            }
          }
        },
        yAxis: {
          type: 'value',
          name: 'Clients',
          min: 0
        },
        series: [
          {
            name: 'Total Clients',
            type: 'line',
            data: filteredData.map((point) => [point.x, point.y]),
            smooth: true,
            lineStyle: {
              color: '#007bff'
            },
            areaStyle: {
              color: 'rgba(0, 123, 255, 0.3)'
            }
          }
        ]
      }
    }

    const fetchData = async () => {
      isLoading.value = true
      try {
        const response = await fetch('https://tri-m.app/ecabinet/graph.php')
        const result = await response.json()

        if (result.status === 'success') {
          rawData.value = result.data.map((point: any) => ({
            x: Number(point.x), // Ensure timestamp is a number
            y: Number(point.y) // Ensure value is a number
          }))
          filterData()
        } else {
          console.error(result.message)
        }
      } catch (error) {
        console.error('Error fetching graph data:', error)
      } finally {
        isLoading.value = false
      }
    }

    const updateTimeRange = (minutes: number) => {
      selectedTime.value = minutes
      filterData()
    }

    onMounted(() => {
      fetchData()
      const interval = setInterval(fetchData, 60000) // Update every minute

      return () => {
        clearInterval(interval)
      }
    })

    return {
      timeOptions,
      selectedTime,
      chartOptions,
      isLoading,
      updateTimeRange
    }
  }
})
</script>

<style scoped>
.graph-container {
  padding: 1rem;
}

.graph-controls {
  margin-bottom: 1rem;
}

.btn {
  margin-right: 0.5rem;
  padding: 0.5rem 1rem;
}
</style>
