var imgIdNum = 0; //自增标记
var imgIdNum2 = 0; //自增标记

var imgIndex = 1; //已上传的图片索引
var imgIndex2 = 1; //已上传的图片索引

var imgFiles = []; //上传图片列表
var imgFiles2 = []; //上传图片列表

var fileTotalSize = 0; //上传文件总大小
var imageList = document.getElementById('image-list'); //图片展示容器
var imageList2 = document.getElementById('image-list2'); //图片展示容器
var gndata = [],
    wzdata = [],
    industrydata = [];
var allsbcs = [],
    alljkdwlx = [],
    allsxj = [],
    allbgsx = [],
    allbmgs = [],
    allwzlx = [],
    alljkfw = [],
    alllwsx = [],
    allsbzt = [],
    allgldw = [];

var showType = 1; //1 录入 2 详情 3 编辑
var showstatus = 1;//文件状态
var deviceId = "";
localStorage.setItem("clearJDWD", "1");
localStorage.setItem("sjzpGeolocationJD", '');
localStorage.setItem("sjzpGeolocationWD", '');
var compareFlagJDWD = 0; //比较经纬度偏差
var xzquArray = ["11", "12", "13", "14",
    "15", "21", "22", "23",
    "31", "32", "33", "34",
    "35", "36", "37", "41",
    "42", "43", "44", "45",
    "46", "51", "52", "53",
    "54", "61", "62", "63",
    "64", "65", "71", "81"
]

function setJDWDInt() {
    var JDWDinterval = setInterval(function() {
        //更新JD WD
        $("#JD").val(localStorage.getItem("drsSelJD"));
        $("#WD").val(localStorage.getItem("drsSelWD"));

        if(localStorage.getItem("clearJDWD") == "0") {
            clearInterval(JDWDinterval);
            //提示坐标偏离
            //alert("flag:"+compareFlagJDWD);
            if(compareFlagJDWD) {
                JDWDDisparity();
            }

            return;
        }
    }, 1000);
}

//获取位置
document.addEventListener('plusready', onPlusReady, false);
//var getLocationJDWD =
function onPlusReady() {
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
        convertor.translate(points, 1, 5, bd_encrypt(p.coords.longitude,p.coords.latitude))

    }, function(e) {
        //alert('Geolocation error: ' + e.message);
    }, {
        provider: 'baidu',
        enableHighAccuracy: true
    });
}
var x_pi = 3.14159265358979324 * 3000.0 / 180.0;

