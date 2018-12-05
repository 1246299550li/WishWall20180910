// pages/bedge.js
const app = getApp()
const WEB_ROOT = app.globalData.WEB_ROOT;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        bedgeList: [
            "https://langorow-1257044814.cos.ap-guangzhou.myqcloud.com/badge/%E7%8B%AC%E6%8F%BD%E8%8B%8D%E7%A9%B9.jpg",
            "https://langorow-1257044814.cos.ap-guangzhou.myqcloud.com/badge/%E5%88%9D%E9%9C%B2%E9%94%8B%E8%8A%92.jpg",
            "https://langorow-1257044814.cos.ap-guangzhou.myqcloud.com/badge/%E5%8A%BF%E5%A6%82%E7%A0%B4%E7%AB%B9.jpg?tdsourcetag=s_pctim_aiomsg"
        ]

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

    }
})