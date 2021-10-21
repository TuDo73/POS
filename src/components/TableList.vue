<template>
  <div class="table-list-wrap">
    <div class="filter-btn-wrap">
      <div class="filter-btn filter-open-table" :class="{'is-active': isOpen}" @click="setIsOpen(true)">OPEN</div>
      <div class="filter-btn filter-free-table" :class="{'is-active': !isOpen}" @click="setIsOpen(false)">FREE</div>
    </div>
    <div class="table-list">
      <div class="table-list-item"
        v-for="table in tables.status"
        :key="table.code"
        :class="[isOpen ? 'open-table' : 'free-table']"
        @click="selectTable(table)"
      >
        <div class="table-name">
          Table {{table.name}}
        </div>
        <div class="table-info"
          v-if="isOpen"
        >
          <div class="table-price">
            {{table.totalprice}}€
          </div>
          <div class="table-user">
            {{table.userFullName}}
          </div>
        </div>
      </div>

      <div class="no-result" v-if="tables.status.length == 0">
        No table is <span v-if="isOpen">open</span><span v-if="!isOpen">free</span>
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
        allTablesData: state => state.table.allTablesData,
        isOpen: state => state.table.isOpen,
        users: state => state.user.users,
        user: state => state.user.user,
      }),

      tables() {
        let tmp = this.isOpen ? this.allTablesData.filter(table => table.isbusy == true && table.isTogo == false) : this.allTablesData.filter(table => table.isbusy == false && table.isTogo == false);

        for (let user of this.users) {
          for (let table of tmp) {
            if (user.username == table.username) {
              table.userFullName = user.fullname;
            }
          }
        }

        return {
          status: tmp
        }
      }
    },

    methods: {
      setIsOpen(val) {
        this.$store.commit('table/setIsOpen', val);
      },

      selectTable(table) {
        this.$store.dispatch('table/selectTable', [table, this.user.username, this.user.fullname]);
      }
    },

    created() {
      this.setIsOpen(true);
    },
  };
</script>

<style>

</style>
