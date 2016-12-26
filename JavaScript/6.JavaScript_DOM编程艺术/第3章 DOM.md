### 一、文档：DOM中的“D”

当创建了一个网页并把它加载到Web浏览器中时，DOM就产生了，它把你编写的网页文档转换为一个文档对象。

### 二、对象：DOM中的“O”

JavaScript语言里的对象可以分为三种类型：

- **用户自定义对象**：由程序员自行创建的对象
- **内建对象**：内建在JavaScript语言里的对象，如 Array、Math 和 Date 等
- **宿主对象**：由浏览器提供的对象，如 window、document

window对象对应着浏览器窗口本身，这个对象的属性和方法统称为BOM（浏览器对象模型）

### 三、模型：DOM中的“M”

DOM 把一份文档表示为一棵树（家谱树）。

### 四、节点

1. 元素节点：DOM 的原子，即标签的名字，如 html、p、ul、li

2. 文本节点：总是被包含在元素节点的内部，但并非所有的元素节点都包含文本节点

3. 属性节点：用来对元素做出更具体的描述，如 title 属性，并非所有的元素都包含属性，但所有的属性都被元素包含。

4. CSS：除了DOM与网页结构打交道，还可以通过CSS告诉浏览器如何显示一份文档的内容。

5. 获取元素
	
	- `getElementById`：是 document 对象特有的函数

			document.getElementById(id)

	- `getElementsByTagName`：返回一个对象数组
	
			element.getElementsById(tag)

	- `getElementsByClassName`：可以查找那些带有多个类名的元素，可以指定多个类名，用空格分隔
	
			element.getElementsByClassName(class)

6. 盘点知识点

	- 一份文档就是一颗节点树
	- 节点分为不同的类型：元素节点、属性节点和文本节点等
	- `getElementById` 将返回一个对象，该对象对应着文档里的一个特定的元素即诶但
	- `getElementsByTagName` 和 `getElementsByClassName` 将返回一个对象数组，它们分别对应着文档里的一组特定的元素节点。


### 五、获取和设置属性

1. getAttribute：获取元素的各个属性
	
	getAttribute 方法不属于 document 对象，所以不能通过 document 对象调用。它只能通过元素节点对象调用。

		object.getAttribute(attribute)

2. setAttribute：更改属性节点的值

		object.getAttribute(attribute, value)

	> 注意：通过 setAttribute 对文档做出修改后，在通过浏览器 view source 选项去查看文档的源代码时看到的仍将是改变前的属性值，即，setAttribute 做出的修改不会反映在文档本身的源代码里。
	>  
	> 这种“表里不一”的现象源自 DOM 的工作模式：先加载文档的静态内容，再动态刷新，动态刷新不影响文档的静态内容。
	> 
	> 这正是 DOM 的真正威力：对页面内容进行刷新却不需要在浏览器里刷新页面。

### 六、小结

本章介绍了DOM提供的五个基础方法：

- getElementById
- getElementsByTagName
- getElementsByClassName
- getAttribute
- setAttribute