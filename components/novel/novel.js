// component/novel/novel.js
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bookType:String,
    limit:Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    bookList:[], //获取的数据的列表
    books:[],
   
  },
  attached: function () {
    // 在组件实例进入页面节点树时执行
    this.getBookList();
    var that = this;
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getBookList:function(){
      wx.request({
        url: 'https://api.zhuishushenqi.com/book/by-categories?gender=press&type=hot&major='+this.data.bookType+'&minor=&start=0&limit='+this.data.limit,
        header:{
          'content-type':'application/json'
        },
        success:(res)=>{
         
          this.setData({
            bookList: res.data
          })
          //图片地址url解码
          for(var index in this.data.bookList.books){
            this.data.bookList.books[index].cover = decodeURIComponent(this.data.bookList.books[index].cover).substring(7);
          }
          console.log(this.data.bookList);
          this.setData({
            books: this.data.bookList
          })
          console.log(this.data.books);
        },
        fail:(res)=>{
          wx.showToast({
            title: '获取书籍失败',
            icon: 'none'
          })
        }
      })
    },
    //查看书本信息
    bookInfo: function (event){
      //获取点击的书本的id
      // var id = event.currentTarget.dataset.id;
      // console.log(id);
      getApp().globalData.bookid = event.currentTarget.dataset.id;
      // console.log("app.js"+app.globalData.bookid);
      wx.navigateTo({
        url: '/pages/ChannelBookDetails/ChannelBookDetails?id=' + event.currentTarget.dataset.id
      })
    },
    //获取选择的书的其他感兴趣的书
    getInterest: function (id) {
      wx.request({
        url: 'http://novel.juhe.im/recommend/' + id,
        header: {
          'content-type': 'application/json'
        },
        success: (res) => {
          // console.log(res.data.books)
          var booklist = res.data.books;
          //图片地址url解码
          for (var index in booklist) {
            booklist[index].cover = decodeURIComponent(booklist[index].cover).substring(7);
          }
          this.setData({
            interestbook: booklist,

          })
          console.log(this.data.interestbook);
          getApp().globalData.interestbook = this.data.interestbook
          this.setData({
            isMore: true,

          })
        },
        fail: (res) => {
          wx.showToast({
            title: '获取感兴趣的书籍失败，请重试',
            icon: 'none'
          })
        }
      })
    },
   
  }
  
})
