// const
const CONSOLE_LOG_ON   = false;

console.debuglog = function(msg){
    if( CONSOLE_LOG_ON == true ) {
        console.log(msg);
    }
};

console.htmlDump = function(page) {
    if ( CONSOLE_LOG_ON == true ) {
        page.evaluate(function() {
          console.log(document.querySelectorAll('html')[0].outerHTML);
        });
    }
}

var args = require('system').args;

var appliId  = 'XXXXX';
if ( args.length !== 2 ) {
    console.log("You should enter application Id !");
    phantom.exit(1);
} else {
    console.debuglog(args[1]);
    appliId = args[1];
}

var appliUrl = 'http://sp.pf.mbga.jp/' + appliId;

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
    //#1-1
    gotoSequence = 0,
    //#2
    imgNum = 1,
    //#3
    responseMsec = 0,
    //#4
    function() {
        page.open(G_GREE_LOGIN_URL);
    },
    //#5
    function() {

        page.injectJs("./" + appliId + "_conf.js");
        //Enter Credentials
        page.evaluate(function() {
            var login_id     = document.getElementById("login_id");
            var login_pass   = document.getElementById("login_pw");
            login_id.value   = G_EMAIL;
            login_pass.value = G_PASSWORD;
        });
    },
    //#6
    function() {
        //Login
        page.evaluate(function() {
            var arr = document.getElementsByClassName("registBox");
            var i;

            for (i=0; i < arr.length; i++) {
                loginForm = arr[i].firstChild.nextSibling;
                loginForm.submit();
                return ;
            }
        });
    },
    //#7
    function() {
        page.render(appliId + G_IMAGE_SUFFIX);
    },
    //#8
    function() {
        page.open( appliUrl );
    },
    //#9
    function() {
        page.render(appliId + "_" + imgNum++ + G_IMAGE_SUFFIX);
    },
    //#10
    function() {
        nextUrl = getMypageUrl(page);
    },
    //#11
    function() {
        t = Date.now();
        page.open(nextUrl,function(status) {
            if( status != "success" ) {
            } else {
                responseMsec = Date.now() - t;
                console.log('Loading time ' + responseMsec + ' msec');
                page.render(appliId + "_" + imgNum++ + G_IMAGE_SUFFIX);
            }
        });
    },
    //#12
//    function() {
//        page.injectJs("./" + appliId + "_conf.js");
//
//        nextUrl  = G_GRAPH_POST_URL;
//        var data = 'number=' + responseMsec;
//        page.open(nextUrl, 'post', data, function(status) {
//            if( status != "success" ) {
//            } else {
//                console.debuglog("Growthforecast post success");
//            }
//        });
//    },
    //#13
    function() {
        //Raid Check
        var raidFlag = page.evaluate(function() {
            var raidFlag = false;
            var arr = document.getElementsByClassName("badge new");

            if ( arr != undefined && arr[0] != undefined ) {
                var newString = arr[0].firstChild.nodeValue;
                if ( (newString != undefined) && (newString == "NEW") ) {
                    raidFlag = true;
                }
            }
            return raidFlag;
        });
        console.debuglog(raidFlag);

        if ( raidFlag != true ) {
            phantom.exit();
        }
    },
    //#14
    function() {
        gotoSequence = sequenceNum - 1;
//        console.htmlDump(page);
//        nextUrl = "http://sp.pf.mbga.jp/12010455?url=http%3A%2F%2Fmguildbattle.croozsocial.jp%2Fbossguildbattle%2FRaidbossAssistList%2F";
        nextUrl = "http://sp.pf.mbga.jp/12010455?url=http%3A%2F%2Fmguildbattle.croozsocial.jp%2Fraidboss%2FRaidbossAssistList%2F";
//        nextUrl = "http://sp.pf.mbga.jp/12010455?url=http%3A%2F%2Fmguildbattle.croozsocial.jp%2Fisland%2FIslandRaidbossAssistList%2F"
        page.open(nextUrl);
    },
    //#15
    function() {
        page.render(appliId + "_" + imgNum++ + G_IMAGE_SUFFIX);
    },
    //#16
    function() {
        //New Check
        var newFlag = page.evaluate(function() {
            var newFlag = false;
            var arr = document.getElementsByClassName("margin_bottom_10");

            if ( arr != undefined ) {
                console.log(arr[0].firstChild);
                var newString = arr[0].firstChild.nodeValue;
                console.log(newString);
                if (newString == null) {
                    newFlag = true;
                }
            }
            return newFlag;
        });
        console.debuglog(newFlag);

        if ( newFlag != true ) {
            phantom.exit();
        }
    },
    //#17
    function() {
        //Next Link
        nextUrl = page.evaluate(function() {
            var arr = document.getElementsByClassName("btn_main_medium");
            var nextLink = "";

            if ( arr != undefined ) {
                nextLink = arr[0].firstChild.href;
            }
            return nextLink;
        });
    },
    //#18
    function() {
        page.open(nextUrl);
    },
    //#19
    function() {
        page.render(appliId + "_" + imgNum++ + G_IMAGE_SUFFIX);
    },
    //#20
    function() {
        //Raid Attack BP0
        page.evaluate(function() {
            var attackForm = document.forms[0];

            if ( attackForm != undefined ) {
                attackForm.submit();
            }
        });
//        console.htmlDump(page);
//
//        nextUrl = page.evaluate(function() {
//            var arr = document.getElementById("assist_btn");
//            var nextLink = "";
//
//            if ( arr != undefined ) {
//                nextLink = arr.firstChild.firstChild.href;
//            }
//            return nextLink;
//        });


    },
    //#20
    function() {
//        console.debuglog(nextUrl);
//        page.open(nextUrl);
        sequenceNum = gotoSequence;
    },
    //#21
    function() {
//        page.render(appliId + "_" + imgNum++ + G_IMAGE_SUFFIX);
        phantom.exit();
    }
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
