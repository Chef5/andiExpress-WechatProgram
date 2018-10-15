
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
      { item: '小于1.5kg', money: 2.6 }, 
      { item: '1.5kg~3kg', money: 4.5 }, 
      { item: '3~5kg', money: 7 }, 
      { item: '较大件单独处理', money: 8.8 }, 
    ],
    lists: [{id:1, index1:0, index2:0, money:null}],
    summoney: 0,     //总金额
    defaultsite: null,  //用户的收货地址rid
    defaultschool: '大连工业大学',   //默认校区：大连工业大学
    rname: null,   //获取的收货人
    rphone: null,  //获取的收货手机号
    rhouse: null,  //获取的收货宿舍
    rdetail:null,   //获取的收货宿舍详细
  },

  //下单支付
  ordersub: function () {
    var that = this;
    var openid = wx.getStorageSync('openid');
    console.log("用户id："+openid);
    var rsite = that.data.defaultsite;
    var location = that.data.location[that.data.lists[0].index1];
    var code = 'A123-33';
    var other = '这是备注信息';
    var money = that.data.summoney;
    var now = new Date();
    wx.request({
      url: 'https://test.1zdz.cn/andi/api/orderadd.php',
      method: 'POST',
      data: {
        ouid: openid,
        rid: rsite,
        price: 0.01,
        site: location,
        code: code,
        other: other,
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        console.log(res.data);
        if (res.data.code == '100') {
          wx.showToast({
            title: '下单成功',
          });
          //请求预支付  获取prepay_id
          // var stringA = "appid=wxe7a6f2d04fc6b446&body=安递物流工作室-订单收费"+
          // wx.request({
          //   url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
          //   method: 'POST',
          //   data: {
          //     appid: 'wxe7a6f2d04fc6b446',
          //     mch_id: '1515924921',
          //     nonce_str: 'as79dafnigy8daf87dydf2ktyudssdfgjl536ll',
          //     body: '安递物流工作室-订单收费',
          //     out_trade_no: res.data.data.oid,
          //     total_fee: money,
          //     notify_url: 'https://test.1zdz.cn/andi/paystate.php',
          //     trade_type: 'JSAPI',
          //     sign: '',
          //   }
          // })
          //正式提交支付
          //var utilMd5 = require('../../utils/md5.js');
          //var needmd5str = "appId=wxe7a6f2d04fc6b446&nonceStr="+res.data.data.nonstr+"&package=prepay_id="+res.data.data.prepay+"&signType=MD5&timeStamp="+res.data.data.time+"&key=";
          //var paySign = utilMd5.hexMD5(needmd5str);
          var timestamp = String(res.data.data.prepay.timeStamp);
          console.log(timestamp);
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
            'complete': function (res) { }
          })
        } else {
          wx.showToast({
            title: '网络错误',
          })
        }
      }
    })
  },
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
    var newData = {id: id, index1:0, index2:0 };
    lists.push(newData);
    this.setData({
      lists:lists,
    });
    console.log(lists);
  },
  //删除订单
  delList: function (e) {
    var lists = this.data.lists;
    var id = e.currentTarget.dataset.id;
    for(var i=0;i<lists.length;i++){
      if(lists[i].id>id)lists[i-1]=lists[i];
    }
    lists.pop();
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
        content: '首次使用安递物流需要授权哦，我们才能准确为您服务，请点击“我的”，再点击授权按钮进行授权，授权之后便可以下单去快递啦！',
        showCancel: false,
        confirmText: '知道啦',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      });
      return;
    }
    //检查收货地址
    if (that.data.defaultsite == null){
      wx.showModal({
        title: '设置收货地址',
        content: '您还没有任何收货地址哦，先设置一下收货地址吧！',
        showCancel: true,
        cancelText: '取消',
        confirmText: '设置',
        success: function (res) { 
          if (res.confirm) {
            wx.reLaunch({
              url: '../location/location',
            })
          } else {
            console.log('用户取消设置收货地址')
          }
        },
        fail: function (res) { },
        complete: function (res) { },
      });
      return;
    }
  }
})