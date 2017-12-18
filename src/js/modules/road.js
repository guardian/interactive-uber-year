var $ = require('../vendor/jquery');

var canvas, W, H, ctx, request, path = [], ubers = [], uberImage;

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
        uberImage = new Image();
        uberImage.onload = function() {
            this.draw();
            this.updateUber();
        }.bind(this);
        uberImage.src = '@@assetPath@@/assets/images/uber.png';
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
            cancelAnimationFrame(request);
            request = undefined;

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
                y: path[i * 5].y,
                path: i * 5,
                direction: Math.random() > .5 ? 1 : -1
            });

            ubers[i] = this.calculateUberPaths(ubers[i]);
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
    },

    drawUber: function() {
        for (var i in ubers) {
            this.drawRotatedImage(uberImage, ubers[i].x, ubers[i].y, ubers[i].angle, 20, 43);
        }
    },

    updateUber: function() {
        for (var i in ubers) {
            var uber = ubers[i];

            uber.tx = path[uber.path].x - uber.x;
            uber.ty = path[uber.path].y - uber.y;
            uber.distance = Math.sqrt(uber.tx*uber.tx + uber.ty*uber.ty);
            uber.incrementX = (uber.tx / uber.distance) * 3;
            uber.incrementY = (uber.ty / uber.distance) * 3;
            uber.angle = Math.atan2(uber.ty, uber.tx) - (270 * Math.PI / 180);

            if (uber.distance < 4) {
                uber = this.calculateUberPaths(uber);
            }

            uber.x = uber.x + uber.incrementX;
            uber.y = uber.y + uber.incrementY;

            ubers[i] = uber;
        }

        this.draw();
        request = requestAnimationFrame(this.updateUber.bind(this));
    },

    calculateUberPaths: function(uber) {
        uber.path = uber.path + 1;

        if (uber.path > path.length - 2) {
            uber.path = 0;
            uber.x = -200;
            uber.y = -200;
        }

        return uber;
    },

    drawRotatedImage: function(image, x, y, angle, width, height) {
        ctx.save(); 
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.drawImage(image, -(width/2), -(height/2), width, height);
        ctx.restore(); 
    },

    draw: function() {
        ctx.clearRect(0, 0, W, H);
        this.drawRoad();
        this.drawUber();
    }
}