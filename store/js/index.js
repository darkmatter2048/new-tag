var v = new Vue({
    el: "#index",
    data: {
        kwResult: [],// 关键字 检索的结果
        kwResultShow:false,// 检索结果列表是否被打开
        kw: '',// 关键字
        week: '',// 周几信息显示
        navigatorIcons:[{ 'url':'https://cn.bing.com/favicon.ico','name':'必应'}],
        navigatorIconsMax: 2, // 搜索引擎类别大小
        currentNavigatorIconsIndex:1,// 当前导航图标索引
        timeOfNavigatorWords:0,// 导航提示文字 显示时间 单位 秒
        timeOfMenu:0,// 菜单显示时间 单位 秒
        menus:[],// 菜单导航列表
        menuIsShow:false,// 菜单是否被打开 默认否
        menusFistPageSrc:'',// 菜单开发起始页面url
        menuNavigatorTitle:'',// 菜单导航显示标签
    },
    mounted() {
        this.init();
        window.setInterval(function () {
            document.getElementById("second_span").style.visibility = "visible";
            v.getNowTime();
            //挂载 导航显示字段显示
            if(v.timeOfNavigatorWords >= 2){
                v.navigatorHidden();
                v.timeOfNavigatorWords = 0;
            }
            //挂载 菜单显示
            if(v.timeOfMenu >= 10 && v.menuIsShow){
                v.menuHidden();
                v.timeOfMenu = 0;
            }
            v.timeOfMenu++;
            v.timeOfNavigatorWords++;
        }, 1000);
    },
    methods: {
        init() {
            var winWidth;
            var winHeight;
            //获取浏览器窗口宽度
            if (window.innerWidth) {
                winWidth = window.innerWidth;
            } else if ((document.body) && (document.body.clientWidth)) {
                winWidth = document.body.clientWidth;
            }
            //获取浏览器窗口高度
            if (window.innerHeight) {
                winHeight = window.innerHeight;
            } else if ((document.body) && (document.body.clientHeight)) {
                winHeight = document.body.clientHeight;
            }
            if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
                winHeight = document.documentElement.clientHeight;
                winWidth = document.documentElement.clientWidth;
            }
            this.getNowTime();
            this.getWeek();
            //获取菜单导航列表
            this.searchNavigationMenus();
            document.getElementById("index").style.width = winWidth;
            document.getElementById("index").style.height = winHeight;

            //首页被打开时 时间 是后显示出来的
            document.getElementById("hours_span").style.animationName = 'hms';
            document.getElementById("minute_span").style.animationName = 'hms';
            document.getElementById("second_span").style.animationName = 'hms';
            // 星期信息
            document.getElementById("week_span").style.animationName = 'ws';
            //输入框阴影
            document.getElementById("search_input").style.animationName = 'si';
        },
        stopDefaultEvent(){
            console.log(111);
        },
        getNowTime() {
            var date = new Date();
            document.getElementById("hours_span").innerText = date.getHours() >= 10 ? date.getHours() : ('0' + date.getHours());
            document.getElementById("minute_span").innerText = date.getMinutes() >= 10 ? date.getMinutes() : ('0' + date.getMinutes());
        },
        getWeek() {
            var weekIndex = new Date().getDay();
            switch (weekIndex) {
                case 0:
                    this.week = '周 日';
                    break;
                case 1:
                    this.week = '周 一';
                    break;
                case 2:
                    this.week = '周 二';
                    break;
                case 3:
                    this.week = '周 三';
                    break;
                case 4:
                    this.week = '周 四';
                    break;
                case 5:
                    this.week = '周 五';
                    break;
                case 6:
                    this.week = '周 六';
                    break;
            }
        },
        requestBaidu() {
            //百度搜索参数：1.wd=？关键字 2.cl=3/2 网页搜索/图片搜索 3.json=1 返回值为json格式
            var baiduBaseUrl = 'https://www.baidu.com/sugrec?pre=1&p=3&json=1&prod=pc&from=pc_web&wd='
            $.ajax({
                type: 'get',
                url: baiduBaseUrl + this.kw,
                dataType: 'jsonp',
                success: function (result) {
                    v.$data.kwResult = result.g;
                    v.showSearchResultAnimation();
                },
                error: function (result) {
                    console.log(result);
                }
            })
        },
        requestBaiduByKw(value) {
            var urlHeader = 'https://www.bing.com/search?q=';
            console.log(value);
            if(value != null && value != undefined){
                window.open(urlHeader + value.q);
            }
            if(this.kw != null && this.kw != undefined){
                window.open(urlHeader + this.kw);
            }
        },
        //获取菜单导航列表
        searchNavigationMenus(){
            $.ajax({
                type: 'get',
                url:'../store/data/menus.json',
                dataType: 'json',
                success:function (result){
                    v.$data.menus = result.result;
                },
                error:function (result){
                    console.log(result.result);
                }
            })
        },
        //显示关键字检索结果动画
        showSearchResultAnimation() {
            if (this.kwResult != undefined) {
                this.kwResultShow = true;
                document.getElementById("key_word_show").style.animationName = 'kws'
            }
            if (this.kwResult == undefined) {
                this.kwResultShow = false;
                document.getElementById("key_word_show").style.animationName = 'kws2'
            }
        },
        enter(event) {
            var el = event.currentTarget;
            el.style.animationName = 'kwsl';
        },
        leave(event) {
            var el = event.currentTarget;
            el.style.animationName = 'kwsl2';
        },
        //搜索类型改变
        navigatorChange(event) {
            var el = event.currentTarget;
            if(this.currentNavigatorIconsIndex >= this.navigatorIconsMax){
                this.currentNavigatorIconsIndex = 1;
            } else {
                this.currentNavigatorIconsIndex ++;
            }
            //更换 图标
            el.style.backgroundImage = "url("+this.navigatorIcons[this.currentNavigatorIconsIndex - 1].url+")";
            //改变提示
            var el2 = document.getElementById("navigation_words");
            el2.innerHTML = "当前搜索引擎 \"" + this.navigatorIcons[this.currentNavigatorIconsIndex - 1].name + '"';
            el2.style.animationName = 'nw2'
            this.timeOfNavigatorWords = 0; // 显示时间 置 0
        },
        showNavigator(){
            var el2 = document.getElementById("navigation_words");
            el2.innerHTML = "当前搜索引擎 \"" + this.navigatorIcons[this.currentNavigatorIconsIndex - 1].name + '"';
            el2.style.animationName = 'nw2'
            this.timeOfNavigatorWords = 0
        },
        navigatorHidden(){
            var el2 = document.getElementById("navigation_words");
            el2.style.animationName = 'nw'
        },
        //打开菜单
        showMenu(){
            var el = document.getElementById("menu_div");
            el.style.animationName = 'md';
            this.timeOfMenu = 0;
            this.menuIsShow = true;
            //获取菜单导航列表
            this.searchNavigationMenus();
            //默认菜单页面是 常用网址导航
            var menu = this.menus[0];
            this.menusFistPageSrc = menu.url;
            this.menuNavigatorTitle = menu.menuName;
            //所有按钮复位
            this.menuBtnReset();
        },
        //收起菜单
        menuHidden(){
            var el = document.getElementById("menu_div");
            if(this.menuIsShow){
                el.style.animationName = 'md2';
            }
        },
        //菜单导航切换
        menuNavigatorChange(item,event){
            this.menusFistPageSrc = item.url;
            this.menuNavigatorTitle = item.menuName;
            this.timeOfMenu = 0;

            //按钮复位
            this.menuBtnReset();

            var el = event.currentTarget;
            el.style.transform = "scale(0.5)";
        },
        //菜单导航按钮点击后变换复位
        menuBtnReset(){
            var elementsByClassName = document.getElementsByClassName("menu_navigation_btn");
            for (let i = 0; i < elementsByClassName.length; i++) {
                elementsByClassName[i].style.transform = "scale(1)";
            }
        },
        //点击屏幕左键时，收回 关键字检索列表 以及 菜单
        reset(){
            this.menuHidden();
            if(this.kwResultShow){
                document.getElementById("key_word_show").style.animationName = 'kws2';
            }
        }
    }
})