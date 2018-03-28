// pages/detail/detail.js
//  登录后的详情列表页

var app = getApp();
var header = getApp().globalData.header
Page({
  /**
   * 页面的初始数据
   */
  data: {
      className: '1',  //tar选中加上黄色下划线
      isShowFlg: '0',   // 0 为有数据，1为无数据
  },

  tabChange:function(e){
      //'已排程'页面
      if (e.currentTarget.dataset.navs == '1'){
        //  已排程列表接口
          this.publicFunction(e.currentTarget.dataset.navs, 'approveVisit')
      }

      //'待上传'页面
      if (e.currentTarget.dataset.navs == '2') {
          //  待上传列表接口
          this.publicFunction(e.currentTarget.dataset.navs, 'finishNotUpload')
      } 

      //'已完成'页面
      if (e.currentTarget.dataset.navs == '3') {
          //  已完成列表接口
          this.publicFunction(e.currentTarget.dataset.navs, 'finishedVisit')  
      }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.token = options.token // 获取url中的token参数
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   * 填写报告 完成 跳转 
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      this.publicFunction('1', 'approveVisit')
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
      // ‘已排程页面刷新’
      if (this.data.className ==1 ){
          this.pagePull('1','approveVisit')
      }
      // ‘待上传页面刷新’
      if (this.data.className == 2) {
          this.pagePull('2', 'finishNotUpload')
      }
      // ‘已完成页面刷新’
      if (this.data.className == 3) {
          this.pagePull('3', 'finishedVisit')
      }
    
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
   * 请求列表的共同方法  approveVisit，finishNotUpload,finishedVisit
   * classNameStyle : 点击的是 ‘已排程’，‘待上传’，‘已完成’
   * url： ‘已排程’，‘待上传’，‘已完成’后缀地址
   */
  publicFunction: function (classNameStyle, url) {
      var _that = this
      var dataS = {}  // 后台的token参数 命名不一致，导致一下写法
      _that.setData({  //设置 选中下划线
          className: classNameStyle
      });

      // 后台的token参数 命名不一致，导致以下写法
      if(classNameStyle != '2'){
          dataS = {
              id: _that.data.token,
              currentPage: 1,
              pageSize: 50,
          }   
      }else{
          dataS = {
              token: _that.data.token,
              currentPage: 1,
              pageSize: 50,
          }   
      }
       // 后台的token参数 命名不一致，导致以下写法

      // ‘已排程’,‘待上传’,‘已完成’,'页面加载' 列表
      wx.request({
          url: getApp().globalData.ipaddress + 'collection/ws/visitRecord/' + url,
          method: "POST",
          header: header,
          data: dataS,
          success: function (res) {
              if (res.data.msg == 'ok') {
                  _that.setData({  //‘已排程’,‘待上传’,‘已完成’ 的获取的列表 
                      pageList: res.data.data.list,
                      isShowFlg:'0'  //控制是否显示数据
                  });
              } else {
                  _that.setData({
                      isShowFlg : '1'
                  })
              }
          },
          fail: function (e) {
              wx.showToast({
                  title: '显示列表网络错误',
                  icon: 'loading',
              })
          }
      })
  },

/**
   * 列表刷新的共同方法  approveVisit，approveVisit，finishNotUpload,finishedVisit
   * classNameStyle : 点击的是 ‘已排程’，‘待上传’，‘已完成’
   * url： ‘已排程’，‘待上传’，‘已完成’后缀地址
   */
  pagePull: function (classNameStyle, url){
      var _that = this;
      var dataS = {}  // 后台的token参数 命名不一致，导致一下写法
      wx.showNavigationBarLoading() //在标题栏中显示加载

      // 后台的token参数 命名不一致，导致以下写法
      if (classNameStyle != '2') {
          dataS = {
              id: _that.data.token,
              currentPage: 1,
              pageSize: 50,
          }
      } else {
          dataS = {
              token: _that.data.token,
              currentPage: 1,
              pageSize: 50,
          }
      }
      wx.request({
          url: getApp().globalData.ipaddress + 'collection/ws/visitRecord/' + url,
          method: "POST",
          header: header,
          data: dataS,
          success: function (res) {
              if (res.data.msg == 'ok') {
                  _that.setData({
                      pageList: res.data.data.list
                  })
              }else{
                  _that.data.promptTxt = '暂无数据'
              }
          },
          fail:function(){
              wx.showToast({
                  title: '列表刷新请求错误',
                  icon: 'loading',
              })
          }
      });
      //模拟加载
      setTimeout(function () {
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
      }, 500);
  },

/**
   * 每个列表详情页跳转的页面不同
   * e.currentTarget.dataset.page = 1 ‘已排程’详情页
   * e.currentTarget.dataset.page = 2 ‘待上传’详情页
   * e.currentTarget.dataset.page = 3 ‘已完成’详情页 
   * 
   * visitid : 每个visitid
   * token：token
   */
  changPage:function(e){
      var _that = this
      if (e.currentTarget.dataset.page == '1'){
          var visitid = e.currentTarget.dataset.visitid
          wx.navigateTo({
              url: '../detailmegs/detailmegs?className=1&token=' + _that.data.token +'&visitid='+ visitid,
          })
      }
      if (e.currentTarget.dataset.page == '2') {
          var visitid = e.currentTarget.dataset.visitid
          wx.navigateTo({
              url: '../detailmegs/detailmegs?className=2&token=' + _that.data.token +'&visitid='+ visitid,
          })
      }
      if (e.currentTarget.dataset.page == '3') {
          var visitid = e.currentTarget.dataset.visitid
          wx.navigateTo({
              url: '../completeDetail/completeDetail?token=' + _that.data.token + '&visitid=' + visitid,
          })
      }
  },
})