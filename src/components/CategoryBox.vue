<template>
  <div class="category-box">
    <div class="category-header" v-if="!isOnSmallScreen">
      <div class="category-page-control prev-btn"
        @click="changePage('prev')"
        v-if="categories.length > 5">
        <span class="icon-cheveron-left"></span>
      </div>
      <ul class="list-data">
        <li class="list-item"
          v-for="(category, index) in catPaging"
          :key="index"
          @click="clickCategory(category)">
          <div class="list-item-btn">
            <span>
              {{category.name}}
            </span>
          </div>
        </li>
      </ul>
      <div class="category-page-control next-btn"
        @click="changePage('next')"
        v-if="categories.length > 5">
        <span class="icon-cheveron-right"></span>
      </div>
    </div>

    <div class="category-header" v-if="isOnSmallScreen">
      <div class="category-page-control prev-btn"
        @click="changePage('prev')"
        v-if="categories.length > 3">
        <span class="icon-cheveron-left"></span>
      </div>
      <ul class="list-data">
        <li class="list-item"
          v-for="(category, index) in catPaging"
          :key="index"
          @click="clickCategory(category)">
          <div class="list-item-btn">
            <span>
              {{category.name}}
            </span>
          </div>
        </li>
      </ul>
      <div class="category-page-control next-btn"
        @click="changePage('next')"
        v-if="categories.length > 3">
        <span class="icon-cheveron-right"></span>
      </div>
    </div>

    <ProductBox/>
  </div>
</template>

<script>
  import { globalFunction } from '@/global/global.js'
  import { mapState } from 'vuex'
  import ProductBox from '@/components/ProductBox.vue'

  export default {
    data() {
      return {};
    },

    components: {
      'ProductBox': ProductBox
    },

    computed: {
      ...mapState({
        isOnSmallScreen: state => state.helper.isOnSmallScreen,
        categories: state => state.category.categories,
        catPaging: state => state.category.catPaging,
      })
    },

    methods: {
      changePage(direction) {
        this.$store.dispatch('category/handleChangeCatePage', direction);
      },

      clickCategory(category) {
        this.$store.dispatch('product/filterProductByCategory', category);
        this.$store.commit('product/setPagingProduct', 1);
      }
    },

    created() {
      this.$store.commit('category/setCategories');
      this.$store.dispatch('category/setCatPaging');
    },
  };
</script>

<style>

</style>
