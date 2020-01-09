module.exports={
   tabStyle:{
      activeColor:'#0eabcf',//触发时文字颜色
      inactiveColor:'#3d3d3d',//未触发时文字的颜色
   },
   tabs:[
      {
         "content":"首页",//显示的文字
       "activeImg":"/img/icon/tabbar/icon2.png",//触发时的图片
       "inactiveImg":"/img/icon/tabbar/icon1.png",//未触发的图片
         "path":"/pages/Home/Home"//按钮对应的路径
      },
      {
         "content": "频道",
        "activeImg": "/img/icon/tabbar/icon4.png",
        "inactiveImg": "/img/icon/tabbar/icon3.png",
        "path": "/pages/channel/channelProse"
      },
      {
         "content": "",
         "activeImg": "",
         "inactiveImg": "",
        "path": "/pages/HomeRelease/HomeRelease"
      },
      {
         "content": "寻Ta",
        "activeImg": "/img/icon/tabbar/icon6.png",
        "inactiveImg": "/img/icon/tabbar/icon5.png",
        "path": "/pages/yaoyiyao/yaoyiyao"
      },
      {
         "content": "我的",
        "activeImg": "/img/icon/tabbar/icon8.png",
        "inactiveImg": "/img/icon/tabbar/icon7.png",
         "path": "/pages/MyCenter/MyCenter"
      }
   ]
}