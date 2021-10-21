<template>
  <transition name="fade">
    <div class="loading-box" v-if="$store.state.helper.isShowLoading">
      <div class="loading-box-wrap">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </transition>
</template>

<script>
import { globalFunction } from '@/global/global.js'
export default {
  data() {
    return {
    };
  },

  components: {
  },

  methods: {
  }
};
</script>

<style>

</style>
