$(function() {
  var map = new BMap.Map("map");
  var marker = '';
  var jdget = localStorage.getItem("sjzpGeolocationJD");
  var wdget = localStorage.getItem("sjzpGeolocationWD");
  var geoLocation = new BMap.Geolocation();
  if(jdget == "" || jdget == null || jdget == "null") {
    geoLocation.getCurrentPosition(function(p) {
      jdget = p.point.lng;
    })
  } else {
    jdget = localStorage.getItem("sjzpGeolocationJD");
  }
  if(wdget == "" || wdget == null || wdget == "null") {
    geoLocation.getCurrentPosition(function(p) {
      wdget = p.point.lat;
    })
  } else {
    wdget = localStorage.getItem("sjzpGeolocationWD");
  }

  var centPoint = { //中心点
    lng: jdget,
    lat: wdget
  }
  map.centerAndZoom(new BMap.Point(centPoint.lng, centPoint.lat), 18); // 初始化地图,设置中心点坐标和地图级别
  map.enableScrollWheelZoom(); //启用滚轮放大缩小
  map.disableContinuousZoom(); //禁用连续缩放
  map.disableInertialDragging(); //禁用惯性拖拽
  map.setDefaultCursor('crosshair');
  var pt = new BMap.Point(centPoint.lng, centPoint.lat);
  var myIcon = new BMap.Icon("images/markers.png", new BMap.Size(23, 25), {
    offset: new BMap.Size(10, 25), // 指定定位位置  
    imageOffset: new BMap.Size(0, 0 - 10 * 25) // 设置图片偏移  
  });
  var marker2 = new BMap.Marker(pt, {
    icon: myIcon
  }); // 创建标注
  map.addOverlay(marker2); // 将标注添加到地图中
  $('#longitude').text(Number(centPoint.lng).toFixed(6));
  $('#latitude').text(Number(centPoint.lat).toFixed(6));
  /*var sContent = '经度 '+centPoint.lng + ";<br/>"+"纬度 "+centPoint.lat;
  var infoWindow = new BMap.InfoWindow(sContent);  // 创建信息窗口对象
  map.openInfoWindow(infoWindow,new BMap.Point(centPoint.lng, centPoint.lat)); //开启信息窗口*/
  var local = new BMap.LocalSearch(map, {
    renderOptions: {
      map: map
    }
  });

  // 添加带有定位的导航控件
  /*	var navigationControl = new BMap.NavigationControl({
  		offset: new BMap.Size(0, 120),
  		// 靠左上角位置
  		anchor: BMAP_ANCHOR_BOTTOM_LEFT,
  		// LARGE类型
  		type: BMAP_NAVIGATION_CONTROL_LARGE,
  		// 启用显示定位
  		enableGeolocation: true
  	});

  	map.addControl(navigationControl);*/

  //var opts = {offset: new BMap.Size(300, 5)}
  //map.addControl(new BMap.ScaleControl(opts));

  //var myCity = new BMap.LocalCity();
  //var myGeo = new BMap.Geocoder(); //城市转换经纬度
  //myCity.get(myFun);
  $(function() {
    //document.getElementById("keywords").focus();

    initEvents();
  });

  function myFun(result) {
    var cityName = result.name;
    map.setCenter(cityName);
    //城市转换经纬度
    /*    myGeo.getPoint(cityName, function(point) {
            if(point) {
                //alert(point.lng + "," + point.lat)
                $('#longitude').text(point.lng);
                $('#latitude').text(point.lat);
            } else {
                $('#longitude').text(0);
                $('#latitude').text(0);
            }
        });*/
  }

  function initEvents() {
    $('body')
      //选择
      .on('tap', '.filter-item', function() {
        $(this).toggleClass('mui-icon-checkmarkempty');
      })
      //确定
      .on('tap', '#btn_done', function() {
        //两次之间的差距
        var gap = getDistance(localStorage.getItem("sjzpGeolocationJD"), localStorage.getItem("sjzpGeolocationWD"), $('#longitude').text(), $('#latitude').text()).toFixed(2);
        //确认框, 确认是否
        mui.confirm('\n 图片坐标: \n' + localStorage.getItem("sjzpGeolocationJD") + ', \n' + localStorage.getItem("sjzpGeolocationWD") + ' \n\n 定位坐标: \n' + $('#longitude').text() + ', \n' + $('#latitude').text() + '\n\n 坐标误差: ' + gap + '米 \n \n 纠正后将以图片坐标为准\n','坐标纠正', ["否", "是"], function(e) {
          if(e.index == 1) {
            if(marker) {
              localStorage.setItem("drsSelJD", marker.point.lng);
              localStorage.setItem("drsSelWD", marker.point.lat);
            } else {
              localStorage.setItem("drsSelJD", centPoint.lng);
              localStorage.setItem("drsSelWD", centPoint.lat);
            }
            /*setTimeout(function() {
                localStorage.setItem("clearJDWD", "0");
                Android.closeActivity();
            }, 500);*/

            if(marker) {
              //触发父页面自定义事件（getLocation）,传递数据
              var location = {
                lng: marker.point.lng,
                lat: marker.point.lat
              }
              mui.fire(plus.webview.getWebviewById('device-add.html'), 'getLocation', location);
            } else {
              var location = {
                lng: $('#longitude').text(),
                lat: $('#latitude').text()
              }
              mui.fire(plus.webview.getWebviewById('device-add.html'), 'getLocation', location);
            }
            mui.back();
          }
        })//--END mui.confirm--
        
        
        
        
        
        
      })
      //返回
      /*.on('tap', '#locationBack', function() {
          localStorage.setItem("clearJDWD", "0");
          Android.closeActivity();
      })*/
      //搜索
      .on('tap', '#mapSearch', function() {
        var keyVal = $("#keywords").val();
        map.setCurrentCity(keyVal);
        local.search(keyVal);
      })

    //单击获取点击的经纬度
    map.addEventListener("touchend", function(e) {
      map.clearOverlays();
      marker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat));
      marker.enableDragging();
      map.addOverlay(marker);
      $('#longitude').text(marker.point.lng);
      $('#latitude').text(marker.point.lat);
      $('#keywords').blur();

      var pt = new BMap.Point(centPoint.lng, centPoint.lat);
      var myIcon = new BMap.Icon("images/markers.png", new BMap.Size(23, 25), {
        offset: new BMap.Size(10, 25), // 指定定位位置  
        imageOffset: new BMap.Size(0, 0 - 10 * 25) // 设置图片偏移  
      });
      var marker2 = new BMap.Marker(pt, {
        icon: myIcon
      }); // 创建标注
      map.addOverlay(marker2); // 将标注添加到地图中
    });
  }
})

