// pages/Book/Book.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookcontent:{},  //章节内容
    show: false,
    index:0,  //选择的书的index
    atocic:"",  //小说源id
    bookchapter:[],
    top:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      index: options.bookindex,
      atocic: options.atocic,
    })
    
    this.getChapter();
  },
  //根据小说源id获取小说目录
  getChapter: function () {
    //获取小说源id
    wx.request({
      url: 'http://bookapi03.zhuishushenqi.com/btoc/' + this.data.atocic + '?view=chapters&channel=mweb&platform=h5&token=',
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        this.setData({
          bookchapter: res.data
        })
        console.log(res.data);
        this.getBook();

      },
      fail: (res) => {
        wx.showToast({
          title: '获取书籍目录失败，请重试',
          icon: 'none'
        })
      }

    })

  },
  //获取章节内容
  getBook:function(){
    var link = this.data.bookchapter.chapters[this.data.index].link
    wx.request({
      url: 'http://chapterup.zhuishushenqi.com/chapter/' + link,
      header:{
        'content-type': 'application/json'
      },
      success:(res)=>{
        console.log(res.data);
        this.setData({
          bookcontent: res.data
        })
      },
      fail:(res)=>{
        wx.showToast({
          title: '获取内容失败，请重试',
          icon: 'none'
        })
      }
    })
  },
  // //语音阅读
  // audioText:function(){
  //   var zhText = this.data.bookcontent.chapter.cpContent;
  //   console.log(zhText);
  //   wx.request({
  //     url: 'http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=2&text=' + zhText,
  //   })
  // },
  
  //点击页面 触发蒙层
  popup:function(){
    if(this.data.show==false){
      this.setData({ show: true });
    }else{
      this.setData({ show: false });
    }
  },
  //上一页
  previous:function(){
    console.log("上一页");
    //如果在第一章，则不能点击
    if (this.data.index==0){
      return;
    }else{
      this.data.index--;
      this.getBook();
      this.setData({
        top:0
      })
    }
    
  },
  //下一页
  next: function () {
    console.log("下一页");
    this.data.index++;
    this.getBook();
    this.setData({
      top: 0
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
  //返回时，将用户的读书记录存到数据库
  onUnload: function () {
    console.log("返回")
    // book的id
    console.log(this.data.bookchapter.book)
    // atocic的id
    console.log(this.data.bookchapter._id)
    //order 
    console.log(this.data.bookcontent.chapter.order)
    var isRecord=app.globalData.isRecord;
    //如果没有阅读记录，则添加阅读记录，否则就修改阅读记录
    if (isRecord==false){
      this.addUserRecord();
    }else{
      console.log("修改记录")
      this.updateUserRecord();
    }
    
  },

  //插入读书记录
  addUserRecord:function(){
    wx.request({
      url: app.serviceURL + 'addUserRecord',
      data: {
        userid: app.globalData.openid,
        bookid: this.data.bookchapter.book,
        bookorder: this.data.bookcontent.chapter.order,
        bookatocic: this.data.bookchapter._id
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data);
      }
    })
  },

  //修改读书记录
  updateUserRecord: function () {
    wx.request({
      url: app.serviceURL + 'updateRecord',
      data: {
        userid: app.globalData.openid,
        bookid: this.data.bookchapter.book,
        bookorder: this.data.bookcontent.chapter.order,
        bookatocic: this.data.bookchapter._id
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data);
      }
    })
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