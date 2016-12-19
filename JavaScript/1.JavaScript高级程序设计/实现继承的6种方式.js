
// 原型链继承--基本模式
function SuperType() {
	this.property = true;
}

SuperType.prototype.getSuperValue = function() {
	return this.property;
};

function SubType() {
	this.subproperty = false;
}

/*
 * 继承实现方式：通过创建 SuperType 的实例，并将该实例赋给 SubType.prototype
 * 实现本质：重写原型对象，代之以一个新类型的实例
 */
SubType.prototype = new SuperType();

// 添加新方法
SubType.prototype.getSubValue = function() {
	return this.subproperty;
}

// 创建实例并操作
var instance = new SubType();

alert(instance.getSuperValue());	// true

// instance.constructor 现在指向的是 SuperType
alert(instance.constructor);	// SuperType

/*
 * 所有函数的默认原型都是 Object 的实例，因此默认原型都会包含一个内部指针，指向 Object.prototype
 */
// SuperType 继承了 Object，能够调用保存在 Object.prototype 中的那个方法
alert(intance.toString());	"[object Object]"

/*
 * 确定原型和实例的关系
 */
// 方法1：使用 instanceof 操作符
alert(instance instanceof Object);	// true
alert(instance instanceof SuperType);	// true
alert(instance instanceof SubType);	// true

// 方法2：使用 isPrototypeOf() 方法
alert(Object.prototype.isPrototypeOf(instance));	// true
alert(SuperType.prototype.isPrototypeOf(instance));	// true
alert(SubType.prototype.isPrototypeOf(instance));	// true






/*
 * 谨慎地定义方法：给原型添加方法的代码一定要放在替换原型的语句之后
 */
function SuperType() {
	this.property = true;
}

SuperType.prototype.getSuperValue = function() {
	return this.property;
};

function SubType() {
	this.subproperty = false;
}

// 继承了 SuperType
SubType.prototype = new SuperType();

// 添加新方法
SubType.prototype.getSubValue = function() {
	return this.subproperty;
}

// 重写超类型中的方法，会屏蔽原来的那个方法
SubType.prototype.getSuperValue = function() {
	return false;
}

var instance = new SubType();
alert(instance.getSuperValue());	// false


/*
 * 不能使用对象字面量创建原型方法，因为这样会重写原型链
 */
function SuperType() {
	this.property = true;
}

SuperType.prototype.getSuperValue = function() {
	return this.property;
};

function SubType() {
	this.subproperty = false;
}

// 继承了 SuperType
SubType.prototype = new SuperType();

/*
 * 使用字面量添加新方法，会导致上一行代码无效
 * 现在 SubType.prototype 是一个 Object 的实例
 */
SubType.prototype = {
	getSubValue : function() {
		return this.subproperty;
	},

	someOtherMethod : function() {
		return false;
	}
}

var instance = new SubType;
console.log(SubType.prototype);	// Object {}
alert(instance.getSuperValue());	// error!



/*
 * 原型链的问题
 */
function SuperType() {
	this.colors = ["red", "blue", "green"];
}

function SubType() {
}

// 继承了 SuperType
SubType.prototype = new SuperType();

var instance1 = new SubType();
instance1.colors.push("black");
console.log(instance1.colors);	// ["red", "blue", "green", "black"]

var instance2 = new SubType();
console.log(instance2.colors);	// ["red", "blue", "green", "black"]



/*-----------------------------------------------------------------------*/

// 借用构造函数实现继承
function SuperType() {
	this.colors = ["red", "blue", "green"];
}

function SubType() {
	// 继承了 SuperType
	SuperType.call(this);	// 在新创建的对象上执行构造函数
}

var instance1 = new SubType();

instance1.colors.push("black");
console.log(instance1.colors);	// ["red", "blue", "green", "black"]

var instance2 = new SubType();
console.log(instance2.colors);	// [red", "blue", "green"]


// 传递参数
function SuperType(name) {
	this.name = name;
}

function SubType() {
	// 继承了 SuperType，同时还传递了参数
	SuperType.call(this, "Nicholas");

	// 实例属性
	this.age = 29;
}

var instance = new SubType();

alert(instance.name);	// "Nicholas"
alert(instance.age);	// 29
// 实例的 constructor 属性指向 SubType，因此无法使用原型中定义的方法
console.log(instance.constructor);	// function SubType() {}




