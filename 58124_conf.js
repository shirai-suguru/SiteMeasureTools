const G_EMAIL    = "suguster.goodoo@ezweb.ne.jp";
const G_PASSWORD = "sig6fig";
const G_GREE_LOGIN_URL = 'http://t.gree.jp/?action=login&ignore_sso=1&backto=';
const G_USERAGENT      = 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A403 Safari/8536.25';
const G_IMAGE_SUFFIX   = '.png';
const G_IFRAME_ID      = 'app_58124';
const G_MYPAGE_CLASSNAME   = 'mC aC mt5 mb10';
const G_SEARCH_APPLI_TITLE = 'あんさんぶるガールズ';


function getMypageUrl( page ) {
    page.injectJs("./58124_conf.js");

    return page.evaluate(function(){
        var arr = document.getElementsByClassName(G_MYPAGE_CLASSNAME)[0].childNodes;
        return arr[1].getAttribute("href");
    });
}
