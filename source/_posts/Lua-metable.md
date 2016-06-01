---
title: 了解Lua metatable 元表
date: 2016-05-25 15:30:05
copyright: false
tags: Lua
categories: 游戏开发
toc: true
qrcode: true
---

参考lua手册，`metatable`是被译作元表，Lua 中的每个值都可以用一个 `metatable`。这个 `metatable` 就是一个原始的 Lua table，它用来定义原始值在特定操作下的行为。

### `metatable`

一个 `metatable` 可以控制一个对象做数学运算操作、比较操作、连接操作、取长度操作、取下标操作时的行为，metatable 中还可以定义一个函数，让 `userdata` 作垃圾收集时调用它。对于这些操作，Lua 都将其关联上一个被称作事件的指定健。当 Lua 需要对一个值发起这些操作中的一个时，它会去检查值中 metatable 中是否有对应事件。如果有的话，键名对应的值（元方法）将控制 Lua 怎样做这个操作。

<!--more-->

### 函数（元方法）
metatable通过其包含的函数来给所挂接的table定义一些特殊的操作，包括:

* `__add`: 定义所挂接table的加法操作
* `__mul`: 定义乘法操作
* `__div`: 定义除法操作
* `__sub`: 定义减法操作
* `__unm`: 定义负操作, 即: -table的含义
* `__tostring`: 定义当table作为tostring()函式之参数被呼叫时的行为(例如: `print(table)`时将呼叫`tostring(table)`作为输出结果)
* `__concat`: 定义连接操作(".."运算符)
* `__index`: 定义当table中不存在的key值被试图获取时的行为
* `__newindex`: 定义在table中产生新key值时的行为

#### `__index` metamethod
1. 在我们访问 table 的不存在的域时，Lua 会尝试调用 `__index` metamethod。`__index` metamethod 接受两个参数 table 和 key，代码如下:
```
local mt = {}
mt.__index = function(table, key)
    print('table -- ' .. tostring(table))
    print('key -- ' .. key)
end

local t = {}
setmetatable(t, mt)
local v = t.a
```
2. `__index` 域也可以是一个 table，那么 Lua 会尝试在 `__index` table 中访问对应的域，代码如下:
```
local mt = {}
mt.__index = {
    a = 'Hello World'
}

local t = {}
setmetatable(t, mt)
print(t.a) --> Hello World
```
我们通过 `__index` 可以容易的实现单继承（类似于 JavaScrpit 通过 prototype 实现单继承），如果 `__index` 是一个函数，则可以实现更加复杂的功能：多重继承、caching 等。我们可以通过 `rawget(t, i)` 来访问 `table t` 的域 `i`，而不会访问 `__index` metamethod，注意的是，不要太指望通过 `rawget` 来提高对 `table` 的访问速度（Lua 中函数的调用开销远远大于对表的访问的开销）

#### `__newindex` metamethod
如果对 table 的一个不存在的域赋值时，Lua 将检查 `__newindex` metamethod：
1. 如果 `__newindex` 为函数，Lua 将调用函数而不是进行赋值
2. 如果 `__newindex` 为一个 table，Lua 将对此 table 进行赋值
如果 `__newindex` 为一个函数，它可以接受三个参数 table key value。如果希望忽略 `__newindex` 方法对 table 的域进行赋值，可以调用 `rawset(t, k, v)`

结合 `__index` 和 `__newindex` 可以实现很多功能，例如：
1. OOP
2. Read-only table
3. Tables with default values

Read-only table 代码如下:
```
function readOnly(t)
    local proxy = {}
    local mt = {
        __index = t,
        __newindex = function(t, k, v)
            error('attempt to update a read-only table', 2)
        end
    }
    setmetatable(proxy, mt)
    return proxy
end

days = readOnly{'Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'}

print(days[1])
days[2] = 'Noday' --> stdin:1: attempt to update a read-only table
```
有时候，我们需要为 table 设定一个唯一的 key，那么可以使用这样的技巧，代码如下:
```
local key = {} -- unique key
local t = {}
t[key] = value
```

