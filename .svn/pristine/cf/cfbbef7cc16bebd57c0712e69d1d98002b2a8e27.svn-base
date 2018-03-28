// pages/clockin/clockin.js
// 地图 页

var app = getApp();
var header = getApp().globalData.header
var util = require('../../utils/util.js');  //获取当前时间

Page({

    /**
     * 页面的初始数据
     */
    data: {
       
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var _that = this
        wx.getLocation({
            type: 'gcj02',
            success: function (res) {
                _that.setData({
                    latitude: res.latitude,
                    longitude: res.longitude,
                    markers: [{
                        latitude: res.latitude,
                        longitude: res.longitude,
                    }]
                })
            }
        })

        // 获取visitId 和 token
        this.setData({
            pageState: options.pageState,
            visitId: options.visitId,
            token: options.token
        })

        // startNameId：获取用户id并缓存下来
        var _that = this
        wx.getStorage({
            key: 'startNameId',
            success: function (res) {
                _that.setData({
                    startNameId: res.data
                })
            },
        });

        // ccLogin:获取用户登录名并缓存下来
        wx.getStorage({
            key: 'ccLogin',
            success: function (res) {
                _that.setData({
                    ccLogin: res.data
                })
            },
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
       

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    /**
     * 上传经纬度
     */
    uploadLocation: function () {
        var _that = this
        this.publicLocation(_that.data.pageState)
    },

    /**
        * 上传位置共同方法  changeActionState
        * pageState : 点击 ‘出发’ 或者 点击 ‘到达’
        *             1:为出发， 2:为到达
        */
    publicLocation: function (pageState) {
        var _that = this
        var data

        // 点击出发（pageState == 1）的情况下
        if (pageState == '1') {
            data = {
                visitId: _that.data.visitId,
                token: _that.data.token,
                startLl: _that.data.longitude + ',' + _that.data.latitude,  // ‘出发’按钮上传经纬度
                startTime: util.formatTime(new Date()),  //签到开始时间
                startName: _that.data.ccLogin,  //开始登录名
                startNameId: _that.data.startNameId,  //登录id
                state: '1'  // 修改为已出发状态
            }
        }

        // 点击到达（pageState == 2）的情况下
        if (pageState == '2') {
            data = {
                visitId: _that.data.visitId,
                token: _that.data.token,
                endLl: _that.data.longitude + ',' + _that.data.latitude,    //上传经纬度
                endTime: util.formatTime(new Date()),  //上传结束时间
                endName: _that.data.ccLogin,  //结束登录名
                state: '3'
            }
        }

        wx.request({
            url: getApp().globalData.ipaddress + 'collection/ws/visitRecord/changeActionState',
            method: "POST",
            header: header,
            data: data,
            success: function (res) {
                setTimeout(function () {
                    wx.navigateBack({
                        url: '../detailmegs/detailmegs',
                    })
                }, 0.5 * 1000);
            },
            fail: function () {
                wx: wx.showToast({
                    title: '上传位置网络错误',
                    icon: 'loading',
                })
            }
        })
    },

    /**
      * 地图更新完毕
      */
    uploadEnd: function () {
        
    }
})