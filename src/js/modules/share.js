var $ = require('../vendor/jquery.js');

var pageUrl = window.location.href.split('#')[0];

module.exports =  {
    init: function() {
        this.setLinks('.uber-share', 'Collision course: Uber\'s terrible 2017');
    },

    setLinks: function(parent, title) {
        $(parent + ' .uber-share__button--twitter a').attr('href', this.getTwitterLink(title));
        $(parent + ' .uber-share__button--facebook a').attr('href', this.getFacebookLink(title));
        $(parent + ' .uber-share__button--email a').attr('href', this.getEmailLink(title));
    },

    getTwitterLink: function(title) {
        return 'https://twitter.com/intent/tweet?text=' + encodeURI(title) + 
                '&url=' + encodeURIComponent(pageUrl + '?CMP=share_btn_tw');
    },

    getFacebookLink: function(title) {
        return 'https://www.facebook.com/dialog/share?app_id=180444840287&href=' + encodeURIComponent(pageUrl + '?CMP=share_btn_fb');
    },

    getEmailLink: function(title) {
        return 'mailto:?subject=' + encodeURIComponent(title) +
                '&body=' + encodeURIComponent(pageUrl + '?CMP=share_btn_link');
    }
};