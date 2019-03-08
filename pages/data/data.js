const app = getApp()
const WEB_ROOT = app.globalData.WEB_ROOT;

Page({
    data: {
        userlist: [],
        list: [],
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        openid: null,
        isFollow: false,
        background: "https://langorow-1257044814.cos.ap-guangzhou.myqcloud.com/background/mine.png",
        background2: "https://lgaoyuan.club:8080/signatureimg/xtz.png"
    },
    //事件处理函数
    onLoad: function(options) {
        console.log(options);
        this.setData({
            openid: options.openid
        })
        console.log("传值成功")
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
        //创建节点选择器
        let query = wx.createSelectorQuery();
        //选择id
        query.select('#userbox').boundingClientRect()
        query.exec(function(res) {
            //res就是 所有标签为mjltest的元素的信息 的数组
            console.log(res);
            //取高度
            console.log(res[0].height);
            that.setData({
                scrollH: wx.getSystemInfoSync().windowHeight * 0.75 - res[0].height * 1.1
            })
        })
    },
    onShow: function() {
        console.log("加载成功")
        this.getMe();
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
    goToFollow: function() {
        setTimeout(function() {
            wx.navigateTo({
                url: '../follow/follow',
            })
        }, 200)
    },
    goToFans: function() {
        setTimeout(function() {
            wx.navigateTo({
                url: '../fans/fans',
            })
        }, 200)
    },
    getMe: function() {
        let userid = app.globalData.openid;
        let that = this;
        wx.request({
            url: WEB_ROOT + 'getOthers', //请求地址
            data: {
                userid: userid,
                openid: that.data.openid
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
                    userlist: res.data,
                    isFollow: res.data.ifatt
                })
            },
            fail: function(err) {}, //请求失败
            complete: function() {
                that.deal();
            } //请求完成后执行的函数
        });
    },

    getIf: function() {
        let that = this;
        wx.request({
            url: WEB_ROOT + 'selectMine', //请求地址
            data: {
                userid: that.data.openid
            },
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded' // POST默认值
            },
            success: function(res) {
                console.log(res.data);
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
            complete: function() {
                that.deal();
            } //请求完成后执行的函数
        });
    },

    deal: function() {
        let datas = this.data.list;
        let nowTime = new Date().getTime();
        for (let i = 0; i < datas.length; i++) {
            let endTime = new Date(datas[i].dates.replace(/\-/g, "/")).getTime();
            if (endTime - nowTime > 0) {
                let time = (endTime - nowTime) / 1000;
                let day = parseInt(time / (60 * 60 * 24));
                let hou = parseInt(time % (60 * 60 * 24) / 3600);
                datas[i].countDown = "倒计时:" + day + "天" + hou + "小时";
            } else {
                datas[i].countDown = "未完成";
            }
        }
        this.setData({
            list: datas
        })
    },
    following: function() {
        let that = this;
        let userid = app.globalData.openid;
        if (that.data.openid !== userid) {
            wx.showModal({
                content: "是否关注此人",
                showCancel: true,
                success: function(res) {
                    if (res.confirm) {
                        wx.request({
                            url: WEB_ROOT + 'attOthers',
                            data: {
                                userid: userid,
                                attid: that.data.openid,
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
                                that.changeStyle();
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
    unfollowing: function() {
        let that = this;
        let userid = app.globalData.openid;
        if (that.data.openid !== userid) {
            wx.showModal({
                content: "确定要取消关注吗",
                showCancel: true,
                success: function(res) {
                    if (res.confirm) {
                        wx.request({
                            url: WEB_ROOT + 'attOthers',
                            data: {
                                userid: userid,
                                attid: that.data.openid,
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
                                that.changeStyle();
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
    changeStyle: function() {
        let that = this;
        that.setData({
            isFollow: !that.data.isFollow
        });
    },
    onShareAppMessage: function() {
        return {
            title: '一起来设立你的小目标吧!',
        }
    },
})