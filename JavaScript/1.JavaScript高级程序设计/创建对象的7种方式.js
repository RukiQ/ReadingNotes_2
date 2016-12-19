// 创建一个 Object() 的实例，为其添加属性和方法
var person = new Object();
person.name = "Nicholas";
person.age = 29;
person.job = "Software Engineer";

person.sayName = function() {
	alert(this.name);
};



// 对象字面量
var person = {
	name: "Nicholas",
	age: 29,
	job: "Software Engineer",

	sayName: function() {
		alert(this.name);
	}
};




/*--------------------------------------------------------------*/

var book = {
	_year: 2004,
	edition: 1
};

// 定义单个属性
Object.defineProperty(book, "year", {
	get: function() {
		return this._year;
	},
	set: function(newValue) {
		if (newValue > 2004) {
			this._year = newValue;
			this.edition += newValue - 2004;
		}
	}
})


var book = {};
// 定义多个属性
Object.defineProperties(book, {
	_year: {
		value: 2004
	},

	edition: {
		value: 1
	},

	year: {
		get: function() {
			return this._year;
		},
		set: function(newValue) {
			if (newValue > 2004) {
				this._year = newValue;
				this.edition += newValue - 2004;
			}
		}
	}
})

// 读取属性的特性
var descriptor = Object.getOwnPropertyDescriptor(book, "_year");
alert(descriptor.value);	// 2004
alert(descriptor.configurable);	// false



/*--------------------------------------------------------------*/

// 工厂模式
function createPerson(name, age, job) {
	var o = new Object();
	o.name = name;
	o.age = age;
	o.job = job;
	o.sayName = function() {
		alert(this.name);
	}
	return o;
}

var person1 = createPerson("Nicholas", 29, "Software Engineer");




/*--------------------------------------------------------------*/

// 构造函数模式
function Person(name, age, job) {
	this.name = name;
	this.age = age;
	this.job = job;
	this.sayName = function() {
		alert(this.name);
	}
}

// 当作构造函数使用，使用 new 操作符，this 指向新创建的实例对象
var person1 = new Person("Nicholas", 29, "Software Engineer");
var person2 = new Person("Greg", 27, "Doctor");
person1.sayName();	// "Nicholas"
person2.sayName();	// "Greg"

// 作为普通函数使用，this 指向全局 window 对象
Person("Greg", 27, "Doctor");
wondow.sayName();	// "Greg"

// 在另一个对象的作用域中调用，this 指向 o
var o = new Object();
Person.call(o, "Kristen", 25, "Nurse");
o.sayName();


/* 
 * 以这种方式创建函数，会导致不同的作用域链和标识符解析，但创建Function新实例的机制仍然是相同的
 * 因此，不同实例上的同名函数是不想等的
 */
function Person(name, age, job) {
	this.name = name;
	this.age = age;
	this.job = job;
	this.sayName = new Function("alert(this.name)");
}

var person1 = new Person("Nicholas", 29, "Software Engineer");
var person2 = new Person("Greg", 27, "Doctor");		

alert(person1.sayName == person2.sayName);	// false，如果person1的name和person2的name相同，则为 true

/* 
 * 创建两个完成同样任务的 Function 的实例的确没有必要，而且有 `this`对象在，
 * 根本不用在执行代码前就把函数绑定到特定对象上面。可以把函数定义转移到构造函数外部来解决这个问题
*/
function Person(name, age, job) {
	this.name = name;
	this.age = age;
	this.job = job;
	this.sayName = sayName;	// sayName 包含的是一个指向函数的指针
							// 因此,person1 和 person2 对象就共享了在全局作用域中定义的同一个 sayName() 函数
}

function sayName() {
	alert(this,name);
}



/*--------------------------------------------------------------*/

// 原型模式--示例1
function Person() {
}

Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function() {
	alert(this.name);
}

// 使用
var person1 = new Person();
person1.sayName(); // "Nicholas"

var person2 = new Person();
person2.sayName(); 	// "Nicholas"

alert(person1.sayName == person2.sayName); // true

// Person 的原型对象的 constructor 属性指向 Person
alert(Person.ptototype.constructor == Person);	//true

// 原型最初指包含 constructor 属性，而该属性也是共享的，因此可以通过对象实例访问
alert(preson1.constructor == Person);	// true

