<template>
  <transition name="fade">
    <div v-if="seeMedia" class="media-wrapper">
      <Button type="text" class="media-close" shape="circle" icon="close" @click="close"/>
      <div class="media-controller">
        <Button-group shape="circle">
          <Button size="large" type="ghost" icon="ios-skipbackward" @click.prevent="prev"/>
          <Button size="large" type="ghost" icon="ios-skipforward" @click.prevent="next"/>
        </Button-group>
      </div>
      <div class="media-content">
        <div v-for="(item,index) in data" :key="index" :class="type(index)">
          <img v-if="isImg(item)" :src="item" @click="toggle(index)">
          <video v-else :src="item" controls="controls" @click="toggle(index)"/>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'CjMedia',
  props: {
    // data:{
    //     type:Array
    // }
  },
  data: function() {
    return {
      nowIndex: 0,
      data: [
        '/src/test/media/movie.ogg',
        '/src/test/media/1.jpg',
        '/src/test/media/2.jpg'
      ]
    }
  },
  computed: {
    seeMedia() {
      return this.$store.state.seeMedia
    }
  },
  methods: {
    next() {
      if (this.nowIndex == this.data.length - 1) {
        this.$Message.warning('已到达最后一张')
      } else {
        this.nowIndex++
      }
    },
    prev() {
      if (this.nowIndex == 0) {
        this.$Message.warning('已到达第一张')
      } else {
        this.nowIndex--
      }
    },
    type(index) {
      if (index == this.nowIndex) {
        return 'media-center'
      } else if (index - this.nowIndex == 1) {
        return 'media-right'
      } else if (index - this.nowIndex == -1) {
        return 'media-left'
      } else {
        return 'media-hide'
      }
    },
    isImg(item) {
      var ext = item.substr(item.length - 3, 3)
      var flag = ext == ('jpg' || 'png' || 'gif') ? true : false
      return flag
    },
    toggle(index) {
      if (index - this.nowIndex == 1) {
        this.nowIndex++
      } else if (index - this.nowIndex == -1) {
        this.nowIndex--
      }
    },
    close() {
      this.$store.commit('SET_MEDIA', false)
      this.nowIndex = 0
    }
  }
}
</script>

<style lang="scss">
.media-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.52);
  z-index: 1010;
  i {
    color: #fff;
  }
  .media-controller {
    position: absolute;
    left: 50%;
    bottom: 30px;
    transform: translateX(-50%);
  }
  .media-close {
    position: absolute;
    right: 5px;
    top: 5px;
    i {
      font-size: 30px;
    }
  }
  .media-content {
    div {
      position: absolute;
      top: 50%; // background: green;
      color: #fff;
      text-align: center;
      font-size: 30px;
      transition: all 0.56s ease;
      img {
        max-width: 100%;
        max-height: 100%;
      }
      video {
        width: 100%;
      }
    }
    .media-center {
      height: 50%;
      width: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1011;
    }
    .media-left,
    .media-right {
      width: 25%;
      height: 35%;
      filter: grayscale(90%);
    }
    .media-right {
      left: 100%;
      transform: translate(-105%, -50%);
    }
    .media-left {
      left: 0;
      transform: translate(5%, -50%);
    }
    .media-hide {
      height: 0;
      width: 0;
      left: 50%;
      z-index: 1010;
      opacity: 0;
    }
  }
}
</style>
