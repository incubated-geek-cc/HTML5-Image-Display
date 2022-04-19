function resizeImgRow() {
    let detailsCard=document.getElementById('detailsCard');
    let imgRow=document.getElementById('imgRow');
    imgRow['style']['height']=`${(529-detailsCard.clientHeight)}px`;
}
resizeImgRow();
window.addEventListener('resize', () => {
    resizeImgRow();
}, false);

var colorDepth=document.getElementById('colorDepth');
colorDepth.innerHTML=screen.colorDepth;
var colorResolution=document.getElementById('colorResolution');
colorResolution.innerHTML=screen.pixelDepth;

var availDimensions=document.getElementById('availDimensions');
availDimensions.innerHTML=`${screen.availWidth} × ${screen.availHeight}`;

var screenDimensions=document.getElementById('screenDimensions');
screenDimensions.innerHTML=`${screen.width} × ${screen.height}`;

window.devicePixelRatio = 3.0;
var scale = window.devicePixelRatio;

var _ZOOM_FACTOR=1.0;

var imgH = 0;
var imgW = 0;

const byteToKBScale = 0.0009765625;

var pixelDensity=document.getElementById('pixelDensity');
pixelDensity.innerHTML=scale;

var uploadImgBtn=document.getElementById('uploadImgBtn');
var uploadImg=document.getElementById('uploadImg');


var imgCard=document.getElementById('imgCard');
var canvasCard=document.getElementById('canvasCard');
var cssDIVCard=document.getElementById('cssDIVCard');

uploadImgBtn.addEventListener('click', (evt)=> {
    uploadImg.click();
}, false);

const monthsAbbr=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const millisecondsToDateStr = (milliseconds) => { // in milliseconds
    const dateObject = new Date(milliseconds);

    const dateYear= dateObject.getFullYear();
    const dateMth= monthsAbbr[dateObject.getMonth()];
    const dateDay= ((dateObject.getDate())<10) ? `0${(dateObject.getDate())}` : (dateObject.getDate());

    const humanDateFormat = `${dateDay} ${dateMth} ${dateYear}`;

    return humanDateFormat;
};

const loadImage = (url) => new Promise((resolve, reject) => {
  const img = new Image();
  img.addEventListener('load', () => resolve(img));
  img.addEventListener('error', (err) => reject(err));
  img.src = url;
});

function readFileAsDataURL(file) {
    return new Promise((resolve,reject) => {
        let fileredr = new FileReader();
        fileredr.onload = () => resolve(fileredr.result);
        fileredr.onerror = () => reject(fileredr);
        fileredr.readAsDataURL(file);
    });
}

var fileName=document.getElementById('fileName');
var fileSize=document.getElementById('fileSize');
var imgDimensions=document.getElementById('imgDimensions');
var fileType=document.getElementById('fileType');
var lastModified=document.getElementById('lastModified');

function scaleCanvas(_CANVAS, _IMG, _ZOOM_FACTOR,imgH, imgW, scale) {
    _CANVAS['style']['height'] = `${imgH}px`;
    _CANVAS['style']['width'] = `${imgW}px`;

    let cWidth=_ZOOM_FACTOR*imgW*scale;
    let cHeight=_ZOOM_FACTOR*imgH*scale;

    _CANVAS.width=cWidth;
    _CANVAS.height=cHeight;

    _CANVAS.getContext('2d').scale(scale, scale);
    _CANVAS.getContext('2d').drawImage(_IMG, 0, 0, imgW*_ZOOM_FACTOR, imgH*_ZOOM_FACTOR);
}

uploadImg.addEventListener('change', async(evt) => {
    let file = evt.target.files[0];
    if(!file) return;

    fileName.innerHTML=file.name;
    fileSize.innerHTML=`${(parseFloat(file.size) * byteToKBScale).toFixed(2)} 🇰🇧`;
    fileType.innerHTML=file.type;
    lastModified.innerHTML=millisecondsToDateStr(file.lastModified);

    let b64str = await readFileAsDataURL(file);
    let _IMG=await loadImage(b64str);
    
    // set sizes in memory
    imgH=_IMG.naturalHeight;
    imgW=_IMG.naturalWidth;
    imgDimensions.innerHTML=`${imgW}px × ${imgH}px`;

    _IMG['style']['height']=`${imgH}px`;
    _IMG['style']['width']=`${imgW}px`;
    _IMG['style']['border'] ='1px solid #d3d3d3';
    _IMG.id='imgUpload';
    imgCard.appendChild(_IMG);
    
    let _CANVAS=document.createElement('canvas');
    _CANVAS['style']['border'] ='1px solid #d3d3d3';
    _CANVAS.id='imgCanvas';
    scaleCanvas(_CANVAS,_IMG,_ZOOM_FACTOR,imgH,imgW,scale);
    canvasCard.appendChild(_CANVAS);

    // display size
    let requiredWidth=(canvasCard.clientWidth-16);
    _ZOOM_FACTOR=requiredWidth/parseFloat(_CANVAS['style']['width'].replace('px',''));

    imgH =_ZOOM_FACTOR*parseFloat(_IMG['style']['height'].replace('px',''));
    imgW =_ZOOM_FACTOR*parseFloat(_IMG['style']['width'].replace('px',''));

    _IMG['style']['height'] = `${imgH}px`;
    _IMG['style']['width'] = `${imgW}px`;
    
    cssDIVCard['style']['height'] = `${imgH}px`;
    cssDIVCard['style']['width'] = `${imgW}px`;
    cssDIVCard['style']['border'] ='1px solid #d3d3d3';

    cssDIVCard['style']['background-image']='url('+b64str+')';
    cssDIVCard['style']['background-position']='center';
    cssDIVCard['style']['background-repeat']='no-repeat';
    cssDIVCard['style']['background-size']='contain';

    scaleCanvas(_CANVAS,_IMG,_ZOOM_FACTOR,imgH,imgW,scale);
}, false);