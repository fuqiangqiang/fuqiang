var allgldw = []; //管理单位数据
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
				//详情图片显示
				//当有图片时, 进行展示.
//				console.log("data-idx: " + idx + '----------' + val)
				if(typeof $('#' + idx).attr("imgname") != "undefined") {
					if($('#' + idx).attr("imgname") === idx) {
//						console.log(JSON.stringify(idx + '--------------' + JSON.stringify(val)));
						mui.each(val, function(index, value) {
							$('#' + idx).append('<div class="imagesBox">' +
								'<img id="' + value.id + '" class="uploaded-images" style="width: 64px;height: 64px;" src="' + app.host + value.url + '"/>' +
								'</div>')
						})
					}
				}
				
				//条件判断: 下拉框, 三级联动, 多选项
				if($("input[name='" + idx + "']").hasClass("wind-content-input-select") ||
					$("input[name='" + idx + "']").hasClass("wind-content-input-city") ||
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
					$("input[name='" + idx + "']").val(val)
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
