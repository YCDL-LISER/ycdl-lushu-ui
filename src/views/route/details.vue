<template>
  <div class="app-container">
    <el-row>
      <el-col :span="20">
        <el-row style="list-style-type: none">
          <h1 style=" font-size:20px">
            <span class="liStyle">{{ roteName }}</span>
          </h1>
        </el-row>
        <el-row>
          <ul style="list-style-type:none;">
            <li class="liStyle">里程 {{ routeData[0] }}km</li>
            <li class="liStyle">平均坡度 {{ routeData[1] }}%</li>
            <li class="liStyle">累计爬升 {{ routeData[2] }}m</li>
            <li class="liStyle">海拔落差 {{ routeData[3] }}m</li>
          </ul>
        </el-row>
      </el-col>
      <el-col :span="4">
        <el-row style="position: relative;left: 50px;top: 20px">
          <el-button type="info" size="mini" @click="routeExport">导出</el-button>
          <el-button type="info" size="mini" @click="routeCollection">收藏</el-button>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div id="container" style="width: 100%;height: 260px;"/>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <!-- <el-col :span="24">
        <viewer :images="resolveKeywords">
          <div v-for="item in resolveKeywords" :key="item.time">
            <img v-if="item.type===2" :src="item.name" height="100">
          </div>
        </viewer>
      </el-col>-->
      <el-col :span="4">&nbsp;</el-col>
      <el-col :span="16">
        <el-carousel
          v-if="hasData"
          ref="elCarousel"
          :autoplay="false"
          :interval="8000"
          type="card"
          height="280px"
          @change="carouselChange"
        >
          <el-carousel-item v-for="item in resolveKeywords" :key="item.pointId">
            <el-card shadow="hover" :body-style="{ padding: '0px'}">
              <el-card
                v-if="item.type ===2"
                v-viewer="{movable: true}"
                :body-style="{ padding: '0px' }"
              >
                <div style="height:240px;width:100%;overflow:hidden">
                  <img :src="item.name" class="image" style="width:100%">
                </div>
                <div style="padding: 8px 14px;">
                  <div class="bottom clearfix">
                    <span>花很多时间都会觉得</span>
                    <time class="time">2019-06-27 10:19:11</time>
                  </div>
                </div>
              </el-card>

              <div v-else-if="item.type ===3" @click="openVideoLog(playerSources.mp4,item.name)">
                <el-card :body-style="{ padding: '0px' }">
                  <div style="height:240px;width:100%;overflow:hidden">
                    <img src="@/assets/images/music.png" class="image" style="width:100%">
                  </div>
                  <div style="padding: 8px 14px;">
                    <div class="bottom clearfix">
                      <span>花很多时间都会觉得</span>
                      <time class="time">2019-06-27 10:19:11</time>
                    </div>
                  </div>
                </el-card>
              </div>

              <div v-else-if="item.type ===4" @click="openVideoLog(playerSources.mp4,item.name)">
                <el-card :body-style="{ padding: '0px' }">
                  <div style="height:240px;width:100%;overflow:hidden">
                    <img src="@/assets/images/video.png" class="image" style="width:100%">
                  </div>
                  <div style="padding: 8px 14px;">
                    <div class="bottom clearfix">
                      <span>花很多时间都会觉得</span>
                      <time class="time">2019-06-27 10:19:11</time>
                    </div>
                  </div>
                </el-card>
              </div>

              <el-card v-else>
                <div style="height:280px">
                  <h2>{{ item.name }}</h2>
                  <p>{{ item.explain }}</p>
                  <time class="time">{{ item.time }}</time>
                </div>
              </el-card>
              <!-- <el-button
                v-if="item.type ===3"
                type="primary"
                @click="openVideoLog(playerSources.mp3,'http://gzcj-image.oss-cn-shenzhen.aliyuncs.com/public/20190627031459.mp3')"
              >音频</el-button>
              <el-button
                v-if="item.type ===4"
                type="primary"
                @click="openVideoLog(playerSources.mp4,item.name)"
              >视频</el-button>-->
            </el-card>
          </el-carousel-item>
        </el-carousel>
      </el-col>
      <el-col :span="4">
        <div class="grid-content"/>
      </el-col>
    </el-row>
    <el-dialog title="音视频播放" :visible.sync="dialogVisible" width="30%">
      <video-player
        ref="videoPlayer"
        class="video-player-box"
        :options="playerOptions"
        :playsinline="true"
        style="width:100%"
      />
    </el-dialog>
  </div>
  <!--<el-row>-->
  <!--<el-row><span>路书介绍</span></el-row>-->
  <!--<el-row><span style="margin-left: 20px">空空如也</span></el-row>-->
  <!--</el-row>-->
</template>
<script>
import MapLoader from '@/assets/js/BMap.js'
import { loadRoute } from '@/api/route/index.js'
import { wgs84_to_bd09 } from '@/assets/js/gps_utils.js'

// 引入图片预览插件
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
import Vue from 'vue'
Vue.use(Viewer)

// 引入音视频播放器
import VideoPlayer from 'vue-video-player'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
Vue.use(VideoPlayer)

