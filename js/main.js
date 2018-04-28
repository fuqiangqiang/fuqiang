var heighttop = 125;
var group;
var isbtn = false;
var uncommitted = {
    SBMC: '', //设备名称
    SBZT: '', //设备状态
    SXJLX: '', //摄像机类型
    AZSJ: '', //安装时间
    target: 'device-uncommitted.html'
}; //未提交查询参数
var pendingChecked = {
    SBMC: '', //设备名称
    SBZT: '', //设备状态
    SXJLX: '', //摄像机类型
    AZSJ: '', //安装时间
    target: 'device-pending-checked.html'
}; //待审核查询参数
var pendingSync = {
    SBMC: '', //设备名称
    SBZT: '', //设备状态
    SXJLX: '', //摄像机类型
    AZSJ: '', //安装时间
    target: 'device-pending-sync.html'
}; //待同步查询参数
var sync = {
    SBMC: '', //设备名称
    SBZT: '', //设备状态
    SXJLX: '', //摄像机类型
    AZSJ: '', //安装时间
    target: 'device-sync.html'
}; //已同步查询参数

$("#userName").html(localStorage.getItem("drsUserName"));
$("#roleName span").html(localStorage.getItem("drsRoleName"));

function initEvents() {
    //  alert(localStorage.getItem("getsearch"))
    //获取搜索页面传递的参数
    window.addEventListener('getQueryParam', function(e) {
        switch(e.detail.target) {
            case 'device-uncommitted.html':
                uncommitted = e.detail;
                break;
            case 'device-pending-checked.html':
                pendingChecked = e.detail;
                break;
            case 'device-pending-sync.html':
                pendingSync = e.detail;
                break;
            case 'device-sync.html':
                sync = e.detail;
                break;
        }
        if(e.detail.SBMC != "" || e.detail.SBZTName != "所有状态" || e.detail.SXJLXName != "所有类型") {
            if(e.detail.SBZTName != "所有状态") {
                $(".searchstatus").show();
                $(".searchstatus div").text(e.detail.SBZTName);
                $(".searchstatus div").attr("data-id", e.detail.SBZT)
            } else {
                $(".searchstatus").hide();
            }
            if(e.detail.SXJLXName != "所有类型") {
                $(".searchtype").show();
                $(".searchtype div").text(e.detail.SXJLXName);
                $(".searchtype div").attr("data-id", e.detail.SXJLX)
            } else {
                $(".searchtype").hide();
            }
            if(e.detail.SBMC != "") {
                $(".searchinput").show();
                $(".searchinput div").show();
                $(".searchinput span").show();
                $(".searchinput div").text(e.detail.SBMC);
            } else {
                $(".searchinput").hide();
            }
        } else {
            $(".searchinput").hide();
            $(".searchtype").hide();
            $(".searchstatus").hide();
        }
    })
    $('body')
        //打开搜索页面
        .on('tap', '#btn_search', function() {
            var paramData;
            switch($('.mui-control-item.mui-active').attr('data-wid')) {
                case 'device-uncommitted.html':
                    paramData = uncommitted;
                    break;
                case 'device-pending-checked.html':
                    paramData = pendingChecked;
                    break;
                case 'device-pending-sync.html':
                    paramData = pendingSync;
                    break;
                case 'device-sync.html':
                    paramData = sync;
                    break;
            }
            mui.openWindow({
                url: 'search.html',
                extras: paramData
            });
        })
}

function queryToDoCnt() {
    postAjax('/mobile/task/queryToDoCnt.action', {}, function(msg) {
        if(msg.resultCode == 1) {
            $("#toDoCnt").html(msg.cnt);
            if(msg.cnt == 0) {
                $("#toDoCnt").addClass('mui-hidden');
            } else {
                $("#toDoCnt").removeClass('mui-hidden');
            }
        }
    });
}

