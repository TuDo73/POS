<template>
  <div class="body-wrapper">
    <Header/>
    <div class="customer-wrapper" :class="{'on-smallscreen': isOnSmallScreen}">
      <div class="customer-toolbar new-customer-page">
        <div class="routing-btn-box" @click="backToListCustomer()">
          <span>Quay lại</span>
          <span class="icon-cheveron-right"></span>
        </div>
      </div>
      <div class="customer-data-box">
        <div class="box-wrapper">
          <div class="data-box">
            <div class="form-row">
              <div class="form-data">
                <div class="form-label" style="font-size: 30px;">Tên*</div>
                <div class="form-input">
                  <input type="text" style="font-size: 26px;" 
                  @focus="showHideMultipleFieldKeyboard" 
                  @input="onInputChange" id="fieldName">
                </div>
              </div>
              <div class="save-to-server-box">
                <span class="icon-save-disk"></span>
              </div>
            </div>
            <div class="form-row">
              <div class="form-data">
                <div class="form-label">Tên phố & số nhà*</div>
                <div class="form-input">
                  <input type="text" 
                  @focus="showHideMultipleFieldKeyboard" 
                  @input="onInputChange" id="fieldAddress">
                </div>
              </div>
              <div class="form-data">
                <div class="form-label">Tên công ty*</div>
                <div class="form-input">
                  <input type="text" 
                  @focus="showHideMultipleFieldKeyboard" 
                  @input="onInputChange" id="fieldFirma">
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-data">
                <div class="form-label">Số bưu điện*</div>
                <div class="form-input">
                  <input type="text" 
                  @focus="showHideMultipleFieldKeyboard" 
                  @input="onInputChange" id="fieldPlz">
                </div>
              </div>
              <div class="form-data">
                <div class="form-label">USt-ldNr</div>
                <div class="form-input">
                  <input type="text" 
                  @focus="showHideMultipleFieldKeyboard" 
                  @input="onInputChange" id="fieldTax">
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-data">
                <div class="form-label">Thành phố*</div>
                <div class="form-input">
                  <input type="text" 
                  @focus="showHideMultipleFieldKeyboard" 
                  @input="onInputChange" id="fieldCity">
                </div>
              </div>
              <div class="form-data">
                <div class="form-label">Barcode (Auto)</div>
                <div class="form-input">
                  <input type="text" disabled>
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-data">
                <div class="form-label">Tiểu bang</div>
                <div class="form-input">
                  <input type="text" 
                  @focus="showHideMultipleFieldKeyboard" 
                  @input="onInputChange" id="fieldLand">
                </div>
              </div>
              <div class="form-data">
                <div class="form-label">Email</div>
                <div class="form-input">
                  <input type="text" 
                  @focus="showHideMultipleFieldKeyboard" 
                  @input="onInputChange" id="fieldEmail">
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-data">
                <div class="form-label">Telefon</div>
                <div class="form-input">
                  <input type="text" 
                  @focus="showHideMultipleFieldKeyboard" 
                  @input="onInputChange" id="fieldPhone">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="select-customer">
          SELECT
        </div>
      </div>
    </div>
    <KeyboardMultipleField 
    @onChange="onChange" 
    :inputSelected="inputSelected" 
    :inputNameSelected="inputNameSelected" 
    :inputValueSelected="inputValueSelected" 
    :input="input" ref="keyboard"/>
  </div>
</template>
<script>
  import { globalFunction } from '@/global/global.js'
  import { mapState } from 'vuex'
  import Header from '@/components/Header.vue'
  import KeyboardMultipleField from '@/components/elements/keyboard/KeyboardMultipleField.vue'

  export default {

    data() {
      return {
        // biến bàn phím ảo
        input: '',
        inputNameSelected: '',
        inputValueSelected: '',
        inputSelected: '',
      }
    },

    computed: {
      ...mapState({
        isOnSmallScreen: state => state.helper.isOnSmallScreen
      }),
    },

    components: {
      'Header': Header,
      'KeyboardMultipleField': KeyboardMultipleField,
    },

    methods: {
      backToListCustomer() {
        this.$router.push({ path: 'list-customer' });
      },

      // method bàn phím ảo
      showHideMultipleFieldKeyboard(e) {
        if (!this.$device.android && !this.$device.ios) {
          this.$store.dispatch('helper/updateKeyboardState', true);
          this.$store.dispatch('helper/showHideMultipleFieldKeyboard', true);
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

      onInputChange(e) { // tracking các input change được tạo ra không phải từ bàn phím ảo
        this.inputValueSelected = e.target.value;

        setTimeout(() => {
          this.$refs.keyboard.setInputValue();
        }, 0);
      },
    },

    created() {
      this.$store.dispatch('helper/hideAllKeyboard');
    }
  };
</script>