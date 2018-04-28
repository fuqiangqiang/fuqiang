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
    allsbzt = [];
mui.plusReady(function() {
    mui.init();
    initWorkTypePicker();
    var self = plus.webview.currentWebview();
//  getDeviceData(self.de_detail);
    getDeviceData("37010121111111111112");
    $("body").on("tap", "#editpen", function() {
        $(".detail-title").addClass("hidden");
        $(".edit-title").removeClass("hidden");
        $(".addreadonly").removeAttr("readonly");
        $("input[name='SBBM']").focus();
        $("#btn_submit").removeClass("hidden");
        initWorkTypePicker();
        initEvents();
//      newPlaceholder();
//      newPlaceholder2();
        //起始日期选择
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
    })
    console.log(self.de_detail);
});

function initEvents() {
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
            console.log(1111)
            var cameraType = e.detail;
            var names = cameraType.map(function(obj) {
                return obj.name
            });
            var ids = cameraType.map(function(obj) {
                return obj.id
            });
            console.log(ids)
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
                    SSXQGAJG: $('input[name="SSXQGAJG"]').attr("data-value"),
                    AZSJ: $('input[name="AZSJ"]').val(),
                    GLDW: $('input[name="GLDW"]').val(),
                    GLDWLXFS: $('input[name="GLDWLXFS"]').val(),
                    LXBCTS: $('input[name="LXBCTS"]').val(),
                    SBZT: $('input[name="SBZT"]').attr("data-value"),
                    SSBMHY: $('input[name="SSBMHY"]').attr("data-value"),
                    CZR: 1,
                    type: 1,
                }
                var videoday = new RegExp("^[0-9]*$", "").test(postData.LXBCTS);
                var ipv4_1 = (/^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/).test(postData.IPV4);
                //              var ipv6_1 = (/^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/).test(postData.IPV6);
                var macc = /^([A-Fa-f0-9]{2}:){5}[A-Fa-f0-9]{2}$/.test(postData.MACDZ);
                if(postData.IPV4) {
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
                }

                if(!postData.SBBM) {
                    mui.toast('请输入设备编码');
                    return false;
                }
                if(!postData.SBMC) {
                    mui.toast('请输入设备名称');
                    return false;
                }
                if(!postData.SBCS) {
                    mui.toast('请选择设备厂商');
                    return false;
                }
                if(!postData.XZQY) {
                    mui.toast('请输入行政区域');
                    return false;
                }
                if(!postData.AZDZ) {
                    mui.toast('请输入安装地址');
                    return false;
                }
                if(!postData.JD) {
                    mui.toast('请输入经度');
                    return false;
                }
                if(!postData.WD) {
                    mui.toast('请输入纬度');
                    return false;
                }
                if(!postData.SXJWZLX) {
                    mui.toast('请选择摄像机位置类型');
                    return false;
                }
                if(!postData.LWSX) {
                    mui.toast('请选择联网属性');
                    return false;
                }
                if(!postData.SSXQGAJG) {
                    mui.toast('请选择所属辖区公安机关');
                    return false;
                }
                if(!postData.JKDWLX) {
                    mui.toast('请选择监控点位类型');
                    return false;
                } else {
                    if(postData.JKDWLX == 1) {
                        if(!postData.AZSJ) {
                            mui.toast('请输入安装时间');
                            return false;
                        }
                        if(!postData.GLDWLXFS) {
                            mui.toast('请输入管理单位联系方式');
                            return false;
                        }
                        if(!postData.LXBCTS) {
                            mui.toast('请输入录像保存天数');
                            return false;
                        } else {
                            if(!videoday) {
                                mui.toast('录像保存天数只能是整数');
                                return false;
                            }
                        }
                    }
                }
                if(!postData.GLDW) {
                    mui.toast('请输入管理单位');
                    return false;
                }
                if(!postData.SBZT) {
                    mui.toast('请选择设备状态');
                    return false;
                }

                mui.ajax('http://124.128.235.43/camera/VIID/CamerasToSync', {
                    data: postData,
                    dataType: 'json', //服务器返回json格式数据
                    type: 'post', //HTTP请求类型
                    timeout: 10000, //超时时间设置为10秒；
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    success: function(data) {
                        mui.toast(data)
                        //服务器返回响应，根据响应结果，分析是否登录成功；
                    },
                    error: function(xhr, type, errorThrown) {
                        //异常处理；
                        console.log(type);
                        mui.toast(type)
                    }
                });

                var url = 'http://10.10.16.166:8080/test/upload';
                var uploader = plus.uploader.createUpload(url, {
                    method: 'POST'
                }, function(msg, state) {
                    var resFlag = JSON.parse(msg.responseText);
                    console.log("resFlag:" + JSON.stringify(resFlag));

                    if(state == 200 && resFlag.resultCode == 1) {
                        mui.toast('提交成功');
                    } else {
                        //hideLoading();
                        mui.toast('提交失败');
                    }
                });

                //uploader.setRequestHeader('secretKey', app.secretKey);

                //添加上传数据
                mui.each(postData, function(index, element) {
                    if(index !== 'images') {
                        console.log("index:" + index);
                        console.log("element:" + JSON.stringify(element));
                        uploader.addData(index, element)
                    }
                });
                //添加上传文件
                mui.each(imgFiles, function(index, element) {
                    var f = imgFiles[index];
                    uploader.addFile(f.path, {
                        key: "txzp-" + f.name
                    });
                });

                //添加上传文件
                mui.each(imgFiles2, function(index, element) {
                    var f = imgFiles2[index];
                    uploader.addFile(f.path, {
                        key: "sjzp-" + f.name
                    });
                });

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
        .on('tap', '#SSXQGAJG', function() {
            mui.openWindow({
                url: 'camera-department.html'
            });
        })
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
        });
}

