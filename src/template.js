const fs = require('fs')
const path = require('path')

let file = path.resolve("./", './analyse.html')

/**
 * 返回模版
 * @returns html read template
 */
function readTemplate(){
	return fs.readFileSync(__dirname + '/assets/index.html').toString()
}





/**
 * 替换模版并写入文件
 * @param {*} key 
 * @param {*} str 
 */
async function writeAnalyse(tmp){
	return new Promise((resolve,reject)=>{
		console.log(tmp)
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
