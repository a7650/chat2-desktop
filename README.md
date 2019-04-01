# chat2的windows版本

## 怎样使用

---

使用前需要有 vue-cli3 , node , npm/cnpm/yarn , python , visual studio 环境

npm install  //安装项目依赖（必须）

npm install --save-dev electron-packager //安装packager包（必须）

npm install asar //安装asar （必须）

---

npm run serve //测试用 启用网页版（9000端口）（默认会连接我的服务器,若要在本机运行需要将./src/main.js下的development改为true,之后需要运行./node的main.js和本机开启mongodb服务）

npm run exe //测试用，打包（./dist）并启用electron开启windows客户端，但不会生成.exe文件

npm run start //测试用 ，启用electron开启windows客户端 （前提是已经打包./dist，如果只更改./main.js的内容可以用此命令）

npm run asar //将./dist在./pack下生成asar包（前提是已生成./dist文件）

npm run packager //将./pack打包生成windows客户端文件，打包后的目录为./packagefile （前提是已经在./pack下生成asar文件）

npm run asar--packager //是前两步的集成，将./dist生成asar包并在./packagefile下生成客户端文件

##其他
[点击这里(网页版)](http://106.12.198.147/chatn)使用应用




