# Mac OS 使用技巧

#### 1. 找回 macOS Sierra允许“任何来源” 的应用
如果需要恢复允许“任何来源”的选项，即关闭Gatekeeper，请在终端中使用spctl命令：

`sudo spctl --master-disable`

#### 2. 用预览(Preview)来查看命令手册(manpage)
`man -t cal | open -a Preview -f`

#### 3. 剪切文件
OSX中只有Copy，没有cut，但有移动mv。`Command + C`后，`Command+V+Option`即为移动，效果等于剪切

#### 4. 截图功能 
全屏截图：`shift+command+3`
鼠标截图：`shift+command+4`

#### 5. 查看文件所占空间
`du -sh *` 可以列出当前目录下所有文件或子目录所占空间大小。

#### 6. 播放发音
终端中输入`say xxx`，Mac会播放发音

#### 7. 转换文本编码
`iconv -f GBK -t UTF-8 source.txt \> output.txt`

#### 8. 查找文件
`find path -name "keyword"`
`find path -name "keyword" -exec echo {} \;`

#### 9. 禁止电脑睡眠
`caffeinate -u -t 3600`   #时间单位秒    
`caffeinate -d`   #不指定时间，Control + C 关闭

#### 10. 运行日常维护脚本
`sudo periodic 脚本名 回车`

脚本名应该是`daily`、`weekly`或`monthly`。如果要同时运行三个维护脚本，则可输入：

`sudo periodic daily weekly monthly`


#### 11. 修改Launchpad显示图标数量

```
defaults write com.apple.dock springboard-columns -int 9;
defaults write com.apple.dock springboard-rows -int 9;
defaults write com.apple.dock ResetLaunchPad -bool TRUE;
killall Dock
```
