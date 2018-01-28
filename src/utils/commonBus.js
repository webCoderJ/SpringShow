function navigateToDetail(newsId, cls = 0, typesid = 0, title = "") {
  let url = "ndetail";
  if (cls == 1) {
    if (typesid == 1)
      url = "zdetail";
    else
      url = "ndetail";
  } else if (cls == 2) {
    url = "tdetail";
  } else if (cls == 3) {
    url = "vdetail";
  } else if (cls == 4) {
    url = "qdetail";
  }
  if (!!newsId) {
    wx.navigateTo({ url: '../' + url + '/spdetail?newsId=' + newsId + "&typesid=" + typesid + "&title=" + title });
  }
}
module.exports.navigateToDetail = navigateToDetail;

function ready(that, isneedlogin) {
  let app = getApp();

  let promise = new Promise(function (resolve, reject) {

    app.ajax().then(() => {
      userLogin().then((data) => {
        if (isneedlogin) {
          userRegister(data, app, that).then(() => { 
            resolve() 
            }, () => { 
          //  var info = 'scope.userInfo'
          //   wx.openSetting({
          //     success: (res) => {
          //       if (res.authSetting[info]) {
          //         ready(that, isneedlogin).then(resolve) 
          //       } else {
          //         ready(that, isneedlogin).then(resolve) 
          //       }
          //     }
          //   })
            });
        } else {
          resolve()
        }
      }, () => {
        wx.showToast({
          title: "登陆错误",
          image: '/images/fail.png'
        })
        reject();
      })
    }, () => {
      reject();
    });

  })
  return promise;
}
module.exports.ready = ready;
//设置缓存key为键，ckey为对象属性
//设置缓存key为键，ckey为对象属性
function setUserStorage(ckey, val, key = 'userinfo') {
  if (ckey) {
    let userdata = wx.getStorageSync(key);
    if (!userdata) {
      userdata = {};
    }
    userdata[ckey] = val;
    wx.setStorageSync(key, userdata)
  }
}
module.exports.setUserStorage = setUserStorage;

//删除缓存key为键，ckey为对象属性
function removeUserStorage(ckey, key = 'userinfo') {
  if (ckey) {
    let userdata = wx.getStorageSync(key);
    if (!userdata) {
      userdata = {};
    }
    userdata[ckey] = "";
    wx.setStorageSync(key, userdata)
  } else {
    wx.removeStorage({
      key: key,
      success: function (res) { }
    })
  }
}
module.exports.removeUserStorage = removeUserStorage;

//获取缓存key为键，ckey为对象属性
function getUserStorage(ckey, key = 'userinfo') {
  let userdata = wx.getStorageSync(key);
  if (ckey) {
    if (!userdata) {
      userdata = {};
    }
    return userdata[ckey];
  } else {
    return userdata
  }
}
module.exports.getUserStorage = getUserStorage;

//对数组分组func1分组条件，func2分组存的值
function arrayGroupBy(arr, func1, func2) {
  let map = {}, dest = [];
  for (var i = 0; i < arr.length; i++) {
    var ai = arr[i];
    let index = func1(ai);
    if (!map[index]) {
      dest.push({
        key: index,
        value: [func2(ai)]
      });
      map[index] = true;
    } else {
      for (var j = 0; j < dest.length; j++) {
        var dj = dest[j];
        if (dj.key == index) {
          dj.value.push(func2(ai));
          break;
        }
      }
    }
  }
  return dest;
}

module.exports.arrayGroupBy = arrayGroupBy;


function shareMsg(idx, param, title, url, iconurl) {
  let storeInfo = getUserStorage("userinfo");
  let storecofig = null;
  if (storeInfo) {
    storecofig = storeInfo.storecofig;
  }
  let model = {};
  if (storecofig && 'share' in storecofig && storecofig['share'].value.length > idx && storecofig['share'].key.IsShow == true && storecofig['share'].value[idx].IsShow == true) {
    model = storecofig['share'].value[idx];
    if (url && !model.NavigatorUrl) {
      model.NavigatorUrl = url;
    }
  } else {
    switch (idx) {
      case 0: model = { IconText: storeInfo.Name, NavigatorUrl: "/pages/index/index" }; break;
      case 1: model = { IconText: "限时优惠券速度领", NavigatorUrl: "/pages/Coupon/Coupon" }; break;
      case 2: model = { IconText: "我发现了一个很不错的商品哟", NavigatorUrl: "/pages/spdetail/spdetail?pid={0}" }; break;
      default: model = { IconText: storeInfo.Name, NavigatorUrl: "/pages/index/index" }; break;
    }
    if (url) {
      model.NavigatorUrl = url;
    }

  }
  if (title) {
    model.IconText = title;
  }
  if (iconurl) {
    model.IconUrl = iconurl;
  }
  if (param && param.length > 0) {
    param.forEach((x, index) => {
      model.NavigatorUrl = model.NavigatorUrl.replace('{' + index + '}', x);
    });
  }
  return {
    title: model.IconText,
    path: model.NavigatorUrl == '' ? "/pages/index/index" : model.NavigatorUrl,
    imageUrl: model.IconUrl,
    success: function (res) {
      wx.showToast({
        title: '转发成功',
        icon: 'success',
        duration: 1000
      })
    }
  }
}

