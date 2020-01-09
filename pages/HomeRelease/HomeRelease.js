// pages/HomeRelease/HomeRelease.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  formsubmit:function(e){
    if(app.globalData.isLogin==true){
    //判断标题是否为空
    var title="";
    if (e.detail.value.title==""){
      title="片段分享"
    }else{
      title = e.detail.value.title;
    }
    wx.request({
      url: app.serviceURL+'addRelease',
      data:{
        ruserid: app.globalData.openid,
        rtext: e.detail.value.textarea,
        rtitle: title,
        rlikes:0,
        commentnum:0
      },
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      success:function(res){
        if(res.data==true){
         wx.switchTab({
           url: "/pages/Home/Home",
           //当跳转到频道页面成功后，刷新频道页面
           success: function (e) {
             var page = getCurrentPages().pop();
             if (page == undefined || page == null) return;
             page.onLoad();
           }
         })
        }else{
          wx.showToast({
            title: '发布失败，请重试！',
            icon: " "
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