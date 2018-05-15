var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
var dataDom = null;
var imgIdNum = 0; //自增标记
var imgIndex = Math.floor(Math.random()*100000); //已上传的图片索引
var imgIndex = 1; //已上传的图片索引
var imgFiles = []; //上传图片列表
var fileTotalSize = 0; //上传文件总大小
var imageList = null;
var allgldw = [];
mui.plusReady(function() {
	mui.init();
	var self = plus.webview.currentWebview();
	var id = self.de_id;
	var sbbm = self.de_sbbm;
	var shztStauts = self.de_status;
	if(shztStauts == 2 || shztStauts == 4) {
		$("#pageTitle").html("拷贝");
	} else if(shztStauts == 1 || shztStauts == 3) {
		$("#pageTitle").html("编辑");
	} else {
		$("#pageTitle").html("录入");
	}
	getDom(id, sbbm, shztStauts);
	getGldw();
})
$(function() {
	$(document)
		//获取多选的
		.on('getChooseData', function(e) {
			var cameraType = e.detail;
			var names = cameraType.map(function(obj) {
				return obj.name
			});
			var ids = cameraType.map(function(obj) {
				return obj.id
			});
			var checkname = cameraType.map(function(obj) {
				return obj.checkname
			});
			$('#' + checkname[0]).val(names.join('/')).attr('data-value', ids.join('/'))
		})
		/*获取地图数据*/
		.on('getLocation', function(e) {
			var location = e.detail;
			$('#JD').val(location.lng);
			$('#WD').val(location.lat);
			if($("#image-list2 .image-item").length > 1) {
				JDWDDisparity();
			}
		});
	$("body")
		/*日期选择*/
		.on("tap", ".wind-content-input-date", function() {
			var _self = this;
			_self.picker = new mui.DtPicker({
				type: "date", //设置日历初始视图模式
				value: $(this).val()
			});
			var thisValue = $(this);
			_self.picker.show(function(rs) {
				thisValue.val(rs.value);
				// 释放组件资源
				_self.picker.dispose();
				_self.picker = null;
			});
		})

		/*select下拉*/
		.on("tap", ".wind-content-input-select", function() {
			var typeName = $(this).attr("name");
			var dataArray = [];
			$.each(dataDom, function(idx, val) {
				if(typeName == "GLDW") {
					dataArray = allgldw;
				} else {
					if(typeName == val.type) {
						$.each(val.dictionaryDetails, function(i, value) {
							dataArray.push({
								value: value.value,
								text: value.name
							})
						})
					}
				}
			});
			var picker = new mui.PopPicker();
			picker.setData(dataArray);
			var thisVlue = $(this);
			picker.show(function(selectItems) {
				thisVlue.val(selectItems[0].text).attr('data-value', selectItems[0].value);
			})
		})

		/*多选*/
		.on("tap", ".wind-content-input-choose", function() {
			var chooseType = [];
			var labelName = $(this).attr("labelname");
			if($(this).attr('data-value')) {
				chooseType = ($(this).attr('data-value')).split('/')
			}
			var typeName = $(this).attr("name");
			var datacheckbox = "";
			$.each(dataDom, function(idx, val) {
				if(typeName == val.type) {
					datacheckbox = val.dictionaryDetails
				}
			});
			mui.openWindow({
				url: 'device-choose.html',
				extras: {
					checkname: typeName,
					chooseType: chooseType,
					datacheckbox: datacheckbox,
					labelName: labelName
				}
			});
		})

		/*省市区三级联动*/
		.on("tap", ".wind-content-input-city", function() {
			var thisValue = $(this);
			var _getParam = function(obj, param) {
				return obj[param] || '';
			};
			var cityPicker = new mui.PopPicker({
				layer: 3
			});
			cityPicker.setData(cityData3);
			cityPicker.show(function(items) {
				thisValue.val(_getParam(items[0], 'text') + "-" + _getParam(items[1], 'text') + "-" + _getParam(items[2], 'text')).attr("data-value", _getParam(items[2], 'value'));
				//返回 false 可以阻止选择框的关闭
				//return false;
			});
		})

		/*地图*/
		.on("tap", ".btn_location", function() {
			var lng = 117;
			var lat = 36.1;
			var location = {
				lng: lng,
				lat: lat
			}
			mui.openWindow({
				url: 'location.html',
				extras: location
			});
		})

		/*图片处理*/
		.on("tap", ".wind-content-input-camera", function() {
			galleryImgsMaximum();
		})
		//删除图片
		.on("tap", ".image-close", function() {
			var imageDelId = ($(this).siblings('img').attr('id'));
			var $that = $(this);
			mui.confirm('确定删除该图片？', '提示', '', function(e) {
				if(e.index == 1) {
					mui.ajax(app.host + '/VIID/DeletePicture.action?id=' + imageDelId, {
						dataType: 'json',
						type: 'get',
						timeout: 10000,
						success: function(data) {
							if(data.StatusCode == 0) {
								$that.parent().remove();
								mui.toast(data.StatusString);
							}
						},
						error: function(xhr, type, errorThrown) {}
					});
				}
			})
		})

		/*提交草稿*/
		.on("tap", "#draft_btn", function() {
			ruleDraft();
			var self = plus.webview.currentWebview(); //获取device-uncommitted.html所传的值
			var id = self.de_id; //获取所传值的id
			var postData = {};
			for(var i = 0; i < $(".wind-content-input").length; i++) {
				//判断条件: 下拉框, 多选框, 三级联动
				if($(".wind-content-input").eq(i).hasClass("wind-content-input-select") ||
					$(".wind-content-input").eq(i).hasClass("wind-content-input-choose") ||
					$(".wind-content-input").eq(i).hasClass("wind-content-input-city")) {
					var name = $(".wind-content-input").eq(i).attr("name");
					var value = $(".wind-content-input").eq(i).attr("data-value");
					if(typeof value == "undefined") {
						value = "";
					}
					postData[name] = value
					//判断条件: radio选项
				} else if($(".wind-content-input").eq(i).hasClass("wind-content-input-radiodetail")) {
					var name = $(".wind-content-input").eq(i).attr("name");
					var value = $(".wind-content-input").eq(i).val();
					if($(".wind-content-input").eq(i).is(':checked')) {
						postData[name] = value;
					}
				}
				//判断条件: input框
				else {
					var name = $(".wind-content-input").eq(i).attr("name");
					var value = $(".wind-content-input").eq(i).val();
					if(typeof value == "undefined") {
						value = "";
					}
					postData[name] = value
				}
			}
			var url = app.host + '/VIID/CamerasToSync.action';
			var uploader = plus.uploader.createUpload(url, {
				method: 'POST',
			}, function(t, status) {
				// 上传完成
				if(status == 200) {
					mui.toast("提交草稿成功");
					//mui.back();
				} else {
					mui.toast("提交草稿失败: " + status);
				}
			});
			postData.czr = localStorage.getItem("drsUserName");
			postData.shzt = "1";
			postData.id = id; //没有id无法标识记录
			mui.each(postData, function(index, element) {
				//if(index !== 'images') {
				uploader.addData(index, element)
				//}
			});
			//添加图片
			for(var i = 0; i < $(".imgboxnum").length; i++) {
				//父元素id
				var imgList = $(".imgboxnum").eq(i).attr("id");
				//对应父元素下的 <img>
				var imgList2 = $(".imgboxnum").eq(i).find(".uploaded-images").attr('inheritId');
//				console.log("origionId=================="+imgList);
//				console.log("children=================="+JSON.stringify(imgList2));
//				console.log("AAAAAAAAAAAAAA" + $(".imgboxnum").eq(i).attr("id"));
//				console.log("AAAAAAAAAAAAAA" + $(".imgboxnum").eq(i).attr("origionId"));
//				console.log("BBBBBBBBBBBBBB" + $(".imgboxnum").eq(i).find(".uploaded-images").attr('inheritId'))
				if($(".imgboxnum").eq(i).attr("id") == $(".imgboxnum").eq(i).find(".uploaded-images").attr('inheritId')) {
//					console.log($(".imgboxnum").eq(i).find(".uploaded-images").eq(i).attr('inheritId'));
					
				}
				
				mui.each(imgFiles, function(index, element) {
						var f = imgFiles[index];
						if($(".imgboxnum").eq(i).attr("origionId") == element.sign){
							uploader.addFile(f.path, {
								key: imgList + "-" + f.name
							});
							console.log('imgFiles: --------' + JSON.stringify(imgFiles));
						}
					});
			}
			//			console.log('//////////////////////////////////////////////////////////')
			//			console.log(JSON.stringify($('.uploaded-images')));
			//			console.log('\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\')
			//			console.log(JSON.stringify($('.bornCaptcherName')));

			uploader.start();
		})

		/*发送审核*/
		.on("tap", "#examine_btn", function() {
			ruleVerification();
			var self = plus.webview.currentWebview(); //获取device-uncommitted.html所传的值
			var id = self.de_id; //获取所传值的id
			var postData = {};
			for(var i = 0; i < $(".wind-content-input").length; i++) {
				if($(".wind-content-input").eq(i).hasClass("wind-content-input-select") ||
					$(".wind-content-input").eq(i).hasClass("wind-content-input-choose") ||
					$(".wind-content-input").eq(i).hasClass("wind-content-input-city")) {
					var name = $(".wind-content-input").eq(i).attr("name");
					var value = $(".wind-content-input").eq(i).attr("data-value");
					if(typeof value == "undefined") {
						value = "";
					}
					postData[name] = value
				} else if($(".wind-content-input").eq(i).hasClass("wind-content-input-radiodetail")) {
					var name = $(".wind-content-input").eq(i).attr("name");
					var value = $(".wind-content-input").eq(i).val();
					if($(".wind-content-input").eq(i).is(':checked')) {
						postData[name] = value;
					}
				} else {
					var name = $(".wind-content-input").eq(i).attr("name");
					var value = $(".wind-content-input").eq(i).val();
					if(typeof value == "undefined") {
						value = "";
					}
					postData[name] = value
				}
			}
			var url = app.host + '/VIID/CamerasToSync.action';
			var uploader = plus.uploader.createUpload(url, {
				method: 'POST',
			}, function(t, status) {
				// 上传完成
				if(status == 200) {
					mui.toast("提交草稿成功");
					//mui.back();
				} else {
					mui.toast("提交草稿失败: " + status);
				}
			});
			postData.czr = localStorage.getItem("drsUserName");
			postData.shzt = "2";
			postData.id = id; //没有id无法标识记录
			mui.each(postData, function(index, element) {
				//if(index !== 'images') {
				uploader.addData(index, element)
				//}
			});
			for(var i = 0; i < $(".imgboxnum").length; i++) {
				var imgList = $(".imgboxnum").eq(i).attr("id");
				mui.each(imgFiles, function(index, element) {
					var f = imgFiles[index];
					uploader.addFile(f.path, {
						key: imgList + "-" + f.name
					});
				});
			}
			uploader.start();
		})
})