module.exports.shareMsg = shareMsg;

var EARTH_RADIUS = 6378137.0;    //单位M
var PI = Math.PI;

function getRad(d) {
  return d * PI / 180.0;
}

function LantitudeLongitudeDist(lat1, lng1, lat2, lng2) {
  var that = this;
  var f = getRad((lat1 + lat2) / 2);
  var g = getRad((lat1 - lat2) / 2);
  var l = getRad((lng1 - lng2) / 2);

  var sg = Math.sin(g);
  var sl = Math.sin(l);
  var sf = Math.sin(f);

  var s, c, w, r, d, h1, h2;
  var a = EARTH_RADIUS;
  var fl = 1 / 298.257;

  sg = sg * sg;
  sl = sl * sl;
  sf = sf * sf;

  s = sg * (1 - sl) + (1 - sf) * sl;
  c = (1 - sg) * (1 - sl) + sf * sl;

  w = Math.atan(Math.sqrt(s / c));
  r = Math.sqrt(s * c) / w;
  d = 2 * w * a;
  h1 = (3 * r - 1) / 2 / c;
  h2 = (3 * r + 1) / 2 / s;
  var distance = (d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg))) / 1000;
  return distance.toFixed(2);

}
module.exports.LantitudeLongitudeDist = LantitudeLongitudeDist;



function getServerMsg(url, data, method, success, fail) {
  let app = getApp();
  let uid = getUserStorage('userid');
  let sid = getUserStorage('sessionid');
  wx.request({
    url: app.globalData.domainname + url + "?uid=" + uid + "&sid=" + sid,
    data: data,
    method: method,
    header: {
      'Content-Type': 'application/json'
    },
    success: function (response) {
      if (response.data.code >= 0) {
        if (success)
          success(response.data);
      } else {
        switch (response.data.code) {
          case -7: wx.redirectTo({
            url: response.data.msg,
            fail: function (res) {
              wx.switchTab({
                url: response.data.msg
              })
            }
          });
            break;
          case -6:
            wx.showToast({
              title: response.data.msg,
              image: '/images/fail.png'
            });
            setTimeout(() => {
              wx.reLaunch({
                url: "/pages/index/index"
              });
            }, 1500)
            break;
          default: wx.showToast({
            title: response.data.msg,
            image: '/images/fail.png'
          });
            if (fail)
              fail(response.data);
            break;
        }
      }
    },
    fail: function (response) {
      fail(response);
    }
  });
}
module.exports.getServerMsg = getServerMsg;


function getTimeFormat(dateStr) {
  var dateTimeStamp = Date.parse(dateStr.replace(/-/gi, '/'));
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var halfamonth = day * 15;
  var month = day * 30;
  var now = new Date().getTime();
  var diffValue = now - dateTimeStamp;
  if (diffValue < 0) {
    return;
  }
  var monthC = diffValue / month;
  var weekC = diffValue / (7 * day);
  var dayC = diffValue / day;
  var hourC = diffValue / hour;
  var minC = diffValue / minute;
  var result = "";
  if (monthC >= 1) {
    result = "" + parseInt(monthC) + "月前";
  } else if (weekC >= 1) {
    result = "" + parseInt(weekC) + "周前";
  } else if (dayC >= 1) {
    result = "" + parseInt(dayC) + "天前";
  } else if (hourC >= 1) {
    result = "" + parseInt(hourC) + "小时前";
  } else if (minC >= 1) {
    result = "" + parseInt(minC) + "分钟前";
  } else
    result = "刚刚";
  return result;
}
module.exports.getTimeFormat = getTimeFormat;
function getVideoTimeFormat(time) {
  let hour = Math.floor(time / 3600);
  let min = Math.floor(time % 3600 / 60);
  let sec = time % 3600 % 60;
  if (hour > 0) {
    return `${hour}:${min > 9 ? min : '0' + min}:${sec > 9 ? sec : '0' + sec}`;
  }
  else {
    return `${min > 9 ? min : '0' + min}:${sec > 9 ? sec : '0' + sec}`;
  }
}
module.exports.getVideoTimeFormat = getVideoTimeFormat;

