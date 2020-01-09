// pages/Find/Find.js
var app = getApp();
import Dialog from '../../dist/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isRelease: true, //是否显示评论数据
    release: [], //发表数据
    inputValue: "",
    comment: [], //评论
    isRecord: false, //是否有阅读记录
    recordBook: {}, //阅读记录的书籍信息
    recordInfo: {}, //用户阅读记录在数据库的信息
    show: false, //删除提示是否显示

    actions: [{
        name: '操作'
      },
      {
        name: '删除',
        subname: '删除此条评论'

      }
    ],
    delComId: "", //删除评论的id
    releaseId: "",
    releaseidx: "",
    userid: "" //发布内容的用户id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getRelease();
    this.getComment();
    this.getBookRecord();
    // let userid=
    this.setData({
      userid: app.globalData.openid
    })
    console.log(this.data.userid);
  },

  //关注的图标显示
  isFocus(rdata) {
    var that = this;
    if (app.globalData.isLogin == true) {
      wx.request({
        url: app.serviceURL + 'getFocue',
        method: 'Post',
        data: {
          uid: app.globalData.openid
        },
        success: function(res) {
          //判断首页的作者是否被关注
          for (var i = 0; i < rdata.length; i++) {
            for (var j = 0; j < res.data.follows.length; j++) {
              if (rdata[i].ruserid == res.data.follows[j].ruserid || rdata[i].ruserid == app.globalData.openid) {
                rdata[i].isfocus = true;
              }

            }
          }
          that.setData({
            release: rdata,
          })
          console.log(that.data.release);
        }
      })
    } else {
      for (var i = 0; i < rdata.length; i++) {
        rdata[i].isfocus = true;
      }
      that.setData({
        release: rdata,
      })
    }
  },


  // 获取发表的内容数据
  getRelease: function() {
    var that = this;
    wx.request({
      url: app.serviceURL + 'getRelease',
      method: "POST",
      success: function(res) {
        var rData = res.data.rel;
        if (rData != "") {
          //给发表的内容数据数组里添加是否关注
          for (var index in rData) {
            rData[index].isfocus = false
          }
          that.setData({
            isRelease: true
          })
          that.isFocus(rData);
        } else {
          that.setData({
            isRelease: false
          })
        }
      }
    })

  },

  //评论发送
  formsubmit: function(e) {
    var that = this;
    if (app.globalData.isLogin == true) {
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
            releaseid: e.detail.value.releaseid,
            commenttext: e.detail.value.com
          },
          success: function(res) {
            if (res.data == true) {
              // console.log(res.data);
              that.getComment();
              // 添加成功后，修改评论数量
              that.setCommentNum(e.detail.value.releaseid);
              //修改界面评论数量
              that.data.release[e.detail.value.index].commentnum = that.data.release[e.detail.value.index].commentnum + 1;
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
    } else {
      wx.redirectTo({
        url: '/pages/Authorization/Authorization',
      })
    }
  },

  //修改评论数量
  setCommentNum: function(rid) {
    console.log("rid" + rid);
    wx.request({
      url: app.serviceURL + 'updateCommentNum',
      data: {
        releaseid: rid
      },
      method: "GET",
      success: function(res) {
        console.log(res.data);
      }
    })
  },

  //显示评论
  getComment: function() {
    var that = this;
    wx.request({
      url: app.serviceURL + 'getAllComment',
      method: "POST",
      success: function(res) {
        if (res.data.comment != "") {
          console.log(res.data.comment);
          that.setData({
            comment: res.data.comment
          })
        } else {
          console.log("kong")
        }
      }
    })
  },

  //点击喜欢
  likeClick: function(e) {
    var that = this;
    if (app.globalData.isLogin == true) {
      var idx = e.currentTarget.dataset.idx;
      wx.request({
        url: app.serviceURL + 'updateLikeNum',
        data: {
          releaseid: e.currentTarget.dataset.rid
        },
        method: "GET",
        success: function(res) {
          if (res.data == true) {
            //修改界面评论数量
            that.data.release[idx].rlikes = that.data.release[idx].rlikes + 1;
            that.setData({
              release: that.data.release
            })
          }
        }
      })
    } else {
      wx.redirectTo({
        url: '/pages/MyCenter/MyCenter',
      })
    }
  },

  // 关注
  followMe: function(e) {
    // var idx = e.currentTarget.dataset.idx;
    // console.log(this.data.release[idx])
    var that = this;
    if (app.globalData.isLogin == true) {
      //添加关注
      wx.request({
        url: app.serviceURL + 'addFollow',
        method: 'POST',
        data: {
          uid: app.globalData.openid,
          ruserid: e.currentTarget.dataset.ruserid
        },
        success: function(res) {
          if (res.data == true) {
            wx.showToast({
              title: '关注成功',
            })
            that.isFocus(that.data.release);
          } else {
            wx.showToast({
              title: '关注失败',
              icon: 'none'
            })
          }
        }

      })
    } else {
      wx.redirectTo({
        url: '/pages/MyCenter/MyCenter',
      })
    }
    // console.log(e.currentTarget.dataset.ruserid)
    //查询是否已经关注
    // wx.request({
    //   url: app.serviceURL + 'isFollow',
    //   method: "POST",
    //   data: {
    //     uid: app.globalData.openid,
    //     ruserid: e.currentTarget.dataset.ruserid
    //   },
    //   success: function(res) {
    //如果已经关注，提示，并退出，否则添加关注
    // if (res.data == true) {
    //   wx.showToast({
    //     title: '已关注',
    //     icon: 'none'
    //   })
    //   return;
    // }
    //添加关注
    //     wx.request({
    //       url: app.serviceURL + 'addFollow',
    //       method: 'POST',
    //       data: {
    //         uid: app.globalData.openid,
    //         ruserid: e.currentTarget.dataset.ruserid
    //       },
    //       success: function(res) {
    //         if (res.data == true) {
    //           wx.showToast({
    //             title: '关注成功',
    //           })
    //         } else {
    //           wx.showToast({
    //             title: '关注失败',
    //             icon: 'none'
    //           })
    //         }
    //       }
    //     })

    //   }
    // })

  },
  //阅读记录
  getBookRecord: function() {
    var that = this;
    if (app.globalData.isLogin == true) {
      wx.request({
        url: app.serviceURL + 'getBookRecord',
        method: 'GET',
        data: {
          userid: app.globalData.openid
        },
        success: function(res) {

          console.log(res.data)
          //如果有阅读记录，则获取阅读书籍记录的信息，并显示阅读记录，否则不显示阅读记录
          if (res.data.record != "") {
            that.setData({
              isRecord: true,
              recordInfo: res.data.record,
            })
            getApp().globalData.isRecord = true;
            that.getRecordBookInfo(res.data.record.bookid);
          } else {
            that.setData({
              isRecord: false,
            })
            getApp().globalData.isRecord = false;
          }
        }
      })
    } else {
      return;
    }
  },

  //获取阅读记录的书籍信息
  getRecordBookInfo: function(bookid) {
    var that = this;
    wx.request({
      url: 'http://api.zhuishushenqi.com/book/' + bookid,
      success: function(res) {
        // console.log(res.data)
        //图片地址url解码
        res.data.cover = decodeURIComponent(res.data.cover).substring(7);
        that.setData({
          recordBook: res.data
        })
      }
    })
  },

  //点击继续阅读
  continueRed: function() {
    // console.log(this.data.recordInfo.bookorder - 1 + " " + this.data.recordInfo.bookatocic)
    var index = this.data.recordInfo.bookorder - 1
    // return;
    wx.navigateTo({
      url: '../Book/Book?bookindex=' + index + '&atocic=' + this.data.recordInfo.bookatocic
    })
  },
  //是否删除评论
  isDel: function(e) {
    if (app.globalData.isLogin == true) {
      console.log(e.currentTarget.dataset.rid);
      console.log(e.currentTarget.dataset.comid);
      console.log(e.currentTarget.dataset.releaseid);
      console.log(e.currentTarget.dataset.idx);
      //如果这条发布的内容是本人发布的话，则可以对评论进行删除
      if (app.globalData.openid == e.currentTarget.dataset.rid) {
        this.setData({
          show: true,
          delComId: e.currentTarget.dataset.comid,
          releaseId: e.currentTarget.dataset.releaseid,
          releaseidx: e.currentTarget.dataset.idx
        })
      }
    } else {
      wx.redirectTo({
        url: '/pages/MyCenter/MyCenter',
      })
    }
  },
  //关闭时触发
  onClose() {
    this.setData({
      show: false
    });
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
        success: function(res) {
          if (res.data == true) {
            that.setData({
              show: false
            })
          }
          that.getComment();
          //更改评论数量
          that.reduceCommentNum(that.data.releaseId);
          //修改界面评论数量
          that.data.release[that.data.releaseidx].commentnum = that.data.release[that.data.releaseidx].commentnum - 1;
          that.setData({
            release: that.data.release
          })
        }
      })
    }
  },

  //减少评论数量
  reduceCommentNum: function(releaseid) {
    wx.request({
      url: app.serviceURL + 'reduceCommentNum',
      method: "GET",
      data: {
        releaseid: releaseid
      },
      success: function(res) {
        if (res.data == true) {

        }
      }
    })


  },

  //查看完整评论内容
  detailedContent: function(e) {

    wx.navigateTo({
      url: '/pages/detailedRelease/detailedRelease?releaseInfo=' + JSON.stringify(this.data.release[e.currentTarget.dataset.idx]),
    })
  },

  //用户删除自己发布的文章
  delContent: function(e) {
    // this.setData({
    //   isDelRelease: true
    // })
    var that = this;
    if (app.globalData.isLogin == true) {
      Dialog.confirm({
        title: '提示',
        message: '确定删除吗'
      }).then(() => {
        console.log("yes")
        //删除发布的文章
        var rid = e.currentTarget.dataset.rid
        console.log(rid);
        wx.request({
          url: app.serviceURL + 'delRelease',
          method: "GET",
          data: {
            releaseid: rid
          },
          success: function(res) {
            if (res.data == true) {
              console.log("删除成功");
              //删除所有被删除的发布的所有评论
              that.delCommentByRId(rid);
              that.getRelease();
            }
          }
        })
      }).catch(() => {
        console.log("no")
      })
    } else {
      wx.redirectTo({
        url: '/pages/MyCenter/MyCenter',
      })
    }
  },
  //删除所有被删除的发布的所有评论
  delCommentByRId: function(rid) {
    wx.request({
      url: app.serviceURL + 'delCommentByRId',
      method: "GET",
      data: {
        releaseid: rid
      },
      success: function(res) {
        if (res.data == true) {
          console.log("删除成功");
        }
      }
    })
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
    // if(app.globalData.isLogin==true){
    //   this.setData({
    //     isRecord:true
    //   })
    // }else{
    //   this.setData({
    //     isRecord: false
    //   })
    // }
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