var $ = require('../vendor/jquery.js');

module.exports =  {
    init: function() {
        // nothing to init
    },

    answer: function(questionNumber) {
        if (window.ga) {
            var gaTracker = window.guardian.config.googleAnalytics.trackers.editorial;

            window.ga(gaTracker + '.send', 'event', 'Click', 'Internal', 'Trump insulted quiz | answered ' + (questionNumber + 1), 1, {
                nonInteraction: true
            });
        }
    }
};
