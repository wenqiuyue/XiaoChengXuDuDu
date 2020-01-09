// components/homeworks/homeworks.js
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // rid:String
    rid: {
      type: String,
      value: "",
      observer: function(newVal, oldVal) {
        console.log(this.properties)
        this.setData({
          ruserid: this.properties.rid
        })
        // 当组件数据传入值时 调用方法
        this.getMyRelease(this.data.ruserid);
        this.getComment();
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    release: {}, //我的作品
    isRelease: false, //是否显示
    ruserid: "",
    myid:"",   //登录的用户的id
    comment: [],
    show: false,
    rid:"",    //删除发布内容的id
    isDelReleaseshow:false,   //是否显示删除发表的提示 
    delIdx:"",  //删除发布的id
    actions: [
      {
        name: '操作'
      },
      {
        name: '删除',
        subname: '删除此条评论'

      }
    ],
  },
  attached: function() {
    var myid=app.globalData.openid;
    this.setData({
      myid: myid
    })
    console.log(this.data.myid);
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 获取发表的内容数据
    getMyRelease: function(rid) {
      var that = this;
      // console.log(this.data.ruserid);
      wx.request({
        url: app.serviceURL + 'getMyRelease',
        method: "GET",
        data: {
          ruserid: rid
        },
        success: function(res) {
          if (res.data.rel != "") {
            that.setData({
              release: res.data.rel,
              isRelease: true
              
            })
            console.log("true")
          } else {
            that.setData({
              isRelease: false
            })
            console.log("false")
          }
        }
      })
    },
    //评论发送
    formsubmit: function(e) {
      var that = this;
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
            console.log(res.data.comment.length);
            that.setData({
              comment: res.data.comment
            })
          } else {
            return;
          }
        }
      })
    },

    //点击喜欢
    likeClick: function(e) {
      var that = this;
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
    },
    //是否删除评论
    isDel: function(e) {
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
    
    //用户删除自己发布的文章
    delContent: function (e) {
      var rid = e.currentTarget.dataset.rid
      var idx=e.currentTarget.dataset.idx
      console.log("idx"+idx);
       this.setData({
         isDelReleaseshow: true,
         rid:rid,
         delIdx: idx
        })
    },
    //点击确定删除发布的文章
    onConfirmDelRelease:function(){
      var that = this;
      console.log("Confirm")
      //删除发布的文章
      var delRid = this.data.rid;
      console.log(this.data.rid);
      wx.request({
        url: app.serviceURL + 'delRelease',
        method: "GET",
        data: {
          releaseid: delRid
        },
        success: function (res) {
          if (res.data == true) {
            console.log("删除成功");
            //删除所有被删除的发布的所有评论
            that.delCommentByRId(delRid);
            //修改界面的数据
            console.log(that.data.release);
            // that.data.release.splice(that.data.delIdx,1);
            that.getMyRelease(app.globalData.openid);
            console.log(that.data.release);
          }
        }
      })
    },
    //点击取消
    onCancelDelRelease:function(){
      console.log("Cancels")
    },
    //删除所有被删除的发布的所有评论
    delCommentByRId: function (rid) {
      wx.request({
        url: app.serviceURL + 'delCommentByRId',
        method: "GET",
        data: {
          releaseid: rid
        },
        success: function (res) {
          if (res.data == true) {
            console.log("删除成功");
          }
        }
      })
    },

  }
})