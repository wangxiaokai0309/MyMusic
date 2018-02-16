
## 相关

* `Vue` @2.3.3, vue-router, vuex, axios
* `less` (不太习惯 stylus 所以我还是继续使用 less 了)
* `ES6` [standardjs 规范](https://github.com/standard/standard/blob/master/docs/RULES-zhcn.md)
* `Express`
* `jsonp` `axios` `promise`
* ~~~lib-flexbile~~~ `amfe-flexible@2.0`, `px2rem`

* `Vultr/heroku PM2 Nginx`


## 组件

* 基础组件：确认对话框，loading，进度条，搜索框，滚动组件
* 业务组件：歌单详情，播放内核，搜索页面，顶部导航，排行榜等组件
* 上拉刷新，函数防抖动搜索，消除点击延迟，异步路由

## 已完成部分

* [x] /recommand 推荐页：轮播图，推荐歌单列表
* [x] /singer 歌手页列表：歌手列表展示，左右联动，快速入口，类似通讯录
* [x] /singer/:id 歌手详情页：局部滚动，视差，播放音乐，音乐播放器有的功能都有
* [x] /rank/:id 排行页：同上
* [x] /search 搜索：搜索结果，搜索历史，热门搜索，结果播放
* [x] 播放列表页：当前播放队列
* [ ] ~~~用户中心页~~~



## 注意事项

* animation-play-state: paused ios 不支持[解决方案](https://codepen.io/HaoyCn/pen/BZZrLd)
* min-player [进度条实现](https://codepen.io/xgad/post/svg-radial-progress-meters)
* vue@2.5+  [ios 不能播放问题](https://github.com/DDFE/DDFE-blog/issues/24)

## 改进及优化

* QQ 音乐 UI
* 适配优化
* 打包优化

### 打包

* 根据打包后的[分析报告](https://www.npmjs.com/package/webpack-bundle-analyzer)进行优化
* 处理 vendor，一般都是这部分体积大，相关类库一般不会变化，所以单独打包和其它文件一样加上 chunkhash 辨别文件是否变化，同时把 manifest 抽离出来，保证 manifest 变化不影响 vendor 变化导致缓存失效,这样默认就是 304，现在我通过 node 把他设置成强缓存了....外加 gzip
* 采用路由懒加载

## 本地预览

```bash
$ yarn install
$ yarn run dev
```
