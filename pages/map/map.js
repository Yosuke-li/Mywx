// pages/map/map.js
var week = require('../../utils/week.js');
var Da = require("../../utils/fun.js");
var Public = require("../../utils/pubic.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false ,
    date: '',
    arrlocal: '',
    todayClass: [],
    local1:{},
    local2: {},
    local3: {},
    animationData:{},
    markers: []
  },
  /**
   * 课程任务查看
   */
  checkclass: function() {
    var that = this
    var arrdata = []
    for (var id = 0; id < that.data.todayClass.length; id++) {
      var classroom = that.data.todayClass[id].classroom
      console.log(classroom)
      if (classroom.length == 4) {
        var strclass = classroom.substring(0, 1)
        if (strclass == 'T' || strclass == 'S' || strclass == 'U') {
          /**
           * STU教学楼
           */
          that.data.local1 = {
            iconPath: "../../img/renwu.png",
            id: id,
            classname: that.data.todayClass[id].classname,
            classroom: that.data.todayClass[id].classroom,
            class: that.data.todayClass[id].class,
            teacher: that.data.todayClass[id].teacher,
            latitude: 23.4520,
            longitude: 113.49359,
            width: 25,
            height: 45,
          } 
          arrdata.push(that.data.local1)
        }
        /**
           * E型教学楼
           */
        else if (strclass == 'A' || strclass == 'B' || strclass == 'C' || strclass == 'D' || strclass == 'E') {
          that.data.local2 = {
            iconPath: "../../img/renwu.png",
            id: id,
            classname: that.data.todayClass[id].classname,
            classroom: that.data.todayClass[id].classroom,
            class: that.data.todayClass[id].class,
            teacher: that.data.todayClass[id].teacher,
            latitude: 23.4504,
            longitude: 113.49302,
            width: 25,
            height: 45,
          } 
          arrdata.push(that.data.local2)
        }
      }
      else if (classroom.length == 5) {
        var strclass = classroom.substring(0, 2)
        /**
         * S2教学楼
         */
        if (strclass == 'S2') {
          that.data.local3 = {
            iconPath: "../../img/renwu.png",
            id: id,
            classname: that.data.todayClass[id].classname,
            classroom: that.data.todayClass[id].classroom,
            class: that.data.todayClass[id].class,
            teacher: that.data.todayClass[id].teacher,
            latitude: 23.45028,
            longitude: 113.49338,
            width: 25,
            height: 45,
          }
          arrdata.push(that.data.local3)
        }
      }
    }
    that.setData({
      markers:arrdata
    })
    console.log(this.data.markers)
  },
  /**
   * markerId点击事件
   */
  markertap(e) {
    var that = this
    var arrlocal = []
    var latitude =  this.data.markers[e.markerId].latitude
    var longitude = this.data.markers[e.markerId].longitude
    for (var i = 0; i < this.data.markers.length; i++){
      if (latitude == this.data.markers[i].latitude && longitude == this.data.markers[i].longitude){
        var loaclclass = {
          classname: that.data.todayClass[i].classname,
          classroom: that.data.todayClass[i].classroom,
          class: that.data.todayClass[i].class,
          teacher: that.data.todayClass[i].teacher,
        }
        arrlocal.push(loaclclass)
      }
    }
    this.setData({
      arrlocal: arrlocal,
      showModal: true
    })
    console.log(this.data.arrlocal)
  },
  go: function () {
    this.setData({
      showModal: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      date: week.getDates(1)[0].week
    })
    this.checkweek()

  },

  checkweek: function() {
    if (this.data.date == '周一') {
      this.data.date = 'row1'
    } else if (this.data.date == '周二') {
      this.data.date = 'row2'
    } else if (this.data.date == '周三') {
      this.data.date = 'row3'
    } else if (this.data.date == '周四') {
      this.data.date = 'row4'
    } else if (this.data.date == '周五') {
      this.data.date = 'row5'
    } else {
      this.data.date = null
    }

    console.log(this.data.date)
  },
  /**
   * 首页判断
   */
  modalTap: function(e) {
    wx.showModal({
      title: "提示",
      content: "您需要登陆后才能看到课表",
      success: function(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../login/login',
          })
        } else {
          console.log('弹框后点取消')
        }
      }
    })
  },

  onShow: function() {
    var a = wx.getStorageSync('id')
    if (a != '') {
      var that = this
      wx.request({
        // url: 'http://localhost:8080/login2.3/newphp/new.php',
        url: Da.dataUrl + '?r=my/acgedular',
        data: {
          schoolyear: 2016,
          semester: 2
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
          // 'Content-Type': 'application/json'
        },
        method: 'POST',
        success: function(res) {
         
          that.setData({
            scge: res.data,
          })
          var a = []
          for (var i = 0; i < res.data.time.length; i++) {
            for (var y = 0; y < res.data.time[i].length; y++) {
              if (res.data.time[i][y].day == that.data.date && res.data.time[i][y].class != null) {
                a.push(res.data.time[i][y])
              }
            }
          }
          that.setData({
            todayClass: a
          })
          console.log(that.data.todayClass)
        },
        fail: function(res) {
          console.log(res.data)
        },
        complete: function(res) {},
      })

    } else {
      this.modalTap()
    }
  },
  rotateThenScale: function () {
    // 先旋转后放大
    
  }
})