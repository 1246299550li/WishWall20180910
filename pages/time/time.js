// pages/led/index.js

Page({
  /**
   * 页面的初始数据
   */
  data: {
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
    time: 65,
    background: "../../lib/img/circle.png"
  },



  /**

   * 生命周期函数--监听页面加载

   */

  onLoad: function(options) {



  },



  /**

   * 生命周期函数--监听页面初次渲染完成

   */

  onReady: function() {
    this.countDown();
  },



  /**

   * 生命周期函数--监听页面显示

   */

  onShow: function() {

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

    var interval = setInterval(function() {

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
        clearInterval(interval);
        wx.showModal({
          content: '恭喜你！任务完成！',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.reLaunch({
                url: '../tomato/tomato',
              })
            }
          }
        })
        return;
      }

    }, 1000)
  }
})