/**
 *
 **/


// TODO move to conf file

const USERAGET  = 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A403 Safari/8536.25';
const LOGIN_URL = 'http://t.gree.jp/?action=login&ignore_sso=1&backto=';
const LOGIN_NAME_FORM     = 'user_mail';
const LOGIN_PASSWORD_FORM = 'user_password';

const LOGIN_NAME     = 'suguster.goodoo@ezweb.ne.jp';
const LOGIN_PASSWORD = 'sig6fig';
const APPLI_URL      = 'http://pf.gree.net/58124';
const FRAME_NAME     = 'app_58124';
const GRAPH_POST_URL = 'http://localhost:5125/api/socialgame_response/gree_58124/mypage_response';


var isUseFrame  = true;

var pageOpenDate = null;
var pageResponseMiliSeconds   = null;
var myPageResponseMiliSeconds = null;


function fillLoginForm(that) {
    that.fill('form[method="post"]',{
        'user_mail':     LOGIN_NAME,
        'user_password': LOGIN_PASSWORD
    }, true);
}



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
        this.echo(this.getTitle(), "PARAMETER"););
    });
}

casper.then(function(){
    this.capture('APPLI_top.png');
});


casper.withFrame(FRAME_NAME,function(){
    pageOpenDate = new Date();
    this.click('div#pageInner div a');
});

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