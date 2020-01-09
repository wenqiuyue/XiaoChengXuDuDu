// components/interest/interest.js
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bookid:String  //书的id
  },

  /**
   * 组件的初始数据
   */
  data: {
    interestbook:[],  //感兴趣的书
    isMore:false,
    isShow:true

  },
  attached:function(){
    this.getInterest();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //获取选择的书的其他感兴趣的书
    getInterest:function(){
      wx.request({
        url: 'http://novel.juhe.im/recommend/' + app.globalData.bookid,
        header: {
          'content-type': 'application/json'
        },
        success:(res)=>{
          // console.log(res.data.books)
          var booklist=res.data.books;
          //图片地址url解码
          for (var index in booklist) {
            booklist[index].cover = decodeURIComponent(booklist[index].cover).substring(7);
          }
          this.setData({
            interestbook: booklist,
            isShow:false
            
          })
          console.log(this.data.interestbook);
          getApp().globalData.interestbook=this.data.interestbook
          this.setData({
            isMore: true,
            
          })
        },
        fail:(res)=>{
          // wx.showToast({
          //   title: '获取感兴趣的书籍失败，请重试',
          //   icon: 'none'
          // })
        }
      })
    },
    //更多感兴趣的书籍
    interestMore:function(){
      if(this.data.isMore==false){
        wx.showToast({
          title: '正在加载更多书籍',
        })
      }else{
        wx.navigateTo({
          url: '/pages/InterestBook/InterestBook',
        })
      }
      
    },
    //查看书籍信息
    bookInfo:function(event){
      console.log(event.currentTarget.dataset.id);
      getApp().globalData.bookid = event.currentTarget.dataset.id
      wx.navigateTo({
        url: '/pages/ChannelBookDetails/ChannelBookDetails',
      })
    }
  }
})
