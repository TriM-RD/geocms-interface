<template>
  <div>
    <PaymentComponent></PaymentComponent>
    <MapFooter />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator'
import MapFooter from '@/components/footer/MapFooter.vue'
import PaymentComponent from '@/components/payment/PaymentComponent.vue'

@Component({
  components: {
    PaymentComponent,
    MapFooter
  }
})
export default class Payment extends Vue {}
</script>
