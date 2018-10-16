//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {},
    hasUserInfo: false,
    huancun:0,
  },

  bindGetUserInfo(e) {
    var that = this;
    console.log(e.detail.userInfo);
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: 'https://test.1zdz.cn/andi/api/wxlogin.php',
          method: 'POST',
          data:{
            wxcode: res.code,
          },
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          success: function(e){
            //获取openid
            console.log(e.data.openid);
            //储存oppenid
            wx.setStorage({
              key: 'openid',
              data: e.data.openid,
            })
            //刷新登录状态
            that.refreshLoginState();
            that.setData({
              hasUserInfo: true
            })
          }
        })
      }
    })

  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //拨打客服电话
  makecall: function(){
    wx.makePhoneCall({
      phoneNumber: '18841167239',
    })
  },
  //清除缓存
  clearcache: function(){
    var that = this;
    that.setData({
      huancun: 0,
    });
    // wx.showModal({
    //   title: '高危操作',
    //   content: '此操作将清除你本机记录的所有状态（不包括订单记录和收货地址），下次使用将需要重新授权！请确认是否继续操作！',
    //   showCancel: true,
    //   cancelText: '取消',
    //   confirmText: '确认',
    //   success: function (res) {
    //     if(res.confirm){
    //       wx.clearStorage();
    //       that.setData({
    //         huancun: 0,
    //         hasUserInfo: false
    //       });
    //     }
    //   },
    //   fail: function (res) { },
    //   complete: function (res) { },
    // });
  },
  onLoad: function () {
    var that = this;
    that.refreshLoginState();
    wx.getStorageInfo({
      success: function(res) {
        that.setData({
          huancun: res.currentSize,
        });
      },
    })
  },
  //获取登录状态
  refreshLoginState: function(){
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  }
})
