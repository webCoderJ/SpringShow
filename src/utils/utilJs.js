let touchInfo = (e) => {
  let info = e.currentTarget.id.split('-')
  let touch = {
    type: info[0],
    index: info[1],
    point: e.touches[0],
    coorX: e.currentTarget.offsetLeft,
    coorY: e.currentTarget.offsetTop,
  }
  // console.log('____touchInfo____', touch)
  return touch
}
// 两点距离
let distance = (x1, y1, x2, y2) => Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2))
let radianToDeg = (rad) => (180 / Math.PI) * rad
// 两点角度
let atan2Radian = (ox, oy, x, y) => {
  return Math.atan2(y - oy, x - ox)
}
// 相对某点的相对坐标
let realCoor = (ox, oy, x, y) => [x - ox, y - oy]
// 对角线
let string = (w, h) => Math.sqrt(w * w + h * h)
// 根据对角线与勾股比计算宽度
let stringWH = (slicer) => {
  slicer.string = string(
    slicer.curX,
    slicer.curY,
    slicer.centerX,
    slicer.centerY
  );
  // whRatio
  let w = Math.sqrt(Math.pow(slicer.string, 2) / (1 + Math.pow(slicer.whRatio, 2)))
  return {
    string: slicer.string,
    h: w / slicer.whRatio,
    w: w
  }
}
let scale = (ox, oy, x1, y1, x2, y2) => {
  // console.log('scale', distance(ox, oy, x1, y1) / distance(ox, oy, x2, y2))
  return distance(ox, oy, x2, y2) / distance(ox, oy, x1, y1)
}
// 返回余弦角度
let cosDeg = (a, b, c) => {
  console.log('[旋转角度]', (180 / Math.PI) * Math.acos((a * a + b * b - c * c) / (2 * a * b)))
  return (180 / Math.PI) * Math.acos((a * a + b * b - c * c) / (2 * a * b))
}
// 返回两个坐标点的夹角
let angle = (x1, y1, x2, y2) => {
  console.log('[旋转角度]', Math.abs(Math.atan(y2 / x2) - Math.atan(y1 / x1)) * (180 / Math.PI))
  return (Math.abs(Math.atan(y2 / x2) - Math.atan(y1 / x1))) * (180 / Math.PI)
}

function deepClone(obj) {
  var newObj
  if (obj instanceof Array) {
    newObj = []
    obj.forEach(item => {
      newObj.push(deepClone(item))
    })
    return newObj
  }
  else if (obj instanceof Object) {
    newObj = {}
    for (var key in obj) {
      newObj[key] = deepClone(obj[key])
    }
    return newObj
  }
  else {
    return obj
  }
}

let initData = (ctx) => {
  ctx.deviceH = ctx.$parent.globalData.deviceH
  ctx.deviceW = ctx.$parent.globalData.deviceW
  ctx.imgcdn = ctx.$parent.globalData.imgcdn
  ctx.domainname = ctx.$parent.globalData.domainname
  ctx.userInfo = ctx.$parent.globalData.userInfo
}

module.exports = {
  touchInfo,
  string,
  stringWH,
  scale,
  distance,
  cosDeg,
  deepClone,
  realCoor,
  angle,
  atan2Radian,
  radianToDeg,
  initData
}

// 封装loading模块
let loader = {
  show: function (context) {
    wx.showLoading({
      title: '加载中',
    })
  },
  hide: function (context) {
    wx.hideLoading()
    if (context) {
      context.setData({
        isLoading: false
      })
    }
  }
}

module.exports.loader = loader

function pull(url, method, params) {
  loader.show()
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: params,
      method: method,
      header: {
        //'Content-Type': 'application/json'
      },
      success: function (res) {
        loader.hide()
        console.log("success")
        resolve(res)
      },
      fail: function (res) {
        loader.hide()
        reject(res)
        console.warn("failed", res)
      }
    })
  })
}
// 封装HTTP模块
module.exports.http = {
  get: function (url, params) {
    return pull(url, 'GET', params)
  },
  post: function (url, params) {
    return pull(url, 'POST', params)
  }
}
module.exports.tools = {
  showErr: function (msg, callback) {
    wx.showModal({
      content: msg,
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          callback && callback()
        }
      }
    });
  },
  confirm: function (params, confirm, cancel) {
    let options = Object.assign({
      title: '',
      content: '',
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          confirm && confirm()
        } else {
          cancel && cancel()
        }
      }
    }, params)
    wx.showModal(options);
  },
}

const AudioStack = []
module.exports.play = function (url) {
  AudioStack.forEach(item => {
    wx.hideLoading()
    item.stop()
      item.destroy()
    
  })
  let innerAudioContext = wx.createInnerAudioContext()
  AudioStack.push(innerAudioContext)
  innerAudioContext.autoplay = true
  innerAudioContext.src = url
  innerAudioContext.loop=true
  innerAudioContext.onWaiting(() => {
    loader.show()
    console.log('[Audio] 加载中')
  })
  innerAudioContext.onPlay(() => {
    wx.hideLoading()
    console.log('[Audio] 开始播放')
  })
  innerAudioContext.onError((res) => {
    console.log('[Audio] 播放错误', res.errMsg, res.errCode)
    wx.hideLoading()
    AudioStack.forEach(item => {  
       item.stop()
      item.destroy()
    })
  })
}

module.exports.stop = function (play,musicInfo) {
  AudioStack.forEach(item => {
    wx.hideLoading()
    if(item.src!=null&&item.src.indexOf(musicInfo.url)>0)
    {
   
    if(play)
    {
      item.play()
    }else{
    
      item.pause()
    }
  }
   
  })
}
module.exports.destroy = function (play,musicInfo) {
  AudioStack.forEach(item => {
    item.stop()
    item.destroy()
  })
}

module.exports.getUserInfo = () => {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success(res){
        resolve(res.userInfo)
      }
    })
  })
}

module.exports.asyncGetImageInfo = (path) => {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: path,
      success(res){
        resolve(res)
      }
    })
  })
}