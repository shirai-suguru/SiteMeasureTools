/**
 *
 **/

// library import
var fs    = require('fs');
var utils = require('utils');

// UserAgent Setting
const USERAGET  = 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A403 Safari/8536.25';

// Global varibales
var isUseFrame  = false;      // default
var pageOpenDate = null;
var pageResponseMiliSeconds   = null;
var myPageResponseMiliSeconds = null;

// casper instance and default setting
var casper = require('casper').create({
    verbose: true,
    logLevel: "debug",
    pageSettings: {
        loadImages:  true,
        loadPlugins: true,
        userAgent:   USERAGET
    },
    onPageInitialized: function(){
        window.ontouchstart = null;
        window.ontouchmove  = null;
        window.ontouchend   = null;
        window.orientation  = 0;
    }
});


// platform select
var platform = casper.cli.get("platform");
if ( platform == undefined ) {
    casper.echo(' To run with  --platform=XXXX ','ERROR');
    casper.exit();
}
eval(fs.read('./' + platform + '_conf.js'));

// application select
var appSelect = casper.cli.get("app");
if ( appSelect == undefined ) {
    casper.echo(' To run with  --app=XXXX ','ERROR');
    casper.exit();
}
var appFilePath = './' + appSelect + '_conf.js';
if( utils.isJsFile(appFilePath) == false ) {
    casper.echo('You muse specify js file ! ' + appFilePath  + 'is not js file! ','ERROR');
    casper.exit();
}
eval(fs.read(appFilePath));

// Measure Response
casper.on("load.finished", function() {
    pageResponseMiliSeconds = new Date() - pageOpenDate;
    this.echo(this.requestUrl + " loaded in " + pageResponseMiliSeconds + "ms", "PARAMETER");
});



pageOpenDate = new Date();
casper.start(LOGIN_URL);

casper.then(function(){
    this.capture('LOGIN.png');
    fillLoginForm(this);
});

casper.then(function(){
    this.capture('LOGIN_after.png');
});

pageOpenDate = new Date();
// TODO アプリオープン時設定したwindowのプロパティがはずれる
casper.thenOpen(APPLI_URL);

casper.thenEvaluate(function(){
    console.log(window.navigator.userAgent);
    console.log(navigator.userAgent);
    console.log("window.orientation:" + window.orientation);
    console.log("orientation:" + orientation);
});

if( isUseFrame === true ){
    casper.withFrame(FRAME_NAME,function(){
        this.echo(this.getTitle(), "PARAMETER");
    });
}

casper.then(function(){
    this.capture('APPLI_top.png');
});

if ( isUseFrame == true ) {
    casper.withFrame(FRAME_NAME,function(){
        pageOpenDate = new Date();
        clickMypageLink(this);
    });

} else {
    casper.thenEvaluate(function(){
        pageOpenDate = new Date();
        clickMypageLink(this);
    });
}

casper.then(function(){
    myPageResponseMiliSeconds = pageResponseMiliSeconds;
    this.capture('APPLI_mypage.png');
});


casper.thenOpen(GRAPH_POST_URL,{
    method: 'post',
    data:   {
        'number' : myPageResponseMiliSeconds
    }
});

casper.then(function(){
   this.echo("Growthforecast post!", "PARAMETER");
});

casper.run();