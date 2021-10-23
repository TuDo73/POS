<template>
  <div class="body-wrapper height-auto">
    <Header />
    <main>
      <PrintOrderPayment
        v-if="queryUrl == '' || queryUrl == 'retour' || queryUrl == 'verkaufs'"
      />
      <PrintCloseSession v-if="queryUrl == 'abschluss'" />

      <div class="print-box" :class="{ 'on-smallscreen': isOnSmallScreen }">
        <div class="btn-print do-print" @click="doPrint()">
          <span class="icon-print-box icon-printer"></span>
          <span class="text-box">In</span>
        </div>

        <!-- trường hợp in hóa đơn của order -->
        <div
          class="btn-print do-print"
          v-if="queryUrl == '' || queryUrl == 'retour'"
        >
          <span class="icon-print-box icon-printer"></span>
          <span class="text-box">In Bewirtungsbeleg</span>
        </div>

        <div
          class="btn-print do-next"
          @click="newOrder()"
          v-if="
            queryUrl == '' || queryUrl == 'retour' || queryUrl == 'verkaufs'
          "
        >
          <span class="icon-print-box icon-arrow-outline-right"></span>
          <span class="text-box">Đơn hàng mới</span>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { globalFunction } from "@/global/global.js";
import { mapState } from "vuex";
import Header from "@/components/Header.vue";
import PrintOrderPayment from "@/components/elements/print/PrintOrderPayment.vue";
import PrintCloseSession from "@/components/elements/print/PrintCloseSession.vue";
import CompanyFetchingService from "@/mixins/CompanyFetchingService";
import UserDataService from "@/mixins/UserDataService";
import OrderService from "@/services/OrderService.js";
import TableService from "@/services/TableService";

export default {
  mixins: [CompanyFetchingService, UserDataService],

  components: {
    Header: Header,
    PrintOrderPayment: PrintOrderPayment,
    PrintCloseSession: PrintCloseSession,
  },

  data() {
    return {
      queryUrl: "",
    };
  },

  computed: {
    ...mapState({
      isOnSmallScreen: (state) => state.helper.isOnSmallScreen,
      tableOrdered: (state) => state.table.tableOrdered,
      orders: (state) => state.order.orders,
      orderSelected: (state) => state.order.orderSelected,
      user: (state) => state.user.user,
      sessionUser: (state) => state.sessionUser.sessionUser,
      isPaymentCash: (state) => state.helper.isPaymentCash,
      allTablesData: (state) => state.table.allTablesData,
    }),
  },

  methods: {
    doPrint() {
      window.print();

      if (this.queryUrl == "abschluss") {
        this.$store.dispatch("user/closeSession");
      }
    },

    async newOrder() {
      this.$store.commit("helper/showLoading", true);

      let data = { ...this.orderSelected };
      let tableCodeOrder = data.tableCode;

      if (this.queryUrl == "verkaufs") {
        // xử lý nếu là in verkaufs
        let ordersTmp = globalFunction.deepCloneObj(this.orders);

        for (let i = ordersTmp.length; i--; ) {
          if (ordersTmp[i].ref == data.ref) {
            ordersTmp.splice(i, 1);
          }
        }
        this.$store.commit("order/setOrders", ordersTmp);

        OrderService.save().then(() => {
          this.$store.commit("helper/showLoading", false);
          this.$router.push({ path: "table" });
        });

        return;
      }

      TableService.getAll().then(() => {
        let tableOrderedTmp = this.allTablesData.filter(
          (table) => table.code == tableCodeOrder
        );
        this.$store.commit("table/setTableOrdered", tableOrderedTmp[0]);

        let goToHome = this.orders.filter(
          (order) => order.tableCode == this.tableOrdered.code
        );

        data.session_code = this.sessionUser.code;
        data.is_cash = this.isPaymentCash;

        if (this.queryUrl == "retour") {
          // xử lý nếu là order retour
          data.is_cash = true;
          goToHome = [];
        }

        if (data.endTime == "") {
          let currentTime = new Date().getTime();
          data.endTime = currentTime;
        }

        OrderService.addOrder(data).then((orderResp) => {
          if (orderResp.successful) {
            if (goToHome.length > 1) {
              // về home sau khi in hóa đơn vì còn bàn đã chọn có nhiều tab
              this.$store.dispatch("order/removeOrder", data);

              if (goToHome[0].isOrderTogo) {
                // trường hợp trở về home mà là order to-go
                let tableCodeTmp = goToHome[0].tableCode;

                for (let order of this.orders) {
                  // gán giá trị order ref ở trường hợp trở về home và là order to-go
                  if (order.tableCode == tableCodeTmp) {
                    this.$store.commit(
                      "table/setValueRefOrderTogoSelected",
                      order.ref
                    );

                    break;
                  }
                }
              }

              OrderService.save().then(() => {
                this.$store.commit("helper/showLoading", false);
                this.$router.push({ path: "home" });
              });
            } else {
              // về chọn bàn sau khi in hóa đơn
              (async () => {
                if (this.queryUrl != "retour") {
                  // trường hợp là hóa đơn thường
                  let tableTmp = { ...this.tableOrdered };

                  tableTmp.totalprice = 0;
                  tableTmp.username = "";
                  tableTmp.fullname = "";
                  tableTmp.isbusy = false;

                  let link = globalFunction.baseUrl + "table/add";
                  let tableResponse = await globalFunction.request(
                    link,
                    tableTmp
                  );
                  if (tableResponse.successful) {
                    this.$socket.emit("QUIT_TABLE", tableTmp);

                    this.$store.dispatch("order/removeOrder", data);
                    OrderService.save().then(() => {
                      this.$store.commit("helper/showLoading", false);
                      this.$router.push({ path: "table" });
                    });
                  }
                } else {
                  // trường hợp là hóa đơn retour
                  this.$store.dispatch("order/removeOrder", data);
                  OrderService.save().then(() => {
                    this.$store.commit("helper/showLoading", false);
                    this.$router.push({ path: "table" });
                  });
                }
              })();
            }
          }
        });
      });
    },

    detectQueryUrl() {
      this.queryUrl = this.$route.query.type;
      if (typeof this.queryUrl == "undefined") {
        this.queryUrl = "";
      }
    },
  },

  created() {
    this.detectQueryUrl();
    this.$store.dispatch("helper/hideAllKeyboard");
  },

  mounted() {},
};
</script>

<style></style>
