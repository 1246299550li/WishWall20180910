const app = getApp();
const WEB_ROOT = app.globalData.WEB_ROOT;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    src: "",
    section: "",
    background: "https://langorow-1257044814.cos.ap-guangzhou.myqcloud.com/background/board.png",
    index: 0,
    dates: ""
  },

  onLoad: function(options) {
    wx.showLoading({
      title: '奋力加载中...',
    })
    
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
    let that = this;
    let page = this.data.pages;

    let now = new Date;
    let nowDate = now.getDate();
    let nowMonth = now.getMonth() + 1;
    let nowYear = now.getFullYear();
    let ymd = nowYear + "-" + nowMonth + "-" + nowDate;
    this.setData({
      dates: ymd,
      ymd: ymd
    })
    console.log(ymd);

    wx.showTabBarRedDot({
      index: 4,
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
  },
  onShow: function() {
    let that = this;

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

  bindDateChange: function(e) {
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
    console.log(that.data.dates);
    wx.request({
      url: app.globalData.WEB_ROOT + 'saveCommon',
      data: {
        section: that.data.section,
        userid: app.globalData.openid,
        dates: that.data.dates,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: "POST",
      success: function(res) {
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
  onShareAppMessage: function() {
    return {
      title: '一起来设立你的小目标吧!',
    }
  },
})