function userLogin() {
  var app = getApp();
  let promise = new Promise(function (resolve, reject) {
    wx.checkSession({
      success: function () {
        //session 未过期，并且在本生命周期一直有效
        let sessionid = getUserStorage('sessionid');
        if (sessionid) {
          wx.request({
            url: app.globalData.domainname + '/api/Account/IsSessionExpire',
            data: {
              sid: sessionid
            },
            success: function (response) {
              if (response.data.code == 0) {
                resolve(sessionid);
              }
              else {
                userLogin1(resolve, reject, app, sessionid);
              }

            }, fail: function (response) {
              reject();
            }
          })

        } else {
          userLogin1(resolve, reject, app, '');
        }

      },
      fail: function () {
        userLogin1(resolve, reject, app, '');
      }
    })
  });
  return promise;

}


function userLogin1(resolve, reject, app, sid) {
  //登录态过期
  wx.login({
    success: function (res) {
      if (res.code) {

        //发起网络请求
        wx.request({
          url: app.globalData.domainname + '/api/Account/GetSessionId',
          data: {
            code: res.code,
            sid: sid,
            i:2//获得当前appid
          },
          success: function (response) {
            if (response.data.code == 0) {
              setUserStorage('sessionid', response.data.msg);
              resolve(response.data.msg);
            }
            else {
              reject();
            }

          }, fail: function (response) {
            reject();
          }
        })
      } else {
        console.log('获取用户登录态失败！' + res.errMsg);
        reject();
      }
    }
  });
}
module.exports.userLogin = userLogin;

function userRegister(data, app, that) {
  let promise = new Promise(function (resolve, reject) {
    wx.getUserInfo({
      success: function (res) {
        let userinfo = res.userInfo;
        setUserStorage('nickName', userinfo.nickName);
        setUserStorage('avatarUrl', userinfo.avatarUrl);

        userinfo.Sid = data;
        wx.request({
          url: app.globalData.domainname + '/api/Account/Login',
          method: "POST",
          header: {
            'Content-Type': 'application/json'
          },
          data: userinfo
          ,
          success: function (response) {
            if (response.statusCode >= 200 && response.statusCode < 300) {
              if (response.data.code == 0) {
                setUserStorage('userid', response.data.msg);
              } else {
                setUserStorage('userid', 0);
              }
              resolve();
            } else {
              that.setData({ isloadfail: true });
              reject();
            }
          },
          fail: function (response) {
            that.setData({ isloadfail: true });
            reject();
          }
        })
      }, fail: function (res) {      
        reject();
      }
    })
  })
  return promise;
}
module.exports.userRegister = userRegister;


//检查用户授权与引导用户授权
function makeUserAuthorize(info = 'scope.userInfo') {
  let promise = new Promise(function (resolve, reject) {
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting[info]) {
          wx.showModal({
            title: '授权',
            content: '请授权我们访问您的信息',
            success: function (res) {
              if (res.confirm) {
                wx.openSetting({
                  success: (res) => {
                    if (res.authSetting[info]) {
                      let sid = getUserStorage('sessionid');
                      let app = getApp();
                      userRegister(sid, app).then(() => {
                        resolve();
                      });
                    } else {
                      reject();
                    }
                  }
                })
              } else if (res.cancel) {
                reject();
              }
            }
          })
        } else {
          resolve();
        }
      }
    })
  })
  return promise;
}

module.exports.makeUserAuthorize = makeUserAuthorize;
function makeuserLocation(info = 'scope.userLocation'){
  let promise = new Promise(function (resolve, reject) {
    wx.getSetting({
      success: (res) => {
       
          wx.getLocation({
            type: 'wgs84',
            success: function (res) {
              var latitude = res.latitude
              var longitude = res.longitude
              setUserStorage('userLongitude', longitude);
              setUserStorage('userLatitude', latitude);
            },
            fail: function () {
              setUserStorage('userLongitude', '104.067993');
              setUserStorage('userLatitude', '30.660360');
            }
          })
        
      }
    })
  })
  return promise;
}
module.exports.makeuserLocation = makeuserLocation;
function moveCart(that, e) {
  let y = e.touches[0].clientY * 2 + 50;
  let x = e.touches[0].clientX * 2 - 50;
  let wY = getApp().globalData.systemInfo.windowHeight * 2;
  if (x < 0) {
    x = 0;
  }
  if (x > 650) {
    x = 650;
  }
  if (y < 0) {
    y = 0;
  }
  if (y > wY) {
    y = wY;
  }
  that.setData({ reloadY: wY - y, reloadX: x });
}
module.exports.moveCart = moveCart;


