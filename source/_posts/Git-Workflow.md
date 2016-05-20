---
title: Git 常用命令用法：程序员的场景
date: 2016-05-20 22:41:28
tags: Git
categories: 工具
toc: true
---

Git 相比 Subversion，无论概念上还是使用上，复杂度其实是高出一个等级的。为什么这么说？分别看下 git help -a 和 svn help 命令清单的对比，单按这个来看，就如果要掌握所有命令的用法，Git 的学习曲线绝对是比 Subversion 高的。尽管如此，但还是有越来越多项目开始用 Git 来做源码管理了。

实际中，我们用到的的 Git 命令还是很有限的，可能也就 git help 中那些而已。下面就类似 SVN命令用法：程序员的场景 一样，结合实际场景说下 Git 的常用命令用法。

### “新人报道”
你刚入职一家公司，或新加入某个团队，立马参与到一个项目中，那么就得获取项目代码，开始你的项目生涯。这个时候一般你需要克隆一份项目代码，下面都以 GitHub 上的项目地址为例：
```
$ git clone git@github.com:akun/pm.git
```
之后就进入项目目录，运行项目中的构建脚本，然后就可以熟悉代码，展开具体工作了。

<!--more-->

当然，有的时候，有一个新项目是由你发起的，你要将初始化的项目工程放到 Git 版本仓库中：
```
$ mkdir pm
$ cd pm
$ git init
$ touch README.md
$ git add README.md
$ git commit
```
Git 是分布式的版本控制系统，所以刚才的操作，算是已经在你本地版本控制起来了，为了推送本地仓库到远程仓库，就还得执行：
```
$ git remote add origin git@github.com:akun/pm.git
$ git push -u origin master
```
一般这个时候都会设置下 `~/.gitconfig` 或 `.git/config` 中的配置，最基本的就是用户名和邮箱
确认当前的 Git 配置信息：
```
$ git config --list
```
设置用户名和邮箱：
```
$ git config user.name akun
$ git config user.email admin@example.com
```
刚才的命令只是对 .git/config 生效，如果想全局生效，也就是 ~/.gitconfig，就得加上 --global 参数，比如：
```
$ git config --global user.name akun
$ git config --global user.email admin@example.com
```

### 日常工作

