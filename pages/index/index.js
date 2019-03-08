//index.js
const app = getApp();
const WEB_ROOT = app.globalData.WEB_ROOT;

Page({
  data: {
    motto: '冲鸭新学期',
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
      wx.request({
        url: WEB_ROOT + 'selectUser',  //判断是否注册
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: "POST",
        data: {
          userid: app.globalData.openid,
        },
        success: function (res) {
          if (res.data.length == 0) {
            wx.reLaunch({
              url: '../set/set',
            })
          } else {
            wx.reLaunch({
              url: '../board/board',
            })
          }
        }
      })
    }, 2900)
  },
})