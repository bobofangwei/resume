$(function() {
    $sections = $('.section');
    var windowWidth = $(window).width();

    function drawPercent() {
        //var color = ['#00B6DD', '#F49100', '#00B6DD'];
        var color = ['#00B6DD', '#00B6DD', '#00B6DD'];
        var data = ['0.9', '0.65', '0.35'];
        canvasWrappers = $sections.eq(2).find('.skill-canvas-wrapper');
        canvasWrappers.each(function(index, dom) {
            var canvas = document.createElement('canvas');
            canvas.className = "canvas";
            canvas.width = 150;
            drawCircle(canvas, data[index], color[index], '#C5C5C5', '#FFF', index % 2 ? 'right' : 'left')
            dom.appendChild(canvas);
        });
    }
    //自适应设置
    //当界面宽度<768的时候，调整界面，实现响应式布局
    function reLayout() {
        var $contents = $sections.eq(2).find('.content-half');
        if ($(window).width() <= 768) {
            //使用js实现响应式
            $contents.each(function(index, el) {
                //对于偶数个（原来在左边）
                if (index % 2 === 0) {
                    $(el).removeClass('timeline-half-left').addClass('timeline-half-right');
                }
            });
        } else {
            $contents.each(function(index, el) {
                if (index % 2 === 0) {
                    $(el).removeClass('timeline-half-right').addClass('timeline-half-left');
                }
            });
        }
    }

    $(window).resize(function() {
        windowWidth = $(window).width();
        reLayout();
    });

    $('#container').MyFullPage({
        onLoad: function(index) {
            console.log('load');
            var $curSection = $sections.eq(index);
            var $curTimeline = $curSection.find('.timeline');
            if ($curTimeline.length) {
                $curTimeline.find('.timeline-half-right').css({
                    'transform': 'translate3d(0,0,0)'
                }).find('.fixed').css({
                    'transform': 'translate3d(0,0,0)'
                });
                $curTimeline.find('.timeline-half-left').css({
                    'transform': 'translate3d(0,0,0)'
                }).find('.fixed').css({
                    'transform': 'translate3d(0,0,0)'
                });
            }
            if (index == 0) {
                $curTimeline.find('.line').css({
                    'width': '50px',
                    'left': '-50px'
                })
            } else if (index == 2) {
                $curTimeline.find('.timeline-half-right').find('.skill-canvas-line').css({
                    'left': 0
                });
                $curTimeline.find('.timeline-half-left').find('.skill-canvas-line').css({
                    'right': 0
                });

            } else if (index == 3) {
                $curSection.find('.rightAnim').each(function(index, elem) {
                    var initRight = Math.round(parseInt($(elem).css('right')) * 100 / windowWidth);
                    $(elem).css({
                        'right': (initRight + 5) + '%'
                    });

                });
                $curSection.find('.leftAnim').each(function(index, elem) {
                    var initLeft = Math.round(parseInt($(elem).css('left')) * 100 / windowWidth);
                    $(elem).css({
                        'left': (initLeft + 5) + '%'
                    });

                });

            }
        },
        onLeave: function(index, nextIndex, direction) {
            console.log('leave');
            var $curSection = $sections.eq(index);
            var $curTimeline = $curSection.find('.timeline');
            if ($curTimeline.length) {
                $curTimeline.find('.timeline-half-right').css({
                    'transform': 'translate3d(50px,0,0)'
                }).find('.fixed').css({
                    'transform': 'translate3d(-50px,0,0)'
                });
                $curTimeline.find('.timeline-half-left').css({
                    'transform': 'translate3d(-50px,0,0)'
                }).find('.fixed').css({
                    'transform': 'translate3d(50px,0,0)'
                })
            }
            $curSection.find('[style]').removeAttr('style');
        },
    });
    reLayout();
    drawPercent();
});
