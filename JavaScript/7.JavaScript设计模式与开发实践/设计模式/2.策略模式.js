// ===================== 1. 最初的代码实现 ===================
// 缺点：calculateBonus函数比较庞大，缺乏弹性，算法复用性差
var calculateBonus = function(performanceLevel, salary) {
    if (performanceLevel === 'S') {
        return salary * 4;
    }

    if (performanceLevel === 'A') {
        return salary * 3;
    }

    if (performanceLevel === 'B') {
        return salary * 2;
    }
};

calculateBonus('B', 20000);
calculateBonus('S', 6000);


// ===================== 2. 使用组合函数重构代码 ===================
// 缺点：calculateBonus函数可能越来越庞大，且在系统变化的时候缺乏弹性
var performanceS = function(salary) {
    return salary * 4;
};

var performanceA = function(salary) {
    return salary * 3;
};

var performanceB = function(salary) {
    return salary * 2;
};

var calculateBonus = function(performanceLevel, salary) {
    if (performanceLevel === 'S') {
        return performanceS(salary);
    }

    if (performanceLevel === 'A') {
        return performanceA(salary);
    }

    if (performanceLevel === 'B') {
        return performanceB(salary);
    }
};

calculateBonus('A', 10000);

// ===================== 3. 使用策略模式重构代码 ===================
// （1）模仿传统面向对象语言中的实现
var performanceS = function() {};
performanceS.prototype.calculate = function(salary) {
    return salary * 4;
};

var performanceA = function() {};
performanceA.prototype.calculate = function(salary) {
    return salary * 3;
};

var performanceB = function() {};
performanceB.prototype.calculate = function(salary) {
    return salary * 2;
};

var Bonus = function() {
    this.salary = null;
    this.strategy = null;
};

Bonus.prototype.setSalary = function(salary) {
    this.salary = salary;
};

Bonus.prototype.setStrategy = function(strategy) {
    this.strategy = strategy;
};

Bonus.prototype.getBonus = function() {
    return this.strategy.calculate(this.salary);
};

var bonus = new Bonus();

bonus.setSalary(10000);
bonus.setStrategy(new performanceS()); // 设置策略对象

console.log(bonus.getBonus()); // 输出： 40000

bonus.setStrategy(new performanceA()); // 设置策略对象
console.log(bonus.getBonus()); // 输出： 30000

// （2）JavaScript版本的策略模式
var strategies = {
    "S": function(salary) {
        return salary * 4;
    },
    "A": function(salary) {
        return salary * 3;
    };
    "B": function(salary) {
        return salary * 2;
    }
};

var calculateBonus = function(level, salary) {
    return strategies[level](salary);
};

console.log(calculateBonus('S', 20000)); // 输出： 80000
console.log(calculateBonus('A', 10000)); // 输出： 30000



// ===================== 4. 表单校验 ===================
// (1) 表单校验的第一个版本
var registerForm = document.getElementById('registerForm');

registerForm.onsubmit = function() {
    if (registerForm.userName.value === '') {
        alert('用户名不能为空');
        return false;
    }

    if (registerForm.password.value.length < 6) {
        alert('密码长度不能少于6位');
        return false;
    }

    if (!/(^1[3|5|8][0-9]{9}$)/.test(registerForm.phoneNumber.value)) {
        alert('手机号码格式不正确');
        return false;
    }
};

// (2) 用策略模式重构表单校验
/**************** 首先：把校验逻辑都封装成策略对象 *****************/
var strategies = {
    isNonEmpty: function(value, errorMsg) {
        if (value === '') {
            return errorMsg;
        }
    },
    minLength: function(value, length, errorMsg) {
        if (value.length < length) {
            return errorMsg;
        }
    },
    isMobile: function(value, errorMsg) {
        if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
            return errorMsg;
        }
    }
};

/**************** 其次：实现Validator类 *****************/
var validateFunc = function() {
    var validator = new Validator(); // 创建一个 validator 对象

    /***********添加一些校验规则***************/
    validator.add(registerForm.userName, 'isNonEmpty', '用户名不能为空');
    validator.add(registerForm.password, 'minLength:6', '密码长度不能少于 6 位');
    validator.add(registerForm.phoneNumber, 'isMobile', '手机号码格式不正确');

    var errorMsg = validator.start(); // 获得校验结果
    return errorMsg; // 返回校验结果
}

var registerForm = document.getElementById('registerForm');
registerForm.onsubmit = function() {
    var errorMsg = validateFunc(); // 如果errorMsg有确切的返回值，说明未通过校验
    if (errorMsg) {
        alert(errorMsg);
        return false; // 阻止表单提交
    }
};

/**************** 最后：Validator类的实现 *****************/
var Validator = function() {
    this.cache = []; // 保存校验规则
};

Validator.prototype.add = function(dom, rule, errorMsg) {
    var ary = rule.split(':'); // 把 strategy 和参数分开
    this.cache.push(function() { // 把校验的步骤用空函数包装起来，并且放入 cache
        var strategy = ary.shift(); // 用户挑选的 strategy
        ary.unshift(dom.value); // 把 input 的 value 添加进参数列表
        ary.push(errorMsg); // 把 errorMsg 添加进参数列表
        return strategies[strategy].apply(dom, ary);
    });
};

Validator.prototype.start = function() {
    for (var i = 0, validateFunc; validateFunc = this.cache[i++]) {
        var msg = validateFunc(); // 开始校验，并取得校验后的返回信息
        if (msg) {
            return msg; // 如果有确切的返回值，说明校验没有通过
        }
    }
};

// (3) 给某个文本输入框添加多种校验规则
/*********************** 策略对象 **************************/
var strategies = {
    isNonEmpty: function(value, errorMsg) {
        if (value === '') {
            return errorMsg;
        }
    },
    minLength: function(value, length, errorMsg) {
        if (value.length < length) {
            return errorMsg;
        }
    },
    isMobile: function(value, errorMsg) {
        if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
            return errorMsg;
        }
    }
};

/*********************** Validator 类 **************************/
var Validator = function() {
    this.cache = [];
};

Validator.prototype.add = function(dom, rules) {
    var self = this;
    for (var i = 0, rule; rule = rules[i++];) {
        (function(rule) {
            var strategyAry = rule.strategy.split(':');
            var errorMsg = rule.errorMsg;

            self.cache.push(function() {
                var strategy = strategyAry.shift();
                strategyAry.unshift(dom.value);
                strategyAry.push(errorMsg);
                return strategies[strategy].apply(dom, strategyAry);
            });
        })(rule)
    }
};

Validator.prototype.start = function() {
    for (var i = 0, validatorFunc; validatorFunc = this.cache[i++];) {
        var errorMsg = validatorFunc();
        if (errorMsg) {
            return errorMsg;
        }
    }
};

/*********************** 客户调用代码 **************************/
var registerForm = document.getElementById('registerForm');
var validataFunc = function() {
    var validator = new Validator();
    validator.add(registerForm.userName, [{
        strategy: 'isNonEmpty',
        errorMsg: '用户名不能为空'
    }, {
        strategy: 'minLength:6',
        errorMsg: '用户名长度不能小于 10 位'
    }]);
    validator.add(registerForm.password, [{
        strategy: 'minLength:6',
        errorMsg: '密码长度不能小于 6 位'
    }]);
    validator.add(registerForm.phoneNumber, [{
        strategy: 'isMobile',
        errorMsg: '手机号码格式不正确'
    }]);
    var errorMsg = validator.start();
    return errorMsg;
}
registerForm.onsubmit = function() {
    var errorMsg = validataFunc();
    if (errorMsg) {
        alert(errorMsg);
        return false;
    }
};
