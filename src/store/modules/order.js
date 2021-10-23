import { globalFunction } from "@/global/global.js";

const state = {
  // data
  orders: [],
  order: {
    userCode: 0,
    ref: "",
    totalPrice: 0,
    orderLines: [],
    tableCode: 0,
    reasonStornoAll: "",
    isOrderTogo: false,
    startTime: "",
    endTime: "",
    netto: 0,
    subTotal7: 0,
    subTotal19: 0,
    total7: 0,
    total19: 0,
    is_cash: true,
    moneyGiven: 0,
    moneyChange: 0,
    totalDiscountOrderLines: 0,
    totalDiscountOrderInPayment: 0,
    totalMwst7: 0,
    totalMwst19: 0,
    total_discount: 0,
    moneyToPay: 0,
    productDiscount: 0,
    orderDiscount: 0,
    retourState: null,
    retourFromRef: null,
    retourFromBeleg: null,
    retourReason: null,
  },
  orderSelected: {},
  shouldDelete: true,
  currentSelectedRowIndex: 0,
  isAddNewProductToOrder: false,
  isActiveProductDiscountPopup: false,
  lineDiscountPercentage: false, // Biến này để check discountline là discount tiền hay %
  valueDiscount: "",
  isActiveExtraOrderline: false,
  isActiveChangePricePopup: false,
  isChangePriceProductAmount: true, // check thay đổi giá tiền theo giá sản phẩm hay tổng tiền
  valueNewPrice: "",
  isActiveTogoPopup: false,
  reasonStorno: "",
  reasonStornoAll: "",
  belegOrder: "",
  isActiveMoveDishPopup: false,
  orderToMoveDish: {},
  orderTargetMoveDish: {},
  isActiveChangeUserPopup: false,
  isActivePopupConfirmMoveDish: false,
  isActivePopupConfirmChangeUser: false,
  isActivePopupAlertSelectProduct: false,
  isActivePopupReasonRetour: false,
  isActivePopupAlertEnterRetourInput: false,
  isActivePopupNoProductRetour: false,
};

const getters = {
  // computed
};

