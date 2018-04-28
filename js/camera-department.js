$(function() {
    mui.init();
    initEvents();
    $('#keywords').focus();
});

function initEvents() {
    $('body')
        //选择
        .on('tap', '.filter-item', function() {
            $(this).toggleClass('mui-icon-checkmarkempty');
        })
        //确定
        .on('tap', '.mui-table-view-cell', function() {
            //触发父页面自定义事件（getDepartment）,传递数据
            var cameraDepartment = {
                id: $(this).attr('data-id'),
                name: $(this).text().trim()
            }
            mui.fire(plus.webview.getWebviewById('device-add.html'), 'getDepartment', cameraDepartment);
            mui.back();
        })
        //检索
        .on('tap', '#btn_search', function() {
            var data = [];
            var sKeyWord = $('#keywords').val();
            if(sKeyWord) {

                mui.ajax(app.host+'/VIID/Organizations.action?MC='+sKeyWord, {
                    data: {},
                    dataType: 'json',
                    type: 'get',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    success: function(msg) {
                        console.log(sKeyWord);
                        console.log("msg:" + JSON.stringify(msg));
                        if(msg.StatusCode == 0) {
                            if(msg.OrganizationList.length == 0) {
                                $('#dept_list').html('');
                                $('#empty').text('未查询到符合条件的数据').show();
                            } else {
                                $('#empty').hide();
                                $('#dept_list').html(template('temp_dept_list', msg.OrganizationList));
                            }

                        } else {
                            $('#dept_list').html('');
                            $('#empty').text('未查询到符合条件的数据').show();
                            //mui.toast("获取失败");
                        }
                    },
                    error: function(xhr, type, errorThrown) {
                        //异常处理；
                        if(type == 'error') {
                            mui.toast("连接服务器失败");
                        }
                    }
                });

            } else {
                $('#dept_list').html('');
                $('#empty').text('输入名称进行检索').show();
            }

        })
}
