---
title: vi/vim显示中文字符并且去掉^M的方法
toc: true
copyright: false
date: 2016-04-29 13:39:31
tags: Vim
categories: 工具
qrcode: true
---
* 处理项目xml配置时vim打开经常会碰到中文显示不正常的现象，也就是传说中的乱码，搜索找到一个解决办法，记录一下，但是gbk编码的正常了，utf8的又不对了，于是稍微改了一点。

<!--more-->

### 用户目录下创建.vimrc文件

加入

          set fileencodings=utf-8,gb2312,gbk,gb18030
          set termencoding=utf-8
          set fileformats=unix
          set encoding=prc

fileencodings中utf-8要在前面

这样就能正常显示中文了，配合pietty，可以完全正常显示、编辑中文了。

### 几种去除^M的方法
1、`cat filename1 | tr -d "\r" > newfile`

2、 `sed -e "s/^V^M//" filename > outputfilename`

3、vi： 用vi打开文件

(1) 按ESC键

(2) 输入 :%s/^M//g

确定 ^M是使用 "CTRL-V CTRL-M" 而不是字面上的 ^M。

这个正则式将替换所有回车符前的 ^M为空($是为了保证^M出现在行尾)

4、用 vim 输入 :`set notextmode`

可惜，经过上面的处理以后，^M是不存在了，但是换行不成功。所有的东西都在一行上面，看着很费劲。这说明处理的时候文件缺少"\n"，可以在替换的时候添加上即可：

`cat filename | tr "\r" "\n" > newfile`

注: ^M 可以用Sublime Text编辑器查看

一些linux版本有 dos2unix 程序，可以用来祛除^M