const actions = {
  // methods
  initOrder({ commit, state, dispatch, rootState }, refNumber) {
    let table = JSON.parse(localStorage.getItem("tableOrdered"));

    if (table.isTogo) {
      // trường hợp là order to-go
      let refOrderTmp = rootState.table.refOrderTogoSelected;

      if (refOrderTmp !== "") {
        // trường hợp chọn 1 order to-go đã có
        for (let i = 0; i < state.orders.length; i++) {
          state.orders[i].isActive = false;
          if (state.orders[i].ref == refOrderTmp) {
            state.orders[i].isActive = true;
            state.orderSelected = { ...state.orders[i] };
          }
        }
      } else {
        // trường hợp tạo mới 1 order to-go
        for (let i = 0; i < state.orders.length; i++) {
          state.orders[i].isActive = false;
        }
        dispatch("createOrder");
      }
    } else {
      // trường hợp là ăn tại quán
      if (state.orders.length === 0) {
        // nếu chưa tồn tại order nào
        dispatch("createOrder");
      } else {
        // đã tồn tại order
        if (!globalFunction.checkValid(state.orderSelected.ref)) {
          for (let i = 0; i < state.orders.length; i++) {
            if (state.orders[i].isActive) {
              state.orderSelected = { ...state.orders[i] };
            }
          }
        }

        let orderExit = state.orders.some(
          (order) => order.tableCode == table.code
        ); // kiểm tra xem đã có order thuộc bàn đã chọn hay chưa
        if (!orderExit) {
          // nếu bàn đã chọn chưa có order nào
          for (let i = 0; i < state.orders.length; i++) {
            if (state.orders[i].isActive) {
              state.orders[i].isActive = false;
            }
          }

          dispatch("createOrder");
        } else {
          // nếu bàn đã chọn đã có order
          let currentTableCode = rootState.table.tableOrdered.code;
          let ordersTmp = [];

          // filter những order thuộc bàn đã chọn
          for (let i = 0; i < state.orders.length; i++) {
            if (state.orders[i].tableCode == currentTableCode) {
              ordersTmp.push(state.orders[i]);
            }
          }

          // kiểm tra đã có orderSelected của bàn đó hay chưa
          let hadActived = false;
          for (let i = 0; i < ordersTmp.length; i++) {
            if (ordersTmp[i].isActive) {
              state.orderSelected = { ...ordersTmp[i] };
              hadActived = true;
              break;
            }
          }

          if (!hadActived) {
            for (let i = 0; i < state.orders.length; i++) {
              if (state.orders[i].ref == ordersTmp[0].ref) {
                state.orders[i].isActive = true;
              }
            }
            state.orderSelected = { ...ordersTmp[0] };
          }
        }
      }
    }

    dispatch("calculateOrder");
  },

  createOrder({ commit, state, dispatch, rootState }) {
    let table = JSON.parse(localStorage.getItem("tableOrdered"));
    let user = JSON.parse(localStorage.getItem("login"));
    let currentTime = new Date().getTime();

    state.orderSelected = { ...state.order };

    state.orderSelected.tableCode = table.code;
    state.orderSelected.userCode = user.username;
    state.orderSelected.ref = user.username + currentTime;
    state.orderSelected.isActive = true;
    state.orderSelected.orderLines = [];
    state.orderSelected.startTime = currentTime;
    if (rootState.table.tableOrdered.isTogo) {
      state.orderSelected.isOrderTogo = true;
    }

    state.orders.push(state.orderSelected);
  },

  addNewOrder({ commit, state, dispatch, rootState }) {
    for (let order of state.orders) {
      order.isActive = false;
    }

    dispatch("createOrder");
  },

  selectOrder({ commit, state, dispatch, rootState }, [refValue]) {
    let ordersTemp = [...state.orders];
    for (let order of ordersTemp) {
      order.isActive = false;
      if (order.ref === refValue) {
        order.isActive = true;
        state.orderSelected = { ...order };
      }
    }

    state.orders = [...ordersTemp];

    dispatch("calculateOrder");
  },

  setProductToOrderLines({ commit, state, dispatch, rootState }, [product]) {
    let isProductExits = false;
    let orderLines = state.orderSelected.orderLines;
    let tmpProduct = {};

    tmpProduct = { ...product };

    tmpProduct.isDisableSelect = true;
    tmpProduct.isHighlight = true;
    tmpProduct.priceOrigin = product.price;

    if (!globalFunction.checkValid(tmpProduct.quantity)) {
      tmpProduct.quantity = 1;
    }

    if (!globalFunction.checkValid(tmpProduct.isDiscount)) {
      tmpProduct.isDiscount = false;
    }

    if (!globalFunction.checkValid(tmpProduct.discount)) {
      tmpProduct.discount = 0;
    }

    if (!globalFunction.checkValid(tmpProduct.discountType)) {
      tmpProduct.discountType = "";
    }

    if (!globalFunction.checkValid(tmpProduct.isOverDiscount)) {
      tmpProduct.isOverDiscount = false;
    }

    if (!globalFunction.checkValid(tmpProduct.isChangePrice)) {
      tmpProduct.isChangePrice = false;
    }

    if (!globalFunction.checkValid(tmpProduct.priceAfterChange)) {
      tmpProduct.priceAfterChange = 0;
    }

    if (!globalFunction.checkValid(tmpProduct.isOrderConfirmed)) {
      tmpProduct.isOrderConfirmed = false;
    }

    if (state.orderSelected.isOrderTogo) {
      tmpProduct.isTogo = true;
    }

    for (let i = 0; i < orderLines.length; i++) {
      orderLines[i].isHighlight = false;

      if (
        orderLines[i].code === tmpProduct.code &&
        orderLines[i].isDisableSelect === false &&
        orderLines[i].isOrderConfirmed === false
      ) {
        if (rootState.numboardHome.isMenge) {
          orderLines[i].quantity = tmpProduct.quantity;
        } else {
          orderLines[i].quantity =
            parseFloat(orderLines[i].quantity) +
            parseFloat(tmpProduct.quantity);
        }

        if (state.isAddNewProductToOrder) {
          tmpProduct.isDiscount = orderLines[i].isDiscount;
          tmpProduct.discount = orderLines[i].discount;
          tmpProduct.discountType = orderLines[i].discountType;
          tmpProduct.isOverDiscount = orderLines[i].isOverDiscount;
          tmpProduct.isChangePrice = orderLines[i].isChangePrice;
          tmpProduct.priceAfterChange = orderLines[i].priceAfterChange;
        }

        orderLines[i].isDiscount = tmpProduct.isDiscount;
        orderLines[i].discount = tmpProduct.discount;
        orderLines[i].discountType = tmpProduct.discountType;
        orderLines[i].isOverDiscount = tmpProduct.isOverDiscount;
        orderLines[i].price = tmpProduct.price;
        orderLines[i].isChangePrice = tmpProduct.isChangePrice;
        orderLines[i].priceAfterChange = tmpProduct.priceAfterChange;
        orderLines[i].isHighlight = true;
        isProductExits = true;
      }
    }

    if (!isProductExits) {
      tmpProduct.isDisableSelect = false;
      orderLines.unshift(tmpProduct);
    }

    state.orderSelected.orderLines = [...orderLines];

    commit("setStateForAddNewProductToOrder", false);
    dispatch("calculateOrder");
  },

  setOrderLine(
    { commit, state, dispatch, rootState },
    [orderLine, indexOrderLine]
  ) {
    if (orderLine.isDisableSelect === true) {
      return;
    }

    let orderLinesTmp = state.orderSelected.orderLines;
    for (let i = 0; i < orderLinesTmp.length; i++) {
      orderLinesTmp[i].isHighlight = false;

      if (
        orderLinesTmp[i].code === orderLine.code &&
        orderLinesTmp[i].isDisableSelect === false &&
        indexOrderLine === i
      ) {
        orderLinesTmp[i].isHighlight = true;
      }
    }

    state.orderSelected.orderLines = [...orderLinesTmp];

    dispatch("calculateOrder");
  },

  doStorno({ commit, state, dispatch, rootState }) {
    let orderLines = state.orderSelected.orderLines;

    function findNextSelectableRowIndex() {
      for (
        let i = state.currentSelectedRowIndex + 1;
        i < orderLines.length;
        i++
      ) {
        if (!orderLines[i].isDisableSelect) {
          return i;
        }
      }

      for (let i = 0; i < state.currentSelectedRowIndex; i++) {
        if (!orderLines[i].isDisableSelect) {
          return i;
        }
      }

      return -1;
    }

    function findNextSelectableRowIndexWhenDeleteRow() {
      for (let i = state.currentSelectedRowIndex; i < orderLines.length; i++) {
        if (!orderLines[i].isDisableSelect) {
          return i;
        }
      }

      for (let i = 0; i < state.currentSelectedRowIndex; i++) {
        if (!orderLines[i].isDisableSelect) {
          return i;
        }
      }

      return -1;
    }

    if (state.shouldDelete) {
      if (
        orderLines[state.currentSelectedRowIndex].isHighlight &&
        !orderLines[state.currentSelectedRowIndex].isOrderConfirmed
      ) {
        // sản phẩm ở trạng thái chưa confirm
        orderLines.splice(state.currentSelectedRowIndex, 1);

        let nextRowIndex = findNextSelectableRowIndexWhenDeleteRow();

        if (nextRowIndex !== -1) {
          state.currentSelectedRowIndex = nextRowIndex;
          orderLines[state.currentSelectedRowIndex].isHighlight = true;
        } else {
          state.shouldDelete = false;
        }
      } else if (
        orderLines[state.currentSelectedRowIndex].isHighlight &&
        orderLines[state.currentSelectedRowIndex].isOrderConfirmed
      ) {
        // sản phẩm ở trạng thái đã confirm
        orderLines[state.currentSelectedRowIndex].isDisableSelect = true;
        orderLines[state.currentSelectedRowIndex].isHighlight = false;
        orderLines[state.currentSelectedRowIndex].isNextDish = false;
        orderLines[state.currentSelectedRowIndex].reasonStorno =
          state.reasonStorno;

        let smProductIndex = state.currentSelectedRowIndex;
        let nextRowIndex = findNextSelectableRowIndex();

        // thêm sản phẩm âm
        let itemToStorno = { ...orderLines[smProductIndex] };
        itemToStorno.isDisableSelect = true;
        itemToStorno.quantity = -itemToStorno.quantity;
        orderLines.splice(smProductIndex, 0, itemToStorno);

        if (nextRowIndex != -1) {
          state.currentSelectedRowIndex =
            smProductIndex < nextRowIndex ? nextRowIndex + 1 : nextRowIndex;
          orderLines[state.currentSelectedRowIndex].isHighlight = true;
        } else {
          state.shouldDelete = false;
        }
      }
    }

    state.orderSelected.orderLines = [...orderLines];
    dispatch("calculateOrder");
  },

  doStornoAll({ commit, state, dispatch, rootState }, isOrderConfirmExiting) {
    let orderLines = state.orderSelected.orderLines;
    let stornoItems = [];
    let currentTime = new Date().getTime();

    if (isOrderConfirmExiting) {
      // order list tồn tại món đã confirm
      for (let i = orderLines.length; i--; ) {
        if (
          orderLines[i].isOrderConfirmed &&
          orderLines[i].isDisableSelect == false
        ) {
          // món đã confirm
          orderLines[i].isDisableSelect = true;
          orderLines[i].isHighlight = false;

          stornoItems.push(orderLines[i]);
        } else if (!orderLines[i].isOrderConfirmed) {
          // món chưa confirm
          orderLines.splice(i, 1);
        }
      }

      for (let i = 0; i < stornoItems.length; i++) {
        let itemToStorno = { ...stornoItems[i] };

        itemToStorno.quantity = -itemToStorno.quantity;
        itemToStorno.totalAmount = -itemToStorno.totalAmount;

        orderLines.push(itemToStorno);
      }
    } else {
      // order list chưa có món nào confirm
      for (let i = orderLines.length; i--; ) {
        if (
          !orderLines[i].isOrderConfirmed &&
          orderLines[i].isDisableSelect == false
        ) {
          orderLines.splice(i, 1);
        }
      }
    }

    state.orderSelected.endTime = currentTime;
    state.orderSelected.orderLines = [...orderLines];
    dispatch("calculateOrder");
  },

  setExtraForProduct({ commit, state, dispatch, rootState }, extra) {
    let orderLines = state.orderSelected.orderLines;

    for (let orderline of orderLines) {
      if (orderline.isHighlight) {
        if (!globalFunction.checkValid(orderline.extras)) {
          orderline.extras = [];
          orderline.extras.push(extra.name);
        } else {
          orderline.extras.push(extra.name);
        }
      }
    }

    state.orderSelected.orderLines = [...orderLines];
    dispatch("calculateOrder");
  },

  handleScrollOrderList({ commit, state, dispatch, rootState }, [direction]) {
    let orderLines = state.orderSelected.orderLines;
    let currentRowIndex = state.currentSelectedRowIndex;
    let firstRowIsActive = 0;
    let lastRowIsActive = 0;

    for (let i = 0; i < orderLines.length; i++) {
      if (orderLines[i].isDisableSelect == false) {
        firstRowIsActive = i;
        break;
      }
    }

    for (let i = orderLines.length; i > 0; i--) {
      if (orderLines[i - 1].isDisableSelect == false) {
        lastRowIsActive = i;
        break;
      }
    }

    switch (direction) {
      case "up":
        if (currentRowIndex <= firstRowIsActive) {
          return;
        } else {
          for (let i = 0; i < orderLines.length; i++) {
            currentRowIndex--;

            if (
              orderLines[currentRowIndex].isDisableSelect == false &&
              currentRowIndex >= firstRowIsActive
            ) {
              globalFunction.scrollToElement(
                "order-list-body",
                "row-ol",
                currentRowIndex
              );
              break;
            }
          }
        }
        break;

      case "down":
        if (currentRowIndex >= lastRowIsActive) {
          return;
        } else {
          for (let i = 0; i < lastRowIsActive; i++) {
            currentRowIndex++;

            if (currentRowIndex >= lastRowIsActive) {
              currentRowIndex = lastRowIsActive - 1;
              break;
            } else {
              if (
                orderLines[currentRowIndex].isDisableSelect == false &&
                currentRowIndex <= lastRowIsActive
              ) {
                globalFunction.scrollToElement(
                  "order-list-body",
                  "row-ol",
                  currentRowIndex
                );
                break;
              }
            }
          }
        }
        break;

      default:
        break;
    }

    state.currentSelectedRowIndex = currentRowIndex;

    for (let i = 0; i < orderLines.length; i++) {
      orderLines[i].isHighlight = false;
    }
    orderLines[currentRowIndex].isHighlight = true;
    state.orderSelected.orderLines = [...orderLines];

    dispatch("calculateOrder");
  },

  calculateOrder({ commit, state, dispatch, rootState }) {
    let orderSelectedTmp = state.orderSelected;
    let orderLinesTmp = state.orderSelected.orderLines;
    let ordersTmp = state.orders;
    let totalPrice = 0;
    let totalPriceWithoutDiscount = 0;
    let totalAmount = 0;
    let totalDiscountOrderLines = 0; // tính riêng tổng discount của các orderline khi giảm giá tại Home

    // tính tổng tiền của order selected để hiển thị ở list order lines
    for (let i = 0; i < orderLinesTmp.length; i++) {
      if (orderLinesTmp[i].discountType === "%") {
        if (orderLinesTmp[i].quantity < 0) {
          totalAmount =
            (Number(orderLinesTmp[i].price) +
              Number(orderLinesTmp[i].discount) / 10) *
            Number(orderLinesTmp[i].quantity) *
            -1;
          if (Number(totalAmount) > 0) {
            totalAmount = Number(totalAmount) * -1;
          }
        } else {
          totalAmount =
            (Number(orderLinesTmp[i].price) -
              Number(orderLinesTmp[i].discount) / 10) *
            Number(orderLinesTmp[i].quantity);
        }
        orderLinesTmp[i].totalAmount = Number(totalAmount).toFixed(2);
        totalDiscountOrderLines += Number(orderLinesTmp[i].discount) / 10;
      } else {
        if (orderLinesTmp[i].priceAfterChange != 0) {
          totalAmount =
            Number(orderLinesTmp[i].priceAfterChange) *
            Number(orderLinesTmp[i].quantity);
          if (
            orderLinesTmp[i].priceAfterChange <= orderLinesTmp[i].priceOrigin
          ) {
            orderLinesTmp[i].discount =
              Number(orderLinesTmp[i].priceOrigin) *
                Number(orderLinesTmp[i].quantity) -
              Number(totalAmount);
          } else {
            orderLinesTmp[i].discount = 0;
          }
        } else {
          if (orderLinesTmp[i].quantity < 0) {
            totalAmount =
              (Number(orderLinesTmp[i].price) *
                Number(orderLinesTmp[i].quantity) +
                Number(orderLinesTmp[i].discount)) *
              -1;
            if (Number(totalAmount) > 0) {
              totalAmount = Number(totalAmount) * -1;
            }
          } else {
            totalAmount =
              Number(orderLinesTmp[i].price) *
                Number(orderLinesTmp[i].quantity) -
              Number(orderLinesTmp[i].discount);
          }
        }
        orderLinesTmp[i].totalAmount = Number(totalAmount).toFixed(2);
        totalDiscountOrderLines += Number(orderLinesTmp[i].discount);
      }

      if (orderLinesTmp[i].priceAfterChange > 0) {
        totalPriceWithoutDiscount +=
          Number(orderLinesTmp[i].quantity) *
          Number(orderLinesTmp[i].priceAfterChange);
      } else {
        totalPriceWithoutDiscount +=
          Number(orderLinesTmp[i].quantity) *
          Number(orderLinesTmp[i].priceOrigin);
      }
      totalPrice += Number(orderLinesTmp[i].totalAmount);
    }
    orderSelectedTmp.totalPrice = Number(totalPrice).toFixed(2);
    orderSelectedTmp.moneyToPay = orderSelectedTmp.totalPrice;
    if (orderSelectedTmp.orderDiscountValue != 0) {
      if (Number(orderSelectedTmp.totalPrice) < 0) {
        orderSelectedTmp.orderDiscountValue = -orderSelectedTmp.orderDiscountValue;
      }
      orderSelectedTmp.moneyToPay =
        Number(orderSelectedTmp.moneyToPay) -
        Number(orderSelectedTmp.orderDiscountValue);
    }
    orderSelectedTmp.moneyGiven = orderSelectedTmp.moneyToPay;
    orderSelectedTmp.moneyChange = 0;
    orderSelectedTmp.totalPriceWithoutDiscount = Number(
      totalPriceWithoutDiscount
    ).toFixed(2);
    orderSelectedTmp.totalDiscountOrderLines = Number(
      totalDiscountOrderLines
    ).toFixed(2);
    state.orderSelected = { ...orderSelectedTmp };

    // tính tổng tiền của mỗi order để hiển thị trên tab header
    for (let orderTmp of ordersTmp) {
      totalPrice = 0;
      totalPriceWithoutDiscount = 0;

      if (orderTmp.ref === orderSelectedTmp.ref) {
        for (let orderline of orderLinesTmp) {
          totalPrice += Number(orderline.totalAmount);
          if (Number(orderline.priceAfterChange) > 0) {
            totalPriceWithoutDiscount +=
              Number(orderline.quantity) * Number(orderline.priceAfterChange);
          } else {
            totalPriceWithoutDiscount +=
              Number(orderline.quantity) * Number(orderline.priceOrigin);
          }
        }
      } else {
        for (let orderline of orderTmp.orderLines) {
          totalPrice += Number(orderline.totalAmount);
          if (Number(orderline.priceAfterChange) > 0) {
            totalPriceWithoutDiscount +=
              Number(orderline.quantity) * Number(orderline.priceAfterChange);
          } else {
            totalPriceWithoutDiscount +=
              Number(orderline.quantity) * Number(orderline.priceOrigin);
          }
        }
      }
      orderTmp.totalPrice = Number(totalPrice).toFixed(2);
      orderTmp.totalPriceWithoutDiscount = Number(
        totalPriceWithoutDiscount
      ).toFixed(2);
    }

    state.orders = [...ordersTmp];

    commit("setCurrentOrderLineSelected");
    commit("updateOrders", state.orderSelected);
  },

  doConfirmOrder({ commit, state, dispatch }) {
    let orderSelectedTmp = state.orderSelected;
    let orderLinesTmp = state.orderSelected.orderLines;

    for (let orderLine of orderLinesTmp) {
      if (!orderLine.isDisableSelect) {
        orderLine.isOrderConfirmed = true;
      }
    }

    state.orderSelected = { ...orderSelectedTmp };

    // xóa order rỗng
    for (let i = 0; i < state.orders.length; i++) {
      if (state.orders[i].orderLines.length == 0) {
        state.orders.splice(i, 1);
      }
    }

    commit("updateOrders", state.orderSelected);
  },

  showHidePopupDiscount({ commit, state, dispatch }, value) {
    state.isActiveProductDiscountPopup = value;
  },

  changeDiscountState({ commit, state, dispatch }, discountstate) {
    if (discountstate == "percent") {
      state.lineDiscountPercentage = true;
    }

    if (discountstate == "money") {
      state.lineDiscountPercentage = false;
    }
  },

  showHidePopupExtra({ commit, state, dispatch }, value) {
    state.isActiveExtraOrderline = value;
  },

  showHidePopupChangePrice({ commit, state, dispatch }, value) {
    state.isActiveChangePricePopup = value;
  },

  showHidePopupTogo({ commit, state, dispatch }, value) {
    state.isActiveTogoPopup = value;
  },

  handleOrderTogo({ commit, state, dispatch }) {
    let orderSelectedTmp = state.orderSelected;
    let orderLinesTmp = state.orderSelected.orderLines;

    for (let orderLine of orderLinesTmp) {
      if (orderLine.isHighlight) {
        orderLine.isTogo = true;
      }
    }

    state.orderSelected = { ...orderSelectedTmp };
    commit("updateOrders", state.orderSelected);
  },

  handleNextDish({ commit, state, dispatch }) {
    let orderSelectedTmp = state.orderSelected;
    let orderLinesTmp = state.orderSelected.orderLines;

    for (let orderLine of orderLinesTmp) {
      if (orderLine.isHighlight) {
        orderLine.isNextDish = true;
      }
    }

    state.orderSelected = { ...orderSelectedTmp };
    commit("updateOrders", state.orderSelected);
  },

  splitOrder({ commit, state, dispatch }, splitType) {
    if (splitType === "togo") {
      let newTmpOrder = { ...state.order };
      let table = JSON.parse(localStorage.getItem("tableOrdered"));
      let user = JSON.parse(localStorage.getItem("login"));
      let currentTime = new Date().getTime();

      newTmpOrder.ref = user.username + currentTime;
      newTmpOrder.tableCode = table.code;
      newTmpOrder.userCode = user.username;
      newTmpOrder.isActive = false;
      newTmpOrder.isOrderTogo = true;

      for (let i = state.orderSelected.orderLines.length; i--; ) {
        if (state.orderSelected.orderLines[i].isTogo) {
          newTmpOrder.orderLines.unshift(state.orderSelected.orderLines[i]);
          state.orderSelected.orderLines.splice(i, 1);
        }
      }

      state.orders.unshift(newTmpOrder);
      dispatch("calculateOrder");
    }
  },

  handleTaxOrder({ commit, state, dispatch, rootState }) {
    let orderSelectedTmp = state.orderSelected;
    let orderIncludedTmp = state.orderSelected.orderIncluded;
    let orderTotalPrice = orderSelectedTmp.totalPrice;
    let nettoOrder = 0;
    let orderDiscountValue = 0;
    let totalPrice7 = 0;
    let totalPrice19 = 0;
    let nettoTotalPrice7 = 0;
    let nettoTotalPrice19 = 0;
    let totalMwst7 = 0;
    let totalMwst19 = 0;
    let isOrderTogo = orderSelectedTmp.isOrderTogo;
    let rateTotalPrice7 = 0;
    let rateTotalPrice19 = 0;
    let totalDiscountOrderLines = 0;
    let totalDiscountOrder = 0;

    if (!globalFunction.checkValid(orderIncludedTmp)) {
      orderIncludedTmp = [...orderSelectedTmp.orderLines];
    }

    for (let orderLine of orderSelectedTmp.orderLines) {
      if (orderLine.discountType == "%") {
        // chuyển giá trị discount của món về Euro
        orderLine.discountType = "€";

        let discountValue = orderLine.discount;
        orderLine.discount =
          Number(orderLine.priceOrigin) *
          Number(orderLine.quantity) *
          (Number(discountValue) / 100);
      }
    }

    if (orderSelectedTmp.orderDiscountValue !== 0) {
      if (orderSelectedTmp.orderDiscountType == "%") {
        // chuyển giá trị discount của order về Euro
        orderSelectedTmp.orderDiscountValue =
          (Number(orderSelectedTmp.totalPrice) *
            Number(orderSelectedTmp.orderDiscountValue)) /
          100;
        orderSelectedTmp.orderDiscountType = "€";
      }

      orderDiscountValue = orderSelectedTmp.orderDiscountValue;
    }

    if (!globalFunction.checkValid(orderSelectedTmp.orderDiscountValue)) {
      orderSelectedTmp.orderDiscountValue = 0;
    }

    if (!globalFunction.checkValid(orderDiscountValue)) {
      orderDiscountValue = 0;
    }

    // tính tổng tiền món có 7% và 19%
    if (!isOrderTogo) {
      for (let order of orderIncludedTmp) {
        if (order.mwst == 7) {
          totalPrice7 += Number(order.totalAmount);
        }
        if (order.mwst == 19) {
          totalPrice19 += Number(order.totalAmount);
        }
      }
    } else {
      for (let order of orderIncludedTmp) {
        if (order.mwsttogo == 7) {
          totalPrice7 += Number(order.totalAmount);
        }
        if (order.mwsttogo == 19) {
          totalPrice19 += Number(order.totalAmount);
        }
      }
    }

    // tính giá trước thuế của tổng tiền món có 7% và 19%
    nettoTotalPrice7 = Number(totalPrice7) / 1.07;
    nettoTotalPrice19 = Number(totalPrice19) / 1.19;

    // tính giá trị thuế của tổng tiền món có 7% và 19%
    totalMwst7 = (Number(totalPrice7) - Number(nettoTotalPrice7)).toFixed(2);
    totalMwst19 = (Number(totalPrice19) - Number(nettoTotalPrice19)).toFixed(2);

    // tính % của các món 7% và 19% so với tổng tiền
    rateTotalPrice7 = (Number(totalPrice7) / Number(orderTotalPrice)) * 100;
    rateTotalPrice19 = (Number(totalPrice19) / Number(orderTotalPrice)) * 100;
    if (isNaN(rateTotalPrice7)) {
      rateTotalPrice7 = 0;
    }
    if (isNaN(rateTotalPrice19)) {
      rateTotalPrice19 = 0;
    }

    // tính giá trị thuế của tổng tiền món có 7% và 19% khi có giảm giá order
    totalPrice7 =
      Number(totalPrice7) -
      (Number(rateTotalPrice7) * Number(orderDiscountValue)) / 100;
    totalPrice19 =
      Number(totalPrice19) -
      (Number(rateTotalPrice19) * Number(orderDiscountValue)) / 100;
    if (isNaN(totalPrice7)) {
      totalPrice7 = 0;
    }
    if (isNaN(totalPrice19)) {
      totalPrice19 = 0;
    }

    // tính giá trước thuế của tổng tiền món có 7% và 19% khi có giảm giá order
    nettoTotalPrice7 = Number(totalPrice7) / 1.07;
    nettoTotalPrice19 = Number(totalPrice19) / 1.19;
    if (isNaN(nettoTotalPrice7)) {
      nettoTotalPrice7 = 0;
    }
    if (isNaN(nettoTotalPrice19)) {
      nettoTotalPrice19 = 0;
    }

    // tính giá trị thuế của tổng tiền món có 7% và 19% khi có giảm giá order
    totalMwst7 = (Number(totalPrice7) - Number(nettoTotalPrice7)).toFixed(2);
    totalMwst19 = (Number(totalPrice19) - Number(nettoTotalPrice19)).toFixed(2);
    if (isNaN(totalMwst7)) {
      totalMwst7 = 0;
    }
    if (isNaN(totalMwst19)) {
      totalMwst19 = 0;
    }

    // tính giá trước thuế của order
    nettoOrder = Number(nettoTotalPrice7) + Number(nettoTotalPrice19);

    // tính tổng discount của order
    for (let orderLine of orderSelectedTmp.orderLines) {
      if (Number(orderLine.discount) != 0) {
        totalDiscountOrderLines += Number(orderLine.discount);
      }
    }
    totalDiscountOrder =
      Number(totalDiscountOrderLines) +
      Number(orderSelectedTmp.orderDiscountValue);
    if (isNaN(totalDiscountOrder)) {
      totalDiscountOrder = 0;
    }

    orderSelectedTmp.netto = nettoOrder;
    orderSelectedTmp.total7 = totalPrice7;
    orderSelectedTmp.total19 = totalPrice19;
    orderSelectedTmp.totalMwst7 = totalMwst7;
    orderSelectedTmp.totalMwst19 = totalMwst19;
    orderSelectedTmp.productDiscount = totalDiscountOrderLines;
    orderSelectedTmp.orderDiscount = orderSelectedTmp.orderDiscountValue;
    orderSelectedTmp.total_discount = totalDiscountOrder;

    for (let order of state.orders) {
      if (order.ref == orderSelectedTmp.ref) {
        order.netto = orderSelectedTmp.netto;
        order.total7 = orderSelectedTmp.total7;
        order.total19 = orderSelectedTmp.total19;
        order.totalMwst7 = orderSelectedTmp.totalMwst7;
        order.totalMwst19 = orderSelectedTmp.totalMwst19;
        order.productDiscount = orderSelectedTmp.productDiscount;
        order.orderDiscount = orderSelectedTmp.orderDiscount;
        order.total_discount = orderSelectedTmp.total_discount;
      }
    }

    commit("setOrderSelected", orderSelectedTmp);
    commit("setOrders", state.orders);
  },

  removeOrder({ commit, state, dispatch, rootState }, orderToRemove) {
    for (let i = 0; i < state.orders.length; i++) {
      if (state.orders[i].ref == orderToRemove.ref) {
        state.orders.splice(i, 1);
      }
    }

    commit("setOrders", state.orders);
  },

  showHidePopupMoveDish({ commit, state, dispatch }, value) {
    state.isActiveMoveDishPopup = value;
  },

  selectOrderToMoveDish({ commit, state, dispatch, rootState }, items) {
    for (let order of state.orderToMoveDish.orderLines) {
      order.isSelectedToMoveDish = false;

      for (let item of items) {
        if (order.codeToMove === item) {
          order.isSelectedToMoveDish = true;
        }
      }
    }
  },

  doMoveDish({ commit, state, dispatch, rootState }) {
    for (let i = 0; i < state.orderToMoveDish.orderLines.length; i++) {
      if (state.orderToMoveDish.orderLines[i].isSelectedToMoveDish) {
        let orderTmp = { ...state.orderToMoveDish.orderLines[i] };

        orderTmp.isHighlight = false;
        state.orderTargetMoveDish.orderLines.push(orderTmp);
      }
    }

    for (let i = state.orderToMoveDish.orderLines.length; i--; ) {
      if (state.orderToMoveDish.orderLines[i].isSelectedToMoveDish) {
        state.orderToMoveDish.orderLines.splice(i, 1);
      }
    }

    // tính lại tổng tiền của order gốc và order move
    let totalAmount = 0;

    for (let i = 0; i < state.orderToMoveDish.orderLines.length; i++) {
      totalAmount += Number(state.orderToMoveDish.orderLines[i].totalAmount);
    }
    state.orderToMoveDish.totalPrice = totalAmount;

    totalAmount = 0;
    for (let i = 0; i < state.orderTargetMoveDish.orderLines.length; i++) {
      totalAmount += Number(
        state.orderTargetMoveDish.orderLines[i].totalAmount
      );
    }
    state.orderTargetMoveDish.totalPrice = totalAmount;
  },

  handleCurrentOrderAfterMoveDish(
    { commit, state, dispatch, rootState },
    currentProducts
  ) {
    let tmpObj = {};

    for (let i = 0; i < currentProducts.length; i++) {
      tmpObj[currentProducts[i].codeToMove] = 1;
    }
    state.orderSelected.orderLines = state.orderSelected.orderLines.filter(
      (order) => tmpObj[order.codeToMove] || order.isDisableSelect
    );

    dispatch("calculateOrder");
  },

  handleOrderReceiveMoveDish(
    { commit, state, dispatch, rootState },
    orderReceive
  ) {
    for (let order of state.orders) {
      if (order.ref == orderReceive.ref) {
        order.orderLines = [...orderReceive.orderLines];
      }
    }

    if (state.orderSelected.ref == orderReceive.ref) {
      state.orderSelected.orderLines = [...orderReceive.orderLines];
    }
  },

  calculateOrderTargetMoveDish({ commit, state, dispatch, rootState }) {
    let totalPrice = 0;
    let orderLines = [...state.orderTargetMoveDish.orderLines];

    for (let order of orderLines) {
      totalPrice += Number(order.totalAmount);
    }

    state.orderTargetMoveDish.totalPrice = totalPrice;
  },

  showHidePopupChangeUser({ commit, state, dispatch }, value) {
    state.isActiveChangeUserPopup = value;
  },

  showHidePopupConfirmMoveDish({ commit, state, dispatch }, value) {
    state.isActivePopupConfirmMoveDish = value;
  },

  showHidePopupConfirmChangeUser({ commit, state, dispatch }, value) {
    state.isActivePopupConfirmChangeUser = value;
  },

  showHidePopupAlertSelectProduct({ commit, state, dispatch }, value) {
    state.isActivePopupAlertSelectProduct = value;
  },

  showHidePopupReasonRetour({ commit, state, dispatch }, value) {
    state.isActivePopupReasonRetour = value;
  },

  showHidePopupAlertEnterRetourInput({ commit, state, dispatch }, value) {
    state.isActivePopupAlertEnterRetourInput = value;
  },

  showHidePopupNoProductRetour({ commit, state, dispatch }, value) {
    state.isActivePopupNoProductRetour = value;
  },
};

