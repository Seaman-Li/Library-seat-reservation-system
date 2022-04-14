// pages/reservation/reservation.js
const db=wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:0,//placearr下标
    placearr:['南湖一楼','南湖二楼'],//图书馆楼层placearr
    rmod:0,  //modarr下标,预约状态yyzt
    modarr:[['查看全部', 0], ['已预约', 1], ['可预约', 2], ['不可预约', 3]],//状态栏ztarr
    seatarry:'',//座位信息列表rmb
    libLoc:'',//楼层tswz
    timeInfo:[["时间段1:8:00-9:30", 0], ["时间段2:9:30-11:00", 1], ["时间段3:11:00-12:30", 2], ["时间段4:12:30-2:00", 3], ["时间段5:2:00-4:00", 4]],//时间段sjxx
    timeIndex:0,//timeInfo下标sjxxindex
    timemod:'',//时间状态sjzt
    levelname:'',//楼层选择wzxz
    levid:''//楼层id lcid
  },
  bindPickerChangeplace:function(e) {
    console.log(e.detail.value)
    this.setData({
      index:e.detail.value,
      levelname:this.data.placearr[e.detail.value]
    })
  },
  bindPickerChangetime: function (e) {
    console.log(e.detail.value)
    this.setData({
      timeIndex:e.detail.value,
    })
    // this.getList()
    this.zslb()
  },
  bindPickerChangemod:function(e){
    console.log(e.detail.value)
    this.setData({
      rmod:e.detail.value,
      // rmod:5//'查看全部'设定为5,避免重复查询
    })
    this.zslb()
    // if(e.detail.value==0){//modarr==0查看全部
    //   wx.cloud.callFunction({
    //     name:"getseat",
    //     complete:res=>{
    //       console.log(res.result.data)
    //       this.setData({
    //         seatarry:res.result.data
    //       })
    //     }
    //   })
    // }else if(e.detail.value==1){//modarr==1已预约
    //   this.setData({
    //     rmod:2
    //   })
    // }else if(e.detail.value==2){//modarr==2暂未预约可预约
    //   this.setData({
    //     rmod:0
    //   })
    // }else{//modarr==3不可预约
    //   this.setData({
    //     rmod:1
    //   })
    // }
    // if(this.data.rmod!=5){
    //   var mod=this.data.rmod
    //   db.collection("lib_Seat").where({seatmod:mod}).get().then(res=>{//get要查询的座位状态rmod和数据库中seatmod一致的座位信息
    //     console.log(res)
    //     this.setData({
    //       seatarry:res.data
    //     })
    //   })
    // }
  },
  zslb(){
    if(this.data.timeIndex != '' && this.data.levelname == 0 && this.data.rmod == 0){
      console.log("$")
      wx.cloud.callFunction({//云函数getseat
        name:"getseat",
        complete:res=>{
          for(let i=0;i<res.result.data.length;i++){
            res.result.data[i].seatmod=res.result.data[i].orderTime[this.data.timeIndex][0]
            this.setData({
              seatarry:res.result.data
            })
          }
        }
      })
    }else if(this.data.timeIndex != ''&& this.data.levelname == 0 && this.data.rmod != 0){
      console.log("$$")
      wx.cloud.callFunction({//云函数getseat
        name:"getseat",
        complete:res=>{
          for(let i=0;i<res.result.data.length;i++){
            res.result.data[i].seatmod=res.result.data[i].orderTime[this.data.timeIndex][0]
            console.log(res.result.data[i].seatmod)
            var tempseatmod=0//临时seatmod
            if(this.data.rmod==1){
              tempseatmod=2
            }else if(this.data.rmod==2){
              tempseatmod=0
            }else{
              tempseatmod=1
            }
            if(res.result.data[i].seatmod != tempseatmod){
              // console.log("不一样")
              res.result.data[i].mod=0
            }
            this.setData({
              seatarry:res.result.data
            })
          }
        }
      })
    }else if(this.data.timeIndex != ''&& this.data.levelname != 0 && this.data.rmod == 0){
      console.log("$$$")
      for(let i=0;i<this.data.libLoc.length;i++){
        if(this.data.libLoc[i].lib_Level==this.data.levelname){
          console.log(this.data.libLoc[i]._id)
          var levid=this.data.libLoc[i]._id
          this.setData({
            levid:this.data.libLoc[i]._id
          })
        }
        wx.cloud.callFunction({//云函数getseat
          name:"getseat",
          complete:res=>{
            for(let i=0;i<res.result.data.length;i++){
              res.result.data[i].seatmod=res.result.data[i].orderTime[this.data.timeIndex][0]
              if(this.data.levid!=res.result.data[i].level){
                res.result.data[i].mod=0
              }
              this.setData({
                seatarry:res.result.data
              })
            }
          }
        })
      }
    }else{
      
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // db.collection("lib_Seat").get().then(res=>{
    //   console.log(res)
    //   this.setData({
    //     seatarry:res.data
    //   })
    // })
    wx.cloud.callFunction({//云函数getseat
      name:"getseat",
      complete:res=>{
        for(let i=0;i<res.result.data.length;i++){
          res.result.data[i].seatmod=res.result.data[i].orderTime[this.data.timeIndex][0]
          this.setData({
            seatarry:res.result.data
          })
        }
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
  getList(){//数据刷新
    wx.cloud.callFunction({
      name:"getseat",
      complete:res=>{
        for(let i=0;i<res.result.data.length;i++){
          res.result.data[i].seatmod=res.result.data[i].orderTime[this.data.timeIndex][0]
          this.setData({
            seatarry:res.result.data
          })
        }
        // console.log(res.result.data)
        // wx.stopPullDownRefresh()
        // this.setData({
        //   seatarry:res.result.data
        // })
      }
    })
  },
  showReservation(e){
    db.collection("lib_Seat").doc(e.currentTarget.id).get().then(res=>{
      res.data.seatmod=res.data.orderTime[this.data.timeIndex][0]
      console.log(res.data.seatmod)
      if(res.data.seatmod==0){//座位状态为可预约才能跳转到预约页面
        wx.navigateTo({
          url: '../reservation/reservation?list_id='+e.currentTarget.id+"&timeID="+this.data.timeIndex,
        })
      }else{
        wx.showToast({
          title: '此座位不可预约',
          icon:'error',
          duration:1000
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
    console.log("显示了")
    this.getList();
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
    this.getList()//下拉刷新
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