function bd_encrypt(gg_lat, gg_lon){
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
//起始日期选择
var startTimeFun = function() {
    $('#AZSJ').on('tap', function() {
        var _self = this;
        /*
         * 首次显示时实例化组件
         */
        _self.picker = new mui.DtPicker({
            type: "datetime", //设置日历初始视图模式
            value: $(this).val()
        });
        _self.picker.show(function(rs) {
            $('#AZSJ').val(rs.value);
            // 释放组件资源
            _self.picker.dispose();
            _self.picker = null;
        });
    })
};

mui.plusReady(function() {
    mui.init({
    	beforeback: function() {
			mui.fire(plus.webview.getWebviewById('device-uncommitted.html'), 'showsearch', {});
			mui.fire(plus.webview.getWebviewById('barcode.html'), 'resetBarcode', {});
		}
    });
    initWorkTypePicker(); //字典项

    var self = plus.webview.currentWebview();
    showType = self.de_title;
    showstatus = self.de_status;
    deviceId = self.de_id;
    
    if(showstatus != undefined && (showstatus == 2 || showstatus == 4)){
        $("#editpen").hide();
    }else{
        $("#editpen").show();
    }

    if(showType == 1) {
        //录入
        $("#btn_submit").removeClass("hidden");
        $("#pageTitle").html("录入");
        $("#listHeader").removeClass("hidden");
        $("#mui-content").removeClass("hidden");

        newPlaceholder(imageList); //上传文件1
        newPlaceholder2(imageList2); //上传文件2

        initEvents();
        startTimeFun();

    } else if(showType == 2) {

        $("#mui-content").children().remove();
        getDeviceData(self.de_detail, showType,showstatus);
        $("body").on("tap", ".txzpimg", function() {
            var a;
            for(var i=0;i<$("#editTXZP .allimgdiv").length;i++){
                if($(this).siblings("img").attr("src") == $("#editTXZP .allimgdiv").eq(i).find("img").attr("src")){
                    a = i + 1;
                }
            }
            var senddata = $(this).siblings("img").attr("id");
            var btnArray = ['否', '是'];
            mui.confirm('确定删除该图片？', '提示', btnArray, function(e) {
                if(e.index == 1) {
                    mui.ajax(app.host + '/VIID/DeletePicture.action?id=' + senddata, {
                        dataType: 'json',
                        type: 'get',
                        timeout: 10000,
                        success: function(data) {
                            if(data.StatusCode == 0) {
                                $("#editTXZP .allimgdiv:nth-child("+a+")").remove();
                                mui.toast(data.StatusString);
                            }
                        },
                        error: function(xhr, type, errorThrown) {}
                    });
                }
            })
        })
        .on("tap", ".sjzpimg", function() {
            var a;
            for(var i=0;i<$("#editSJZP .allimgdiv").length;i++){
                if($(this).siblings("img").attr("src") == $("#editSJZP .allimgdiv").eq(i).find("img").attr("src")){
                    a = i + 1;
                }
            }
            var senddata = $(this).siblings("img").attr("id");
            var btnArray = ['否', '是'];
            mui.confirm('确定删除该图片？', '提示', btnArray, function(e) {
                if(e.index == 1) {
                    mui.ajax(app.host + '/VIID/DeletePicture.action?id=' + senddata, {
                        dataType: 'json',
                        type: 'get',
                        timeout: 10000,
                        success: function(data) {
                            if(data.StatusCode == 0) {
                                $("#editSJZP .allimgdiv:nth-child("+a+")").remove();
                                mui.toast(data.StatusString);
                            }
                        },
                        error: function(xhr, type, errorThrown) {}
                    });
                }
            })
        })

    } else if(showType == 3) {
        //拷贝
        //alert($("#mui-content").html());
        $("#mui-content").children().remove();
        getDeviceData(self.de_detail, showType,showstatus);

    }

});

function initEvents() {
    $('input[name="SBBM"]').blur(function() {
        $('input[name="XZQY"]').val($('input[name="SBBM"]').val().substring(0, 6));
    })
    $(document)
        //获取摄像机类型
        .on('getCameraType', function(e) {
            var cameraType = e.detail;
            var names = cameraType.map(function(obj) {
                return obj.name
            });
            var ids = cameraType.map(function(obj) {
                return obj.id
            });
            $('#SXJGNLX').val(names.join('/')).attr('data-value', ids.join('/'))
        })
        //获取摄像机定位
        .on('getCameraPosition', function(e) {
            var cameraType = e.detail;
            var names = cameraType.map(function(obj) {
                return obj.name
            });
            var ids = cameraType.map(function(obj) {
                return obj.id
            });
            $('#SXJWZLX').val(names.join('/')).attr('data-value', ids.join('/'))
        })
        //获取摄像机定位
        .on('getindustry', function(e) {
            var cameraType = e.detail;
            var names = cameraType.map(function(obj) {
                return obj.name
            });
            var ids = cameraType.map(function(obj) {
                return obj.id
            });
            $('#SSBMHY').val(names.join('/')).attr('data-value', ids.join('/'))
        })

        //获取所属部门
        .on('getDepartment', function(e) {
            var cameraDepartment = e.detail;
            $('#SSXQGAJG').val(cameraDepartment.name).attr('data-value', cameraDepartment.id)
        })
        //获取定位
        .on('getLocation', function(e) {
            var location = e.detail;
            $('#JD').val(location.lng);
            $('#WD').val(location.lat);
            if($("#image-list2 .image-item").length > 1) {
                JDWDDisparity();
            }
        });
    $('body')
        //提交数据
        .on('tap', '#btn_submit', function() {
            try {
                var postData = {
                    SBBM: $('input[name="SBBM"]').val(),
                    SBMC: $('input[name="SBMC"]').val(),
                    SBCS: $('input[name="SBCS"]').attr("data-value"),
                    XZQY: $('input[name="XZQY"]').val(),
                    JKDWLX: $('input[name="JKDWLX"]').attr("data-value"),
                    SBXH: $('input[name="SBXH"]').val(),
                    DWSC: $('input[name="DWSC"]').val(),
                    IPV4: $('input[name="IPV4"]').val(),
                    IPV6: $('input[name="IPV6"]').val(),
                    MACDZ: $('input[name="MACDZ"]').val(),
                    SXJLX: $('input[name="SXJLX"]').attr("data-value"),
                    SXJGNLX: $('input[name="SXJGNLX"]').attr("data-value"),
                    BGSX: $('input[name="BGSX"]').attr("data-value"),
                    SXJBMGS: $('input[name="SXJBMGS"]').attr("data-value"),
                    AZDZ: $('input[name="AZDZ"]').val(),
                    JD: $('input[name="JD"]').val(),
                    WD: $('input[name="WD"]').val(),
                    SXJWZLX: $('input[name="SXJWZLX"]').attr("data-value"),
                    JSFW: $('input[name="JSFW"]').attr("data-value"),
                    LWSX: $('input[name="LWSX"]').attr("data-value"),
//                  ssxqgajg: $('input[name="SSXQGAJG"]').attr("data-value"),
					SSXQGAJG: $('input[name="SSXQGAJG"]').val(),
                    AZSJ: $('input[name="AZSJ"]').val(),
                    GLDW: $('input[name="GLDW"]').attr("data-value"),
                    GLDWLXFS: $('input[name="GLDWLXFS"]').val(),
                    LXBCTS: $('input[name="LXBCTS"]').val(),
                    SBZT: $('input[name="SBZT"]').attr("data-value"),
                    SSBMHY: $('input[name="SSBMHY"]').attr("data-value"),
                    czr: localStorage.getItem("drsUserName"), //当前登录账号
                    shzt:"1"
                    /*type: 1,*/
                }
                if(deviceId != undefined){
                	postData.id = deviceId;
                }
                if(showstatus == "3" || showstatus == "1"){
                	var txzpdata = [];
                	for(var i =0; i< $("#editTXZP .allimgdiv").length;i++){
                		txzpdata.push($("#editTXZP .allimgdiv").eq(i).find("img").attr("id"));
                	}
                	var sjzpdata = [];
                	for(var i =0; i< $("#editSJZP .allimgdiv").length;i++){
                		sjzpdata.push($("#editSJZP .allimgdiv").eq(i).find("img").attr("id"));
                	}
                	postData.txzp = txzpdata.join("/");
                	postData.sjzp = sjzpdata.join("/");
                	if(showstatus == "1"){
                		postData.shzt = "1";
                	}else{
                		postData.shzt = "3";
                	}
                	
                }
                var intYz = new RegExp("^([0-9]*)$");
                var videoday = new RegExp("^[0-9]*$", "").test(postData.LXBCTS);
                var ipv4_1 = (/^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/).test(postData.IPV4);
                var ipv6_1 = (/^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/).test(postData.IPV6);
                var macc = /^([A-Fa-f0-9]{2}:){5}[A-Fa-f0-9]{2}$/.test(postData.MACDZ);
                /*if(postData.IPV4) {
                    if(!ipv4_1) {
                        mui.toast('ipv4格式错误');
                        return false;
                    }
                }
                if(postData.MACDZ) {
                    if(!macc) {
                        mui.toast('MAC格式错误');
                        return false;
                    }
                }*/
                if(!postData.SBBM) {
                    mui.toast('请输入设备编码');
                    return false;
                } else if(!intYz.test(postData.SBBM)) {
                    mui.toast('设备编码只能输入数字');
                    return false;
                } else if(postData.SBBM.length < 20) {
                    mui.toast('请输入20位数字的设备编码');
                    return false;
                }
               
                if(!postData.GLDW) {
                    mui.toast('请输入管理单位');
                    return false;
                }
                var url = app.host + '/VIID/CamerasToSync.action';
                var uploader = plus.uploader.createUpload(url, {
                    method: 'POST'
                }, function(msg, state) {
                    var resFlag = JSON.parse(msg.responseText);
                    //state == 200  && resFlag.ResponseStatusList.StatusCode == 0
                    if(state == 200 && resFlag.ResponseStatusList.StatusCode == 0) {
                        mui.toast('保存成功');
                        mui.back();
                    } else {
                        //hideLoading();
                        mui.toast('保存失败');
                    }
                });

                //uploader.setRequestHeader('secretKey', app.secretKey);

                //添加上传数据
//              console.log(JSON.stringify(postData))
                mui.each(postData, function(index, element) {
                    if(index !== 'images') {
                        uploader.addData(index, element)
                    }
                });
                var imgflag1 = 0,
                    imgflag2 = 0;
                //添加上传文件
                mui.each(imgFiles, function(index, element) {
                    if(showType == 1) {
                        if(index >= 3) {
                            imgflag1 = 1;
                        } else {
                            var f = imgFiles[index];
                            uploader.addFile(f.path, {
                                key: "txzp-" + f.name
                            });
                        }
                    } else if(showType == 2) {
                        if(index + $("#editTXZP .allimgdiv").length >= 3) {
                            imgflag1 = 1;
                        } else {
                            var f = imgFiles[index];
                            uploader.addFile(f.path, {
                                key: "txzp-" + f.name
                            });
                        }
                    }

                });

                //添加上传文件
                mui.each(imgFiles2, function(index, element) {
                    if(showType == 1) {
                        if(index >= 3) {
                            imgflag2 = 1;
                        } else {
                            var f = imgFiles2[index];
                            uploader.addFile(f.path, {
                                key: "sjzp-" + f.name
                            });
                        }
                    } else if(showType == 2 || showType == 3) {
                        if(index + $("#editSJZP .allimgdiv").length >= 3) {
                            imgflag1 = 1;
                        } else {
                            var f = imgFiles2[index];
                            uploader.addFile(f.path, {
                                key: "sjzp-" + f.name
                            });
                        }
                    }
                });
                if(imgflag1) {
                    mui.toast("特写照片不可超过3张");
                    return false;
                }
                if(imgflag2) {
                    mui.toast("实景照片不可超过3张");
                    return false;
                }
                if(showType == 2 || showType == 3) {
                    if($("#editSJZP .allimgdiv").length > 3) {
                        mui.toast("实景照片不可超过3张");
                        return false;
                    }
                    if($("#editTXZP .allimgdiv").length > 3) {
                        mui.toast("特写照片不可超过3张");
                        return false;
                    }
                }
                $("#btn_submit").attr("disabled","disabled")
                //开始上传任务
                uploader.start();
                //showLoading();
            } catch(e) {
                document.write(e.message)
            }
        })
        //选择摄像机类型
        .on('tap', '#SXJGNLX', function() {
            var cameraType = [];
            if($('#SXJGNLX').attr('data-value')) {
                cameraType = ($('#SXJGNLX').attr('data-value')).split('/')
            }
            mui.openWindow({
                url: 'camera-type.html',
                extras: {
                    cameraType: cameraType,
                    gndata: gndata
                }
            });
        })
        //选择摄像机位置类型
        .on('tap', '#SXJWZLX', function() {
            var cameraType = [];
            if($('#SXJWZLX').attr('data-value')) {
                cameraType = ($('#SXJWZLX').attr('data-value')).split('/')
            }
            mui.openWindow({
                url: 'camera-position.html',
                extras: {
                    cameraType: cameraType,
                    wzdata: wzdata
                }
            });
        })
        //选择摄像机位置类型
        .on('tap', '#SSBMHY', function() {
            var cameraType = [];
            if($('#SSBMHY').attr('data-value')) {
                cameraType = ($('#SSBMHY').attr('data-value')).split('/')
            }
            mui.openWindow({
                url: 'industry.html',
                extras: {
                    cameraType: cameraType,
                    industrydata: industrydata
                }
            });
        })
        //选择所属部门
        /*.on('tap', '#SSXQGAJG', function() {
            mui.openWindow({
                url: 'camera-department.html'
            });
        })*/

        //定位
        .on('tap', '#btn_location', function() {
            var lng = $('#JD').val().trim();
            var lat = $('#WD').val().trim();

            var location = {
                lng: lng,
                lat: lat
            }

            mui.openWindow({
                url: 'location.html',
                extras: location
            });
            /*
            localStorage.setItem("clearJDWD", "1");
            setJDWDInt();

            //new activity
            var main = plus.android.runtimeMainActivity();
            var Intent = plus.android.importClass("android.content.Intent");
            var intent = new Intent(main.getIntent());
            intent.setClassName(main, "cn.goldencis.drs.drsActivity");
            intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
            // 传值
            intent.putExtra("valuename", "pass value！");
            main.startActivity(intent);
            //new activity end
            */

        });
}

/**
 * 初始化图片域占位
 *
 */
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
                        name: "images" + imgIndex,
                        path: zip.target,
                        id: "img-" + imgIndex
                    });
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

