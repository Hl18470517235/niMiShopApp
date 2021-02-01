var app = getApp();
Component({
  properties: {
    attribute: {
      type: Boolean,
      value:false
    },
    attrList:{
      type: Object,
      value:[],
    },
  },
  methods: {
    close: function () {
      this.triggerEvent('myevent', {'window': false});
    }
  }
})