// ===================== 1. 虚拟代理实现图片预加载 ===================
var myImage = (function() {
    var imgNode = document.createElement('img');
    document.body.appendChild(imgNode);

    return {
        setSrc: function(src) {
            imgNode.src = src;
        }
    }
})();

var proxyImage = (function() {
    var img = new Image;
    img.onload = function() {
        myImage.setSrc(this.src);
    };

    return {
        setSrc: function(src) {
            myImage.setSrc('file:// /C:/Users/svenzeng/Desktop/loading.gif');
            img.src = src;
        }
    }
})();

proxyImage.setSrc('http:// imgcache.qq.com/music/photo/k/000GGDys0yA0Nk.jpg');


// ===================== 2. 代理和本体接口的一致性 ===================
var myImage = (function() {
    var imgNode = document.createElement('img');
    document.body.appendChild(imgNode);
    return function(src) {
        imgNode.src = src;
    }
})();

var proxyImage = (function() {
    var img = new Image;
    img.onload = function() {
        myImage(this.src);
    }
    return function(src) {
        myImage('file:// /C:/Users/svenzeng/Desktop/loading.gif');
        img.src = src;
    }
})();
proxyImage('http:// imgcache.qq.com/music// N/k/000GGDys0yA0Nk.jpg');


// ===================== 3. 虚拟代理合并 HTTP 请求 ===================
var synchronousFile = function(id) {
    console.log('开始同步文件， id 为: ' + id);
};
var proxySynchronousFile = (function() {
    var cache = [], // 保存一段时间内需要同步的 ID
        timer; // 定时器
    return function(id) {
        cache.push(id);
        if (timer) { // 保证不会覆盖已经启动的定时器
            return;
        }
        timer = setTimeout(function() {
            synchronousFile(cache.join(',')); // 2 秒后向本体发送需要同步的 ID 集合
            clearTimeout(timer); // 清空定时器
            timer = null;
            cache.length = 0; // 清空 ID 集合
        }, 2000);
    }
})();
var checkbox = document.getElementsByTagName('input');
for (var i = 0, c; c = checkbox[i++];) {
    c.onclick = function() {
        if (this.checked === true) {
            proxySynchronousFile(this.id);
        }
    }
};


// ===================== 4. 虚拟代理在惰性加载中的应用 ===================
var miniConsole = (function() {
    var cache = [];
    var handler = function(ev) {
        if (ev.keyCode === 113) {
            var script = document.createElement('script');
            script.onload = function() {
                for (var i = 0, fn; fn = cache[i++];) {
                    fn();
                }
            };
            script.src = 'miniConsole.js';
            document.getElementsByTagName('head')[0].appendChild(script);
            document.body.removeEventListener('keydown', handler); // 只加载一次 miniConsole.js
        }
    };
    document.body.addEventListener('keydown', handler, false);
    return {
        log: function() {
            var args = arguments;
            cache.push(function() {
                return miniConsole.log.apply(miniConsole, args);
            });
        }
    }
})();
miniConsole.log(11); // 开始打印 log

// miniConsole.js 代码
miniConsole = {
    log: function() {
        // 真正代码略
        console.log(Array.prototype.join.call(arguments));
    }
};


// ===================== 5. 缓存代理 ===================
// （1）缓存代理的例子——计算乘积
/**************** 先创建一个用于求乘积的函数 *****************/
var mult = function() {
    console.log('开始计算乘积');
    var a = 1;
    for (var i = 0, l = arguments.length; i < l; i++) {
        a = a * arguments[i];
    }
    return a;
};
mult(2, 3); // 输出： 6
mult(2, 3, 4); // 输出： 24

/**************** 加入缓存代理函数 *****************/
var proxyMult = (function() {
    var cache = {};
    return function() {
        var args = Array.prototype.join.call(arguments, ',');
        if (args in cache) {
            return cache[args];
        }
        return cache[args] = mult.apply(this, arguments);
    }
})();
proxyMult(1, 2, 3, 4); // 输出： 24
proxyMult(1, 2, 3, 4); // 输出： 24

// （2）缓存代理用于ajax异步请求数据
// 分页，自行实现


// ===================== 6. 用高阶函数动态创建代理 ===================
/**************** 计算乘积 *****************/
var mult = function() {
    var a = 1;
    for (var i = 0, l = arguments.length; i < l; i++) {
        a = a * arguments[i];
    }
    return a;
};
/**************** 计算加和 *****************/
var plus = function() {
    var a = 0;
    for (var i = 0, l = arguments.length; i < l; i++) {
        a = a + arguments[i];
    }
    return a;
};
/**************** 创建缓存代理的工厂 *****************/
var createProxyFactory = function(fn) {
    var cache = {};
    return function() {
        var args = Array.prototype.join.call(arguments, ',');
        if (args in cache) {
            return cache[args];
        }
        return cache[args] = fn.apply(this, arguments);
    }
};
var proxyMult = createProxyFactory(mult),
    proxyPlus = createProxyFactory(plus);
alert(proxyMult(1, 2, 3, 4)); // 输出： 24
alert(proxyMult(1, 2, 3, 4)); // 输出： 24
alert(proxyPlus(1, 2, 3, 4)); // 输出： 10
alert(proxyPlus(1, 2, 3, 4)); // 输出： 10
