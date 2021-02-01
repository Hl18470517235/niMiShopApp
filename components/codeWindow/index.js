
let app = getApp();

Component({
  properties: {
    iShidden: {
      type: Boolean,
      value: true,
    },
    code: {
      type: String,
      value: '',
    }
  },
  data: {
    loading: false,
  },
  attached() {
  },
  methods: {
    close() {
      this.triggerEvent('onClose');
      this.setData({
        iShidden: true
      });
    },
  },
})