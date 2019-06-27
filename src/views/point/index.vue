<template>
  <div :id="mapId" class="bm-view"/>
</template>

<script>
import { search } from '@/api/point/index.js'
import { wgs84_to_bd09 } from '@/assets/js/gps_utils.js'
import { loadBMap } from '@/assets/js/async-load-bmap.js'

export default {
  name: 'Point',
  data() {
    return {
      mapId: 'BMap-' + parseInt(Date.now() + Math.random()),
      map: null,
      zoom: 11,
      points: [],
      markers: [],
      icon: require('@/assets/images/ic_route_photo.png'),
      currentLocation: null,
      query: {
        keyword: undefined,
        sLng: undefined,
        sLat: undefined,
        eLng: undefined,
        eLat: undefined,
        range: 10
      }
    }
  },
  mounted() {
    this.initMap()

    // 加载百度地图
    // MapLoader().then(BMap => {
    //   console.log('加载地图成功')
    //   this.map = new BMap.Map('container')
    //   const point = new BMap.Point(116.404, 39.915)
    //   this.map.centerAndZoom(point, 15)
    //   this.map.enableScrollWheelZoom() // 启用滚轮放大缩小，默认禁用
    //   this.map.enableContinuousZoom() // 启用地图惯性拖拽，默认禁用
    //   this.map.addControl(new BMap.NavigationControl())
    //   this.map.addControl(new BMap.MapTypeControl())
    // })
  },
  created() {

  },
  methods: {
    initMap() {
      loadBMap('tSiFWPYXfG7iInGZhEfL8ThMMAisdyXQ')
        .then(() => {
          // 百度地图API功能
          this.map = new BMap.Map(this.mapId) // 创建Map实例

          // 添加地图类型控件
          this.map.addControl(
            new BMap.MapTypeControl({
              mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP]
            })
          )
          // this.map.setCurrentCity('北京') // 设置地图显示的城市 此项是必须设置的
          this.map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放

          const that = this
          // 浏览器定位获取当前经纬度坐标
          const geolocation = new BMap.Geolocation()
          // geolocation.getCurrentPosition(function(r) {
          //   if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          //     that.currentLocation = r.point
          //     that.map.centerAndZoom(r.point, that.zoom)
          //     that.query.sLng = r.point.lng
          //     that.query.sLat = r.point.lat
          //     console.log('浏览器定位成功：', r.point)
          //   } else {
          //     console.log('浏览器定位失败：', r)
          //   }
          // })

          // 开启SDK辅助定位
          // geolocation.enableSDKLocation()
          geolocation.getCurrentPosition(function(r) {
            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
              console.log('SDK定位成功：', this)
              that.currentLocation = r.point
              that.map.centerAndZoom(r.point, that.zoom)
              that.query.sLng = r.point.lng
              that.query.sLat = r.point.lat
            } else {
              console.log('SDK定位失败：', this.getStatus())
            }
          })

          // 加载数据
          this.loadPoints()
        })
        .catch(err => {
          console.log('地图加载失败：', err)
        })
    },
    loadPoints() {
      search(this.query).then(response => {
        const { data } = response.data
        const that = this
        data.forEach(value => {
          const location = wgs84_to_bd09(value.lng, value.lat)
          const point = new BMap.Point(location[0], location[1])
          if (that) {
            const marker = this.addMarkerToMap(point)
            that.points.push(point)
            that.markers.push(marker)
          }
        })
        this.map.setViewport(this.points)
        new BMapLib.MarkerClusterer(this.map, { markers: this.markers })
      }).catch(error => {
        console.log('数据加载失败：', error)
      })
    },
    addMarkerToMap(point) {
      const startIcon = new BMap.Icon(this.icon, new BMap.Size(80, 40), {
        // 指定定位位置。
        // 当标注显示在地图上时，其所指向的地理位置距离图标左上
        // 角各偏移10像素和25像素。您可以看到在本例中该位置即是
        // 图标中央下端的尖角位置。
        anchor: new BMap.Size(40, 40),
        // 设置图片偏移。
        // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您
        // 需要指定大图的偏移位置，此做法与css sprites技术类似。
        imageOffset: new BMap.Size(20, 0)
      })
      // 创建标注对象并添加到地图
      const marker = new BMap.Marker(point, { icon: startIcon })
      this.map.addOverlay(marker)
      const infoWindow = this.getInfoWindow()
      marker.addEventListener('click', function() {
        this.openInfoWindow(infoWindow)
      })
      return marker
    },
    getInfoWindow() {
      const sContent =
          '<div style=\'height: 100px;width: 300px;\'>' +
          '<div style=\'width: 20%;height: 100%;float: left;\'>' +
          '<img src=\'http://ycdl.oss-cn-shenzhen.aliyuncs.com/lushu/users/avatars/8343bda9342c4a2aab6670beb4cebbb9.jpeg\' ' +
          'style=\'height: 40px;width: 40px;border-radius: 20px\'' +
          'onclick=\'infoWindowClick(this)\'>' +
          '<img src=\'http://ycdl.oss-cn-shenzhen.aliyuncs.com/lushu/users/avatars/8343bda9342c4a2aab6670beb4cebbb9.jpeg\' ' +
          'style=\'height: 40px;width: 40px;border-radius: 20px;margin-top: 10px\'>' +
          '</div>' +
          '<div style=\'width: 80%;height: 100%;float: left;\'>' +
          '<div>这里是点记录的名称</div>' +
          '<div>距离：2.18公里</div>' +
          '<div>地点：思雅路</div>' +
          '<div>上传时间：2019-06-27 07:08:09</div>' +
          '</div>' +
          '</div>'
      return new BMap.InfoWindow(sContent)
    }
  }
}
</script>

<style>
  .bm-view {
    width: 100%;
    height: 500px;
  }
</style>
