// pages/ChannelBookDetails/ChannelBookDetails.js
var app = new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookinfo: {}, //书籍信息
    haveComment:true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getBookInfo();
    this.getAtocId();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  //获取书籍信息
  getBookInfo: function() {
    var that = this;
    wx.request({
      url: 'http://api.zhuishushenqi.com/book/' + app.globalData.bookid,
      success: function(res) {
        console.log(res.data)
        //四舍五入评分
        res.data.rating.score = res.data.rating.score.toFixed(1);
        //图片地址url解码
        res.data.cover = decodeURIComponent(res.data.cover).substring(7);
        res.data.updated = that.formatUTC(res.data.updated);
        that.setData({
          bookinfo: res.data
        })
      }
    })
  },

  //更多
  more: function() {
    wx.navigateTo({
      url: '/pages/BookInfoMore/BookInfoMore',
    })
  },

  //进入
  chapter: function() {
    wx.navigateTo({
      url: "/pages/BookChapter/BookChapter",
    })
  },

  //开始阅读
  beginRead: function() {

    wx.navigateTo({
      url: '../Book/Book?bookindex=0&atocic=' + app.globalData.atocic
    })

  },
  //获取书籍目录
  getAtocId: function() {
    //获取小说源id
    wx.request({
      url: 'http://bookapi05.zhuishushenqi.com/btoc?view=summary&book=' + app.globalData.bookid + '&platform=h5&token=',
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        getApp().globalData.atocic = res.data[0]._id
      },
      fail: (res) => {
        wx.showToast({
          title: '获取书籍目录失败，请重试',
          icon: 'none'
        })
      }

    })

  },

  //加入书架
  joinBookShelves: function() {
    if(app.globalData.isLogin==true){
    var bookShelves = this.data.bookinfo;
    var that = this;
    //查看书籍是否在书架
    wx.request({
      url: app.serviceURL + 'isBookShelves',
      method: 'POST',
      data: {
        userid: app.globalData.openid,
        bookid: bookShelves._id,
      },
      success: function(res) {
        //如果书架在书架中，提示并跳出
        if (res.data == true) {
          wx.showToast({
            title: '此书已在书架中',
            icon: 'none'
          })
        } else {
          //否则就将书籍加入到书架
          wx.request({
            url: app.serviceURL + 'addBookShelves',
            method: 'POST',
            data: {
              userid: app.globalData.openid,
              bookid: that.data.bookinfo._id,
              title: that.data.bookinfo.title,
              cover: that.data.bookinfo.cover,
              author: that.data.bookinfo.author,
              majorCate: that.data.bookinfo.majorCate,
              minorCate: that.data.bookinfo.minorCate,
              latelyFollower: that.data.bookinfo.latelyFollower,
              longIntro: that.data.bookinfo.longIntro
            },
            success: function(res) {
              if (res.data == true) {
                wx.showToast({
                  title: '成功添加到书架~',
                  icon: 'none'
                })
              } else {
                wx.showToast({
                  title: '添加失败，请稍后再试',
                  icon: 'none'
                })
              }
            }
          })
        }
      }
    })
    }else{
      wx.redirectTo({
        url: '/pages/Authorization/Authorization',
      })
    }
  },

  //时间格式转换
  formatUTC: function(utc_datetime) {
    // 转为正常的时间格式 年-月-日
    var T_pos = utc_datetime.indexOf('T');
    var Z_pos = utc_datetime.indexOf('Z');
    var year_month_day = utc_datetime.substr(0, T_pos);
    return year_month_day;
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})