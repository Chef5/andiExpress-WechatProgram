
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
      '请选择哦~', '小于1.5kg', '1.5kg~3kg', '3~5kg', '较大件单独处理'
    ],
    lists: [{id:1, index1:0, index2:0}]
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
    for (var i = 0; i < lists.length; i++) {
      if (lists[i].id == id) { lists[i].index2 = index2; break; }
    }
    this.setData({
      lists: lists,
    })
    console.log(lists);
  },
  //添加订单
  addList:function(){
    var lists = this.data.lists;
    if (lists.length == 0) var id = 0;
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
    console.log(event);
    var p = event.currentTarget.id;
      wx.navigateTo({
        url: '../location/location?id=1',
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


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
    console.log(app.globalData.userInfo);
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
  }


})