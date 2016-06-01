---
title: Git Config命令查看配置文件
date: 2016-04-27 16:31:28
copyright: false
tags: Git
categories: 工具
toc: true
qrcode: true
---

git config命令的基本使用

### 配置文件如何生效

对于 git 来说，配置文件的权重是仓库>全局>系统。Git 会使用这一系列的配置文件来存储你定义的偏好，它首先会查找 /etc/gitconfig 文件（系统级），该文件含有对系统上所有用户及他们所拥有的仓库都生效的配置值。接下来 Git 会查找每个用户的 ~/.gitconfig 文件（全局级）。最后 Git 会查找由用户定义的各个库中Git目录下的配置文件 .git/config（仓库级），该文件中的值只对当前所属仓库有效。以上阐述的三 层配置从一般到特殊层层推进，如果定义的值有冲突，以后面层中定义的为准，例如：.git/config 和 /etc/gitconfig 的较量中， .git/config 取得了胜利。

<!--more-->

### 使用 git config 命令查看配置文件

命令参数–list, 简写 -l

格式：`git config [–local|–global|–system] -l`

```
查看仓库级的 config，命令：git config –local -l
查看全局级的 config，命令：git config –global -l
查看系统级的 config，命令：git config –system -l
查看当前生效的配置，  命令：git config -l
```

### 使用 git config 命令编辑配置文件

命令参数 –edit, 简写 -e

格式：`git config [–local|–global|–system] -e`

```
查看仓库级的config，命令：git config –local -e，与–list参数不同的是，git config -e默认是编辑仓库级的配置文件。
查看全局级的config，命令：git config –global -e
查看系统级的config，命令：git config –system -e
```
执行这个命令的时候，git 会用配置文件中设定的编辑器打开配置文件。

### 增加一个配置项

参数 –add

格式: `git config [–local|–global|–system] –add section.key value` (默认是添加在 local 配置中)

注意 add 后面的 section,key,value 一项都不能少，否则添加失败。比如我们执行：`git config –add man.name jim`


### 获取一个配置项

有时候，我们并不需要查看所有配置的值，而是查看某个配置项的值，怎么做呢？

命令参数 –get

格式：`git config [–local|–global|–system] –get section.key` (默认是获取 local 配置中内容) 我们先往 global 配置中写入一个 man .name=jim 的配置项，再使用 `git config –get man.name` 看看得到的是什么

