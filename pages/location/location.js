// pages/location/location.js
var app =getApp();
Page({
     
  /**
   * 页面的初始数据
   */
  data: {
    site: [
      { rid: 1 , name: '丁昊', phone:'173547282636', school:'大连工业大学', house:'17舍', detail:'527', check:''}
    ],
    hideedit: true,
    hideadd: true,
    indexhouse: 0,
    indexschool: 0,
    house: ['1舍', '2舍', '3舍', '4舍', '5舍', '6舍'],
    school: ['大连工业大学'],
    // editrid: 0,
    // editname: '',
    // editphone: '',
    // editschool: '',
    // edithouse: '',
    // editdetail: '',
  },

  //选择校区
  bindPickerSchool: function(e){
    var that = this;
    that.setData({
      indexschool: e.detail.value,
    });
  },
  //选择楼栋
  bindPickerHouse: function (e) {
    var that = this;
    that.setData({
      indexhouse: e.detail.value,
    });
  },

  //开始添加地址
  addClick: function (e) {
    var that = this;
    that.setData({
      hideadd: false,
    })
  },
  //添加地址确认
  addconfirm: function (e) {
    console.log(e);
    var that = this;
    var openid = wx.getStorageSync('openid'); //当前用户openid
    var mname = e.detail.value.name; //获取姓名
    var mphone = e.detail.value.phone; //获取手机号
    var mdetail = e.detail.value.detail; //获取宿舍
    var mschool = that.data.school[that.data.indexschool]; //获取校区
    var mhouse = that.data.house[that.data.indexhouse]; //获取校区
    wx.request({
      url: 'https://test.1zdz.cn/andi/api/rsiteadd.php',
      method: 'POST',
      data: {
        openid: openid,
        name: mname,
        phone: mphone,
        detail: mdetail,
        school: mschool,
        house: mhouse
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if (res.data.code == '100') {
          wx.showToast({
            title: '添加成功',
          });
          that.refreshList();
          that.setData({
            hideadd: true
          });
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
  //添加地址完成
  addcomplete: function(){
    var that = this;
    that.setData({
      hideadd: true
    });
    that.refreshList();
  },


  //选择地址
  radioChange: function (e) {
    console.log(e.detail.value);
    wx.setStorage({
      key: 'rid',
      data: e.detail.value,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this;
    that.refreshList();
    var site = that.data.site;
    var hasrid = wx.getStorageInfoSync('rid');
    if(hasrid==null || hasrid==''){
      for (var i = 0; i < site.length; i++) site[i].check = false;
      site[0].check=true;
    }
    else{
      for(var i=0; i<site.length; i++){
        if (site[i].rid == hasrid)site[i].check = true;
        else site[i].check = false;
      }
    }
    that.setData({
      site: site,
    });
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
          var rid = e.currentTarget.dataset.rid;
          wx.request({
            url: 'https://test.1zdz.cn/andi/api/rsitedel.php',
            method: 'POST',
            data: {
              openid: openid,
              rid: rid,
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
    var editschool = 0;
    var edithouse = 0;
    var school = that.data.school;
    var house = that.data.house;
    for (var i = 0; i < school.length; i++) if (school[i] == e.currentTarget.dataset.school){ editschool = i; break;}
    for (var i = 0; i < house.length; i++) if (house[i] == e.currentTarget.dataset.house) {edithouse = i; break;}
    //获取当前收货地址信息
    that.setData({
      editrid: e.currentTarget.dataset.rid,
      editname: e.currentTarget.dataset.name,
      editphone: e.currentTarget.dataset.phone,
      editschool: editschool,
      edithouse: edithouse,
      editdetail: e.currentTarget.dataset.detail,
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
  //获取用户的收货地址
  refreshList: function () {
    var that = this;
    var openid = wx.getStorageSync('openid');
    wx.request({
      url: 'https://test.1zdz.cn/andi/api/rsitelist.php',
      method: 'POST',
      data: {
        openid: openid,
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        console.log(res);
        var site = new Array;
        for (var i = 0; i < res.data.data.length; i++) {
          site[i] = new Object;
          site[i].rid = res.data.data[i].rid;
          site[i].name = res.data.data[i].rname;
          site[i].phone = res.data.data[i].rphone;
          site[i].school = res.data.data[i].rschool;
          site[i].house = res.data.data[i].rhouse;
          site[i].detail = res.data.data[i].rdetail;
          site[i].check = '';
        }
        that.setData({ site: site, });
      },
      fail: function (res) { },
      complete: function (res) { }
    })
  }
})