export default {
  data() {
    return {
      map: null,
      hasData: false,
      // 音视频播放配置项
      playerOptions: {
        muted: false,
        language: 'zh',
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [],
        poster: '/static/images/author.jpg'
      },
      // 音视频播放类型
      playerSources: {
        mp3: 'audio/mp3',
        mp4: 'video/mp4'
      },
      roteName: '北京路口赛段',
      routeData: ['7.4', '1.99', '366.9', '188.0'],
      authorName: 'Wjh2016',
      time: '2019-6-23',
      number: '111111',
      dialogStatus: undefined,
      dialogVisible: false,
      resolveLocations: [],
      resolveKeywords: [],
      markers: [],
      now_index: 0,
      all_index: 0,
      route_photo: {
        2: require('@/assets/images/ic_route_photo.png'),
        3: require('@/assets/images/ic_route_voice.png'),
        4: require('@/assets/images/ic_route_video.png'),
        5: require('@/assets/images/ic_route_label.png')
        // 'http://duanly.oss-cn-shenzhen.aliyuncs.com/bmap/ic_route_photo.png'
      },
      images: []
    }
  },
  created() {
    this.load(this.$route.params.id)
  },
  mounted() {
    // 加载百度地图
    MapLoader().then(BMap => {
      console.log('加载地图成功')
      this.map = new BMap.Map('container')
      const point = new BMap.Point(116.404, 39.915)
      this.map.centerAndZoom(point, 15)
      this.map.enableScrollWheelZoom() // 启用滚轮放大缩小，默认禁用
      this.map.enableContinuousZoom() // 启用地图惯性拖拽，默认禁用
      this.map.addControl(new BMap.NavigationControl())
      this.map.addControl(new BMap.MapTypeControl())
    })
  },
  methods: {
    load(id) {
      loadRoute(id)
        .then(response => {
          // var locations = response.data.data.locations
          const { locations, keypoints } = response.data.data
          var rLocations = []
          locations.forEach(function(val, index) {
            var result = wgs84_to_bd09(val.lng, val.lat)
            // eslint-disable-next-line no-undef
            var location = new BMap.Point(result[0], result[1])
            rLocations.push(location)
          })
          if (keypoints) {
            keypoints.forEach((val, index) => {
              var result = wgs84_to_bd09(val.lng, val.lat)
              // eslint-disable-next-line no-undef
              if (val.type > 1 && val.type < 6) {
                val.lng = result[1]
                val.lat = result[0]
                this.resolveKeywords.push(val)
                this.hasData = true
              }
            })
          }
          this.loadPolyline(rLocations)
          this.loadKeyPoints(this.resolveKeywords)
        })
        .catch(error => {
          console.log('加载数据失败', error)
        })
    },
    openVideoLog(playType, videoSrc) {
      this.playerOptions.sources.push({
        type: playType,
        src: videoSrc
      })
      this.dialogVisible = true
    },
    carouselChange(index) {
      this.markers[this.now_index].setAnimation(0)
      this.showPoint(index)
    },
    loadKeyPoints(points) {
      this.all_index = points.length
      points.forEach((val, index) => {
        // eslint-disable-next-line no-undef
        var point = new BMap.Point(val.lat, val.lng)
        // eslint-disable-next-line no-undef
        var myIcon = new BMap.Icon(
          this.route_photo[val.type],
          // eslint-disable-next-line no-undef
          new BMap.Size(48, 48),
          {
            // eslint-disable-next-line no-undef
            anchor: new BMap.Size(23, 48)
          }
        )
        // eslint-disable-next-line no-undef
        this.markers[index] = new BMap.Marker(point, { icon: myIcon })
        this.map.centerAndZoom(point, 15)
        this.markers[index].customData = { index: index }
        this.map.addOverlay(this.markers[index])
        const that = this
        this.markers[index].addEventListener('click', function() {
          that.markers[that.now_index].setAnimation(0)
          console.log(this.customData.index)
          that.showPoint(this.customData.index)
          that.$refs.elCarousel.setActiveItem(this.customData.index)
        })
      })
    },
    loadPolyline(locations) {
      // eslint-disable-next-line no-undef
      var polyline = new BMap.Polyline(locations, {
        strokeColor: '#00AA33', // 线路颜色
        strokeWeight: 4, // 线路大小
        //         线路类型(虚线)
        strokeStyle: 'solid' // 轨迹线为虚线
      })
      this.map.centerAndZoom(locations[locations.length / 2], 12)
      /** 添加终点和起点的标记**/
      this.addMarker(
        locations[0],
        'http://duanly.oss-cn-shenzhen.aliyuncs.com/ic_route_start.png'
      )
      this.addMarker(
        locations[locations.length - 1],
        'http://duanly.oss-cn-shenzhen.aliyuncs.com/ic_route_end.png'
      )
      this.map.addOverlay(polyline)
      this.map.setViewport(locations)
      // 创建线路
    },
    showPoint(i) {
      this.map.centerAndZoom(this.markers[i].point, this.map.getZoom())
      this.now_index = i
      this.markers[i].setAnimation(2)
    },
    nextNode() {
      this.markers[this.now_index].setAnimation(0)
      this.now_index++
      if (this.now_index > this.all_index - 1) {
        this.now_index = 0
      }
      this.showPoint(this.now_index)
    },
    previousNode() {
      this.markers[this.now_index].setAnimation(0)
      this.now_index--
      if (this.now_index < 0) {
        this.now_index = this.all_index - 1
      }
      this.showPoint(this.now_index)
    },
    clickHandler() {
      console.log('点击')
    },
    addMarker(point, imgurl) {
      // eslint-disable-next-line no-undef
      var myIcon = new BMap.Icon(imgurl, new BMap.Size(38, 38), {
        // eslint-disable-next-line no-undef
        anchor: new BMap.Size(22, 38)
      })
      // eslint-disable-next-line no-undef
      var marker = new BMap.Marker(point, { icon: myIcon })
      this.map.addOverlay(marker)
    },
    routeExport() {
      alert('导出')
    },
    routeCollection() {
      alert('收藏')
    }
  }
}
</script>
<style>
.liStyle {
  float: left;
  margin-right: 20px;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.video-js {
  width: 100%;
}
</style>