function loadInit() {
    group = new webviewGroup(plus.webview.currentWebview().id, {
        items: [{
            id: 'device-uncommitted.html',
            url: 'device-uncommitted.html',
            styles: {
                top: heighttop,
                bottom: '0px'
            },
            extras: {}
        }, {
            id: 'device-pending-sync.html',
            url: 'device-pending-sync.html',
            styles: {
                top: heighttop,
                bottom: '0px'
            },
            extras: {}
        }, {
            id: 'device-pending-checked.html',
            url: 'device-pending-checked.html',
            styles: {
                top: heighttop,
                bottom: '0px'
            },
            extras: {}
        }, {
            id: 'device-sync.html',
            url: 'device-sync.html',
            styles: {
                top: heighttop,
                bottom: '0px'
            },
            extras: {}
        }],

        onChange: function(obj) {
            var element = document.querySelector('.mui-control-item.mui-active');
            if(element) {
                element.classList.remove('mui-active');
            }
            document.querySelector('.mui-scroll .mui-control-item:nth-child(' + (parseInt(obj.index) + 1) + ')').classList.add('mui-active');
            //刷新点击页面 去掉点击工单tab刷新页面
            var wid = document.querySelector('.mui-scroll .mui-control-item:nth-child(' + (parseInt(obj.index) + 1) + ')').getAttribute('data-wid');
            mui.fire(plus.webview.getWebviewById(wid), 'refresh', {});
            if(obj.index == 0) {
                getLocalsearchdata("uncommitted")
            } else if(obj.index == 2) {
                getLocalsearchdata("pendingChecked")
            } else if(obj.index == 1) {
                getLocalsearchdata("pendingSync")
            } else {
                getLocalsearchdata("sync")
            }
        }
    });
}

