

// pages/reservation/reservation.js
const db=wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list_id:'',
    seatarry:'',
    userinfo:'',
    openid:'',
    timeInfo:[["8:00-9:30", 0], ["9:30-11:00", 1], ["11:00-12:30", 2], ["12:30-2:00", 3], ["2:00-4:00", 4]],//时间段sjxx
    timeIndex:0,//timeInfo下标sjxxindex
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo=wx.getStorageSync('userinfo')
    var openid=wx.getStorageSync('openid')
    this.setData({
      list_id:options.list_id,
      userinfo:userInfo,
      openid:openid,
      timeIndex:options.timeID
    })
    wx.cloud.callFunction({
      name:'getseatlist',
      data:{
        listid:options.list_id
      },
      complete:res=>{
        console.log(res.result.list)
        this.setData({
          seatarry:res.result.list
        })
      }
    })
  },
  confirm_seat(){
    db.collection("seat_Info").add({
      data:{
        openid:this.data.openid,
        seat:this.data.list_id,
        signmod:0,
        signout:0,
        cancel:0,
        seatTime:this.data.timeIndex,
        _createTime:Date.parse(new Date()),
      }
    }).then(res=>{
      wx.showToast({
        title: '选座成功',
        icon: 'success',
        duration: 2000,
        success:()=>{
          db.collection("lib_Seat").doc(this.data.list_id).update({
            data:{
              // seatmod:2//选座成功后设定座位状态为可预约
              ['orderTime.'+this.data.timeIndex+'.0']:2
            },
            success:res=>{//预约成功后返回主页
              setTimeout(function(){
                wx.switchTab({
                  url: '../index/index',
                })
              },2000)
            }
          })
          setTimeout(()=>{
            wx.switchTab({
              url: '../index/index',
            })
          },2000)
        }
      })
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