function newPlaceholder2(imageList2) {

    var fileInputArray = [].slice.call(imageList2.querySelectorAll('.file'));
    if(fileInputArray &&
        fileInputArray.length > 0 &&
        fileInputArray[fileInputArray.length - 1].parentNode.classList.contains('space')) {
        return;
    };
    imgIdNum2++;
    var placeholder = document.createElement('div');
    placeholder.setAttribute('class', 'image-item space');
    var up = document.createElement("div");
    up.setAttribute('class', 'image-up');
    //删除图片
    var closeButton = document.createElement('div');
    closeButton.setAttribute('class', 'image-close');
    closeButton.innerHTML = 'X';
    closeButton.id = "img-" + imgIndex2;
    //小X的点击事件
    closeButton.addEventListener('tap', function(event) {

        if(imgFiles2.length > 1) {
            compareFlagJDWD = 1;
        } else {
            compareFlagJDWD = 0;
        }
        setTimeout(function() {
            for(var temp = 0; temp < imgFiles2.length; temp++) {
                if(imgFiles2[temp].id == closeButton.id) {
                    imgFiles2.splice(temp, 1);
                }
            }
            imageList2.removeChild(placeholder);
        }, 0);
        return false;
    }, false);
    var fileInput = document.createElement('div');
    fileInput.setAttribute('class', 'file');
    fileInput.setAttribute('id', 'image-' + imgIdNum2);
    fileInput.addEventListener('tap', function(event) {
        var self = this;
        var index = (this.id).substr(-1);
        //plus.gallery.pick

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
                    imgFiles2.splice(index - 1, 1, {
                        name: "images" + index,
                        path: e
                    });
                    compareFlagJDWD = 1;
                } else { //加号
                    placeholder.classList.remove('space');
                    imgFiles2.push({
                        name: "images" + imgIndex2,
                        path: zip.target,
                        id: "img-" + imgIndex2
                    });
                    imgIndex2++;
                    newPlaceholder2(imageList2);
                    compareFlagJDWD = 1;
                }
                up.classList.remove('image-up');
                placeholder.style.backgroundImage = 'url(' + zip.target + ')';
            }, function(zipe) {
                mui.toast('压缩失败！')
            });

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
            //mui.toast(e.message);
        }, {});
    }, false);
    placeholder.appendChild(closeButton);
    placeholder.appendChild(up);
    placeholder.appendChild(fileInput);
    imageList2.appendChild(placeholder);

}

