<template>
  <div class="popup-type type-open-new-session" v-if="isActiveOpenNewSessionPopup">
    <div class="popup-heading">
      <h3>Please confirm to create new session</h3>
      <div class="row-data type-input">
        <h4>Begin amount</h4>
        <div class="input small-size">
          {{beginAmount}}
        </div>
      </div>
    </div>
    <div class="popup-main">
      <div class="popup-numpad">
        <div class="numpad">
          <div class="number-box">
            <ul class="number-list">
              <li class="number-item">
                <div class="number-btn" @click="clickNumb('7')">
                  <span>7</span>
                  <div class="overlay-btn"></div>
                </div>
              </li>
              <li class="number-item">
                <div class="number-btn" @click="clickNumb('8')">
                  <span>8</span>
                  <div class="overlay-btn"></div>
                </div>
              </li>
              <li class="number-item">
                <div class="number-btn" @click="clickNumb('9')">
                  <span>9</span>
                  <div class="overlay-btn"></div>
                </div>
              </li>
              <li class="number-item">
                <div class="number-btn" @click="clickNumb('4')">
                  <span>4</span>
                  <div class="overlay-btn"></div>
                </div>
              </li>
              <li class="number-item">
                <div class="number-btn" @click="clickNumb('5')">
                  <span>5</span>
                  <div class="overlay-btn"></div>
                </div>
              </li>
              <li class="number-item">
                <div class="number-btn" @click="clickNumb('6')">
                  <span>6</span>
                  <div class="overlay-btn"></div>
                </div>
              </li>
              <li class="number-item">
                <div class="number-btn" @click="clickNumb('1')">
                  <span>1</span>
                  <div class="overlay-btn"></div>
                </div>
              </li>
              <li class="number-item">
                <div class="number-btn" @click="clickNumb('2')">
                  <span>2</span>
                  <div class="overlay-btn"></div>
                </div>
              </li>
              <li class="number-item">
                <div class="number-btn" @click="clickNumb('3')">
                  <span>3</span>
                  <div class="overlay-btn"></div>
                </div>
              </li>
              <li class="number-item">
                <div class="number-btn" @click="clickNumb('00')">
                  <span>00</span>
                  <div class="overlay-btn"></div>
                </div>
              </li>
              <li class="number-item">
                <div class="number-btn" @click="clickNumb('0')">
                  <span>0</span>
                  <div class="overlay-btn"></div>
                </div>
              </li>
              <li class="number-item">
                <div class="number-btn" @click="clickNumb('clear')">
                  <span>C</span>
                  <div class="overlay-btn"></div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="btn-confirm-wrap">
        <div class="btn-confirm yes-confirm is-alert" @click="confirmBeginAmount(beginAmount)">Confirm</div>
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
        beginAmount: 0
      };
    },

    components: {
    },

    computed: {
      ...mapState({
        user: state => state.user.user,
        isActiveOpenNewSessionPopup: state => state.popup.isActiveOpenNewSessionPopup
      })
    },

    methods: {
      setValueBeginAmount() {
        this.beginAmount = 100;
      },

      clickNumb(valueInput) {
        let tmpBeginAmount = this.beginAmount;

        if(valueInput == 'clear') {
          this.beginAmount = '';
          return;
        }

        if(tmpBeginAmount === '') {
          if(valueInput !== '00') {
            tmpBeginAmount += valueInput;
          } else {
            return;
          }
        } else {
          tmpBeginAmount += valueInput;
        }
        this.beginAmount = tmpBeginAmount;
      },

      async confirmBeginAmount(value) {
        this.$store.commit('helper/showLoading', true);

        let link = globalFunction.baseUrl + 'session/open_by_user';
        let userNameObj = {
          'username': this.user.username,
          'beginamount': value
        };

        let openSessionData = await globalFunction.request(link, userNameObj);
        this.$store.dispatch('popup/updatePopupState', false);
        this.$store.dispatch('popup/updatePopupOpenNewSession', false);

        this.$store.commit('helper/showLoading', false);
      }
    },

    created() {
      this.setValueBeginAmount();
    },
  };
</script>

<style>

</style>
