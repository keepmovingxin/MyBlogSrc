---
title: (译)tolua参考手册--accessing C/C++ code from Lua
date: 2016-05-14 22:09:28
copyright: false
tag: [Cocos2d-x, Lua, tolua]
categories: 游戏开发
toc: true
qrcode: true
---

项目使用Cocos2dx+lua框架做的，用到luabinding实现C++代码绑定到lua层使用，所以学习一下tolua++工具的原理和使用，在这做个记录。

tolua++是tolua的扩展版本，是一款能够集成C/C++与lua代码的工具。在面向C++方面，tolua++包含了一些新的特性比如：

- 支持`std::string`作为基本类型（这个可以由一个命令行选项关闭）
- 支持类模板

[tolua](http://www.tecgraf.puc-rio.br/~celes/tolua/)这款工具，极大的简化了C/C++代码与lua代码的集成。基于一个干净的头文件（或者从实际头文件中提取），tolua会自动生成从lua访问C/C++功能的绑定代码。使用Lua API和标记方法设施，tolua解析C/C++常数，外部变量、函数、类和方法绑定到Lua。

[官网](http://webserver2.tecgraf.puc-rio.br/~celes/tolua/)
[官网文档](http://webserver2.tecgraf.puc-rio.br/~celes/tolua/tolua-3.2.html)

<!--more-->

### tolua如何工作 (How tolua works)
使用tolua，我们需要创建一个package文件（译者注：pkg文件），即一个从C/C++实际头文件整理后的头文件，列举出我们想导出到lua环境中的那些常量、变量、函数、类以及方法，然后tolua会解析该文件并且创建自动绑定C/C++代码到lua的C/C++文件，如果将创建的文件同我们的应用链接起来，我们就可以从lua中访问指定的C/C++代码。

让我们先看一些例子。如果我们指定下面的c头文件作为输入到tolua:

```
#define FALSE 0
#define TRUE 1

enum { 
 POINT = 100, 
 LINE, 
 POLYGON
}
Object* createObejct (int type);
void drawObject (Object* obj, double red, double green, double blue);
int isSelected (Object* obj);
```
会自动生成一个绑定上面代码到Lua层的C文件。这样，我们在lua代码里就可以访问C代码。如：

```
...
myLine = createObject(LINE)
...
if isSelected(myLine) == TRUE then
  drawObject(myLine, 1.0, 0.0, 0.0);
else
  drawObject(myLine, 1.0, 1.0, 1.0);
end
...
```
此外，考虑下面类似C++头文件：

```
#define FALSE 0
#define TRUE 1
class Shape
{
  void draw (void);
  void draw (double red, double green, double blue);
  int isSelected (void);
};
class Line : public Shape
{
 Line (double x1, double y1, double x2, double y2);
 ~Line (void);
};
```
如果将上面的C++头文件输入给tolua，会自定生成一个Lua层访问C++代码的C++文件。这样，就可以使用如下Lua代码访问C++:

```
...
myLine = Line:new (0,0,1,1)
...
if myLine:isSelected() == TRUE then
 myLine:draw(1.0,0.0,0.0)
else
 myLine:draw()
end
...
myLine:delete()
...
```
传给tolua的package文件(.pkg)不是原本的C/C++头文件，而是手动处理过的版本。例如，外部代码访问的C++方法应该是public的，但并没有public修饰。tolua并没有实现对C/C++代码的完全解析，但它能够导出一些声明用于描述的功能到Lua层。因此，tolua将会提取出用户指定的代码以用于解析头文件。

### tolua的使用 (How to use toLua)
tolua由两部分代码组成：可执行程序和静态库（an executable and a library）。可执行程序用于解析，读入package文件，然后输出C/C++代码，该代码提供了从lua层访问C/C++层的绑定。如果package文件是与C++类似的代码（例如包括类的定义），就会生成一份C++代码。如果package文件是与C类似的代码（例如不包括类），就会生成一份C代码。tolua可接受一些选项。运行`tolua -h`显示当前可接受的选项。例如，要解析一个名为`myfile.pkg`生成一个名为`myfile.c`的绑定代码，我们需要输入：

```
tolua -o myfile.c myfile.pkg
```
生成的代码必须编译并和应用程序链接，才能提供给Lua进行访问。每个被解析的文件代表导出到Lua的package。默认情况下，package的名称就是输入文件的根名称（例子中为`myfile`），用户可以指定一个不同的名称给package：

```
tolua -n pkgname -o myfile.c myfile.pkg
```
package还应该明确的初始化。为了从C/C++代码中初始化package，我们必须声明和调用初始化函数。初始化函数被定义为：

```
int tolua_pkgname_open (void);
```
其中pkgname表示绑定的package名称。如果我们使用C++，我们可以选择自动初始化：

```
tolua -a -n pkgname -o myfile.c myfile.pkg
```
当前tolua版本还导出绑定的关闭功能，可称为解绑定package：

```
void tolua_pkgname_close (void);
```
还有，`open`和`close`功能的原型可以输出一个头文件，通过`-H`选项设置。

tolua生成的绑定代码使用了一系列tolua库里面的函数。因此，这个库同样需要被链接到应用程序中。`tolua.h`也是有必须要编译生成的代码。。

应用程序无需绑定任何package文件也可以使用tolua的面向对象框架。在这种情况下，应用程序必须调用tolua初始化函数（此函数被任何package文件初始化函数调用）：

```
int tolua_open (void);
```

如果要使用多个Lua状态(`Lua state`)，设置一个Lua状态(`Lua state`)后，我们需要调用一个函数来恢复tolua内部状态:

```
void tolua_restorestate (void);
```
### tolua的一些基本概念 (Basic Concepts)
使用tolua的第一步就是创建package文件。我们从真正的头文件入手，将想要暴露给lua的特性转换成tolua可以理解的格式。tolua能够理解的格式就是一些简单的C/C++声明。我们从下面几个方面来讨论：
#### 文件包含
一个package文件可以包含另外的package文件。一般格式是：

```
$<include_file>
```
#### 基本类型 (Basic types)
tolua会自动映射C/C++的基本类型到lua的基本类型。

* `char`,`int`,`float`和`double`类型被映射为lua中的`number`
* `char*`被映射为lua中的`string`
* `void*`被映射为lua中的`userdata`

C/C++中的数据类型前面可能有修饰语（如unsigned, static, short, const等等）。然而我们要注意到tolua会忽略基本类型前面的修饰语const。因此，我们给lua传递一个基本类型常量然后再从lua中传递回给C/C++代码，常量到非常量的转换会被悄悄的完成。

C/C++函数也可以对lua对象进行明确的操作。`lua_Object`被认为是一个基本类型，任何lua值都符合。

tolua++新特性：C++中的`string`类型同样被认为是基本类型，会被当作值传递给lua(使用c_str()方法)。这个功能可以使用命令行选项`-S`进行关闭。

#### 用户定义的类型 (User defined types)
在package文件里的所有其他类型都会被认为是用户自定义类型。它们会映射到lua的userdata类型。lua只能存储指向用户自定义类型的指针；但是，tolua会自动采取措施来处理引用和值。例如，如果一个函数或方法返回一个用户定义类型的值，当这个值返回给lua的时候，tolua会分配一个克隆对象，同时会设置垃圾收集标记，以便在lua不再使用该对象时会自动释放。

对于用户定义类型，常量是被保留的，因此将用户自定义类型的非常量作为常量传递给一个函数时，会产生类型不匹配的错误。
#### NULL和nil (NULL and nil)
C/C++的NULL或0指针映射到lua中的nil类型。反之，nil却可以被指定为任何C/C++指针类型。这对任何类型都有效：`char*`, `void*`以及用户自定义类型指针。
#### 宏定义类型 (Typedefs)
tolua还接受简单类型定义的package文件。任何发生的一种定义是由tolua映射后的基类型。他们是非常有用的，因为几个包定义基本的C/C++类型自己的类型。例如，可以定义一个真正代表两个类型。在这种情况下,真正的可以用来指定变量类型package文件由tolua解释，但前提是我们包括以下定义之前使用的实际类型`real`。

```
typedef double real;
```
否则，`real`将被解释为一个用户定义的类型和不会被映射到Lua数字(`numbers`)。
包含`real`的头文件(Including real header files)

在package文件中，我们必须指定哪个是真正(`real`)的头文件,应包含生成的代码可以访问常量,变量,函数,类具有约束。package文件中的任意行开始`$ (except $<...>, $[ , and $] lines)`插入到生成绑定C/C++代码没有任何变化，但 `$` 本身的消除。我们使用这个特性，包括真正(`real`)的头文件。所以，我们的package文件通常会入手一套 `$` 开始行指定的文件必须包括在内，也就是说，这些文件是基于package文件。

```
/* specify the files to be included */
$#include "header1.h"                 // include first header
$#include "header2.h"                 // include second header
```
额外说明，tolua还接受注释，使用C或C++惯例,包内的文件。也可以使用嵌套C注释。

在下面几节中,我们描述了如何指定C/C++代码绑定到Lua。格式是简单有效的C/C++语句。它非常简单的将是一个真正的C/C++头文件转换成package文件。

### 绑定常量 (Binding constants)
绑定常量，tolua支持两种绑定常量的方式：`define`和 `enum`。
`define`通常的格式是：

```
#define NAME [ VALUE ]
```
上面的VALUE是可选的。如果这样的代码出现在被解析的文件中，tolua会将`NAME`作为lua的全局变量，该全局变量是C/C++的常量，值为VALUE。这里只接受数字常量。

tolua++新特性：所有的其他预处理指令会被忽略。

`enum`的一般格式：

```
enum {
  NAME1 [ = VALUE1 ] ,
  NAME2 [ = VALUE2 ] ,
  ...
  NAMEn [ = VALUEn ]
};
```
同样的，tolua会创建一系列全局变量，命名为`NAMEi`，对应着各自的值。

### 绑定外部变量 (Binding external variables)
全局的外部变量也可以被导出。在package头文件指定为:

```
[extern] type var;
```
tolua绑定这样的声明Lua全局变量。因此，在Lua中，我们自然地可以访问C/C++变量。如果非恒定的变量，我们也可以从Lua变量分配一个新值。全局变量表示数组的值也可以绑定到Lua。数组可以是任何类型的。相应的Lua对象数组是Lua表与数值索引；然而，请注意，指数1在Lua中映射到索引0 C/C++数组。数组必须预先设置长度。例如:

```
double v[10]; 
```
### 绑定函数 (Binding functions)
函数也指传统C/C++声明:

```
type funcname (type1 par1[, type2 par2[,...typeN parN]]);
```
返回类型可以为空(void)，这意味着没有返回值。一个函数也可以没有参数。在这种情况下，void可能的列表中指定的参数。参数类型必须遵守已经发布的规则。tolua会创建一个Lua函数绑定C/C++函数。从Lua调用一个函数时，参数类型必须匹配相应的C/C++类型，否则，tolua会生成一个错误报告指定的参数是错误的。如果省略参数名称，tolua会自动命名，但类型应该是基本类型(basic type)或之前使用过的用户类型(user type)。
#### Arrays (数组)
tolua也处理函数或方法参数表示数组的值。阵列的优点是，它们的值更新相应的Lua表如果C/C++函数改变数组的内容。
数组必须指定大小。例如:
```
void func (double a[3]);
```
是一个有效的函数声明为tolua和从Lua不调用这个函数，例如:

```
p = {1.0,1.5,8.6} 
func (p)
```
数组维数不需要一个常数表达式，指定的大小也可以由任何表达式，可以在运行时进行。例如:
```
void func (int n, int m, double image[n*m]);
```
也有效的自表达式`n * m`绑定函数范围是有效的。然而，请注意，tolua使用动态分配绑定这个函数，能降低性能。

尽管大小规范，重要的是要知道所有数组传递给实际的C/C++函数在本地绑定函数的范围。所以，如果C/C++函数被称为需要保存数组指针以备后用，绑定的代码将无法正常工作。
#### Overloaded functions (重载函数)
函数重载是支持的。记住名称相同的两个函数之间的区别是基于映射到Lua的参数类型。所以，尽管
```
void func (int a); 
void func (double a);
```
代表两个不同的函数在C++中，他们是tolua相同的函数，因为int和double映射到相同的Lua类型:数字。

另一个棘手的情况发生在导出指针。假设:
```
void func (char* s);
void func (void* p);
void func (Object1* ptr);
void func (Object2* prt);
```
虽然这四个函数代表不同的函数在C++中,Lua声明:
```
func(nil)
```
匹配所有的函数。

重要的是要知道tolua决定函数将调用在运行时，试图匹配每个提供的函数。tolua首先试图调用指定的函数;如果失败了，tolua然后试之前一个。重复这个过程，直到一个函数调用代码匹配或第一个函数。出于这个原因，失配误差信息，当它发生时，是基于第一个函数规范。当然性能是很重要的，我们可以指定最常用函数作为最后一个，因为它将放在第一位。

tolua允许使用重载函数在C语言中，查看详细[Renaming](http://webserver2.tecgraf.puc-rio.br/~celes/tolua/tolua-3.2.html#renaming)

#### Default parameter values (默认参数值)
最后一个函数参数可以有相关联的默认值。在这种情况下，如果用更少的参数，函数被调用的默认值。格式指定默认值是一样的一个用于C++代码:
```
type funcname (..., typeN-1 parN-1 [= valueN-1], typeN parN [= valueN]);
```
toLua实现这个功能没有使用任何C++机制;因此，它也可以使用绑定C函数。

我们也可以指定数组的元素的默认值(没有办法为数组本身，指定一个默认值)。例如:

```
void func (int a[5]=0);
```
设置默认元素值为零，因此，从Lua函数可以调用未初始化表。

Lua对象类型(lua_Object)，tolua定义一个常数，可用于指定空值作为默认值:
```
void func (lua_Object lo = TOLUA_NIL);
```
#### Multiple returned values (多个返回值)

In Lua, a function may return any number of values. tolua uses this feature to simulate values passed by reference. If a function parameter is specified as a pointer to or reference of a basic type or a pointer to or reference of a pointer to an user defined type, tolua accepts the corresponding type as input and returns, besides the conventional function returned value, if any, the updated parameter value.

For instance, consider a C function that swaps two values:

```
void swap (double* x, double* y);
```
or

```
void swap (double& x, double& y);
```
If such a function is declared in the package file, tolua binds it as a function receiving two numbers as input and returning two numbers. So, a valid Lua code would be:

```
x,y = swap(x,y)
```
If the input values are not used, the use of default parameter value allows calling the function from Lua without specifying them:

```
void getBox (double* xmin=0, double* xmax=0, double* ymin=0, double* ymax=0);
```
In Lua:

```
xmin, xmax, ymin, ymax = getBox()
```
With user defined types, we would have for instance:

```
void update (Point** p);
```
or

```
void update (Point*& p);
```
### 绑定结构体 (Binding struct fields)
User defined types are nicely bound by tolua. For each variable or function type that does not correspond to a basic type, tolua automatically creates a tagged userdata to represent the C/C++ type. If the type corresponds to a struct, the struct fields can be directly accessed from Lua, indexing a variable that holds an object of such a type. In C code, these types are commonly defined using typedef's:

```
typedef struct [name] {
   type1 fieldname1;
   type2 fieldname2;
   ...
   typeN fieldnameN;
} typename;
```
If such a code is inserted in the package file being processed, tolua allows any variable that holds an object of type typename to access any listed field indexing the variable by the field name. For instance, if var holds a such object, `var.fieldnamei` accesses the field named fieldnamei.

Fields that represent arrays of values can also be mapped:

```
typedef struct { 
  int x[10]; 
  int y[10]; 
} Example; 
```
### 绑定类和方法 (Binding classes and methods)
C++ class definitions are also supported by tolua. Actually, the tolua deals with single inheritance and polymorphism in a natural way. The subsections below describe what can be exported by a class definition.

#### Specifying inheritance (指定继承)

If var is a Lua variable that holds an object of a derived class, var can be used wherever its base class type is expected and var can access any method of its base class. For this mechanism to take effect, we must indicate that the derived class actually inherits the base class. This is done in the conventional way:

```
class classname : public basename
{
 /* class definition */
};
```
#### Specifying exported members and methods (指定导出成员和方法)

As for struct fields, class fields, static or not, can be exported. Class methods and class static methods can also be exported. Of course, they must be declared as public in the actual C++ code (although the public: keyword may not appear in the package files).
For each bound class, tolua creates a Lua table and stores it at a global variable which name is the name of the C++ class. Static exported fields are accessed by indexing this table with the field names (similar to struct fields). Non static exported fields are accessed by indexing the variable that holds the object. Class methods follow the format of the function declaration showed above. They can be accessed from Lua code using the conventional way Lua uses to call methods, applied of course to a variable that holds the appropriate object or to the class table, for static methods.

There are a few special methods that are also supported by tolua. Constructors are called as static methods, named new. Destructors are called as a conventional method called delete.

Note that tolua does support overload. This applies even for constructors. Also note that the virtual keyword has no effect in the package file.

The following code exemplifies class definitions that can be interpreted by tolua.

```
class Point {
   static int n;    // represents the total number of created Points

   double x;        // represents the x coordinate
   double y;        // represents the y coordinate
   static char* className (void);   // returns the name of the class
   Point (void);                          // constructor 1
   Point (double px, double py);          // constructor 2
   ~Point (void);                         // destructor
   Point add (Point& other);              // add points, returning another one
};
```
```
class ColorPoint : public Color {
   int red;      // red color component [0 - 255]
   int green;    // green color component [0 - 255]
   int blue;     // blue color component [0 - 255]
   ColorPoint (double px, double py, int r, int g, int b);
};
```
If this segment of code is processed by tolua, we would be able to write the following Lua statements:

```
p1 = Point:new(0.0,1.0)
p2 = ColorPoint:new(1.5,2.2,0,0,255)
print(Point.n)                     -- would print 2
p3 = p1:add(p2)
print(p3.x,p3.y)                   -- would print 1.5 and 3.2
print(p2.red,p2.green,p2.blue)     -- would print 0, 0, and 255
print(
p1:delete()                        -- call destructor
p2:delete()                        -- call destructor
```
Note that we can only explicitly delete objects that we explicitly create. In the example above, the point p3 will be garbage-collected by tolua automatically; we cannot delete it.
Of course, we need to specify only the methods and members we want to access from Lua. Sometimes, it will be necessary to declare a class with no member or method just for the sake of not breaking a chain of inheritances.

#### Overloaded operators（重载的运算符）

tolua automatically binds the following binary operators:

```
	operator+   operator-   operator*   operator/ 
	operator<   operator>   operator<=  operator>=
```
For the relational operators, toLua also automatically converts a returned 0 value into nil, so false in C becomes false in Lua.
As an example, suppose that in the code above, instead of having:

```
   Point add (Point& other);              // add points, returning another one
```
we had:

```
   Point operator+ (Point& other);        // add points, returning another one
```
In that case, in Lua, we could simply write:

```
p3 = p1 + p2
```
The indexing operator (`operator[]`) when receiving a numeric parameter can also be exported to Lua. In this case, tolua accepts reference as returned value, even for basic types. Then if a reference is returned, from Lua, the programmer can either get or set the value. If the returned value is not a reference, the programmer can only get the value. An example may clarify: suppose we have a vector class and bind the following operator:

```
   double& operator[] (int index);
```
In this case, in Lua, we would be able to write: `value = myVector[i]` and also `myVector[i] = value`, what updates the C++ object. However, if the bound operator was:

```
   double operator[] (int index);
```
we would only be able to write: `value = myVector[i]`.
Free functions (i.e., not class members) that overload operators are not supported.

### 模块定义 (Module definition)
tolua allows us to group constants, variables, and functions in a module. The module itself is mapped to a table in Lua, and its constants, variables, and functions are mapped to fields in that table. The general format to specify a module is:

```
module name 
{ 
      ... // constant, variable, and function declarations 
}
```
Thus, if we bound the following module declaration:

```
module mod 
{ 
 #define N 
 extern int var; 
 int func (...): 
}
```
In Lua we would be able to access such features by indexing the module: `mod.N, mod.var, mod.func`.

### 命名常量、变量和函数 (Renaming constants, variables and functions)
When exporting constants, variable, and functions (members of a class or not), we can rename them, such that they will be bound with a different name from their C/C++ counterparts. To do that, we write the name they will be referenced in Lua after the character `@`. For instance:

```
extern int cvar @ lvar;

#define CNAME @ LNAME

enum { 
  CITEM1 @ LITEM1, 
  CITEM2 @ LITEM2, 
  ... 
};

void cfunc @ lfunc (...);

class T 
{ 
   double cfield @ lfield; 
   void cmeth @ lmeth (...); 
   ... 
};
```

In such a case, the global variable `cvar` would be identified in Lua by `lvar`, the constant `CNAME` by `LNAME`, and so on. Note that class cannot be renamed, because they represent types in C.

This renaming feature allows function overload in C, because we can choose to export two different C functions with a same Lua name:

```
void glVertex3d @ glVertex (double x, double y, double z=0.0); 
void glVertexdv @ glVertex (double v[3]=0.0);
```
### 存储额外字段 (Storing additional fields)
Finally, it is important to know that even though the variables that hold C/C++ objects are actually tagged userdata for Lua, tolua creates a mechanism that allows us to store any additional field attached to these objects. That is, these objects can be seen as conventional Lua tables.

```
obj = ClassName:new()
obj.myfield = 1  -- even though "myfield" does not represent a field of ClassName
```
Such a construction is possible because, if needed, tolua automatically creates a Lua table and associates it with the object. So that, the object can store additional fields not mapped to C/C++, but actually stored in the conjugate table. The Lua programmer accesses the C/C++ features and these additional fields in an uniform way. Note that, in fact, these additional fields overwrite C/C++ fields or methods when the names are the same.

### 导出工具函数 (Exported utility functions)
tolua uses itself to export some utility functions to Lua, including its object-oriented framework. The package file used by tolua is shown below:

```
module tolua 
{ 
 void tolua_using @ using (lua_Table module); 
 char* tolua_type @ type (lua_Object lo); 
 void tolua_foreach @ foreach (lua_Object lo, lua_Function f); 
 void tolua_class @ class (lua_Table derived, lua_Table base=TOLUA_NIL); 
 void tolua_instance @ instance (lua_Table instance, lua_Table classobj); 
 lua_Object tolua_base @ base (lua_Object lo); 
}
```
#### tolua.using (table)
This functions receives a table and maps all its fields to the global environment. Thus we can map an entire module and access its features without the module prefix. For instance, if in our Lua code we do:

```
tolua.using(tolua)
```
all tolua utility functions are mapped to the global environment.

#### tolua.type (var)
Returns a string representing the object type. For instance, `tolua.type(tolua)` returns the string `generic module` and `tolua.type(tolua.type)` returns `cfunction`. Similarly, if `var` is a variable holding a user defined type `T, tolua.type(var)` would return const `T` or `T`, depending whether it is a constant reference.

#### tolua.tag ("type")
Returns type corresponding tag number.

#### tolua.foreach (object)
Allows us to traverse the conjugate table of an user defined instance. If applied to conventional table, it has a similar behavior as the Lua built-in `foreach` function. The difference is that this function filters all fields starting with a dot, not passing them to the provided callback function. This filter is need because tolua adds "hidden" fields to the tables it manipulates, and all its "hidden" fields start with a dot.

#### tolua.cast (object, "typename")
Returns the object "casted" to the given type. The object must represent an user type, otherwise the function returns `nil`.

#### tolua.takeownership (object)
Asks tolua to take the ownership of the given object. This means the C/C++ object will be freed/ destructed when garbage-collected by Lua.  The object must represent an user type, otherwise an execution error is generated.

#### tolua.class (table, base=nil)
Creates a class by setting the appropriate tag methods to the given table. The created class can inherit from a base class, previously created.

#### tolua.instance (table, class)
Sets the given table to be an instance of the given class. This and the previous utility functions allow object-oriented programming in Lua. As an example consider:

```
-- define a Point class 
classPoint = { x=0, y=0 } 
tolua.class(classPoint) -- set as a class
```

```
-- define print method 
function classPoint:print () 
   print(self.x,self.y) 
end
```

```
-- define add method 
function classPoint:add (p2) 
   return Point{x=self.x+p2.x,y=self.y+p2.y} 
end
```

```
-- define a Point constructor 
function Point (p) 
   tolua.instance(p,classPoint) -- set as an instance of classPoint 
return p end
```

```
-- define a Color Point class 
classColorPoint = { color = 'black' } 
tolua.class(classColorPoint,classPoint) -- set as class inheriting from classPoint
```

```
-- define class methods 
function classColorPoint:print () 
   print(self.x,self.y,self.color) 
end
```

```
-- define Color Point constructor 
function ColorPoint (p) 
   tolua.instance(p,classColorPoint) -- set as an instance of classColorPoint 
   return p 
end
```

```
-- Some valid codes would then be 
p = Point{x=1} 
q = ColorPoint{x=2,y=3,color=2} 
r = p:add(q) 
r:print() --> would print "3 3" 
```
### Lua嵌入代码 (Embedded Lua code)
tolua allows us to embed Lua code in the C/C++ generated code. To do that, it compiles the specified Lua code and creates a C constant string, storing the corresponding bytecodes, in the generated code.  When the package is opened, such a string is executed. The format to embed Lua code is:

```
$[

embedded Lua code 
...

$]
```
As an example consider the following .pkg excerpt:

```
/* Bind a Point class */ 
class Point 
{ 
 Point (int x, int y); 
 ~Point (); 
 void print (); 
 ... 
} CPoint;

$[

-- Create a Point constructor 
function Point (self) 
 local cobj = CPoint:new(self.x or 0, self.y or 0) 
 tolua.takeownership(cobj) 
 return cobj 
end

$]
```
Binding such a code would allow us to write the following Lua code:

```
p = Point{ x=2, y=3 } 
p:print() 
... 
```
### 基本步骤
* 添加自定义类
* 按照tolua改写规则，改写头文件(也可以在头文件加tolua能够识别的代码)生成tolua文件，这里分为两个方式，一是生成单独对应的tolua文件，二是追加到已有的tolua文件中
* 运行脚本，生成绑定文件，根据第二步tolua生成方式的不同，生成的绑定也是两个方式：一是生成单独对应的绑定文件.h/.cpp，而是生成的内容分别追加到已有的绑定文件.h/.cpp中
* 载入luabinding接口文件
