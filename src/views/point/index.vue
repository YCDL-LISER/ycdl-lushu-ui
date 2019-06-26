<template>
  <div
    class="app-container"
    style="background: url('https://cn.bing.com/th?id=OHR.PhilippinesFirefly_ZH-CN4519927697_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp')"
  >
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="grid-content bg-purple" />
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <h1 style="text-align:center">路书</h1>
          <el-input v-model="input3" placeholder="请输入内容" class="input-with-select" size="medium" clearable>>
            <el-button slot="append" icon="el-icon-search" @click="handleSearch">搜索</el-button>
          </el-input>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple" />
      </el-col>
    </el-row>
    <el-row style="height: 10px" />
    <div v-infinite-scroll="loadRoute">
      <el-row :gutter="12">
        <el-col v-for="site in sites" :key="site.id" :span="8">
          <el-card shadow="hover" style="margin-bottom: 12px">
            <a :href="'#/route/'+site.id+''">
              <div class="bottom clearfix">
                <div>
                  <!--:style="{height:width}"-->
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
</template>

<script>
import { page } from '@/api/route'

export default {
  data() {
    return {
      height: undefined,
      count: 0,
      input3: '',
      select: '',
      fits: ['fill', 'contain', 'cover', 'none', 'scale-down'],
      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      currentDate: new Date(),
      levelList: null,
      currentPage: -1,
      sites: []
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
    this.loadRoute()
  },
  methods: {
    load() {
      this.count += 2
    },
    loadRoute() {
      console.log('当前页：', this.currentPage)
      this.currentPage += 1
      page({ page: this.currentPage }).then(response => {
        this.sites.push(...response.data.data)
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
