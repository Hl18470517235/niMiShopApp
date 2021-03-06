module.exports = {
  // 请求域名 格式： https://您的域名
   HTTP_REQUEST_URL:'https://yjlc.yijialianchuang.com/yjlc/api',
   //HTTP_REQUEST_URL:'https://yjwy.yijialianchuang.com/yjlc/test/api',
  // Socket链接 暂不做配置
  WSS_SERVER_URL:'',
  // 以下配置非开发者，无需修改
  // 请求头
  HEADER:{
    'content-type': 'application/json'
  },
  // Socket调试模式
  SERVER_DEBUG:true,
  // 心跳间隔
  PINGINTERVAL:3000,
  // 回话密钥名称 
  TOKENNAME: 'token',
  //用户信息缓存名称
  CACHE_USERINFO:'USERINFO',
  //token缓存名称
  CACHE_TOKEN:'TOKEN',
  //token过期事件 
  CACHE_EXPIRES_TIME:'EXPIRES_TIME',
  //模板缓存
  CACHE_SUBSCRIBE_MESSAGE:'SUBSCRIBE_MESSAGE',
  //推荐人缓存
  CACHE_SPID: 'SPID'
}