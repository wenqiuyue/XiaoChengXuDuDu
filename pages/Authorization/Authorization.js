//获取应用实例
const app = getApp()
// pages/Authorization/Authorization.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false,
    // userInfo:{}   //用户信息
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.isAuthorization();

  },
  //点击授权
  bindGetUserInfo:function(e){
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      console.log("用户的信息如下：");
      console.log(e.detail.userInfo);
     

      // 用户授权成功后，调用微信的 wx.login 接口，从而获取code
      wx.login({
        success: res => {
          // 获取到用户的 code 之后：res.code
          console.log("用户的code:" + res.code);
          //使用微信的提供的接口直接获取 openid
          wx.request({
            // 自行补上自己的 APPID 和 SECRET
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxabda41b209843873&secret=45caa770d8fc68517bae42005df9d530&js_code=' + res.code + '&grant_type=authorization_code',
            success: res => {
              // 获取到用户的 openid
              console.log("用户的openid:" + res.data.openid);                      
              getApp().globalData.openid = res.data.openid;
              //插入登录的用户的相关信息到数据库
              wx.request({
                url: app.serviceURL+'addUser',
                data: {
                  "userid": res.data.openid,
                  "username": e.detail.userInfo.nickName,  //名字
                  "userimg": e.detail.userInfo.avatarUrl,  //照片
                },
                method: "POST",
                header: {
                  'content-type': 'application/json'
                },
                success: (res) => {
                  console.log(res.data);
                }
              })
            }
          });
        }
      });
      getApp().globalData.isLogin = true;
      wx.switchTab({
        url: '/pages/Home/Home',
      }) 
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
      getApp().globalData.isLogin = false;
    }
  },
  /**
   * 查看是否授权
   */
  isAuthorization: function() {
    var that=this;
    // 调用微信的 wx.login 接口，从而获取code
    wx.login({
      success: res => {
        // 获取到用户的 code 之后：res.code
        console.log("用户的code:" + res.code);
        //使用微信的提供的接口直接获取 openid
        wx.request({
          // 自行补上自己的 APPID 和 SECRET
          url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxabda41b209843873&secret=45caa770d8fc68517bae42005df9d530&js_code=' + res.code + '&grant_type=authorization_code',
          success: res => {
            // 获取到用户的 openid
            console.log(res.data.openid);
            getApp().globalData.openid = res.data.openid;

            //根据获取到的 openid  来判断是否授权过,如果授权过，就把用户信息提取出来，否则就转到授权界面
            wx.request({
              url: app.serviceURL+'getUserById',
              data:{
                "userid": res.data.openid
              },
              method: "GET",
              header: {
                'content-type': 'application/json'
              },
              success:function(res){
                //如果获取到了用户信息
                console.log(res.data.user)
                if (res.data.user !=""){
                  //将数据存到全局变量
                  getApp().globalData.userInfo = res.data.user;
                  
                  wx.switchTab({
                    url: '/pages/Home/Home'
                  })
                }else{
                  //否则该用户没有授权
                 that.setData({
                   isHide:true
                 })
                }
              }
            })
          }
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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