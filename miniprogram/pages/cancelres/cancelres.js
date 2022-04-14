// pages/cancelres/cancelres.js
const db=wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioItems: [{
      name: '有课',
      value: 'class',
      checked: true
    },
    {
      name: '生病',
      value: 'ill'
    },
    {
      name: '其他',
      value: 'other'
    }
  ],
  cancelreason:'',
  list_id:''
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
    console.log(options.id)
    this.setData({
      list_id:options.id
    })
  },
  radioChange(e){
    console.log(e.detail.value)
    this.setData({
      cancelreason:e.detail.value
    })
  },
  submitForm(){
    db.collection('cancel').add({
      data:{
        resInfo:this.data.list_id,
        reason:this.data.cancelreason,
        openid:this.data.openid,
        _createTime:Date.parse(new Date()),
      },
      success:(res)=>{
        db.collection('seat_Info').doc(this.data.list_id).update({
          data:{
            cancel:1,
            _updateTime:Date.parse(new Date()),
          },
          success:(res=>{
            db.collection('seat_Info').doc(this.data.list_id).get().then(res=>{
              console.log(res.data.seat)
              var seatid=res.data.seat
              var seatTime=res.data.seatTime
              db.collection('lib_Seat').doc(seatid).update({
                data:{
                  ['orderTime.'+seatTime+'.0']:0,
                  _updateTime:Date.parse(new Date()),
                },
                success:(res=>{
                  wx.showToast({
                    title: '取消成功',
                    icon:'success',
                    duration:1000,
                    success:(res)=>{
                      setTimeout(function () {
                        wx.switchTab({
                          url: '../index/index',
                        })
                      }, 1000);
                    }
                  })
                })
              })
            })
          })
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