<template>
  <div class="body-wrapper">
    <div
      class="login-form"
      :class="[
        { 'has-keyboard': $store.state.helper.isActiveKeyboard },
        { 'on-smallscreen': isOnSmallScreen },
      ]"
    >
      <div class="login-form-box">
        <div class="login-form-col col-left">
          <div class="form-col-content login-form-data">
            <h2 class="login-title">
              <span>
                {{ $t("login") }}
              </span>
            </h2>
            <div class="login-form-fields">
              <div class="form-field-row">
                <div class="form-field-title">
                  {{ $t("User") }}
                </div>
                <div class="form-field-input">
                  <input
                    type="text"
                    :placeholder="[[$t('User')]]"
                    @focus="showHideMultipleFieldKeyboard"
                    @input="onInputChange"
                    @blur="changeUsername"
                    id="username-input"
                  />
                </div>
              </div>
              <div class="form-field-row">
                <div class="form-field-title">
                  {{ $t("Password") }}
                </div>
                <div class="form-field-input">
                  <input
                    type="password"
                    :placeholder="[[$t('Password')]]"
                    @focus="showHideMultipleFieldKeyboard"
                    @input="onInputChange"
                    @blur="changePassword"
                    id="password-input"
                  />
                </div>
              </div>
            </div>
            <div class="login-form-buttons">
              <button class="button" @click="login">
                {{ $t("login") }}
              </button>
              <button class="button button-alert">
                {{ $t("close app") }}
              </button>
            </div>
            <div class="login-form-failed" v-if="!isLoginSuccess">
              Login failed!
            </div>
            <div class="login-form-failed" v-if="isUserAlreadyLogin">
              User already login!
            </div>
          </div>
        </div>
        <div class="login-form-col col-right">
          <div class="form-col-content login-form-welcome">
            <h2 class="login-title">
              <span>
                Welcome back
              </span>
            </h2>
            <div class="login-form-widget">
              <div class="widget-change-lang">
                <div class="change-lang-switcher">
                  <div
                    class="lang-title lang-de"
                    @click="changeLang('de')"
                    :class="[
                      $store.state.i18n.lang === 'de' ? 'is-actived' : '',
                    ]"
                  ></div>
                  <div class="lang-toggle">
                    <div class="lang-toggle-text">
                      <span @click="changeLang('de')">
                        DE
                      </span>
                      <span @click="changeLang('vi')">
                        VI
                      </span>
                    </div>
                    <div
                      class="lang-toggle-button"
                      :class="[
                        $store.state.i18n.lang === 'de'
                          ? 'de-actived'
                          : 'vi-actived',
                      ]"
                    ></div>
                  </div>
                  <div
                    class="lang-title lang-vi"
                    @click="changeLang('vi')"
                    :class="[
                      $store.state.i18n.lang === 'vi' ? 'is-actived' : '',
                    ]"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <KeyboardMultipleField
      @onChange="onChange"
      :inputSelected="inputSelected"
      :inputNameSelected="inputNameSelected"
      :inputValueSelected="inputValueSelected"
      :input="input"
      ref="keyboard"
    />
  </div>
</template>
<script>
import { globalFunction } from "@/global/global.js";
import { mapState } from "vuex";
import KeyboardMultipleField from "@/components/elements/keyboard/KeyboardMultipleField.vue";

