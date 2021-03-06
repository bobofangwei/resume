(function($) {
    //确定浏览器前缀，解决兼容性问题
    var _prefix=(function(tmp){
        var prefixs=['webkit','moz','o','ms'];
        var i,len,prop;
        //不需要添加前缀
        if(tmp.style['transition']!==undefined){
            return '';
        }
        for(i=0,len=prefixs.length;i<len;i++){
            prop=prefixs[i]+'Transition';
            if(tmp.style[prop]!==undefined){
                return '-'+prefixs[i]+'-';
            }
        }

    })(document.createElement('div'));
    console.log('_prefix',_prefix);
    var MyFullpage = {
        setup: function($elem, options) {
            this.$elem = $elem;
            this.settings = $.extend(true, {}, $.fn.MyFullPage.default, options);
            this.init();
        },
        //初始化dom结构，布局，分页并绑定事件
        init: function() {
            this.sections = this.$elem.find(this.settings.selectors.sections);
            this.section = this.$elem.find(this.settings.selectors.section);
            this.layoutDirection = this.settings.direction === 'vertical' ? true : false;
            this.sectionCount = this.getSectionCount();
            //滑动开始前的幻灯片索引
            this.prevIndex = -1;
            //滑动结束后的幻灯片索引，不过由于初始化的时候，为了呈现首页的动画效果，初始赋值为-1
            this.curIndex = -1;
            //记录每次滑动的方向,初始值为undefined,可选有down,up
            this.direction = undefined;
            this.isRunning = false;
            this.sections.css(_prefix+'transition', 'all ' + this.settings.scrollingSpeed + 'ms ' + this.settings.easing);

            //如果是横屏
            if (!this.layoutDirection) {
                this.__initLayout();
            }

            //导航元素
            if (this.settings.navigation) {
                this.__initNavigator();
                this.__updateNav();
            }
            this.__initEvent();
                    var self = this;
            // 测试发现，IE11本地测试不支持sessionStorage，只有放到服务器上才有效
            var initIndex=0;
            if(sessionStorage){
                initIndex=+sessionStorage.getItem('index');
            }else{
                initIndex=self.settings.index||0;
            }
            setTimeout(function() {
                //初次加载默认滑动到0幻灯片，主要是为了呈现第一屏的动画效果
                self.moveTo(initIndex);
            }, 0);


        },
        __initEvent: function() {
            //监听滚轮事件
            var self = this;
            //阻止子元素的transitionend冒泡
            this.sections.on('transitionend webkitTransitionend oTransitionend MozTransitionend', '*', function(event) {
                event.stopPropagation();
            });
            this.sections.on('transitionend webkitTransitionend oTransitionend MozTransitionend', function(event) {
                self.isRunning = false;
                self.direction = undefined;
                if (self.settings.onLoad) {
                    self.settings.onLoad.call(self, self.curIndex);
                }
            });
            $(window).on('mousewheel', function(e) {
                var delta = e.originalEvent.wheelDelta || e.originalEvent.detail * (-40);
                // console.log('delata', delta);
                if (delta > 0) {
                    //up
                    self.moveSectionUp();
                } else {
                    //down
                    self.moveSectionDown();
                }
            });

            if (this.settings.keyboard) {
                //开启键盘控制
                $(window).on('keyup', function(e) {
                    if (e.which === 39 || e.which === 40) {
                        self.moveSectionDown();
                    } else if (e.which === 38 || e.which === 37) {
                        self.moveSectionUp();
                    }
                });
            }
        },
        //获取滑动页面数量
        getSectionCount: function() {
            return this.section.length;
        },
        moveSectionDown: function() {
            if (this.isRunning) {
                return;
            }
            this.prevIndex = this.curIndex;
            this.curIndex++;
            if(sessionStorage){
                sessionStorage.setItem('index',this.curIndex);
            }            
            if (this.curIndex >= this.sectionCount) {
                this.curIndex = this.settings.loop ? 0 : this.sectionCount - 1;
            }
            if (this.prevIndex !== this.curIndex) {
                this.__scrollSlide();
            }
        },
        moveSectionUp: function() {
            if (this.isRunning) {
                return;
            }
            this.prevIndex = this.curIndex;
            this.curIndex--;
            if(sessionStorage){
                sessionStorage.setItem('index',this.curIndex);
            }            
            if (this.curIndex < 0) {
                this.curIndex = this.settings.loop ? this.sectionCount - 1 : 0;
            }
            if (this.prevIndex !== this.curIndex) {
                this.__scrollSlide();
            }

        },
        moveTo: function(index) {
            if (this.isRunning) {
                return;
            }
            if (index < 0 || index >= this.sectionCount) {
                return;
            }
            this.prevIndex = this.curIndex;
            this.curIndex = index;
            if(sessionStorage){
                sessionStorage.setItem('index',this.curIndex);
            }
            if (this.prevIndex != this.curIndex) {
                this.__scrollSlide();
            }

        },
        __updateNav: function() {
            this.$navIndicators.eq(this.curIndex).addClass('active').siblings().removeClass('active');
        },
        //针对横屏的处理
        __initLayout: function() {
            this.sections.width(this.sectionCount * 100 + '%');
            var sectionWidth = (100 / this.sectionCount).toFixed(2) + '%';
            this.section.each(function() {
                $(this).width(sectionWidth).css('float', 'left');
            });
            if (!this.layoutDirection) {
                this.sections.addClass('sections-horizontal');
            }
        },
        //添加导航控件
        __initNavigator: function() {
            var navTabs = document.createElement('ul'),
                str = '';
            navTabs.className = this.settings.selectors.navTabs;
            for (var i = 0; i < this.sectionCount; i++) {
                str += '<li class="nav-item"></li>'
            }
            navTabs.innerHTML = str;
            this.$elem.append(navTabs);
            this.$navIndicators = this.$elem.find('.nav-item');
            var self = this;
            this.$navIndicators.on('click', function(e) {
                self.moveTo($(this).index());
            });
        },

        __scrollSlide: function() {
            this.isRunning = true;
            //滑动开始前的回调
            if (this.prevIndex <= this.curIndex) {
                this.direction = 'down';
            } else {
                this.direction = 'up';
            }
            if (this.settings.onLeave) {
                this.settings.onLeave.call(this, this.prevIndex, this.curIndex, this.direction);
            }
            if (this.settings.navigation) {
                this.__updateNav();
            }
            if (this.layoutDirection) {
                this.sections.css(_prefix+'transform', 'translateY(-' + this.curIndex * 100 + '%)');
                
            } else {
                var left = (this.curIndex * 100 / this.sectionCount).toFixed(2);
                this.sections.css(_prefix+'transform', 'translateX(-' + left + '%)');
            }
        }

    };
    $.fn.MyFullPage = function(options) {
        var instance;
        return this.each(function() {
            var me = $(this),
                instance = me.data('MyFullpage');
            //单例模式
            if (!instance) {
                //instance=new MyFullPage(me,options);
                instance = Object.create(MyFullpage);
                instance.setup(me, options);
                me.data('MyFullPage', instance);
            }
            return instance;
        });
    };
    $.fn.MyFullPage.default = {
        selectors: {
            sections: '.sections',
            section: '.section',
            navTabs: 'nav-tabs',
            active: '.active'
        },
        index: 0, //默认索引从0开始
        easing: 'ease-in-out', //默认动画缓动函数
        scrollingSpeed: 700, //滚动速度，默认单位是毫秒
        loop: false, //是否循环滚动
        navigation: true, //是否显示分页
        keyboard: true, //是否键盘控制
        direction: 'vertical', //horizontal
        onLoad: null, //幻灯片加载完成的回调函数，参数为index
        onLeave: null //滑动动画开始前的回调函数，参数分别是prevIndex,index,direction
    };
})(jQuery);
