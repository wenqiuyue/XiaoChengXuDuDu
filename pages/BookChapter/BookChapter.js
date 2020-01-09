// pages/BookChapter/BookChapter.js
var app=new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookid:"",   //书籍id
    bookchapter:[],   //书籍的目录
    atocic:""  //小说源id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getChapter();
  },
  //很具小说源id获取小说目录
  getChapter:function(){
    wx.request({
      url: 'http://bookapi03.zhuishushenqi.com/btoc/' + app.globalData.atocic+'?view=chapters&channel=mweb&platform=h5&token=',
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        this.setData({
          bookchapter: res.data
        })
        console.log(res.data);
      },
      fail: (res) => {
        wx.showToast({
          title: '获取书籍目录失败，请重试',
          icon: 'none'
        })
      }

    })

  },
  //选择章节开始阅读
  beginRed:function(event){
    var link=event.target.dataset.link;
    var bookindex = event.target.dataset.bookindex;
    console.log()
    wx.navigateTo({
      url: '/pages/Book/Book?bookindex=' + bookindex + '&atocic=' + app.globalData.atocic,
    })
  },
  reverse:function(){},
  /**
   * 生命周期函数--监听页面初次渲染完成s
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