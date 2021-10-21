<template>
  <div class="order-box">
    <StatusBox/>
    <OrderListBox/>
  </div>
</template>

<script>
  import StatusBox from './StatusBox.vue'
  import OrderListBox from './OrderListBox.vue'

  export default {
    data() {
      return {};
    },
    components: {
      'StatusBox': StatusBox,
      'OrderListBox': OrderListBox
    }
  };
</script>

<style>

</style>
