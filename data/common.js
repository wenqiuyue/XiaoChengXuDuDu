//全局的js
//对外提供接口
module.exports = {
  switch_huyan: switch_huyan,//护眼模式
}

//本地保存的数据的key
function switch_huyan(e){
    if (e.detail.value == true) {
    console.log(e.detail.value)
    this.setData({
      className: 'shade'
    })
  }
  if (e.detail.value == false) {
    console.log(e.detail.value)
    this.setData({
      className: 'none'
    })
  }
}