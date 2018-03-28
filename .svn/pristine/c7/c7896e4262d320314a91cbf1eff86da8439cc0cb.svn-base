// pages/completeDetail/completeDetail.js
// 已完成 详情页
var app = getApp();
var header = getApp().globalData.header

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     * 接受 token 和visitid变量
     */
    onLoad: function (options) {
        this.setData({
            token: options.token,
            visitId: options.visitid
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        var _that = this
        wx.request({
            url: getApp().globalData.ipaddress + 'collection/ws/visitRecord/finishedVisitDetail',
            method: "POST",
            header: header,
            data: {
                token: _that.data.token,
                visitId: _that.data.visitId,
            },
            success: function (res) {
                // 地址是否有效
                switch (res.data.data.isEffective){
                    case '1':
                        res.data.data.isEffective = '是';
                        break;
                    case '2':
                        res.data.data.isEffective = '否';
                        break;
                }
                //  外访结果
                switch (res.data.data.visitState) {
                    case '0':
                        res.data.data.visitState = '中家人';
                        break;
                    case '1':
                        res.data.data.visitState = '中债';
                        break;
                    case '2':
                        res.data.data.visitState = '无址';
                        break;
                    case '3':
                        res.data.data.visitState = '拆迁';
                        break;
                    case '4':
                        res.data.data.visitState = '不中人';
                        break;
                    case '5':
                        res.data.data.visitState = '中同事/朋友';
                        break;
                }
                 //截取实际外访日期
                res.data.data.endTime = res.data.data.endTime.substring(0, 11),
                _that.setData({
                    pageList: [res.data.data]
                })
            },
            fail: function () {
                wx.showToast({
                    title: '已完成页面网络错误',
                    icon: 'loading',
                })
            }
        })

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

    }
})