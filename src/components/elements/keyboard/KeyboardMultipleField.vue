<template>
  <div class="keyboard-wrapper" v-show="isActiveKeyboard">
    <div class="type-multiple-field-keyboard" v-show="isActiveMultipleFieldKeyboard">
      <div class="multiple-field-keyboard"></div>
      <div class="close-keyboard" ref="multipleField" @click="hideKeyboard()">Close</div>
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
        isActiveMultipleFieldKeyboard: state => state.helper.isActiveMultipleFieldKeyboard,
      })
    },

    mounted() {
      this.keyboard = new Keyboard(".multiple-field-keyboard", {
        onChange: this.onChange,
        onKeyPress: this.onKeyPress,
        preventMouseDownDefault: true,
        // disableCaretPositioning: true,
        mergeDisplay: true,
        theme: "simple-keyboard hg-theme-default hg-layout-default",
        layout: {
          default: [
            "^ 1 2 3 4 5 6 7 8 9 0 ß ´ {bksp}",
            "{tab} q w e r t z u i o p ü +",
            "{lock} a s d f g h j k l ö ä #",
            "{shiftleft} < y x c v b n m , . - {shiftright}",
            "@ {space}"
          ],
          shift: [
            '° ! " § $ % & / ( ) = ? ` {bksp}',
            "{tab} Q W E R T Z U I O P Ü *",
            "{lock} A S D F G H J K L Ö Ä '",
            "{shiftleft} > Y X C V B N M ; : _ {shiftright}",
            "@ {space}"
          ],
          caps: [
            "^ 1 2 3 4 5 6 7 8 9 0 ß ´ {bksp}",
            "{tab} Q W E R T Z U I O P Ü *",
            "{lock} A S D F G H J K L Ö Ä '",
            "{shiftleft} > Y X C V B N M ; : _ {shiftright}",
            "@ {space}"
          ]
        },
        display: {
          '{space}': 'Space',
          '{tab}': 'Tab',
          '{lock}': 'Caps lock',
          '{shiftleft}': 'Shift',
          '{shiftright}': 'Shift',
          '{bksp}': 'Backspace',
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

      handleHeightCloseButton() {
        let multipleFieldKb = document.querySelector('.type-multiple-field-keyboard .hg-button-space');
        let hMultipleFieldKb = multipleFieldKb.getBoundingClientRect().height;

        this.$refs.multipleField.style.height = `${hMultipleFieldKb}px`;
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