function getLocalsearchdata(obj) {
    if(localStorage.getItem(obj) == null || localStorage.getItem(obj) == "null") {
        $(".searchinput").hide();
        $(".searchstatus").hide();
        $(".searchtype").hide();
    } else {
        $(".searchinput").show();
        $(".searchstatus").show();
        $(".searchtype").show();
        var a = localStorage.getItem(obj).split(",");
        $(".searchinput div").text(a[0]);
        $(".searchstatus div").text(a[1]);
        $(".searchtype div").text(a[2]);
        if($(".searchinput div").text() != "") {
            $(".searchinput div").text(a[0]);
        } else {
            $(".searchinput").hide();
        }
        if($(".searchstatus div").text() != "所有状态") {
            $(".searchstatus div").text(a[1]);
        } else {
            $(".searchstatus").hide();
        }
        if($(".searchtype div").text() != "所有类型") {
            $(".searchtype div").text(a[2]);
        } else {
            $(".searchtype").hide();
        }
    }
}
mui.plusReady(function() {
    mui.init();
    //plus.navigator.setStatusBarBackground("#3366ff"); //状态栏颜色
    initEvents();
    loadInit();
    $(".search-show li span").click(function() {
        $(this).closest("li").hide();
        //      loadInit();
        var detailPage = plus.webview.getWebviewById('device-uncommitted.html');
        var detailPage2 = plus.webview.getWebviewById('device-pending-checked.html');
        var detailPage3 = plus.webview.getWebviewById('device-pending-sync.html');
        var detailPage4 = plus.webview.getWebviewById('device-sync.html');
        //触发详情页面的newsId事件
        if($(this).closest("li").hasClass("searchinput")) {
            $(".searchinput div").text("");
        } else if($(this).closest("li").hasClass("searchstatus")) {
            $(".searchstatus div").attr("data-id", "");
            $(".searchstatus div").text("所有状态");
        } else {
            $(".searchtype div").attr("data-id", "");
            $(".searchtype div").text("所有类型");
        }
        var a = $(this).closest("li").hasClass("searchinput");
        var b = $(this).closest("li").hasClass("searchstatus");
        var c = $(this).closest("li").hasClass("searchtype");
        if($(".mui-active").text().trim() == "草稿") {
            getdatasearch(detailPage, 1);
            resetData(a, b, c, "uncommitted")
        } else if($(".mui-active").text().trim() == "未审核") {
            getdatasearch(detailPage2, 2);
            resetData(a, b, c, "pendingChecked")
        } else if($(".mui-active").text().trim() == "退回") {
            getdatasearch(detailPage3, 3);
            resetData(a, b, c, "pendingSync")
        } else if($(".mui-active").text().trim() == "已审核") {
            getdatasearch(detailPage4, 4);
            resetData(a, b, c, "sync")
        }
    });
    mui('.mui-scroll').on('tap', '.mui-control-item', function(e) {
        var wid = this.getAttribute('data-wid');
        var wbb = plus.webview.getWebviewById(wid);
        /*if (wbb) {
            group.switchTab(wid);
        }*/
        group.switchTab(wid);

    });

    function getdatasearch(obj, num) {
        mui.fire(obj, 'showsearch', {
            id: {
                "target": num,
                "SBMC": $(".searchinput div").text(),
                "SBZT": $(".searchstatus div").attr("data-id"),
                "SXJLX": $(".searchtype div").attr("data-id"),
                "SBZTName": $(".searchstatus div").text(),
                "SXJLXName": $(".searchtype div").text()
            }
        });
    }

    function resetData(a, b, c, obj) {
        if($(".searchinput").css("display") == "none" && $(".searchstatus").css("display") == "none" && $(".searchtype").css("display") == "none") {
            $(".searchinput").hide();
            $(".searchstatus").hide();
            $(".searchtype").hide();
            localStorage.removeItem(obj);
        } else if(a) {
            var aa = '' + "," + localStorage.getItem(obj).split(",")[1] + "," + localStorage.getItem(obj).split(",")[2];
            localStorage.setItem(obj, aa);
        } else if(b) {
            var aa = localStorage.getItem(obj).split(",")[0] + "," + "所有状态" + "," + localStorage.getItem(obj).split(",")[2];
            localStorage.setItem(obj, aa);
        } else if(c) {
            var aa = localStorage.getItem(obj).split(",")[0] + "," + localStorage.getItem(obj).split(",")[1] + "," + "所有类型";
            localStorage.setItem(obj, aa);
        }
    }

    $(document).on('reload', function(e) { //刷新数据
            uncommitted = {
                SBMC: '', //设备名称
                SBZT: '', //设备状态
                SXJLX: '', //摄像机类型
                AZSJ: '', //安装时间
                target: 'device-uncommitted.html'
            }; //未提交查询参数
            pendingChecked = {
                SBMC: '', //设备名称
                SBZT: '', //设备状态
                SXJLX: '', //摄像机类型
                AZSJ: '', //安装时间
                target: 'device-pending-checked.html'
            }; //待审核查询参数
            pendingSync = {
                SBMC: '', //设备名称
                SBZT: '', //设备状态
                SXJLX: '', //摄像机类型
                AZSJ: '', //安装时间
                target: 'device-pending-sync.html'
            }; //待同步查询参数
            sync = {
                SBMC: '', //设备名称
                SBZT: '', //设备状态
                SXJLX: '', //摄像机类型
                AZSJ: '', //安装时间
                target: 'device-sync.html'
            }; //已同步查询参数
            var element = document.querySelector('.mui-control-item.mui-active');
            if(element) {
                var wid = element.getAttribute('data-wid');
                //刷新点击页面
                mui.fire(plus.webview.getWebviewById(wid), 'refresh', {});
            }
        })
        .on('gotoToDo', function(e) { //跳转
            group.switchTab('device-uncommitted.html');
            //刷新点击页面
            mui.fire(plus.webview.getWebviewById('device-uncommitted.html'), 'refresh', {});
        }).on('initToDoCnt', function(e) { //刷新
            //queryToDoCnt();
        });

    var addButton = document.getElementById("device_add");
    addButton.addEventListener('tap', function(event) {
        mui.openWindow({
            url: 'device-add.html',
            id: 'device-add.html',
            show: {
                aniShow: 'fade-in'
            },
            waiting: {
                autoShow: true
            },
            extras: {

                de_title: 1 //1 新建 2详情 3 编辑
            }
        });
    });

    //--
    mui.oldBack = mui.back;
    var backButtonPress = 0;
    mui.back = function(event) {
        backButtonPress++;
        if(backButtonPress > 1) {
            localStorage.removeItem("uncommitted");
            localStorage.removeItem("pendingChecked");
            localStorage.removeItem("pendingSync");
            localStorage.removeItem("sync");
            plus.runtime.quit();
        } else {
            plus.nativeUI.toast('再按一次退出应用');
        }
        setTimeout(function() {
            backButtonPress = 0;
        }, 1000);
        return false;
    };

});