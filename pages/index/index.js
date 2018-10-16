
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    location: [
      '请选择哦~', '安能快递', '菜鸟驿站-中通快递', '菜鸟驿站-申通快递', '韵达快递' , '顺丰快递', '天天快递', '菜鸟驿站EMS', '中国邮政收发处', '优速快递', '京东派', '小红马（当当网）', '品骏快递（唯品会）', '黄马甲', '宅急送'
    ],
    weight: [
      { item: '请选择哦~', money: null },
      { item: '小于1.5kg(2.6元)', money: 2.6 }, 
      { item: '1.5~3kg(4.5元)', money: 4.5 }, 
      { item: '3~5kg(7元)', money: 7 }, 
      { item: '较大件单独处理(8.8元)', money: 8.8 }, 
    ],
    lists: [{id:0, index1:0, index2:0, money:null}],
    summoney: 0,     //总金额
    defaultsite: 1,  //用户的收货地址rid
    defaultschool: '大连工业大学',   //默认校区：大连工业大学
    rname: 1,   //获取的收货人
    rphone: 1,  //获取的收货手机号
    rhouse: 1,  //获取的收货宿舍
    rdetail:1,   //获取的收货宿舍详细
  },

  //结算订单，获取信息
  getorderinfo: function (e) {
    var that = this;
    console.log("结算订单");
    that.checkSomeValue();
    console.log(e.detail.value);
    var school = that.data.defaultschool;
    var openid = wx.getStorageSync('openid');  //传递参数1   openid
    var rsite = that.data.defaultsite;  //传递参数2   收货地址id
    var money = that.data.summoney;  //传递参数3   总支付金额
    var moneys = '';  //传递参数7，用作分配订单金额
    var locations = '';  //传递参数4   快递点,快递点
    //var weights = new Array(); 
    var codes = '';    //传递参数5   取件码,取件码
    var others = '';    //传递参数6   备注,备注
    for(var i =0; i<that.data.lists.length; i++){  //遍历获取多订单值
      var addid = that.data.lists[i].id+1;   //当前遍历的lists.Id
      var locationid = that.data.lists[i].index1;
      var weightid = that.data.lists[i].index2;
      if (i == 0) { var code = e.detail.value.code0; var other = e.detail.value.other0;}
      if (i == 1) { var code = e.detail.value.code1; var other = e.detail.value.other1; }
      if (i == 2) { var code = e.detail.value.code2; var other = e.detail.value.other2; }
      if (i == 3) { var code = e.detail.value.code3; var other = e.detail.value.other3; }
      if (i == 4) { var code = e.detail.value.code4; var other = e.detail.value.other4; }

      if(that.checkOrderInfo(school, addid, locationid, weightid, code, other)){  //整合数据
        locations += (that.data.location[locationid] + "##@@##");
        moneys += (that.data.lists[i].money + "##@@##");
        codes += (code + "##@@##");
        others += (other +"##@@##");
      }else{
        return;
      }
    }
    if(money!=null && money!='' && money!=0){
      console.log("开始传递参数，付款");
      console.log("openid:" + openid);
      console.log("rsite:" + rsite);
      console.log("money:" + money);
      console.log("moneys:" + moneys);
      console.log("locations:" + locations);
      console.log("codes:" + codes);
      console.log("others:" + others);
      that.orderadd(openid, rsite, money, moneys, locations, codes, others)
    }else{
      wx.showModal({
        title: '提示',
        content: '请至少填写一单才能下单哦！',
        showCancel: false,
        confirmText: '知道啦',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      });
      return;
    }
  },
  //下单支付
  // ordersub: function () {
  //   var that = this;
  //   var openid = wx.getStorageSync('openid');
  //   console.log("用户id："+openid);
  //   var school = that.data.defaultschool;
  //   var rsite = that.data.defaultsite;
  //   var locationid = that.data.lists[0].index1;
  //   var location = that.data.location[locationid];
  //   var weightid = that.data.lists[0].index2;
  //   var weight = that.data.weight[weightid];
  //   var code = 'as-123';
  //   var other = '这是备注信息';
  //   var money = that.data.summoney;
  //   var now = new Date();
  //   var addid = that.data.lists[0].id;
  //   console.log(addid);
  //   if(that.checkOrderInfo(school, addid, locationid, weightid, code, other)){
      
  //     that.orderadd(openid, rsite, money, moneys, location, code, other)
  //   }
  // },
  /**
   * picker选择
  */
  bindPickerChange1: function (e) {
    var lists = this.data.lists;
    var index1 = e.detail.value;
    var id = e.currentTarget.dataset.id;
    for (var i = 0; i < lists.length; i++) {
      if (lists[i].id == id) {lists[i].index1 = index1;break;}
    }
    this.setData({
      lists: lists,
    });
    console.log(lists);
  },
  bindPickerChange2: function (e) {
    var lists = this.data.lists;
    var index2 = e.detail.value;
    var id = e.currentTarget.dataset.id;
    var money = this.data.weight[index2].money;
    for (var i = 0; i < lists.length; i++) {
      if (lists[i].id == id) {
         lists[i].index2 = index2; 
        lists[i].money = money;
        break; }
    }
    this.setData({
      lists: lists,
    })
    console.log(lists);
    //更新价格总和
    var summoney = 0;
    for (var i = 0; i < lists.length; i++){
      summoney += lists[i].money;
    };
    summoney = parseFloat(summoney.toFixed(2));  //消除小数点后面太多位
    this.setData({
      summoney:summoney,
    });
  },
  //添加订单
  addList:function(){
    var lists = this.data.lists;
    if (lists.length == 0) var id = 0;   //当删完了，重新补充
    else{
      var id = lists[lists.length - 1].id + 1;
    }
    if (lists.length<5) {
      var newData = { id: id, index1: 0, index2: 0 };
      lists.push(newData);
      this.setData({
        lists: lists,
      });
    }else{
      wx.showModal({
        title: '提示',
        content: '每次最多只能同时下5单。如有更多，请分批下单。',
        showCancel: false,
        confirmText: '知道啦',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      });
      return;
    }
    console.log(lists);
  },
  //删除订单
  delList: function (e) {
    var lists = this.data.lists;
    var id = e.currentTarget.dataset.id;
    for(var i=0;i<lists.length;i++){
      if(lists[i].id>id){
        lists[i].id--;
        lists[i-1]=lists[i];
      }
    }
    lists.pop();
    //更新价格总和
    var summoney = 0;
    for (var i = 0; i < lists.length; i++) {
      summoney += lists[i].money;
    };
    summoney = parseFloat(summoney.toFixed(2));  //消除小数点后面太多位
    this.setData({
      summoney: summoney,
    });
    this.setData({
      lists: lists,
    })
    console.log(lists);
  },   

 //添加地址
  addClick:function(event){
    //console.log(event);
    var p = event.currentTarget.id;
      wx.navigateTo({
        url: '../location/location?id=1',
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.checkSomeValue();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //console.log(app.globalData.userInfo);
    var that = this;
    that.checkSomeValue();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: 'title', //标题
      desc: 'desc', // 描述
      path: 'path' //路径
    }
  },

  /**
   * 启动检查 是否授权，加载当前校区设置
   */
  checkSomeValue: function(){
    var that = this;
    //检查授权
    var hasopenid = wx.getStorageSync('openid');
    console.log("checkopenid:"+hasopenid);
    if(hasopenid == null || hasopenid == ""){
      wx.showModal({
        title: '授权提示',
        content: '首次使用安递物流需要授权哦，我们才能准确为您服务，请点击“我的”，再点击上方授权按钮进行授权，授权之后便可以下单取快递啦！',
        showCancel: false,
        confirmText: '知道啦',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      });
      return false;
    }
    //检查收货地址
    else if (that.data.defaultsite == null){
      wx.showModal({
        title: '设置收货地址',
        content: '您还没有任何收货地址哦，先设置一下收货地址吧！',
        showCancel: true,
        cancelText: '取消',
        confirmText: '设置',
        success: function (res) { 
          if (res.confirm) {
            wx.navigateTo({
              url: '../location/location',
            })
          } else {
            console.log('用户取消设置收货地址')
          }
        },
        fail: function (res) { },
        complete: function (res) { },
      });
      return false;
    }
    else return true;
  },
  /**
   * 下单前检查订单信息是否合法
   */
  checkOrderInfo: function(school,id,location,weight,code,other){
    var that = this;
    //检查收货地址有没有初始化失败
    if(that.data.rname == null && that.data.rphone == null && that.data.rhouse == null && that.data.rdetail == null){
      wx.showModal({
        title: '收货地址出错',
        content: '收货地址初始化失败!',
        showCancel: false,
        confirmText: '确认',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      });
      return false;
    }
    //检查 校区 是否获取失败
    else if(school == null || school == ''){
      wx.showModal({
        title: '读取校区出错',
        content: '校区设置初始化失败',
        showCancel: false,
        confirmText: '确认',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      });
      return false;
    }
    //检查 是否选择快递点
    else if (location == 0 || location == '' || location == null) {
      wx.showModal({
        title: '订单信息不全',
        content: '第'+id+'条订单：未选择快递点。请检查后提交订单！',
        showCancel: false,
        confirmText: '确认',
        success: function (res) {},
        fail: function (res) { },
        complete: function (res) { },
      });
      return false;
    }
    //检查 是否选择重量
    else if (weight == 0 || weight == '' || weight == null) {
      wx.showModal({
        title: '订单信息不全',
        content: '第' + id + '条订单：未选择重量。请检查后提交订单！',
        showCancel: false,
        confirmText: '确认',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      });
      return false;
    }
    //检查 是否填写取件码
    else if (code == null || code == '') {
      wx.showModal({
        title: '订单信息不全',
        content: '第' + id + '条订单：未填写取件码。若无取件码，请标注“无”！',
        showCancel: false,
        confirmText: '确认',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      });
      return false;
    }
    //
    else{
      return true;
    }
  },
  /**
   * 订单提交
   */
  orderadd: function(openid,rsite,money,moneys,locations,codes,others){
    var that = this;
    wx.request({
      url: 'https://test.1zdz.cn/andi/api/orderadd.php',
      method: 'POST',
      data: {
        ouid: openid,
        rid: rsite,
        price: money,
        prices: moneys,
        sites: locations,
        codes: codes,
        others: others,
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        console.log(res.data);
        if (res.data.code == '100') {
          wx.showToast({
            title: '下单成功',
          });
          var timestamp = String(res.data.data.prepay.timeStamp);
          wx.requestPayment({
            'timeStamp': timestamp,
            'nonceStr': res.data.data.prepay.nonceStr,
            'package': res.data.data.prepay.package,
            'signType': res.data.data.prepay.signType,
            'paySign': res.data.data.prepay.paySign,
            'success': function (res) {
              console.log("支付成功！");
              console.log(res);
            },
            'fail': function (res) {
              console.log("支付失败！");
              console.log(res);
            },
            'complete': function (res) {
              
            }
          })
        } else {
          wx.showToast({
            title: '网络错误',
          })
        }
      }
    })
  }
})