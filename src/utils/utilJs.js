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
  return distance(ox, oy, x1, y1) / distance(ox, oy, x2, y2)
}

// 返回余弦角度
let cosDeg = (a, b, c) => {
  console.log('旋转角度...', (180 / Math.PI) * Math.acos((a * a + b * b - c * c) / (2 * a * b)))
  return (180 / Math.PI) * Math.acos((a * a + b * b - c * c) / (2 * a * b))
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
  scale,
  distance,
  cosDeg,
  deepClone
}
