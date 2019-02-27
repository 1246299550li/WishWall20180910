// pages/shows/shows.js
const app = getApp()
const WEB_ROOT = app.globalData.WEB_ROOT;
let canUseReachBottom = true;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    background: "https://langorow-1257044814.cos.ap-guangzhou.myqcloud.com/background/show.png",
    background1: "https://langorow-1257044814.cos.ap-guangzhou.myqcloud.com/background/show2%20.png",
    pages: 1,
    list: [],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    curIdx: null,
    imgUrl1: '../../lib/img/like/like.png',
    curUrl1: '../../lib/img/likeHL/like.png',
    imgUrl2: '../../lib/img/like/dont.png',
    curUrl2: '../../lib/img/likeHL/dont.png',
    getId: null,
    picture_id: null,
    currentId: null,
    msg: [{
        'a': 1,
        'is_say_yes': false,
        'num_say_yes': 0
      },
      {
        'b': 2,
        'is_say_yes': false,
        'num_say_yes': 0
      }
    ],
    attid: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function() {

  },

  onTabItemTap(item) {
    console.log(item.index)
    console.log(item.pagePath)
    console.log(item.text)
  },

  /**
   * 生命周期函数--监听页面显示
   * 更改测试
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
    let page = this.data.pages;
    canUseReachBottom = true;

    wx.request({
      url: WEB_ROOT + 'selectAll', //请求地址
      data: {
        pa: page,
        userid: app.globalData.openid
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
        that.setData({
          list: res.data
        })
      },
      fail: function(err) {}, //请求失败
      complete: function() {} //请求完成后执行的函数
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (!canUseReachBottom) return;
    canUseReachBottom = false;
    let that = this;
    this.setData({
      pages: that.data.pages + 1
    });
    wx.request({
      url: WEB_ROOT + 'selectAll',
      data: {
        pa: that.data.pages,
        userid: app.globalData.openid,

      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // POST默认值
      },
      success: function(res) {
        if (res.data) {
          canUseReachBottom = true;
          that.setData({
            list: that.data.list.concat(res.data)
          })
        }
      },
      fail: function(err) {}, //请求失败
      complete: function() {} //请求完成后执行的函数
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '一起来设立你的小目标吧!',
    }
  },


  cli: function(e) {
    var userid = app.globalData.openid;
    if (e.currentTarget.dataset.id !== userid) {
      wx.showModal({
        content: "是否关注此人",
        showCancel: true,
        success: function(res) {
          if (res.confirm) {
            wx.request({
              url: WEB_ROOT + 'attOthers',
              data: {
                userid: userid,
                attid: e.currentTarget.dataset.id,
              },
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded' // POST默认值
              },
              success: function(res) {
                wx.showToast({
                  title: '关注成功',
                  icon: 'succes',
                  duration: 1800,
                })
              },
              fail: function(err) {}, //请求失败
              complete: function() {} //请求完成后执行的函数
            })

          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },

  toUp: function(event) {

    if (this.data.list[event.currentTarget.dataset.index].like != 0) {

      return;
    }
    console.log(event);
    let that = this;
    wx.request({
      url: WEB_ROOT + 'like',
      data: {
        openid: app.globalData.openid,
        attid: event.currentTarget.dataset.id
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // POST默认值
      },
      success: function(res) {
        console.log("点赞成功");
        let tmplist = that.data.list;
        tmplist[event.currentTarget.dataset.index].like = 1;
        tmplist[event.currentTarget.dataset.index].likeNum++;
        // console.log(tmplist[event.currentTarget.dataset.index].like);
        that.setData({
          list: tmplist
        });
        // console.log(res);
      },
      fail: function(err) {}, //请求失败
      complete: function() {} //请求完成后执行的函数
    })
  },

  toDown: function(event) {

    if (this.data.list[event.currentTarget.dataset.index].like != 0) return;
    console.log(event);
    let that = this;
    wx.request({
      url: WEB_ROOT + 'disLike',
      data: {
        openid: app.globalData.openid,
        ch: 1,
        attid: event.currentTarget.dataset.id
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // POST默认值
      },
      success: function(res) {
        console.log("踩了一下");
        let tmplist = that.data.list;
        tmplist[event.currentTarget.dataset.index].like = 2;
        // tmplist[event.currentTarget.dataset.index].likeNum++;
        // console.log(tmplist[event.currentTarget.dataset.index].like);
        that.setData({
          list: tmplist
        });
        // console.log(res);
      },
      fail: function(err) {}, //请求失败
      complete: function() {} //请求完成后执行的函数
    })
  },

})