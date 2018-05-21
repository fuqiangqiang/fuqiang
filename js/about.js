mui.plusReady(function() {
	mui.init();
	var self = plus.webview.currentWebview();
	//      var checkednum = document.getElementById("checknum");
	//      checkednum.addEventListener('tap', function (event) {
	//          getData();
	//      });

	$('.copy_num').html(self.version);
});

/*function getData() {
	getAjax('/VIID/version.action', {}, function(msg) {
		if(msg.resultCode == 0) {
			$(".copy_num").html(msg.Version.number);
		} else {
			console.log(JSON.stringify(msg));
			mui.toast("获取数据失败");
		}
	});
}*/

function getNewVersionInfo() {
	getAjax('/VIID/queryAppCode.action', {}, function(msg) {

	});
}