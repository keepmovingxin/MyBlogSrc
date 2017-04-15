# iOS UIImage(置灰)转换成灰色

#### 方法一：

`CGColorSpaceCreateDeviceRGB`创建一个颜色空间引用

```
typedefenum{
	ALPHA =0,
	BLUE =1,
	GREEN =2,
	RED =3
} PIXELS;

- (UIImage*)convertToGrayscale:(UIImage*)source {
	CGSizesize = [sourcesize];
	intwidth = size.width;
	intheight = size.height;
	// the pixels will be painted to this array
	uint32_t*pixels = (uint32_t*)malloc(width * height *sizeof(uint32_t));
	// clear the pixels so any transparency is preserved
	memset(pixels,0, width * height *sizeof(uint32_t));
	//颜色空间DeviceRGB
	CGColorSpaceRefcolorSpace =CGColorSpaceCreateDeviceRGB();
	// create a context with RGBA pixels
	CGContextRefcontext =CGBitmapContextCreate(pixels, width, height,8, width *sizeof(uint32_t), colorSpace,kCGBitmapByteOrder32Little|kCGImageAlphaPremultipliedLast);
	// paint the bitmap to our context which will fill in the pixels array
	CGContextDrawImage(context,CGRectMake(0,0, width, height), source.CGImage);
	for(inty =0; y < height; y++) {
		for(intx =0; x < width; x++) {
			uint8_t*rgbaPixel = (uint8_t*) &pixels[y * width + x];
			// convert to grayscale using recommended method:http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
			uint32_tgray =0.3* rgbaPixel[RED] +0.59* rgbaPixel[GREEN] +0.11* rgbaPixel[BLUE];
			// set the pixels to gray
			rgbaPixel[RED] = gray;
			rgbaPixel[GREEN] = gray;
			rgbaPixel[BLUE] = gray;
		}
	}
	// create a new CGImageRef from our context with the modified pixels
	CGImageRefimage =CGBitmapContextCreateImage(context);
	// we're done with the context, color space, and pixels
	CGContextRelease(context);
	CGColorSpaceRelease(colorSpace);
	free(pixels);
	// make a new UIImage to return
	UIImage*resultUIImage = [UIImageimageWithCGImage:image];
	// we're done with image now too
	CGImageRelease(image);
	return resultUIImage;
}
```

#### 方法二：

`CGColorSpaceCreateDeviceGray`会创建一个设备相关的灰度颜色空间的引用

```
-(UIImage*)createGrayCopy:(UIImage*)source{
	intwidth = source.size.width;
	intheight = source.size.height;
	CGColorSpaceRefcolorSpace = CGColorSpaceCreateDeviceGray();
	CGContextRefcontext = CGBitmapContextCreate(nil,
											width,
											height,
											8,// bits per component
											0,
											colorSpace,
											kCGBitmapByteOrderDefault);
	CGColorSpaceRelease(colorSpace);
	if(context == NULL) {
		return nil;
	}
	CGContextDrawImage(context, CGRectMake(0,0, width, height), source.CGImage);
	UIImage*grayImage = [UIImageimageWithCGImage:CGBitmapContextCreateImage(context)];
	CGContextRelease(context);
	return grayImage;
}
```
