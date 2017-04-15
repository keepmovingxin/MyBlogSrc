# iOS 实现配置/资源文件热更新

**实现思路：在服务器上放一个 `xxx.plist` 里面保存了需要更新的文件名和MD5值，在客户端读取文件的方法里优先读取更新目录下的文件，如果更新目录没有就读取`Resources`下的原始文件，根据比较原始文件和服务器需要的更新文件的MD5值判断是否需要下载文件**

`#define CHECKUPDATEURL   @"http://192.168.1.253:10030/update/xxx.plist"`
#### 1. 给 NSBundle 创建一个分类，扩展以下方法：

```
#pragma mark - NSBundle
@interfaceNSBundle (NSUpdate)
-(NSString *)myResourcePath:(NSString *)files_;
-(NSString*)getDocumentDirectory;
-(NSString*)getFilePath:(NSString*)fileName;
@end

-(NSString*)getFilePath:(NSString*)fileName {

#ifdef RESOURCE_IN_SERVER
    return [self getDocumentResource];
 #endif

    if ([[GXCheckUpdate shareGxCheckUpdate] getUpdateFileExist:fileName]) {

        NSString *resPath = [NSString stringWithFormat:@"%@/%@",[self getDocumentResource],fileName];
         if ([[NSFileManager defaultManager] fileExistsAtPath:resPath]){
             return [self getDocumentResource];
         }
     }

    return [self resourcePath];
}
-(NSString*)getDocumentResource {
#ifdef RESOURCE_IN_SERVER
    return [NSString stringWithFormat:@"%@/Resources/",[self getDocumentDirectory]];
#endif
    NSString *versionStr = [[Helper getInstance] getAppVersion];
    return [NSString stringWithFormat:@"%@/%@/",[self getDocumentDirectory],versionStr];
}
-(NSString *)myResourcePath:(NSString *)files_{
   return [self getPathForResource:files_];
}
```

#### 2.GXCheckUpdate 用于检查更新，在进入APP界面之前调用

```
[[GXCheckUpdate shareGXCheckUpdate] checkUpdateFile]; 检查执行更新

@interface GXCheckUpdate : NSObject{
   NSMutableDictionary *filePathDict;
   NSDictionary        *fileAllDict;
}

@property (nonatomic,retain) NSDictionary *fileAllDict;
+ (GXCheckUpdate *)shareGXCheckUpdate;
-(NSString *)getFilePath:(NSString *)_fileName;
-(BOOL)getUpdateFileExist:(NSString*)file_;
-(void)checkUpdateFile;
@end
```

#### 3.在读取文件的地方使用扩展的获取文件路径的方法

```
NSString *npcPath = [[NSBundle mainBundle] myResourcePath:@"effect/effect"];
```
