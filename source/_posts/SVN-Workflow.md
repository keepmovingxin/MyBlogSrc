---
title: SVN命令用法：程序员的场景
date: 2016-05-20 22:31:59
tags: SVN
categories: 工具
toc: true
---

SVN有不少命令，其实常用的也就那么几个，可以结合下实际的使用场景，来说明下SVN的命令用法。
当然可能对很多人来说，最实用的熟悉方式，就是直接运行
```
svn help (?, h)
```
就入门了，但为了更好的记忆，有个实际场景也是个不错的选择。
注解：括号中的是该命令的缩写或别名，有的可以少打几个字母，后面也有类似描述。

### “新人报道”
你刚入职一家公司，或新加入某个团队，立马参与到一个项目中，项目代号Norther，那么就得获取项目代码，开始你的项目生涯。这个时候一般你需要签出项目代码：
```
svn checkout (co) https://scms.ship.it/svn/norther/trunk norther
```
确认工作目录的SVN信息，说明已经纳入版本控制了：
```
cd ~/projects/norther
svn info
```
确认没问题了，就运行项目中的构建脚本，然后就可以熟悉代码，展开具体工作了。
当然，有的时候，有一个新项目是由你发起的，你要将初始化的项目工程放到SVN版本仓库中：
```
svn import souther https://scms.ship.it/svn
```
确认项目已经在版本仓库中了：
```
svn list (ls) https://scms.ship.it/svn/souther/trunk
```
应该就可以看到Souther项目的根目录结构了。

### 日常工作

