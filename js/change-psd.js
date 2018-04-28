try {
    mui.plusReady(function() {
        mui.init();
        var saveButton = document.getElementById("resetbutton");
        saveButton.addEventListener('tap', function(event) {
            sendData();
        });
    });
} catch(e) {
    mui.toast("失败");
}

function sendData() {
    var oldpsd = $.trim($(".oldpsd").val());
    var newpsd = $.trim($(".newpsd").val());
    var newpsaagain = $.trim($(".newpsaagain").val());
    var oldlocal = localStorage.getItem("drsPassWord");
    var oldname = localStorage.getItem("drsUserName")
    var flag = new RegExp("^[0-9a-zA-Z]*$", "").test(newpsd);
    if(oldpsd == "") {
        mui.toast("请输入原密码");
        return false;
    } else if(oldlocal != oldpsd) {
        mui.toast("原密码输入有误");
        return false;
    }
    if(newpsd == "") {
        mui.toast("请输入新密码");
        return false;
    } else if(newpsd.length < 6 || newpsd.length > 20) {
        mui.toast("密码长度在6-20位之间");
        return false;
    }
    if(newpsaagain == "") {
        mui.toast("请再次输入新密码");
        return false;
    } else if(newpsaagain != newpsd) {
        mui.toast("两次密码不一致");
        return false;
    }

    var dataparame = {
        User: {
            userName: oldname,
            oldpassword: oldpsd,
            newpassword1: newpsd,
            newpassword2: newpsaagain
        }
    }

    mui.ajax(app.host + '/VIID/PasswordReset.action', {
        data: dataparame,
        dataType: 'json', //服务器返回json格式数据
        type: 'post', //HTTP请求类型
        headers: {
            'Content-Type': 'application/json'
        },
        success: function(msg) {
            if(msg.ResponseStatusList.StatusCode == 0) {
                mui.toast("重置密码成功");
                localStorage.removeItem("drsPassWord");
                localStorage.removeItem("drsToken");
                setTimeout(function() {
                    plus.runtime.restart();
                    //                  localStorage.clear();
                    mui.openWindow({
                        url: 'login.html',
                        id: 'login',
                        show: {
                            aniShow: 'pop-in'
                        },
                        waiting: {
                            autoShow: false
                        }
                    });
                }, 1000)
            } else {
                mui.toast("重置密码失败");
            }
        },
        error: function(xhr, type, errorThrown) {
            //异常处理；
            console.log(type);
        }
    });

}