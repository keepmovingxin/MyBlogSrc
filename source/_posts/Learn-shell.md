---
title: shell学习笔记
date: 2016-05-02 16:50:52
tags: shell
categories: 工具
toc: true
---

### 1.Shell脚本
#### 1.1 格式首行		#!/bin/bash	指定解释器
#### 1.2 注释'#'开头的行，'#!'是例外
此外，# 是特殊字符，可以出现在一些参数代换结构和在数值常量表达式中，具有特殊含义，而不会开启一个注释。‘\#’也不会开启一个注释。<!--more-->

#### 1.3 函数```function funname(){…}```或者
```funname(){	statements;}```只需要使用函数名就可以调用某个函数：`funname`参数可以传递给函数，使用方法就好像函数是个新脚本一样：
funname arg1 arg2...;	#传递参数在函数中使用传入的参数：$1	第一个参数；$@ 所有参数。其中："$@"被扩展成"$1""$2""$3"；"$*"被扩展成"$1c$2c$3"，即一个字符串。c为IFS的第一个字符。有时我们需要知道命令或者函数的执行状态，用$?可以查看前一个命令的返回值，如果命令成功退出，那么退出状态为0，否则非0。#### 1.4 正文部分流程控制+命令#### 1.5 执行：修改权限转为可执行程序chmod +x ./test.sh  #使脚本具有执行权限./test.sh  #执行脚本
#### 1.6 流程控制条件语句

if :

```
if condition
then	command1 	command2	...	commandNfi
```
```
if `ps -ef | grep ssh`;  
then 
	echo hello; 
fi
```
if else-if else :
```if condition1then    command1elif condition2    command2else    commandNfi```循环语句for :
```for var in item1 item2 ... itemNdo    command1    command2    ...    commandNdone```
```for var in item1 item2 ... itemN; do command1; command2… done;```

while :

```
i=1;total=0;while [ $i -le 10 ]do    let total+=i    let i++    echo $total,$idone
```

```
i=1; total=0;while((i<=10))do    ((total+=i, i++))    echo $total,$idone
```
case语句: case语句可以用户处理自定义参数。