//--------
//
function bd_encrypt(gg_lat, gg_lon) {
  var bd_lat;
  var bd_lon;
  var x = gg_lon;
  var y = gg_lat;
  var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
  var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
  bd_lon = z * Math.cos(theta) + 0.0065;
  bd_lat = z * Math.sin(theta) + 0.006;
  localStorage.setItem("sjzpGeolocationJD", bd_lat);
  localStorage.setItem("sjzpGeolocationWD", bd_lon);
}

//
function JDWDDisparity() {
  //如果定位失败直接返回
  if(localStorage.getItem("sjzpGeolocationJD") == '' || localStorage.getItem("sjzpGeolocationWD") == '') {
    mui.toast("请打开GPS定位")
    return;
  }
  //坐标转换

  //使用并保留小数点后两位
  var gap = getDistance(localStorage.getItem("sjzpGeolocationJD"), localStorage.getItem("sjzpGeolocationWD"), localStorage.getItem("drsSelJD"), localStorage.getItem("drsSelWD")).toFixed(2);
  var btnArray = ['否', '是'];
  mui.confirm('\n 图片坐标: \n' + localStorage.getItem("sjzpGeolocationJD") + ', \n' + localStorage.getItem("sjzpGeolocationWD") + ' \n\n 定位坐标: \n' + localStorage.getItem("drsSelJD") + ', \n' + localStorage.getItem("drsSelWD") + '\n\n 坐标误差: ' + gap + '米 \n \n 纠正后将以图片坐标为准\n', '坐标纠正', btnArray, function(e) {
    if(e.index == 1) {
      //获取经度
      captureLONG = parseFloat(localStorage.getItem("sjzpGeolocationJD")).toFixed(6);
      //获取纬度
      captureLAT = parseFloat(localStorage.getItem("sjzpGeolocationWD")).toFixed(6);
      $("#JD").val(captureLONG);
      $("#WD").val(captureLAT);
      localStorage.setItem("drsSelJD", localStorage.getItem("sjzpGeolocationJD"));
      localStorage.setItem("drsSelWD", localStorage.getItem("sjzpGeolocationWD"));
      return false;
    } else {
      return;
    }
  })
}

//
function OD(a, b, c) {
  while(a > c) a -= c - b;
  while(a < b) a += c - b;
  return a;
}

//
function SD(a, b, c) {
  b != null && (a = Math.max(a, b));
  c != null && (a = Math.min(a, c));
  return a;
}

//
function getDistance(a_lat, a_lng, b_lat, b_lng) {
  var a = Math.PI * OD(a_lat, -180, 180) / 180;
  var b = Math.PI * OD(b_lat, -180, 180) / 180;
  var c = Math.PI * SD(a_lng, -74, 74) / 180;
  var d = Math.PI * SD(b_lng, -74, 74) / 180;
  return 6370996.81 * Math.acos(Math.sin(c) * Math.sin(d) + Math.cos(c) * Math.cos(d) * Math.cos(b - a));
}
//--------