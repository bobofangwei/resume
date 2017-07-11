// 利用javascript绘制饼状图
// 这里仅考虑本项目需求
function drawCircle(canvas, percentage, color, borderColor, textColor, direction) {
    var drawing = canvas;
    if (drawing.getContext) {
        var context = drawing.getContext('2d');
        var width = drawing.width;
        var radius = width / 2-25;
        //圆心位置
        var x = radius+25;
        var y = radius+25;
        //移动圆点
        context.translate(x, y);

        //绘制饼状图的边框
        context.strokeStyle = borderColor;
        context.beginPath();
        //context.arc(x,y,radius,0,2*Math.PI,false);
        context.arc(0, 0, radius, 0, 2 * Math.PI, false)
        context.stroke();

        //绘制占比
        context.moveTo(0, 0);
        context.beginPath();
        context.fillStyle = color;
        var deg = percentage * 2 * Math.PI;
        if (direction === 'left') {
            context.rotate(-Math.PI - deg / 3);
        } else {
            context.rotate(-deg / 3);
        }

        context.beginPath();
        context.arc(0, 0, radius, 0, deg, false);
        context.lineTo(0, 0);
        context.closePath();
        context.fill();

        //绘制文字
        if (direction === 'left') {
            context.rotate(Math.PI + deg / 3);
        } else {
            context.rotate(deg / 3);
        }

        var text = percentage * 100 + '%';
        context.fillStyle = textColor;
        context.textBaseline = "middle";
        context.font = "bold 12px Arial";
        context.textAlign = 'center';
        if (direction === 'left') {
            context.fillText(text, -radius / 2, 0);
        } else {
            context.fillText(text, radius / 2, 0);
        }

    }
}
