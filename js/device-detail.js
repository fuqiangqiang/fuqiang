var allgldw = []; //管理单位数据
var regionArray = [];
var regionText = ''
mui.plusReady(function() {
	mui.init({
		beforeback: function() {
			//			mui.fire(plus.webview.getWebviewById('device-uncommitted.html'), 'showsearch', {});
			mui.fire(plus.webview.getWebviewById('barcode.html'), 'resetBarcode', {});
		}
	});
	getGldw();
	var self = plus.webview.currentWebview();
	var id = self.de_id;
	var sbbm = self.de_sbbm;
	var shztStauts = self.de_status;
	/*获取布局信息*/
	mui.ajax(app.host + '/deviceDictionary/getDeviceDictonary', {
		dataType: 'json',
		type: 'get',
		timeout: 10000,
		success: function(msg) {
			//渲染模板
			$('.mui-content').html(template('device_add_wind', msg.data));
			var dataArray = [];
			$.each(msg.data, function(idx, val) {
				$.each(val.dictionaryDetails, function(i, value) {
					dataArray.push({
						type: value.type,
						value: value.value,
						text: value.name
					})
				})
			});
			/*数据填充*/
			getDeviceData(sbbm, shztStauts, dataArray)
		},
		error: function(xhr, type, errorThrown) {}
	});
})

function getRegionName(code) {
	//Level-1 循环省份
	for(var i = 0; i <= cityData3.length - 1; i++) {
		if(cityData3[i].value == code.substr(0, 2) + '0000') {
			regionArray.push(cityData3[i].text);
		}

		//Level-2 循环城市
		for(var j = 0; j < cityData3[i].children.length; j++) {
			if(cityData3[i].children[j].value == code.substr(0, 4) + '00') {
				regionArray.push(cityData3[i].children[j].text);
			}

			//筛选第二级(城市)非 undefined.
			if('undefined' != typeof cityData3[i].children[j].children) {
				//Level-3 第三级循环
				for(var m = 0; m < cityData3[i].children[j].children.length; m++) {
					if(cityData3[i].children[j].children[m].value == code) {
						regionArray.push(cityData3[i].children[j].children[m].text);
						regionText = regionArray.join('-');//格式化显示
//						console.log(regionText);
						return
					}
				} //--END Level-3 第三级循环 --
			} //--END 二级非 undefined

		} //--END Level-2 循环城市--
	} //--END Level-1 循环省份--
} //--END getRegionName

/*数据获取函数*/
function getDeviceData(sbbm, shztStauts, dataArray) {
	mui.ajax(app.host + '/VIID/Camera.action?SBBM=' + sbbm + "&shzt=" + shztStauts, {
		dataType: 'json', //服务器返回json格式数据
		type: 'get', //HTTP请求类型
		headers: {
			'Content-Type': 'application/json'
		},
		success: function(data) {
			var chooseall = [];
			$.each(data, function(idx, val) {
				//详情图片显示. 当有图片时, 进行展示.
				//console.log("data-idx: " + idx + '----------' + val)
				if(typeof $('#' + idx).attr("imgname") != "undefined") {
					if($('#' + idx).attr("imgname") === idx) {
						mui.each(val, function(index, value) {
							$('#' + idx).append('<div class="imagesBox">' +
								'<img id="' + value.id + '" class="uploaded-images" style="width: 64px;height: 64px;" src="' + app.host + value.url + '"/>' +
								'</div>')
						})
					}
				}

				//条件判断: 下拉框, 三级联动, 多选项
				if($("input[name='" + idx + "']").hasClass("wind-content-input-select") ||
					$("input[name='" + idx + "']").hasClass("wind-content-input-choose")) {
					if($("input[name='" + idx + "']").attr("namedep") === "department") {
						//所有管理单位
						$.each(allgldw, function(index, value) {
							if(val == value.value) {
								$("input[name='" + idx + "']").val(value.text);
							}
						})
					} else {
						$.each(dataArray, function(index, value) {
							//							console.log("我的index: " + index + "我的Value: " + JSON.stringify(value));
							if($("input[name='" + idx + "']").hasClass("wind-content-input-choose")) {

								if(idx == value.type) {
									$.each(val.split("/"), function(i, v) {
										if(v == value.value) {
											chooseall.push(value.text);
										}
									});
									$("input[name='" + idx + "']").val(chooseall.join("/"));
								}
							} else if(idx == value.type && val == value.value) {
								$("input[name='" + idx + "']").val(value.text);
							}
						});
					}
				} else if($("input[name='" + idx + "']").hasClass("wind-content-input-radiodetail")) {
					var valValue = val == 0 ? "已联网" : "未联网";
					$("input[name='" + idx + "']").val(valValue)
				} else {
					if(idx == "XZQY") {
						getRegionName(val);//得到 区域 code 转换为 名字
						$("input[name='" + idx + "']").val(regionText);
					} else {
						$("input[name='" + idx + "']").val(val);
					}
				}
			});
		},
		error: function(xhr, type, errorThrown) {
			//异常处理；
			mui.toast("获取失败");
		}
	});
}
/*获取管理单位*/
function getGldw() {
	mui.ajax(app.host + '/VIID/Dicts.action?userName=' + localStorage.getItem("drsUserName"), {
		dataType: 'json',
		type: 'get',
		timeout: 10000,
		success: function(data) {
			$.each(data.DictList, function(index, val) {
				if(val.Dict.LXBM == "GLDW") {
					var ppgldw = {
						value: val.Dict.ZDXBM,
						text: val.Dict.ZDXMC
					}
					allgldw.push(ppgldw);
				}
			});
		},
		error: function(xhr, type, errorThrown) {}
	});
}