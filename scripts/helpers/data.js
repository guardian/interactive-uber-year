var request = require('sync-request');
var fs = require('fs-extra');
var gsjson = require('google-spreadsheet-to-json');
var deasync = require('deasync');
var config = require('../config.json');
var userHome = require('user-home');
var keys = require(userHome + '/.gu/interactives.json');

var json,
    data = {regions: {}},
    conferences = [];

function fetchData(callback) {
    gsjson({
        spreadsheetId: config.data.id,
        allWorksheets: true,
        credentials: keys.google
    })
    .then(function(result) {
        callback(result);
    })
    .then(function(err) {
        if (err) {
            console.log(err);
        }
    });
}

function setSheetNames() {
    data = {
        'questions': data[0]
    }
}

function formatAnswers() {
    for (var i in data.questions) {
        if (data.questions[i].text1) {
            data.questions[i].text1 = '<span>' + data.questions[i].text1.split('.')[0] + '</span>' + data.questions[i].text1.substring(data.questions[i].text1.indexOf('.') + 1);
        }
        if (data.questions[i].text2) {
            data.questions[i].text2 = '<span>' + data.questions[i].text2.split('.')[0] + '</span>' + data.questions[i].text2.substring(data.questions[i].text2.indexOf('.') + 1);
        }
    }
}

module.exports = function getData() {
    var isDone = false;

    fetchData(function(result) {
        data = result;
        setSheetNames();
        formatAnswers();

        console.log(data);

        isDone = true;
    });

    deasync.loopWhile(function() {
        return !isDone;
    });

    return data;
};