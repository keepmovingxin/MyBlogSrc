---
title: Linux常用命令学习
date: 2016-04-28 16:02:52
tags: Linux
categories: 工具/效率
toc: true
qrcode: true
---

### 同步时间
以管理员身份执行如下命令，可以自动与网络时间同步：
time.nist.gov 是一个时间服务器`$ rdate -s time.nist.gov`<!--more-->### 管道符： |
就是把前面的命令运行的要放入标准输出的结果丢给后面的命令`cat 1.txt | cat`
### 正则表达式由一般字符和特殊字符（meta字符）组成meta元字符	\ 通常用于打开或关闭后续字符的特殊含义，如\(...\)与\{...\}	. 匹配任何单个字符（除NULL）	\* 匹配前面的子表达式任意次，例：a* 匹配任意多个a	? 匹配前面的子表达式零次或一次匹配前面的子表达式一次或多次。	\+ 匹配前面的子表达式一次或多次	^ 匹配输入字符串的开始位置	$ 匹配输入字符串的结束位置	[] 匹配方括号内的任一字符，其中可用连字符（-）指的连续字符的范围；^符号若出现在方括号的第一个位置，则表示匹配不在列表中的任一字符	(x|y) 匹配x或y，比如：(g|f)ood，匹配good或food### 文件通配符
	\* 匹配文件名中的任何字符串，包括空字符串。	? 匹配文件名中的任何单个字符。	[...] 匹配[ ]中所包含的任何字符。可以用 – 连接，表示范围	[!...] 匹配[ ]中非 感叹号！之后的字符。如：
	5* 5开头的所有字符串	*5 5结尾的所有字符串	*5? 以5为倒数第二个字符的字符串	[0－9] 所有以数字的字符	[1,2] 1或者2	[!0-9] 不是数字的字符### echo 打印
	-n	打印语句后不会换行。	-e 开启转义，即可以打印后面的 \t,\r 等转义字符	可以打印彩色文本。
### printf 格式化输出用于格式化输出，使用的参数和C语言中的printf函数一样eg：printf "%-5s %-10s %-4.2f\n" 1 James 80.9968	-：表示左对齐，默认为右对齐	s：表示打印的是字符串	f：表示打印一个浮点数，其中4表示宽度，.2表示保留2位小数printf默认不带换行，需要手动添加
### cat 查看文件	-n：为每行前面加上行号。-n会为空白行也加上行号，-b选项则会跳过空白行。	-s：压缩相邻的空白行，即连续的空白行将压缩为一行。	-T：用^I符号表示制表符\t### grep 匹配
grep [options] [表达式]1)	[options]列表：	-c	：只输出匹配行的统计数	-n	：显示匹配行及行号	-A2	：列出匹配行及下面2行	-B2	：列出匹配行及上面2行	-C2	：列出匹配行及上下2行	-I	：不区分大小写(只适用于单字符)	-h	：查询多文件时不显示文件名	-H	：查询多文件时显示文件名（默认）	-l	：查询多文件时只输出包含匹配字符的文件名	-o	: 每行只输出匹配部分	-s	：不显示不存在或无匹配文本的错误信息	-v	：显示不包含匹配文本的所有行	-r	：递归匹配目录下所有文件及目录	-E	: 扩展grep，增加了额外的正则表达式元字符集	-e	：指定多个匹配样式，样式间“或”的关系	-f pattern_file	：	样式文件pattern_file中逐行存放要匹配的样式，可匹配多个样式，样式之间是“或”的关系	--color	：	为匹配项显示不同颜色
2)	`grep –E "pattern1|pattern2" files` ：显示匹配 pattern1 或 pattern2 的行3)	`grep –e pattern1 –e pattern2 files` : 匹配pattern1或pattern24)	`grep pattern1 files | grep pattern2` ：显示既匹配 pattern1 又匹配 pattern2 的行5)	`egrep "t_hero|t_item"`   匹配t_hero或者t_item的项6)	`grep "t_hero\|t_item"`	可以实现与上面同样的功能### sed 处理内容`sed [options] 'command' file(s) 或sed [options] -f scriptfile file(s)`一次处理一行内容 不改变文件内容[options]列表：
	-n	:	取消默认的输出,使用安静(silent)模式。	-r	:	使用正则表达式，及表达式中不需要进行转义	-f filename :	指定sed脚本的文件名filename	-e '' :	允许多重编辑·  	-i	:	将替换结果应用于源文件1)	替换字符串`sed 's/pattern/string/' file`或者`cat file | sed 's/pattern/string/'`2)	替换文件中所有匹配内容，使用参数g`sed 's/pattern/string/g' file`但如果你想从第N处匹配开始替换，可以使用参数/Ng`$ echo thisthisthisthis | sed 's/this/THIS/2g'thisTHISTHISTHIS`3)	sed的定界符'/'.当匹配模式中含有'/'字符时，我们需要用'\'对定界符'/'进行转义`$ echo a/b | sed 's/a\/b/a*b/'a*b`为了避免转义字符造成的理解困难，我们可以使用其它定界符，比如|,:,@,#,$,%,+等等`$ echo a/b | sed 's:a/b:a*b:'a*b`4)	移除匹配样式行  `sed '/pattern/d' file``$ sed -r '/^ *$/d' args.txt		#移除空白行，含有一个或多个空格的行`5)	组合多个表达式```
