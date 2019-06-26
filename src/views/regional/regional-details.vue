<template>
  <div
    class="app-container"
    style="background: #2d2f33;padding: 30px 50px"
  >
    <div style="background: #4d4d4d;padding:10px 20px ">
      <el-row>
        <el-row>
          <el-col span="16"> <h2 style="color: #e4e4e4;font-size: 18px;">决战山城-重庆热门赛段集锦</h2></el-col>
          <el-col span="8" style="font-size: 15px;padding: 1%">
            <a href="#" style="margin-left: 5px;color: #189ADB"><u>官方路书</u></a>
            <span>创建于2018-05-20</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="6">
            <img style="width: 400px;height: 237px" src="http://static.imxingzhe.com/webadm/1510892011000/61d8b6049ba9">
          </el-col>
          <el-col span="18" style="background: #4d4d4d;border:solid 1px #2d2f33">
            <h2 style="color: #189ADB;font-size: 15px;">合集简介</h2>
            <p style="color: #e4e4e4; ">重庆地区热门赛段精选合辑，欢迎重庆的车友前往挑战！</p>
            <el-row style="margin-top:122px;height: 50px">
              <el-col span="20">
                <span style="color: #e4e4e4;margin-left: 20px">246人觉得行</span>
              </el-col>
              <el-col span="4">
                <el-button style="position:revert;top: 10px;color: #189ADB;margin-left: 50%" size="mini">点赞</el-button>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-row>
      <el-row style="background: #404346;margin: 10px 0">
        <p style="color: #189ADB">合集路书</p>
      </el-row>
      <el-row style="height: 10px" />
      <div v-infinite-scroll="loadRoute">
        <el-row :gutter="12">
          <el-col v-for="site in sites" :key="site.id" :span="8">
            <el-card shadow="hover" style="margin-bottom: 12px">
              <a :href="'#/route/'+site.id+''">
                <div class="bottom clearfix">
                  <div>
                    <el-image :src="site.pic" :style="{height:height}" />
                  </div>
                  <h2 style="font-size: 15px">{{ site.title }}</h2>
                  <span style="font-size: 10px">{{ site.description }}</span>
                </div>
              </a>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { page } from '@/api/regional'

export default {
  data() {
    return {
      height: undefined,
      count: 0,
      input3: '',
      select: '',
      currentDate: new Date(),
      levelList: null,
      currentPage: -1,
      sites: undefined
    }
  },
  mounted() {
    const that = this
    window.onresize = () => {
      that.height = (document.body.clientWidth / 5.5) + 'px'
    }
  },
  created() {
    this.height = (document.body.clientWidth / 5.5) + 'px'
  },
  methods: {
    load() {
      this.count += 2
    },
    loadRoute() {
      console.log('当前页：', this.currentPage)
      this.currentPage += 1
      page({ page: this.currentPage }).then(response => {
        this.sites = response.data.data
        console.log('最终数据个数', this.sites.length)
      }).catch(() => {
        console.log('请求失败')
      })
    },
    clickHandler() {
      console.log('点击')
    },
    fetchData() {
    },
    handleSearch() {
      alert('点击')
    }
  }
}
</script>

<style>
  .scale img{
    width: 100%;
    height: auto;
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

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: '';
  }

  .clearfix:after {
    clear: both;
  }

  .el-card__body {
    padding: 5px;
  }

  .bottom {
    margin-top: 0;
  }

</style>
