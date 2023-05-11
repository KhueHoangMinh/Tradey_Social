

var posts = document.getElementsByClassName('user-post')

for(var i = 0; i < posts.length; i++) {
    var image = posts[i].getElementsByClassName('user-image')[0]
    // image.crossOrigin = 'Anonymous'
    var rgb = getAverageRGB(image);
    posts[i].style.backgroundColor = 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')';
}

function getAverageRGB(imgEl) {

var blockSize = 50, // only visit every 5 pixels
    defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
    canvas = document.createElement('canvas'),
    context = canvas.getContext('2d'),
    data, width, height,
    i = -4,
    length,
    rgb = {r:0,g:0,b:0},
    count = 0;
    
if (!context) {
    return defaultRGB;
}

height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

context.drawImage(imgEl, 0, 0);

try {
    data = context.getImageData(0, 0, width, height);
} catch(e) {
    throw{e}
}

length = data.data.length;

while ( (i += blockSize * 4) < length ) {
    ++count;
    rgb.r += data.data[i];
    rgb.g += data.data[i+1];
    rgb.b += data.data[i+2];
}

// ~~ used to floor values
rgb.r = ~~(rgb.r/count*30/100);
rgb.g = ~~(rgb.g/count*30/100);
rgb.b = ~~(rgb.b/count*30/100);

return rgb;

}