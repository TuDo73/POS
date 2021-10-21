<template>
  <div class="wrapper">
    <div class="drag-area-wrap" v-if="!isActiveTogo && !isOnSmallScreen">
      <div class="drag-area-container">
        <div class="drag-area" v-if="isEditTable" @click.self="doDeactive()" :style="{background: areaBgColor}">
          <VueDragResize v-for="(table, index) in tablesForShow" :key="index" 
            :w="table.width" 
            :h="table.height" 
            :x="table.left" 
            :y="table.top" 
            :isActive="table.active" 
            :parentLimitation="true" 
            @resizing="resize($event, index)" 
            @dragging="resize($event, index)" 
            @resizestop="onDragstop"
            @dragstop="onDragstop" 
            @activated="onActiveTable(index)" 
            @deactivated="onDeactiveTable(index)" 
          >
            <div class="table" :class="{ circle : table.type === 'circle' }" :style="{ background: table.color} ">
              <h3>{{table.name}}</h3>
            </div>
          </VueDragResize>
        </div>

        <div class="no-drag-area" v-if="!isEditTable" :style="{ background: areaBgColor }">
          <div class="item-no-drag" v-for="(table, index) in tablesForShow" :key="index"
            @click="doSelectTable(table)"
            :class="{ circle : table.type === 'circle' }" 
            :style="{ width: table.width + 'px', height: table.height + 'px', left: table.left + 'px', top: table.top + 'px', background: table.color }">
            <div class="table-data-wrapper">
              <div class="table-name">
                Table {{table.name}}
              </div>
              <div class="table-time-counter" v-if="table.username == user.username">
                {{table.startTimeCounter}}
              </div>
              <div class="table-icon">
                <span class="icon-chair"></span>
              </div>
              <div class="table-user-info" v-if="table.isbusy">
                {{table.userFullName}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="drag-area-smallscreen" v-if="!isActiveTogo && isOnSmallScreen">
      <div class="drag-area-container">
        <div class="no-drag-area" v-if="!isEditTable" :style="{ background: areaBgColor }">
          <div class="item-no-drag" v-for="(table, index) in tablesForShow" :key="index"
            @click="doSelectTable(table)"
            :class="{ circle : table.type === 'circle' }" 
            :style="{background: table.color}">
            <div class="table-data-wrapper">
              <div class="table-name">
                Table {{table.name}}
              </div>
              <div class="table-time-counter" v-if="table.username == user.username">
                {{table.startTimeCounter}}
              </div>
              <div class="table-icon">
                <span class="icon-chair"></span>
              </div>
              <div class="table-user-info" v-if="table.isbusy">
                {{table.userFullName}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { globalFunction } from '@/global/global.js'
  import VueDragResize from 'vue-drag-resize';
  import { mapState } from 'vuex'
  
  export default {
    components: {
      VueDragResize,
    },

    data() {
      return {
        interval: null,
      };
    },

    computed: {
      ...mapState({
        isActiveTogo: state => state.table.isActiveTogo,
        isEditTable: state => state.table.isEditTable,
        areaBgColor: state => state.table.areaBgColor,
        tables: state => state.table.tables,
        allTablesData: state => state.table.allTablesData,
        user: state => state.user.user,
        users: state => state.user.users,
        isOnSmallScreen: state => state.helper.isOnSmallScreen,
        isGetOrdersFinished: state => state.helper.isGetOrdersFinished,
        orders: state => state.order.orders,
      }),

      tablesForShow() {
        let tablesTmp = [...this.tables];
        
        for(let user of this.users) {
          for(let table of tablesTmp) {
            if(user.username == table.username) {
              table.userFullName = user.fullname;
              
              // thêm data đếm thời gian của bàn đã có order
              if(this.isGetOrdersFinished) {
                for(let order of this.orders) {
                  if(order.tableCode == table.code) {
                    table.startTime = order.startTime;
                    table.startTimeCounter = '00:00';
                  }
                }
              }
            }
          }
        }
        
        return tablesTmp;
      }
    },

    sockets: {
      SELECT_TABLE(data) {
        let allTablesTmp = [...this.allTablesData];

        for (let table of allTablesTmp) {
          if (table.code === data.tableCode) {
            table.username = data.userName;
            table.userFullName = data.userFullName;
            table.totalprice = data.totalPrice;
            table.isbusy = true;
          }
        }

        this.$store.commit('table/setDataTable', allTablesTmp);
      },

      QUIT_TABLE(data) {
        let allTablesTmp = [...this.allTablesData];

        for (let table of allTablesTmp) {
          if (table.code === data.code) {
            table.username = data.userName;
            table.userFullName = data.userFullName;
            table.isbusy = false;
            table.totalprice = 0;
          }
        }

        this.$store.commit('table/setDataTable', allTablesTmp);
      }
    },

    methods: {
      resize(newRect, index) {
        this.$store.dispatch('table/resize', [newRect, index]);
      },
      
      onDragstop(newRect) {
        this.$store.dispatch('table/onDragstop', newRect);
      },

      onActiveTable(index) {
        this.$store.dispatch('table/onActiveTable', index);
      },

      onDeactiveTable(index) { // luôn run khi trạng thái active của bàn bị thay đổi
        this.$store.dispatch('table/onDeactiveTable', index);
      },

      doDeactive() {
        this.$store.dispatch('table/doDeactive');
      },

      async doSelectTable(table) {
        this.$store.dispatch('table/selectTable', [table, this.user.username, this.user.fullname]);
      },

      updateCurrentTime: function() {
        for(let table of this.tablesForShow) {
          if(globalFunction.checkValid(table.startTime)) {
            let now = new Date().getTime();
            let distance = now - table.startTime;

            let strTimeCounter = globalFunction.timeCounter(distance);
            
            table.startTimeCounter = strTimeCounter;
          }
        }
        this.$forceUpdate();
      }
    },

    created() {
      this.interval = setInterval(this.updateCurrentTime, 1000);
    },

    destroyed() {
      clearInterval(this.interval);
    },
  };
</script>

<style>

</style>
