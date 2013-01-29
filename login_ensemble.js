//TODO  parameter setting split file
const G_APPLI_ID       = '58124';
const G_APPLI_URL      = 'http://pf.gree.net/' + G_APPLI_ID;

//var args = require('system').args;
//
//if ( args.length !== 1 ) {
//    console.log("You should enter application Id !");
//    phantom.exit(1);
//} else {
//    console.log(args[0]);
//}

// jsdeferred.js require
if(!phantom.injectJs("jsdeferred.js")){
    console.log("You should have ./jsdeferred.js");
    console.log("https://github.com/cho45/jsdeferred");
    phantom.exit(1);
}

if(!phantom.injectJs(G_APPLI_ID + "_conf.js")){
    console.log("You should have ./" + G_APPLI_ID +"_conf.js");
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
  console.log(msg);
};

// Global variables
var nextUrl = "";
var imgNum = 1;

// Global Functions
function pageLoadWait ( page ) {
    var deferredObj = new Deferred();

    page.onLoadFinished = function(){
        page.onLoadFinished = function(){};
        deferredObj.call();
    }
    return deferredObj;
}

function pageOpenLoadWait( url, page ) {
    console.log("pageWaitUrl:" + url);
    console.log("pageWait:" + imgNum++);
    var deferredObj = new Deferred();

    page.onLoadFinished = function(){
        page.onLoadFinished = function(){};
        deferredObj.call();
    }
    page.open(url,function(status){
        if( status != "success" ) {
            console.log("fail:" + status + ":" + imgNum++);
            console.log("url:" + url);
            //deferredObj.call();
        } else {
            console.log("success:" + imgNum++);
        }
    });
    return deferredObj;
}

// Main
next(function() {
    return pageOpenLoadWait(G_GREE_LOGIN_URL, page);

}).next(function() {

    page.injectJs("./" + G_APPLI_ID + "_conf.js");
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

    pageOpenLoadWait(G_APPLI_URL , page );
    return wait(3);

}).next(function() {
    page.render(G_APPLI_ID + G_IMAGE_SUFFIX);

}).next(function() {

    page.injectJs("./" + G_APPLI_ID + "_conf.js");

    nextUrl = page.evaluate(function(){
        var arr = document.getElementById(G_IFRAME_ID);
        return arr.src;
    });

}).next(function() {

    return pageOpenLoadWait(nextUrl , page );

}).next(function() {

    page.render(G_APPLI_ID + "_" + imgNum++ + G_IMAGE_SUFFIX);

}).next(function() {

    nextUrl = getMypageUrl(page);

}).next(function() {
    t = Date.now();
    page.open(nextUrl,function(status) {
        if( status != "success" ) {
        } else {
            t = Date.now() - t;
            console.log('Loading time ' + t + ' msec');
            page.render(G_APPLI_ID + "_" + imgNum++ + G_IMAGE_SUFFIX);
        }
        phantom.exit();
    });

}).error(function(args){
    console.log(JSON.stringify(args));
    page.render('error-screenshot.png');
    page.close();
    phantom.exit(1);
});

