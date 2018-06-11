var paramData = {}; //前一页面传递过来的值
var isSearch = false; //返回还是搜索
$(function() {
	mui.init({
		beforeback: function() {
			if(isSearch) {
				//触发父页面自定义事件（getQueryParam）,传递数据
				paramData.SBMC = $('#device_name').val().trim();
				paramData.SBZT = $('#devict_state_box .mui-icon-checkmarkempty').attr('data-value');
				paramData.SXJLX = $('#device_type_box .mui-icon-checkmarkempty').attr('data-value');
				paramData.SBZTName = $('#devict_state_box .mui-icon-checkmarkempty').text();
        paramData.SXJLXName = $('#device_type_box .mui-icon-checkmarkempty').text();
				/*paramData.AZSJ = $('#install_date').val().trim();*/
				mui.fire(plus.webview.getWebviewById(paramData.target), 'getQueryParam', paramData);
				mui.fire(plus.webview.getWebviewById('main.html'), 'getQueryParam', paramData);
			}
		}
	});
	initEvents();
});
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
//	console.log("self 是 : " + JSON.stringify(self))
	paramData.target = self.target //目标页面

	if(typeof self.SBMC !== 'undefined') { //设备名称
		paramData.SBMC = self.SBMC
		$('#device_name').val(self.SBMC);
	}
	if(typeof self.SBZT !== 'undefined') { //设备状态
		paramData.SBZT = self.SBZT;
		$('#devict_state_box .filter-item[data-value="' + self.SBZT + '"]').trigger('tap');
	} else {
		$('#devict_state_box .filter-item[data-value=""]').trigger('tap');
	}
	if(typeof self.SXJLX !== 'undefined') { //报像机类型
		paramData.SXJLX = self.SXJLX;
		$('#device_type_box .filter-item[data-value="' + self.SXJLX + '"]').trigger('tap');
	}else{
	    $('#device_type_box .filter-item[data-value=""]').trigger('tap');
	}
	/*if(typeof self.AZSJ !== 'AZSJ') { //安装时间
		paramData.AZSJ = self.AZSJ;
		$('#install_date').val(self.AZSJ);
	}*/
});

function initEvents() {
	$('body')
		//条件选择
		.on('tap', '.filter-item', function() {
			$(this).closest('.filter-box').find('.mui-icon-checkmarkempty').removeClass('mui-icon-checkmarkempty');
			$(this).addClass('mui-icon-checkmarkempty');
		})
		//搜索
		.on('tap', '#btn_search', function() {
			isSearch = true;
			localStorage.setItem("getsearch","");
			mui.back();
		})
		//起始日期选择
		.on('tap', '#install_date', function() {
			var _self = this;
			/*
			 * 首次显示时实例化组件
			 */
			_self.picker = new mui.DtPicker({
				type: "date", //设置日历初始视图模式
				endDate: new Date(), //设置结束日期
				value: $(this).val()
			});
			_self.picker.show(function(rs) {
				$('#install_date').val(rs.value);

				// 释放组件资源
				_self.picker.dispose();
				_self.picker = null;
			});
		})
}