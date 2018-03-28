//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    header: { 'Cookie': '', "content-type": "application/x-www-form-urlencoded" }, //这里还可以加入其它需要的请求头，比如'x-requested-with': 'XMLHttpRequest'表示ajax提交，微信的请求时不会带上这个的
    ipaddress: 'https://www.kangdeassets.com/',  //10.3.0.84 ----124.42.98.250
    // ipaddress: 'http://10.3.0.29:8080/kangde-collection/',  // 长号接口
    // ipaddress: 'http://10.3.0.121:8085/collection/',  // 勤强接口
  }
})