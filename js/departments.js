mui.plusReady(function() {
	mui.init();
	getDepartments();
	/*var self = plus.webview.currentWebview();
	var checkednum = document.getElementById("checknum");
	checkednum.addEventListener('tap', function(event) {
		getData();
	});*/
});

function getDepartments() {
	//
	$.ajax({
		type: "GET",
		url: app.host + "/VIID/Dicts.action?userName=",
		data: "",
		success: function(msg) {
			var listFragment = '';
			$.each(msg.DictList, function(index, msgItems){
				if('GLDW' == msgItems.Dict.LXBM){
					//console.log("第 " + index + ": " + " -------- " + JSON.stringify(msgItems.Dict.ZDXMC));
					listFragment += '<li class="mui-table-view-cell">'+msgItems.Dict.ZDXMC+'</li>'
				}
				$('#departments').html(listFragment);
			})
		}
	});
}