const fs = require('fs')
const path = require('path')

let file = path.resolve(__dirname, './analyse.html')

/**
 * 返回模版
 * @returns html read template
 */
function readTemplate(){
	return new Promise((resolve,reject)=>{
		fs.readFile('./assets/index.html',(err,data)=>{
			if(err) reject(err);
			resolve(data.toString())
		})
	})
}





/**
 * 替换模版并写入文件
 * @param {*} key 
 * @param {*} str 
 */
async function writeAnalyse(tmp){
	return new Promise((resolve,reject)=>{
		fs.writeFile(file,tmp,{ encoding: 'utf8' }, err => {
			if(err) reject(err)
			resolve()
		})
	})
}


module.exports = {
	writeAnalyse,
	readTemplate
}


replaceString('${replacelist}',JSON.stringify([{
	asdfasd: 'asdfas',
	asdfasd: "asdfa"
}]))

