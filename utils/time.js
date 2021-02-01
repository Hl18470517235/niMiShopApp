// 倒计时
function countDown(that,date) { //倒计时函数
    let newTime = new Date().getTime();
    let endTime = date;
    let remainTime = endTime - newTime;
    let obj = null;
    let t = '';
    // 如果活动未结束，对时间进行处理
    if (remainTime > 0) {
      let time = remainTime / 1000;
      // 获取天、时、分、秒
      let day = parseInt(time / (60 * 60 * 24));
      let hou = parseInt(time % (60 * 60 * 24) / 3600);
      let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
      let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
      const formatNumber = n => {
        n = n.toString()
        return n[1] ? n : '0' + n
      }
      obj = {
        day: formatNumber(day),
        hou: formatNumber(hou),
        min: formatNumber(min),
        sec: formatNumber(sec)
      }
    }
    t = setTimeout(function() {
      that.setData({
        countDownTxt: obj
      });
      countDown(that,date)
    }, 1000)
    if (remainTime <= 0) {
      that.setData({
        timeModel:false,
        timeModel2:true,
      })
      clearTimeout(t);
    }
  }
  
  
  // 倒计时
  function countDownone(that,date,num,id) { //倒计时函数
    let newTime = new Date().getTime();
    let endTime = date;
    let remainTime = endTime - newTime;
    let obj = null;
    let index = num
    let t = '';
    // 如果活动未结束，对时间进行处理
    if (remainTime > 0) {
      let time = remainTime / 1000;
      // 获取天、时、分、秒
      let day = parseInt(time / (60 * 60 * 24));
      let hou = parseInt(time % (60 * 60 * 24) / 3600);
      let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
      let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
      const formatNumber = n => {
        n = n.toString()
        return n[1] ? n : '0' + n
      }
      obj = {
        day: formatNumber(day),
        hou: formatNumber(hou),
        min: formatNumber(min),
        sec: formatNumber(sec)
      }
    }
    t = setTimeout(function() {
      that.data.roomList.forEach((item,indexone) => {
        if(item.mini_room_id == id){
              var e = 'roomList['+indexone+'].timeObj'
              that.setData({
                [e]: obj
              });
             countDownone(that,date,num,id)
        }
      })
    }, 1000)
    if (remainTime < 0) {
    var a = 'roomList['+index+'].timeModel1'
    var b = 'roomList['+index+'].timeModel'
    var c = 'roomList['+index+'].timeModel2'
      that.setData({
        [b]:"0",
        [c]:"0",
        [a]:"1",
        timeS:true
      })
      clearTimeout(t);
    }
  }
  function clearTime(){
    clearTimeout(t);
  }
  function formatTen(num) { 
    return num > 9 ? (num + "") : ("0" + num); 
} 
  function formatDate(date) { 
    var date = new Date(date)
    var year = date.getFullYear(); 
    var month = date.getMonth() + 1; 
    var day = date.getDate(); 
    var hour = date.getHours(); 
    var minute = date.getMinutes(); 
    var second = date.getSeconds(); 
    return formatTen(month) + "月" + formatTen(day)+ "日" +formatTen(hour)+ ":" +formatTen(minute);
} 
function formatDate1(date) { 
  var date = new Date(date)
  var year = date.getFullYear(); 
  var month = date.getMonth() + 1; 
  var day = date.getDate(); 
  var hour = date.getHours(); 
  var minute = date.getMinutes(); 
  var second = date.getSeconds(); 
   // return year + "年" + formatTen(month) + "月" + formatTen(day)+ "日" +formatTen(hour)+ ":" +formatTen(minute)+ ":" +formatTen(second); 
   return formatTen(hour)+ ":" +formatTen(minute);
}
function formatDatealall(date) { 
  var date = new Date(date)
  var year = date.getFullYear(); 
  var month = date.getMonth() + 1; 
  var day = date.getDate(); 
  var hour = date.getHours(); 
  var minute = date.getMinutes(); 
  var second = date.getSeconds(); 
  return year + "-" + formatTen(month) + "-" + formatTen(day)+ " " +formatTen(hour)+ ":" +formatTen(minute)+ ":" +formatTen(second); 
}
module.exports = {
  countDown,
  countDownone,
  formatDate,
  formatDate1,
  clearTime,
  formatDatealall
}