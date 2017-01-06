/*
 * @Author: Ruth
 * @Date:   2016-07-26 20:42:50
 * @Last Modified by:   Ruth
 * @Last Modified time: 2017-01-06 10:51:52
 */

'use strict';

class Animal {
    constructor(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }
}

class Dog extends Animal {
    constructor(name) {
        super(name);
    }

    speak() {
        return "woof";
    }
}

var dog = new Dog('Scamp');
console.log(dog.getName() + ' says ' + dog.speak());