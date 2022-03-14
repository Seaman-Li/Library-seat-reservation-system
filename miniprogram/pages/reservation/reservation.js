// pages/reservation/reservation.js
const db=wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:0,//placearr下标
    placearr:['南湖一楼','南湖二楼'],//图书馆楼层
    index1:0,//modarr下标
    modarr:['查看全部','已经预约','暂未预约','不可预约'],//状态栏
    rmb:'',//座位信息列表
    libLoc:'',//楼层
    rmod:''   //预约状态
  },
  bindPickerChangeplace:function(e) {
    console.log(e.detail.value)
    this.setData({
      index:e.detail.value
    })
  },
  bindPickerChangemod:function(e){
    console.log(e.detail.value)
    this.setData({
      index1:e.detail.value,
      rmod:5//'查看全部'设定为5,避免重复查询
    })
    if(e.detail.value==0){//modarr==0查看全部
      wx.cloud.callFunction({
        name:"getseat",
        complete:res=>{
          console.log(res.result.data)
          this.setData({
            rmb:res.result.data
          })
        }
      })
    }else if(e.detail.value==1){//modarr==1已预约
      this.setData({
        rmod:2
      })
    }else if(e.detail.value==2){//modarr==2暂未预约可预约
      this.setData({
        rmod:0
      })
    }else{//modarr==3不可预约
      this.setData({
        rmod:1
      })
    }
    if(this.data.rmod!=5){
      var mod=this.data.rmod
      db.collection("lib_Seat").where({seatmod:parseInt(mod)}).get().then(res=>{//get要查询的座位状态rmod和数据库中seatmod一致的座位信息
        console.log(res)
        this.setData({
          rmb:res.data
        })
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // db.collection("lib_Seat").get().then(res=>{
    //   console.log(res)
    //   this.setData({
    //     rmb:res.data
    //   })
    // })
    wx.cloud.callFunction({//云函数getseat
      name:"getseat",
      complete:res=>{
        console.log(res.result.data)
        this.setData({
          rmb:res.result.data
        })
      }
    })
    db.collection("lib_Loc").get().then(res=>{//get楼层信息
      // console.log(res)
      this.setData({
        libLoc:res.data
      })
      var arr=['查看全部']
      for(var i=0;i<res.data.length;i++){
        arr.push(res.data[i].lib_Level)
      }
      // console.log(arr)
      this.setData({
        placearr:arr
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