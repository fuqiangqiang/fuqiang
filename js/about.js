try {
    mui.plusReady(function () {
        mui.init();
        getData();
//      var checkednum = document.getElementById("checknum");
//      checkednum.addEventListener('tap', function (event) {
//          getData();
//      });
    });
} catch (e) {
//  mui.toast("暂无数据");
}

function getData(){
    getAjax('/VIID/Versions.action', {}, function(msg) {
        if(msg.resultCode == 0){
            $(".copy_num").html(msg.Version.number);
        }else{
//          mui.toast("获取数据失败");
        }
    });
}
