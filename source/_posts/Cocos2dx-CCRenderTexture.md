---
title: Cocos2d-x中动态纹理CCRenderTexture的使用
date: 2016-05-09 22:31:28
tags: Cocos2d-x
categories: 游戏开发
toc: true
---

记录一下Cocos2d-x中动态纹理CCRenderTexture的各种应用，实现截屏、阴影等等

### 截取当前屏幕图片
```
--[[
    @des:截取当前屏幕图片
    @ret:截取的图片路径
--]]
function getScreenshots()
    local size = CCDirector:sharedDirector():getWinSize()
    local in_texture = CCRenderTexture:create(size.width, size.height,kCCTexture2DPixelFormat_RGBA8888)
    in_texture:getSprite():setAnchorPoint( ccp(0.5,0.5) )
    in_texture:setPosition( ccp(size.width/2, size.height/2) )
    in_texture:setAnchorPoint( ccp(0.5,0.5) )

    local runingScene = CCDirector:sharedDirector():getRunningScene()
    in_texture:begin()
    runingScene:visit()
    in_texture:endToLua()

    local picPath = CCFileUtils:sharedFileUtils():getWritablePath() .. "shareTempScreenshots.jpg"
    print("截屏图片:",in_texture:saveToFile(picPath))
    return picPath
end
```

<!--more-->

### 绘制精灵的影子

### 绘制动态精灵


### 参考链接：

[(译)如何使用CCRenderTexture来创建动态纹理](http://www.cnblogs.com/andyque/archive/2011/07/01/2095479.html)

[How To Create Dynamic Textures with CCRenderTexture in Cocos2D 2.X](https://www.raywenderlich.com/33266/how-to-create-dynamic-textures-with-ccrendertexture-in-cocos2d-2-x)