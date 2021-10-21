import Vue from 'vue'

Vue.filter('centToEuroFormat', function (value) {
    return Number(value) !== 0 ? (Number(value) / 100).toLocaleString('de-DE', {style: 'currency', currency: 'EUR', minimumFractionDigits: 2}) : 0;
    // return (Number(value) / 100).toLocaleString('de-DE', {style: 'currency', currency: 'EUR', minimumFractionDigits: 2});
})