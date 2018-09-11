const app = getApp()
const WEB_ROOT = app.globalData.WEB_ROOT;

Page({
  data: {
    list: [],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    background: "https://langorow-1257044814.cos.ap-guangzhou.myqcloud.com/my.png"
  },
  //事件处理函数
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
  onShow: function() {
    this.getIf();
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  getIf: function() {
    let userid = app.globalData.openid;
    let that = this;
    wx.request({
      url: WEB_ROOT + 'imageView.php', //请求地址
      data: {
        pa: -1,
        userid: userid
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // POST默认值
      },
      success: function(res) {
        console.log(res.data); //res.data相当于ajax里面的data,为后台返回的数据
        if (res.data == 2) {
          wx.showModal({
            title: '提示',
            content: '你还没有绑定信息呢，快去绑定吧',
            showCancel: false,
            confirmText: '去绑定',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../set/set'
                })
              }
            }
          })
          return;
        }
        that.setData({
          list: res.data
        })
      },
      fail: function(err) {}, //请求失败
      complete: function() {
        that.deal();
      } //请求完成后执行的函数
    });
  },
  deal: function() {
    let datas = this.data.list;
    // console.log(datas);
    let nowTime = new Date().getTime();
    for (let i = 0; i < datas.length; i++) {
      // console.log(datas[i].dates);
      let endTime = new Date(datas[i].dates.replace(/\-/g, "/")).getTime();
      if (endTime - nowTime > 0) {
        let time = (endTime - nowTime) / 1000;
        let day = parseInt(time / (60 * 60 * 24));
        let hou = parseInt(time % (60 * 60 * 24) / 3600);
        datas[i].countDown = day + "天" + hou + "小时";
      } else {
        datas[i].countDown ="0天0小时";
      }
    }
    this.setData({
      list: datas
    })
  },
  com: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定你已经完成目标了吗',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: WEB_ROOT + 'changeCom.php', //请求地址
            data: {
              id: id
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // POST默认值
            },
            success: function() {
              wx.showToast({
                title: '棒棒哒',
                icon: 'succes',
                duration: 1800,
              })
              console.log(id);
              that.onShow();
            },
            fail: function(err) {}, //请求失败
            complete: function() {
              that.getIf();
            } //请求完成后执行的函数
          })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });

  },
  onShareAppMessage: function () {
    return {
      title: '一起来设立你的小目标吧!',
    }
  },
})