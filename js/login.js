/*for(var i = 0; i < localStorage.length; i++) {
    console.log(localStorage.key(i) + "---," + localStorage.getItem(localStorage.key(i)));
}*/

$(document).ready(function() {
	$("#username").val(localStorage.getItem("drsUserName"));
	$("#password").val(localStorage.getItem("drsPassWord"));
});
var localToken = localStorage.getItem("drsToken");
$("#username").focus(function() {
	$(this).prev("span").removeClass().addClass("login-icon-user-focus");
}).blur(function() {
	$(this).prev("span").removeClass().addClass("login-icon-user");
});
$("#password").focus(function() {
	$(this).prev("span").removeClass().addClass("login-icon-pwd-focus");
}).blur(function() {
	$(this).prev("span").removeClass().addClass("login-icon-pwd");
});

(function($, doc) {
	$.init();
	$.plusReady(function() {
		if(localStorage.getItem("drsIp") == null || localStorage.getItem("drsIp") == undefined) {
			mui.openWindow({
				url: 'setIp.html',
				id: 'setIp',
				show: {
					aniShow: 'pop-in'
				},
				waiting: {
					autoShow: false
				}
			});
		}
		plus.screen.lockOrientation("portrait-primary");
		//set ip
		var settingButton = doc.getElementById('setIp');
		settingButton.addEventListener('tap', function(event) {
			mui.openWindow({
				url: 'setIp.html',
				id: 'setIp',
				show: {
					aniShow: 'pop-in'
				},
				waiting: {
					autoShow: false
				}
			});
		});
		//
		var toMain = function() {
			//使用定时器的原因：
			//可能执行太快，main页面loaded事件尚未触发就执行自定义事件，此时必然会失败
			var id = setInterval(function() {
				clearInterval(id);
				mui.openWindow({
					url: 'tab.html',
					id: 'tab',
					show: {
						aniShow: 'pop-in'
					},
					waiting: {
						autoShow: false
					}
				});
			}, 20);
		};

		setTimeout(function() {
			//关闭 splash
			plus.navigator.closeSplashscreen();
		}, 600);
		var loginButton = doc.getElementById('login');
		var usernameBox = doc.getElementById('username');
		var passwordBox = doc.getElementById('password');
		//var setIpBox = doc.getElementById('setIpValue');

		var tokenSet = usernameBox.value + passwordBox.value;
		//          console.log(localToken +"=="+ tokenSet)
		if(localToken == tokenSet) {
			checkLogin(usernameBox.value, passwordBox.value, setIp);;
		}

		loginButton.addEventListener('tap', function() {
			var userName = usernameBox.value;
			var pwd = passwordBox.value;
			var setIp = localStorage.getItem("drsIp"); //setIpBox.value;
			if(userName == '') {
				mui.toast("请输入用户名");
				return false;
			}
			if(pwd == '') {
				mui.toast("请输入密码");
				return false;
			}

			if(!setIp) {
				flag = 0;
				mui.toast("请配置服务器IP");
				return;
			}
			//save
			checkLogin(userName, pwd, setIp);

		});

		function checkLogin(userName, pwd, setIp) {
			if(userName && pwd && setIp) {
				var param = {
					userName: userName,
					password: pwd
				};
				var setIp = localStorage.getItem("drsIp") || '';
				var hostUrl = 'http://' + setIp + '/drs';
				console.log(hostUrl)
				mui.ajax(hostUrl + '/VIID/UserIdentity.action', {
					data: {
						userName: userName,
						password: pwd
					},
					dataType: 'json',
					type: 'get',
					timeout: 10000,
					success: function(msg) {
						if(msg.ResponseStatusList.StatusCode == 0) {
							var tk = userName + pwd;
							localStorage.setItem("drsUserName", userName);
							localStorage.setItem("drsPassWord", pwd);
							localStorage.setItem("drsToken", tk);
							localStorage.setItem("drsRoleName", msg.ResponseStatusList.User.roleName); //roleName
							toMain();
						} else {
							mui.toast("用户名或密码错误");
						}

					},
					error: function(xhr, type, errorThrown) {
						console.log("login error" + type);
						
					}
				});
			}
		}

		//--
		$.oldBack = mui.back;
		var backButtonPress = 0;
		$.back = function(event) {
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
}(mui, document));