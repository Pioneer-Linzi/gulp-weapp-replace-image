# 自动替换微信小程序中的本地图片为 cdn 地址
## 原由 
一些小程序项目从一开始规划就没有把图片放在cdn上，但小程序迭代过几个版本之后就会发现，日益增长的图片已经达到了小程序中的包大小限制。这个时候就会从分包、减少本地图片来解决，但一个项目中的图片可能都会有上百张的大小。 一个一个的替换这样肯定不是一个程序猿的作风。我的这个gulp的插件就是为了解决这个问题，全自动替换、分分钟搞定你的烦心事。
## 使用
```
	const gulpWeappReplaceImage = require('gulp-weapp-replace-image'

	gulp.task('replace-image',function(){
		return gulp.src(['./**/*.wxml','./**/*.scss','./**/*.wxss','./**/*.js','!./node_modules/**/*.*'])
		.pipe(gulpWeappReplaceImage({uploader: uploader}))
		.pipe(gulp.dest('./'))
	})
	function uploader(filePath){
		return new Promise((resolve,reject)=>{
			// 图片上传
		})
	}

```

然后运行
```
	gulp replace-image
```

## 注意
uploader 上传还是要自己写的，毕竟没有什么免费的云服务，uploader 返回为一个 Promise,***这里还需要注意上传的cdn的域名需要在小程序的后台中配置域名校验***。 上传替换完成之后，会自动删除图片，释放小程序中的包大小。

## 图片替换记录
文件替换完成之后，会在项目根目录下生成一个 analyse.html 包含 已替换的文件& 没有替换的图片，这个是有可能图片已经被移除了，需要自行check一下代码

## 建议
上传图片前需要确认一下自己的图片是否需要压缩，gulp的图片压缩插件比较多，这里就不重复造轮子了。