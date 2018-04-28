var setIp = localStorage.getItem("drsIp") || '';
var hostUrl = 'http://' + setIp + '/drs';
var pageSize = 5;//每页多少条

var app = {
    host: hostUrl,//接口地址
    user: '',//登录用户
    secretKey: ''//登录用户密钥
}
var nonetworkflag = false;
var logoutflag = false;
var user_pic_url = "";

$(function () {
    //var param = JSON.parse(plus.runtime.arguments);

    app.user = localStorage.getItem("drsUserName");
    app.secretKey = localStorage.getItem("drsToken");

    //$("<img style='width:100%;height:100%;padding:0px;margin:0px;'/>").attr("src", ).appendTo($("#picture"));

//  app.host = 'http://10.10.16.166:8080/oms/';
//  app.user = 'system';
//  app.secretKey = 'j3ZO0ZL5hpuBD9Tob59s5+CHlODPjR4ZhRau9hwEqMaLTu+umRrrM9e9Q9r3mTt29DtZMTrz3ig7QXPtT3srACdgkbDrT2wKvHjUt54uhgq1McmAbrO4nW8Xqjds0M3HNyYO/ythg3Ln1nkkt+Fe28jpbHqURWpuKrEZDj3WIwibAxTFL3+5J/txJPC11dWSiSWL2wK7SXCYCFf9SgPuR2hejiJVPP3Ll4n386GB9oc=';

});

//定义扩展


/**
 * 通用post
 */
function postAjax(url, data, callback, isDebug) {
    //检查网络限制

    url = app.host + url;
//  url =  'http://10.10.18.16/oms' + url;
    console.log(url);
    $.ajax({
        type: 'post',
        url: url,
        data: data,
        success: function (response, status, xhr) {
            if (isDebug) {
                mui.alert('response:' + JSON.stringify(response));
                mui.alert('status:' + status);
                mui.alert('data:' + (typeof data === 'object' ? JSON.stringify(data) : data));
                mui.alert(url + '进入success');
            }
            //这里判断账户是否被顶替

            callback(response, status, xhr);
        },
        error: function (xhr, errorText, errorStatus) {
            //hideLoading();
            if (isDebug) {
                mui.alert('errorText:' + errorText);
                mui.alert('errorStatus:' + errorStatus);
                mui.alert('data:' + (typeof data === 'object' ? JSON.stringify(data) : data));
                mui.alert(url + '进入error');
            }
            callback({
                resultCode: 1,
                resultMsg: errorText
            }, errorStatus, xhr);
        }
    })
}

/**
 * 通用get
 */
function getAjax(url, data, callback, isDebug) {
    url = app.host + url;
    $.ajax({
        type: 'get',
        dataType: 'json',
        headers: {
            'Content-Type': 'application/json'
        },
        url: url,
        data: data,
        success: function (response, status, xhr) {
            if (isDebug) {
                 alert('response:' + JSON.stringify(response));
                 alert('status:' + status);
                 alert('data:' + (typeof data === 'object' ? JSON.stringify(data) : data));
                 alert(url + '进入success');
            }

            callback(response, status, xhr);
        },
        error: function (xhr, errorText, errorStatus) {
            //hideLoading();
            if (isDebug) {
                alert('errorText:' + errorText);
                alert('errorStatus:' + errorStatus);
                alert('data:' + (typeof data === 'object' ? JSON.stringify(data) : data));
                alert(url + '进入error');
            }
            callback({
                resultCode: 1,
                resultMsg: errorText
            }, errorStatus, xhr);
        }
    })
}


/**
 * ajax application/json
 */
function postAjaxType(url, data, callback, isDebug) {
    //检查网络限制

    url = app.host + url;
    $.ajax({
        type: 'post',
        url: url,
        data: data,
        contentType: 'application/json',
        headers: {
            secretKey: app.secretKey
        },
        success: function (response, status, xhr) {
            if (isDebug) {
                mui.alert('response:' + JSON.stringify(response));
                mui.alert('status:' + status);
                mui.alert('data:' + (typeof data === 'object' ? JSON.stringify(data) : data));
                mui.alert(url + '进入success');
            }


            callback(response, status, xhr);
        },
        error: function (xhr, errorText, errorStatus) {
            if (isDebug) {
                mui.alert('errorText:' + errorText);
                mui.alert('errorStatus:' + errorStatus);
                mui.alert('data:' + (typeof data === 'object' ? JSON.stringify(data) : data));
                mui.alert(url + '进入error');
            }
            callback({
                resultCode: 0,
                resultMsg: errorText
            }, errorStatus, xhr);
        }
    })
}

/**
 * 判断字符串是否为空
 */
String.prototype.isEmpty = function () {
    return this.trim() === '';
}

/**
 * 获取url传参
 *
 *
 */
function query(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var param = window.location.search.substr(1).match(reg);
    if (param !== null) {
        return unescape(param[2]);
    } else {
        return '';
    }
}

/**
 * 日期格式化
 */
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "H+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
/**
 * 表单序列化为JSON
 */
