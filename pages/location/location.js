// pages/location/location.js
var app =getApp();
Page({
     
  /**
   * 页面的初始数据
   */
  data: {
    myaddress: [{
      name: '丁昊', Tel:'173547282636',address:'大连工业大学-17舍-527'
    }
    ],
    hideedit: true,
    hideadd: true,
  },
  //添加地址
  addClick: function (event) {
    console.log(event);
    var p = event.currentTarget.id;
    wx.navigateTo({
      url: '../addlocation/addlocation?id=1',
    })
  },
  //选择地址
  redioChange: function (e) {
    console.log(e.detail.value)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        console.log('onLoad')
        var that =this;
        app.getUserInfo(function(userInfo){
          that.setData({
            userInfo:userInfo
          })
        })
  },
  /**
   * 删除收货地址
   */
  deletesite: function (e) {
    var that = this;
    wx.showModal({
      title: '操作提示',
      content: '此操作将删除该收货地址所有信息，请确认是否继续删除！',
      confirmText: "确认删除",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          //当前用户openid
          var openid = wx.getStorageSync('openid');
          //修改数据
          var mid = e.currentTarget.dataset.id;
          wx.request({
            url: 'https://test.1zdz.cn/andi/api/',
            method: 'POST',
            data: {
              admin: admin,
              mid: mid,
            },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (res) {
              console.log(res);
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
              that.refreshList();
            }
          })
        } else {
          console.log('不删除了')
        }
      }
    });
  },
  /**
   * 编辑收货地址
   */
  editsite: function (e) {
    var that = this;
    //获取当前收货地址信息
    that.setData({
      editid: e.currentTarget.dataset.id,
      hideedit: false,
    });
  },
  editconfirm: function (e) {
    console.log(e);
    //当前用户openid
    var admin = wx.getStorageSync('openid');
    //修改数据
    var mid = e.detail.value.id;
    wx.request({
      url: 'https://test.1zdz.cn/andi/api/',
      method: 'POST',
      data: {
        admin: admin,
        mid: mid,
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        console.log(res.data);
        if (res.data.code == '100') {
          wx.showToast({
            title: '修改成功',
          })
        } else if (res.data.code == '120') {
          wx.showToast({
            title: '修改失败',
          })
        } else {
          wx.showToast({
            title: '网络错误',
          })
        }
      },
      fail: function (res) { },
      complete: function (res) { }
    })
  },
  editcomplete: function (e) {
    var that = this;
    that.setData({
      hideedit: true,
    });
    that.refreshList();
  },
  /**
   * 添加收货地址
   */
  addsite: function () {
    var that = this;
    that.setData({
      hideadd: false,
    });
  },
  addconfirm: function (e) {
    console.log(e);
    //当前用户openid
    var openid = wx.getStorageSync('openid');
    //添加数据
    var mname = e.detail.value.name;
    wx.request({
      url: 'https://test.1zdz.cn/andi/api/',
      method: 'POST',
      data: {
        admin: admin,
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if (res.data.code == '100') {
          wx.showToast({
            title: '添加成功',
          })
        } else if (res.data.code == '120') {
          wx.showToast({
            title: '添加失败',
          })
        } else {
          wx.showToast({
            title: '网络错误',
          })
        }
      },
      fail: function (res) { },
      complete: function (res) { }
    })
  },
  addcomplete: function (e) {
    var that = this;
    that.setData({
      hideadd: true,
    });
    that.refreshList();
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

  },
  refreshList: function () {
    var that = this;
    var openid = wx.getStorageSync('openid');
    wx.request({
      url: 'https://test.1zdz.cn/andi/api/',
      method: 'POST',
      data: {
        openid: openid,
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        console.log(res);
        var person = new Array;
        console.log(person);
        for (var i = 0; i < res.data.data.length; i++) {
          person[i] = new Object;
          person[i].id = res.data.data[i].mid;
        }
        that.setData({ person: person, });
      },
      fail: function (res) { },
      complete: function (res) { }
    })
  }
})