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

// 对角线
let string = (w, h) => Math.sqrt(w * w + h * h)
// 根据对角线与勾股比计算宽度
let stringWH = (slicer) => {
  // whRatio
  let h = Math.sqrt(Math.pow(slicer.string, 2) / (1 + Math.pow(slicer.whRatio, 2)))
  return {
    w: h / slicer.whRatio,
    h: h
  }
}
// 两点距离
let distance = (x1, y1, x2, y2) => Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2))
// 返回余弦角度
let cosDeg = (a, b, c) => {
  console.log(Math.acos((a * a + b * b - c * c) / (2 * a * b)))
  return (Math.PI) * Math.acos((a * a + b * b - c * c) / (2 * a * b))
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
module.exports = {
  touchInfo,
  string,
  stringWH,
  distance,
  cosDeg,
  deepClone
}
