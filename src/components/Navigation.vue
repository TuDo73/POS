<template>
  <div class="breadcumb">
    <ul class="list-menu">
      <li class="menu-item">
        <div class="breadcumb-item menu-item-home"
          @click="clickNavigationItem('')">
          <span class="icon-home"></span>
        </div>
      </li>
      <li class="menu-item"
        v-for="(category, index) in categoriesFilter" :key="index"
        @click="clickCategory(category)">
        <div class="breadcumb-item">
          {{category.name}}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import { globalFunction } from '@/global/global.js'
  import { mapState } from 'vuex'
  
  export default {
    data() {
      return {};
    },

    computed: {
      ...mapState({
        categoriesFilter: state => state.category.categoriesFilter
      })
    },

    methods: {
      openMenu() {
        let functionBox = document.querySelector('.function-box');
        let categoryBox = document.querySelector('.category-box');

        functionBox.classList.toggle('open');
        categoryBox.classList.toggle('open');
      },

      backToTable() {
        this.$router.push({ path: 'table' });
      },

      clickNavigationItem(item) {
        this.$store.dispatch('product/filterProductByCategory', item);
        this.$store.commit('product/setPagingProduct', 1);
      },

      clickCategory(category) {
        this.$store.dispatch('product/filterProductByCategory', category);
        this.$store.commit('product/setPagingProduct', 1);
      }
    }
  };
</script>

<style>

</style>
