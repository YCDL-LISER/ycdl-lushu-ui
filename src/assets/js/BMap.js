export default function MapLoader() {
  return new Promise(((resolve, reject) => {
    if (window.BMap) {
      resolve(window.BMap)
    } else {
      var script = document.createElement('script')
      script.type = "text/javascript"
      script.async = true
      script.src = "http://api.map.baidu.com/api?v=3.0&callback=initBMap&ak=tSiFWPYXfG7iInGZhEfL8ThMMAisdyXQ"
      script.onerror = reject
      document.head.appendChild(script)
    }
    window.initBMap = () => {
      resolve(window.BMap)
    }
  }))
}
