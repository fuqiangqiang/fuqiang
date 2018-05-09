mui.init({
    swipeBack: false,
    keyEventBind: {
        backbutton: true //back按键监听
    },
    pullRefresh: {
        container: '#pullrefresh',
        down: {
            height: 50, //可选,默认50.触发下拉刷新拖动距离,
            //auto: true,//可选,默认false.首次加载自动下拉刷新一次
            contentdown: "", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover: "", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
            callback: pulldownRefresh
        },
        up: {
            //auto:false,
            contentrefresh: '正在加载...',
            contentnomore: '没有更多数据了',
            callback: pullupRefresh
        }
    }
});
/**
 * 上拉加载具体业务实现
 */
function pullupRefresh() {
    setTimeout(function() {
        var table = document.body.querySelector('.mui-table-view');
        var cells = document.body.querySelectorAll('.mui-table-view-cell');
        if(cells.length == 0){
        	param.offset = 0;
        }else{
        	param.offset = (cells.length)/5;
        }
        getAjax('/VIID/CamerasQuery.action', param, function(msg) {
        	var datalistval = [];
        	$.each(msg.CameraList,function(index,val){
        		datalistval.push(val.Camera)
        	})
        	var dataall = {
        		CameraList:datalistval
        	}
            if(dataall.CameraList.length > 0) {
                $('#submit_order_list').append($(template('temp_submit_order_list', dataall)));
                mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
            } else {
                //未查询到数据
                mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
                //mui.toast("未查询到数据");
            }
        });
    }, 30);

}
/**
 * 下拉刷新具体业务实现
 */
function pulldownRefresh() {
    mui('#pullrefresh').pullRefresh().refresh(true); //重置上拉加载
    setTimeout(function() {
        var table = document.body.querySelector('.mui-table-view');
        var cells = document.body.querySelectorAll('.mui-table-view-cell');
        //param.limit = pageSize;
        param.offset = 0;
        
        getAjax('/VIID/CamerasQuery.action', param, function(msg) {
        	var datalistval = [];
        	$.each(msg.CameraList,function(index,val){
        		datalistval.push(val.Camera)
        	})
        	var dataall = {
        		CameraList:datalistval
        	}
            if(msg.CameraList.length > 0) {
                $('#submit_order_list').children().remove();
                $('#submit_order_list').append($(template('temp_submit_order_list', dataall)));
                mui('#pullrefresh').pullRefresh().endPulldown(); //结束

            } else {
                $('#submit_order_list').children().remove();
                //mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
                mui('#pullrefresh').pullRefresh().endPulldown(); //结束
                mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
                mui.toast("未查询到数据");
            }
        });
    }, 100);
}
//获取搜索页面传递的参数
$(document).on('getQueryParam', function(e) {
    $.extend(param, e.detail)
    delete param.target; //删除target
    pulldownRefresh();
    if(e.detail.target == "device-uncommitted.html"){
        var aa = e.detail.SBMC + "," + e.detail.SBZTName + ","+e.detail.SXJLXName;
        localStorage.setItem("uncommitted",aa);
    }else if(e.detail.target == "device-pending-checked.html"){
        var bb = e.detail.SBMC + "," + e.detail.SBZTName + ","+e.detail.SXJLXName;
        localStorage.setItem("pendingChecked",bb);
    }else if(e.detail.target == "device-pending-sync.html"){
        var cc = e.detail.SBMC + "," + e.detail.SBZTName + ","+e.detail.SXJLXName;
        localStorage.setItem("pendingSync",cc);
    }else{
        var dd = e.detail.SBMC + "," + e.detail.SBZTName + ","+e.detail.SXJLXName;
        localStorage.setItem("sync",dd)
    }
})

//window.addEventListener('showsearch',function(event){
//  console.log(JSON.stringify(param))
//$.extend(param, event.detail.id)
//  delete param.target; //删除target
//  //console.log('参数为' + JSON.stringify(param));
//  pulldownRefresh();
//});


if(mui.os.plus) {
    mui.plusReady(function() {
        setTimeout(function() {
            mui('#pullrefresh').pullRefresh().pullupLoading();
        }, 100);
    });
} else {
    mui.ready(function() {
        mui('#pullrefresh').pullRefresh().pullupLoading();
    });
}
/*$("body").on("tap", "div.mui-slider-handle", function() {
    var de_detail = this.getAttribute("data-id");
    alert("detail"+de_detail);
    mui.openWindow({
        url: 'device-add.html', //'device-add.html',
        extras: {
            de_detail: de_detail,
            de_title: 2 //2详情 3 编辑
        }
    });
});*/
//左滑"发送审核"
$("body").on("tap", "a.del-upload", function() {
    var de_sbbm = this.getAttribute("data-sbbm");
    var thisValue = $(this);
    var btnArray = ['否', '是'];
    mui.confirm('是否确定发送审核？', '提示', btnArray, function(e) {
        //是 为1
        if(e.index == 1) {
            mui.ajax(app.host + '/VIID/CamerasToSync.action?shzt=2&SBBM=' + de_sbbm, {
                type: 'post',
                timeout: 10000,
                success: function(data) {
                	thisValue.closest("li").remove();
                },
                error: function(xhr, type, errorThrown) {
                }
            });
        }
    })
});

//左滑"删除"
$("body").on("tap", "a.del-device", function() {
    var de_sbbm = this.getAttribute("data-sbbm");
    var thisValue = $(this);
    //删除
    var delFlag = 0;
    var btnArray = ['否', '是'];
    mui.confirm('是否确定删除？', '提示', btnArray, function(e) {
        //是 为1
        if(e.index == 1) {
            delAjax();
        }
    })

    var delAjax = function() {
        getAjax('/VIID/CamerasDelete.action?SBBM=' + de_sbbm, {}, function(msg) {
            if(msg.ResponseStatusList.StatusCode == 0) {
               thisValue.closest("li").remove();
                mui.toast("删除成功");
            } else {
                mui.toast("删除失败");
            }
        });
    }
});