/*经纬度转换
 * fuqiang
 */
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

/*获取布局信息
 * fuqiang
 */
function getDom(id, sbbm, shztStauts) {
	mui.ajax(app.host + '/deviceDictionary/getDeviceDictonary', {
		dataType: 'json',
		type: 'get',
		timeout: 10000,
		success: function(msg) {
			dataDom = msg.data;
			$('.mui-content').html(template('device_add_wind', msg.data));
			for(var i = 0; i < $(".imgboxnum").length; i++) {
				var imgList = $(".imgboxnum").eq(i).attr("id");
				newPlaceholder($("#" + imgList)[0])
			}
			if(typeof id == "undefined" || id == null) {} else {
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
			}
		},
		error: function(xhr, type, errorThrown) {}
	});
}

/*获取管理单位
 * fuqiang
 */
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
					//console.log(JSON.stringify(allgldw))
				}
			});
		},
		error: function(xhr, type, errorThrown) {}
	});

}

/*提交草稿验证规则
 * 只验证设备编码和管理单位必填
 * fuqiang
 * */
function ruleDraft() {
	if($("input[name=SBBM]").val() == "") {
		mui.toast("请输入设备编码");
		return false;
	} else if($("input[name=SBBM]").val().length < 20) {
		mui.toast("请输入20位设备编码");
		return false;
	}
	if($("input[name=GLDW]").val() == "") {
		mui.toast("请输入管理单位");
		return false;
	}
}

