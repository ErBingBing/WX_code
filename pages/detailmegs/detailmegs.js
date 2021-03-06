// pages/detailmegs/detailmegs.js
// 已排程 待上传 详情页
var app = getApp();
var header = getApp().globalData.header
var util = require('../../utils/util.js');  //获取当前时间
Page({

    /**
     * 页面的初始数据
     */
    data: {
        className: '',  //是否显示签到
        actionSheetHidden: true,  //是否隐藏签到蒙版层
        uploadSheetHidden: true, //是否隐藏上传蒙版层
    },

    /**
     * 生命周期函数--监听页面加载
     * className =1 显示‘签到’ 。className =2 不显示‘签到’
     */
    onLoad: function (options) {
        this.setData({
            className: options.className,
            token: options.token,
            visitId: options.visitid,
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

        //   已排程详细列表
        if (this.data.className == '1') {
            this.publicFunction('approveVisitDetail')
        }
        //   待上传详细列表
        if (this.data.className == '2') {
            this.publicFunction('finishedNotUploadDetail')
        }
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

    //点击签到显示出发按钮
    actionSheetChange: function (e) {  
        this.setData({
            actionSheetHidden: !this.data.actionSheetHidden
        });
    },
    //点击上传附件显示'照片'，‘视频’ 的按钮
    uploadSheetChange: function (e) {
        this.setData({
            uploadSheetHidden: !this.data.uploadSheetHidden
        });
    },

    /**
     * 点击 上传中的 ‘照片’，‘视频’ 按钮
     */
    uploadBindItemTap: function (e) {
        var _that = this

        // 签到后才能上传附件
        if (e.currentTarget.dataset.name == '照片') {  //如果点击的是 ‘出发’
            _that.setData({
                uploadSheetHidden: !_that.data.uploadSheetHidden, 
            })
            wx.chooseImage({
                count: 9, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                    var tempFilePaths = res.tempFilePaths
                    wx.showLoading({
                        title: '正在上传……',
                    })
                    for (var i = 0, h = tempFilePaths.length; i < h; i++) {
                        wx.uploadFile({
                            url: getApp().globalData.ipaddress + 'collection/ws/visitRecord/upload',
                            filePath: tempFilePaths[i],
                            name: 'files',
                            header: { "Content-Type": "multipart/form-data", 'Cookie': header.Cookie },
                            formData: {
                                id: _that.data.token,
                                visitFormId: _that.data.visitId,
                            },

                            success: function (rs) {
                                wx.showToast({
                                    title: '上传成功',
                                    icon: 'success',
                                    duration: 1500
                                })
                            },
                            fail: function (rs) {
                                wx:wx.showToast({
                                    title: '上传照片失败',
                                    icon: 'loading',
                                })
                            }
                        })
                    }
                }
            })
        }
        if (e.currentTarget.dataset.name == '视频') {  //如果点击的是 ‘视频’
            wx.chooseVideo({
                sourceType: ['album'],
                maxDuration: 60,
                camera: 'back',
                success: function (res) {
                    _that.setData({
                        src: res.tempFilePath
                    })
                    wx.showLoading({
                        title: '正在上传……',
                        // duration: 1500,
                    })

                    wx.uploadFile({
                        url: getApp().globalData.ipaddress + 'collection/ws/visitRecord/upload',
                        filePath: _that.data.src,
                        name: 'files',
                        header: { "Content-Type": "multipart/form-data", 'Cookie': header.Cookie },
                        formData: {
                            id: _that.data.token,
                            visitFormId: _that.data.visitId,
                        },

                        success: function (rs) {                         
                            wx.showToast({
                                title: '上传成功',
                                icon: 'success',
                                duration: 1500,
                                success: function () {
                                    _that.setData({
                                        uploadSheetHidden: !_that.data.uploadSheetHidden,
                                    })
                                }
                            })
                        },
                        fail: function (rs) {
                            wx: wx.showToast({
                                title: '上传照片失败',
                                icon: 'loading',
                            })
                        }
                    })
                },
            })
        }
    },

    /***
     * 判断是否符合上传附件方法
     * flg= 1 是填写报告，flg=0 是上传附件
     */
    uploadFile:function(e){
        var _that = this;
        wx.request({
            url: getApp().globalData.ipaddress + 'collection/ws/visitRecord/queryActionStateById',
            method: "POST",
            header: header,
            data: {
                visitId: _that.data.visitId,
                token: _that.data.token,
            }, success: function (res) {
                // 上传控制
                if (e.currentTarget.dataset.flg == '0'){
                    if (res.data.actionState == '3') {
                        _that.setData({
                            uploadSheetHidden: !_that.data.uploadSheetHidden,
                            uploadSheetList: ['照片', '视频']
                        })
                    } else {
                        wx.showModal({
                            title: '提示',
                            content: '请先签到完成后再上传附件',
                            showCancel: false,
                        })
                    }
                }

                // 填写报告控制
                if (e.currentTarget.dataset.flg == '1'){
                    if (res.data.actionState == '3') {
                        // 签到完成后跳转到填写报告页面
                        wx.navigateTo({
                            url: '../report/report?token=' + _that.data.token + '&visitid=' + _that.data.visitId
                        });
                    } else {
                        wx.showModal({
                            title: '提示',
                            content: '请先签到完成后再填写报告',
                            showCancel: false,
                        })
                    }
                }
               
            },
            fail:function(){
                wx:wx.showToast({
                    title: '上传查询状态失败',
                    icon: 'loading',
                })
            }
        })
    },

    /***
     * 打开地图方法
     */
    bindItemTap: function (e) {
        var _that = this
        //点击出发按钮
        if (e.currentTarget.dataset.name == '出发') {
            console.log('点击出发按钮')
            wx.navigateTo({
                url: '../clockin/clockin?pageState=1&visitId=' + _that.data.visitId + '&token=' + _that.data.token,
                success: function (res) {
                    _that.setData({
                        actionSheetHidden: !_that.data.actionSheetHidden
                    });
                }
            })
        }
        if (e.currentTarget.dataset.name == '到达') {
            console.log('点击到达按钮')
            wx.navigateTo({
                url: '../clockin/clockin?pageState=2&visitId=' + _that.data.visitId + '&token=' + _that.data.token,
                success: function (res) {
                    _that.setData({
                        actionSheetHidden: !_that.data.actionSheetHidden
                    });
                }
            })
        }
        if (e.currentTarget.dataset.name == '取消行程') {
            console.log('点击取消行程按钮')
            wx.request({
                url: getApp().globalData.ipaddress + 'collection/ws/visitRecord/changeActionState',
                method: "POST",
                header: header,
                data: {
                    visitId: _that.data.visitId,
                    token: _that.data.token,
                    state: '2'  //修改为未出发的状态
                },
                fail:function(){
                    wx:wx.showToast({
                        title: '签到失败',
                        icon: 'loading',
                    })
                }
            })
            wx.showModal({
                title: '提示',
                content: '取消成功',
                showCancel: false,
                success: function (res) {
                    _that.setData({
                        actionSheetHidden: !_that.data.actionSheetHidden
                    });
                }
            })
        }
    },

    /***
     * 签到的方法
     */
    actionSheetTap: function () {
        var _that = this
        _that.setData({
            actionSheetHidden: !this.data.actionSheetHidden
        })

        wx.request({
            url: getApp().globalData.ipaddress + 'collection/ws/visitRecord/queryActionStateById',
            method: "POST",
            header: header,
            data: {
                visitId: _that.data.visitId,
                token: _that.data.token,
            },
            success: function (res) {
                //初始状态  TODO lxb
                if (res.data.actionState == '0' || res.data.actionState == '2') {  //未出发状态
                    _that.setData({
                        actionSheetList: ['出发']
                    })
                }
                if (res.data.actionState == '1') {  //已出发状态
                    _that.setData({
                        actionSheetList: ['到达', '取消行程']
                    })
                }
                if (res.data.actionState == '3') {  //已经到达

                    _that.setData({
                        actionSheetList: [],  //20180318 晚上22：55 add code
                        actionSheetHidden: !_that.data.actionSheetHidden
                    });
                    wx.showModal({
                        title: '提示',
                        content: '签到完成，请上传附件',
                        showCancel: false,
                        success: function (res) {
                            console.log('签到完成请求成功')
                        }
                    })
                }
            },
            fail: function () {
                wx: wx.showToast({
                    title: '签到状态查询错误',
                    icon: 'loading',
                })
            }
        })
    },

    /**
    * 请求列表详细列表的共同方法  approveVisitDetail,finishedNotUploadDetail，finishedVisitDetail
    * classNameStyle : 点击的是 ‘已排程’，‘待上传’，‘已完成’
    * url： ‘已排程’，‘待上传’，‘已完成’后缀地址
    */
    publicFunction: function (url) {
        var _that = this
        wx.request({
            url: getApp().globalData.ipaddress + 'collection/ws/visitRecord/' + url,
            method: 'POST',
            header: header,
            data: {
                token: _that.data.token,
                visitId: _that.data.visitId,
            },
            success: function (res) {
                _that.setData({
                    pageList: [res.data.data]
                })
            },
            fail: function () {
                wx: showToast({
                    title: '详情页面请求错误',
                    icon: 'loading',
                })
            }
        })
    }
})