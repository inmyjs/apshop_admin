import request from '@/utils/request'
// import JSEncrypt from 'jsencrypt'

export function loginByUsername(username, password) {
  // var public_key = `-----BEGIN PUBLIC KEY-----\nMIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgGCG1hRBi7GOWftJF5sHc4at+IVx\nZUf/mjB2pPS3JCgi3GJn9hbpGdwV08TlSAK0o55gHLfTKEShunEtqZ7i6zrIF714\nqntmSmXOFWHzmQqHaRGpown/5hsjQ4VsLTykYAxaImqNKBxyQ92tCPxRLmnTAunL\nK29Es5n4bayCITQzAgMBAAE=\n-----END PUBLIC KEY-----`;

  // var encrypt = new JSEncrypt();
  // encrypt.setPublicKey(public_key);
  var json = { username, password }
  // var str = JSON.stringify(json);
  // var encrpted = encrypt.encrypt(str);
  // const data = {
  //   content: encrpted
  // }
  return request({
    url: '/login',
    method: 'post',
    data:json
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