// 点击赞
function changeGood(e, that) {
  let cid = e.currentTarget.dataset.cid;
  if (cid) {

    let commentInfoItem = that.data.commentInfo.find(x => x.id == cid);
    if (commentInfoItem) {
      commentInfoItem.goodnum = commentInfoItem.goodnum + 1;
      commentInfoItem.isgood = true;
      let currentcomment = that.data.currentcomment;
      if (currentcomment) {
        currentcomment.goodnum = currentcomment.goodnum + 1;
        currentcomment.isgood = true;
      }
      that.setData({ commentInfo: that.data.commentInfo, currentcomment: currentcomment });

    } else {
      commentInfoItem = that.data.commentSInfo.find(x => x.id == cid);
      commentInfoItem.goodnum = commentInfoItem.goodnum + 1;
      commentInfoItem.isgood = true;

      that.setData({ commentSInfo: that.data.commentSInfo });
    }
    getServerMsg("/api/Comment/UpdateCommentGoodNum", { cid: cid }, "GET", data => { });
  } else {
    let newsid = that.data.shownewsid;
    if (newsid == -1) {
      newsid = that.data.productDetail.Newsid;
      that.data.productDetail.Goodnum = that.data.productDetail.Goodnum + 1;
      that.data.productDetail.isgood = true;
      that.setData({ productDetail: that.data.productDetail });
    } else {
      that.goodlist.push({ Bid: newsid, TypeId: 1 });
      that.setData({ isgood: true });
    }
    getServerMsg("/api/News/UpdateNewsGoodNum", { newsid: newsid }, "GET", data => { });
  }
}
module.exports.changeGood = changeGood;


// 回复评论
function writeComment(e, that) {
  let cid = e.currentTarget.dataset.cid;
  that.cid = cid;
  let str = "回复 ";
  if (cid == that.data.currentcomment.id) {
    str += that.data.currentcomment.nickname;
  } else {
    var item = that.data.commentSInfo.find(x => x.id == cid);
    if (item) {
      str += item.nickname;
    }
  }
  str += "：";
  that.setData({ placeholder: str, isfocus: true });
}
module.exports.writeComment = writeComment;

// 加载子评论
function loadSComment(mid, page = 1, that) {
  getServerMsg("/api/Comment/GetSCommentList", { mid: mid, page: page }, "GET", data => {
    let commentSInfo = data.msg.CommentList;
    that.pagemodels = data.msg.PageModel;
    commentSInfo.forEach(x => {
      x.isgood = !!that.goodlist.find(y => y.Bid == x.id && y.TypeId == 2);
      x.addtime = getTimeFormat(x.addtime);
      let pitem = commentSInfo.find(y => y.id == x.pid);
      if (pitem && pitem.levels > 1) {
        x.body += " //" + pitem.nickname + "：" + pitem.body;
      }
    });
    let currentcomment = commentSInfo.find(x => x.levels == 1);
    commentSInfo = commentSInfo.filter(x => x.levels > 1);
    that.setData({ commentSInfo: that.data.commentSInfo.concat(commentSInfo), currentcomment: currentcomment });
  });
}
module.exports.loadSComment = loadSComment;

// 发布评论
function comment(e, that) {
  if (that.isFormSubmiting) {
    wx.showToast({
      title: "正在提交中，请稍后。。。",
      image: '/images/fail.png'
    });
    return;
  }

  that.isFormSubmiting = true;
  let val = that.data.word;
  let regex = /^\s+$/;
  let cid = that.cid;
  let cls = e.currentTarget.dataset.cls;
  if (cls == 0) {
    cid = 0;
  }
  if (val && !regex.test(val)) {
    let model = { mnewsid: that.newsId, pid: cid, body: val };
    getServerMsg("/api/Comment/AddComment", model, "POST", data => {
      model.id = data.msg.Id;
      model.uid = data.msg.Uid
      model.goodnum = 0;
      model.levels = data.msg.Levels;
      model.addtime = "刚刚";
      model.mid = data.msg.Mid;
      model.nickname = getUserStorage('nickName');
      model.avatar = getUserStorage('avatarUrl');
      if (!cls) {
        that.data.commentInfo.unshift(model);
        that.setData({ commentInfo: that.data.commentInfo, Commentnum: that.data.Commentnum + 1 });
      } else {
        let pitem = that.data.commentSInfo.find(x => x.id == model.pid);
        if (pitem)
          model.body += " //" + pitem.nickname + "：" + pitem.body;
        that.data.commentSInfo.unshift(model);
        that.setData({ commentSInfo: that.data.commentSInfo, Commentnum: that.data.Commentnum + 1 });
      }
      wx.showToast({
        title: "评论成功",
        icon: 'success'
      });
      that.isFormSubmiting = false;
    }, data => {
      that.isFormSubmiting = false;

    });

  } else {
    wx.showToast({
      title: "先输入点什么吧！",
      image: '/images/fail.png'
    });
  }
}
module.exports.comment = comment;