// isPrototypeOf() 方法：确定实例与原型对象之间的关系（实例中存在隐藏的[[__proto__]]属性，指向原型对象）
alert(Person.prototype.isPrototypeOf(person1));	// true;

// Object.getPrototypeOf() 方法：获取实例的原型对象
alert(Object.getPrototyepOf(person1) == Person.prototype);	// true
alert(Object.getPrototypeOf(person1).name);	// "Nicholas"

/* 
 * 当为对象实例添加一个属性时，这个属性就会屏蔽原型对象中保存的同名属性	
 * hasOwnProperty() 方法：判断对象属性是存在于实例还是原型中
 * in 操作符：在通过对象能够访问给定属性时返回 true，无论该属性存在于实例中还是原型中
 */
person1.name = "Greg";
alert(person1.name);	// "Greg"——来自实例
alert(person1.hasOwnProperty("name"));	// true
alert("name" in person1);	// true

alert(person2.name);	// "Nicholas"——来自原型
alert(person2.hasOwnProperty("name"));	// false	
alert("name" in person2);	// true

/*
 * hasOwnProperty() 方法与 in 操作符结合，可以确定该属性是原型中的属性
 * 自定义 hasOwnPrototypeProperty() 方法：
 */
 function hasOwnPrototypeProperty(object, name) {
 	return !object.hasOwnProperty(name) && (name in object);
 }

alert(hasOwnPrototypeProperty(person1, "name"));	// false;
alert(hasOwnPrototypeProperty(person2, "name"));	// true


// Object.getOwnPropertyDescriptor() 方法：取得对象属性的描述符
alert(Object.getOwnPropertyDescriptor(person1, "name"));	// 取得实例属性描述符
alert(Object.getOwnPropertyDescriptor(Person.prototype, "name"));	// 取得原型属性描述符

/* 
 * 添加实例属性只会阻止我们访问原型中的那个属性，但不会修改那个属性
 * 即使将实例属性设置为 null，也只会在实例中设置这个属性，而不会恢复其指向原型的连接
 */
person1.name = null;
alert(person1.name);	// null

// 使用 delete 操作符可以完全删除实例属性，从而让我们能够重新访问原型中的属性
delete person1.name;
alert(person1.name);	// "Nicholas"——来自原型




// for-in 循环
var o = {
	toString: function() {
		return "My Object";
	}
};

for (var prop in o) {
	if (prop == "toString") {
		alert("Found toString");	// IE 中不会显示
	}
}




// 原型模式--示例2
function Person() {
}

Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function() {
	alert(this.name);
}

/*
 * Object.keys() 方法：取得对象上所有可枚举的实例属性
 * 该方法将返回一个字符串数组，数组中字符串出现的顺序也是它们在 for-in 循环中出现的顺序
 */
var keys = Object.keys(Person.prototype);
console.log(keys);	// ["name", "age", "job", "sayName"]

var p1 = new Person();
p1.name = "Rob";
p1.age = 31;
var p1keys = Object.keys(p1);
console.log(p1keys);	// ["name", "age"]

// Object.getOwnPropertyNames() 方法：得到所有实例属性，无论它是否可枚举
var keys = Object.getOwnPropertyNames(Person.prototype);
console.log(keys);	// ["constructor", "name", "age", "job", "sayName"]


// 更简单的原型语法
function Person() {
}

/* 
 * 每创建一个函数，就会同时创建它的 prototype 对象，这个对象也会自动获得 constructor 属性
 * 这种写法，本质上完全重写了默认的 prototype 对象
 * constructor 属性也就变成了新对象的 constructor 属性（指向 Object 构造函数）
 * 
 */
Person.prototype = {
	name : "Nicholas",
	age : 29,
	job : "Software Engineer",
	sayName : function() {
		alert(this.name);
	}
}

var friend = new Person();
alert(friend instanceof Object);	// true
alert(friend instanceof Person);	// true
alert(friend.constructor == Person);	// false
alert(friend.constructor == Object);	// true

// 解决方法：明确设置 constructor 属性为 Person
Person.prototype = {
	constructor : Person,	// 设置 constructor
	name : "Nicholas",
	age : 29,
	job : "Software Engineer",
	sayName : function() {
		alert(this.name);
	}
}

var friend = new Person();	// 先创建实例

