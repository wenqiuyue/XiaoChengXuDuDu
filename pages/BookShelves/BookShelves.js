// pages/BookShelves/BookShelves.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDelBookShelves:false,
    bookid:"",   //点击书架被删除的书籍id
    bookShelves:[]   //书架
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBookShelves();
  },

  //删除书架书籍
  delBook(e){
    this.setData({
      isDelBookShelves:true,
      bookid: e.currentTarget.dataset.id
    })
  },

  //点击确定删除书架书籍
  onConfirmDelBookShelves(){
    var that=this;
    wx.request({
      url: app.serviceURL + 'delBookShelves',
      method: "POST",
      data: {
        userid: app.globalData.openid,
        bookid: this.data.bookid
      },
      success: function (res) {
        that.getBookShelves();
      }
    })
  },

  //点击取消删除书架书籍
  onCancelDelBookShelves(){
    console.log("取消删除")
  },

  //查询用户书架
  getBookShelves:function(){
    var that=this
    wx.request({
      url: app.serviceURL + 'getBookShelvesById',
      method:'GET',
      data:{
        userid: app.globalData.openid
      },
      success:function(res){
        console.log(res.data);
        that.setData({
          bookShelves: res.data
        })
      }
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