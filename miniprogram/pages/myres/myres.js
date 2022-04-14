// pages/myres/myres.js
const db=wx.cloud.database()
var times=require('../../utils/times.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    seatinfo:'',
    cancelInfo:''//取消预约座位的信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const app=getApp()
    var openid=app.globalData.openid
    this.setData({
      openid:openid
    })
    wx.cloud.callFunction({
      name:'getseatinfo',
      data:{
        openid:openid
      },
      complete:res=>{
        console.log(res.result.list)
        for(var i=0;i<res.result.list.length;i++){
          res.result.list[i]["_createTime"]=times.toDate(res.result.list[i]["_createTime"])
          if(res.result.list[i].signmod !=0){
            res.result.list[i]["signtime"]=times.toDate(res.result.list[i]["signtime"])
          }
          if(res.result.list[i].signout !=0){
            res.result.list[i]["signoutTime"]=times.toDate(res.result.list[i]["signoutTime"])
          }
          
        }
        this.setData({
          seatinfo:res.result.list
        })
      }
    })
  },
  cancel(e){
    console.log(e.currentTarget.id)
    //get取消预约座位的信息
    db.collection('seat_Info').doc(e.currentTarget.id).get().then(res=>{
      console.log(res.data)
      this.setData({
        cancelInfo:res.data
      })
      console.log(res.data.cancel)
      if(res.data.cancel==0&&res.data.signmod==0){//取消状态和签到状态==0跳转取消预约页面
        wx.navigateTo({
          url: '../cancelres/cancelres?id='+e.currentTarget.id,
        })
      }else{
        wx.showToast({
          title: '不可取消',
          icon:'error',
          duration:2000
        })
      }
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