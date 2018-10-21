// pages/coupon/coupon.js

Page({
  data: {
    optionList: [
      {
        icon: ''
      },
      {
        icon: ''
      }
    ],
    showAddBtn: 1
  },
  recordValue: function (e) {
    let _optionList = this.data.optionList;
    let _index = e.target.dataset.index;
    let value = e.detail.value;
    _optionList[_index].value = value;
    this.setData({ optionList: _optionList });
  },
  addOption: function (e) {
    let _optionList = this.data.optionList;
    _optionList.push({ icon: '../../image/order.png' })
    this.setData({ optionList: _optionList });
    // 选项大于15个后移除添加按钮
    if (_optionList.length >= 15) {
      this.setData({ showAddBtn: 0 });
    } else if (_optionList.length < 15) {
      this.setData({ showAddBtn: 1 });
    }
  },
  delOption: function (e) {
    let _index = e.target.dataset.index;
    let _optionList = this.data.optionList;

    _optionList.splice(_index, 1);

    this.setData({ optionList: _optionList });
    if (_optionList.length < 15) {
      this.setData({ showAddBtn: 1 });
    }
  }
})