/*提交发送审核验证规则
 * 发送审核的
 * 目前只验证了必填项，没有验证动态必填
 * fuqiang
 * */
function ruleVerification() {
	for(var i = 0; i < $(".label-required").length; i++) {
		var textValue = $(".label-required").eq(i).closest(".wind-content-item").find("input[type=text]");
		if(textValue.val() == "") {
			mui.toast("请输入" + $(".label-required").eq(i).text());
			return false;
		}
	}
}

/*照片展示*/
function newPlaceholder(imageList) {
	var fileInputArray = [].slice.call(imageList.querySelectorAll('.file'));
	if(fileInputArray &&
		fileInputArray.length > 0 &&
		fileInputArray[fileInputArray.length - 1].parentNode.classList.contains('space')) {
		return;
	};
	imgIdNum++;
	var placeholder = document.createElement('div');
	placeholder.setAttribute('class', 'image-item space');

	var up = document.createElement("div");
	up.setAttribute('class', 'image-up');
	//删除图片
	var closeButton = document.createElement('div');
	closeButton.setAttribute('class', 'image-close');
	closeButton.innerHTML = 'X';
	closeButton.id = "img-" + imgIndex;
	//小X的点击事件
	closeButton.addEventListener('tap', function(event) {
		setTimeout(function() {
			for(var temp = 0; temp < imgFiles.length; temp++) {
				if(imgFiles[temp].id == closeButton.id) {
					imgFiles.splice(temp, 1);
				}
			}
			imageList.removeChild(placeholder);
		}, 0);
		return false;
	}, false);
	var fileInput = document.createElement('div');
	fileInput.setAttribute('class', 'file');
	fileInput.setAttribute('id', 'image-' + imgIdNum);
	fileInput.addEventListener('tap', function(event) {
		var self = this;
		var index = (this.id).substr(-1);
		console.log("点击时的 this : " + self)
		plus.gallery.pick(function(e) {
			console.log("点击添加图片: "+e)
			var name = e.substr(e.lastIndexOf('/') + 1);
			plus.zip.compressImage({
				src: e,
				dst: '_doc/' + name,
				overwrite: true,
				quality: 50
			}, function(zip) {
				fileTotalSize += zip.size
				if(fileTotalSize > (10 * 1024 * 1024)) {
					return mui.toast('文件超大,请重新选择~');
				}
				if(!self.parentNode.classList.contains('space')) { //已有图片
					console.log('已有照片更新,已有照片更新')
					imgFiles.splice(index - 1, 1, {
						name: "images" + index,
						path: e
					});
				} else { //加号
					placeholder.classList.remove('space');
					imgFiles.push({
						name: "images" + imgIndex,
						path: zip.target,
						id: "img-" + imgIndex,
						sign: (function(){
							return "bornCaptcher"
						})()
					});
					console.log("新加图片: "+JSON.stringify(imgFiles));
					imgIndex++;
					newPlaceholder(imageList);
				}
				up.classList.remove('image-up');
				placeholder.style.backgroundImage = 'url(' + zip.target + ')';
			}, function(zipe) {
				mui.toast('压缩失败！')
			});

		}, function(e) {
			//mui.toast(e.message);
		}, {});

	}, false);

	placeholder.appendChild(closeButton);
	placeholder.appendChild(up);
	placeholder.appendChild(fileInput);
	imageList.appendChild(placeholder);
}
/*数据获取函数
 * fuqiang
 * */
