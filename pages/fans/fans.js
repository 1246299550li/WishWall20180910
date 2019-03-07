// pages/fans/fans.js
const app = getApp()
const WEB_ROOT = app.globalData.WEB_ROOT;
let canUseReachBottom = true;

Page({
    data: {
        list: [{
                avatarUrl: null,
                userid: '第一个人',
                section: '你好',
                com: 1
            },
            {
                avatarUrl: null,
                userid: '第二个人',
                section: '不你很好',
                com: 1
            }, 
            {
                avatarUrl: null,
                userid: '最后一个人最后一个人',
                section: '好就完事了',
                com: 1
            }
        ],
        isFollow:'关注',
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

    // getUserInfo: function(e) {
    //     console.log(e)
    //     app.globalData.userInfo = e.detail.userInfo
    //     this.setData({
    //         userInfo: e.detail.userInfo,
    //         hasUserInfo: true
    //     })
    //     wx.navigateTo({
    //         url: '../set/set'
    //     })
    // },
    goToData: function () {
        setTimeout(function () {
            wx.navigateTo({
                url: '../data/data',
            })
        }, 200)
    },


    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        let that = this;

        let userid = app.globalData.openid;
        wx.request({
            url: WEB_ROOT + 'getFansMessage', //请求地址
            data: {
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
    }

})