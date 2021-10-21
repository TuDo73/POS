<template>
  <div class="category-body">
    <div class="products-box">
      <ul class="product-list-data">
        <li class="product-item"
          v-for="product in allProductLazyLoad"
          :key="product.code"
          @click="selectProduct(product)">
          <div class="product-link">
            <div class="product-name">
              {{product.name}}
            </div>
            <div class="product-price">
              <span>{{product.price}}€</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="product-list-scroll">
      <div class="scroll-box-wrapper">
        <div class="scroll-btn scroll-up" @click="handleScrollProductList('up')">
          <span class="icon-arrow-thick-up"></span>
        </div>
        <div class="paging">
          {{pagingProduct}}
        </div>
        <div class="scroll-btn scroll-down" @click="handleScrollProductList('down')">
          <span class="icon-arrow-thick-down"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { globalFunction } from '@/global/global.js'
  import { mapState } from 'vuex'

  export default {
    data() {
      return {};
    },

    components: {
    },

    computed: {
      ...mapState({
        products: state => state.product.products,
        allProductLazyLoad: state => state.product.allProductLazyLoad,
        pagingProduct: state => state.product.pagingProduct,
      })
    },

    methods: {
      selectProduct(product) {
        this.$store.commit('order/setStateForAddNewProductToOrder', true);
        this.$store.dispatch('order/setProductToOrderLines', [product]);
      },

      handleScrollProductList(direction) {
        this.$store.dispatch('product/handleProductDataWhenScroll', direction);
      }
    },

    created() {
      this.$store.commit('order/setStateForAddNewProductToOrder', false);
      this.$store.commit('product/setPagingProduct', 1);
    },
  };
</script>

<style>

</style>
