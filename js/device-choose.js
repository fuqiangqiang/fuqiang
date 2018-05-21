var flag = false; //返回还是确定
$(function() {
	mui.init({
		beforeback: function() {
			if(flag) {
				//触发父页面自定义事件（getCameraPosition）,传递数据
				var cameraType = $('.mui-icon-checkmarkempty').map(function(index, obj) {
					return {
						name: $(obj).text().trim(),
						id: $(obj).attr('data-value'),
						checkname: $(obj).attr('data-name')
					}
				}).toArray();
				mui.fire(plus.webview.getWebviewById('device-add.html'), 'getChooseData', cameraType);
			}
		}
	});
	initEvents();
});
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	$(".titlename").html(self.labelName);
	if(typeof self.chooseType !== 'undefined') {
		var chooseType = self.chooseType;
		chooseType.forEach(function(id) {
			$('.filter-item[data-value="' + id + '"]').trigger('tap');
		})
	}
	$("#sxjul").html("");
	var plist = "";
	$.each(self.datacheckbox, function(idx, val) {
		plist += '<li class="mui-table-view-cell mui-col-xs-6 mui-col-sm-4">' +
			'<div class="mui-icon filter-item" data-name="' + self.checkname + '" data-value="' + val.value + '">' + val.name + '</div></li>'
	})
	$("#sxjul").html(plist);

});

function initEvents() {
	$('body')
		//选择
		.on('tap', '.filter-item', function() {
			$(this).toggleClass('mui-icon-checkmarkempty');
		})
		//确定
		.on('tap', '#btn_done', function() {
			flag = true;
			mui.back();
		})
}