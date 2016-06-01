// Add a weichat qrcode to every post from qrcode.md
// Great for adding qrcode info

var fs = require('fs');

hexo.extend.filter.register('before_post_render', function(data){
    if(data.qrcode == false) return data;
    var file_content = fs.readFileSync('qrcode.md');
    if(file_content)
    {
        data.content += file_content;
    }
    return data;
});