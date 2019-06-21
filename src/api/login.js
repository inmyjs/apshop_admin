import request from '@/utils/request'
 import JSEncrypt from 'node-jsencrypt'

export function loginByUsername(username, password) {
  var public_key = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDTFhDjnucX4y8ycC47Bo2uL5hY
fokXUA+xQZGKLM/sy4Ys5DFHJcOJOLwYyR7Cj8Wi2wj052K1BVg/ZQvaY08jH0Td
NEXwEJ4QyXt57qrzbMdk7WgDbLJGmRNFznTnsF3ur8KT/LjKalQMF/WeeefyNvjw
14IDIyR1AEs/sAKHgwIDAQAB
-----END PUBLIC KEY-----`;

  var encrypt = new JSEncrypt();
  encrypt.setPublicKey(public_key);
  var json = { username, password }
  var str = JSON.stringify(json);
  var encrpted = encrypt.encrypt(str);
  const data = {
    content: encrpted
  }
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function logout(token) {
  return request({
    url: '/logout',
    method: 'post',
    data: { token }
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

