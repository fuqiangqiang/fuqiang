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
	var marker2 = new BMap.Marker(pt,{icon:myIcon});  // 创建标注
	map.addOverlay(marker2);              // 将标注添加到地图中
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
				}else{
					var location = {
						lng: $('#longitude').text(),
						lat: $('#latitude').text()
					}
					mui.fire(plus.webview.getWebviewById('device-add.html'), 'getLocation', location);
				}
				mui.back();
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
			var marker2 = new BMap.Marker(pt,{icon:myIcon});  // 创建标注
			map.addOverlay(marker2);              // 将标注添加到地图中
		});
	}
})