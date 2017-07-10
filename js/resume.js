$sections = $('.section');
$('#container').MyFullPage({
    onLoad: function(index) {
        var $curTimeline=$sections.eq(index).find('.timeline');
        
    }
});
