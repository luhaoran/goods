export default function Map (key, plugins, v = '1.4.15') {
  return new Promise(function (resolve, reject) {
    if (typeof AMap !== 'undefined') {
      resolve(AMap)
      return true
    }
    window.onCallback = function () {
      resolve(AMap)
    }
    let script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://webapi.amap.com/maps?v=${v}&key=${key}&plugin=${plugins}&callback=onCallback`
    script.onerror = reject
    document.head.appendChild(script)
  })
}