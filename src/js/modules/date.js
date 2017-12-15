var scrollTop = 0;

module.exports =  {
    init: function() {
        this.onScroll();
        this.bindings();
    },

    bindings: function() {
        $(window).scroll(function() {
            this.onScroll();
        }.bind(this));
    },

    setValues: function() {
        scrollTop = $(window).scrollTop();
    },

    onScroll: function() {
        this.setValues();
        this.findCurrentEvent();
        this.fixDate();
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
        if (scrollTop > $('.uber-timeline').offset().top - 6) {
            $('.uber-timeline__day').addClass('is-fixed');
        } else {
            $('.uber-timeline__day').removeClass('is-fixed');
        }
    }
};