/*-----------------------------------------------------------------------*/

// 组合继承
function SuperType(name) {
	this.name = name;
	this.colors = ["red", "blue", "green"];
}

SuperType.prototype.sayName = function() {
	alert(this.name);
}

function SubType(name, age) {

	// 继承属性
	SuperType.call(this, name);

	this.age = age;
}

// 继承方法
SubType.prototype = new SuperType();
SubType.prototype.constructor = SubType;
SubType.prototype.sayAge = function() {
	alert(this.age);
}

var instance1 = new SubType("Nicholas", 29);

instance1.colors.push("black");
console.log(instance1.colors);	// ["red", "blue", "green", "black"]
instance1.sayName();	// "Nicholas"
instance1.sayAge();	// 29

var instance2 = new SubType("Greg", 27);
console.log(instance2.colors);	// [red", "blue", "green"]
instance2.sayName();	// "Greg"
instance2.sayAge();	// 27

// instnceof 和 isPrototypeOf() 方法能够用于识别基于组合继承创建的对象
alert(instance1 instanceof Object);	// true
alert(instance1 instanceof SuperType);	// true
alert(instance1 instanceof SubType);	// true

alert(Object.prototype.isPrototypeOf(instance1));	// true
alert(SuperType.prototype.isPrototypeOf(instance1));	// true
alert(SubType.prototype.isPrototypeOf(instance1));	// true





/*-----------------------------------------------------------------------*/

// 原型式继承
function object(o) {
	// 先创建一个临时性的构造函数
	function F() {};

	// 将传入的对象作为这个构造函数的原型
	F.prototype = o;

	// 返回这个临时类型的新实例
	return new F();
}

// 本质上来讲，object() 对其中的对象执行了一次浅复制
var person = {
	name : "Nicholas",	// 基本类型值属性
	friends : ["Shelby", "Court"]	// 引用类型值属性
};

var person1 = object(person);
person1.name = "Greg";
person1.friends.push("Rob");

var person2 = object(person);
person2.name = "Linda";
person2.friends.push("Barbie");

console.log(person.friends);	// ["Shelby", "Court", "Rob", "Barbie"]


/*
 * Object.create() 方法：规范化了原型式继承
 */
var person3 = Object.create(person);
person3.name = "Allie";
person3.friends.push("Anna");

var person4 = Object.create(person);
person4.name = "John";
person4.friends.push("Mark");	

console.log(person.friends);	// ["Shelby", "Court", "Rob", "Barbie", "Anna", "Mark"]

// Object.create() 传入第二个参数，会覆盖原型对象上的同名属性
var person5 = Object.create(person, {
	name: {
		value: "Don"
	}
})

console.log(person5.name);	// Don






/*-----------------------------------------------------------------------*/

// 寄生式继承
/*
 * 利用原型式继承所创建的 object() 函数，但不是必须的
 * 任何能够返回新对象的函数都是用于此模式
 */
function createAnother(original) {
	var clone = object(original);	// 通过调用函数创建一个新对象
	clone.sayHi = function() {	// 以某种方式来增强这个对象
		alert("hi");
	};
	return clone;	// 返回这个对象
}

// 使用
var person = {
	name : "Nicholas",
	friends : ["Shelby", "Court"]
};

var anotherPerson = createAnother(person);
anotherPerson.sayHi();	// hi





/*-----------------------------------------------------------------------*/

// 寄生组合式继承
function inheritPrototype(subType, superType) {
	var prototype = object(superType.prototype);	// 创建对象，即创建超类型原型的副本
	prototype.constructor = subType;	// 增强对象，即为创建的副本添加 contructor 属性
	subType.prototype = prototype;	// 指定对象，即将新创建的对象（副本）赋值给子类型的原型
}

function SuperType(name) {
	this.name = name;
	this.colors = ["red", "blue", "green"];
}

SuperType.prototype.sayName = function() {
	alert(this.name);
}

function SubType(name, age) {
	SuperType.call(this, name);

	this.age = age;
}

inheritPrototype(SubType, SuperType);

SubType.prototype.sayAge = function() {
	alert(this.age);
}

var instance = new SubType("Nicholas", 29);
instance.sayName();	// "Nicholas"
instance.sayAge();	// 29
