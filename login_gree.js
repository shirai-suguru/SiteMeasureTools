//const
const CONSOLE_LOG_ON   = false;

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

if(!phantom.injectJs(appliId + "_conf.js")){
    console.log("You should have ./" + appliId +"_conf.js");
    phantom.exit(1);
}


// page settings
var page = require('webpage').create();

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

// Global variables
var sequenceNum = 0;
var loadInProgress = false;

// Global Functions

page.onLoadStarted = function() {
  loadInProgress = true;
  console.debuglog("load started:" + page.frameUrl + "\n             " + page.url);
};


page.onLoadFinished = function(){
    loadInProgress = false;
    console.debuglog("href:" + page.evaluate(function(){return location.href}));
};

// Main
var nextStep = [
    //#1
    nextUrl = "",
    //#2
    imgNum = 1,
    //#3
    function() {
        page.open(G_GREE_LOGIN_URL);
    },
    //#4
    function() {

        page.injectJs("./" + appliId + "_conf.js");
        //Enter Credentials
        page.evaluate(function() {
            var login_id     = document.getElementById("user_mail");
            var login_pass   = document.getElementById("user_password_login");
            login_id.value   = G_EMAIL;
            login_pass.value = G_PASSWORD;
        });
    },
    //#5
    function() {
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
    },
    //#6
    function() {
        page.open( appliUrl );
    },
    //#7
    function() {
        page.render(appliId + G_IMAGE_SUFFIX);
    },
    //#8
    function() {
        page.injectJs("./" + appliId + "_conf.js");

        nextUrl = page.evaluate(function(){
            var arr = document.getElementById(G_IFRAME_ID);
            return arr.src;
        });
    },
    //#9
    function() {
        page.open( nextUrl );
    },
    //#10
    function() {
        page.render(appliId + "_" + imgNum++ + G_IMAGE_SUFFIX);
    },
    //#11
    function() {
        nextUrl = getMypageUrl(page);
    },
    //#12
    function() {
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
    },
];

var nextLoop = setInterval( function() {
    if (!loadInProgress && typeof nextStep[sequenceNum] == "function" ) {
        console.debuglog("sequence: " + (sequenceNum + 1) );
        nextStep[sequenceNum]();
        sequenceNum++;
    } else if (!loadInProgress && typeof nextStep[sequenceNum] == "string" ) {
        console.debuglog("sequence: " + (sequenceNum + 1) + " is string property." );
        sequenceNum++;
    } else if (!loadInProgress && typeof nextStep[sequenceNum] == "number" ) {
        console.debuglog("sequence: " + (sequenceNum + 1) + " is number property." );
        sequenceNum++;
    } else {
        //console.debuglog("sequence: " + (sequenceNum + 1) + " is " + typeof nextStep[sequenceNum] + "property." );
    }

}, 50 );
