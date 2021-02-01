var app = getApp();
Component({
  properties: {
    attribute: {
      type: Boolean,
      value:false
    }
  },
  methods: {
    close: function () {
      this.triggerEvent('myevent', {'window': false});
    }
  }
})