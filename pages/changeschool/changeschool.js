// pages/changeschool/changeschool.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioItems: [
      { school: '大连工业大学', value: '大连工业大学',  checked: true },
    ],
  },
  radioChange: function (e) {
    var that = this;
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }
    this.setData({
      radioItems: radioItems
    });
    wx.setStorage({
      key: 'school',
      data: e.detail.value,
    });
    console.log("存校区:" + e.detail.value);
    // wx.showToast({
    //   title: '校区设置成功！',
    //   duration: 1000
    // });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var radioItems = that.data.radioItems;
    wx.getStorage({
      key: 'school', success: function (res) {
        if (res.data == null) {
          radioItems[0].checked = true;
          wx.setStorage({
            key: 'school',
            data: "大连工业大学",
          });
        }
        // else {    //设置其他校区
        //   for (var i = 0; i < 4; i++) {
        //     if (res.data == that.data.radioItems[i].value) {
        //       radioItems[i].checked = radioItems[i].value == res.data;
        //     }
        //     else radioItems[i].checked = false;
        //   }
        // }
        that.setData({ radioItems: radioItems });
      },
      fail: function () {
        var radioItems = that.data.radioItems;
        radioItems[0].checked = true;
        wx.setStorage({
          key: 'school',
          data: "大连工业大学",
        });
        that.setData({ radioItems: radioItems });
        return;
      }
    });
    // wx.request({  //可请求校区
    //   url: '',
    //   success: function (res) {
        
    //     that.setData({ radioItems: radioItems });
    //   }
    // })
    console.log(radioItems);
    console.log(that.data.radioItems);
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

  }
})