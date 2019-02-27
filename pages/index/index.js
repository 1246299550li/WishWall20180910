//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    background: "https://langorow-1257044814.cos.ap-guangzhou.myqcloud.com/background/active.png",
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    setTimeout(function() {
      if (app.globalData.openid == null) {
        wx.reLaunch({
          url: '../set/set',
        })
      } else {
        wx.reLaunch({
          url: '../board/board',
        })
      }
    }, 3000)
  },
})