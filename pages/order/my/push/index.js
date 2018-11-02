// pages/order/my/push/index.js
var toast = require('../../../../utils/pubic.js');
var Da = require("../../../../utils/fun.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    toView: 'device-info',
    index: 0,
    winWidth: 0,
    winHeight: 0,
    array: ['帮忙代拿', '需要代拿', '帮忙其他', '其他'],
    is_button_male: false,
    is_button_female: false,
    time_start: '8:00',
    time_end: '20:00',
    modalSubmitOrderHidden: true,
    is_sex: '',
    address: '',
    detail: ''
  },

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          winHeight: res.windowHeight
        })
      }
    })
    console.log(this.data.winHeight)
  },

  /**
    * 删除图片
    */
  closeImg: function (e) {
    var that = this;
    var images = that.data.src;
    var index = e.currentTarget.id; //获取当前长按图片下标
    console.log(index)
    console.log(images)
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('点击确定了');
          images.splice(index, 1);
        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }
        that.setData({
          src: images
        });
      }
    })
  },

  /**
   * 上传图片
   */
  upLoadImg: function (e) {
    var that = this
    wx.chooseImage({
      count: 5,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        // success
        console.log(res)
        that.setData({
          src: res.tempFilePaths
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
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

  onChecksex: function (e) {
    var clicktagId = e.target.dataset.id;
    if (clicktagId == 1) {
      this.setData({
        is_button_male: true,
        is_button_female: false,
        is_sex: '男'
      })
    }
    else {
      this.setData({
        is_button_male: false,
        is_button_female: true,
        is_sex: '女'
      })
    }
  },

  onCheckadress: function (e) {
    this.setData({
      address: e.detail.value
    })
  },
  onCheckdetail: function (e) {
    this.setData({
      detail: e.detail.value
    })
  },

  bindPickerTimeStart: function(e) {
    this.setData({
      time_start: e.detail.value
    })
  },
  bindPickerTimeEnd: function (e) {
    this.setData({
      time_end: e.detail.value
    })
  },

  onSumbitOrder: function () {
    var that = this
    if (that.data.detail == '') {
 
    } else if (that.data.is_sex == '') {

    } else {
      that.setData({
        modalSubmitOrderHidden: false,
        head1: '发布类型： ',
        contact_type: that.data.array[that.data.index],
        head2: '需求性别： ',
        contact_sex: that.data.is_sex,
        head3: '想说的话： ',
        contact_detail: that.data.detail,
        head4: '具体地址： ',
        contact_address: that.data.address,
        head5: '时间段： ',
        contact_timestart: that.data.time_start,
        contact_timeend: that.data.time_end ,
        contact_text: '\n\n如果不填详细地址的话，表示只送楼下哦!',
      })
    }
  },

  actionSubmit: function () {
    var openid = wx.getStorageSync('openid')
    var that = this
    wx.request({
      url: Da.dataUrl + '?r=order/saveorderdetail',
      data:{
        openid: openid,
        order_type: this.data.contact_type,
        sex: this.data.is_sex,
        detail_text: this.data.contact_detail,
        address: this.data.contact_address,
        start_time: this.data.contact_timestart,
        end_time: this.data.contact_timeend,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
        // 'Content-Type': 'application/json'
      },
      method: 'POST',
      success: function(res) {
        console.log(res.data)
        if (res.data == true) {
          wx.switchTab({
            url: '../index',
          })
        }
        else {
          toast.show('您还有未处理的订单，请先处理该订单')
        }
      }
    })
  },

  actionCloseModal: function () {
     this.setData({
       modalSubmitOrderHidden: true,
     })
  }

})