/**
 * 字典项
 *
 */
function initWorkTypePicker(data) {
    var workTypePicker = new mui.PopPicker();
    var workTypePickerjkdwlx = new mui.PopPicker();
    var workTypePickersxj = new mui.PopPicker();
    var workTypePickerbgsx = new mui.PopPicker();
    var workTypePickerbmgs = new mui.PopPicker();
    var workTypePickerjkfw = new mui.PopPicker();
    var workTypePickerlwsx = new mui.PopPicker();
    var workTypePickersbzt = new mui.PopPicker();
    var workTypePickergldw = new mui.PopPicker();

    mui.ajax(app.host + '/VIID/Dicts.action?userName='+localStorage.getItem("drsUserName"), {
        dataType: 'json', //服务器返回json格式数据
        type: 'get', //HTTP请求类型
        headers: {
            'Content-Type': 'application/json'
        },
        success: function(data) {
        	var datalistval = [];
        	$.each(data.DictList, function(index,val) {
        		datalistval.push(val.Dict)
        	});
            $.each(datalistval, function(idx, val) {
                switch(val.LXBM) {
                    case "SBCS":
                        var pp = {
                            value: val.ZDXBM,
                            text: val.ZDXMC
                        }
                        allsbcs.push(pp);
                        return;
                    case "GLDW":
                    	var ppgldw = {
                    		value: val.ZDXBM,
                            text: val.ZDXMC
                    	}
                    	allgldw.push(ppgldw);
                        return;
                    case "JKDWLX":
                        var ppjkdw = {
                            value: val.ZDXBM,
                            text: val.ZDXMC
                        }
                        alljkdwlx.push(ppjkdw);
                        return;
                    case "SXJLX":
                        var ppsxj = {
                            value: val.ZDXBM,
                            text: val.ZDXMC
                        }
                        allsxj.push(ppsxj);
                        return;
                    case "BGSX":
                        var ppbgsx = {
                            value: val.ZDXBM,
                            text: val.ZDXMC
                        }
                        allbgsx.push(ppbgsx);
                        return;
                    case "SXJBMGS":
                        var ppbmgs = {
                            value: val.ZDXBM,
                            text: val.ZDXMC
                        }
                        allbmgs.push(ppbmgs);
                        return;
                    case "JSFW":
                        var ppjkfw = {
                            value: val.ZDXBM,
                            text: val.ZDXMC
                        }
                        alljkfw.push(ppjkfw);
                        return;
                    case "LWSX":
                        var pplwsx = {
                            value: val.ZDXBM,
                            text: val.ZDXMC
                        }
                        alllwsx.push(pplwsx);
                        return;
                    case "SBZT":
                        var ppsbzt = {
                            value: val.ZDXBM,
                            text: val.ZDXMC
                        }
                        allsbzt.push(ppsbzt);
                        return;
                    case "SXJGNLX":
                        var ppgn = {
                            value: val.ZDXBM,
                            text: val.ZDXMC
                        }
                        gndata.push(ppgn);
                        return;
                    case "SXJWZLX":
                        var ppwz = {
                            value: val.ZDXBM,
                            text: val.ZDXMC
                        }
                        wzdata.push(ppwz);
                        return;
                    case "SSBMHY":
                        var ppin = {
                            value: val.ZDXBM,
                            text: val.ZDXMC
                        }
                        industrydata.push(ppin);
                        return;
                    default:
                        return;
                }
            });
            workTypePicker.setData(allsbcs);
            workTypePickerjkdwlx.setData(alljkdwlx);
            workTypePickersxj.setData(allsxj);
            workTypePickerbgsx.setData(allbgsx);
            workTypePickerbmgs.setData(allbmgs);
            workTypePickerjkfw.setData(alljkfw);
            workTypePickerlwsx.setData(alllwsx);
            workTypePickersbzt.setData(allsbzt);
            workTypePickergldw.setData(allgldw);

            //服务器返回响应，根据响应结果，分析是否登录成功；
        },
        error: function(xhr, type, errorThrown) {
            //异常处理；
            mui.toast(type)
        }
    });

    $('#SBCS').on('tap', function() {
        workTypePicker.show(function(items) {
            $('#SBCS').val(items[0].text).attr('data-value', items[0].value);
        });
    });
    $('#GLDW').on('tap', function() {
        workTypePickergldw.show(function(items) {
            $('#GLDW').val(items[0].text).attr('data-value', items[0].value);
        });
    });
    $('#JKDWLX').on('tap', function() {
        workTypePickerjkdwlx.show(function(items) {
            $('#JKDWLX').val(items[0].text).attr('data-value', items[0].value);
        });
    });
    $('#SXJLX').on('tap', function() {
        workTypePickersxj.show(function(items) {
            $('#SXJLX').val(items[0].text).attr('data-value', items[0].value);
        });
    });
    $('#BGSX').on('tap', function() {
        workTypePickerbgsx.show(function(items) {
            $('#BGSX').val(items[0].text).attr('data-value', items[0].value);
        });
    });
    $('#SXJBMGS').on('tap', function() {
        workTypePickerbmgs.show(function(items) {
            $('#SXJBMGS').val(items[0].text).attr('data-value', items[0].value);
        });
    });
    $('#JSFW').on('tap', function() {
        workTypePickerjkfw.show(function(items) {
            $('#JSFW').val(items[0].text).attr('data-value', items[0].value);
        });
    });
    $('#LWSX').on('tap', function() {
        workTypePickerlwsx.show(function(items) {
            $('#LWSX').val(items[0].text).attr('data-value', items[0].value);
        });
    });
    $('#SBZT').parent().on('tap', function() {
        workTypePickersbzt.show(function(items) {
            $('#SBZT').val(items[0].text).attr('data-value', items[0].value);
        });
    });
}

