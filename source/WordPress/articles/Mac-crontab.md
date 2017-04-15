# Mac OS 使用crontab定时执行某一任务

##### 1. 注意：如果 `/etc/crontab` 不存在，执行：`sudo touch /etc/crontab`
##### 2.  在终端执行:  `crontab -e`
##### 3. vim 输入需要执行的任务

```
Type your cron job, for example:
 \* *  *  *  * 命令
 前面的五个*号，表示分、时、日、月、周，如：
 代表意义 分钟 小时 日期 月份 周
 数字范围 0-59 0-23 1-31 1-12 0-7
 *号代表任何时间都接受的意思，任意。
 *号之间用空格分开，如果是一段范围，用-号连接；如果是隔开几个时间，用,号表示。
 另外，命令必须是编写计划任务的用户有权限执行的，并且最后用绝对路径。
 59 23 1 5 * mail linuxing < /home/test.txt
 每在5月1日，23点59分就把/home/test.txt的内容作为邮件发给linuxing用户
 */5 * * * * /opt/test.sh
 每5分钟就执行一次/opt/test.sh脚本
 0 3,6 * * * /usr/local/bin/test.sh
 每在3点和6点整点都执行/usr/local/bin/test.sh命令
 0 8-12 * * * /root/backup.sh
 8 点到 12 点之间的每小时的0分都执行/root/backup.sh
 Press Esc to exit vim's insert mode
```

##### 4. 验证是否设置成功(查看):  `crontab -l`
