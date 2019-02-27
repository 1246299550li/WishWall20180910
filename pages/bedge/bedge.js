// pages/bedge.js
const app = getApp()
const WEB_ROOT = app.globalData.WEB_ROOT;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ret: "< 返回",
    bedgeList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
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
    let that = this;
    wx.request({
      url: WEB_ROOT + 'returnMax',
      data: {
        openid: app.globalData.openid,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // POST默认值
      },
      success: res => {
        let tmp = res.data[0].maxcon;
        console.log("连续签到天数");
        console.log(tmp);
        if (tmp == 0) {
          that.setData({
            bedgeList: []
          })
        } else if (tmp > 0 && tmp < 7) {
          that.setData({
            bedgeList: [
              "../../lib/img/bedge/1.jpg"
            ]
          })
        } else if (tmp < 14) {
          that.setData({
            bedgeList: [
              "../../lib/img/bedge/1.jpg",
              "../../lib/img/bedge/7.jpg"
            ]
          })
        } else if (tmp < 21) {
          that.setData({
            bedgeList: [
              "../../lib/img/bedge/1.jpg",
              "../../lib/img/bedge/7.jpg",
              "../../lib/img/bedge/14.jpg"
            ]
          })
        } else if (tmp < 30) {
          that.setData({
            bedgeList: [
              "../../lib/img/bedge/1.jpg",
              "../../lib/img/bedge/7.jpg",
              "../../lib/img/bedge/14.jpg",
              "../../lib/img/bedge/21.jpg"
            ]
          })
        } else if (tmp >= 30) {
          that.setData({
            bedgeList: [
              "../../lib/img/bedge/1.jpg",
              "../../lib/img/bedge/7.jpg",
              "../../lib/img/bedge/14.jpg",
              "../../lib/img/bedge/21.jpg",
              "../../lib/img/bedge/30.jpg"
            ]
          })
        }
      },
      fail: res => {
        console.log(res);
      }
    });

  },
  ret() {
    wx.navigateTo({
      url: '../calendar/calendar'
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})