// pages/daka/daka.js
let Calendar = require("../../service/Calendar.js");
let Common = require("../../service/Common.js");
const app = getApp();
const WEB_ROOT = app.globalData.WEB_ROOT;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        que: '',
        tip: '',
        showModal: false,
        url: '',
        showSign: false,
        bedgeUrl:'../../lib/img/bedge.png'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        //先获取openid，openid会被保存在全局变量globalData中
        // app.jscode2session(res=>{
        let nowDate = new Date(); //当前日期
        this.initCalendar(nowDate); //加载日历
        // });
    },

    /**
     * 初始化日历，
     * signDates ： 已经签到的日期，一般在月份切换的时候从后台获取日期，
     * 然后在获取日历数据时，进行数据比对处理；
     * */
    initCalendar: function(paramDate, signDates) {

        //从服务器端获取signDates
        let paramMonth = paramDate.getMonth();
        if (paramMonth + 1 > 12) { //后台保存的月份数据是 1-12
            paramMonth = 1;
        } else {
            paramMonth += 1;
        }
        let paramYear = paramDate.getFullYear();
        wx.request({
            // url: app.HTTP_SERVER + 'xcx/rest/getSignDates.htm',
            url: WEB_ROOT + 'showDates.php',
            data: {
                openid: app.globalData.openid,
                year: paramYear,
                month: paramMonth,
                ch: 1
            },
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded' // POST默认值
            },
            success: res => {
                //后台返回的日期
                // console.log("返回的日期" + res.data);
                // let signDates  = res.data;
                // let rest = res.data;
                // let ttt = [1, 2, 3];
                // let tt = new Date();
                // let ttt = tt.getDate();
                // console.log(ttt);
                console.log(res.data);
                let signDates = res.data;
                //当前年月日
                let now = new Date(); //当前时间
                let nowMonth = now.getMonth();
                let nowYear = now.getFullYear();

                let showSign = false; //是否显示签到按钮
                if (nowMonth === paramDate.getMonth() && nowYear === paramDate.getFullYear()) {
                    showSign = true;
                }
                let today = new Date();
                let todaydate = today.getDate();
                if (Common.contains(signDates, todaydate)) {
                    showSign = false;
                }
                //未来签到日期设置为空
                if (nowMonth < paramDate.getMonth() && nowYear <= paramDate.getFullYear()) {
                    signDates = [];
                }

                //星期
                let days = ["日", "一", "二", "三", "四", "五", "六"];

                //签到日历数据的生成
                let calendars = Calendar.getSignCalendar(paramDate, signDates);

                this.setData({
                    signDates: signDates,
                    year: paramDate.getFullYear(),
                    month: paramDate.getMonth() + 1,
                    calendars: calendars,
                    days: days,
                    preMonth: "<", //大于、小于号不可以直接写在wxml中
                    nextMonth: ">",
                    showSign: showSign
                });
            },
            fail: function(res) {
                console.log(res);
            }
        });
    },

    //上个月
    preMonth: function() {
        let dataYear = this.data.year;
        let dataMonth = this.data.month - 2; //月是从0开始的
        let paramDate = Calendar.parseDate(dataYear, dataMonth);
        this.initCalendar(paramDate);
    },

    //下个月
    nextMonth: function() {
        let dataYear = this.data.year;
        let dataMonth = this.data.month;
        let paramDate = Calendar.parseDate(dataYear, dataMonth);
        this.initCalendar(paramDate);
    },

    //签到
    doSign: function() {
        let that = this;
        wx.request({
            url: WEB_ROOT + 'showDates.php', //请求地址
            data: {
                ch: 2
            },
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded' // POST默认值
            },
            success: function(res) {
                console.log(res.data);
                that.setData({
                    que: res.data
                });
                wx.showModal({
                    title: '你真的醒了吗',
                    content: that.data.que,
                    success: function(res) {
                        if (res.confirm) {
                            // 调用服务器端，实现签到入库
                            wx.request({
                                url: WEB_ROOT + 'showDates.php',
                                data: {
                                    openid: app.globalData.openid,
                                    ch: 0
                                },
                                method: 'POST',
                                header: {
                                    'content-type': 'application/x-www-form-urlencoded' // POST默认值
                                },
                                success: res => {
                                    let tmp = res.data;
                                    console.log(tmp);
                                    // 签到成功给出提示
                                    wx.showToast({
                                        title: '签到成功',
                                        icon: 'success',
                                        duration: 1100
                                    })

                                    let score = tmp[0];
                                    // if (res.last)
                                    setTimeout(function() {
                                        wx.showToast({
                                            title: '积分+' + score,
                                            icon: 'success',
                                            duration: 1500
                                        })
                                    }, 1100);
                                    let lastDays = tmp[1];
                                    setTimeout(function() {
                                        that.showDialogBtn(lastDays);
                                    }, 2800);
                                    //刷新日历
                                    let now = new Date(); //当前时间
                                    that.initCalendar(now);
                                },
                                fail: function(res) {
                                    console.log(res);
                                    wx.showToast({
                                        title: '签到失败',
                                        icon: 'none',
                                        duration: 2000
                                    })
                                }
                            });
                        } else if (res.cancel) {
                            console.log('用户点击取消')
                        }
                    }
                })
            },
            fail: function(err) {}, //请求失败
            complete: function() {} //请求完成后执行的函数
        });



    },
    /**
     * 弹窗
     */
    showDialogBtn: function(days) {
        this.setData({
            tip: '你已经连续签到了' + days + '天了'
        })
        if (days == 1) {
            this.setData({
                url: 'https://langorow-1257044814.cos.ap-guangzhou.myqcloud.com/badge/%E7%8B%AC%E6%8F%BD%E8%8B%8D%E7%A9%B9.jpg'
            });
        } else if (days == 7) {
            this.setData({
                url: 'https://langorow-1257044814.cos.ap-guangzhou.myqcloud.com/badge/%E5%88%9D%E9%9C%B2%E9%94%8B%E8%8A%92.jpg'
            });
        } else if (days == 21) {
            this.setData({
                url: 'https://langorow-1257044814.cos.ap-guangzhou.myqcloud.com/badge/%E5%8A%BF%E5%A6%82%E7%A0%B4%E7%AB%B9.jpg?tdsourcetag=s_pctim_aiomsg'
            });
        }
        this.setData({
            showModal: true
        })
    },
    /**
     * 弹出框蒙层截断touchmove事件
     */
    preventTouchMove: function() {

    },
    /**
     * 隐藏模态对话框
     */
    hideModal: function() {
        this.setData({
            showModal: false
        });
    },
    /**
     * 对话框取消按钮点击事件
     */
    onCancel: function() {
        this.hideModal();
    },
    /**
     * 对话框确认按钮点击事件
     */
    onConfirm: function() {
        this.hideModal();
    },
    nav: function() {
        wx.switchTab({
            url: '../mine/mine',
        })
    },
})