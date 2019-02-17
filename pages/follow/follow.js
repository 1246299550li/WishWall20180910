// pages/follow/follow.js

const app = getApp()
const WEB_ROOT = app.globalData.WEB_ROOT;
let canUseReachBottom = true;

Page({
  data: {
    list: [],
    userInfo: {},
    hasUserInfo: false,
    background: "https://langorow-1257044814.cos.ap-guangzhou.myqcloud.com/background/follow.png",
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
    let that = this;
    that.setData({
      scrollH: wx.getSystemInfoSync().windowHeight
    })
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    wx.navigateTo({
      url: '../set/set'
    })
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

    var userid = app.globalData.openid;
    wx.request({
      url: WEB_ROOT + 'attention.php', //请求地址
      data: {
        ch: 1,
        userid: app.globalData.openid
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // POST默认值
      },
      success: function(res) {
        console.log(res.data); //res.data相当于ajax里面的data,为后台返回的数据
        that.setData({
          list: res.data
        })
      },

      fail: function(err) {}, //请求失败
      complete: function() {} //请求完成后执行的函数
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  cli: function(e) {
    let that = this;
    var userid = app.globalData.openid;
    wx.showModal({
      content: "是否取消关注",
      showCancel: true,
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: WEB_ROOT + 'attention.php',
            data: {
              userid: userid,
              ch: 2,
              attid: e.currentTarget.dataset.id,
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // POST默认值
            },
            success: function(res) {
              wx.showToast({
                title: '取消关注成功',
                icon: 'succes',
                duration: 1800,
              })
              that.onShow();
            },
            fail: function(err) {}, //请求失败
            complete: function() {} //请求完成后执行的函数
          })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
})