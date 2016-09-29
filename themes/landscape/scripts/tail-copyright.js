// Add a copyright to every post from copyright.md
// Great for adding copyright info

var fs = require('fs');

hexo.extend.filter.register('before_post_render', function(data){
    if(data.copyright == false || data.title.length < 1) return data;
    var file_content = fs.readFileSync('copyright.md');
    if(file_content && data.content.length > 50) 
    {
        data.content += file_content;
        // var permalink = '\n原文链接：' + data.permalink;
        // data.content += permalink;
    }
    return data;
});