// pages/order/my/text_detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onJumpToTalk: function (e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: 'detail/index',
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


})