```
case $num in1) echo "January";;     			#双分号结束2) echo "Feburary";;5) echo "may"          				#每个case可以有多条命令          echo "sdfd"   echo "sdf";;       				#但最后一条命令一定是双分号结束*) echo "not correct input";;   	#*）是其他值、default的意思esac
```#### 1.7 while read line```
while read line; do something ; done```#### 1.8	参数处理a)	"$*"将所有的参数解释成一个字符串，而"$@"是一个参数数组。b)	Shell内建函数getopts “:a:bc” opt	主要变量：	$OPTIND	:	存储所处理的选项在参数列表中的位置	$OPTARG	：	存储相应选项所带的参数例子：
```
while getopts ":a:b:cef" optdo    case $opt in        a)echo "the $OPTIND has arg:$OPTARG";;#$OPTIND=3        b)echo "the b has arg:$OPTARG";;        c | e | f)echo "the $opt has no arg";;        \?)echo "the $opt is invalid param";;    esacdone```c)	shift n   将位置命令左移n个#### 1.9	条件判断条件判断应该放进方括号里，且方括号两边都应该留有空格。 [  ]a)	字符串判断字符串比较时，最好用双中括号，因为有时候采用单中括号会产生错误，所以最好避开它们。[[ $str1 = $str2 ]]	=			当两个串有相同内容、长度时为真	!=		　　当串str1和str2不等时为真	-n			当串的长度大于0时为真(串非空)	-z			当串的长度为0时为真(空串)
b)	数值判断	-eq     两数相等为真 	-ne     两数不等为真 	-gt     int1大于int2为真 	-ge     int1大于等于int2为真 	-lt     int1小于int2为真 	-le     int1小于等于int2为真
c)	文件判断	-e file         若文件存在，则为真 	-d file         若文件存在且是一个目录，则为真	-b file         若文件存在且是一个块特殊文件，则为真	-c file         若文件存在且是一个字符特殊文件，则为真	-f file         若文件存在且是一个规则文件，则为真	-g file         若文件存在且设置了SGID位的值，则为真	-h file         若文件存在且为一个符合链接，则为真	-k file         若文件存在且设置了"sticky"位的值	-p file         若文件存在且为一已命名管道，则为真	-r file         若文件存在且可读，则为真	-s file         若文件存在且其大小大于零，则为真	-u file         若文件存在且设置了SUID位，则为真	-w file         若文件存在且可写，则为真	-x file         若文件存在且可执行，则为真	-o file         若文件存在且被有效用户ID所拥有，则为真
d)	逻辑判断	!      非	-a     与		&&	-o     或		||if [ $v –ne 0 –a $v –lt 2 ] 等价 if [ $v –ne 0 ] && [ $v –lt 2 ]if [ $v –ne 0 –o $v –lt 2 ] 等价 if [ $v –ne 0 ] || [ $v –lt 2 ]条件判断部分可能会变得很长，一个优化的小技巧是利用&&和||运算符。```
if conditionthen    command1else	command2fi``````[ condition ] && command1 || command2```这样就用一行代替了上面的5行而实现的功能完全相同。如果命令有多个，可以用{}括起来，当做一个命令块。
这样可以使判断语句变得非常简洁。#### 1.10 &&、||cmd1 && cmd2表示，当cmd1执行成功后，就执行cmd2，否则不执行。cmd1 || cmd2表示，当cmd1执行失败后，就执行cmd2，否则不执行。### 2.变量
#### 2.1 系统变量
$n      该变量与脚本被激活时所带的参数相对应。n是正整数，与参数位置相对应($1,$2...) $?      前一个命令执行后的退出状态$#      提供脚本的参数号$*      所有这些参数都被双引号引住。若一个脚本接收两个参数，$*等于$1$2 $0      正在被执行命令的名字。对于shell脚本而言，这是被激活命令的路径$@      所有这些参数都分别被双引号引住。若一个脚本接收到两个参数，$@等价于$1$2$$      当前shell的进程号。对于shell脚本，这是其正在执行时的进程ID$!      前一个后台命令的进程号
#### 2.2	普通变量1)	赋值：var=value2)	#获取字符串的长度。len=${#var}3)	数值运算：letlet命令后面的变量不用带$，如：nu=10;let nu+=10;	#nu=20但这个命令不能进行浮点数的运算。4)	浮点数运算：bcecho "4 * 0.6" | bcbc是一个强大的计算器，还可以进项如下操作：
设定小数精度，`scale=2,eg:echo "scale=2;3 / 8" | bc`\#.37  这是bc的特性，小于0的数，是不显示小数点前的0的。	
进制转换。用ibase设定输入数字的进制，obase设定输出数字的进制。
```no=10echo "obase=2;ibase=10;$no" | bc   #1010```计算平方以及平方根。
```echo "10^4" | bc		#1000	平方echo "sqrt(100)" | bc 	#10		平方根```#### 2.3 IFS全称是Internal Field Separtor，内部分隔符。Shell 的环境变量分为 set, env 两种，其中 set 变量可以通过 export 工具导入到 env 变量中。其中，set 是显示设置shell变量，仅在本 shell 中有效；env 是显示设置用户环境变量 ，仅在当前会话中有效。换句话说，set 变量里包含了 env 变量，但 set 变量不一定都是 env 变量。这两种变量不同之处在于变量的作用域不同。显然，env 变量的作用域要大些，它可以在 subshell 中使用。
而 IFS 是一种 set 变量，当 shell 处理"命令替换"和"参数替换"时，shell 根据 IFS 的值，默认是 space, tab, newline 来拆解读入的变量，然后对特殊字符进行处理，最后重新组合赋值给该变量。```
eg：$ cat test.txt123$ out=$(cat test.txt)$ echo $out1 2 3			#shell将(cat test.txt)的结果拆解，并用默认的分隔符（空格）重新组合，赋值给out，因此echo $out的结果不包含换行。```如果要保留cat test.txt中的换行符，一般情况下要做两步：1是，设定IFS为换行：IFS='\n'2是，将$(cat test.txt)用双引号引起来，表示不用若指定IFS为换行符。#### 2.4 UID特殊的环境变量，如果UID=0，表示当前以root用户运行脚本。否则不是root### 3.自增Linux Shell中写循环时，常常要用到变量的自增，现在总结一下整型变量自增的方法。```
1)	i=`expr $i + 1`;2)	let i+=1;3)	((i++));	#双括号结构http://www.cnblogs.com/chengmo/archive/2010/10/19/1855577.html4)	i=$[$i+1];5)	i=$(( $i + 1 ))```### 4.双括号结构(())双括号结构是对shell中算数及赋值运算的扩展。语法：((表达式1,表达式2…))特点：1)	在双括号结构中，所有表达式可以像c语言一样，如：a++,b--等。2)	在双括号结构中，所有变量可以不加入：“$”符号前缀。3)	双括号可以进行逻辑运算，四则运算.eg. echo $((a>1?2:3));注意四则运算中仍然不支持浮点数运算4)	支持多个表达式运算，各个表达式之间用“，”分开. eg:((a+1,b++,c++))5)	双括号结构 扩展了for，while,if条件测试运算
### 5.数组1)	取数组长度 – '#'```arr=(1 2 3 4 5)len=${#arr[@]}```2)	打印特定索引的数组元素
```echo ${arr[2]}		#2```3)	打印出数组中的所有值-'*'、'@'
```echo ${arr[*]}echo ${arr[@]}```### 6.关联数组在关联数组中，可以用任意的文本作为数组索引。先声明才能使用1)	声明一个关联数组。
```declare –A ass_array```2)	赋值：```a)	ass_array=([index1]=val1 [index2]=val2)b)	ass_array[index1]=val1ass_array[index2]=val2
```3)	`echo ${ass_array[index1]}`4)	列出数组索引：`echo ${!ass_array[@]}`
### 7.临时文件或目录在shell脚本中经常要保存临时的数据，如果使用认为创建临时文件用户保存临时数据，则有可能出现重名的情况，导致覆盖原来的数据。mktemp prefile.xxx	创建以prefile开头的随机文件文件，并返回文件名，指定前缀时必须包含至少3个xxx。主要参数：
```
-d	：	创建一个目录，dirname=`mktemp -d`-u	:	仅生成随机文件名，但不创建实际的文件或目录，tmpfile=`mktemp -u````