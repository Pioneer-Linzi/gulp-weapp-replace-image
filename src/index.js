const through2 = require("through2");
let fs = require("fs");
const { getPath } = require("./utils");
const del = require('del')
const DEFAULTIMAGEREGX = /[\.\/\w\-\:\_]+\.(png|jpg|gif)/gi;

/**
 * 通过filePath 来获取 cdn 图片，包含去重逻辑
 * @returns
 */
const getUrl = function (uploader) {
  const map = new Map(); // 缓存图片
  return async function (filePath) {
    console.log(filePath)
    let url;
    if (!map.has(filePath)) {
      url = await uploader(filePath);
      url = url.replace("http://", "https://");
      map.set(filePath, url);
    } else {
      url = map.get(filePath);
    }
    return url;
  };
};
/**
 * 过滤所有的文件，使用正则过滤文件，并把本地文件上传到cdn上，以减少包体积大小
 * @returns
 */
module.exports = function ({uploader,imageRegx=DEFAULTIMAGEREGX}) {
  const replaceUrl = [];
  const noReplaceUrl = [];
 
  // 创建一个让每个文件通过的 stream 通道
  try {
  var stream = through2.obj(handle(replaceUrl, noReplaceUrl,imageRegx,uploader));
  } catch (error) {
    console.log(error)
  }

  return stream;
};

function handle(replaceUrl, noReplaceUrl,imageRegx,uploader) {
  const getCDNUrl = getUrl(uploader)

  return async function (file, enc, cb) {
    console.log(file.basename)
    if (file.isStream()) {
      console.log("file.isStream")
    }
    const arr = filterRes(file,imageRegx);
    if (arr) {
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        const filePath = getPath(item, file.dirname);
        if (fs.existsSync(filePath)) {
          // let url = await getCDNUrl(filePath);
          let url = ''
          file.contents = Buffer.from(
            file.contents.toString().replace(item, url)
          );
          replaceUrl.push({
            file: file.filePath,
            content: item,
            cdn: url,
          });
          del(filePath);
          return;
        }
        noReplaceUrl.push({
          file: file.filePath,
          content: item,
        });
      }
    }
    // 确保文件进去下一个插件
    this.push(file);
    // 告诉 stream 转换工作完成
    cb();
  };
}

/**
 * 资源过滤器
 * @param {*} file
 * @returns
 */
function filterRes(file,imageRegx) {
  let arr =  file.contents.toString().match(imageRegx);
  // if(arr){
  //   console.log(arr)
  // }
  arr = arr || []
  return arr.filter((item)=>{
    return item.indexOf('http')<0
  })
}
