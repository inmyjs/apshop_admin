import request from '@/utils/request'
 import JSEncrypt from 'node-jsencrypt'

export function loginByUsername(username, password) {
  var public_key = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCet7+sqe0OkG0XkvohwcLDD28O
RkV3J3TchI3j8abtMkl9LWixGIdhjMHcOybfcmSEW78ZzPMKGC8NX4fZ6GYerga2
sxVU6zNjU1U0Rc8DM9NOC8GWNrPbphEx65jRIeie0xaiJxcKV4FmJcgKDu19yXMo
VovAFKXIvK71jcIWAwIDAQAB
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

