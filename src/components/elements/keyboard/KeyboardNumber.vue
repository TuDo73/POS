<template>
  <div class="keyboard-wrapper" v-show="isActiveKeyboard">
    <div class="type-number-keyboard" v-show="isActiveNumberKeyboard">
      <div class="number-keyboard"></div>
      <div class="close-keyboard" ref="number" @click="hideKeyboard()">Close</div>
    </div>
  </div>
</template>

<script>
  import Keyboard from "simple-keyboard";
  import "simple-keyboard/build/css/index.css";
  import { mapState } from 'vuex'

  export default {
    name: "SimpleKeyboard",
    props: {
      keyboardClass: {
        default: "simple-keyboard",
        type: String
      },
      input: {
        type: String
      },
      inputNameSelected: {
        type: String
      },
      inputValueSelected: {
        type: String
      },
      inputSelected: {
        type: String
      },
    },
    data: () => ({
      keyboard: null,
    }),

    computed: {
      ...mapState({
        isActiveKeyboard: state => state.helper.isActiveKeyboard,
        isActiveNumberKeyboard: state => state.helper.isActiveNumberKeyboard,
      })
    },

    mounted() {
      this.keyboard = new Keyboard(".number-keyboard", {
        onChange: this.onChange,
        onKeyPress: this.onKeyPress,
        preventMouseDownDefault: true,
        // disableCaretPositioning: true,
        mergeDisplay: true,
        theme: "simple-keyboard hg-theme-default hg-layout-default",
        layout: {
          default: [
            "{numpad7} {numpad8} {numpad9}",
            "{numpad4} {numpad5} {numpad6}",
            "{numpad1} {numpad2} {numpad3}",
            "{numpad0} {bksp} {close}"
          ]
        },
        display: {
          '{bksp}': 'Del',
        },
      });
    },
    methods: {
      hideKeyboard() {
        this.$store.dispatch('helper/hideAllKeyboard');
      },

      onChange(input) {
        this.$emit("onChange", input);
        
        // Synchronizing input caret position
        let inputElement = document.querySelector(this.inputSelected);
        let caretPosition = this.keyboard.caretPosition;
        if (caretPosition !== null) {
          this.setInputCaretPosition(inputElement, caretPosition);
        }
      },

      setInputCaretPosition(elem, pos) {
        if (elem.setSelectionRange) {
          elem.focus();
          elem.setSelectionRange(pos, pos);
        }
      },

      onKeyPress(button) {
        this.$emit("onKeyPress", button);

        /**
         * If you want to handle the shift and caps lock buttons
         */
        if (button === "{shiftleft}" || button === "{shiftright}") this.handleShift();
        if (button === "{lock}") this.handleCaps();
      },
      handleShift() {
        let currentLayout = this.keyboard.options.layoutName;
        // let shiftToggle = currentLayout === "default" ? "shift" : "default";
        let shiftToggle = currentLayout === "shift" ? "default" : "shift";

        this.keyboard.setOptions({
          layoutName: shiftToggle
        });
      },
      handleCaps() {
        let currentLayout = this.keyboard.options.layoutName;
        // let shiftToggle = currentLayout === "default" ? "shift" : "default";
        let shiftToggle = currentLayout === "caps" ? "default" : "caps";

        this.keyboard.setOptions({
          layoutName: shiftToggle
        });
      },

      setInputName() {
        this.keyboard.setOptions({
          inputName: this.inputNameSelected,
        });
      },

      setInputValue() {
        this.keyboard.setInput(this.inputValueSelected, this.inputNameSelected);
      },

      clearInput() {
        this.keyboard.clearInput();
      },

      handleHeightCloseButton() {
        let numberKb = document.querySelector('.type-number-keyboard .hg-button-bksp');
        let hNumberKb = numberKb.getBoundingClientRect().height;
        let wNumberKb = numberKb.getBoundingClientRect().width;

        this.$refs.number.style.height = `${hNumberKb}px`;
        this.$refs.number.style.width = `${wNumberKb}px`;
      }
    },
    watch: {
      input(input) {
        this.keyboard.setInput(input);
      }
    },
  };
</script>

<style>
  
</style>