mui.plusReady(function() {
	mui.init();


	//从本机获取当前版本号
	var self = plus.webview.currentWebview();
	//写入版本信息
	$('.copy_num').html(self.version);
	//alert(self.version);


	//      var checkednum = document.getElementById("checknum");
	//      checkednum.addEventListener('tap', function (event) {
	//          getData();
	//      });


	//Function: 获取新版本, 比对旧版本, 下载新版本
	getNewVersionInfo();
});

//
//app.host + '/VIID/queryAppCode.action'
function getNewVersionInfo() {
	// AJAX 获取版本信息
	getAjax(app.host + '/VIID/queryAppCode.action', {}, function(msg) {

		//返回码为0(成功)时
		if(msg.resultCode == 0) {
			//更新版本号;
			$(".copy_num").html(msg.Version.number);

			//提示用户可以下载新版本
			//.confirm( message, title, btnValue, callback [, type] )
			mui.confirm("有新版本, 是否下载?","下载更新",["下载","取消"],function(){
				//点击[下载],下载新版本
				alert("开始下载");
			})
		//其他返回码操作
		} else {
			console.log(JSON.stringify(msg));
			mui.toast("获取数据失败");
		}// -- END if --

	});//-- END AJAX --
	
	
}//-- END getNewVersionInfo --