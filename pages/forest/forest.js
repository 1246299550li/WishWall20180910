// pages/forest/forest.js
const app = getApp()
const WEB_ROOT = app.globalData.WEB_ROOT;

Page({
  data: {
    array: ['30:00', '45:00', '60:00', '90:00', '120:00', '135:00', '150:00', '180:00', '225:00', '270:00', '300:00'],
    index: 0,
    message: "开始计时",
    background: "https://langorow-1257044814.cos.ap-guangzhou.myqcloud.com/background/forest.png",
    second: 0,
    listUrl: "../../lib/img/list.png",
    reportUrl: "../../lib/img/report.png",
    reportshow: false,
    listshow: false,
  },

  pickChange: function(e) {
    this.setData({
      index: e.detail.value
    });
  },

  actionclick: function() {
    let that = this;
    var data1 = that.data.array[that.data.index];
    this.setData({
      second: parseInt(data1) * 60,
    })
    wx.navigateTo({
      url: '../time/time?second=' + this.data.second,
    })
  },

  confirm: function() {
    this.setData({
      reportshow: false,
    })
  },

  confirm1: function () {
    this.setData({
      listshow: false,
    })
  },

  report: function() {
    var that = this;
    this.setData({
      reportshow: true,
    })

    wx.request({
      url: WEB_ROOT + 'myList',
      data: {
        userid: app.globalData.openid,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // POST默认值
      },
      success: function(res) {
        that.setData({
          list: res.data
        })
      },
      fail: function(res) {
        console.log(res);
      }
    });
  },

  list: function() {
    var that = this;
    this.setData({
      listshow: true,
    })

    wx.request({
      url: WEB_ROOT + 'forestList',
      data: {
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // POST默认值
      },
      success: function (res) {
        that.setData({
          list: res.data
        })
      },
      fail: function (res) {
        console.log(res);
      }
    });
  }
})