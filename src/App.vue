<template>
  <div id="app">
    <router-view />
    <LoadingBox />
    <Popup />
  </div>
</template>

<script>
import { globalFunction } from "@/global/global.js";
import LoadingBox from "@/components/LoadingBox.vue";
import Popup from "@/components/Popup.vue";
import { mapState } from "vuex";
import OrderService from "@/services/OrderService.js";

export default {
  name: "App",

  data() {
    return {
      windowWidth: 0,
      windowHeight: 0,
    };
  },

  computed: {
    ...mapState({
      isOnSmallScreen: (state) => state.helper.isOnSmallScreen,
      user: (state) => state.user.user,
      users: (state) => state.user.users,
      allTablesData: (state) => state.table.allTablesData,
      users: (state) => state.user.users,
      order: (state) => state.order.order,
      orders: (state) => state.order.orders,
      orderTargetMoveDish: (state) => state.order.orderTargetMoveDish,
      orderToMoveDish: (state) => state.order.orderToMoveDish,
      dataMoveDishSocket: (state) => state.tableFunction.dataMoveDishSocket,
      orderSelected: (state) => state.order.orderSelected,
      dataChangeUserSocket: (state) => state.tableFunction.dataChangeUserSocket,
      ordersToChangeUser: (state) => state.tableFunction.ordersToChangeUser,
    }),
  },

  sockets: {
    CHECK_LOGIN(data) {
      let currentRoute = this.$route.name;
      if (currentRoute !== "Login") {
        if (data.userName == this.user.username) {
          if (data.loginTime > this.user.loginTime) {
            this.$socket.emit("ALREADY_LOGIN", data);
          }
        }
      }
    },

    ALREADY_LOGIN(data) {
      if (
        this.user.username == data.userName &&
        this.user.loginTime == data.loginTime
      ) {
        this.$router.push({ path: "/" });
        this.$store.commit("user/setStateUserAlreadyLogin", true);
      }
    },

    CONFIRM_MOVE_DISH(data) {
      if (globalFunction.checkValid(this.user.username)) {
        this.$store.commit("tableFunction/setDataMoveDishSocket", data);
        let currentOrderLines = globalFunction.deepCloneObj(
          this.orderToMoveDish.orderLines
        );

        if (data.isNewTable) {
          // khi bàn rỗng
          let userNameTarget = data.userCodeTarget;

          if (this.user.username == userNameTarget) {
            // chỉ thực hiện move dish ở bàn thuộc bồi muốn move dish
            // xử lý data của bàn hiện tại
            this.$store.dispatch(
              "order/handleCurrentOrderAfterMoveDish",
              currentOrderLines
            );

            this.$store.commit("helper/showLoading", true);

            // tạo bàn mới
            let fullName = this.users.filter(
              (user) => user.username == userNameTarget
            )[0].fullname;
            let tableSelected = this.allTablesData.filter(
              (table) => table.code == data.tableCode
            )[0];

            this.$store.dispatch("table/selectTable", [
              tableSelected,
              userNameTarget,
              fullName,
              false,
            ]);

            // tạo order cho bàn
            let newOrder = {};
            let currentTime = new Date().getTime();
            let tableTotalPrice = this.orderTargetMoveDish.totalPrice;

            newOrder = globalFunction.deepCloneObj(this.order);
            newOrder.tableCode = tableSelected.code;
            newOrder.userCode = userNameTarget;
            newOrder.ref = userNameTarget + currentTime;
            newOrder.orderLines = [];
            newOrder.startTime = currentTime;
            newOrder.orderLines = data.dataOrder.orderLines;
            newOrder.isActive = false;
            newOrder.totalPrice = tableTotalPrice;

            // thực hiện move dish
            this.$store.commit("order/setNewOrderToOrders", newOrder);
            OrderService.save().then(() => {
              // lưu bàn mới lên server
              (async () => {
                tableSelected.totalprice = newOrder.totalPrice;
                tableSelected.username = newOrder.userCode;
                tableSelected.isbusy = true;
                let urlTable = globalFunction.baseUrl + "table/add";
                let tableResponse = await globalFunction.request(
                  urlTable,
                  tableSelected
                );

                this.$store.dispatch("order/calculateOrder");
                this.$store.dispatch("popup/updatePopupState", false);
                this.$store.dispatch("order/showHidePopupMoveDish", false);

                // đưa data table lên socket
                let tableData = {};
                tableData.tableCode = newOrder.tableCode;
                tableData.userName = newOrder.userCode;
                tableData.userFullName = this.users
                  .filter((user) => user.username == newOrder.userCode)
                  .reduce((users, user) => {
                    return user.fullname;
                  }, []);
                tableData.totalPrice = newOrder.totalPrice;
                tableData.isbusy = true;
                this.$socket.emit("SELECT_TABLE", tableData);

                this.$store.commit("helper/showLoading", false);
              })();
            });
          }
        } else {
          // khi bàn busy
          if (!data.isDifferentUser) {
            // khi bàn move dish là của bồi hiện tại
            if (this.user.username == data.userCodeTarget) {
              // chỉ thực hiện move dish ở bàn thuộc bồi muốn move dish
              this.$store.commit("helper/showLoading", true);

              // xử lý data của bàn hiện tại
              this.$store.dispatch(
                "order/handleCurrentOrderAfterMoveDish",
                currentOrderLines
              );

              this.$store.commit(
                "order/updateOrders",
                this.orderTargetMoveDish
              );
              OrderService.save().then(() => {
                this.$store.dispatch("order/calculateOrder");
                this.$store.dispatch("popup/updatePopupState", false);
                this.$store.dispatch("order/showHidePopupMoveDish", false);

                this.$store.commit("helper/showLoading", false);
              });
            }
          } else {
            // khi bàn move dish là của bồi khác
            let userFulNameOrigin = this.users.filter(
              (user) => user.username == data.userCodeOrigin
            )[0].fullname;
            this.$store.commit(
              "tableFunction/setUserMoveDishTarget",
              userFulNameOrigin
            );

            let tableTarget = this.allTablesData.filter(
              (table) => table.code == data.tableCode
            )[0].name;
            this.$store.commit(
              "tableFunction/setTableMoveDishTarget",
              tableTarget
            );

            if (this.user.username == data.userCodeOrigin) {
              // xử lý ở phía bồi muốn move dish
              this.$store.commit("helper/setStateLoadingPopupMoveDish", true);
            }

            if (this.user.username == data.userCodeTarget) {
              // xử lý ở phía bồi nhận move dish
              let currentRoute = this.$route.name;
              if (currentRoute !== "Payment" && currentRoute !== "Print") {
                this.$store.dispatch("popup/updatePopupState", true);
                this.$store.dispatch(
                  "order/showHidePopupConfirmMoveDish",
                  true
                );
              }
            }
          }
        }
      }
    },

    CANCEL_MOVE_DISH() {
      if (globalFunction.checkValid(this.user.username)) {
        if (this.user.username == this.dataMoveDishSocket.userCodeOrigin) {
          this.$store.dispatch("popup/updatePopupState", false);
          this.$store.dispatch("order/showHidePopupMoveDish", false);
        }

        if (this.user.username == this.dataMoveDishSocket.userCodeTarget) {
          this.$store.dispatch("popup/updatePopupState", false);
          this.$store.dispatch("order/showHidePopupConfirmMoveDish", false);
        }
      }
    },

    RECEIVE_MOVE_DISH() {
      if (globalFunction.checkValid(this.user.username)) {
        if (this.user.username == this.dataMoveDishSocket.userCodeOrigin) {
          // xử lý ở phía bồi muốn move dish
          let currentOrderLines = globalFunction.deepCloneObj(
            this.orderToMoveDish.orderLines
          );

          // xử lý data của bàn hiện tại
          this.$store.dispatch(
            "order/handleCurrentOrderAfterMoveDish",
            currentOrderLines
          );
          this.$store.commit("order/updateOrders", this.orderSelected);

          this.$store.commit("helper/showLoading", true);
          OrderService.save().then(() => {
            this.$store.dispatch("order/calculateOrder");
            this.$store.dispatch("popup/updatePopupState", false);
            this.$store.dispatch("order/showHidePopupMoveDish", false);
            this.$store.commit("helper/setStateLoadingPopupMoveDish", false);

            this.$store.commit("helper/showLoading", false);
          });
        }

        if (this.user.username == this.dataMoveDishSocket.userCodeTarget) {
          // xử lý ở phía bồi nhận move dish
          let currentOrderLines = globalFunction.deepCloneObj(
            this.dataMoveDishSocket.dataOrder.orderLines
          );

          // xử lý data của bàn hiện tại
          this.$store.dispatch(
            "order/handleOrderReceiveMoveDish",
            this.dataMoveDishSocket.dataOrder
          );

          this.$store.commit("helper/showLoading", true);
          OrderService.save().then(() => {
            this.$store.dispatch("order/calculateOrder");

            this.$store.commit("helper/showLoading", false);
          });
        }
      }
    },

    CONFIRM_CHANGE_USER(data) {
      if (globalFunction.checkValid(this.user.username)) {
        this.$store.commit("tableFunction/setDataChangeUserSocket", data);

        if (this.user.username == data.userOrigin) {
          // xử lý phía user muốn đổi bàn
          this.$store.commit("helper/setStateLoadingPopupChangeUser", true);
        }

        if (this.user.username == data.userTarget) {
          // xử lý phía user nhận bàn
          let currentRoute = this.$route.name;
          if (currentRoute !== "Payment" && currentRoute !== "Print") {
            this.$store.dispatch("popup/updatePopupState", true);
            this.$store.dispatch("order/showHidePopupConfirmChangeUser", true);

            for (let user of this.users) {
              if (user.username == data.userOrigin) {
                this.$store.commit(
                  "tableFunction/setUserChangeTableOrigin",
                  user
                );
              }
              if (user.username == data.userTarget) {
                this.$store.commit(
                  "tableFunction/setUserChangeTableTarget",
                  user
                );
              }
            }
          }
        }
      }
    },

    CANCEL_CHANGE_USER() {
      if (globalFunction.checkValid(this.user.username)) {
        if (this.user.username == this.dataChangeUserSocket.userOrigin) {
          // xử lý phía user muốn đổi bàn
          this.$store.dispatch("popup/updatePopupState", false);
          this.$store.dispatch("order/showHidePopupChangeUser", false);
        }

        if (this.user.username == this.dataChangeUserSocket.userTarget) {
          // xử lý phía user nhận bàn
          this.$store.dispatch("popup/updatePopupState", false);
          this.$store.dispatch("order/showHidePopupConfirmChangeUser", false);
        }
      }
    },

    RECEIVE_CHANGE_USER() {
      if (globalFunction.checkValid(this.user.username)) {
        if (this.user.username == this.dataChangeUserSocket.userOrigin) {
          // xử lý phía user muốn đổi bàn

          let tmpTablesObj = {};
          let ordersTmp = globalFunction.deepCloneObj(this.orders);
          let ordersToChangeUser = [];
          let tablesForUserToTake = [];

          for (
            let i = 0;
            i < this.dataChangeUserSocket.tableToMove.length;
            i++
          ) {
            tmpTablesObj[this.dataChangeUserSocket.tableToMove[i]] = 1;
          }

          for (let i = ordersTmp.length; i--; ) {
            // xóa những order ở các bàn đã move
            if (tmpTablesObj[ordersTmp[i].tableCode]) {
              ordersToChangeUser.push(ordersTmp[i]);
              ordersTmp.splice(i, 1);
            }
          }
          this.$store.commit("order/setOrders", ordersTmp);
          this.$store.commit(
            "tableFunction/setOrdersToChangeUser",
            ordersToChangeUser
          );

          for (let i = 0; i < this.allTablesData.length; i++) {
            if (tmpTablesObj[this.allTablesData[i].code]) {
              let tableTmp = globalFunction.deepCloneObj(this.allTablesData[i]);

              tableTmp.username = "";
              tableTmp.fullname = "";
              tableTmp.isbusy = false;

              tablesForUserToTake.push(tableTmp);
            }
          }

          OrderService.save().then(() => {
            for (let i = 0; i < this.allTablesData.length; i++) {
              if (tmpTablesObj[this.allTablesData[i].code]) {
                (async () => {
                  this.$store.commit("helper/showLoading", false);

                  let tableTmp = globalFunction.deepCloneObj(
                    this.allTablesData[i]
                  );

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

                    this.$store.dispatch("popup/updatePopupState", false);
                    this.$store.dispatch(
                      "order/showHidePopupChangeUser",
                      false
                    );
                    this.$store.commit(
                      "helper/setStateLoadingPopupChangeUser",
                      false
                    );
                    this.$store.commit("helper/showLoading", false);

                    let currentRoute = this.$route.name;
                    if (currentRoute !== "Table") {
                      this.$router.push({ path: "table" });

                      let dataMoveTable = {};
                      dataMoveTable.orders = this.ordersToChangeUser;
                      dataMoveTable.userTakeTable = this.dataChangeUserSocket.userTarget;
                      dataMoveTable.tablesMoving = tablesForUserToTake;
                      this.$socket.emit("TAKE_TABLE", dataMoveTable);
                    }
                  }
                })();
              }
            }
          });
        }
      }
    },

    TAKE_TABLE(data) {
      if (globalFunction.checkValid(this.user.username)) {
        if (this.user.username == data.userTakeTable) {
          let ordersTmp = globalFunction.deepCloneObj(data.orders);
          let ordersCombine = [];

          for (let i = 0; i < ordersTmp.length; i++) {
            ordersTmp[i].userCode = this.user.username;
            ordersTmp[i].isActive = false;
          }

          ordersCombine = ordersTmp.concat(this.orders);
          this.$store.commit("order/setOrders", ordersCombine);

          OrderService.save().then(() => {
            (async () => {
              let link = globalFunction.baseUrl + "table/add";

              for (let i = 0; i < data.tablesMoving.length; i++) {
                this.$store.commit("helper/showLoading", true);
                let tableTmp = globalFunction.deepCloneObj(
                  data.tablesMoving[i]
                );

                tableTmp.username = this.user.username;
                tableTmp.isbusy = true;

                let tableResponse = await globalFunction.request(
                  link,
                  tableTmp
                );
                let dataTableUser = {};

                dataTableUser.tableCode = tableTmp.code;
                dataTableUser.userName = this.user.username;
                dataTableUser.userFullName = this.users.filter(
                  (user) => user.username == this.user.username
                )[0].fullname;
                dataTableUser.totalPrice = tableTmp.totalprice;
                dataTableUser.isbusy = true;

                this.$socket.emit("SELECT_TABLE", dataTableUser);
                this.$store.dispatch("popup/updatePopupState", false);
                this.$store.dispatch(
                  "order/showHidePopupConfirmChangeUser",
                  false
                );
                this.$store.commit("helper/showLoading", false);
              }
            })();
          });
        }
      }
    },
  },

  components: {
    LoadingBox: LoadingBox,
    Popup: Popup,
  },

  methods: {
    getWindowWidth(event) {
      this.windowWidth = document.documentElement.clientWidth;
      this.detectScreenSize();
    },

    getWindowHeight(event) {
      this.windowHeight = document.documentElement.clientHeight;
    },

    detectScreenSize() {
      if (this.windowWidth < 960) {
        this.$store.commit("helper/setDetectScreenSize", true);
      } else {
        this.$store.commit("helper/setDetectScreenSize", false);
      }

      if (this.windowHeight > 1024) {
        document.body.classList.add("is-large-screen");
      } else {
        document.body.classList.remove("is-large-screen");
      }
    },
  },

  created() {
    globalFunction.baseUrl = global_backend;
  },

  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.getWindowWidth);
      window.addEventListener("resize", this.getWindowHeight);

      //Init
      this.getWindowWidth();
      this.getWindowHeight();
    });
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.getWindowWidth);
    window.removeEventListener("resize", this.getWindowHeight);
  },
};
</script>

<style lang="scss">
@import "css/main.scss";
</style>
