// pages/daka/daka.js
var Calendar = require("../../service/Calendar.js");
var Common = require("../../service/Common.js");
const app = getApp();
const WEB_ROOT = app.globalData.WEB_ROOT;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //先获取openid，openid会被保存在全局变量globalData中
    // app.jscode2session(res=>{
    var nowDate = new Date(); //当前日期
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
    var paramMonth = paramDate.getMonth();
    if (paramMonth + 1 > 12) { //后台保存的月份数据是 1-12
      paramMonth = 1;
    } else {
      paramMonth += 1;
    }
    var paramYear = paramDate.getFullYear();
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
        // var signDates  = res.data;
        // var rest = res.data;
        // var ttt = [1, 2, 3];
        // var tt = new Date();
        // var ttt = tt.getDate();
        // console.log(ttt);
        console.log(res.data);
        var signDates = res.data;
        //当前年月日
        var now = new Date(); //当前时间
        var nowMonth = now.getMonth();
        var nowYear = now.getFullYear();

        var showSign = false; //是否显示签到按钮
        if (nowMonth === paramDate.getMonth() && nowYear === paramDate.getFullYear()) {
          showSign = true;
        }
        var today = new Date();
        var todaydate = today.getDate();
        if (Common.contains(signDates, todaydate)){
          showSign = false;
        }
        //未来签到日期设置为空
        if (nowMonth < paramDate.getMonth() && nowYear <= paramDate.getFullYear()) {
          signDates = [];
        }

        //星期
        var days = ["日", "一", "二", "三", "四", "五", "六"];

        //签到日历数据的生成
        var calendars = Calendar.getSignCalendar(paramDate, signDates);

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
    var dataYear = this.data.year;
    var dataMonth = this.data.month - 2; //月是从0开始的
    var paramDate = Calendar.parseDate(dataYear, dataMonth);
    this.initCalendar(paramDate);
  },

  //下个月
  nextMonth: function() {
    var dataYear = this.data.year;
    var dataMonth = this.data.month;
    var paramDate = Calendar.parseDate(dataYear, dataMonth);
    this.initCalendar(paramDate);
  },

  //签到
  doSign: function() {
    // 调用服务器端，实现签到入库
    wx.request({
      // url: app.HTTP_SERVER + 'xcx/rest/doSign.htm',
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
        // 签到成功给出提示
        wx.showToast({
          title: '签到成功',
          icon: 'success',
          duration: 2000
        })
        //刷新日历

        var now = new Date(); //当前时间
        this.initCalendar(now);
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

  },

})