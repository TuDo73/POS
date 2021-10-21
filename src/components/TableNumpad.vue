<template>
  <div class="table-numpad">
    <div class="table-free-data">
      <div class="data-content">
        TABLE: {{ searchInput }}
        <div class="table-search-info" v-if="tableForSearch.searchActive">
          <span v-if="tableForSearch.isbusy">(open)</span>
          <span v-if="!tableForSearch.isbusy">(free)</span>
        </div>
      </div>
    </div>
    <div class="numpad">
      <div class="number-box">
        <ul class="number-list">
          <li class="number-item">
            <div class="number-btn" @click="clickNumBtn('7')">
              <span>7</span>
              <div class="overlay-btn"></div>
            </div>
          </li>
          <li class="number-item">
            <div class="number-btn" @click="clickNumBtn('8')">
              <span>8</span>
              <div class="overlay-btn"></div>
            </div>
          </li>
          <li class="number-item">
            <div class="number-btn" @click="clickNumBtn('9')">
              <span>9</span>
              <div class="overlay-btn"></div>
            </div>
          </li>
          <li class="number-item">
            <div class="number-btn" @click="clickNumBtn('4')">
              <span>4</span>
              <div class="overlay-btn"></div>
            </div>
          </li>
          <li class="number-item">
            <div class="number-btn" @click="clickNumBtn('5')">
              <span>5</span>
              <div class="overlay-btn"></div>
            </div>
          </li>
          <li class="number-item">
            <div class="number-btn" @click="clickNumBtn('6')">
              <span>6</span>
              <div class="overlay-btn"></div>
            </div>
          </li>
          <li class="number-item">
            <div class="number-btn" @click="clickNumBtn('1')">
              <span>1</span>
              <div class="overlay-btn"></div>
            </div>
          </li>
          <li class="number-item">
            <div class="number-btn" @click="clickNumBtn('2')">
              <span>2</span>
              <div class="overlay-btn"></div>
            </div>
          </li>
          <li class="number-item">
            <div class="number-btn" @click="clickNumBtn('3')">
              <span>3</span>
              <div class="overlay-btn"></div>
            </div>
          </li>
          <li class="number-item">
            <div class="number-btn" @click="clickNumBtn('0')">
              <span>0</span>
              <div class="overlay-btn"></div>
            </div>
          </li>
          <li class="number-item large-type">
            <div class="number-btn enter-btn" @click="clickNumBtn('enter')">
              <span>Enter</span>
              <div class="overlay-btn"></div>
            </div>
          </li>
          <li class="number-item">
            <div class="number-btn del-btn" @click="clickNumBtn('delete')">
              <span class="icon-backspace"></span>
              <div class="overlay-btn"></div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>  
</template>
<script>
  import { globalFunction } from '@/global/global.js'
  import { mapState } from 'vuex'

  export default {
    data() {
      return {
      };
    },

    computed: {
      ...mapState({
        tableForSearch: state => state.table.tableForSearch,
        searchInput: state => state.table.searchInput
      }),
    },

    components: {

    },

    methods: {
      clickNumBtn(val) {
        this.$store.dispatch('table/clickNumBtn', val);
      },
    },

    created() {
    }
  };
</script>
<style>
</style>