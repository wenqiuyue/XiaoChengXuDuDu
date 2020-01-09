// pages/MyFans/MyFans.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myFans:[]  //我的粉丝
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getFans();
  },
  //查询粉丝
  getFans: function () {
    var that = this;
    wx.request({
      url: app.serviceURL + 'getFans',
      method: "POST",
      data: {
        ruserid: app.globalData.openid
      },
      success: function (res) {
        if (res.data.fans != "") {
          that.setData({
            myFans: res.data.fans
          })
          console.log(that.data.myFans);
        } else {
          wx.showToast({
            title: '您还没有关注的人哦~',
            icon: 'none'
          })
        }

      }
    })
  },

  //查看粉丝的发布
  fansRelease:function(e){
    wx.navigateTo({
      url: '/pages/OtherRelease/OtherRelease?ruserid=' + e.currentTarget.dataset.rid,
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