require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)
var axios = require('axios')
var apiRouters = express.Router()

apiRouters.get('/getDisc', function (req, res) {
  const url = 'http://ustbhuangyi.com/music/api/getCdInfo'

  axios.get(url, {
    // headers: {
    //   referer: 'https://c.y.qq.com/',
    //   host: 'c.y.qq.com'
    // },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})

apiRouters.get('/getMusicList', function (req, res) {
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  })
  .then((response) => {
    res.json(response.data)
  })
  .catch((error) => {
    console.log(error)
  })
})
apiRouters.get('/lyric', function (req, res) {
  var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  })
  .then((response) => {
    var ret = response.data
    if (typeof ret === 'string') {
      var reg = /{(.*)}/g
      var match = ret.match(reg)
      ret = JSON.parse(match[0])
    }
    res.json(ret)
  })
  .catch((error) => {
    console.log(error)
  })
})

apiRouters.post('/vkey', function (req, res) {
  var url = 'https://u.y.qq.com/cgi-bin/musicu.fcg?_=' + (new Date()).getTime()
  axios.post(url, req.body,
    {
      headers:{
        // contenttype: 'application/x-www-form-urlencoded',
        referer: 'https://y.qq.com/w/toplist.html?ADTAG=myqq&from=myqq&channel=10007100&id=4&type=top',
        origin: 'https://y.qq.com',
        cookie: 'pgv_pvi=1075247104; pt2gguin=o1151524981; RK=ahLxgwyxeU; ptcz=562d3e0d44a5428ef6b9f1b0e409f80ecab0fa848435068ac76f2802c86d0b10; pgv_pvid=9363756000; ts_uid=3830332119; yq_index=0; eas_sid=11D511C826M914O9b6G6Y0x095; LW_sid=w1u5d1G8Q6w9p4g916z6413677; LW_uid=f1Q5E1U8f619n4N9A696V1W6U9; o_cookie=1151524981; pac_uid=1_1151524981; pgv_info=ssid=s2851029072; pgv_si=s4867572736; qqmusic_fromtag=10; yplayer_open=1; yq_playschange=1; player_exist=0; yq_playdata=s_0_1_2; yqq_stat=0; ts_refer=ADTAGmyqq; ts_last=y.qq.com/w/toplist.html',
        // ':authority': 'u.y.qq.com',
        // ':path': '/cgi-bin/musicu.fcg?_=' + (new Date()).getTime()
      }
  })
    .then((response) => {
      res.json(response.data)
    })
    .catch((error) => {
      console.log(error)
    })
})

app.use('/api', apiRouters)
var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({
      action: 'reload'
    })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = {
      target: options
    }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
