const app = getApp();
const WEB_ROOT = app.globalData.WEB_ROOT;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    src: "",
    section: "",
    background:"https://langorow-1257044814.cos.ap-guangzhou.myqcloud.com/board.png",
    dates: '2018-09-01',
    index: 0,
  },

  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  section: function(e) {
    const that = this;
    that.setData({
      section: e.detail.value,
    })
  },

  bindDateChange: function (e) {
    this.setData({
      dates: e.detail.value,
    })
  },

   saveClick: function() {
    let that = this;
    if (this.data.section === "") {
      wx.showToast({
        title: '请填写你的小心愿!',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    console.log(that.data.dates),
    wx.request({
      url: app.globalData.WEB_ROOT + 'save.php',
      data:{
        section: that.data.section,
        userid: app.globalData.openid,
        dates: that.data.dates,
        nick: app.globalData.userInfo.nickName
      },
      header:{
        'content-type': 'application/x-www-form-urlencoded' ,
      },
      method: "POST",
      success: function (res) {
        console.log(res.data);
        wx.showToast({
          title: '提交成功！小团子正在抓紧审核呢，请耐心等待哦',
          icon: 'none',
          duration: 3000
        });
        that.setData({
          section: ""
        })
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: '一起来设立你的小目标吧!',
    }
  },
})