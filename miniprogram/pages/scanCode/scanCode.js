// pages/scanCode/scanCode.js
var wxbarcode=require('../../utils/index.js')
var times=require('../../utils/times.js')
const db= wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code_openid:'',
    openid:'',
    userinfo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const app=getApp()
    // var openid=app.globalData.openid
    var openid=wx.getStorageSync('openid')
    var userinfo=wx.getStorageSync('userinfo')
    this.setData({
      openid:openid,
      code_openid:openid.substr(-10).padStart(openid.length,"*"),//openid前10位打码
      userinfo:userinfo
    })
    wxbarcode.barcode('barcode',openid,680,200)
    wxbarcode.qrcode('qrcode',openid,420,420)
  },
  openqr:function(){//扫一扫点击事件
    var openid=this.data.openid
    wx.scanCode({
      onlyFromCamera: true,
      success(res){
        console.log(res.result)
        var resultid=res.result//座位的文档id
        db.collection("seat_Info").where({seat:resultid}).get().then(res=>{
          console.log(res.data[0].openid)
          if(res.data[0].openid==openid){//判断预约者的openid是否正确
            console.log(resultid)
            if(res.data[0].signmod==0){//判断该位置是否已签到
              db.collection("seat_Info").where({seat:resultid}).update({
                data:{
                  signmod:1,//完成签到
                  signtime:(new Date()).valueOf(),
                },
                success:res=>{//显示签到成功
                  wx.showToast({
                    title: '签到成功',
                    icon: 'success',
                    duration: 2000,
                  })
                }
              })
            }else{
              var thisSigntime = res.data[0].thisSigntime //签到时间
              console.log()
              // var dateNow = (new Date()).valueOf();
              // var usedTime = dateNow-thisSigntime;
              // var minutes = Math.floor(usedTime/(60*1000));
              // if(minutes>10){
                db.collection("seat_Info").where({seat:resultid}).update({
                  data:{
                    signout:1,//签退
                    signoutTime:Date.parse(new Date()),
                  },
                  success:res=>{
                    wx.showToast({
                      title: '签退成功',
                      icon:'success',
                      duration:2000
                    })
                  }
                })
              // }else{
              //   wx.showToast({
              //     title: '签退间隔过短',
              //     icon: 'error',
              //     duration:2000
              //   })
              // }
              db.collection("lib_Seat").where({_id:resultid}).update({
                data:{
                  seatmod:0,
                }
              })
            }
          }else{
            wx.showToast({
              title: '请检查座位',
              icon: 'error',
              duration: 2000,
            })
          }
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