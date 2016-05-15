---
title: Cocos2d-x中动态纹理CCRenderTexture的使用
date: 2016-05-09 22:31:28
tags: Cocos2d-x
categories: 游戏开发
toc: true
---

记录一下Cocos2d-x中动态纹理`CCRenderTexture`的各种应用，实现截屏、阴影等等

使用`CCRenderTexture`需要做以下5步:

1. 创建一个新的`CCRenderTexture`. 这里，你可以指定将要创建的纹理的宽度和高度。
2. 调用 `CCRenderTexture:begin`. 这个方法会启动OpenGL，并且接下来，任何绘图的命令都会渲染到`CCRenderTexture`里面去，而不是画到屏幕上。
3. 绘制纹理. 你可以使用原始的`OpenGL`调用来绘图，或者你也可以使用cocos2d对象里面已经定义好的`visit`方法。（这个visit方法就会调用一些opengl命令来绘制cocos2d对象）
4. 调用 `CCRenderTexture:end`. 这个方法会渲染纹理，并且会关闭渲染至`CCRenderTexture`的通道。
5. 从生成的纹理中创建一个`sprite`. 你现在可以用`CCRenderTexture`的`sprite.texture`属性来轻松创建新的精灵了。

<!--more-->

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
```

### 参考链接：

[(译)如何使用CCRenderTexture来创建动态纹理](http://www.cnblogs.com/andyque/archive/2011/07/01/2095479.html)

[How To Create Dynamic Textures with CCRenderTexture in Cocos2D 2.X](https://www.raywenderlich.com/33266/how-to-create-dynamic-textures-with-ccrendertexture-in-cocos2d-2-x)