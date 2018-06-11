var oldVersion = ''
mui.plusReady(function() {
	mui.init();

	//mui_API: 从本机获取当前版本号
	var self = plus.webview.currentWebview();
	oldeVersion = parseInt(self.version.split('.').join(""));
	//写入标签(当前版本信息)
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
});

//声明方法

// function: 获得新版本
function getNewVersionInfo() {
	$.ajax({
		type: "get",
		url: app.host + "/VIID/queryAppCode.action",
		data: "",
		success: function(msg) {
			//从返回的信息中获得版本号, 去掉版本号中的"."
			var newVersion = parseInt(msg.appVersion.split('.').join(""));
//			alert("Data Saved: " + JSON.stringify(msg));
//			比对新旧版本
			if(newVersion > oldeVersion) {
				//如果新版本号大于旧版本号, 更新新程序
				mui.confirm( '是否下载更新', '下载更新', ['下载','取消'], function(e){
					console.log(e.index)
					if(0 == e.index){
						window.location = app.host + '/VIID/drs.apk';
						//下载后自动安装
						//plus.runtime.install('/storage/emulated/0/Download/drs.apk', {force: true}, function(){mui.toast('安装成功')}, function(){mui.toast('安装失败')});
					} else {
						mui.toast('操作取消')
					}
				})
			} else {
				//否则提示"已是最新版本"
				mui.toast('已是最新版本');
			}
		},
		//如果发生错误 则抛出错误异常.
		error: function(err) {
			mui.toast('获取版本失败');
		}
	});// --END AJAX --

} //-- END getNewVersionInfo --