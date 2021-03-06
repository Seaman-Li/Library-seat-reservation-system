// pages/index/index.js
const db=wx.cloud.database()
var times=require('../../utils/times')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mglist:'',
    msglist:'',
    rmb:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name: 'open',
      success: (res) => {
        var usid = res.result.openid
        console.log(usid)
        this.setData({
          openid: res.result.openid,
        })
        getApp().globalData.openid = res.result.openid
        db.collection("user").where({ openid: res.result.openid }).get().then(res => {
          console.log(res.data)
          this.setData({
            userInfo: res.data
          })
          wx.setStorageSync('userinfo', res.data)
        })
        wx.setStorageSync('openid', res.result.openid)
      },
    })
    db.collection("banner").get({
      success:res=>{
        // console.log(res)
        this.setData({
          mglist:res.data
        })
      }
    })
    db.collection("Notice").get({
      success:res=>{
        // console.log(res)
        this.setData({
          msglist:res.data
        })
      }
    })
    db.collection("news").get({
      success:res=>{
        // console.log(res)
        for(var i=0;i<res.data.length;i++){
          // console.log(res.data[i]["_createTime"])
          res.data[i]["_createTime"]=times.toDate(res.data[i]["_createTime"])
        }
        this.setData({
          rmb:res.data
        })
      }
    })
  },
  sjowbs:function(e){
    console.log(e.currentTarget.id)
    wx.navigateTo({
      url: '../news/news?text_id='+e.currentTarget.id,
    })
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

  }
})