//评论输入验证
function btntap(e, that) {
  let val = that.data.word;
  let regex = /^\s+$/;
  if (val && !regex.test(val)) {
    that.data.commentInfo.unshift({ cid: 1, avatarUrl: '../../images/userhead.png', nickName: "游客", content: val, commentnum: 0, goodnum: 0, isgood: false, time: "刚刚" });
    that.setData({ commentInfo: that.data.commentInfo });
  } else {
    wx.showToast({
      title: "先输入点什么吧！",
      image: '/images/fail.png'
    });
  }
} module.exports.btntap = btntap;
//加载评论
function loadComment(newsid, page = 1, that) {

  getServerMsg("/api/Comment/GetCommentList", { newsid: newsid, page: page }, "GET", data => {
    let commentInfo = data.msg.UserCommentList;
    commentInfo = commentInfo.concat(data.msg.CommentList);
    that.pagemodelc = data.msg.PageModel;
    commentInfo.forEach(x => {
      x.isgood = !!that.goodlist.find(y => y.Bid == x.id && y.TypeId == 2);
      x.addtime = getTimeFormat(x.addtime);
    });
    if (page == 1)
      that.setData({ commentInfo: commentInfo });
    else {
      that.setData({ commentInfo: that.data.commentInfo.concat(commentInfo) });
    }
  });
}
module.exports.loadComment = loadComment;
//收藏新增删除
function collectbtn(isdelete, that) {
  var newsid = that.newsId;
  let url = "/api/News/GetAddFavorite";
  if (isdelete)
    url = "/api/News/GetDeleteFavorite";
  let data = { newsid: newsid };
  getServerMsg(url, data, "GET", data => {
  });
}
module.exports.collectbtn = collectbtn;


function setSmallConfig(bcolor = "#166200", fcolor = "#fff", bimg = "", filter = 5, that = this) {
  let app = getApp();
  bcolor || (bcolor = "#166200");
  fcolor == "#fff" && (fcolor = "#ffffff");
  fcolor == "#000" && (fcolor = "#000000");
  fcolor == "#ffffff" || fcolor == "#000000" || (fcolor = "#ffffff");
  wx.setNavigationBarColor({
    frontColor: fcolor,
    backgroundColor: bcolor,
    animation: {
      duration: 100,
      timingFunc: 'easeIn'
    }
  })
  app.globalData.bcolor = bcolor;
  app.globalData.fcolor = fcolor;
  app.globalData.filter = filter;
  that.setData({ bimg: bimg, filter: filter });
  app.globalData.bimg = bimg;

}
module.exports.setSmallConfig = setSmallConfig;

function getImgUrlFromHtml(body, imgurl = "") {
  var regex = /<img[\S\s]+?src[\s]*=[\s]*['"]([^\"]*?)['"]/gi;
  var imgmacths;
  let app = getApp();
  let imgUrlArr = [];
  if (imgurl) {
    if (imgurl.startsWith('http'))
      imgUrlArr.push(imgurl);
    else
      imgUrlArr.push(app.globalData.imgcdn + '/upload/news/' + imgurl);
  }
  while ((imgmacths = regex.exec(body)) != null) {
    let tempimgurl = imgmacths[1];
    let imgurls = imgurl.split('/');
    if (imgurl && tempimgurl.indexOf(imgurls[imgurls.length - 1]) > -1)
      continue;
    if (tempimgurl.startsWith('http'))
      imgUrlArr.push(tempimgurl);
    else
      imgUrlArr.push(app.globalData.imgcdn + '/upload/news/' + tempimgurl);
  }
  return imgUrlArr;
}
module.exports.getImgUrlFromHtml = getImgUrlFromHtml;