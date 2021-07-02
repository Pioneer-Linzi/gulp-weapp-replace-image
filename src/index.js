const through2 = require("through2");
let fs = require("fs");
const { getPath } = require("./utils");
const {printToFirstLine} = require('./readline')
const del = require("del");
var images = require("images");
const DEFAULTIMAGEREGX = /[\.\/\w\-\:\_]+\.(png|jpg|gif)/gi;

const map = new Map()


/**
 * 通过filePath 来获取 cdn 图片，包含去重逻辑
 * @returns
 */
const getUrl= async function  (uploader,filePath) {
    let url;
    if (!map.has(filePath)) {
      // printToFirstLine(`正在上传文件: ${filePath}`)
      // console.log(`正在上传文件: ${filePath}`)
      images(filePath).save(filePath,{
        quality:50
      })
      url = await uploader(filePath);
      url = url.replace("http://", "https://");
      map.set(filePath, url);
      // console.log(map)
    } else {
      url = map.get(filePath);
    }
    return url;
  };


/**
 * 过滤所有的文件，使用正则过滤文件，并把本地文件上传到cdn上，以减少包体积大小
 * @returns
 */
module.exports = function ({ uploader, imageRegx = DEFAULTIMAGEREGX }) {
  // 创建一个让每个文件通过的 stream 通道
    var stream = through2.obj(async function (file, enc, cb) {
      const arr = filterRes(file, imageRegx);
      if (arr) {
        for (let i = 0; i < arr.length; i++) {
          const item = arr[i];
          const filePath = getPath(item, file.dirname);
          if (fs.existsSync(filePath)||map.has(filePath)) {
            // console.log(`校测到可替换文件:${filePath}`)
            // printToFirstLine(`校测到可替换文件:${filePath}`)
            let url = await getUrl(uploader,filePath);
            file.contents = Buffer.from(
              file.contents.toString().replace(item, url)
            );
             console.table([{
              file: file.path,
              content: item,
              cdn: url
            }]);
            del(filePath)
          }else{
            // console.table([{
            //   file: file.path,
            //   content: item,
            // }]);
          }
        }
      }
      // 确保文件进去下一个插件
      this.push(file);
      // 告诉 stream 转换工作完成
      cb();
    });
  return stream;
};

/**
 * 资源过滤器
 * @param {*} file
 * @returns
 */
function filterRes(file, imageRegx) {
  let arr = file.contents.toString().match(imageRegx);
  arr = arr || [];
  return arr.filter((item) => {
    return item.indexOf("http") < 0;
  });
}
