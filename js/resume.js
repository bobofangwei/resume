$sections = $('.section');
$('#container').MyFullPage({
    onLoad: function(index) {        
        var $curTimeline=$sections.eq(index).find('.timeline');
        $curTimeline.find('.timeline-half-right').css({'transform':'translate3d(0,0,0)'}).find('.fixed').css({'transform':'translate3d(0,0,0)'});
        $curTimeline.find('.timeline-half-left').css({'transform':'translate3d(0,0,0)'}).find('.fixed').css({'transform':'translate3d(0,0,0)'});
        if(index==0){
          $curTimeline.find('.line').css({'width':'50px','left':'-50px'})  
        }
    },
    onLeave:function(index,nextIndex,direction){
        var $curTimeline=$sections.eq(index).find('.timeline');
        $curTimeline.find('.timeline-half-right').css({'transform':'translate3d(50px,0,0)'}).find('.fixed').css({'transform':'translate3d(-50px,0,0)'});
        $curTimeline.find('.timeline-half-left').css({'transform':'translate3d(-50px,0,0)'}).find('.fixed').css({'transform':'translate3d(50px,0,0)'})
        if(index==0){
          $curTimeline.find('.line').css({'width':'100px','left':'-100px'})  
        }
    },
});
