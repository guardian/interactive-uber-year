var $ = require('../vendor/jquery');

var canvas, W, H, ctx, request, path = [];

module.exports = {
    init: function() {
        this.createCanvas();
        this.bindings();
    },

    bindings: function() {
        $(window).resize(function() {
            this.setCanvasSize();
            this.calculateRoad();
        }.bind(this))
    },

    createCanvas: function() {
        canvas = document.getElementsByClassName('uber-timeline__road')[0];
        this.setCanvasSize();
        this.calculateRoad();
        ctx = canvas.getContext('2d');

        this.draw();
    },

    setCanvasSize: function() {
        W = $('.uber-timeline__road').width();
        H = $('.uber-timeline__road').height();
        canvas.width = W;
        canvas.height = H;
    },

    calculateRoad: function() {
        var kinks = H / 100;

        path.push({
            x: 60,
            y: 0
        })

        for (var i = 0; kinks > i; i++) {
            path.push({
                x: Math.floor(Math.random() * (120 - 20)) + 20,
                y: path[i].y + Math.floor(Math.random() * (300 - 100)) + 100
            })
        }

        console.log(path);
    },

    drawRoad: function() {
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        ctx.strokeStyle = '#ffffff';

        for (var i = 0; i < path.length; i++) {
            ctx.lineTo(path[i].x, path[i].y);
        }

        ctx.lineWidth = 14;
        ctx.stroke();
    },

    draw: function() {
        this.drawRoad();
    }
}