function getDeviceData(sbbm, shztStauts, dataArray) {
	mui.ajax(app.host + '/VIID/Camera.action?SBBM=' + sbbm + "&shzt=" + shztStauts, {
		dataType: 'json', //服务器返回json格式数据
		type: 'get', //HTTP请求类型
		headers: {
			'Content-Type': 'application/json'
		},
		success: function(data) {
			//console.log(JSON.stringify(data))
			var chooseall = [];
			$.each(data, function(idx, val) {
				//				console.log("data-idx: " + idx + '-----------' + val)
				if(typeof $('#' + idx).attr("imgname") != "undefined") {
					if($('#' + idx).attr("imgname") === idx) {
						//						console.log(JSON.stringify(idx) + '--------------' + val);
						mui.each(val, function(index, value) {
							//							console.log(index+'-----22222222---------'+value);
							$('#' + idx).append('<div class="imagesBox"><span id="' + value.id + '" class="image-close">×</span>' +
								'<img id="' + value.id + '" inheritId="' + idx + '" class="uploaded-images" style="width: 64px;height: 64px;" src="' + app.host + value.url + '"/>' +
								'</div>')
						})
					}
				}

				if($("input[name='" + idx + "']").hasClass("wind-content-input-select") ||
					$("input[name='" + idx + "']").hasClass("wind-content-input-city") ||
					$("input[name='" + idx + "']").hasClass("wind-content-input-choose")) {
					if($("input[name='" + idx + "']").attr("namedep") === "department") {
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
					$("input[name='" + idx + "']").each(function() {
						if($(this).val() == val) {
							$(this).prop("checked", true);
						}
					});
				} else {
					$("input[name='" + idx + "']").val(val)
				}

			});

			/*未审核和已审核的拷贝功能*/
			if(shztStauts == 2 || shztStauts == 4) {
				$("input[name='SBBM']").val("");
				$("input[name='JD']").val("");
				$("input[name='WD']").val("");
			}

		},
		error: function(xhr, type, errorThrown) {
			//异常处理；
			mui.toast("获取失败");
		}
	});
}