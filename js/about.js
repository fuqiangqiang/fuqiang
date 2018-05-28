var oldVersion = ''
mui.plusReady(function() {
	mui.init();

	//从本机获取当前版本号
	var self = plus.webview.currentWebview();
	oldeVersion = parseInt(self.version.split('.').join(""));
	//写入版本信息
	$('.copy_num').html(self.version);

	//      var checkednum = document.getElementById("checknum");
	//      checkednum.addEventListener('tap', function (event) {
	//          getData();
	//      });

	//Function: 获取新版本, 比对旧版本, 下载新版本
	getNewVersionInfo();

});

$(function() {
	$('body').on('tap', '#checknum', function(){
		getNewVersionInfo();
	})
})

function getNewVersionInfo() {
	$.ajax({
		type: "get",
		url: app.host + "/VIID/queryAppCode.action",
		data: "",
		success: function(msg) {
			var newVersion = parseInt(msg.appVersion.split('.').join(""));
			alert("Data Saved: " + JSON.stringify(msg));
			$('.copy_num').html(msg.appVersion);
			if(newVersion > oldeVersion) {
				window.location = app.host + '/VIID/drs.apk';
			} else {
				mui.toast('已是最新版本');
			}
		},
		error: function(err) {
			mui.toast('获取版本失败');
		}
	});

} //-- END getNewVersionInfo --