// pages/led/index.js
const app = getApp()
const WEB_ROOT = app.globalData.WEB_ROOT;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    interval: "",
    hours: [
      [1, 1, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 0]
    ],
    minutes: [
      [1, 1, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 0]
    ],
    seconds: [
      [1, 1, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 0]
    ],
    time: 0,
    allTime: 0,
    background: "https://lgaoyuan.club:8080/signatureimg/xtz.png",
    motto: "时间像奔腾澎湃的急湍，它一去无还，毫不留恋。 —— 塞万提斯",
    temp: 0,
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      time: options.second,
      allTime: options.second,
    })
    this.countDown();
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

  onUnload: function() {
    clearInterval(this.data.interval);
  },

  countDown: function() {
    var that = this;
    var time = that.data.time;
    var digitSegments = [
      [1, 1, 1, 1, 1, 1, 0],
      [0, 1, 1, 0, 0, 0, 0],
      [1, 1, 0, 1, 1, 0, 1],
      [1, 1, 1, 1, 0, 0, 1],
      [0, 1, 1, 0, 0, 1, 1],
      [1, 0, 1, 1, 0, 1, 1],
      [1, 0, 1, 1, 1, 1, 1],
      [1, 1, 1, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 0, 1, 1],
    ];
    var temp = that.data.temp;
    that.setData({
      interval: setInterval(function() {
        if (temp == 9)
          that.setMotto();
        temp = (temp + 1) % 10;
        /*倒计时开始*/
        var seconds = Math.floor(time % 60);
        var minutes = Math.floor(time / 60 % 60);
        var hours = Math.floor(time / 60 / 60);

        let _hours = [];
        let _minutes = [];
        let _seconds = [];

        _hours[0] = digitSegments[(Math.floor(hours / 10))];
        _hours[1] = digitSegments[(hours % 10)];
        _minutes[0] = digitSegments[(Math.floor(minutes / 10))];
        _minutes[1] = digitSegments[(minutes % 10)];
        _seconds[0] = digitSegments[(Math.floor(seconds / 10))];
        _seconds[1] = digitSegments[(seconds % 10)];

        time--;

        that.setData({
          hours: _hours,
          minutes: _minutes,
          seconds: _seconds,
          time: time,
        });

        /*倒计时结束*/
        if (time < 0) {
          clearInterval(that.data.interval);
          that.finish();
          return;
        }

      }, 1000)
    })
  },

  setMotto: function() {
    var that = this;
    var text = [
      ["劝君莫惜金缕衣，劝君惜取少年时。花开堪折直须折，莫待无花空折枝。—— 《金缕衣》"],
      ["所谓“积土成山”是也，失去一日甚易，欲得回已无途。 —— 卡耐基"],
      ["在今天和明天之间，有一段很长的时间；趁你还有精神的时候，学习迅速地办事。 —— 歌德"],
      ["一万年太久，只争朝夕。 ——毛泽东"]
    ]
    var textlength = text.length;
    var i = Math.floor(Math.random() * textlength)
    that.setData({
      motto: text[i]
    })
  },
  
  finish: function(){//任务完成
    wx.request({
      url: WEB_ROOT + 'forest',
      data: {
        userid: app.globalData.openid,
        time: this.data.allTime/60,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // POST默认值
      },
      success: function (res) {
        wx.showModal({
          content: '恭喜你！任务完成！',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.reLaunch({
                url: '../forest/forest',
              })
            }
          }
        })
      },
      fail: function (err) { }, //请求失败
      complete: function () { } //请求完成后执行的函数
    })
  }
})