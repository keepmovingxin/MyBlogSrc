# iOS和Android代码中实现禁止手机休眠

### （一）iOS平台

默认，所有iOS设备在过了设定的休眠时间后，都会自动锁屏。如果你的应用不希望iOS设备自动锁屏，需要设置禁止休眠。

代码:

`[[UIApplication sharedApplication] setIdleTimerDisabled: YES];`

或者

`[UIApplication sharedApplication].idleTimerDisabled = YES;`

### （二）Android平台

在开发Android程序时，有时候在程序运行的时候，不能让系统休眠，否则有一些运行会停止，因此我们需要设置禁止休眠，有两种方式：一种是添加权限，别一种是代码中设置，建议使用第一种方式，这样，在安装程序的时候会进行提醒：

#### 1.第一种方式：

在Manifest.xml文件里面用user-permission声明

名称为：`android.permission.WAKE_LOCK`

#### 2.第二种方式：

`getWindow().setFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON, WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);`

把这段代码加在`setContentView(R.layout.main)`之前即可


