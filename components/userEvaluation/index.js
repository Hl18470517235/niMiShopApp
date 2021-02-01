var app = getApp();
Component({
  properties: {
    reply:{
      type:Object,
      value:[],
    }
  },
  data: {
    
  },
  attached: function () {

  },
  methods: {
    getpreviewImage:function(e){
      var dataset=e.currentTarget.dataset;
      wx.previewImage({ 
        urls: this.data.reply[dataset.index].photoList, 
        current: this.data.reply[dataset.index].photoList[dataset.pic_index],
      });
    },
  }
})