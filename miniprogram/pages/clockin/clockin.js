// pages/signIn/signIn.js
const db=wx.cloud.database()
const times = require('../../utils/times.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo:'',
    seatinfo:'',//选座信息
    clocktimes:''//签到次数
  },
  scanQRcode(){
    wx.navigateTo({
      url: '../scanCode/scanCode',
    })
  },
  jl(){
    wx.navigateTo({
      url: '../clockinfo/clockinfo',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userinfo=wx.getStorageSync('userinfo')
    this.setData({
      userinfo:userinfo
    })
    console.log(userinfo[0].openid)
    wx.cloud.callFunction({
      name:'getseatinfo',
      data:{
        openid:userinfo[0].openid
      },
      complete:res=>{
        console.log(res.result.list)
        for(var i=0;i<res.result.list.length;i++){
          res.result.list[i]["_createTime"]=times.toDate(res.result.list[i]["_createTime"])
          res.result.list[i]["signtime"]=times.toDate(res.result.list[i]["signtime"])
          res.result.list[i]["signoutTime"]=times.toDate(res.result.list[i]["signoutTime"])
        }
        this.setData({
          seatinfo:res.result.list
        })
        var clocktimes2=0//签到次数临时变量
        for(let i=0;i<res.result.list.length;i++){
          if(res.result.list[i].signmod==1){
            clocktimes2++
          }
        }
        console.log(clocktimes2)
        this.setData({
          clocktimes:clocktimes2
        })
      }
    })
    // db.collection("seat_Info").where({openid:this.data.userinfo[0].openid}).orderBy('_updateTime','desc').get().then(res=>{
    //   console.log(res)
    //   this.setData({
    //     seatinfo:res.data
    //   })
      // var clocktimes2=0//签到次数
      // for(let i=0;i<res.data.length;i++){
      //   if(res.data[i].signmod==1){
      //     clocktimes2++
      //   }
      // }
    //   console.log(clocktimes2)
    //   this.setData({
    //     clocktimes:clocktimes2
    //   })
    // })
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