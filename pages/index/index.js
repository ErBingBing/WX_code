// 登录页
//获取应用实例
const app = getApp()

Page({
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad: function () {
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
    getUserInfo: function (e) {
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    // 登录函数处理
    formSubmit: function (e) {
        if (e.detail.value.user != '' && e.detail.value.password != '') {  //用户名和密码不为空
            //登录的请求接口
            wx.request({
                url: getApp().globalData.ipaddress + 'collection/ws/visitRecord/login',
                method: "POST",
                data: {
                    loginName: e.detail.value.user,
                    passWord: e.detail.value.password,
                },
                header: {
                    "content-type": "application/x-www-form-urlencoded"
                },
                success: function (res) {  //请求成功处理
                    if (res.data.msg == 'ok') {  //用户名和密码正确的情况
                        getApp().globalData.header.Cookie = 'JSESSIONID=' + res.data.sessionId; //保存token连续登陆
                        //获取用户id并缓存下来
                        wx.setStorage({
                            key: 'startNameId',
                            data: res.data.data.id,
                        })
                        //获取用户登录名并缓存下来
                        wx.setStorage({
                            key: 'ccLogin',
                            data: res.data.data.userName,
                        })
                        // 跳转到列表页
                        wx.navigateTo({
                            url: '../detail/detail?token=' + res.data.token  //传token 参数
                        });
                    } else {   //用户名和密码不正确的情况
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'loading',
                        })
                    }
                },
                fail: function () {  //请求失败处理
                    wx.showToast({
                        title: '登录网络错误',
                        icon: 'loading',
                    })
                }
            })
        } else {  //用户名或密码为空的情况
            wx.showToast({
                title: '账号或密码不能为空',
                icon: 'none',
            })
        }
    }
})
