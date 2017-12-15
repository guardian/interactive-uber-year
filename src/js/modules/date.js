var scrollTop = 0;

module.exports =  {
    init: function() {
        this.setValues();
        this.bindings();
    },

    bindings: function() {
        $(window).scroll(function() {
            this.setValues();
            this.findCurrentEvent();
            this.fixDate();
        }.bind(this));
    },

    setValues: function() {
        scrollTop = $(window).scrollTop();
    },

    findCurrentEvent: function() {
        $('.uber-timeline__event').each(function(i, el) {
            var position = $(el).offset().top;
            if ((position + 48) > scrollTop) {
                this.populateDay(el);
                return false;
            }
        }.bind(this));
    },

    populateDay: function(el) {
        var data = $(el).data();

        $('.uber-timeline__date').text(data.date);
        $('.uber-timeline__month').text(data.month + ' 2017');
    },

    fixDate: function() {
        if (scrollTop > $('.uber-timeline').offset().top) {
            $('.uber-timeline__day').addClass('is-fixed');
        } else {
            $('.uber-timeline__day').removeClass('is-fixed');
        }
    }
};
