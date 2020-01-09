// pages/yaoyao/yaoyiyao.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    allData: []
  },


  /**
     * 生命周期函数--监听页面显示
     */
  onShow: function () {
    var that = this;
    this.isShow = true;
    var audioCtx = wx.createAudioContext('myAudio') 
    var start = Math.floor(Math.random() * 30);
    var url ="https://api.zhuishushenqi.com/book/by-categories?gender=press&type=hot&major=%E4%BA%BA%E6%96%87%E7%A4%BE%E7%A7%91&minor=&start="+start+"&limit=50";
    wx.onAccelerometerChange(function (e) {
      if (!that.isShow) {
        return
      }
      //console.log("xxxx" + e.x);
     // console.log("yyyyyy" + e.y);
      if (e.x > 0.1 && e.y > 0.1) {
        console.log("xxxx" + e.x);
        console.log("yyyyyy" + e.y);
        audioCtx.setSrc('http://pic.ibaotu.com/00/43/58/92J888piCmbi.mp3'); //音频文件，第三方的可自行选择
        audioCtx.play(); //播发音频
        wx.showToast({
          title: '摇成功啦',
          icon: 'success',
          duration: 1000
        })
        wx.request({
          url: url,
          success: function (res) {
            // console.log("来源"+url);
            var query_clone = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
            var getDateLength = query_clone.books.length;
            for (var i = 0; i < getDateLength; i++) {
              query_clone.books[i].cover = query_clone.books[i].cover.slice(7, -1);
            }

            var randoms = [];
            while (true) {
              var isExists = false;
              // 获取一个0–100范围的数
              var random = Math.floor(Math.random() * getDateLength);
              // 判断当前随机数是否已经存在
              for (var i = 0; i < randoms.length; i++) {
                if (random === randoms[i]) {
                  isExists = true;
                  break;
                }
              }
              // 如果不存在，则添加进去
              if (!isExists)
                randoms.push(query_clone.books[random]);
              // 如果有10位随机数了，就跳出
              if (randoms.length === 7)
                break;
            }
            console.log(randoms);
            that.setData({
              allData: randoms
            })
          }
        })
      }
    })
  },

  //获取点击的书籍
  getBooks:function(e){
    // console.log(1);
    console.log(e.currentTarget.dataset.bookid)
    getApp().globalData.bookid = e.currentTarget.dataset.bookid
    wx.navigateTo({
      url: '/pages/ChannelBookDetails/ChannelBookDetails',
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.isShow = false;
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