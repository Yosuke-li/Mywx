// pages/order/list/index.js
var toast = require('../../../utils/util.js');
var Da = require("../../../utils/fun.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingHide: '',
    currentTab: 0,
    winWidth: 0,
    winHeight: 0,
    itemData: [],
    order: [],
    click: false,
    modalSubmitOrderHidden: false,
    modalSubmitOrderHidden1: true,
    hasNewUserAgreementVersion: false,
    limit: 10,
  },

  bindChange: function(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },

  /**
   * 点击tab切换
   */
  swichNav: function(e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var openid = wx.getStorageSync('openid')

    // 显示正在加载...
    toast.showLoading()

    /**
     * 获取系统信息
     */
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          openid: openid,
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });

    that.getOrder()
    that.getAccesstoken()
  },

  getOrder: function() {
    var that = this
    wx.request({
      url: Da.dataUrl + '?r=order/getallorder',
      data: {
        openid: that.data.openid,
        status: 10,
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
        // 'Content-Type': 'application/json'
      },
      success: function(res) {
        that.setData({
          order: res.data,
          loadingHide: true,
        })
        console.log('========res.data=========')

        // 隐藏加载提示
        toast.hideLoading()
      }
    })
  },

  getDetail: function(e) {
    this.setData({
      modalSubmitOrderHidden: true,
      hasNewUserAgreementVersion: true,
      checkOrder: this.data.order[e.currentTarget.dataset.index]
    })
  },

  actionCloseModal: function(e) {
    this.setData({
      hasNewUserAgreementVersion: false,
      checkOrder: ''
    })
  },

  closeAgreement: function() {
    this.setData({
      hasNewUserAgreementVersion: false,
      checkOrder: ''
    })
  },

  /**
   * 接
   */
  actionSubmit: function(e) {
    var status = 2
    var that = this

    // 显示正在加载...
    toast.showLoading()

    wx.request({
      url: Da.dataUrl + '?r=order/changeorder',
      data: {
        openid: that.data.openid,
        status: status,
        order_no: that.data.checkOrder.order_no
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
        // 'Content-Type': 'application/json'
      },
      success: function(res) {
        console.log(res.data.success)
        if (res.data.success != true) {
          toast.show('接单失败')
        } else {
          that.actionCloseModal()
          that.getOrder()
          toast.show('已接单')
        }
      }
    })
  },

  getAccesstoken: function() {
    var that = this
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx1e5e51581c102b66&secret=b1cef0526d4c19b2261a0e33fee62e41',
      success: function(res) {
        that.setData({
          access_token: res.data.access_token
        })
        console.log(res.data)
      }
    })
  },

  submitForm: function(e) {
    var self = this;
    wx.request({
      url: Da.dataUrl + '?r=order/getwxapi',
      data: {
        access_token: self.data.access_token,
        touser: self.data.openid,
        template_id: 'JSedyUDHIudKMBcQPVvormr28xGDYrmJ3MwjS9ma8qo',
        page: 'pages/order/my/index',
        form_id: e.detail.formId,
        keyword1: self.data.checkOrder.order_no,
        keyword6: self.data.checkOrder.status_wait_time,
        keyword7: self.data.checkOrder.user_name,
        user_stunum: self.data.checkOrder.user_stunum,
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
        // 'Content-Type': 'application/json'
      },
      success: function(res) {
        console.log(res.data.msg.errmsg)
        if (res.data.msg.errmsg != 'ok') {
          self.getAccesstoken()
          toast.show('Accesstoken失效，现已重新获取，麻烦再点击一次')
        }
        self.actionSubmit()
        self.setData({
          hasNewUserAgreementVersion: false,
        })
      },
      fail: function(err) {
        console.log('request fail ', err);
      },

    })
  },

  onHide: function(options) {
    clearInterval(this.data.setInter)
    clearInterval(this.data.access_token)
    console.log('~~~~清除轮询~~~~')
  },

  onShow: function(options) {
    var setInter = setInterval(this.getOrder, 5000)
    this.setData({
      setInter: setInter,
    })
  },

  click: function() {
    if (this.data.click == true) {
      this.setData({
        click: false
      })
    } else {
      this.setData({
        click: true
      })
    }
  },

  //下拉刷新事件
  scrolltolower: function() {
    if (this.data.limit < this.data.order.length) {
      this.loadMoreDetail()
      console.log('下拉事件触发')
    }
  },

  loadMoreDetail: function() {
    var limit = this.data.limit
    this.setData({
      limit: limit + 10,
    })
  },
})