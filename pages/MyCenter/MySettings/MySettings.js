// pages/me/shezhi/shezhi.js
var app=getApp();
//获取全局js变量
var util = require('../../../utils/util.js')
//调用commmon.js文件方法


Page({

  /**
   * 页面的初始数据
   */
  data: {
   
  },

  userfeedback: function(){
    wx.navigateTo({
      url: '../MySetUserfeedback/MySetUserfeedback'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    // console.log(util.switch_huyan(e))
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

  },
  //更新旧页面varpages = getCurrentPages();varprePage = pages[pages.length -2];prePage.getLocInfo();wx.navigateBack ({    url:'../locMan/locManView',})
//更新旧页面var pages = getCurrentPages();var prePage = pages[pages.length - 2];
  
  /**跳转**/
  /** 跳转个性皮肤**/
  jump_MySetSkin: function () {
    wx.navigateTo({
      url: 'MySetSkin/MySetSkin'
    })
  },
  /**跳转到屏蔽设置**/
  jump_MySetShield: function(){
    wx.navigateTo({
      url: 'MySetShield/MySetShield'
    })
  },
  /**跳转隐私设置**/
  jump_MySetPrivacy:function(){
    wx.navigateTo({
      url: 'MySetPrivacy/MySetPrivacy'
    })
  },
  /** 跳转关于我们**/
  jump_MySetAboutUs: function(){
    wx.navigateTo({
      url: 'MySetAboutUs/MySetAboutUs'
    })
  }
})