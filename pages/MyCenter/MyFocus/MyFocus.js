// pages/MyFocus/MyFocus.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myFocus:[]  //我的关注
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getFocue();
  },

  //查询关注
  getFocue:function(){
    var that=this;
    wx.request({
      url: app.serviceURL + 'getFocue',
      method:"POST",
      data:{
        uid: app.globalData.openid
      },
      success:function(res){
        if (res.data.follows!=""){
          that.setData({
            myFocus: res.data.follows
          })
          console.log(that.data.myFocus);
        }else{
          wx.showToast({
            title: '您还没有关注的人哦~',
            icon:'none'
          })
        }
       
      }
    })
  },

  //点击取消关注
  removeFocus:function(e){
    var that=this;
    // console.log(e.currentTarget.dataset.idx);
    wx.request({
      url: app.serviceURL + 'delFocus',
      method:"POST",
      data:{
        uid: app.globalData.openid,
        ruserid: e.currentTarget.dataset.ruserid
      },
      success:function(res){
        if(res.data==true){
          wx.showToast({
            title: '已取消',
            icon:'none'
          })
          that.data.myFocus.splice(e.currentTarget.dataset.idx,1);
          that.setData({
            myFocus: that.data.myFocus
          })
        }else{
          wx.showToast({
            title: '操作失败，请重试',
            icon: 'none'
          })
        }
      }
    })
  },
  //查看关注的发布
  focusRelease:function(e){
    wx.navigateTo({
      url: '/pages/OtherRelease/OtherRelease?ruserid='+e.currentTarget.dataset.rid,
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