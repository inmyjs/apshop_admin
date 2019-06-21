import request from '@/utils/request'

export function upload(fileName,blob) {
  let formData = new FormData(); //这里连带form里的其他参数也一起提交了,如果不需要提交其他参数可以直接FormData无参数的构造函数
  formData.append('file', blob,fileName)
  return request({
    url: '/upload/image',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'  //之前说的以表单传数据的格式来传递fromdata
    },
    data:formData
  })
}
