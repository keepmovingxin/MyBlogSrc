---
title: Vim 在保存时获得sudo权限
toc: false
copyright: false
qrcode: true
date: 2017-04-15 11:20:02
tags: Vim
categories: 工具/效率
---

经常vim编辑一些不属于操作用户的文件，就是只有r权限的那种，每次保存都会提示read only。只能先记下来改了什么，然后再退出，然后 sudo vim 再做保存。

<!--more-->

下面的命令可以不退出vim进程，直接用vim命令获取sudo权限，然后直接保存文件。

`:w !sudo tee %`

命令:
`w !{cmd}`，让 vim 执行一个外部命令{cmd}，然后把当前缓冲区的内容从 stdin 传入。

`tee` 是一个把 stdin 保存到文件的小工具。

而 `%`，是vim当中一个只读寄存器的名字，总保存着当前编辑文件的文件路径。

所以执行这个命令，就相当于从vim外部修改了当前编辑的文件。