//获取详情数据
function getDeviceData(sbbm, showType,showstatus) {
	initWorkTypePicker();
    mui.ajax(app.host + '/VIID/Camera.action?SBBM=' + sbbm+"&shzt="+showstatus, {
        dataType: 'json', //服务器返回json格式数据
        type: 'get', //HTTP请求类型
        headers: {
            'Content-Type': 'application/json'
        },
        success: function(data) {
        	console.log(JSON.stringify(data))
			data = {
				Camera:data
			}
            if(data != "") {
                $('#mui-content').html(template('temp-ip-box', data.Camera));
                getOtherData(data, data.Camera.SXJWZLX, "SXJWZLX", wzdata);
//              $('input[name="SSXQGAJG"]').attr("data-value", data.Camera.SSXQGAJG);
                getOtherData(data, data.Camera.SSBMHY, "SSBMHY", industrydata);
                getOtherData(data, data.Camera.SXJGNLX, "SXJGNLX", gndata);
                getSelectData(allsbcs, data.Camera.SBCS, "SBCS");
                getSelectData(allgldw, data.Camera.GLDW, "GLDW");
                getSelectData(alljkdwlx, data.Camera.JKDWLX, "JKDWLX");
                getSelectData(allsxj, data.Camera.SXJLX, "SXJLX");
                getSelectData(allbgsx, data.Camera.BGSX, "BGSX");
                getSelectData(allbmgs, data.Camera.SXJBMGS, "SXJBMGS");
                getSelectData(alljkfw, data.Camera.JSFW, "JSFW");
                getSelectData(alllwsx, data.Camera.LWSX, "LWSX");
                getSelectData(allsbzt, data.Camera.SBZT, "SBZT");
                newPlaceholder(document.getElementById('image-list')); //上传文件1
                newPlaceholder2(document.getElementById('image-list2')); //上传文件2
                if(data.Camera.JKDWLX == 1) {
                    $(".starthid").removeClass("hidden2");
                }

                if(showType == 2) {
                    $("#pageTitle").html("详情");
                    $(".editpen").removeClass("hidden");
                    $("#listHeader").removeClass("hidden");
                    $("#mui-content").removeClass("hidden");

                    $("body").on("tap", "#editpen", function() {
                        $(this).hide();
                        $("#pageTitle").html("编辑");
                        $(".addreadonly").removeAttr("readonly");
                        $("#listSBBM").attr("readonly", "readonly").css("color", "#999999");
                        $("#deviceList i").removeClass("hidden");
                        $("#detailsTXZP").addClass("hidden");
                        $("#editTXZP").removeClass("hidden");
                        $("#detailsSJZP").addClass("hidden");
                        $("#editSJZP").removeClass("hidden");
                        $("#JD").removeAttr("readonly");
                        $("#WD").removeAttr("readonly");
                        $("#btn_submit").removeClass("hidden");
                        allsbcs = [], alljkdwlx = [], allsxj = [], allbgsx = [], allbmgs = [], allwzlx = [], alljkfw = [], alllwsx = [], allsbzt = [],allgldw = [];
                        initWorkTypePicker();
                        initEvents();
                        startTimeFun();

                    })
                }
                if(showType == 3) {
                    //COPY
                    $("#pageTitle").html("录入");
                    $(".editpen").addClass("hidden");
                    $("#listHeader").removeClass("hidden");
                    $("#mui-content").removeClass("hidden");
                    $("#mui-content .addreadonly").removeAttr("readonly");
                    $("#listSBBM").val("");
                    $(".listclean").val("");
                    $("#deviceList i").removeClass("hidden");
                    $("#btn_submit").removeClass("hidden");
                    $("#detailsTXZP").addClass("hidden");
                    $("#editTXZP").removeClass("hidden");
                    $("#detailsSJZP").addClass("hidden");
                    $("#editSJZP").removeClass("hidden");
                    $("#JD").removeAttr("readonly");
                    $("#WD").removeAttr("readonly");
                    $(".allimgdiv").remove();
                    $("img.imgpictype").remove();
                    allsbcs = [], alljkdwlx = [], allsxj = [], allbgsx = [], allbmgs = [], allwzlx = [], alljkfw = [], alllwsx = [], allsbzt = [],allgldw = [];
                    initWorkTypePicker();
                    initEvents();
                    startTimeFun();
                }

            } else {
                mui.toast("失败");
            }
            //服务器返回响应，根据响应结果，分析是否登录成功；
        },
        error: function(xhr, type, errorThrown) {
            //异常处理；
            //console.log(type);
            mui.toast("获取失败");
        }
    });
}

