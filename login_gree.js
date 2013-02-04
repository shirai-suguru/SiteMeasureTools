//TODO  parameter setting split file
const CONSOLE_LOG_ON   = true;

console.debuglog = function(msg){
    if( CONSOLE_LOG_ON == true ) {
        console.log(msg);
    }
};

var args = require('system').args;

var appliId  = 'XXXXX';
if ( args.length !== 2 ) {
    console.log("You should enter application Id !");
    phantom.exit(1);
} else {
    console.debuglog(args[1]);
    appliId = args[1];
}

var appliUrl = 'http://pf.gree.net/' + appliId;

// jsdeferred.js require
if(!phantom.injectJs("jsdeferred.js")){
    console.log("You should have ./jsdeferred.js");
    console.log("https://github.com/cho45/jsdeferred");
    phantom.exit(1);
}

if(!phantom.injectJs(appliId + "_conf.js")){
    console.log("You should have ./" + appliId +"_conf.js");
    phantom.exit(1);
}


// page settings
var page = require('webpage').create();

// Deferred
Deferred.define();

// UserAgent
page.settings.userAgent = G_USERAGENT;

// Fake JavaScript
page.onInitialized = function() {
    page.evaluate(function(){
        window.ontouchstart = null;
        window.ontouchmove  = null;
        window.ontouchend   = null;
        window.orientation  = 0;
    });
};

page.onConsoleMessage = function(msg) {
    console.debuglog("console.log" + msg );
};

page.onResourceReceived = function(response) {
    if ( response.redirectURL != null ) {
        console.debuglog('Response (#' + response.id + ', stage "' + response.stage + '"): ' + response.redirectURL);
    }
};

// Global variables
var nextUrl = "";
var imgNum = 1;
var loadInProgress = false;

// Global Functions
function pageLoadWait ( page ) {
    var deferredObj = new Deferred();


page.onLoadStarted = function() {
  loadInProgress = true;
  console.debuglog("load started:" + page.frameUrl + "\n             " + page.url);
};


    page.onLoadFinished = function(){
        loadInProgress = false;
        console.debuglog("href:" + page.evaluate(function(){return location.href}));
        page.onLoadFinished = function(){};
        console.debuglog("load finished");
        deferredObj.call();
    }
    return deferredObj;
}

function pageOpenLoadWait( url, page ) {
    var deferredObj = new Deferred();

page.onLoadStarted = function() {
  loadInProgress = true;
  console.debuglog("load started:" + page.frameUrl + "\n             " + page.url);
};

    page.onLoadFinished = function(){
        loadInProgress = false;
        console.debuglog("href:" + page.evaluate(function(){return location.href}));
        page.onLoadFinished = function(){};
        console.debuglog("load finished");
        deferredObj.call();
    }
    page.open(url,function(status){
        if( status != "success" ) {
            console.debuglog("fail:" + status + ":" + imgNum++ );
            console.debuglog("url:" + url );
            //deferredObj.call();
        } else {
            console.debuglog("success:" + imgNum++ );
        }
    });
    return deferredObj;
}

// Main
next(function() {
    return pageOpenLoadWait(G_GREE_LOGIN_URL, page);

}).next(function() {

    page.injectJs("./" + appliId + "_conf.js");
    //Enter Credentials
    page.evaluate(function() {
          var login_id     = document.getElementById("user_mail");
          var login_pass   = document.getElementById("user_password_login");
          login_id.value   = G_EMAIL;
          login_pass.value = G_PASSWORD;
    });

}).next(function() {

    deferredObj = pageLoadWait( page );

    //Login
    page.evaluate(function() {
        var delForm = document.getElementById('login_login');
        if( delForm !== null ) {
            delForm.parentNode.removeChild(delForm);
        }
        var loginFormDiv = document.getElementById('login-form');
        var loginForm    = loginFormDiv.firstChild.firstChild;
        if( loginForm !== null ) {
            loginForm.submit();
        } else {
            var arr = document.getElementsByClassName("login-form");
            var i;

            for (i=0; i < arr.length; i++) {
              loginForm = arr[i].firstChild;
              loginForm.submit();
              return ;
            }
        }

    });
    return deferredObj;

}).next(function() {

    pageOpenLoadWait(appliUrl , page );
    return wait(3);

}).next(function() {
    page.render(appliId + G_IMAGE_SUFFIX);

}).next(function() {

    page.injectJs("./" + appliId + "_conf.js");

    nextUrl = page.evaluate(function(){
        var arr = document.getElementById(G_IFRAME_ID);
        return arr.src;
    });

}).next(function() {

    return pageOpenLoadWait(nextUrl , page );

}).next(function() {

    page.render(appliId + "_" + imgNum++ + G_IMAGE_SUFFIX);

}).next(function() {

    nextUrl = getMypageUrl(page);

}).next(function() {
    t = Date.now();
    page.open(nextUrl,function(status) {
        if( status != "success" ) {
        } else {
            t = Date.now() - t;
            console.log('Loading time ' + t + ' msec');
            page.render(appliId + "_" + imgNum++ + G_IMAGE_SUFFIX);
        }
        phantom.exit();
    });

}).error(function(args){
    console.log(JSON.stringify(args));
    page.render('error-screenshot.png');
    page.close();
    phantom.exit(1);
});

