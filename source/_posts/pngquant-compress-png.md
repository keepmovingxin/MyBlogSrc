---
title: 利用pngquant压缩png图片
date: 2016-04-30 21:11:28
tags: pngquant
categories: 工具/效率
toc: true
qrcode: true
---

项目包体积越来越大，为了压缩包大小找到一个比较好用的png图片压缩工具，在这记录一下。
### 安装并配置全局变量

安装：
去官网下载压缩包 或者 源码: `git clone git://github.com/pornel/pngquant.git`
也可以使用HomeBrew安装：`brew install pngquant`
配置全局变量(使用HomeBrew安装请忽略)：
`ln –s /下载的位置/pngquant /usr/local/bin/pngquant`
pngquant 可以愉快的玩耍啦！

<!--more-->

### 查看帮助信息
执行 pngquant -h 查看完整选项
```
	--ext new.png
	设置输出图片的后缀。默认是 -or8.png 或者 -fs8.png 。
	--quality min-max
	使 pngquant 使用最少的颜色达到或超出 max 品质要求。如果转换结果低于 min 品质，图像不会被保存 (如果是输出到标准输出, 24-bit 原图像会被输出) 并且 pngquant 会退出并返回 99。
	min 和 max 范围在 0 (最差) 到 100 (最佳), 和 JPEG 相似。
	pngquant --quality=65-80 image.png
	--speed N, -sN
	速度/质量 平衡 从 1 (强制) 到 10 (最快)。默认是 3。速度 10 相比减少图片 5% 质量, 但是 8 倍于默认的速度。
	--iebug
	在 IE6 下, 只显示完全不透明的像素。pngquant 会使半透明像素以不透明方式显示并且不生产新的像素。
	--version
	输出版本信息。
	-
	从标准输入读取图像并输出到标准输出。
	--
	不处理对象。允许使用文件名以 - 开头的文件。如果你在脚本中使用 pngquant , 建议在文件名前加上这个:
```

`pngquant $OPTIONS -- "$FILE"`

### 使用示例
压缩Downloads目录下所有的png，并替换当前图片
`find /Users/mac/Downloads/ -name "*.png" | while read line; do pngquant --ext .png --force $line; done`