function getOtherData(data, onedata, id, eachdata) {
    var dataall = "";
    $("#" + id).attr("data-value", onedata);
    if(onedata != undefined) {
        if(onedata.indexOf("/") > 0) {
            var aa = onedata.split("/");
            $.each(eachdata, function(inx, val) {
                $.each(aa, function(ix, obj) {
                    if(val.value == obj) {
                        dataall += val.text + "/";
                    }
                });
            });
        } else {
            var aa = onedata;
            $.each(eachdata, function(inx, val) {
                if(val.value == aa) {
                    dataall += val.text + "/";
                }
            });
        }
    } else {
        dataall += "/";
    }
    $("#" + id).val(dataall.substring(0, dataall.length - 1));
}

function getSelectData(data, id, inx) {
    $('input[name=' + inx + ']').attr("data-value", id);
    $.each(data, function(idx, val) {
        if(val.value == id) {
            $("#" + inx).val(val.text);
        }
    })
}

function jumpNewDevice(de_detail) {
    mui.openWindow({
        url: 'device-add.html',
        extras: {
            de_detail: de_detail
        }
    });
}

var JDWDDisparity = function() {
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
            //更新JD WD
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

function OD(a, b, c) {
    while(a > c) a -= c - b;
    while(a < b) a += c - b;
    return a;
}

function SD(a, b, c) {
    b != null && (a = Math.max(a, b));
    c != null && (a = Math.min(a, c));
    return a;
}

function getDistance(a_lat, a_lng, b_lat, b_lng) {
    var a = Math.PI * OD(a_lat, -180, 180) / 180;
    var b = Math.PI * OD(b_lat, -180, 180) / 180;
    var c = Math.PI * SD(a_lng, -74, 74) / 180;
    var d = Math.PI * SD(b_lng, -74, 74) / 180;
    return 6370996.81 * Math.acos(Math.sin(c) * Math.sin(d) + Math.cos(c) * Math.cos(d) * Math.cos(b - a));
}
template.helper('imgUrl', function(value) {
    if(typeof(value) == "undefined" || value == null){
    	return "";
    }else{
        if(value.indexOf("http") >= 0){
            return value;
        }else{
            var imgpath = app.host + value;
            return imgpath;
        }
    }
});