$ echo abd | sed 's/a/A/' | sed 's/d/D/'  #用管道组合$ echo abd | sed 's/a/A/;s/d/D/'           #用分号组合$ echo abd | sed -e 's/a/A/' -e 's/d/D/'  #用-e选项组合```6)	已匹配字符串标记（&）&代表匹配给定样式的字符串，常用于对给定样式增加[]，{}等不需要改变样式的情况```$ echo "this is an example" | sed 's/\w\+/[&]/g'   #\w\+ 匹配每个单词[this] [is] [an] [example]
```7)	子串匹配标记（\1）有时我们希望对匹配给定的样式标记出一些子串来，方便后续引用\(pattern\) 用于匹配子串pattern\1 用于引用第一个匹配到的子串，\n 对应第n个匹配到的子串。```$ echo 123 asd | sed 's/\([0-9]\+\) \([a-z]\+\)/\2+\1/' asd+123
```其中\1对应数字123，\2对应字母asd对于子串的引用，在样式里一定要用\(\)括起来，如果加上-r选项，则不需要转义：```$ echo 123 asd | sed -r 's/([0-9]+) ([a-z]+)/\2+\1/'asd+123```8)	引用在脚本中有用的一点，用双引号引用的sed表达式，会对表达式求值来进行扩展，如使用前面定义的变量等```$ text=hello$ echo hello world | sed "s/$text/HELLO/"HELLO world```

### tail 查看文件用于显示指定文件末尾内容，不指定文件时，作为输入信息进行处理。常用查看日志文件主要参数	-f ：	循环读取   #可以用在监控线上有没有报错信息	-q ：	不显示处理信息	-v ：	显示详细的处理信息	-c<数目> ：	显示的字节数	-n<行数> ：	显示行数	--pid=PID ：	与-f合用,表示在进程ID,PID死掉之后结束. 	-q, --quiet, --silent ：	从不输出给出文件名的首部### find 查找
`find dir [option] 'command'`
`dir`: 目录名，用空格隔开多个目录
1) [option]列表：

	-name wildcard 文件名，wildcard表示通配符，并非正则式
	    find dir1 dir2 -name '*.c' –print  在目录dir1和dir2中查找文件，并打印路径
	    如果在-name后面紧跟一个-prune，则表示此目录应被修剪
	    find . \( -name ".svn" -prune \) -o –print 表示对于查找的目录，要么修剪掉（.svn），要么打印出来（其他）。
	-iname 忽略名字大小写
	-path 指定目录，如果在-path前面加上 ！ ，则表示忽略此目录，目录名可以使用通配符匹配。
	-type 文件类型
  	  f:普通文件 d:目录 l:符号连接文件 c:字符设备文件 b:块设备文件 p:管道文件
	-size ±nc 查找大于（+）或小于（-）n字节的文件，注意c（charter）
	-mtime ±ndays 文件最近修改时间
	-user,-nouser 文件所有者
	-group,-nogroup 指定文件用户组
	多条件的与（-a）/或（-o）/非（！）
  	  find . \( -name "*.txt" –o –name "*.sh" \) –print
  	  括号两边应该有空格
	-maxdepth n 指定最大目录深度，n=1表示最大为当前目录
	-mindepth n 指定最小目录深度，n=2表示不打印当前目录下的文件
	  -maxdepth和-mindepth应作为find的第三个参数出现，以提高效率

2) 'command'命令列表：

	-print  打印路径名
	-delete 对找到的文件进行删除 
	-exec   对查找到的目标执行某一命令。
	    find ${workdir} -name "$filename" -exec  |grep $uid
 	   -exec 参数后面跟的是bash命令，但只能跟一个命令，如果想执行多个命令，那么可以将多个命令放进一个shell脚本，然后执行这个脚本。
	    bash命令的终止，使用 ';' (分号）来判定，在后面必须有一个 ';'在分号前应该加上转义字符'\'
	    '{}'，使用{}来表示文件名，也就是find前面处理过程中过滤出来的文件，用于bash命令进行处理
	-ok     与-exec类似，只是对查找到符合条件的目标执行一个命令前需要经过确认
### cut 剪切
`cut` 命令从文件的每一行剪切字节、字符和字段并将这些字节、字符和字段写至标准输出，必须指定 `-b`、`-c` 或`-f` 标志之一。
主要参数

	-b: 以字节为单位进行分割。这些字节位置将忽略多字节字符边界，除非也指定了 -n 标志。
	-c: 以字符为单位进行分割。（单个字母等）
	    cut –c2-5 file	，表示将文件file每行的第2-5个字符作为一列显示出来。
	-d: 自定义分隔符，默认为制表符。
	-f: 与-d一起使用，指定显示哪个区域。
	    例子：cat file.txt | cut -d']' -f7；
            cat file.txt | cut -d']' –f4,7；//打印4和7列
            cat file.txt | cut -d']' –f4-7；//打印4到7列
	-n: 取消分割多字节字符。仅和 -b 标志一起使用。如果字符的最后一个字节落在由 -b 标志的 List 参数指示的<br />范围之内，该字符将被写出；否则，该字符将被排除。
	--complement: 与-f一起使用，指定显示哪个区域的补集。

### sort 排序
`sort`将文件的每一行作为一个单位，相互比较，比较原则是从首字符向后，依次按`ASCII`码值进行比较，最后将他们按升序输出。
主要参数：

	-u: 去除重复行
	-r: sort默认的排序方式是升序，如果想改成降序，用此参数
	-o file: 把排序结果输出到文件file，file可以是原文件
	-n: 以数值排序
	-t: 指定间隔符
	-k: 指定域排序，常与-t连用。sort –t ':' –k 2
		在指定域的时候还可细分，比如指定第二个域的第3个字符开始比较，用-k 2.3;
		比如指定第二个域的第3个字符到第二个域的第5个字符进行排序，用-k 2.3,2.5
		比如只指定第二个域的第3个字符进行排序，用-k 2.3,2.3
	-b: 忽略每一行前面的所有空白部分，从第一个可见字符开始比较
	-f: 忽略大小写进行排序
	### uniq 去重

	-c : 统计重复的行数
	-u : 只显示不重复的那些行
	-d : 只显示重复的那些行
	-s n : 指定跳过前n个字符
	-w n : 指定用于比较的最大字符数

### wc 统计
使用wc的各种选项来统计行数、单词数和字符数。
主要参数：

	-l ：行数
	-w ：单词数
	-c ：字符数

### seq 产生整数
`seq A B`: 用于产生从某个数到另外一个数之间的所有整数
主要参数：

	-f：指定格式。默认是"%g"，表示按宽度为1输出。可以在g的前面加入一些字符，表示不同的含义，如：
	   %2g：表示按宽度为2右对齐。
	   %02g：表示按宽度为2右对齐，不足的部分用0补足。

可用于构造日志文件名

	for i in `seq -f "log.20160407"%02g 5 12`; do echo $i; done
	   str%03g：表示按宽度为3右对齐，补足的位数用0补，并在前面加上str子串。
	    %-3g：表示按宽度为3左对齐。

### mkdir 创建目录
常用参数：

	-p: 可以是一个路径名称。此时若路径中的某些目录尚不存在，加上此选项后,系统将自动建立好那些尚不存在的目录，即一次可以建立多个目录;
	-m <777>: 模式，设定权限<模式>
	-v: 在创建目录的同时输出信息。

### date 时间
1) 显示时间

	date [OPTION]... [+FORMAT]
	date "+%Y-%m-%d %H:%M:%S"  #显示当前的年月日时分秒
2) 设置时间

	date -s //设置当前时间，只有root权限才能设置，其他只能查看。
	date -s 20080523 //设置成20080523，这样会把具体时间设置成空00:00:00
	date -s 15:20:30 //设置时间
	date +%s //当前时间时间戳
3) 转换时间
把linux下的时间戳转换成现实中的年月日时分秒

	date –d @timestamp
	eg:$date -d @1433087999
 	2015年 05月 31日 星期日 23:59:59 CST

### md5sum MD5
MD5全称是报文摘要算法（Message-Digest Algorithm 5），此算法对任意长度的信息逐位进行计算，产生一个二进制长度为128位（十六进制长度32位）的“指纹”（或称“报文摘要”），即使两个文件只相差一个字符，产生的校验和也完全不同。
1) 使用md5sum来产生指纹（报文摘要）命令如下：
 	`md5sum file > file.md5`
若不指定文件名，则从标准输入读取，也可输出到标准输出设备，因此可与管道符“|”连用。
 可以使用文件通配符，将多个文件的md5值输出到同一个文件。
文件file.md5的内容如下：
  	`c0e207c045c344ebf363c3e9a6de1076  file`
 第一列是md5校验和，第二列是对应文件名。
2) 使用md5报文摘要验证文件。
将生成的file.md5文件放在对应file文件的同一目录下。使用如下命令验证：
 	`md5sum -c file.md5`
若验证成功，输出“file: 确定”；验证失败则输出“file: 失败”，并打印警告信息：“md5sum: 警告：1/1 生成的校验和不匹配”。

### ln 链接
主要参数：

 	-f : 链结时先将与 dist 同档名的档案删除
 	-d : 允许系统管理者硬链结自己的目录
 	-i : 在删除与 dist 同档名的档案时先进行询问
 	-n : 在进行软连结时，将 dist 视为一般的档案
 	-s : 进行软链结(symbolic link)
 	 	ln –s target new
 	 	为target文件建立一个软链接new指向target
 	-v : 在连结之前显示其档名
 	-b : 将在链结时会被覆写或删除的档案进行备份
 	-S SUFFIX : 将备份的档案都加上 SUFFIX 的字尾
 	-V METHOD : 指定备份的方式
 	--help : 显示辅助说明
 	--version : 显示版本

### split 大文件切割
 `split -b 500m file newfile_prefix`

 	-l：行数，指定每多少行切成一个小文件。
 	-b：指定每多少字就要切成一个小文件。支持单位:m,k
 	-C：与-b参数类似，但切割时尽量维持每行的完整性。
 	-d：指定切割后的文件名以数字作为后缀

合并： `cat newfile_prefix* > newfile`

### alias 别名
`alias myssh=’sh filename.sh’`

### chmod 权限
使用chmod命令设置文件权限。
`chmod a+x file`

 	u ： 指定用户权限
 	g ： 指定用户组权限
 	o ： 指定其他用户权限
 	a ： 指定所有类别
 	+ ： 增加权限
 	- ： 删除权限
 	r ： 可读
 	w ： 可写
 	x ： 可执行，对目录文件来说表示可访问目录中的文件和子目录

### vim 文本编辑工具
`vimdiff` 文本差异对比
`vimdiff  FILE_LEFT  FILE_RIGHT`
常用命令：

 	Ctrl-w K 把当前窗口移到最上边
 	Ctrl-w H 把当前窗口移到最左边
 	Ctrl-w J 把当前窗口移到最下边
 	Ctrl-w L 把当前窗口移到最右边
 	Ctrl-w,w  在两个文件之间来回跳转
 	]c   跳转到下一差异点
 	[c   跳转到上一差异点，可在前面加上数字，表示跳转多少个差异
 	dp(diff put) 把一个差异点中当前文件的内容复制到另一个文件中
 	do(diff get) 另一个文件的内容复制到当前行中
 	:diffupdate 手工来刷新比较结果
 	zo(folding open) 展开被折叠的相同的文本行
 	zc(folding close) 重新折叠

### paste 拼接
用paste命令实现按列拼接。
`$ paste file1 file2 file3...`
参数：
`-d：指定定界符`

### ls 列出目录
以下是几种方法列出当前路径下的目录。

 	ls –d */
 	ls –F | grep "/$"
 	ls –l | grep "^d"
 	find . –type d –maxdepth 1 –print


### jps 显示java进程
显示当前系统的java进程情况，及其id号。我们可以通过它来查看我们到底启动了几个java进程（因为每一个java程序都会独占一个java虚拟机实例），和他们的进程号（为下面几个程序做准备），并可通过opt来查看这些进程的详细启动参数。
主要参数：

 	-q 只显示pid，不显示class名称,jar文件名和传递给main 方法的参数
 	-m 输出传递给main 方法的参数，在嵌入式jvm上可能是null
 	-l 输出应用程序main class的完整package名 或者 应用程序的jar文件完整路径名
 	-v 输出传递给JVM的参数### xargs 参数传递
`xargs [-0opt] [-E eofstr] [-I replstr [-R replacements]] [-J replstr] [-L number] [-n number [-x]] [-P maxprocs] [-s size] [utility [argument ...]]`
给其他命令传递参数的一个过滤器，也是组合多个命令的一个工具。
最经典应用模式：  `somecommand | xargs -item  command`  
不带`command`，默认的使用`echo`输出

用途：
1.构造参数列表并运行命令，即将接收的参数传递给后面的`command`命令执行
2.将多行输入转换为单行（特殊功效）

优点：
1.将输入参数整理后，去除`<newline>`换行符，以一个列表形式处理
2.避免参数过长引发的问题，使用`xargs -n` 参数适当控制，对于经常产生大量输出的命令如`find`、`locate`和`grep`来说非常有用

`-item` 代表选项:

 	-0      当sdtin含有特殊字元时候，将其当成一般字符，想/'空格等
 	-a file 从文件中读入作为sdtin
 	-e flag 注意有的时候可能会是-E，flag必须是一个以空格分隔的标志，当xargs分析到含有flag这个标志的时候就停止。
 	-E EOF  指定输入结束符
 	-n num  后面加次数，表示命令在执行的时候一次用的argument的个数，默认是用所有的。
 	-p      操作具有可交互性，每次执行comand都交互式提示用户选择，当每次执行一个argument的时候询问一次用户
 	-t      表示先打印命令，然后再执行。
 	-i      或者是-I，这得看linux支持了，将xargs的每项名称，一般是一行一行赋值给{}，可以用{}代替。
 	-r      no-run-if-empty 如果没有要处理的参数传递给xargs，xargs 默认是带 空参数运行一次，如果你希望无参数时，停止 xargs，直接退出，使用 -r 选项即可，其可以防止xargs 后面命令带空参数运行报错。
 	-s      num xargs后面那个命令的最大命令行字符数(含空格) 
 	-L      从标准输入一次读取num行送给Command命令 ，-l和-L功能一样
 	-d delim 分隔符，默认的xargs分隔符是回车，argument的分隔符是空格，这里修改的是xargs的分隔符
 	-x      exit的意思，如果有任何 Command 行大于 -s Size 标志指定的字节数，停止运行 xargs 命令，-L -I -n 默认打开-x参数，主要是配合-s使用
 	-P      修改最大的进程数，默认是1，为0时候为as many as it can.### which 查看可执行文件的位置**功能说明**：查找可执行文件。
**语　　法**：which [文件...]
**补充说明**：which指令会在环境变量$PATH设置的目录里查找符合条件的文件。
**参　　数**：

 	-n<文件名长度> 　指定文件名长度，指定的长度必须大于或等于所有文件中最长的文件名。
 	-p<文件名长度> 　与-n参数相同，但此处的<文件名长度>包括了文件的路径。
 	-w 　指定输出时栏位的宽度。
 	-V 　显示版本信息
### whereis 查看文件的位置 **功能说明**：查找文件。
**语　　法**：whereis [-bfmsu][-B <目录>...][-M <目录>...][-S <目录>...][文件...]
**补充说明**：whereis指令会在特定目录中查找符合条件的文件。这些文件的属性应属于原始代码，二进制文件，或是帮助文件。
**参　　数**：
 	-b 　只查找二进制文件。
 	-B<目录> 　只在设置的目录下查找二进制文件。
 	-f 　不显示文件名前的路径名称。
 	-m 　只查找说明文件。
 	-M<目录> 　只在设置的目录下查找说明文件。
 	-s 　只查找原始代码文件。
 	-S<目录> 　只在设置的目录下查找原始代码文件。
 	-u 　查找不包含指定类型的文件。### zip 压缩
**功能说明**：文件压缩(打包)。
**语　　法**：
`zip -q -r -e -m -o [yourName].zip someThing`
**参　　数**：

	-q 表示不显示压缩进度状态
	-r 表示子目录子文件全部压缩为zip  //这部比较重要，不然的话只有something这个文件夹被压缩，里面的没有被压缩进去
	-e 表示你的压缩文件需要加密，终端会提示你输入密码的
	// 还有种加密方法，这种是直接在命令行里做的，比如zip -r -P Password01! modudu.zip SomeDir, 就直接用Password01!来加密modudu.zip了。
	-m 表示压缩完删除原文件
	-o 表示设置所有被压缩文件的最后修改时间为当前压缩时间

当跨目录的时候是这么操作的
`zip -q -r -e -m -o '\user\someone\someDir\someFile.zip' '\users\someDir'`### scp 远程拷贝
**功能说明**：scp是secure copy的缩写, scp是linux系统下基于ssh登陆进行安全的远程文件拷贝命令。linux的scp命令可以在linux服务器之间复制文件和目录。
**语　　法**：scp [参数] [原路径] [目标路径]**参　　数**：

	-1  强制scp命令使用协议ssh1  
	-2  强制scp命令使用协议ssh2  
	-4  强制scp命令只使用IPv4寻址  
	-6  强制scp命令只使用IPv6寻址  
	-B  使用批处理模式（传输过程中不询问传输口令或短语）  
	-C  允许压缩。（将-C标志传递给ssh，从而打开压缩功能）  
	-p 保留原文件的修改时间，访问时间和访问权限。  
	-q  不显示传输进度条。  
	-r  递归复制整个目录。  
	-v 详细方式显示输出。scp和ssh(1)会显示出整个过程的调试信息。这些信息用于调试连接，验证和配置问题。   
	-c cipher  以cipher将数据传输进行加密，这个选项将直接传递给ssh。   
	-F ssh_config  指定一个替代的ssh配置文件，此参数直接传递给ssh。  
	-i identity_file  从指定文件中读取传输时使用的密钥文件，此参数直接传递给ssh。    
	-l limit  限定用户所能使用的带宽，以Kbit/s为单位。     
	-o ssh_option  如果习惯于使用ssh_config(5)中的参数传递方式，   
	-P port  注意是大写的P, port是指定数据传输用到的端口号   
	-S program  指定加密传输时所使用的程序。此程序必须能够理解ssh(1)的选项。
	
**实　　例**：

1. 从本地服务器复制到远程服务器： 

(1) 复制文件
```
scp local_file remote_username@remote_ip:remote_folder  
或者  
scp local_file remote_username@remote_ip:remote_file  
或者  
scp local_file remote_ip:remote_folder  
或者  
scp local_file remote_ip:remote_file
```
第1,2个指定了用户名，命令执行后需要输入用户密码，第1个仅指定了远程的目录，文件名字不变，第2个指定了文件名  
第3,4个没有指定用户名，命令执行后需要输入用户名和密码，第3个仅指定了远程的目录，文件名字不变，第4个指定了文件名

(2) 复制目录
```
scp -r local_folder remote_username@remote_ip:remote_folder  
或者  
scp -r local_folder remote_ip:remote_folder
```
第1个指定了用户名，命令执行后需要输入用户密码；  
第2个没有指定用户名，命令执行后需要输入用户名和密码；

2. 从远程服务器复制到本地服务器：

(1) 从远处复制文件到本地目录
```
scp root@192.168.120.204:/opt/soft/nginx-0.5.38.tar.gz /opt/soft/
```
说明：
从192.168.120.204机器上的/opt/soft/的目录中下载nginx-0.5.38.tar.gz 文件到本地/opt/soft/目录中

(2) 从远处复制到本地
```
scp -r root@192.168.120.204:/opt/soft/mongodb /opt/soft/
```
说明：
从192.168.120.204机器上的/opt/soft/中下载mongodb 目录到本地的/opt/soft/目录来。

(3) 上传本地文件到远程机器指定目录
```
scp /opt/soft/nginx-0.5.38.tar.gz root@192.168.120.204:/opt/soft/scptest
```说明：
上传本地目录 /opt/soft/mongodb到远程机器192.168.120.204上/opt/soft/scptest的目录中去
	    ### 未完待续...
