---
title: [译] tolua(accessing C/C++ code from Lua)参考手册
date: 2016-05-14 22:09:28
tags: Cocos2d-x,Lua
categories: 游戏开发
toc: true
---

项目使用Cocos2dx+lua框架做的，用到luabinding实现C++代码绑定到lua层使用，所以学习一下tolua++工具的原理和使用，在这做个记录。

tolua是一个工具，极大地简化了集成与Lua的C/C++代码。基于package文件，tolua自动生成绑定代码访问从Lua C/C++的特性。使用Lua API和标记方法设施，tolua地图C/C++常数，外部变量、函数、类和方法Lua。

[官网](http://webserver2.tecgraf.puc-rio.br/~celes/tolua/)
[官网文档](http://webserver2.tecgraf.puc-rio.br/~celes/tolua/tolua-3.2.html)

### tolua如何工作 (How tolua works)
使用tolua，我们需要创建一个package文件（译者注：pkg文件），即一个从C/C++实际头文件整理后的头文件，列举出我们想导出到lua环境中的那些常量、变量、函数、类以及方法，然后tolua会解析该文件并且创建自动绑定C/C++代码到lua的C/C++文件，如果将创建的文件同我们的应用链接起来，我们就可以从lua中访问指定的C/C++代码。

<!--more-->

### tolua的使用 (How to use toLua)

### tolua的一些基本概念 (Basic Concepts)

### tolua的一些基本概念 (Binding constants)

### 绑定外部变量 (Binding external variables)

### 绑定函数 (Binding functions)

### 绑定结构体 (Binding struct fields)

### 绑定类和方法 (Binding classes and methods)

### 模块定义 (Module definition)

### 命名常量、变量和函数 (Renaming constants, variables and functions)

### 存储额外字段 (Storing additional fields)

### 导出工具函数 (Exported utility functions)

### Lua嵌入代码 (Embedded Lua code)

### 使用示例
