// 引用http模块
var http = require('http');

// createServer方法返回被创建的HTTP服务器对象
http.createServer(function(req, res) {

    // 书写响应头，表示返回一段HTML码
    res.writeHead(200, {'Content-Type': 'text/html'});

    // 书写<head>标签，定义字符集为UTF-8字符集
    res.write('<head><meta charset="utf-8"/></head>');

    // 输出并结束响应流
    res.end('你好\n');

// 使用listen方法指定该服务器使用端口及服务器绑定地址，并对该端口进行监听
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');