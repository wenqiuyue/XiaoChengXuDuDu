// pages/InterestBook/InterestBook.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    interestbook:[]   //感兴趣的书
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInterestBook();
  },
  //获取感兴趣的书
  getInterestBook:function(){
    this.setData({
      interestbook:app.globalData.interestbook
    })
  },
  //查看书籍信息
  bookInfo: function (event) {
    console.log(event.currentTarget.dataset.id);
    getApp().globalData.bookid = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/ChannelBookDetails/ChannelBookDetails',
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