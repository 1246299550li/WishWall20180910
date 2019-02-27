// pages/upload/upload.js
const app = getApp()
const WEB_ROOT = app.globalData.WEB_ROOT;
var adds = {};
Page({
    data: {
        img_arr: [],
        background: "https://langorow-1257044814.cos.ap-guangzhou.myqcloud.com/background/push.png",
        re: "< 返回",
    },
    submit: function(e) {
        var that = this;
        for (var i = 0; i < this.data.img_arr.length; i++) {
            wx.uploadFile({
              url: WEB_ROOT + 'upload',
                filePath: that.data.img_arr[i],
                name: 'file',
                formData: {
                  id: app.globalData.nowactid,
                  userid: app.globalData.openid
                },
                success: function(res) {
                    console.log(res)
                    if (res) {
                      wx.showToast({
                        title: '提交成功！请耐心等待审核',
                        icon: 'none',
                        duration: 3000
                      });
                        setTimeout(function() {
                            wx.switchTab({
                                url: '../mine/mine'
                            })
                        }, 2000)
                    }
                }
            })
        }
    },

    upimg: function() {
        var that = this;
        if (this.data.img_arr.length < 1) {
            wx.chooseImage({
                sizeType: ['original', 'compressed'],
                success: function(res) {
                    console.log(res);
                    that.setData({
                        img_arr: that.data.img_arr.concat(res.tempFilePaths)
                    })
                }
            })
        } else {
            wx.showToast({
              title: '最多上传一张图片',
              icon: 'none',
              duration: 2000
            });
        }
    },
    nav: function() {
        wx.switchTab({
            url: '../mine/mine',
        })
    },
})