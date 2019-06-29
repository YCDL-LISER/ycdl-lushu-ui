<template>
  <div class="app-container">
    <el-row :gutter="15">
      <el-col :span="16">
        <div :id="mapId" class="bm-view"/>
      </el-col>
      <el-col :span="8">
        <div class="bm-view" style="overflow-y: scroll;">
          <el-collapse v-model="activeName" accordion>
            <el-collapse-item
              v-for="item in pointData"
              :key="item.pointId"
              :title="item.name"
              :name="item.pointId"
              style="background: #4d4d4d"
            >
              <el-card
                :body-style="{ padding: '0px' }"
                style="background: #4d4d4d"
              >
                <div style="padding: 14px;background: #4d4d4d">
                  <div style="color: #f4f4f5;margin-bottom: 10px">
                    <img :src="item.avatar" style="height: 40px;width: 40px;border-radius: 20px;float: left;"/>
                    <div style="height: 40px;line-height: 40px;margin-left: 50px" v-text="item.nickName"/>
                  </div>
                  <div style="color: crimson">
                    距离我：
                    <span v-text="item.geodistance"/>
                    <span>公里</span>
                  </div>
                  <div style="color: aqua">
                    上传时间
                    <span>{{ item.time| dateFilter }}</span>
                    <!--<span ="item.time | dateFilter"/>-->
                  </div>
                  <div class="bottom clearfix" style="border-top: #99a9bf 1px solid;padding-top: 10px;">
                    <el-row>
                      <el-col :span="8">
                        <el-button style="text-align: left;height: 100%;width: 100%" icon="el-icon-star-off" round>收藏</el-button>
                      </el-col>
                      <el-col :span="8">
                        <el-button style="text-align: left;height: 100%;width: 100%" icon="el-icon-chat-dot-square" round>评论</el-button>
                      </el-col>
                      <el-col :span="8">
                        <el-button style="text-align: left;height: 100%;width: 100%" icon="el-icon-thumb" round>点赞</el-button>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </el-card>
              <div v-if="item.keypoints.length > 0" class="block" style="background: #4d4d4d">
                <el-carousel height="280px" indicator-position="none">
                  <el-carousel-item v-for="keypoint in item.keypoints" :key="keypoint">
                    <div style="height: 180px;">
                      <img v-if="keypoint.type===2" style="height: 100%;width: 100%" src="http://ycdl.oss-cn-shenzhen.aliyuncs.com/lushu/route/10/images/20190626/3c2fda2ff53f0cf5c67775cd11532013.jpg">
                      <img v-else-if="keypoint.type===3" style="height: 100%;width: 100%" :src="point_photo[3]">
                      <img v-else-if="keypoint.type===4" style="height: 100%;width: 100%" :src="point_photo[4]">
                      <div v-else-if="keypoint.type === 5" style="height: 100%;width: 100%" />
                    </div>
                    <div style="height: 100px;background: #4d4d4d;padding: 10px;color: #f4f4f5">
                      <span>标注类型 :</span>
                      <span v-if="keypoint.type===2">图片</span>
                      <span v-else-if="keypoint.type===3">音频</span>
                      <span v-else-if="keypoint.type===4">视频</span>
                      <span v-else-if="keypoint.type === 5">
                        文字<br>
                        <span>
                          标注名称：
                          <span v-text="keypoint.name"/>
                        </span>
                      </span>
                      <br><span>描述：<span v-text="keypoint.explain"/></span>
                      <div>
                        创建时间
                        <span>{{ keypoint.time| dateFilter }}</span>
                        <!--<span ="item.time | dateFilter"/>-->
                      </div>
                    </div>
                  </el-carousel-item>
                </el-carousel>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { search } from '@/api/point/index.js'
import { wgs84_to_bd09 } from '@/assets/js/gps_utils.js'
import { loadBMap } from '@/assets/js/async-load-bmap.js'
import moment from 'moment'
// import { infoWindowClick } from '@/assets/js/BMapInfoClick.js'

export default {
  name: 'Point',
  filters: {
    dateFilter(date) {
      if (date == null || date === '') {
        return date
      }
      const result = moment(Number(date)).format('YYYY-MM-DD HH:mm:ss')
      return result
    }
  },
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
      },
      pointData: [],
      activeName: null,
      point_photo: {
        3: require('@/assets/images/music.png'),
        4: require('@/assets/images/video.png')
        // 'http://duanly.oss-cn-shenzhen.aliyuncs.com/bmap/ic_route_photo.png'
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
    // 加载数据
    this.loadPoints()
  },
  methods: {
    initMap() {
      loadBMap('tSiFWPYXfG7iInGZhEfL8ThMMAisdyXQ')
        .then(() => {
          // 百度地图API功能
          this.map = new BMap.Map(this.mapId, { enableMapClick: false }) // 创建Map实例

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
        })
        .catch(err => {
          console.log('地图加载失败：', err)
        })
    },
    loadPoints() {
      search(this.query).then(response => {
        const { data } = response.data
        console.log('sh：', data)
        this.pointData = data
        this.activeName = data[0].pointId
        const that = this
        data.forEach(value => {
          const location = wgs84_to_bd09(value.lng, value.lat)
          const point = new BMap.Point(location[0], location[1])
          if (that) {
            const marker = this.addMarkerToMap(point, value)
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
    addMarkerToMap(point, value) {
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
      const infoWindow = this.getInfoWindow(value)
      marker.addEventListener('click', function() {
        this.activeName = value.pointId
        console.log(this.activeName)
        this.openInfoWindow(infoWindow)
      })

      return marker
    },
    getInfoWindow(value) {
      const sContent =
          "<div style='height: 100px;width: 300px;'>\n" +
          "    <div style='width: 20%;height: 100%;float: left;'>\n" +
          "        <img style='height: 40px;width: 40px;border-radius: 20px' src='" + value.avatar + "'>\n" +
          "        <img id='collect' style='height: 40px;width: 40px;border-radius: 20px'" +
          "              src='http://ycdl.oss-cn-shenzhen.aliyuncs.com/bmap/ic_uncollect.png'>\n" +
          '    </div>\n' +
          "    <div style='width: 80%;height: 100%;float: left;'>\n" +
          '        <div>' + value.name + '</div>\n' +
          '        <div>上传时间：2019-06-27 07:08:09</div>\n' +
          '        <div>上传时间：2019-06-27 07:08:09</div>\n' +
          '        <div>上传时间：2019-06-27 07:08:09</div>\n' +
          '    </div>\n' +
          '</div>'
      return new BMap.InfoWindow(sContent)
    },
    infoWindowClick() {
      console.log('信息弹窗被点击了')
    }
  }
}
</script>
<style>
    .bm-view {
        height: 600px;
    }

    .time {
        font-size: 13px;
        color: #999;
    }

    .bottom {
        margin-top: 13px;
        line-height: 12px;
    }

    .button {
        padding: 0;
        float: right;
    }

    .image {
        width: 100%;
        display: block;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }

    .el-carousel__item h3 {
      color: #475669;
      font-size: 14px;
      opacity: 0.75;
      line-height: 150px;
      margin: 0;
    }

    .el-carousel__item:nth-child(2n) {
      background-color: #99a9bf;
    }

    .el-carousel__item:nth-child(2n+1) {
      background-color: #d3dce6;
    }
</style>