/**
 * 初始化图片域占位
 *
 */
function newPlaceholder() {
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
                    newPlaceholder();
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

function newPlaceholder2() {
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
                    imgFiles2.splice(index - 1, 1, {
                        name: "images" + index,
                        path: e
                    });
                } else { //加号
                    placeholder.classList.remove('space');
                    imgFiles2.push({
                        name: "images" + imgIndex2,
                        path: zip.target,
                        id: "img-" + imgIndex2
                    });
                    imgIndex2++;
                    newPlaceholder2();
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
    imageList2.appendChild(placeholder);
}

/**
 * 工单类型选择器
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

    mui.ajax('http://124.128.235.43/camera/VIID/Dicts', {
        dataType: 'json', //服务器返回json格式数据
        type: 'get', //HTTP请求类型
        timeout: 10000, //超时时间设置为10秒；
        headers: {
            'Content-Type': 'application/json'
        },
        success: function(data) {
            $.each(data.DictList, function(idx, val) {
                switch(val.LXBM) {
                    case "SBCS":
                        var pp = {
                            value: val.ZDXBM,
                            text: val.ZDXMC
                        }
                        allsbcs.push(pp);
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
            console.log(JSON.stringify(allsbcs))
            workTypePicker.setData(allsbcs);
            workTypePickerjkdwlx.setData(alljkdwlx);
            workTypePickersxj.setData(allsxj);
            workTypePickerbgsx.setData(allbgsx);
            workTypePickerbmgs.setData(allbmgs);
            workTypePickerjkfw.setData(alljkfw);
            workTypePickerlwsx.setData(alllwsx);
            workTypePickersbzt.setData(allsbzt);

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

/**
 * 工单流程选择器
 *
 */
/*function initWorkFlowPicker(data) {
    var workFlowPicker = new mui.PopPicker();
    workFlowPicker.setData(data);
    $('#work_flow').on('tap', function () {
        workFlowPicker.show(function (items) {
            $('#work_flow').val(items[0].text).attr('data-value', items[0].value);
        });
    });
}*/

/**
 * 获取工单级别
 */
/*function getOrderLevel() {
    postAjax('mobile/dict/getDictByType', {type: 'priority'}, function (msg) {
        $('#work_priority_box').append(template('temp_work_priority', msg));
    });
}*/
/**
 * 获取工单类型
 */
function getOrderType() {
    return initWorkTypePicker();
    /*    postAjax('json/a.json', {type: 'workType'}, function (msg) {
            console.log(JSON.stringify(msg));
            initWorkTypePicker($.map(msg, function (obj) {
                return {value: obj.value, text: obj.description}
            }));
        });*/
}

//获取详情数据
function getDeviceData(sbbm) {
    getAjax("/VIID/Camera",{SBBM:sbbm},function(data){
        console.log(JSON.stringify(data))
            if(data.StatusCode == 0){
//              console.log(JSON.stringify(data.Camera))
                $('#mui-content').html(template('temp-ip-box', data.Camera));
                getSelectData(allsbcs,data.Camera.SBCS,"SBCS");
                getSelectData(alljkdwlx,data.Camera.JKDWLX,"JKDWLX");
                getSelectData(allsxj,data.Camera.SXJLX,"SXJLX");
                getSelectData(allbgsx,data.Camera.BGSX,"BGSX");
                getSelectData(allbmgs,data.Camera.SXJBMGS,"SXJBMGS");
                getSelectData(alljkfw,data.Camera.JSFW,"JSFW");
                getSelectData(alllwsx,data.Camera.LWSX,"LWSX");
                getSelectData(allsbzt,data.Camera.SBZT,"SBZT");
            }else{
                mui.toast("获取失败")
            }
    })
//  $.ajax('http://124.128.235.43/camera/VIID/Camera?SBBM='+sbbm, {
//      dataType: 'json', //服务器返回json格式数据
//      type: 'get', //HTTP请求类型
//      timeout: 10000, //超时时间设置为10秒；
//      headers: {
//          'Content-Type': 'application/json'
//      },
//      success: function(data) {
//          console.log(data.StatusCode)
//          if(data.StatusCode == 0){
////              console.log(JSON.stringify(data.Camera))
//              $('#mui-content').html(template('temp-ip-box', data.Camera));
//              getSelectData(allsbcs,data.Camera.SBCS,"SBCS");
//              getSelectData(alljkdwlx,data.Camera.JKDWLX,"JKDWLX");
//              getSelectData(allsxj,data.Camera.SXJLX,"SXJLX");
//              getSelectData(allbgsx,data.Camera.BGSX,"BGSX");
//              getSelectData(allbmgs,data.Camera.SXJBMGS,"SXJBMGS");
//              getSelectData(alljkfw,data.Camera.JSFW,"JSFW");
//              getSelectData(alllwsx,data.Camera.LWSX,"LWSX");
//              getSelectData(allsbzt,data.Camera.SBZT,"SBZT");
//          }else{
//
//          }
//          //服务器返回响应，根据响应结果，分析是否登录成功；
//      },
//      error: function(xhr, type, errorThrown) {
//          console.log(789678678)
//          //异常处理；
//          console.log(type);
//          mui.toast(type)
//      }
//  });
}
function getSelectData(data,id,inx){
    $.each(data,function(idx,val){
        if(val.value == id){
//          console.log(id.substring())
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