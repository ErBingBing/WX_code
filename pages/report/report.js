// pages/report/report.js
// 填写报告页面

var app = getApp();
var header = getApp().globalData.header
var addressData = require('../../utils/address.js');  // 加载地址json

Page({

    /**
     * 页面的初始数据
     */
    data: {
        /**
         * relationArray 关系字段      relationShow '关系'字段是否显示
         * contactArray 联系方式字段   contact '联系方式'是否显示
         * telArray 电话字段    telShow ‘类别’字段 是否显示 
         * addressArray 地址字段   addressShow ‘类别’ 字段是否显示
         * telFlg ‘类别’中 是否显示电话字段
         * addressFlg ‘类别’中 是否显示地址字段
         * detailTel 详细电话字段
         * name 姓名 字段
         * region 省市县字段
         * detailAddress 详细
         * name  姓名 字段
         * pcc: 省市县ID
        */
        addDatas: [{
            relationArray: ['本人', '父母', '子女', '兄弟姐妹', '旁系亲属', '家人', '朋友', '配偶', '同事', '同学', '邻居', '担保人'], relationShow: true, contactArray: ['联系电话', '详细地址'], contactShow: true, telArray: ['家庭电话', '单位电话', '手机', '联系人电话', '其他电话'], telShow: true, addressArray: ['家庭地址', '单位地址', '对账单地址', '户籍地址', '其他地址'], addressShow: true, telFlg: '1', addressFlg: '0', detailTel: '', region: ['省', '市', '县'], pcc: [], detailAddress: '', name: ''
        }],
        // 地址是否有效
        addressRadio: [
            { name: '1', value: '是' },
            { name: '2', value: '否' },
        ],
        // 外访结果
        resultsRadio: [
            { name: '0', value: '中家人' },
            { name: '1', value: '中债人' },
            { name: '2', value: '无址' },
            { name: '3', value: '拆迁' },
            { name: '4', value: '不中人' },
            { name: '5', value: '中同事/朋友' },

        ],
        isEffective: '', //地址是否有效
        visitState: '',//外访结果
        visitReport: '', //外访报告
    },

    /**
     * submit提交成功 触发方法
     */
    submit: function (e) {
        var _that = this
        if (_that.data.isEffective != '' && _that.data.visitState != '' && _that.data.visitReport != '') {
            wx.showModal({
                title: '',
                title: '提示',
                content: '确定所有附件全部上传',
                cancelText: '否',
                confirmText: '是',
                success: function (res) {
                    //  完成外访中‘完成’按钮按下‘是’按钮  TODO lxb
                    if (res.confirm) {
                        _that.uploadFrom('4')
                        //  完成外访中‘完成’按钮按下‘否’按钮  TODO lxb
                    } else {
                        _that.uploadFrom('3')
                    }
                }
            })
        } else {
            if (_that.data.isEffective == '') {
                wx.showToast({
                    title: "请完善地址是否有效信息",
                    icon: 'loading',
                })
            } else if (_that.data.visitState == '') {
                wx.showToast({
                    title: "请完善外访结果信息",
                    icon: 'loading',
                })
            } else if (_that.data.visitReport == '') {
                wx.showToast({
                    title: "请完善外访报告信息",
                    icon: 'loading',
                })
            }
        }
    },

    /**
     * 外访报告 触发方法
     */
    bindTextAreaBlur: function (e) {
        this.setData({
            visitReport: e.detail.value
        })
    },

    /**
     * 地址是否有效 触发方法
     */
    addressRadioChange: function (e) {
        this.setData({
            isEffective: e.detail.value
        })
    },

    /**
     * 外访结果  触发方法
     */
    resultsRadioChange: function (e) {
        this.setData({
            visitState: e.detail.value
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            token: options.token,
            visitId: options.visitid
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     * 页面加载的时候回显值
     */
    onReady: function () {
        var _that = this
        wx.request({
            url: getApp().globalData.ipaddress + 'collection/ws/visitRecord/finishedNotUploadDetail',
            method: "POST",
            header: header,
            data: {
                token: _that.data.token,
                visitId: _that.data.visitId,
            },
            success: function (res) {
                //地址是否有效
                if ('isEffective' in res.data.data) {
                    if (res.data.data.isEffective == '1') {
                        var changed = {}
                        changed['addressRadio[0].checked'] = true
                        _that.setData(changed)

                        //默认赋值提交数据库
                        _that.setData({
                            isEffective: res.data.data.isEffective
                        })
                    }
                    if (res.data.data.isEffective == '2') {
                        var changed = {}
                        changed['addressRadio[1].checked'] = true
                        _that.setData(changed)

                        //默认赋值提交数据库
                        _that.setData({
                            isEffective: res.data.data.isEffective
                        })
                     }

                    // 已排程页面删除 添加联系人信心  TODO　LXB
                    _that.data.addDatas.splice(0, 1);
                    _that.setData({
                        addDatas: _that.data.addDatas
                    })
                }

                //外访结果
                if ('visitState' in res.data.data) {
                    var changed = {}
                    changed['resultsRadio[' + res.data.data.visitState + '].checked'] = true
                    _that.setData(changed)
                    //默认赋值提交数据库
                    _that.setData({
                        visitState: res.data.data.visitState
                    })
                }

                //外访报告visitState
                if ('visitReport' in res.data.data) {
                    _that.setData({
                        visitReport: res.data.data.visitReport
                    })
                }

            },
            fail: function () {
                wx: wx.showToast({
                    title: '回显网络错误',
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

    },
    /**
     * 详细地址 省市县
     */
    //获取地址
    bindRegionChange: function (e) {

        //TODO LXB 地址转换json数字
        // console.log(addressData.addressJson[4].name)  // 省
        // console.log(addressData.addressJson[4].sub[4].name)   // 市
        // console.log(addressData.addressJson[4].sub[4].sub[4].name)  // 县
        for (var i = 0; i < addressData.addressJson.length; i++) {   // json数据等于选择的省for循环
            if (e.detail.value[0] == addressData.addressJson[i].name) {  // json数据等于选择的省
                console.log(addressData.addressJson[i].id + '省ID')
                this.data.addDatas[e.currentTarget.dataset.current].pcc[0] = addressData.addressJson[i].id  // 省id添加pcc变量中
                for (var j = 0; j < addressData.addressJson[i].sub.length; j++) {  // json数据等于选择的市for循环
                    if (e.detail.value[1] == addressData.addressJson[i].sub[j].name) {   // json数据等于选择的市
                        console.log(addressData.addressJson[i].sub[j].id + '市ID')
                        this.data.addDatas[e.currentTarget.dataset.current].pcc[1] = addressData.addressJson[i].sub[j].id  // 市id添加pcc变量中
                        for (var h = 0; h < addressData.addressJson[i].sub[j].sub.length; h++) {  //json数据等于选择的县for循环
                            if (addressData.addressJson[i].sub[j].sub[h].name == e.detail.value[2]) {  // json数据等于选择的县
                                console.log(addressData.addressJson[i].sub[j].sub[h].id + '县ID')
                                this.data.addDatas[e.currentTarget.dataset.current].pcc[2] = addressData.addressJson[i].sub[j].sub[h].id  // 县id添加pcc变量中
                            }
                        }
                    }
                }
            }
        }
        //TODO LXB 地址转换json数字
        this.data.addDatas[e.currentTarget.dataset.current].region = e.detail.value

        this.setData({
            addDatas: this.data.addDatas
        })
    },

    /**
     * 姓名 函数
     */
    nameChange: function (e) {
        this.data.addDatas[e.currentTarget.dataset.current].name = e.detail.value
        this.setData({
            addDatas: this.data.addDatas
        })
    },

    /**
   * 详细地址 pick
   */
    detailAddress: function (e) {
        this.data.addDatas[e.currentTarget.dataset.current].detailAddress = e.detail.value
        this.setData({
            addDatas: this.data.addDatas
        })
    },

    /**
    * 详细电话 pick
    */
    detailTel: function (e) {
        this.data.addDatas[e.currentTarget.dataset.current].detailTel = e.detail.value
        this.setData({
            addDatas: this.data.addDatas
        })
    },

    /**
     * 联系地址 pick
     */
    addressChange: function (e) {

        // addDatas的类别的index设置为选择的
        this.data.addDatas[e.currentTarget.dataset.current].addressIndex = e.detail.value
        // 类别字段 设置为隐藏
        this.data.addDatas[e.currentTarget.dataset.current].addressShow = false

        this.setData({
            addDatas: this.data.addDatas,
        })
    },

    /**
     * 联系电话 pick
     */
    telChange: function (e) {

        // addDatas的类别的index设置为选择的
        this.data.addDatas[e.currentTarget.dataset.current].telIndex = e.detail.value
        // 类别字段 设置为隐藏
        this.data.addDatas[e.currentTarget.dataset.current].telShow = false

        this.setData({
            addDatas: this.data.addDatas,
        })
    },

    /**
     * 联系方式 pick
     */
    contactChange: function (e) {

        // addDatas的联系方式的index设置为选择的
        this.data.addDatas[e.currentTarget.dataset.current].contactIndex = e.detail.value
        // 联系方式字段 设置为隐藏
        this.data.addDatas[e.currentTarget.dataset.current].contactShow = false

        this.setData({
            addDatas: this.data.addDatas,
        })

        // 控制 ‘类别’需要显示的字段
        // e.currentTarget.dataset.current ==0 是联系电话 
        // e.currentTarget.dataset.current ==1 是详细地址
        if (e.detail.value == 0) {
            this.data.addDatas[e.currentTarget.dataset.current].telFlg = '1'
            this.data.addDatas[e.currentTarget.dataset.current].addressFlg = '0'
            this.setData({
                addDatas: this.data.addDatas,
            })
        }

        if (e.detail.value == 1) {
            this.data.addDatas[e.currentTarget.dataset.current].addressFlg = '1'
            this.data.addDatas[e.currentTarget.dataset.current].telFlg = '0'
            this.setData({
                addDatas: this.data.addDatas,
            })
        }
    },

    /**
     * 关系选择 pick
     */
    relationPickerChange: function (e) {

        // addDatas的关系字段的index设置为选择的
        this.data.addDatas[e.currentTarget.dataset.current].relationIndex = e.detail.value
        // 关系字段 设置为隐藏
        this.data.addDatas[e.currentTarget.dataset.current].relationShow = false

        this.setData({
            addDatas: this.data.addDatas,
        })
    },


    /**
     * 删除 添加的联系人
     * 
     */
    ondel: function (e) {
        var _that = this
        var num = e.currentTarget.dataset.index;
        _that.data.addDatas.splice(num, 1)
        _that.setData({
            addDatas: _that.data.addDatas
        })

    },

    /**
     * 添加的联系人
     * addDatas: []
     */
    onadds: function (e) {
        var _that = this
        _that.data.addDatas.push({
            relationArray: ['本人', '父母', '子女', '兄弟姐妹', '旁系亲属', '家人', '朋友', '配偶', '同事', '同学', '邻居', '担保人'], relationShow: true, contactArray: ['联系电话', '详细地址'], contactShow: true, telArray: ['家庭电话', '单位电话', '手机', '联系人电话', '其他电话'], telShow: true, addressArray: ['家庭地址', '单位地址', '对账单地址', '户籍地址', '其他地址'], addressShow: true, telFlg: '1', addressFlg: '0', detailTel: '', region: ['省', '市', '县'], pcc: [], detailAddress: '', name: ''
        })
        _that.setData({
            addDatas: _that.data.addDatas,
        })
    },

    /**
     * 提交表单：填写报告
     * ‘是’ 和‘否’的请求和修改状态
     * isAllUpload = 3 为否（待上传状态）
     * * isAllUpload = 4 为否（完成状态）
     */
    uploadFrom: function (isAllUpload) {
        var _that = this
        wx.request({
            url: getApp().globalData.ipaddress + 'collection/ws/visitRecord/finishVist',
            method: "POST",
            header: header,
            data: {
                token: _that.data.token,  // token
                visitFormId: _that.data.visitId,  // visitId
                isEffective: _that.data.isEffective,  //地址是否有效
                visitState: _that.data.visitState,  // 外访结果
                visitReport: _that.data.visitReport,  // 外访报告
            },
            success: function (res) {
                // 修改为完成状态
                if (res.data.msg == 'ok') {
                    _that.Contact();  // 调用提交手机号或者地址函数
                    wx.request({
                        url: getApp().globalData.ipaddress + 'collection/ws/visitRecord/changeVisitState',
                        method: "POST",
                        header: header,
                        data: {
                            visitId: _that.data.visitId,
                            token: _that.data.token,
                            isAllUpload: isAllUpload  // 修改为完成状态或者待上传状态
                        },
                        success: function () {
                            // 跳转到 待排程页面
                            wx.redirectTo({
                                url: '../detail/detail?token=' + _that.data.token
                            });
                        },
                        fail: function () {
                            wx: wx.showToast({
                                title: '修改完成状态网络错误',
                                icon: 'loading',
                            })
                        }
                    })
                }
            },
            fail: function () {
                wx.showToast({
                    title: '上传报告网络错误',
                    icon: 'loading',
                })
            }
        })
    },
    /**
     * 提交手机号和地址的方法
     */
    Contact: function () {
        var _that = this
        for (var i = 0; i < _that.data.addDatas.length; i++) {
            if (_that.data.addDatas[i].telFlg == '1') {  //联系方式为 ‘联系电话’
                if (_that.data.addDatas[i].name) {  // name不为空 处理，
                    // 关系字段字典
                    switch (_that.data.addDatas[i].relationIndex) {
                        case '0':
                            _that.data.addDatas[i].relationIndex = '本人';
                            break;
                        case '1':
                            _that.data.addDatas[i].relationIndex = '父母';
                            break;
                        case '2':
                            _that.data.addDatas[i].relationIndex = '子女';
                            break;
                        case '3':
                            _that.data.addDatas[i].relationIndex = '兄弟姐妹';
                            break;
                        case '4':
                            _that.data.addDatas[i].relationIndex = '旁系亲属';
                            break;
                        case '5':
                            _that.data.addDatas[i].relationIndex = '家人';
                            break;
                        case '6':
                            _that.data.addDatas[i].relationIndex = '朋友';
                            break;
                        case '7':
                            _that.data.addDatas[i].relationIndex = '配偶';
                            break;
                        case '8':
                            _that.data.addDatas[i].relationIndex = '同事';
                            break;
                        case '9':
                            _that.data.addDatas[i].relationIndex = '同学';
                            break;
                        case '10':
                            _that.data.addDatas[i].relationIndex = '邻居';
                            break;
                        case '11':
                            _that.data.addDatas[i].relationIndex = '担保人';
                            break;
                    }
                    // 电话类别字段字典
                    switch (_that.data.addDatas[i].telIndex) {
                        case '0':
                            _that.data.addDatas[i].telIndex = '家庭电话';
                            break;
                        case '1':
                            _that.data.addDatas[i].telIndex = '单位电话';
                            break;
                        case '2':
                            _that.data.addDatas[i].telIndex = '手机';
                            break;
                        case '3':
                            _that.data.addDatas[i].telIndex = '联系人电话';
                            break;
                        case '4':
                            _that.data.addDatas[i].telIndex = '其他电话';
                            break;
                    }

                    wx.request({
                        url: getApp().globalData.ipaddress + 'collection/ws/visitRecord/addTelPhone',
                        method: "POST",
                        header: header,
                        data: {
                            token: _that.data.token,
                            visitId: _that.data.visitId,
                            name: _that.data.addDatas[i].name,       //姓名
                            relation: _that.data.addDatas[i].relationIndex || '',  //关系 (这样写法防止后台为undefind)
                            phoneType: _that.data.addDatas[i].telIndex || '',  //电话类别(这样写法防止后台为undefind)
                            phone: _that.data.addDatas[i].detailTel          //电话号码
                        },
                        fail: function () {
                            wx: wx.showToast({
                                title: '提交联系方式网络错误',
                                icon: 'loading',
                            })
                        }
                    })
                }
            }
            if (_that.data.addDatas[i].addressFlg == '1') {  //联系方式为 ‘详细地址’
                if (_that.data.addDatas[i].name) {  // name不为空 处理，
                    // 关系字段字典
                    switch (_that.data.addDatas[i].relationIndex) {
                        case '0':
                            _that.data.addDatas[i].relationIndex = '本人';
                            break;
                        case '1':
                            _that.data.addDatas[i].relationIndex = '父母';
                            break;
                        case '2':
                            _that.data.addDatas[i].relationIndex = '子女';
                            break;
                        case '3':
                            _that.data.addDatas[i].relationIndex = '兄弟姐妹';
                            break;
                        case '4':
                            _that.data.addDatas[i].relationIndex = '旁系亲属';
                            break;
                        case '5':
                            _that.data.addDatas[i].relationIndex = '家人';
                            break;
                        case '6':
                            _that.data.addDatas[i].relationIndex = '朋友';
                            break;
                        case '7':
                            _that.data.addDatas[i].relationIndex = '配偶';
                            break;
                        case '8':
                            _that.data.addDatas[i].relationIndex = '同事';
                            break;
                        case '9':
                            _that.data.addDatas[i].relationIndex = '同学';
                            break;
                        case '10':
                            _that.data.addDatas[i].relationIndex = '邻居';
                            break;
                        case '11':
                            _that.data.addDatas[i].relationIndex = '担保人';
                            break;
                    }
                    // 地址类别字段字典
                    switch (_that.data.addDatas[i].addressIndex) {
                        case '0':
                            _that.data.addDatas[i].addressIndex = '家庭地址';
                            break;
                        case '1':
                            _that.data.addDatas[i].addressIndex = '单位地址';
                            break;
                        case '2':
                            _that.data.addDatas[i].addressIndex = '对账单地址';
                            break;
                        case '3':
                            _that.data.addDatas[i].addressIndex = '户籍地址';
                            break;
                        case '4':
                            _that.data.addDatas[i].addressIndex = '其他地址';
                            break;
                    }
                    wx.request({
                        url: getApp().globalData.ipaddress + 'collection/ws/visitRecord/addAddress',
                        method: "POST",
                        header: header,
                        data: {
                            token: _that.data.token,
                            visitId: _that.data.visitId,
                            name: _that.data.addDatas[i].name,
                            relation: _that.data.addDatas[i].relationIndex || '',  //关系 (这样写法防止后台为undefind)
                            adrCat: _that.data.addDatas[i].addressIndex || '',  //地址类别(这样写法防止后台为undefind)
                            areaId1: _that.data.addDatas[i].pcc[0] || '',  //省的id
                            areaId2: _that.data.addDatas[i].pcc[1] || '',  //市的id
                            areaId3: _that.data.addDatas[i].pcc[2] || '',  //县的id
                            areaName1: _that.data.addDatas[i].region[0] == '省' ? '' : _that.data.addDatas[i].region[0],  //省的名称(防止后台传 ‘省’ 字段)
                            areaName2: _that.data.addDatas[i].region[1] == '市' ? '' : _that.data.addDatas[i].region[1],  //市的名称(防止后台传 ‘市’ 字段)
                            areaName3: _that.data.addDatas[i].region[2] == '县' ? '' : _that.data.addDatas[i].region[2],  //县的名称(防止后台传 ‘县’ 字段)
                            detailAddress: _that.data.addDatas[i].detailAddress  //详细地址
                        },
                        fail: function () {
                            wx: wx.showToast({
                                title: '提交联系方式网络错误',
                                icon: 'loading',
                            })
                        }
                    })
                }
            }
        }
    }
})