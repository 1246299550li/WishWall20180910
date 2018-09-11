// pages/shows/shows.js
const app = getApp()
const WEB_ROOT = app.globalData.WEB_ROOT;
let canUseReachBottom = true;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    background: "https://langorow-1257044814.cos.ap-guangzhou.myqcloud.com/show.png",
    pages: 1,
    scrollTop: 0,
    srollHeight: 300, 
    list: [],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    curIdx: null,
    imgUrl1: '../../lib/img/like/like.png',
    curUrl1: '../../lib/img/likeHL/like.png',
    imgUrl2: '../../lib/img/like/dont.png',
    curUrl2: '../../lib/img/likeHL/dont.png',  
    getId:null,
    picture_id: null,
    currentId:null,
    msg: [
    { 'a': 1, 'is_say_yes': false, 'num_say_yes': 0 },
    { 'b': 2, 'is_say_yes': false, 'num_say_yes': 0 }
    ],
    attid:null,
    is_attention:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function() {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
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
    let page = this.data.pages;
    // 登录
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
            url: 'https://xyq.54sher.com/getopenid.php',  //后台获取openid
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: "POST",
            data: {
              code: res.code,
            },
            success: function (res) {
              wx.setStorageSync('openid', res.data.openid);
              canUseReachBottom = true;
              that.setData({
                pages: 1,
                list: []
              });
              wx.request({
                url: WEB_ROOT + 'imageView.php',//请求地址
                data: {
                  pa: page,
                  userid: wx.getStorageSync('openid')
                },
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded' // POST默认值
                },
                success: function (res) {
                  console.log(res.data);//res.data相当于ajax里面的data,为后台返回的数据
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
                fail: function (err) { },//请求失败
                complete: function () { }//请求完成后执行的函数
              })
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    }) 
  },

  getUserInfo: function (e) {
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
      url: WEB_ROOT + 'imageView.php',
      data: {
        pa: that.data.pages,
        userid: app.globalData.openid,
        
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // POST默认值
      },
      success: function (res) {
        if(res.data){
          canUseReachBottom = true;
          that.setData({
            list: that.data.list.concat(res.data)
          })
        }
      },
      fail: function (err) { }, //请求失败
      complete: function () { } //请求完成后执行的函数
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '一起来设立你的小目标吧!',
    }
  },

  
  cli:function(e){
    var userid = app.globalData.openid;
    wx.showModal({
        content:"是否关注此人",
        showCancel:true,
        success: function(res) {
          if (res.confirm) {
            wx.request({
              url: WEB_ROOT + 'attention.php',
              data:{
                userid: userid,
                ch:0,
                attid: e.currentTarget.dataset.id,
              },
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded' // POST默认值
              },
              success: function (res) {
                wx.showToast({
                  title: '关注成功',
                  icon: 'succes',
                })
              },
              fail: function (err) { },//请求失败
              complete: function () { }//请求完成后执行的函数
            })

          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
  }

 /* chooseThis: function (e) {
    this.setData({
      curIdx: 1,
      picture_id: e.currentTarget.dataset.id,
    })
    console.log("1 "+this.data.picture_id)
  },

  chooseThis2: function (e) {
    this.setData({
      curIdx: 2,
      picture_id: e.currentTarget.dataset.id,
    })
  
    console.log("2 "+this.data.picture_id)
  }*/
        // 点击图片的点赞事件 这里使用的是同步的方式
       /* toCollect: function (e) {
            // 获取接收到的id值
          let getId = e.currentTarget.dataset.id;
            // 让接收到的id值传递到data:{}里面
            this.setData({
              currentId: getId
            });
          console.log("答案是：" + e.id)
            // 读取所有的文章列表点赞缓存状态
            var cache = wx.getStorageSync('cache_key');
            // 如果缓存状态存在
            if (cache) {
              // 拿到所有缓存状态中的1个
              var currentCache = cache[getId];
              // 把拿到的缓存状态中的1个赋值给data中的collection，如果当前文章没有缓存状态，currentCache 的值就是 false，如果当前文章的缓存存在，那么 currentCache 就是有值的，有值的说明 currentCache 的值是 true
              this.setData({
                collection: currentCache
              })
            } else {
              // 如果所有的缓存状态都不存在 就让不存在的缓存存在
              var cache = {};
              // 既然所有的缓存都不存在，那么当前这个文章点赞的缓存也不存在，我们可以把当前这个文章点赞的缓存值设置为 false
              cache[getId] = false;
              // 把设置的当前文章点赞放在整体的缓存中
              wx.setStorageSync('cache_key', cache);
            }
            // 获取缓存，得到当前文章是否被点赞
            var cache = wx.getStorageSync('cache_key');
            // 获取当前文章是否被点赞的缓存
            var currentCache = cache[this.data.currentId];
            // 取反，点赞的变成未点赞 未点赞的变成点赞
            currentCache = !currentCache;
            // 更新cache中的对应的1个的缓存值，使其等于当前取反的缓存值
            cache[this.data.currentId] = currentCache;
            // 调用 showModal方法
            this.showModal(cache, currentCache);
          },
          showModal: function (cache, currentCache) {
            var that = this;
            wx.showModal({
              title: "点赞",
              content: currentCache ? "要点赞吗？" : "要取消赞吗？",
              showCancel: "true",
              cancelText: "取消",
              cancelColor: "#666",
              confirmText: "确定",
              confirmColor: "#222",
              success: function (res) {
                if (res.confirm) {
                  // 重新设置缓存
                  wx.setStorageSync('cache_key', cache);
                  // 更新数据绑定,从而切换图片
                  that.setData({
                    collection: currentCache
                  })
                }
              }
            })
          },*/
})
  
    