$.fn.serializeJSON = function () {
    var serializeObj = {};
    var array = this.serializeArray();
    var str = this.serialize();
    $(array).each(function () {
        if (serializeObj[this.name]) {
            if ($.isArray(serializeObj[this.name])) {
                serializeObj[this.name].push(this.value);
            } else {
                serializeObj[this.name] = [serializeObj[this.name], this.value];
            }
        } else {
            serializeObj[this.name] = this.value;
        }
    });
    return serializeObj;
};

/**
 * 数组与对象的深复制
 */
function deepCopy(obj) {
    if (typeof obj == 'object') {
        return JSON.parse(JSON.stringify(obj));
    }
    else {
        return obj
    }
    ;
}

/*
 * 预加载详情页面
 */
function preloadWebviewDetail(url, id) {
    return rtn = mui.preload({
        url: url,
        id: id
    });
}

/*
 * 触发目标窗口
 */
function muiFireDetail(target, event, data) {
    //触发目标窗口的自定义事件
    mui.fire(target, event, data);
    //显示窗口
    target.show("slide-in-right");
}


/**
 * 数据校验
 * @type {{specialopew, minSixChar, twentyfourChar}}
 */
var validate = function () {
    //账户限制
    var _specialopew = function (value) {
        var regular = /^([^\`\+\-\~\!\#\$\%\^\&\*\|\}\{\=\"\'\！\￥\……\（\）\——]*[\+\~\!\#\$\%\^\&\*\|\}\{\=\"\'\`\！\?\_\:\<\>\•\“\”\；\‘\‘\〈\ 〉\￥\……\（\）\——\｛\｝\【\】\[\]\\\/\;\：\？\《\》\。\，\、\,\.\@\-\·]+.*)$/;
        if (regular.test(value)) {
            return false;
        }
        ;
        return true;
    }
    /**
     * 字符长度限制 不可少于6个字符
     * @param value
     * @returns {boolean}
     * @private
     */
    var _minSixChar = function (value) {
        var regChinese = /[\u4E00-\u9FA5\uF900-\uFA2D]/; //是否含有中文（也包含日文和韩文）
        var regSpe = /[\uFF00-\uFFEF]/; //同理，是否含有全角符号的数
        var length = 0;
        for (i = 0; i < value.length; i++) {
            code = value.charAt(i);
            if (regChinese.test(code) || regSpe.test(code)) {
                length = length + 2
            } else {
                length++;
            }
        }
        if (length > 0 && length < 6) {
            return false;
        } else {
            return true;
        }
    }
    /**
     * 字符长度限制 24字符限制
     * @param value
     * @returns {boolean}
     * @private
     */
    var _twentyfourChar = function (value) {
        var regChinese = /[\u4E00-\u9FA5\uF900-\uFA2D]/; //是否含有中文（也包含日文和韩文）
        var regSpe = /[\uFF00-\uFFEF]/; //同理，是否含有全角符号的数
        var length = 0;
        for (i = 0; i < value.length; i++) {
            code = value.charAt(i);
            if (regChinese.test(code) || regSpe.test(code)) {
                length = length + 2
            } else {
                length++;
            }
        }
        if (length > 24) {
            return false;
        } else {
            return true;
        }
    }
    /**
     * 字符长度限制 不可大于200字符
     * @param value
     * @returns {boolean}
     * @private
     */
    var _twoHundredChar = function (value) {
        var regChinese = /[\u4E00-\u9FA5\uF900-\uFA2D]/; //是否含有中文（也包含日文和韩文）
        var regSpe = /[\uFF00-\uFFEF]/; //同理，是否含有全角符号的数
        var length = 0;
        for (i = 0; i < value.length; i++) {
            code = value.charAt(i);
            if (regChinese.test(code) || regSpe.test(code)) {
                length = length + 2
            } else {
                length++;
            }
        }
        if (length > 200) {
            return false;
        } else {
            return true;
        }
    }
    _isNeedString = function (value) {
        return /^[a-zA-Z0-9]*$/.test(value)
    }

    _checkPhoneAndNumber = function (value) {
        return (/^(0\d{2}-\d{8}(-\d{1,4})?)|(0\d{3}-\d{7,8}(-\d{1,4})?)$/.test(value)
            || /^1(3|4|5|7|8)\d{9}$/.test(value));
    }

    _specialCharNew = function (value) {
        var regular = /^([^\`\+\~\!\#\$\%\^\&\*\|}\{\=\"\'\！\￥\……\（\）\——]*[\+\~\!\#\$\%\^\&\*\|}\{\=\"\'\`\！\?\:\<\>\•\“\”\；\‘\‘\〈\〉\￥\……\（\）\——\｛\｝\【\】\\\;\：\？\《\》\。\，\、\,]+.*)$/;
        if (regular.test(value)) {
            return false;
        }
        ;
        return true;
    }

    _email = function (value) {
        return /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(value);
    }

    return {
        specialopew: _specialopew,
        minSixChar: _minSixChar,
        twentyfourChar: _twentyfourChar,
        twoHundredChar: _twoHundredChar,
        isNeedString: _isNeedString,
        checkPhoneAndNumber: _checkPhoneAndNumber,
        specialCharNew: _specialCharNew,
        email: _email
    };
}();