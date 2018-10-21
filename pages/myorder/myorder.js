// pages/mine/myorder.js
Page({
  data: {
    // tab切换  
    currentTab: 0,
    navbar: ['待付款', '未配送', '已完成'],
    myorder1:[
      { oid: '', name: '', message: '', time: '', money: 11 },
    ],
    myorder2: [
      { oid: '', name: '', message: '', time: '', money: 11 },
    ],
    myorder3: [
      { oid: '', name: '', message: '', time: '', money: 11 },
    ],
  },
  //tab
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  } ,
  //复制单号
  copyoid: function(e){
    var that = this;
    var content = '订单号：' + e.currentTarget.dataset.oid ;
    wx.setClipboardData({
      data: content,
      success: function (res) {
        wx.showToast({
          title: '单号复制成功！',
          duration: 1000
        });
      }
    })
  },
  //支付订单
  payorder: function (e) {
    console.log(e);
    var that = this;
    var openid = wx.getStorageSync('openid');  //   openid
    var oid = e.currentTarget.dataset.oid;
    var money = e.currentTarget.dataset.money;
    money = parseFloat(money).toFixed(2);
    console.log(money);
    wx.request({
      url: 'https://test.1zdz.cn/andi/api/payorder.php',
      method: 'POST',
      data: {
        openid: openid,
        oid: oid,
        money: 0.01,
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        console.log(res.data);
        var oids = res.data.oids; //获取单号
        if (res.data.code == '100') {
          var timestamp = String(res.data.data.prepay.timeStamp);
          wx.requestPayment({
            'timeStamp': timestamp,
            'nonceStr': res.data.data.prepay.nonceStr,
            'package': res.data.data.prepay.package,
            'signType': res.data.data.prepay.signType,
            'paySign': res.data.data.prepay.paySign,
            'success': function (res) {
              that.paysuccess(oids);
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

  }, 

  //删除订单
  delorder: function (e) {
    console.log(e);
    var that = this;
    var oid = e.currentTarget.dataset.oid;
    var openid = wx.getStorageSync('openid');//获取用户openid
    wx.request({
      url: 'https://test.1zdz.cn/andi/api/ordercancle.php',
      method: 'post',
      data: {
        openid: openid,
        oid: oid,
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if (res.data.code == '100') {
          wx.showToast({
            title: '删除成功',
          })
        } else if (res.data.code == '120') {
          wx.showToast({
            title: '删除失败',
          })
        } else {
          wx.showToast({
            title: '网络错误',
          })
        }
      },
      fail: function (res) { },
      complete: function (res) {
        that.refeshOrder();
      }
    })

  }, 

  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    var that = this;
    that.refeshOrder();
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
  },
  onShow: function () {
    // 生命周期函数--监听页面显示
  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏
  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载
  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作
  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数
  },
  onShareAppMessage: function () {
   
  },
  /**
   * 获取订单信息
   */
  refeshOrder: function(){
    var that = this;
    var opneid = wx.getStorageSync('openid');//获取用户openid
    wx.request({
      url: 'https://test.1zdz.cn/andi/api/userorderlist.php',
      method: 'post',
      data:{
        openid: opneid,
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        console.log(res);
        var order1 = new Array;
        for (var i = 0; i < res.data.list1.length; i++) {
          order1[i] = new Object;
          order1[i].oid = res.data.list1[i].oid;
          order1[i].name = res.data.list1[i].oname;
          order1[i].message = res.data.list1[i].omsg;
          order1[i].time = res.data.list1[i].otime;
          order1[i].money = res.data.list1[i].omoney;
        }
        var order2 = new Array;
        for (var i = 0; i < res.data.list2.length; i++) {
          order2[i] = new Object;
          order2[i].oid = res.data.list2[i].oid;
          order2[i].name = res.data.list2[i].oname;
          order2[i].message = res.data.list2[i].omsg;
          order2[i].time = res.data.list2[i].otime;
          order2[i].money = res.data.list2[i].omoney;
        }
        var order3 = new Array;
        for (var i = 0; i < res.data.list3.length; i++) {
          order3[i] = new Object;
          order3[i].oid = res.data.list3[i].oid;
          order3[i].name = res.data.list3[i].oname;
          order3[i].message = res.data.list3[i].omsg;
          order3[i].time = res.data.list3[i].otime;
          order3[i].money = res.data.list3[i].omoney;
        }
        that.setData({ 
          myorder1: order1,
          myorder2: order2,
          myorder3: order3, 
        });
      },
      fail: function (res) { },
      complete: function (res) {
        //停止刷新
        wx.stopPullDownRefresh();
        // 隐藏顶部刷新图标
        wx.hideNavigationBarLoading();
      }
    })
  },
  /**
   * 支付成功
   */
  paysuccess: function (oids) {
    var that = this;
    wx.request({
      url: 'https://test.1zdz.cn/andi/api/paysuccess.php',
      method: 'POST',
      data: {
        oids: oids,
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        console.log(res);
        if (res.data.code == '100') {
          wx.showToast({
            title: '结算成功',
          });
          that.refeshOrder();
        } else {
          wx.showToast({
            title: '网络错误',
          })
        }
      }
    })
  }
})