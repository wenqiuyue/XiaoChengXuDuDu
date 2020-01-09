// pages/detailedRelease/detailedRelease.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    release:{},   //完整的发表内容
    comment:{},   //评论
    inputValue: "",
    show: false,   //删除提示是否显示
    actions: [
      {
        name: '操作'
      },
      {
        name: '删除',
        subname: '删除此条评论'

      }
    ],
    delComId: "",   //删除评论的id
    releaseId: "",
    releaseidx: ""
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let release = JSON.parse(options.releaseInfo)
    this.setData({
      release: release,
    })
    this.getComment();
    console.log(this.data.release)
  },

  //显示评论
  getComment: function () {
    var that = this;
    wx.request({
      url: app.serviceURL + 'getAllComment',
      method: "POST",
      success: function (res) {
        if (res.data.comment != "") {
          console.log(res.data.comment);
          that.setData({
            comment: res.data.comment
          })
        } else {
          return;
        }
      }
    })
  },
  // 关注
  followMe: function (e) {
    var that=this;
    //添加关注
    wx.request({
      url: app.serviceURL + 'addFollow',
      method: 'POST',
      data: {
        uid: app.globalData.openid,
        ruserid: e.currentTarget.dataset.ruserid
      },
      success: function (res) {
        if (res.data == true) {
          wx.showToast({
            title: '关注成功',
          })
          that.data.release.isfocus=true;
          that.setData({
            release: that.data.release
          })
        } else {
          wx.showToast({
            title: '关注失败',
            icon: 'none'
          })
        }
      }
    })


  },
  //评论发送
  formsubmit: function (e) {
    var that = this;
    if(app.globalData.isLogin==true){
    // console.log(e.detail.value.index);
    // console.log(e.detail.value.com + " " + e.detail.value.releaseid);
    //判断是否发送的评论有内容
    if (e.detail.value.com == "") {
      wx.showToast({
        title: '请输入评论的内容',
        icon: 'none'
      })
    } else {
      //如果发送的内容不为空，则将内容存入数据库中
      wx.request({
        url: app.serviceURL + 'addComment',
        method: "POST",
        data: {
          userid: app.globalData.openid,
          releaseid: that.data.release.releaseid,
          commenttext: e.detail.value.com
        },
        success: function (res) {
          if (res.data == true) {
            // console.log(res.data);
            that.getComment();
            // 添加成功后，修改评论数量
            that.setCommentNum(that.data.release.releaseid);
            //修改界面评论数量
            that.data.release.commentnum = that.data.release.commentnum + 1;
            that.setData({
              release: that.data.release
            })
            // console.log(that.data.release[e.detail.value.index])
          } else {
            wx.showToast({
              title: '评论失败，请重试',
              icon: 'none'
            })
          }

        }
      })
    }
    //将输入框的内容清空
    this.setData({
      inputValue: ""
    })
    }else{
      wx.redirectTo({
        url: '/pages/Authorization/Authorization',
      })
    }
  },

  //修改评论数量
  setCommentNum: function (rid) {
    console.log("rid" + rid);
    wx.request({
      url: app.serviceURL + 'updateCommentNum',
      data: {
        releaseid: rid
      },
      method: "GET",
      success: function (res) {
        console.log(res.data);
      }
    })
  },
  //点击喜欢
  likeClick: function (e) {
    var that = this;
    if(app.globalData.isLogin==true){
    wx.request({
      url: app.serviceURL + 'updateLikeNum',
      data: {
        releaseid: e.currentTarget.dataset.rid
      },
      method: "GET",
      success: function (res) {
        if (res.data == true) {
          //修改界面评论数量
          that.data.release.rlikes = that.data.release.rlikes + 1;
          that.setData({
            release: that.data.release
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
  //是否删除评论
  isDel: function (e) {
    if(app.globalData.isLogin==true){
    console.log(e.currentTarget.dataset.rid);
    console.log(e.currentTarget.dataset.comid);
    console.log(e.currentTarget.dataset.releaseid);
    // console.log(e.currentTarget.dataset.idx);
    //如果这条发布的内容是本人发布的话，则可以对评论进行删除
    if (app.globalData.openid == e.currentTarget.dataset.rid) {
      this.setData({
        show: true,
        delComId: e.currentTarget.dataset.comid,
        releaseId: e.currentTarget.dataset.releaseid,
        // releaseidx: e.currentTarget.dataset.idx
      })
    }
    }else{
      return;
    }
  },
  //关闭时触发
  onClose() {
    this.setData({ show: false });
  },
  //点击删除是触发
  onSelect(event) {
    var that = this;
    console.log(event.detail);
    if (event.detail.name == "删除") {
      console.log(this.data.delComId);
      wx.request({
        url: app.serviceURL + 'delComment',
        method: "GET",
        data: {
          commentid: this.data.delComId
        },
        success: function (res) {
          if (res.data == true) {
            that.setData({
              show: false
            })
          }
          that.getComment();
          //更改评论数量
          that.reduceCommentNum(that.data.release.releaseid);
          //修改界面评论数量
          that.data.release.commentnum = that.data.release.commentnum - 1;
          that.setData({
            release: that.data.release
          })
        }
      })
    }
  },

  //减少评论数量
  reduceCommentNum: function (releaseid) {
    wx.request({
      url: app.serviceURL + 'reduceCommentNum',
      method: "GET",
      data: {
        releaseid: releaseid
      },
      success: function (res) {
        if (res.data == true) {

        }
      }
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