var $ = require('../vendor/jquery');

var canvas, W, H, ctx, request, path = [], ubers = [], uber;

module.exports = {
    init: function() {
        this.createCanvas();
        this.bindings();
    },

    bindings: function() {
        $(window).resize(function() {
            this.setCanvasSize();
            this.calculateElements();
            this.draw();
        }.bind(this))
    },

    createCanvas: function() {
        canvas = document.getElementsByClassName('uber-timeline__road')[0];
        this.setCanvasSize();
        this.calculateElements();
        ctx = canvas.getContext('2d');
        this.loadImage();
    },

    loadImage: function() {
        uber = new Image();
        uber.onload = this.draw();
        uber.src = '@@assetPath@@/assets/images/uber.png';
    },

    setCanvasSize: function() {
        W = $('.uber-timeline__road').width();
        H = $('.uber-timeline__road').height();
        canvas.width = W;
        canvas.height = H;
    },

    calculateElements: function() {
        var kinks = H / 100;
            path = [];
            ubers = [];

        path.push({
            x: 60,
            y: 0
        })

        for (var i = 0; kinks > i; i++) {
            path.push({
                x: Math.floor(Math.random() * (120 - 20)) + 20,
                y: path[i].y + Math.floor(Math.random() * (300 - 100)) + 100,
                junction: Math.floor(Math.random() * 20 - 1) + 1
            })
        }

        var cars = kinks / 5;

        for (var i = 0; cars > i; i++) {
            ubers.push({
                x: path[i * 5].x,
                y: path[i * 5].y
            })
        }
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

/*
        for (var i = 0; i < path.length; i++) {
            if (path[i].junction < 5) {
                ctx.beginPath();
                ctx.moveTo(path[i].x, path[i].y);
                ctx.lineTo(path[i].x - (path[i].junction * 50), path[i].y + (path[i].junction * 100) + 200);
                ctx.stroke();
            }
        }
*/
    },

    drawUber: function() {
        for (var i in ubers) {
            ctx.drawImage(uber, ubers[i].x - 16, ubers[i].y - 34, 32 , 69);
        }
    },

    draw: function() {
        ctx.clearRect(0, 0, W, H);
        this.drawRoad();
        this.drawUber();
    }
}