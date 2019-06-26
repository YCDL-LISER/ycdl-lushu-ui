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
        <div id="container" style="width: 100%;height: 240px;"/>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4">
        <div class="grid-content"/>
      </el-col>
      <el-col :span="16">
        <div class>
          <el-carousel :interval="4000" type="card" height="200px">
            <el-carousel-item v-for="item in resolveKeywords" :key="item.time">
              <div>
                {{ item.name }}
                <h3>{{ item.type }}</h3>
                <h3>{{ item.time }}</h3>
                <h3>{{ item.name }}</h3>
                <el-image v-if="item.type = 3" :src="item.name"/>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content"/>
      </el-col>
    </el-row>
  </div>
  <!--<el-row>-->
  <!--<el-row><span>路书介绍</span></el-row>-->
  <!--<el-row><span style="margin-left: 20px">空空如也</span></el-row>-->
  <!--</el-row>-->
</template>

<script>
import MapLoader from '@/assets/js/BMap.js'
import echarts from 'echarts'
import { loadRoute } from '@/api/route/index.js'
import { wgs84_to_bd09 } from '@/assets/js/gps_utils.js'

export default {
  data() {
    return {
      map: null,
      // textarea: ' ', // 评论框中输入的值
      roteName: '北京路口赛段',
      routeData: ['7.4', '1.99', '366.9', '188.0'],
      authorName: 'Wjh2016',
      time: '2019-6-23',
      number: '111111',
      dialogStatus: undefined,
      dialogVisible: false,
      resolveLocations: [],
      resolveKeywords: [],
      images: []
      // textMap: {
      //   true: '评论',
      //   false: '编辑'
      // }
    }
  },
  created() {
    this.load()
  },
  mounted() {
    // 加载百度地图
    MapLoader().then(BMap => {
      console.log('加载地图成功')
      this.map = new BMap.Map('container')
      var point = new BMap.Point(116.404, 39.915)
      this.map.centerAndZoom(point, 15)
      this.map.enableScrollWheelZoom() // 启用滚轮放大缩小，默认禁用
      this.map.enableContinuousZoom() // 启用地图惯性拖拽，默认禁用
      this.map.addControl(new BMap.NavigationControl())
      this.map.addControl(new BMap.MapTypeControl())
    })
    this.initChart()
  },
  methods: {
    load() {
      loadRoute()
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
              if (val.type === 2 && val.type === 3 && val.type === 4) {
                val.name =
                  'http://duanly.oss-cn-shenzhen.aliyuncs.com/' + val.name
              }
              console.log('关键点数据1', val.name)
              const point = val
              this.resolveKeywords.push(point)
            })
          }

          this.resolveKeywords.forEach((val, index) => {
            console.log('关键点数据2', val)
          })

          this.loadPolyline(rLocations)
        })
        .catch(error => {
          console.log('加载数据失败', error)
        })
    },
    loadPolyline(locations) {
      // eslint-disable-next-line no-undef
      var polyline = new BMap.Polyline(locations, {
        strokeColor: 'blue',
        strokeWeight: 6,
        strokeOpacity: 0.5
      })
      this.map.addOverlay(polyline)
      this.map.setViewport(locations)
    },
    clickHandler() {
      console.log('点击')
    },
    routeExport() {
      alert('导出')
    },
    handleCreate() {
      this.dialogVisible = true
      this.dialogStatus = true
      this.form = {}
    },
    // submit() {
    //   this.dialogVisible = false
    // },
    routeCollection() {
      alert('收藏')
    },
    fetchData() {},
    initChart() {
      this.chart = echarts.init(document.getElementById('map'))
      this.chart.setOption({
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], // 里程
          name: '里程(m)'
        },
        yAxis: {
          type: 'value',
          name: '海拔(m)'
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320], // 海拔
            type: 'line',
            smooth: true
          }
        ]
      })
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
</style>
