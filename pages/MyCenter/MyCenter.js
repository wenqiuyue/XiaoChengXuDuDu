// pages/me/me.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}, //用户信息
    focusCount: 0, //关注数量
    fansCount: 0, //粉丝数量
    releaseCount: 0, //我的作品数量
    bookShelvesCount: 0, //书架数量
    login: false


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    console.log(this.data.userInfo)

    this.isAuthorization();
  },
  clickLogin() {
    wx.redirectTo({
      url: '/pages/Authorization/Authorization',
    })
  },

  //查询我的关注数量
  getFocusCount: function() {
    var that = this;
    wx.request({
      url: app.serviceURL + 'getFocueCount',
      method: 'POST',
      data: {
        uid: app.globalData.openid
      },
      success: function(res) {
        // console.log(res.data);
        that.setData({
          focusCount: res.data
        })
      }
    })
  },
  //查询我的粉丝数量
  getFansCount: function() {
    var that = this;
    wx.request({
      url: app.serviceURL + 'getFansCount',
      method: 'POST',
      data: {
        ruserid: app.globalData.openid
      },
      success: function(res) {
        // console.log(res.data);
        that.setData({
          fansCount: res.data
        })
      }
    })
  },
  //查询我的作品数量
  getReleaseCount: function() {
    var that = this;
    wx.request({
      url: app.serviceURL + 'getReleaseCount',
      method: 'POST',
      data: {
        ruserid: app.globalData.openid
      },
      success: function(res) {
        // console.log(res.data);
        that.setData({
          releaseCount: res.data
        })
      }
    })
  },
  //查询书架数量
  getBookShelvesCount: function() {
    var that = this;
    wx.request({
      url: app.serviceURL + 'getBookShelvesCount',
      method: 'POST',
      data: {
        userid: app.globalData.openid
      },
      success: function(res) {
        that.setData({
          bookShelvesCount: res.data
        })
      }
    })
  },
  /**
   * 查看是否授权
   */
  isAuthorization: function() {
    var that = this;
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
              url: app.serviceURL + 'getUserById',
              data: {
                "userid": res.data.openid
              },
              method: "GET",
              header: {
                'content-type': 'application/json'
              },
              success: function(res) {
                //如果获取到了用户信息
                console.log(res.data.user)
                if (res.data.user != "") {
                  //将数据存到全局变量
                  getApp().globalData.userInfo = res.data.user;
                  getApp().globalData.isLogin = true;
                  that.setData({
                    userInfo: app.globalData.userInfo,
                    login: true
                  })
                  that.getFocusCount();
                  that.getFansCount();
                  that.getReleaseCount();
                  that.getBookShelvesCount();
                } else {
                  //否则该用户没有授权
                  getApp().globalData.isLogin = false;
                  that.setData({
                    login: false
                  })
                }
                console.log(that.data.login);
              }
            })
          }
        });
      }
    });
  },
  //我的关注
  myFocue: function() {
    if (this.data.login == true) {
      wx.navigateTo({
        url: 'MyFocus/MyFocus'
      })
    } else {
      return;
    }

  },
  //我的粉丝
  myFans: function() {
    if (this.data.login == true) {
      wx.navigateTo({
        url: 'MyFans/MyFans'
      })
    } else {
      return;
    }
  },
  //我的作品
  myRelease: function() {
    if (this.data.login == true) {
      wx.navigateTo({
        url: '/pages/MyRelease/MyRelease',
      })
    } else {
      return;
    }
  },
  //我的书架
  bookShelves: function() {
    if (this.data.login == true) {
      wx.navigateTo({
        url: '/pages/BookShelves/BookShelves',
      })
    } else {
      return;
    }
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
    this.onLoad();
    this.setData({
      login: app.globalData.isLogin,
    })
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

  },
  /** 跳转到关于我资料页**/
  jump_MyHomeAboutMe: function() {
    wx.navigateTo({
      url: 'MyHomeAboutMe/MyHomeAboutMe'
    })
  },
  /** 跳转到收藏**/
  jump_MyCollection: function() {
    wx.navigateTo({
      url: 'MyCollection/MyCollection'
    })
  },
  /** 跳转到收到的喜欢**/
  jump_MyReceivedLike: function() {
    wx.navigateTo({
      url: 'MyReceivedLike/MyReceivedLike'
    })
  },
  /** 跳转到设置**/
  jump_MySettings: function() {
    wx.navigateTo({
      url: 'MySettings/MySettings'
    })
  }

})