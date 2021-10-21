<template>
  <div class="status-box">
    <div class="status-box-item">
      User: {{order.fullName}}
    </div>
    <div class="status-box-item">
      <template v-if="!tableOrdered.isTogo">
        Table: {{order.tableName}}
      </template>
      <template v-else>
        Order to-go
      </template>
    </div>
    <div class="status-box-item">
      SUM: {{order.totalPrice}}€
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
        orderSelected: state => state.order.orderSelected,
        allTablesData: state => state.table.allTablesData,
        users: state => state.user.users,
        tableOrdered: state => state.table.tableOrdered,
      }),

      order() {
        let userFilter = this.users.filter(user => user.username == this.orderSelected.userCode);
        let tableFilter = this.allTablesData.filter(table => table.code == this.orderSelected.tableCode);
        
        return {
          fullName: globalFunction.checkValid(userFilter[0]) ? userFilter[0].fullname : '',
          tableName: globalFunction.checkValid(tableFilter[0]) ? tableFilter[0].name : '',
          totalPrice: this.orderSelected.totalPrice
        }
      }
    },

    created() {},
  };
</script>

<style>

</style>
