var $ = require('../vendor/jquery');
var fontSpy = require('../vendor/jquery.fontspy.js').fontSpy;

var canvas, W, H, ctx, request, path = [], ubers = [], locators = [], spinningUber = [], smokingUbers = [], uberImage;

module.exports = {
    init: function() {
        this.waitForFontsToLoad();
    },

    waitForFontsToLoad: function() {
        var fontsLoaded = 0;

        fontSpy('Guardian Egyptian Web', {
            success: function() {
                fontsLoaded++;
            }
        });

        fontSpy('Guardian Text Egyptian Web', {
            success: function() {
                fontsLoaded++;
            }
        });

        fontSpy('Guardian Text Sans Web', {
            success: function() {
                fontsLoaded++;
            }
        });

        var interval;

        interval = setInterval(function() {
            if (fontsLoaded === 3) {
                this.createCanvas();
                this.bindings();
                clearInterval(interval);
            } else {
            }
        }.bind(this), 200);
    },

    bindings: function() {
        $(window).resize(function() {
            this.setCanvasSize();
            this.calculateElements();
            this.draw();
            this.animate();
        }.bind(this))
    },

    createCanvas: function() {
        canvas = document.getElementsByClassName('uber-road')[0];
        this.setCanvasSize();
        this.calculateElements();
        ctx = canvas.getContext('2d');
        this.loadImage();
    },

    loadImage: function() {
        uberImage = new Image();
        uberImage.onload = function() {
            this.draw();
            this.animate();
        }.bind(this);
        uberImage.src = '@@assetPath@@/assets/images/uber.png';
    },

    setCanvasSize: function() {
        W = $('.uber-road').width();
        H = $('.uber-road').height();
        canvas.width = W;
        canvas.height = H;
    },

    calculateElements: function() {
        var kinks = H / 100;
            path = [];
            ubers = [];
            locators = [];
            spinningUber = [];
            smokingUbers = [];
            cancelAnimationFrame(request);
            request = undefined;

        path.push({
            x: W / 2,
            y: 0
        })

        for (var i = 0; kinks > i; i++) {
            path.push({
                x: Math.floor(Math.random() * ((W - 14) - (W - 50))) + (W - 50),
                y: path[i].y + Math.floor(Math.random() * (300 - 100)) + 100,
                junction: Math.floor(Math.random() * 20 - 1) + 1
            })
        }

        var cars = kinks / 3;

        for (var i = 0; cars > i; i++) {
            ubers.push({
                x: path[i * 3].x,
                y: path[i * 3].y,
                path: i * 3,
                direction: Math.random() > .5 ? 1 : -1
            });

            ubers[i] = this.calculateUberPaths(ubers[i]);
        }

        var locatorOffset = $('#bannerandheader').length ? $('#bannerandheader').outerHeight() - 16 : -16;

        $('.uber-timeline__day').each(function(i, el) {
            var y = $(el).offset().top - locatorOffset;
            locators.push({
                x: this.getPointOnRoad(y),
                y: y,
                radarSize: 0,
                opacity: 0.4
            })
        }.bind(this));

        var spinningUberY = [5, 17, 28, 42];

        for (var i = 0; i < spinningUberY.length; i++) {
            spinningUber.push({
                x: W / 5,
                y: path[spinningUberY[i]].y,
                r: 0
            })
        }

        var smokingUberY = [7, 22];

        for (var i = 0; i < smokingUberY.length; i++) {
            smokingUbers.push({
                x: W / 4,
                y: locators[smokingUberY[i]].y + 80,
                smoke: this.generateSmoke()
            });
        }
    },

    getPointOnRoad: function(y) {
        for (var i in path) {
            if (path[i].y > y) {
                var above = path[i - 1];
                var below = path[i];
                var angle = (below.x - above.x) / (below.y - above.y);

                return angle * y + (above.x - angle * above.y);
            }
        }
    },

    generateSmoke: function(i) {
        var smoke = [];

        for (var i = 0; i < 9; i++) {
            smoke.push({
                x: Math.floor(Math.random() * 4) - 2,
                y: i * 6,
                radius: i * 3.75,
                opacity: 0.5
            });
        }
        return smoke;
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
        ctx.closePath();

        for (var i = 0; i < path.length; i++) {
            if (path[i].junction < 8) {
                ctx.beginPath();
                ctx.moveTo(path[i].x, path[i].y);
                ctx.lineTo(path[i].x - W, path[i].y - (path[i].junction * 100) + 200);
                ctx.closePath();
                ctx.stroke();
            }
        }
    },

    drawUber: function() {
        for (var i in ubers) {
            this.drawRotatedImage(uberImage, ubers[i].x, ubers[i].y, ubers[i].angle, 25, 54);
        }
    },

    drawLocators: function() {
        for (var i in locators) {
            ctx.beginPath();
            ctx.ellipse(locators[i].x, locators[i].y, locators[i].radarSize, locators[i].radarSize, 0, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(75, 198, 223, ' + locators[i].opacity + ')';
            ctx.closePath();
            ctx.fill();

            ctx.beginPath();
            ctx.ellipse(locators[i].x, locators[i].y, 4, 4, 0, 0, 2 * Math.PI);
            ctx.fillStyle = '#4bc6df';
            ctx.closePath();
            ctx.fill();
        }
    },

    drawSpinningUber: function() {
        for (var i in spinningUber) {
            this.drawRotatedImage(uberImage, spinningUber[i].x, spinningUber[i].y, spinningUber[i].r, 25, 54)
        }
    },

    drawSmokingUber: function() {
        for (var i in smokingUbers) {
            var uber = smokingUbers[i];
            this.drawRotatedImage(uberImage, uber.x, uber.y, 1.2, 25, 54);

            for (var s in uber.smoke) {
                var smoke = uber.smoke[s]
                ctx.beginPath();
                ctx.ellipse(uber.x + smoke.x + 20, uber.y - 10 - smoke.y, smoke.radius, smoke.radius, 0, 0, 2 * Math.PI);
                ctx.fillStyle = 'rgba(200, 200, 200, ' + smoke.opacity + ')';
                ctx.closePath();
                ctx.fill();
            }
        }
    },

    drawRotatedImage: function(image, x, y, angle, width, height) {
        ctx.save(); 
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.drawImage(image, -(width/2), -(height/2), width, height);
        ctx.restore(); 
    },

    updateLocators: function() {
        for (var i in locators) {
            locators[i].radarSize = locators[i].radarSize > 20 ? 0 : locators[i].radarSize + 0.25;
            locators[i].opacity = locators[i].radarSize > 16 ? locators[i].opacity - 0.025 : 0.4;
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
    },

    updateSpinningUber: function() {
        for (var i in spinningUber) {
            spinningUber[i].r = spinningUber[i].r > 6.283 ? 0 : spinningUber[i].r + 0.15;
        }
    },

    updateSmokingUber: function() {
        for (var i in smokingUbers) {
            for (var s in smokingUbers[i].smoke) {
                var smoke = smokingUbers[i].smoke[s];

                if (smoke.y > 60) {
                    smoke.y = 4;
                    smoke.x = Math.floor(Math.random() * 4) - 2;
                    smoke.opacity = 0.5;
                    smoke.radius = 5;
                } else {
                    smoke.y = smoke.y + 0.5;
                    smoke.x = smoke.x + (Math.random() > .5 ? 0.3 : -.3);
                    smoke.opacity = smoke.opacity - .00625;
                    smoke.radius = smoke.radius + .458333333; 
                }

                smokingUbers[i].smoke[s] = smoke;
            }
        }
    },

    calculateUberPaths: function(uber) {
        if (uber.direction > 0) {
            uber.path = uber.path + 1;
        } else {
            uber.path = uber.path - 1;
        }

        if (uber.path > path.length - 2) {
            uber.path = 0;
            uber.x = -200;
            uber.y = -200;
        }

        if (0 > uber.path) {
            uber.path = path.length - 2;
            uber.x = path[uber.path - 1].x;
            uber.y = path[uber.path - 1].y;
        }

        return uber;
    },

    animate: function() {
        this.updateUber();
        this.updateLocators();
        this.updateSpinningUber();
        this.updateSmokingUber();
        this.draw();
        request = requestAnimationFrame(this.animate.bind(this));
    },

    draw: function() {
        ctx.clearRect(0, 0, W, H);
        this.drawRoad();
        this.drawUber();
        this.drawLocators();
        this.drawSpinningUber();
        this.drawSmokingUber();
    }
}