// pages/mine/myorder.js
Page({
  data: {
    // tab切换  
    currentTab: 0,
    navbar: ['待付款', '未配送', '已完成'],
    myorder:[{
      oid: '123456789098765432123',oname:'丁昊',message:'中通快递-3756',otime:'2018.9.10 13:03'
    }
    ],


    orders: [{ id: 1 ,index:0 }],

     
  },
  //tab
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  } ,

  //删除订单
  delList: function (e) {
    var orders = this.data.orders;
    var id = e.currentTarget.dataset.id;
    for (var i = 0; i < orders.length; i++) {
      if (orders[i].id > id)
       orders[i - 1] = orders[i];
    }
    orders.pop();
    this.setData({
      orders: orders,
    })
    console.log(orders);
  }, 

  onLoad: function (options) {
    // 生命周期函数--监听页面加载
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
   
  }
})