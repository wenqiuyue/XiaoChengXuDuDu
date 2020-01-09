// pages/channel/channelProse.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navArray: ['传记名著', '出版小说', '人文社科', '生活时尚', '经管理财', '青春言情', '外文原版', '政治军事', '成功励志','育儿健康'],
    currentIndexNav:0,
    typeName:"传记名著",
    windowHeight:'',
    limit:20

  },
  // 点击导航
  typeClick:function(title){
    this.setData({
      typeName:title.detail.title,
      limit:10
    })
    console.log(this.data.typeName);
    this.novel.getBookList();
    // this.novel.scroll();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getNavArray();
    var that = this;

    //获得屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        })
      }
    })
  },

  //下拉触底加载更多
  lower: function () {
    this.setData({
      limit: this.data.limit+=10
    })
    this.novel.getBookList();
    console.log(this.data.limit);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.novel = this.selectComponent("#novel");
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