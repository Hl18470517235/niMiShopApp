var app = getApp();
Component({
  properties: {
    model: {
      type:Boolean,
      value:true
    },
    attribute: {
      type: Object,
      value:{}
    },
    attrList:{
      type: Object,
      value:[],
    },
    productAttr:{
      type: Object,
      value: [],
    },
    allAttr:{
      type: Object,
      value: [],
      observer:'updata'
    },
    productSelect:{
      type: Object,
      value: {
        image: '',
        store_name: '',
        price: 0,
        unique: '',
        stock:0,
      }
    },
  },
  data: {
    attrValue:[],
    attrIndex:0,
    num:'',
    num2:'',
    shopmodel:true
  }, 
  methods: {
    updata: function(e) {
      this.setData({
        shopmodel:true
      })
      if(this.data.allAttr.uguigeBeans) {
      this.data.allAttr.uguigeBeans.forEach((item, index) => {
        if(item.productParamIndex == '规格') {
          this.setData({
            num2:this.data.allAttr.uguigeBeans[index].productParamSubIndex[0],
          })
        }else{
          this.setData({
            num:this.data.allAttr.uguigeBeans[index].productParamSubIndex[0],
          })
        }
      })
    }
    },
    joinCart: function() {
      this.triggerEvent('joincar', {'window': false});
    },
    close: function () {
      this.triggerEvent('myevent', {'window': false});
    },
    CartNumDes:function(){
      this.triggerEvent('ChangeCartNum', false);
    },
    CartNumInt:function(){
      this.triggerEvent('ChangeCartNum', true);
    },
    tapAttr:function(e){
      var productLength = this.data.productAttr.length
      //父级index
      var indexw = e.currentTarget.dataset.indexw;
      //子集index
      var indexn = e.currentTarget.dataset.indexn;
      var type = false
      var one = ''
      var two = ''
      var indext = 0
      var indexz = 1
      //每次点击获得的属性
      var attr = this.data.productAttr[indexw].productParamSubIndex[indexn];
      if(indexw == 1) {
         one = this.data.num2
         two = attr
      }else{
        one = attr
        two = this.data.num
      }
      if(this.data.productAttr.length == 1) {
        type = true
      } else {
      this.data.allAttr.productParam.forEach((item, index) => {
        var valueTojson = JSON.parse(item.valueTojson);
        // var one = this.data.productAttr[0].productParamSubIndex[indexn]
        if(valueTojson[0].key == '规格') {
          indext = 1
          indexz = 0
        }else{
          indext= 0
          indexz = 1
        }
        if(valueTojson[indext].value == two){
          if(valueTojson[indexz].value == one) {
            this.setData({
              num: two,
              num2: one
            });
            type = true
          }
        }
      })
    }
      if(type) {
      //设置当前点击属性
      this.data.productAttr[indexw].checked = attr;
      this.setData({
        productAttr: this.data.productAttr,
        shopmodel:true,
        num:two,
        num2:one
      });
      }else {
        this.data.productAttr[indexw].checked = attr;
        this.setData({
          productAttr: this.data.productAttr,
          shopmodel:false,
          num:two,
          num2:one
        })
      }
      var arr = this.getCheckedValue();
      if(productLength > 1) {
        var arr = this.getCheckedValue().reverse();
      }
      var value = arr.join(',');
      this.triggerEvent('ChangeAttr',value);
    },
    getCheckedValue: function () {
      return this.data.productAttr.map(function (attr) {
        return attr.checked;
      });
    },
    ResetAttr:function(){
      for (var k in this.data.productAttr) this.data.productAttr[k].checked='';
      this.setData({ productAttr: this.data.productAttr});
    },
  }
})