import CryptoJS from 'crypto-js';
function decryptData(data) { //加密
    var key = '2JeysPot';  //密钥
    var iv = '12345678';
    var encrypted = getAesString(data, key, iv); //密文
    return encrypted;
}
function getAesString(data, key, iv) { // 加密
    key = CryptoJS.enc.Utf8.parse(key);
    // alert(key）;
    iv = CryptoJS.enc.Utf8.parse(iv);
    let encrypted = CryptoJS.DES.encrypt(data, key,
        {
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
    return encrypted.toString();    // 返回的是base64格式的密文
}

export default decryptData;