const mutations = {
  // handle response from actions to update state
  setOrders(state, value) {
    state.orders = [];
    state.orders = value;
  },

  setOrderSelected(state, value) {
    state.orderSelected = value;
  },

  setCurrentOrderLineSelected(state) {
    state.currentSelectedRowIndex = 0;

    if (globalFunction.checkValid(state.orderSelected.orderLines)) {
      for (let i = 0; i < state.orderSelected.orderLines.length; i++) {
        if (state.orderSelected.orderLines[i].isHighlight) {
          state.currentSelectedRowIndex = i;
          state.shouldDelete = true;
          return;
        }
      }
    }

    state.shouldDelete = false;
    return;
  },

  setNewOrderToOrders(state, newOrder) {
    state.orders.push(newOrder);
  },

  updateOrders(state, newOrder) {
    for (let order of state.orders) {
      if (order.ref == newOrder.ref) {
        order.orderLines = [...newOrder.orderLines];
        order.reasonStornoAll = state.reasonStornoAll;
      }
    }
  },

  setDiscountType(state, value) {
    state.lineDiscountPercentage = value;
  },

  setValueDiscount(state, value) {
    state.valueDiscount = value;
  },

  setChangePriceType(state, value) {
    state.isChangePriceProductAmount = value;
  },

  setValueNewPrice(state, value) {
    state.valueNewPrice = value;
  },

  setStateForAddNewProductToOrder(state, value) {
    state.isAddNewProductToOrder = value;
  },

  setReasonStorno(state, value) {
    state.reasonStorno = value;
  },

  setReasonStornoAll(state, value) {
    state.reasonStornoAll = value;
  },

  setBelegOrder(state, value) {
    state.belegOrder = value;
  },

  setOrderToMoveDish(state) {
    for (let i = 0; i < state.orderSelected.orderLines.length; i++) {
      state.orderSelected.orderLines[i].codeToMove =
        i + state.orderSelected.orderLines[i].code; // thêm field codeToMove của orderline để xử lý nhiều món trùng nhau trên list
    }

    state.orderToMoveDish = globalFunction.deepCloneObj(state.orderSelected);
    state.orderToMoveDish.orderLines = state.orderToMoveDish.orderLines.filter(
      (order) => !order.isDisableSelect
    );

    for (let i = 0; i < state.orderToMoveDish.orderLines.length; i++) {
      state.orderToMoveDish.orderLines[i].isSelectedToMoveDish = false;
    }
  },

  setOrderTargetMoveDishEmptyOrderlines(state, value) {
    state.orderTargetMoveDish = globalFunction.deepCloneObj(value);
    state.orderTargetMoveDish.orderLines = [];
  },

  setOrderTargetMoveDish(state, value) {
    state.orderTargetMoveDish = globalFunction.deepCloneObj(value);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
