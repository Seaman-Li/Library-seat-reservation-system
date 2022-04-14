// pages/alterprofile/alterprofile.js
const db=wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    userInfo:'',
    gra_array:["大一","大二","大三","大四","研究生","带专","已毕业"],
    col_array:["计算机与人工智能学院","经济学院","管理学院","材料学院","土建学院","机电学院","资源与环境工程学院","理学院","汽车学院","马克思主义哲学学院"],
    gra_index:0,
    col_index:0
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
    db.collection("user").where({openid:this.data.openid}).get().then(res=>{
      console.log(res.data)
      this.setData({
        userInfo:res.data
      })
      console.log(this.data.userInfo[0].grade)
      for(let i=0;i<this.data.gra_array.length;i++){
        if(this,this.data.gra_array[i]==this.data.userInfo[0].grade){
          console.log(i)
          this.setData({
            gra_index:i
          })
        }
      }
      for(let i=0;i<this.data.col_array.length;i++){
        if(this,this.data.col_array[i]==this.data.userInfo[0].college){
          console.log(i)
          this.setData({
            col_index:i
          })
        }
      }
    })
  },
  bindchangecol:function(e){
    // console.log(e.detail.value)
    this.setData({
      col_index:e.detail.value
    })
  },
  bindchangegra:function(e){
    // console.log(e.detail.value)
    this.setData({
      gra_index:e.detail.value
    })
  },
  formSubmit(e){
    console.log(e.detail.value)
    db.collection("user").where({openid:this.data.openid}).update({
      data:{
        grade:this.data.gra_array[this.data.gra_index],
        phone:e.detail.value.phone,
        username:e.detail.value.name,
        college:this.data.col_array[this.data.col_index],
        stuID:e.detail.value.stuID,
        _updateTime:Date.parse(new Date()),
      },
      success:function(res){
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 1500,
          success:function(){
            wx.navigateTo({
              url: '../profile/profile',
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