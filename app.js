//app.js
App({
  globalData: {
    userInfo: null,
    openid: null,
    nowactid: null,
    redindex: null,
    WEB_ROOT: 'https://lgaoyuan.club:8080/signature/'
  },
  onLaunch: function() {
    let that = this;
    // 展示本地存储能力
    let logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: function(res) {
        if (res.code) {
          wx.request({
            url: 'https://lgaoyuan.club:8080/signature/getOpenId', //后台获取openid
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            data: {
              code: res.code,
            },
            success: function(res) {
              that.globalData.openid = res.data.openid;

              wx.request({
                url: 'https://lgaoyuan.club:8080/signature/redDot', //获取红点
                header: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST",
                data: {
                  userid: that.globalData.openid,
                },
                success: function(res) {
                  if (res.data[0].reddot != undefined)
                    that.globalData.redindex = res.data[0].reddot;
                }
              })
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              that.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

  }
})