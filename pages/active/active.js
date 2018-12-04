const app = getApp()
const WEB_ROOT = app.globalData.WEB_ROOT;

Page({
    data: {
      list: [],
      userInfo: {},
      hasUserInfo: false,
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
      background: "https://langorow-1257044814.cos.ap-guangzhou.myqcloud.com/background/active.png",
      background1: "https://langorow-1257044814.cos.ap-guangzhou.myqcloud.com/background/activehead.png"
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
                pa: -3,
                userid: userid
            },
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded' // POST默认值
            },
            success: function(res) {
                if (res.data == 2) {
                    wx.showModal({
                        title: '提示',
                        content: '你还没有绑定信息呢，快去绑定吧',
                        showCancel: false,
                        confirmText: '去绑定',
                        success: function(res) {
                            if (res.confirm) {
                                wx.navigateTo({
                                    url: '../set/set'
                                })
                            }
                        }
                    })
                    return;
                }
                console.log(res.data);
                that.setData({
                    list: res.data
                });
            },
            fail: function(err) {}, //请求失败
            complete: function() {
              that.deal();
            } //请求完成后执行的函数
        });
    },
  deal: function () {
    let datas = this.data.list;
    
    let nowTime = new Date().getTime();
    for (let i = 0; i < datas.length; i++) {
       console.log(datas[i].dates);
      let endTime = new Date(datas[i].dates.replace(/\-/g, "/")).getTime();
      if (endTime - nowTime > 0) {
        datas[i].countDown = 1;
      } else {
        datas[i].countDown = 0;
      }
    }
    
    this.setData({
      list: datas
    })
    console.log(this.data.list);
  },
    participate: function(e) {
        let that = this;
        console.log(e.currentTarget.dataset);
        if (e.currentTarget.dataset.isact == 1) {
            wx.showToast({
                title: '你已经参与过了哦!',
                icon: 'none',
                duration: 1500
            });
            return;
        }
      let nowTime = new Date().getTime();
      let endTime = new Date(e.currentTarget.dataset.dates.replace(/\-/g, "/")).getTime();
      if (endTime - nowTime < 0) {
        wx.showToast({
          title: '该活动已经结束了哦!',
          icon: 'none',
          duration: 1500
        });
        return;
      }
        wx.request({
            url: app.globalData.WEB_ROOT + 'save.php',
            data: {
                ch: 2,
                section: e.currentTarget.dataset.active,
                userid: app.globalData.openid,
                dates: e.currentTarget.dataset.dates,
                actid: e.currentTarget.dataset.actid
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            method: "POST",
            success: function(res) {
                wx.showToast({
                    title: '参与成功!',
                    icon: 'success',
                    duration: 1500
                });
                let tmplist = that.data.list;
                tmplist[e.currentTarget.dataset.index].isact = 1;
                tmplist[e.currentTarget.dataset.index].numof++;
                that.setData({
                    list: tmplist
                });
                console.log(that.data.list);
            },
            complete: function() {
                
            }
        })
    },
    onShareAppMessage: function() {
        return {
            title: '一起来设立你的小目标吧!',
        }
    },
})