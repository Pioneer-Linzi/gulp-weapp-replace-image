
//将相对路径转为绝对路径
/**
 * 
 * @param {string} relativePath 相对路径
 * @param {string} absolutePath 文件所在绝对路径目录
 * @returns {string} 文件绝对路径
 */
module.exports = {
	getPath(relativePath, absolutePath) {
		let reg = /\.\.\//g;
		let uplayCount = 0; // 相对路径中返回上层的次数。
		let m = relativePath.match(reg);
		if (m) uplayCount = m.length;
	
		let lastIndex = absolutePath.length - 1;
		let subString = absolutePath.substr(0, lastIndex + 1);
		for (let i = 0; i < uplayCount; i++) {
			lastIndex = subString.lastIndexOf('/', lastIndex);
			subString = subString.substr(0, lastIndex);
		}
		return subString + '/' + relativePath.replace(/(\.\/)?(\.\.\/)?/g, '');
	}
	
} 
