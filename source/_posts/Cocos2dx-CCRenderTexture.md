---
title: Cocos2d-x中动态纹理CCRenderTexture的使用
date: 2016-05-09 22:31:28
tags: Cocos2d-x
categories: 游戏开发
toc: true
qrcode: true
---

记录一下Cocos2d-x中动态纹理`CCRenderTexture`的各种应用，实现截屏、阴影等等
<!--more-->

使用`CCRenderTexture`需要做以下5步:

1. 创建一个新的`CCRenderTexture`. 这里，你可以指定将要创建的纹理的宽度和高度。
2. 调用 `CCRenderTexture:begin`. 这个方法会启动OpenGL，并且接下来，任何绘图的命令都会渲染到`CCRenderTexture`里面去，而不是画到屏幕上。
3. 绘制纹理. 你可以使用原始的`OpenGL`调用来绘图，或者你也可以使用cocos2d对象里面已经定义好的`visit`方法。（这个visit方法就会调用一些opengl命令来绘制cocos2d对象）
4. 调用 `CCRenderTexture:end`. 这个方法会渲染纹理，并且会关闭渲染至`CCRenderTexture`的通道。
5. 从生成的纹理中创建一个`sprite`. 你现在可以用`CCRenderTexture`的`sprite.texture`属性来轻松创建新的精灵了。

### 截取当前屏幕图片
```
--[[
    @des:截取当前屏幕图片
    @ret:截取的图片路径
--]]
function getScreenshots()
    local size = CCDirector:sharedDirector():getWinSize()
    local renderTexture = CCRenderTexture:create(size.width, size.height,kCCTexture2DPixelFormat_RGBA8888)
    renderTexture:getSprite():setAnchorPoint( ccp(0.5,0.5) )
    renderTexture:setPosition( ccp(size.width/2, size.height/2) )
    renderTexture:setAnchorPoint( ccp(0.5,0.5) )

    local runingScene = CCDirector:sharedDirector():getRunningScene()
    renderTexture:begin()
    runingScene:visit()
    renderTexture:endToLua()

    local picPath = CCFileUtils:sharedFileUtils():getWritablePath() .. "tempScreenshots.jpg"
    print("截屏图片:",renderTexture:saveToFile(picPath))
    return picPath
end
```

### 绘制精灵的影子
```
--[[
    @des:根据精灵绘制影子
    @par:pSprite 精灵
    @ret:shadowSprite 精灵影子
--]]
function getShadowSprite( pSprite )
    local size = pSprite:getContentSize()
    local renderTexture = CCRenderTexture:create(size.width, size.height,kCCTexture2DPixelFormat_RGBA8888)
    renderTexture:getSprite():setAnchorPoint( ccp(0.5,0.5) )
    renderTexture:setPosition( ccp(size.width/2, size.height/2) )
    renderTexture:setAnchorPoint( ccp(0.5,0.5) )
    
    renderTexture:beginWithClear(0,0,0,0)
    pSprite:visit()
    renderTexture:endToLua()
    
    local shadowSprite = CCSprite:createWithTexture(renderTexture:getSprite():getTexture())
    return shadowSprite
end
```

### 绘制动态精灵
　　注意，我们这里不是调用的`CCRenderTexture:begin`方法，而是调用另外一个较方便的方法`beginWithClear:g:b:a:`，这个方法可以用给定的颜色来清除纹理的背景，相当于设置画布的颜色。

```
-(CCSprite *)spriteWithColor:(ccColor4F)bgColor textureSize:(float)textureSize {

// 1: Create new CCRenderTexture
CCRenderTexture *rt = [CCRenderTexture renderTextureWithWidth:textureSize height:textureSize];

// 2: Call CCRenderTexture:begin
[rt beginWithClear:bgColor.r g:bgColor.g b:bgColor.b a:bgColor.a];

// 3: Draw into the texture
// We'll add this later

// 4: Call CCRenderTexture:end
[rt end];

// 5: Create a new Sprite from the texture
return [CCSprite spriteWithTexture:rt.sprite.texture];

}

- (ccColor4F)randomBrightColor {
 
    while (true) {
        float requiredBrightness = 192;
        ccColor4B randomColor = 
            ccc4(arc4random() % 255,
                 arc4random() % 255, 
                 arc4random() % 255, 
                 255);
        if (randomColor.r > requiredBrightness || 
            randomColor.g > requiredBrightness ||
            randomColor.b > requiredBrightness) {
            return ccc4FFromccc4B(randomColor);
        }        
    }
 
}
 
- (void)genBackground {
 
    [_background removeFromParentAndCleanup:YES];
 
    ccColor4F bgColor = [self randomBrightColor];
    _background = [self spriteWithColor:bgColor textureWidth:IS_IPHONE_5 ? 1024:512 textureHeight:512];
 
    CGSize winSize = [CCDirector sharedDirector].winSize;
    _background.position = ccp(winSize.width/2, winSize.height/2);        
    [self addChild:_background z:-1];
 
}
 
- (void) onEnter {
    [super onEnter];
    [self genBackground];
    [self setTouchEnabled:YES];
}
 
- (void)ccTouchesBegan:(NSSet *)touches withEvent:(UIEvent *)event {
    [self genBackground];
}
```
　　`randomBrightColor`方法是一个辅助方法，用来创建一种随机颜色。注意，这里使用ccc4B（因此，我们能够在0-255的范围内指定R/G/B/A值），同时确保至少有一个颜色分量是大于192的，这样的话，我们就不会得到较暗的颜色。
　　然后，`genBackground`调用我们之前写的`spriteWithColor`方法，同时把它加屏幕中央。
　　至于`init`函数，它调用`genBackground`方法，同时激活`touches`事件，这样的话，你就可以通过点击屏幕来获得另外的随机背景了。
　　编译并运行，这样你每一次点击屏幕，你都可以得到一张不同的单色背景图片啦！

### 参考链接
[How To Create Dynamic Textures with CCRenderTexture in Cocos2D 2.X](https://www.raywenderlich.com/33266/how-to-create-dynamic-textures-with-ccrendertexture-in-cocos2d-2-x)
[(译)如何使用CCRenderTexture来创建动态纹理](http://www.cnblogs.com/andyque/archive/2011/07/01/2095479.html)


