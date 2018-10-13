//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {},
    hasUserInfo: false,
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
  onLoad: function () {
    this.refreshLoginState();
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
