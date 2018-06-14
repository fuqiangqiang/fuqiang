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
//刷新数据
$(document).on('reload', function(e) {
    uncommitted = {
      SBMC: '', //设备名称
      SBZT: '', //设备状态
      SXJLX: '', //摄像机类型
      AZSJ: '', //安装时间
      target: 'device-uncommitted.html'
    };
    //未提交查询参数
    pendingChecked = {
      SBMC: '', //设备名称
      SBZT: '', //设备状态
      SXJLX: '', //摄像机类型
      AZSJ: '', //安装时间
      target: 'device-pending-checked.html'
    };
    //待审核查询参数
    pendingSync = {
      SBMC: '', //设备名称
      SBZT: '', //设备状态
      SXJLX: '', //摄像机类型
      AZSJ: '', //安装时间
      target: 'device-pending-sync.html'
    };
    //待同步查询参数
    sync = {
      SBMC: '', //设备名称
      SBZT: '', //设备状态
      SXJLX: '', //摄像机类型
      AZSJ: '', //安装时间
      target: 'device-sync.html'
    };
    //已同步查询参数
    var element = document.querySelector('.mui-control-item.mui-active');
    if(element) {
      var wid = element.getAttribute('data-wid');
      //刷新点击页面
      mui.fire(plus.webview.getWebviewById(wid), 'refresh', {});
    }
  })
  //自定义事件: 跳转
  .on('gotoToDo', function(e) {
    group.switchTab('device-uncommitted.html');
    //刷新点击页面
    mui.fire(plus.webview.getWebviewById('device-uncommitted.html'), 'refresh', {});
  })
  //自定义事件: 刷新
  .on('initToDoCnt', function(e) {
    //queryToDoCnt();
  });
//
mui.plusReady(function() {
  mui.init();
  //plus.navigator.setStatusBarBackground("#3366ff"); //状态栏颜色
  initEvents();
  loadInit();

  //删除按钮事件
  $(".search-show li span").click(function() {
    //隐藏关闭的标签
    $(this).closest("li").hide();
    //loadInit();
    var detailPage = plus.webview.getWebviewById('device-uncommitted.html');
    var detailPage2 = plus.webview.getWebviewById('device-pending-checked.html');
    var detailPage3 = plus.webview.getWebviewById('device-pending-sync.html');
    var detailPage4 = plus.webview.getWebviewById('device-sync.html');
    
    //触发详情页面的newsId事件
    //view 状态重置
    if($(this).closest("li").hasClass("searchinput")) {
      $(".searchinput div").text("");
    } else if($(this).closest("li").hasClass("searchstatus")) {
      $(".searchstatus div").attr("data-id", "");
      $(".searchstatus div").text("所有状态");
    } else {
      $(".searchtype div").attr("data-id", "");
      $(".searchtype div").text("所有类型");
    }
    
    //boolean 是否是条件文本框
    var a = $(this).closest("li").hasClass("searchinput");
    //boolean 是否是设备状态选择
    var b = $(this).closest("li").hasClass("searchstatus");
    //boolean 是否是摄像机类型选择
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
  }); //--END 删除--

  //选项卡
mui('.mui-scroll').on('tap', '.mui-control-item', function(e) {
    var wid = this.getAttribute('data-wid');
    var wbb = plus.webview.getWebviewById(wid);
    //      if (wbb) {
    //          group.switchTab(wid);
    //      }
    group.switchTab(wid);
}); //-- END 选项卡 --

  //
  function getdatasearch(obj, num) {
    mui.fire(obj, 'showsearch', {
      id: {
        "target": num,
        "SBMC": $(".searchinput div").text(),//获得设备名称
        "SBZT": $(".searchstatus div").attr("data-id"),//获得设备状态
        "SXJLX": $(".searchtype div").attr("data-id"),//摄像机了类型
        "SBZTName": $(".searchstatus div").text(),//设备状态文本
        "SXJLXName": $(".searchtype div").text()//摄像机类型文本
      }
    });
  } //--END  getdatasearch() --

  //obj 是 页签标识
  function resetData(a, b, c, obj) {
    //文本框
    if($(".searchinput").css("display") == "none" && $(".searchstatus").css("display") == "none" && $(".searchtype").css("display") == "none") {
      $(".searchinput").hide();
      $(".searchstatus").hide();
      $(".searchtype").hide();
      localStorage.removeItem(obj);
    } 
    else if(a) {
      var aa = '' + "," + localStorage.getItem(obj).split(",")[1] + "," + localStorage.getItem(obj).split(",")[2];
      localStorage.setItem(obj, aa);
    } else if(b) {
      var aa = localStorage.getItem(obj).split(",")[0] + "," + "所有状态" + "," + localStorage.getItem(obj).split(",")[2];
      localStorage.setItem(obj, aa);
    } else if(c) {
      var aa = localStorage.getItem(obj).split(",")[0] + "," + localStorage.getItem(obj).split(",")[1] + "," + "所有类型";
      localStorage.setItem(obj, aa);
    }
  } // END resetData() --

  //[新增]按钮
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
        de_title: 1//1 新建 2详情 3 编辑
      }
    });
  }); //--END [新增]按钮

  //
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

