/**
 * Created with JetBrains PhpStorm.
 * User: sugu
 * Date: 13/06/15
 * Time: 18:08
 * To change this template use File | Settings | File Templates.
 */

const APPLI_URL      = 'http://pf.gree.net/58124';
const FRAME_NAME     = 'app_58124';
const GRAPH_POST_URL = 'http://localhost:5125/api/socialgame_response/gree_58124/mypage_response';

function clickMypageLink(that) {
    that.click('div#pageInner div a');
}