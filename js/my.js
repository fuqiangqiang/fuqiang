var currentAPPVersion = ''
try {
	mui.plusReady(function() {
		mui.init();
		getUserData();
		//获取版本信息
		plus.runtime.getProperty(plus.runtime.appid, function(inf) {
			currentAPPVersion = inf.version;
		});
		
		/*点击选择部门*/
		var departmentButton = document.getElementById("department");
		departmentButton.addEventListener('tap', function(event) {
			mui.openWindow({
				url: 'departments.html',
				id: 'departments',
				show: {
					aniShow: 'fade-in'
				},
				waiting: {
					autoShow: true
				}
			});
		});
		
		/*点击修改密码*/
		var psdButton = document.getElementById("psd_jump");
		psdButton.addEventListener('tap', function(event) {
			mui.openWindow({
				url: 'change-psd.html',
				id: 'change-psd',
				show: {
					aniShow: 'fade-in'
				},
				waiting: {
					autoShow: true
				}
			});
		});

		/*点击关于*/
		var aboutButton = document.getElementById("about_jump");
		aboutButton.addEventListener('tap', function(event) {
			mui.openWindow({
				url: 'about.html',
				id: 'about',
				show: {
					aniShow: 'fade-in'
				},
				extras: {
					version: currentAPPVersion
				},
				waiting: {
					autoShow: true
				}
			});
		});
		/*退出登录*/
		document.getElementById('exit').addEventListener('tap', function() {
			var btnArray = ['否', '是'];
			mui.confirm('是否退出系统？', '提示', btnArray, function(e) {
				if(e.index == 1) {
					localStorage.removeItem("drsUserName");
					localStorage.removeItem("drsPassWord");
					localStorage.removeItem("drsToken");
					localStorage.removeItem("uncommitted");
					localStorage.removeItem("pendingChecked");
					localStorage.removeItem("pendingSync");
					localStorage.removeItem("sjzpGeolocationWD");
					localStorage.removeItem("sync");
					plus.runtime.restart();
					//localStorage.clear();
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
				} else {}
			})
			return;
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
} catch(e) {
	mui.toast("暂无数据");
}

function getUserData() {
	var name = localStorage.getItem("drsUserName");
	var psd = localStorage.getItem("drsPassWord");
	mui.ajax(app.host + '/VIID/UserIdentity.action', {
		data: {
			userName: name,
			password: psd
		},
		dataType: 'json',
		type: 'get',
		timeout: 10000,
		success: function(data) {
			if(data.ResponseStatusList.StatusCode == 0) {
				var user = data.ResponseStatusList.User;
				$("#user").html(isEmpty(user.userName));
				$("#role").html(isEmpty(user.roleName));
				$("#phone").html(isEmpty(user.telephone));
				$("#policenum").html(isEmpty(user.policeNum));
				$("#department").html(isEmpty(user.deptName));
			} else {
				$("#user").html("--");
				$("#role").html("--");
				$("#phone").html("--");
				$("#policenum").html("--");
				$("#department").html("--");
			}

		},
		error: function(xhr, type, errorThrown) {}
	});

	mui.ajax(app.host + '/VIID/Versions', {
		dataType: 'json',
		type: 'get',
		timeout: 10000,
		success: function(data) {
			$("#copynum").html(data.Version.number)
		},
		error: function(xhr, type, errorThrown) {}
	});

}

function isEmpty(obj) {
	if(obj == null || obj == "" || obj == "null") {
		return "--";
	} else {
		return obj;
	}
}