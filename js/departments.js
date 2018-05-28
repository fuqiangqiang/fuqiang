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
		url: 'http://10.10.16.124:8080/drs/VIID/Depts.action?userName=system',
		data: "",
		success: function(msg) {
			var listFragment = '';
//			console.log(JSON.stringify(msg))
			//临时
			$.each(msg.DictList,function(index,allDepts){
//				console.log("第" + index + ": " + "----00---- " + JSON.stringify(allDepts));
				if(-1 == allDepts.parentId){
					listFragment +='<li class="mui-table-view-cell topNode">'+allDepts.name+'</li>'
				}
				$.each(allDepts.children,function(index2,allSubDepts){
					listFragment += '<li class="mui-table-view-cell level1Node">'+allSubDepts.name+'</li>'
					if(allSubDepts.children != 0){
						$.each(allSubDepts.children,function(index3,l3Depts){
							if(allSubDepts.id == l3Depts.parentId){
								listFragment += '<li class="mui-table-view-cell level2Node">'+l3Depts.name+'</li>'
							}
						})
					}
				})
			})
			$('#departments').html(listFragment);
		},
		error:function(err){
			console.log("错误: " + JSON.stringify(err));
		}
	});
}