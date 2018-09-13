# apshop_admin
apshop商城管理端

安装依赖：
`npm install`

本地调试：
`npm run dev '

### 正式环境打包
`npm run build:prod`

请注意！本项目采用管理后台与商城前端同服务器部署，所以打包的文件夹、ajax地址等已更改，若需独立部署，按vue-element-admin官方参数形式即可。

打包完成后，将dist/admin目录，放入apshop/app/pulic/目录下（拷贝前先删除原admin目录），将dist/index.html文件,放入apshop/app/view/admin/目录，覆盖即可。

详细请查阅vue-element-admin官方文档。
