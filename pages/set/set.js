const app = getApp()
const WEB_ROOT = app.globalData.WEB_ROOT;

Page({
  data: {
    college: '',
    ret: '< 返回',
    name: '',
    sex: '',
    invitation_id:"",
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  /*  items: [{
        name: '1',
        value: '男生'
      },
      {
        name: '2',
        value: '女生'
      },
    ]*/
  },
  //事件处理函数
  collegeTitle: function(e) {
    this.setData({
      college: e.detail.value
    })
  },
  nameTitle: function(e) {
    this.setData({
      name: e.detail.value
    })
  },

  invitationTitle:function(e){
    this.setData({
      invitation_id:e.detail.value
    })
  },

  sure: function() {
    let that = this;
    if (this.data.college == '' || this.data.name == '') {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    wx.request({
      url: WEB_ROOT + '/set',
      data: {
        userid: app.globalData.openid,
        col: that.data.college,
        name: that.data.name,
        avatarUrl: that.data.userInfo.avatarUrl,
        nick: app.globalData.userInfo.nickName,
        reqid: that.data.invitation_id,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: "POST",
      success: function(res) {
        console.log(res.data);
        wx.showToast({
          title: '完成！',
          icon: 'success',
          duration: 1500
        });
        setTimeout(function() {
          wx.switchTab({
            url: '../board/board',
            success: function(e) {
              let page = getCurrentPages().pop();
              if (page == undefined || page == null) return;
            }
          });
        }, 1500)
      }
    })
  },

  onLoad: function() {
    wx.showModal({
      content: '新学期开始啦，之前立的flag倒了多少呢？这学期是不是又有很多flag要升起？快来这里定下你的小目标，和大家一起分享梦想实现的过程吧！',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
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
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    this.sure();
  },
  ret: function () {
    wx.switchTab({
      url: '../mine/mine',
    })
  },
})