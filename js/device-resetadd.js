var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
var dataDom = null;
var imgIdNum = 0; //自增标记
var imgIndex = 1; //已上传的图片索引
var imgFiles = []; //上传图片列表
var fileTotalSize = 0; //上传文件总大小
var imageList = null;
var allgldw = []; //保存所有管理单位
var imgArray = []; //保存上传的图片
var regionArray = []; //三级联动展示
var regionText = ''; //三级联动文本
var typecustom = [];
var compareFlagJDWD = 0; //比较经纬度偏差
localStorage.setItem("clearJDWD", "1");
localStorage.setItem("sjzpGeolocationJD", '');
localStorage.setItem("sjzpGeolocationWD", '');

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
	plus.geolocation.getCurrentPosition(function(p) {
		/*localStorage.setItem("sjzpGeolocationJD", p.coords.longitude);
		localStorage.setItem("sjzpGeolocationWD", p.coords.latitude);*/
		//alert("存储经度：" + localStorage.getItem("sjzpGeolocationJD"));
		//alert("存储纬度：" + localStorage.getItem("sjzpGeolocationWD"));
		//alert("存储纬度：" +p.coords.longitude + " - "+ p.coords.latitude);
		//坐标转换
		var points = [new BMap.Point(p.coords.longitude, p.coords.latitude)];
		//地图初始化
		var bm = new BMap.Map();
		//坐标转换完之后的回调函数
		/*translateCallback = function(data) {
		    if(data.status === 0) {
		        alert(data.points.length)
		        for(var i = 0; i < data.points.length; i++) {
		            console.log(JSON.stringify(data.points[i]));
		            localStorage.setItem("sjzpGeolocationJD", data.points[i].lng);
		            localStorage.setItem("sjzpGeolocationWD", data.points[i].lat);
		        }
		    }
		}*/
		var convertor = new BMap.Convertor();
		convertor.translate(points, 1, 5, bd_encrypt(p.coords.longitude, p.coords.latitude))

	}, function(e) {
		//alert('Geolocation error: ' + e.message);
	}, {
		provider: 'baidu',
		enableHighAccuracy: true
	});

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
		/*设备编码 blur*/
		.on("blur", "input[name=SBBM]", function() {
			regionArray = [];
			var thisCode = $('input[name=SBBM]').val();
			var prefix6 = thisCode.substr(0, 6).toString();
			getRegionName(prefix6);
			$('.wind-content-input-city').val(regionText).attr('data-value', prefix6);
		})
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
			typecustom = [];
			$.each(dataDom, function(idx, val) {
				if(typeName == "GLDW") {
					dataArray = allgldw;
				} else {
					if(val.dependence) {
						typecustom.push({
							"type": val.dependence.split("-")[1],
							"idnum": val.dependence.split("-")[2],
							"linktype": val.type,
							"isrequired": val.required
						})
					}
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
				//[编辑]状态关联必填项.
				$.each(typecustom, function(index, value) {
					if(thisVlue.attr('name') == value.type && thisVlue.attr('data-value') == value.idnum) {
						$('input[name=' + value.linktype + ']').siblings('label').addClass('label-required');
					} else {
						$('input[name=' + value.linktype + ']').siblings('label').removeClass('label-required');
					}
				}) //--END 编辑状态关联必填项 --

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
			if(!ruleDraft()) {
				return;
			}
			var self = plus.webview.currentWebview(); //获取device-uncommitted.html所传的值
			var id = self.de_id; //获取所传值的id
			var postData = {};
			for(var i = 0; i < $(".wind-content-input").length; i++) {
				//判断条件: 下拉框, 多选框, 三级联动
				if($(".wind-content-input").eq(i).hasClass("wind-content-input-select") ||
					$(".wind-content-input").eq(i).hasClass("wind-content-input-choose") ||
					$(".wind-content-input").eq(i).hasClass("wind-content-input-city")) {
					var name = $(".wind-content-input").eq(i).attr("name");
					var value = $(".wind-content-input").eq(i).attr("data-value"); //attr("data-value")
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
				//判断条件: input下拉框
				else {
					var name = $(".wind-content-input").eq(i).attr("name");
					var value = $(".wind-content-input").eq(i).val();
					if(typeof value == "undefined") {
						value = "";
					}
					postData[name] = value
				}
			}
			//【设备编码】【IPV4】【IPV6】【MAC地址】【录像保存天数】格式验证 暂时
			for(var i = 0; i < $('input[type=text]').length; i++) {
				if('' != $('input').eq(i).val()) {
					if('SBBM' == $('input').eq(i).attr('name')) {
						var deviceSNReg = /^\d{20}$/
						if(!deviceSNReg.test($('input').eq(i).val())) {
							mui.toast("设备编码 格式不正确");
							return;
						}
					}
					if('IPV4' == $('input').eq(i).attr('name')) {
						var IPV4Reg = /^((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))$/;
						if(!IPV4Reg.test($('input').eq(i).val())) {
							mui.toast("IPV4地址 格式不正确");
							return;
						}
					}
					if('IPV6' == $('input').eq(i).attr('name')) {
						var IPV6Reg = /^\s*((([0-9A-Fa-f]{1,4}[:-]){7}(([0-9A-Fa-f]{1,4})|[:-]))|(([0-9A-Fa-f]{1,4}[:-]){6}([:-]|((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})|([:-][0-9A-Fa-f]{1,4})))|(([0-9A-Fa-f]{1,4}[:-]){5}(([:-]((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|(([:-][0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}[:-]){4}([:-][0-9A-Fa-f]{1,4}){0,1}(([:-]((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|(([:-][0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}[:-]){3}([:-][0-9A-Fa-f]{1,4}){0,2}(([:-]((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|(([:-][0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}[:-]){2}([:-][0-9A-Fa-f]{1,4}){0,3}(([:-]((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|(([:-][0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}[:-])([:-][0-9A-Fa-f]{1,4}){0,4}(([:-]((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|(([:-][0-9A-Fa-f]{1,4}){1,2})))|([:-]([:-][0-9A-Fa-f]{1,4}){0,5}(([:-]((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|(([:-][0-9A-Fa-f]{1,4}){1,2})))|(((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})))(%.+)?\s*$/;
						if(!IPV6Reg.test($('input').eq(i).val())) {
							mui.toast("IPV6地址 格式不正确");
							return;
						}
					}
					if('MACDZ' == $('input').eq(i).attr('name')) {
						var macAddrReg = /^([A-Fa-f0-9]{2}[:-]){5}[A-Fa-f0-9]{2}$/;
						if(!macAddrReg.test($('input').eq(i).val())) {
							mui.toast("MAC地址 格式不正确");
							return;
						}
					}
					if('LXBCTS' == $('input').eq(i).attr('name')) {
						var recordingDaysReg = /^\d+$/;
						if(!recordingDaysReg.test($('input').eq(i).val())) {
							mui.toast("录像保存天数 格式不正确");
							return;
						}
					}
				}
			} // --END 【设备编码】【IPV4】【IPV6】【MAC地址】【录像保存天数】格式验证--

			for(var j = 0; j < $('.uploaded-images').length; j++) {
				//处理上传时的 name的值, 其后不能加 Name.
				var name = $(".uploaded-images").eq(j).attr("inheritId");
				name = name.substring(0, name.length - 4);
				var value = $(".uploaded-images").eq(j).attr("id");
				imgArray.push(value)
				postData[name] = imgArray.join('/');
			}
			var url = app.host + '/VIID/CamerasToSync.action';
			var uploader = plus.uploader.createUpload(url, {
				method: 'POST',
			}, function(t, status) {
				// 上传完成
				if(status == 200) {
					mui.toast("提交草稿成功");
					mui.back();
				} else {
					mui.toast("提交草稿失败: " + status);
				}
			});
			postData.czr = localStorage.getItem("drsUserName");
			postData.shzt = "1";
			postData.id = id; //没有id无法标识记录
			console.log(JSON.stringify(postData));
			//return
			mui.each(postData, function(index, element) {
				//if(index !== 'images') {
				uploader.addData(index, element)
				//}
			});

			//添加图片
			//遍历图片条目
			$('.imgboxnum').each(function(index, parent) {
				//console.log("第 " + index + "parent: " + "--------" + JSON.stringify(parent));
				$(parent).find('.image-item').each(function(index, item) {
					var imgList = $(parent).attr("origionId");
					//console.log(imgList)
					mui.each(imgFiles, function(index, element) {
						//						console.log("第" + index + ": " +'-------- '+ JSON.stringify(element));
						var f = imgFiles[index];
						//						console.log("f 是: " + JSON.stringify(f));
						uploader.addFile(f.path, {
							key: imgList + '-' + index
						});
					});

				})
			})
			/*for(var i = 0; i < $(".imgboxnum .image-item").length; i++) {
//				console.log($(".imgboxnum .image-item").length);
				var imgList = $(".imgboxnum").attr("origionId");
				console.log(imgList)
				mui.each(imgFiles, function(index, element) {
					var f = imgFiles[index];
					uploader.addFile(f.path, {
						key: imgList
					});
				});
			}*/
			uploader.start();
		})
		/*发送审核*/
		.on("tap", "#examine_btn", function() {
			if(!ruleVerification()) {
				return;
			}
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
			//【设备编码】【IPV4】【IPV6】【MAC地址】【录像保存天数】格式验证 暂时
			for(var i = 0; i < $('input[type=text]').length; i++) {
				if('' != $('input').eq(i).val()) {
					if('SBBM' == $('input').eq(i).attr('name')) {
						var deviceSNReg = /^\d{20}$/
						if(!deviceSNReg.test($('input').eq(i).val())) {
							mui.toast("设备编码 格式不正确");
							return;
						}
					}
					if('IPV4' == $('input').eq(i).attr('name')) {
						var IPV4Reg = /^((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))$/;
						if(!IPV4Reg.test($('input').eq(i).val())) {
							mui.toast("IPV4地址 格式不正确");
							return;
						}
					}
					if('IPV6' == $('input').eq(i).attr('name')) {
						var IPV6Reg = /^\s*((([0-9A-Fa-f]{1,4}[:-]){7}(([0-9A-Fa-f]{1,4})|[:-]))|(([0-9A-Fa-f]{1,4}[:-]){6}([:-]|((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})|([:-][0-9A-Fa-f]{1,4})))|(([0-9A-Fa-f]{1,4}[:-]){5}(([:-]((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|(([:-][0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}[:-]){4}([:-][0-9A-Fa-f]{1,4}){0,1}(([:-]((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|(([:-][0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}[:-]){3}([:-][0-9A-Fa-f]{1,4}){0,2}(([:-]((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|(([:-][0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}[:-]){2}([:-][0-9A-Fa-f]{1,4}){0,3}(([:-]((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|(([:-][0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}[:-])([:-][0-9A-Fa-f]{1,4}){0,4}(([:-]((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|(([:-][0-9A-Fa-f]{1,4}){1,2})))|([:-]([:-][0-9A-Fa-f]{1,4}){0,5}(([:-]((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|(([:-][0-9A-Fa-f]{1,4}){1,2})))|(((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})))(%.+)?\s*$/;
						if(!IPV6Reg.test($('input').eq(i).val())) {
							mui.toast("IPV6地址 格式不正确");
							return;
						}
					}
					if('MACDZ' == $('input').eq(i).attr('name')) {
						var macAddrReg = /^([A-Fa-f0-9]{2}[:-]){5}[A-Fa-f0-9]{2}$/;
						if(!macAddrReg.test($('input').eq(i).val())) {
							mui.toast("MAC地址 格式不正确");
							return;
						}
					}
					if('LXBCTS' == $('input').eq(i).attr('name')) {
						var recordingDaysReg = /^\d+$/;
						if(!recordingDaysReg.test($('input').eq(i).val())) {
							mui.toast("录像保存天数 格式不正确");
							return;
						}
					}
				}
			} // --END 【设备编码】【IPV4】【IPV6】【MAC地址】【录像保存天数】格式验证--

			var url = app.host + '/VIID/CamerasToSync.action';
			var uploader = plus.uploader.createUpload(url, {
				method: 'POST',
			}, function(t, status) {
				// 上传完成
				if(status == 200) {
					mui.toast("发送审核成功");
					mui.back();
				} else {
					mui.toast("发送审核失败: " + status);
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
			//添加图片
			//遍历图片条目
			$('.imgboxnum').each(function(index, parent) {
				//console.log("第 " + index + "parent: " + "--------" + JSON.stringify(parent));
				$(parent).find('.image-item').each(function(index, item) {
					var imgList = $(parent).attr("origionId");
					//console.log(imgList)
					mui.each(imgFiles, function(index, element) {
						//console.log("第" + index + ": " +'-------- '+ JSON.stringify(element));
						var f = imgFiles[index];
						//console.log("f 是: " + JSON.stringify(f));
						uploader.addFile(f.path, {
							key: imgList + '-' + index
						});
					});

				})
			})
			/*for(var i = 0; i < $(".imgboxnum").length; i++) {
				var imgList = $(".imgboxnum").eq(i).attr("id");
				mui.each(imgFiles, function(index, element) {
					var f = imgFiles[index];
					uploader.addFile(f.path, {
						key: imgList + "-" + f.name
					});
				});
			}*/
			uploader.start();
		})
}) //--END --

// 经纬度转换 fuqiang
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

// 获取布局信息 fuqiang
function getDom(id, sbbm, shztStauts) {
	mui.ajax(app.host + '/deviceDictionary/getDeviceDictonary', {
		dataType: 'json',
		type: 'get',
		timeout: 10000,
		success: function(msg) {
			dataDom = msg.data;

			$.each(dataDom, function(index1, value1) {
				//console.log("data -- index1 : " + index1 + "--------00000000-------- " + JSON.stringify(value1));

				//在获取所有 Dom 检查项目是否有 [关联必填项]
				if(value1.dependence) {
					typecustom.push({
						"type": value1.dependence.split("-")[1],
						"idnum": value1.dependence.split("-")[2],
						"linktype": value1.type,
						"isrequired": value1.required
					})
				} //-- END if --
			}) //--END $.each --

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

// 获取管理单位  fuqiang
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

// 提交草稿验证规则 fuqiang
// 只验证设备编码和管理单位必填
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
	return true;
}

// 提交发送审核验证规则  fuqiang
// 发送审核的. 目前只验证了必填项，没有验证动态必填
function ruleVerification() {
	for(var i = 0; i < $(".label-required").length; i++) {
		var textValue = $(".label-required").eq(i).closest(".wind-content-item").find("input[type=text]");
		if(textValue.val() == "") {
			mui.toast("请输入" + $(".label-required").eq(i).text());
			return false;
		}
	}
	return true;
}

// 照片展示
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
	closeButton.innerHTML = '×';
	closeButton.id = "img-" + imgIndex;
	closeButton.addEventListener('tap', function(event) {

		if(imgFiles.length > 1) {
			compareFlagJDWD = 1;
		} else {
			compareFlagJDWD = 0;
		}

		//小X的点击事件
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

	//新建图片
	var fileInput = document.createElement('div');
	fileInput.setAttribute('class', 'file');
	fileInput.setAttribute('id', 'image-' + imgIdNum);
	fileInput.addEventListener('tap', function(event) {
		var imagesLength = $('.imagesBox').length + $('.image-item').length
		if(imagesLength >= 4) {
			mui.toast("最多只能上传3张图片");
			return
		}
		var self = this;
		var index = (this.id).substr(-1);
		//弹出选择菜单:【拍摄照片】||【相册选择】.  device-add.html :126 <a>
		mui('#popover').popover('toggle', document.getElementById("openPopover"));

		//为但出菜单增加事件.  off() 方法移除用.on()绑定的事件处理程序.  
		mui('body #popover').off().on('tap', '.mui-table-view-cell', function() {

			//判断: 点击【拍摄照片】时 :609
			if($(this).is('.j-captureImage')) {
				//				
				plus.camera.getCamera().captureImage(function(e) {
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
							imgFiles.splice(index - 1, 1, {
								name: "images" + index,
								path: e
							});
							compareFlagJDWD = 1;
						} else { //加号
							placeholder.classList.remove('space');
							imgFiles.push({
								name: "images" + imgIndex,
								path: zip.target,
								id: "img-" + imgIndex
							});
							imgIndex++;
							newPlaceholder(imageList);
							compareFlagJDWD = 1;
						}
						up.classList.remove('image-up');
						placeholder.style.backgroundImage = 'url(' + zip.target + ')';

					}, function(zipe) {
						mui.toast('压缩失败！')
					});
//					拍摄照片后保存 经度&纬度
					if(compareFlagJDWD = 1) {
						//拍摄照片后 比较坐标偏差
						var comSelJD = $("#JD").val();
						var comSelWd = $("#WD").val();
						if(comSelJD != '' && comSelWd != '') {
							//提示偏离
							JDWDDisparity();
						}
					}
				}, function(e) {
					mui.toast('取消拍照');
				}, {});
				//在点击后关闭 遮罩
				mui('#popover').popover('toggle', document.getElementById("openPopover"));
				//点击【相册选择】时触发
			} else {
				//MUI API plus.gallery.pick()--从相册选择照片
				plus.gallery.pick(function(e) {
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
							imgFiles.splice(index - 1, 1, {
								name: "images" + index,
								path: e
							});
						} else { //加号
							placeholder.classList.remove('space');
							imgFiles.push({
								name: "",
								path: zip.target,
								id: "img-" + imgIndex
							});
							imgIndex++;
							newPlaceholder(imageList);
						}

						up.classList.remove('image-up');
						//为照片添加地址
						placeholder.style.backgroundImage = 'url(' + zip.target + ')';
					}, function(zipe) {
						mui.toast('压缩失败！')
					});
				}, function(e) {
					mui.toast('操作取消');
				}, {});
				//在点击后关闭 遮罩
				mui('#popover').popover('toggle', document.getElementById("openPopover"));
			} // --END else --
		})
		return
	}, false);

	placeholder.appendChild(closeButton);
	placeholder.appendChild(up);
	placeholder.appendChild(fileInput);
	imageList.appendChild(placeholder);
	//	console.log($('.imgboxnum').html());//打印图片标签

} //-- END function newPlaceholder(){} --

// 数据获取函数 fuqiang
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
				if(typeof $('#' + idx).attr("imgname") != "undefined") {
					if($('#' + idx).attr("imgname") === idx) {
						mui.each(val, function(index, value) {
							$('#' + idx).append('<div class="imagesBox"><span id="' + value.id + '" class="image-close">×</span>' +
								'<img id="' + value.id + '" inheritId="' + idx + '" class="uploaded-images" style="width: 64px;height: 64px;" src="' + app.host + value.url + '"/>' +
								'</div>')
						})
					}
				}
				if($("input[name='" + idx + "']").hasClass("wind-content-input-select") ||
					$("input[name='" + idx + "']").hasClass("wind-content-input-choose")) {

					if($("input[name='" + idx + "']").attr("namedep") === "department") {
						$.each(allgldw, function(index, value) {
							if(val == value.value) {
								$("input[name='" + idx + "']").val(value.text).attr('data-value', value.value);
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
								//遍历 单选下拉框 select
							} else if(idx == value.type && val == value.value) {
								//为有 [关联必填项] 的元素 增加 class label-required
								$.each(typecustom, function(index2, value2) {
									if(value.type == value2.type && value.value == value2.idnum) {
										//										console.log("select - index: " + index + "--------" + JSON.stringify(value));
										//										console.log(JSON.stringify(typecustom));
										$('input[name=' + value2.linktype + ']').siblings('label').addClass('label-required');
									}
								}) //--END 关联必填项 --

								//.attr('data-value',value.value) 在之前动态增加的 data-value 属性.
								$("input[name='" + idx + "']").val(value.text).attr('data-value', value.value);
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
					if(idx == "XZQY") {
						getRegionName(val); //得到 区域 code 转换为 名字
						$("input[name='" + idx + "']").val(regionText).attr('data-value', val); //.attr('data-value',value.value)
					} else {
						$("input[name='" + idx + "']").val(val);
					}
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
	mui.confirm('\n 图片坐标:' + localStorage.getItem("sjzpGeolocationJD") + ',' + localStorage.getItem("sjzpGeolocationWD") + ' \n 定位坐标:' + localStorage.getItem("drsSelJD") + ',' + localStorage.getItem("drsSelWD") + ' \n 坐标误差：' + gap + '米 \n \n 纠正后将以图片坐标为准\n', '坐标纠正', btnArray, function(e) {
		if(e.index == 1) {
			//更新 经度 纬度
			$("#JD").val(localStorage.getItem("sjzpGeolocationJD"));
			$("#WD").val(localStorage.getItem("sjzpGeolocationWD"));
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

//地区三级联动显示
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
						regionText = regionArray.join('-'); //格式化显示.例:山东省-济南市-高新区
						//						console.log(regionText);
						return
					}
				} //--END Level-3 第三级循环 --
			} //--END 二级非 undefined

		} //--END Level-2 循环城市--
	} //--END Level-1 循环省份--
} //--END getRegionName