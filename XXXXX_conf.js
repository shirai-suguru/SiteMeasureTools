const G_EMAIL    = "username"
const G_PASSWORD = "password";
const G_GREE_LOGIN_URL = 'http://XXXXXX';
const G_USERAGENT      = 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A403 Safari/8536.25';
const G_IMAGE_SUFFIX   = '.png';
const G_APP_ID         = 'XXXXX';
const G_IFRAME_ID      = 'app_' + G_APP_ID;
const G_MYPAGE_CLASSNAME   = 'mC aC mt5 mb10';
const G_SEARCH_APPLI_TITLE = 'appliname';
const G_GRAPH_POST_URL = 'http://localhost:5125/api/socialgame_response/gree_' + G_APP_ID + '/mypage_response';


function getMypageUrl( page ) {
    page.injectJs("./" + G_APP_ID + "_conf.js");

    return page.evaluate(function(){
        var arr = document.getElementsByClassName(G_MYPAGE_CLASSNAME)[0].childNodes;
        var i;
        return arr[1].getAttribute("href");
    });
}