//
function initEvents() {
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
      //设备状态名称不是"所有状态"的时候
      //view: 标签显示
      //view: 标签文本: 在用 || 维修 || 拆除
      //module: 设置data-id 值
      if(e.detail.SBZTName != "所有状态") {
        $(".searchstatus").show();
        $(".searchstatus div").text(e.detail.SBZTName);
        $(".searchstatus div").attr("data-id", e.detail.SBZT)
      } else {
        //设备状态 是 "所有状态" 的时候, 改标签不显示
        $(".searchstatus").hide();
      }
      
      //摄像机类型 不是 "所有类型" 的时候
      //view: 标签显示
      //view: 设置文本: 球机,半球机...
      //module: 设置data-id 值
      if(e.detail.SXJLXName != "所有类型") {
        $(".searchtype").show();
        $(".searchtype div").text(e.detail.SXJLXName);
        $(".searchtype div").attr("data-id", e.detail.SXJLX)
      } else {
        $(".searchtype").hide();
      }
      
      //设备名称 不为空 的时候
      //view: 标签显示
      //view: 设置文本: 球机,半球机...
      if(e.detail.SBMC != "") {
        $(".searchinput").show();
        $(".searchinput div").show();
        $(".searchinput span").show();
        $(".searchinput div").text(e.detail.SBMC);
      } else {
        $(".searchinput").hide();
      }
    } else {
      //[设备名称]为空, [设备状态]为"所有状态", [摄像机类型]为"所有类型"
      $(".searchinput").hide();
      $(".searchtype").hide();
      $(".searchstatus").hide();
    }
  }) //--END addEventListener --
  
  //增加 监听绑定
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
      //分别对 [搜索框], [设备状态], [摄像机类型]进行校验.
      //当标签不显示的时候即没有内容需要搜索, 所以将相应的搜索条件置为空, 再传回 search 页面.
      //删除[搜索框]时, [设备名称](SBMC) 置为空
      if("none" == $(".searchinput").css("display")){
        paramData.SBMC = '';
      }
      //删除[设备状态]时, [设备状态](SBZT) 置为空
      if("none" == $(".searchstatus").css("display")){
        paramData.SBZT = '';
      }
      //删除[摄像机类型]时, [摄像机类型](SXJLX) 置为空
      if("none" == $(".searchtype").css("display")){
        paramData.SXJLX = '';
      }
      //--END [搜索框], [设备状态], [摄像机类型]校验. --
      
      mui.openWindow({
        url: 'search.html',
        extras: paramData
      });

    })
}

// 查询信息??????
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
} //--END queryToDoCnt--


//
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
    // @param obj:{index:X}; 
    onChange: function(obj) {
      var element = document.querySelector('.mui-control-item.mui-active');
      if(element) {
        element.classList.remove('mui-active');
      }
      //parseInt(obj.index) + 1) -- 下一个标签
      document.querySelector('.mui-scroll .mui-control-item:nth-child(' + (parseInt(obj.index) + 1) + ')').classList.add('mui-active');
      //刷新点击页面 去掉点击工单tab刷新页面
      var wid = document.querySelector('.mui-scroll .mui-control-item:nth-child(' + (parseInt(obj.index) + 1) + ')').getAttribute('data-wid');
      mui.fire(plus.webview.getWebviewById(wid), 'refresh', {});
      //@param obj.index: 0-草稿; 1-退回; 2-未审核; 3-已审核
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
} //-- END loadInit --

//从本地缓存中找到保存的搜索信息
function getLocalsearchdata(obj) {
  //本地缓存中没有
  if(localStorage.getItem(obj) == null || localStorage.getItem(obj) == "null") {
    $(".searchinput").hide();
    $(".searchstatus").hide();
    $(".searchtype").hide();
  } else {
    $(".searchinput").show();
    $(".searchstatus").show();
    $(".searchtype").show();
    //本地缓存获得 obj,逗号隔开
    var a = localStorage.getItem(obj).split(",");
    $(".searchinput div").text(a[0]);
    $(".searchstatus div").text(a[1]);
    $(".searchtype div").text(a[2]);
    
    //检索[搜索框]
    if($(".searchinput div").text() != "") {
      $(".searchinput div").text(a[0]);
    } else {
      $(".searchinput").hide();
    }
    
    //检索[设备状态]
    if($(".searchstatus div").text() != "所有状态") {
      $(".searchstatus div").text(a[1]);
    } else {
      $(".searchstatus").hide();
    }
    
    //检索[摄像机类型]
    if($(".searchtype div").text() != "所有类型") {
      $(".searchtype div").text(a[2]);
    } else {
      $(".searchtype").hide();
    }
  }
}