Person.prototype.sayHi = function() {	// 于实例创建后添加
	alert("hi");
}

friend.sayHi();	// "hi"，可以访问原型中的方法



function Person() {	
}

var friend = new Person();

Person.prototype = {
	constructor : Person,	// 设置 constructor
	name : "Nicholas",
	age : 29,
	job : "Software Engineer",
	sayName : function() {
		alert(this.name);
	}
}

friend.sayName(); // error



function Person() {	
}

Person.prototype = {
	constructor : Person,
	name : "Nicholas",
	age : 29,
	job : "Software Engineer",
	friends : ["Shelby", "Court"],
	sayName : function() {
		alert(this.name);
	}
};

var person1 = new Person();
var person2 = new Person();

person1.friends.push("Van");

alert(person1.friends);	//["Shelby", "Court", "Van"]
alert(person2.friends);	//["Shelby", "Court", "Van"]
alert(person1.friends === person2.friends);	// true



/*--------------------------------------------------------------*/

// 组合使用构造函数模式和原型模式
function Person(name, age, job) {
	this.name = name;
	this.age = age;
	this.job = job;
	this.friends = ["Shelby", "Court"];
}

Person.prototype = {
	constructor : Person,
	sayName : function() {
		alert(this.name);
	}
}

var person1 = new Person("Nicholas", 29, "Software Engineer");
var person2 = new Person("Greg", 27, "Doctor");

person1.friends.push("Van");
alert(person1.friends);	// ["Shelby", "Court", "Van"]
alert(person2.friends); // ["Shelby", "Court"]
alert(person1.friends === person2.friends);	// false
alert(person1.sayName === person2.sayName);	// true



/*--------------------------------------------------------------*/

// 动态原型模式
// 可以通过检查某个应该存在的方法是否有效，来决定是否需要初始化原型
function Person(name, age, job) {

	// 属性
	this.name = name;
	this.age = age;
	this.job = job;

	// 方法
	/* 只有在 sayName() 方法不存在的情况下，才会将它添加到原型中
	 * 这段代码只会在初次调用构造函数时才会执行。此后，原型已经完成初始化，不需要再做什么修改了
	 * 这里对原型所做的修改，能够立即在所有实例中得到反映
	 */
	if (typeof this.sayName != "function") {
		Person.prototype.sayName = function() {
			alert(this.name);
		}
	}
}

var friend = new Person("Nicholas", 29, "Software Engineer");
alert(friend.prototype);	// undefined
alert(friend);	// Person {name: "Nicholas", age: 29, job: "Software Engineer"}

friend.sayName();	// "Nicholas"

// 重写原型方法
Person.prototype.sayName = function() { console.log("Greg"); }

friend.sayName();	// "Greg"




/*--------------------------------------------------------------*/

// 寄生构造函数模式
function Person(name, age, job) {

	var o = new Object();	// 创建一个新对象
	o.name = name;
	o.age = age;
	o.job = job;

	o.sayName = function() {
		alert(this.name);
	}

	return o;	// 返回该对象
}

var friend = new Person("Nicholas", 29, "Software Engineer");	// 作为构造函数调用
friend.sayName();	// "Nicholas"

/* 
 * 在特殊情况下为对象创建构造函数
 * 假设想创建一个具有额外方法的特殊数组
 * 由于不能直接修改 Array 构造函数，可以使用这个模式
 */
function SpecialArray() {

	// 创建数组
	var values = new Array();

	// 添加值
	values.push.apply(values, arguments);

	// 添加方法
	values.toPipedString = function() {
		return this.join("|");
	}

	// 返回数组
	return values;
}

var colors = new SpecialArray("red", "blue", "green");
console.log(colors); 	// [red", "blue", "green"]
console.log(colors.toPipedString());	// "red|blue|green"




/*--------------------------------------------------------------*/

// 稳妥构造函数模式
function Person(name, age, job) {

	// 创建要返回的对象
	var o = new Object();

	// 可以在这里定义私有变量和函数

	// 添加方法
	// 只有该方法可以访问 name 属性（数据成员）
	o.sayName = function() {
		alert(name);	// 没有引用 this
	}

	// 返回对象
	return o;
}

var friend = Person("Nicholas", 29, "Software Engineer");
friend.sayName();	// "Nicholas"