---
title: Cocos2d-x使用CCGLProgram和Shader文件实现精灵置灰
date: 2016-04-27 17:47:46
tags: Cocos2d-x
categories: 游戏开发
toc: true
qrcode: true
---

#### 1. 实现方法
`CCGraySprite` 继承自 `CCSprite` 覆盖`initWithTexture`和`draw`方法实现置灰。

##### 方法和属性声明
```
class CCGraySprite : public CCSprite{
public:
    CCGraySprite();
    virtual ~CCGraySprite();
    static CCGraySprite* create(const char* pszFileName);
    bool initWithTexture(CCTexture2D* pTexture, const CCRect& tRect);
    static CCGraySprite* createWithSprite(CCSprite *pSprite);
    static CCGraySprite* createWithNodeAndItChild(CCNode *pNode);
    void setGray(bool isGray);
    virtual void draw();

private:
    bool m_isGray;
    CCGLProgram* pProgram;
};
```
* `m_isGray` 是否置灰
* `pProgram` 保存置灰的GL程序

<!--more-->

#### 2. shader字符串
可以像官方那样写在一个.h文件中

```
GLchar* pszFragSource = (GLchar*)
        "#ifdef GL_ES \n \
        precision mediump float; \n \
        #endif \n \
        uniform sampler2D u_texture; \n \
        varying vec2 v_texCoord; \n \
        varying vec4 v_fragmentColor; \n \
        void main(void) \n \
        { \n \
        // Convert to greyscale using NTSC weightings \n \
        vec4 col = texture2D(u_texture, v_texCoord); \n \
        float grey = dot(col.rgb, vec3(0.299, 0.587, 0.114)); \n \
        gl_FragColor = vec4(grey, grey, grey, col.a); \n \
        }";
```
#### 3. 核心代码
* 覆盖父类的`initWithTexture`和`draw`方法，根据`m_isGray`调用对应GL程序进行渲染绘制精灵


```
void CCGraySprite::setGray(bool isGray) {
    m_isGray = isGray;
    if (isGray == true) {
        this->setShaderProgram(pProgram);
    }else
    {
        this->setShaderProgram(CCShaderCache::sharedShaderCache()->programForKey(kCCShader_PositionTextureColor));
    }
}

bool CCGraySprite::initWithTexture(CCTexture2D* pTexture, const CCRect& tRect ){
    m_isGray = true;
    do{
        CC_BREAK_IF(!CCSprite::initWithTexture(pTexture, tRect));

        GLchar* pszFragSource = (GLchar*)
        "#ifdef GL_ES \n \
        precision mediump float; \n \
        #endif \n \
        uniform sampler2D u_texture; \n \
        varying vec2 v_texCoord; \n \
        varying vec4 v_fragmentColor; \n \
        void main(void) \n \
        { \n \
        // Convert to greyscale using NTSC weightings \n \
        vec4 col = texture2D(u_texture, v_texCoord); \n \
        float grey = dot(col.rgb, vec3(0.299, 0.587, 0.114)); \n \
        gl_FragColor = vec4(grey, grey, grey, col.a); \n \
        }";



        pProgram = new CCGLProgram();
        pProgram->initWithVertexShaderByteArray(ccPositionTextureColor_vert, pszFragSource);
        this->setShaderProgram(pProgram);
        CHECK_GL_ERROR_DEBUG();

        this->getShaderProgram()->addAttribute(kCCAttributeNamePosition, kCCVertexAttrib_Position);
        this->getShaderProgram()->addAttribute(kCCAttributeNameColor, kCCVertexAttrib_Color);
        this->getShaderProgram()->addAttribute(kCCAttributeNameTexCoord, kCCVertexAttrib_TexCoords);
        CHECK_GL_ERROR_DEBUG();

        this->getShaderProgram()->link();
        CHECK_GL_ERROR_DEBUG();

        this->getShaderProgram()->updateUniforms();
        CHECK_GL_ERROR_DEBUG();

        return true;
    } while (0);
    return false;
}

void CCGraySprite::draw(){
    if (this->getTexture() == NULL) {
        return;
    }
    if(m_isGray == false){
        CCSprite::draw();
        return;
    }

    ccGLEnableVertexAttribs(kCCVertexAttribFlag_PosColorTex );
    ccGLBlendFunc( m_sBlendFunc.src, m_sBlendFunc.dst );

    this->getShaderProgram()->use();
    this->getShaderProgram()->setUniformsForBuiltins();

    ccGLBindTexture2D( this->getTexture()->getName() );

	#define kQuadSize sizeof(m_sQuad.bl)
    long offset = (long)&m_sQuad;

    // vertex
    int diff = offsetof( ccV3F_C4B_T2F, vertices);
    glVertexAttribPointer(kCCVertexAttrib_Position, 3, GL_FLOAT, GL_FALSE, kQuadSize, (void*) (offset + diff));

    // texCoods
    diff = offsetof( ccV3F_C4B_T2F, texCoords);
    glVertexAttribPointer(kCCVertexAttrib_TexCoords, 2, GL_FLOAT, GL_FALSE, kQuadSize, (void*)(offset + diff));

    // color
    diff = offsetof( ccV3F_C4B_T2F, colors);
    glVertexAttribPointer(kCCVertexAttrib_Color, 4, GL_UNSIGNED_BYTE, GL_TRUE, kQuadSize, (void*)(offset + diff));
    glDrawArrays(GL_TRIANGLE_STRIP, 0, 4);
    CC_INCREMENT_GL_DRAWS(1);
}
```

#### 4. lua使用示例
* 需手写.pkg文件，使用tolua++工具导出Lua binding文件，在AppDelegate::applicationDidFinishLaunching()注册后，方可在lua层使用

```
local nameBgSp = CCGraySprite:create("images/namebg.png")
```

```
local normalSp = CCSprite:create("images/namebg.png")
local graySp = CCGraySprite:createWithNodeAndItChild(normalSp)
```

```
local frameSp = CCGraySprite:create("images/frame.png")
frameSp:setGray(isGray)
```

