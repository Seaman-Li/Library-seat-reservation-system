// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:'cloud1-6gqpznkza3622080'
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  var text = event.openid
  return await db.collection('seat_Info').aggregate().match({openid:text})
  .lookup({
    from:'lib_Seat',
    localField:'seat',
    foreignField:'_id',
    as:'seatInfolist'
  })
  .sort({
    _updateTime:-1//倒序
  })
  .end()
}