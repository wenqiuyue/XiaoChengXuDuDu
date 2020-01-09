// pages/BookInfoMore/BookInfoMore.js
var app=new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookid:"",  //书籍信息
    bookinfo:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取书籍详情
    wx.request({
      url: 'http://api.zhuishushenqi.com/book/' + app.globalData.bookid,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        var book = res.data;
        //四舍五入评分
        book.rating.score = book.rating.score.toFixed(1);
        //封面图片地址解析
        book.cover = decodeURIComponent(res.data.cover).substring(7);
        //时间格式转换
        book.updated = this.formatUTC(book.updated);
        this.setData({
          bookinfo: book
        })
        console.log(this.data.bookinfo);
      },
      fail: (res) => {
        wx.showToast({
          title: '获取书籍失败,请重试',
          icon: 'none'
        })
      }
    })
  },
  //时间格式转换
  formatUTC: function (utc_datetime) {
    // 转为正常的时间格式 年-月-日
    var T_pos = utc_datetime.indexOf('T');
    var Z_pos = utc_datetime.indexOf('Z');
    var year_month_day = utc_datetime.substr(0, T_pos);
    return year_month_day;
  },
  //点击开始阅读
  begin: function () {
    console.log(1);

    wx.navigateTo({
      url: '../Book/Book?bookindex=0&atocic=' + app.globalData.atocic
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