try {

    var subpages = ['main.html', 'map.html',  'my.html'];
    var subpage_style = {
        top: '0',
        bottom: '51px'
    };
    var aniShow = {};
    //创建子页面，首个选项卡页面显示，其它均隐藏；
    mui.plusReady(function () {
        //mui初始化
        mui.init();
        document.getElementById('tabBottom').style.top = (plus.display.resolutionHeight - 50) + "px";//防止撑起
        var self = plus.webview.currentWebview();
        for (var i = 0; i < subpages.length; i++) {
            var temp = {};
            var sub = plus.webview.create(subpages[i], subpages[i], subpage_style);
            if (i > 0) {
                sub.hide();
            } else {
                temp[subpages[i]] = "true";
                mui.extend(aniShow, temp);
            }
            self.append(sub);
        };

/*             mui('.mui-bar-tab').on('tap', '#map', function () {

                var changeTab = localStorage.getItem("selectedTargetTab")

                $('nav a').removeClass('mui-active');
                $('nav a').removeClass('mui-active2');
                $('#'+changeTab).addClass('mui-active2');
                //alert($('#'+changeTab).parent().html());


                //new activity

                var main = plus.android.runtimeMainActivity();

                var Intent = plus.android.importClass("android.content.Intent");
                var intent = new Intent(main.getIntent());
                intent.setClassName(main, "cn.goldencis.drs.drsActivity");
                intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                // 传值
                intent.putExtra("tabValue", "map");
                main.startActivity(intent);
    });*/

    });


    //当前激活选项
    var activeTab = subpages[0];
    //选项卡点击事件
    mui('.mui-bar-tab').on('tap', 'a', function (e) {

        var targetTab = this.getAttribute('href');
        var targetTabId = this.getAttribute('id');
        //$('nav a').removeClass('mui-active2');
        localStorage.setItem("selectedTargetTab", targetTabId);

        //console.log("targetTabx:" + targetTab);
        //console.log("activeTab:" + activeTab);
        if (targetTab == activeTab) {
            return;
        }
        //显示目标选项卡
        //若为iOS平台或非首次显示，则直接显示
        if (mui.os.ios || aniShow[targetTab]) {
            plus.webview.show(targetTab);
        } else {
            //否则，使用fade-in动画，且保存变量
            var temp = {};
            temp[targetTab] = "true";
            mui.extend(aniShow, temp);
            plus.webview.show(targetTab, "fade-in", 300);
        }
        //刷新点击页面
        try {
            if ('main.html' == targetTab) {
                //mui.fire(plus.webview.getWebviewById('main.html'), 'refresh', {});
                plus.webview.getWebviewById('main.html').forward();// 上次活动位置

            }else if ('map.html' == targetTab) {
                  mui.fire(plus.webview.getWebviewById('map.html'), 'refresh', {});
            }else if ('my.html' == targetTab) {
                //mui.fire(plus.webview.getWebviewById('my.html'), 'refresh', {});
            }
            /*var wobj = plus.webview.getWebviewById(targetTab);
                 wobj.reload(true);*/
        } catch (e) {
        }
        //隐藏当前;
        plus.webview.hide(activeTab);
        //更改当前活跃的选项卡
        activeTab = targetTab;
    });
    document.addEventListener('gotoToDo', function () {
        var orderTab = document.getElementById("defaultTab");
        //模拟工单页点击
        mui.trigger(orderTab, 'tap');
        var element = document.querySelector('.mui-tab-item.mui-active');
        if (element) {
            element.classList.remove('mui-active');
        }
        orderTab.classList.add('mui-active');
    });






} catch (e) {
    document.write(e.message);
}