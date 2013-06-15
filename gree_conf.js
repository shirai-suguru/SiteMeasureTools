/**
 * Created with JetBrains PhpStorm.
 * User: sugu
 * Date: 13/06/15
 * Time: 17:17
 * To change this template use File | Settings | File Templates.
 */

const LOGIN_URL = 'http://t.gree.jp/?action=login&ignore_sso=1&backto=';
const LOGIN_NAME     = 'xxxxxxx';
const LOGIN_PASSWORD = 'xxxxxxx';

var isUseFrame  = true;

function fillLoginForm(that) {
    that.fill('form[method="post"]',{
        'user_mail':     LOGIN_NAME,
        'user_password': LOGIN_PASSWORD
    }, true);
}