export default {
  data() {
    return {
      username: "",
      password: "",
      isLoginSuccess: true,
      // biến bàn phím ảo
      input: "",
      inputNameSelected: "",
      inputValueSelected: "",
      inputSelected: "",
    };
  },

  computed: {
    ...mapState({
      isOnSmallScreen: (state) => state.helper.isOnSmallScreen,
      user: (state) => state.user.user,
      isUserAlreadyLogin: (state) => state.user.isUserAlreadyLogin,
    }),
  },

  components: {
    KeyboardMultipleField: KeyboardMultipleField,
  },

  methods: {
    async getDataProduct() {
      this.$store.commit("helper/showLoading", true);
      let link = globalFunction.baseUrl + "product/selectall";
      let data = {};

      let products = await globalFunction.request(link, data);
      globalFunction.stringForSearch(products);

      globalFunction.storeToLocalStorage("products", products);
      this.$store.commit("helper/showLoading", false);
    },

    async getAllCategories() {
      this.$store.commit("helper/showLoading", true);
      let link = globalFunction.baseUrl + "category/selectall";
      let data = {};

      let categories = await globalFunction.request(link, data);
      globalFunction.storeToLocalStorage("categories", categories);
      this.$store.commit("helper/showLoading", false);
    },

    async getExtraProduct() {
      this.$store.commit("helper/showLoading", true);
      let link = globalFunction.baseUrl + "extra/selectall";
      let data = {};

      let extras = await globalFunction.request(link, data);
      globalFunction.storeToLocalStorage("extras", extras);
      this.$store.commit("helper/showLoading", false);
    },

    async getAllUsers() {
      this.$store.commit("helper/showLoading", true);
      let link = globalFunction.baseUrl + "user/selectall";
      let data = {};

      let users = await globalFunction.request(link, data);
      this.$store.commit("user/setUsers", users);
      globalFunction.storeToLocalStorage("users", users);
      this.$store.commit("helper/showLoading", false);
    },

    async login() {
      this.$store.commit("user/setStateUserAlreadyLogin", false);
      this.$store.commit("helper/showLoading", true);
      let link = globalFunction.baseUrl + "user/login";
      let data = { username: this.username, password: this.password };
      let loginData = await globalFunction.request(link, data);
      this.$store.commit("helper/showLoading", false);

      if (!loginData.successful) {
        this.isLoginSuccess = false;
      } else {
        this.isLoginSuccess = true;
        loginData.loginTime = this.$moment().unix();
        globalFunction.storeToLocalStorage("login", loginData);
        this.$store.commit("user/setUser", loginData);

        let userSocketData = {
          userName: loginData.username,
          loginTime: loginData.loginTime,
        };

        this.$socket.emit("CHECK_LOGIN", userSocketData);

        // chỗ này check nick chef hay bồi để điều hướng route
        if (this.user.usergroup == "chef") {
          this.$router.push({ path: "bericht" });
        } else {
          this.$router.push({ path: "table" });
        }
      }
    },

    changeLang(langData) {
      this.$store.commit("i18n/setLang", langData);
      this.$i18n.locale = langData;
    },

    // method sử dụng cho bàn phím ảo
    showHideMultipleFieldKeyboard(e) {
      if (!this.$device.android && !this.$device.ios) {
        this.$store.dispatch("helper/updateKeyboardState", true);
        this.$store.dispatch("helper/showHideMultipleFieldKeyboard", true);
        this.inputSelected = `#${e.target.id}`;
        this.inputNameSelected = e.target.id;

        setTimeout(() => {
          this.$refs.keyboard.setInputName();
          this.$refs.keyboard.handleHeightCloseButton();
        }, 0);
      }
    },

    onChange(input) {
      document.querySelector(this.inputSelected).value = input;
    },

    changeUsername(e) {
      this.username = e.target.value;
    },

    changePassword(e) {
      this.password = e.target.value;
    },

    onInputChange(e) {
      // tracking các input change được tạo ra không phải từ bàn phím ảo
      this.inputValueSelected = e.target.value;

      setTimeout(() => {
        this.$refs.keyboard.setInputValue();
      }, 0);
    },
  },

  created() {
    globalFunction.removeLocalStorageItem("login");
    this.getAllCategories();
    this.getDataProduct();
    this.getExtraProduct();
    this.getAllUsers();
    this.$store.dispatch("helper/hideAllKeyboard");
    this.$store.commit("sessionUser/setSessionUserData", {});
  },
};
</script>
