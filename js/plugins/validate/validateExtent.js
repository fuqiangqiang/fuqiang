jQuery(document).ready(function () {
    //电话
    jQuery.validator.addMethod("phone", function (value, el) {
        var regMobile = /^((\+?86)|(\(\+86\)))?1\d{10}$/;//手机
        var regTel = /^((\+?86)|(\(\+86\)))?\d{3,4}-?\d{7,8}(-\d{3,4})?$/;//固话
        return this.optional(el) || (regMobile.test(value) || regTel.test(value));
    }, "请输入有效的电话");
    //url,自带不好用，覆写
    jQuery.validator.addMethod("url", function (value, el) {
        var reg = /(ht|f)tp(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*)?/;
        return this.optional(el) || reg.test(value);
    }, "请输入有效的url");




    /**以下逐步删除，重写*********************************** */


    //字符验证
    jQuery.validator.addMethod("specialChar", function (value, element) {
        var regular = /[\`\-\=\[\]\;\'\\\,\.\/\~\!\@\#\$\%\^\&\*\(\)\_\+\{\}\:\"\|\<\>\?\s·【】；‘’、，。~！￥……（）——｛｝：“”《》？]+.*/;
        if (regular.test(value)) {
            return false;
        };
        return true;
    }, "不可输入特殊字符"); //特殊字符包括空格

    //账户的限制
    jQuery.validator.addMethod("specialopew", function (value, element) {
        var regular = /^([^\`\+\-\~\!\#\$\%\^\&\*\|\}\{\=\"\'\！\￥\……\（\）\——]*[\+\~\!\#\$\%\^\&\*\|\}\{\=\"\'\`\！\?\_\:\<\>\•\“\”\；\‘\‘\〈\ 〉\￥\……\（\）\——\｛\｝\【\】\[\]\\\/\;\：\？\《\》\。\，\、\,\.\@\-\·]+.*)$/;
        if (regular.test(value)) {
            return false;
        };
        return true;
    }, "不可输入特殊字符"); //特殊字符包括空格
    //字符验证
    jQuery.validator.addMethod("specialCharNew", function (value, element) {
        var regular = /^([^\`\+\~\!\#\$\%\^\&\*\|}\{\=\"\'\！\￥\……\（\）\——]*[\+\~\!\#\$\%\^\&\*\|}\{\=\"\'\`\！\?\:\<\>\•\“\”\；\‘\‘\〈\〉\￥\……\（\）\——\｛\｝\【\】\\\;\：\？\《\》\。\，\、\,]+.*)$/;
        if (regular.test(value)) {
            return false;
        };
        return true;
    }, "不可输入特殊字符"); //输入字符允许包括空格

    //字符验证 当允许输入空格时，名称不能全部是空格输入
    jQuery.validator.addMethod("notAllSpace", function (value, element) {
        value = $.trim(value);
        if (value == '') {
            return false;
        };
        return true;
    }, "不可为空");

    //不可以输入未分组
    jQuery.validator.addMethod("nogroup", function (value, element) {
        value = $.trim(value);
        if (value == '未分组') {
            return false;
        };
        return true;
    }, "不可为未分组");

    /**
    * 字符长度限制 不可少于6个字符
    */
    jQuery.validator.addMethod("minSixChar", function (value, element) {
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
    }, "不可少于6个字符");
    /**
     * 字符长度限制 200字符限制
     */
    jQuery.validator.addMethod("twoHundredChar", function (value, element) {
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
    }, "不可超出200个字符");
    /**
     * 字符长度限制 100字符限制
     */
    jQuery.validator.addMethod("oneHunredChar", function (value, element) {
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
        if (length > 100) {
            return false;
        } else {
            return true;
        }
    }, "不可超出100个字符");

    /**
     * 字符长度限制 128字符限制
     */
    jQuery.validator.addMethod("onetwoeightdChar", function (value, element) {
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
        if (length > 128) {
            return false;
        } else {
            return true;
        }
    }, "不可超出128个字符");

    /**
     * 字符长度限制 50字符限制
     */
    jQuery.validator.addMethod("fiftyChar", function (value, element) {
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
        if (length > 50) {
            return false;
        } else {
            return true;
        }
    }, "不可超出50个字符");

    /**
     * 字符长度限制 32字符限制
     */
    jQuery.validator.addMethod("thirtyChar", function (value, element) {
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
        if (length > 32) {
            return false;
        } else {
            return true;
        }
    }, "不可超出32个字符");

    /**
     * 字符长度限制 24字符限制
     */
    jQuery.validator.addMethod("twentyfourChar", function (value, element) {
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
    }, "不可超出24个字符");
    /**
     * 字符长度限制 20字符限制
     */
    jQuery.validator.addMethod("twentyChar", function (value, element) {
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
        if (length > 20) {
            return false;
        } else {
            return true;
        }
    }, "不可超出20个字符");


    /**
     *  特殊字符验证
     */
    jQuery.validator.addMethod("charVerif", function (value, element) {
        var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
        if (pattern.test(value)) {
            return false;
        } else {
            return true;
        }
    }, "包含特殊字符");

    /**
     * 字符长度限制 16字符限制
     */
    jQuery.validator.addMethod("tenChar", function (value, element) {
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
        if (length > 16) {
            return false;
        } else {
            return true;
        }
    }, "不可超出16个字符");
    /**
     * 只允许输入中文字母数字下划线
     */
    jQuery.validator.addMethod("stringCheck", function (value, element) {
        return this.optional(element) || /^[u0391-uFFE5w]+$/.test(value);
    }, "只能包括中文字、英文字母、数字和下划线");
    /**
     * 字母数字
     */
    jQuery.validator.addMethod("isNeedString", function (value, element) {
        return this.optional(element) || /^[a-zA-Z0-9]*$/.test(value);
    }, "只可输入字母、数字");

    //手机号码验证
    jQuery.validator.addMethod("isPhone", function (value, element) {
        // var tel = /^[0-9]{11}$/;
        var tel = /^[1-9]\d{0,10}$/;
        return this.optional(element) || (tel.test(value));
    }, "请输入正确号码");

    // 只能输入数字
    jQuery.validator.addMethod("number", function (value, element) {
        var tel = /^[0-9]*$/;
        //var tel = /[^\d]/;
        return this.optional(element) || (tel.test(value));
    }, "只能输入整数");
    // 只能输入6位数字
    jQuery.validator.addMethod("sixnumber", function (value, element) {
        var reg = /^\d{6}$/
        return this.optional(element) || (reg.test(value));
    }, "只能输入6位数字");
    // 只能输入数字和小数点
    jQuery.validator.addMethod("double", function (value, element) {
        var tel = /^[0-9]+(.[0-9]+)?$/;
        return this.optional(element) || (tel.test(value));
    }, "只能输入整数或小数");
    // 最多两位小数
    jQuery.validator.addMethod("twopoint", function (value, element) {
        if (value.indexOf('.') > -1) {
            return value.split('.')[1].length <= 2;
        }
        else {
            return true
        }
    }, "最多两位小数");
    //手机限制最多11个字符
    jQuery.validator.addMethod("elevenPhone", function (value, element) {
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
        if (length > 11) {
            return false;
        } else {
            return true;
        }
    }, "请输入正确号码");



    //7到11位的限制
    // jQuery.validator.addMethod("isnoPhone", function(value, element) {
    //  var tel = /^(\d{7}|\d{11})$/;
    //  return this.optional(element) || (tel.test(value));
    // }, "最多11位数字");

    //请输入 只支持输入0~65535之间的正整数
    jQuery.validator.addMethod("needNum", function (value, element) {
        var reg = /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([1-9][0-9]{3})|([1-9][0-9]{2})|([1-9][0-9]{1})|([0-9]))$/;
        return this.optional(element) || (reg.test(value));
    }, "0~65535之间的整数");

    //IP地址验证
    jQuery.validator.addMethod("isIp", function (value, element) {
        var ip = /^((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))$/;
        return this.optional(element) || (ip.test(value));
    }, "IP地址格式不正确");
    //网关验证
    jQuery.validator.addMethod("isnetwork", function (value, element) {
        var ip = /^((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))$/;
        return this.optional(element) || (ip.test(value));
    }, "网关格式不正确");
    //子网掩码址验证
    jQuery.validator.addMethod("ischildnum", function (value, element) {
        var ip = /^((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))$/;
        return this.optional(element) || (ip.test(value));
    }, "子网掩码格式不正确");
    //IP段验证
    jQuery.validator.addMethod('isIpRange', function(value, element) {
        function _compare_ip(begin, end) {
            var temp1 = begin.split('.');
            var temp2 = end.split('.');

            for (var j = 0; j < 4; j++) {
                if (parseInt(temp1[j]) > parseInt(temp2[j])) {
                    return 1;
                } else if (parseInt(temp1[j]) < parseInt(temp2[j])) {
                    return -1;
                }
            }
            return 0;
        }

        function valid_ip(ip_range) {
            var re = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.([1-9]|\d\d|1\d\d|2[0-4]\d|25[0-4])$/;
            var ips = ip_range.split('-');
            if (ips.length == 1) {
                if (re.test(ips[0])) {
                    return true;
                }
            } else if (ips.length == 2) {
                if (re.test(ips[0]) && re.test(ips[1])) {
                    if (_compare_ip(ips[0], ips[1]) <= 0) {
                        return true;
                    }
                }
            }
            return false;
        }
        if (value == "") {
            return true;
        } else {
            var array = value.split(';');
            for (var i = 0; i < array.length; i++) {
                if (!valid_ip(array[i])) {
                    return false;
                }
            }
            return true;
        }
    }, 'IP地址格式不正确')

    //禁止输入汉字地址验证
    jQuery.validator.addMethod("chinese", function (value, element) {
        var ip = /[^\u4E00-\u9FA5]/;
        return this.optional(element) || (ip.test(value));
    }, "格式错误");

    //mac限制
    jQuery.validator.addMethod("mac", function (value, element) {
        var ip = /^([A-Fa-f0-9]{2}:){5}[A-Fa-f0-9]{2}$/;
        return this.optional(element) || (ip.test(value));
    }, "mac地址格式不正确");

    //经度限制
    jQuery.validator.addMethod("longitudedu", function (value, element) {
        var ip = /^\d+(\.\d{1,10})?$/;
        return this.optional(element) || (ip.test(value));
    }, "不可超出10位小数");
    //纬度限制
    jQuery.validator.addMethod("latitudedu", function (value, element) {
        var ip = /^(([0-9]|[1-9][1-9])(\.[0-9]{1,10})?|90)$/;
        return this.optional(element) || (ip.test(value));
    }, "不可超出10位小数");
    //邮箱验证
    jQuery.validator.addMethod("mailtest", function (value, element) {
        var ip = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return this.optional(element) || (ip.test(value));
    }, "邮箱格式不正确");

    //
    jQuery.validator.addMethod("compareCurrent", function (value, element) {
        var endTime = moment(value, 'YYYY-MM-DD HH:mm:ss').valueOf();
        //var endTime=$("#fixStrId").val();
        var now = moment();
        var beginTime = now.format('YYYY-MM-DD hh:mm:ss').valueOf();

        var displayTime = endTime - beginTime;
        if (displayTime < 0) {
            return false;
        };
        return true;
    }, "设置时间应晚于当前时间");

})
