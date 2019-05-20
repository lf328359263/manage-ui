<template>
  <div>
    <i-frame-page :url="url"></i-frame-page>
    <!--<router-view :url="url" />-->
  </div>
</template>

<script>
import IFramePage from '@/components/IFramePage'

export default {
  name: 'IFrameView',
  components: {
    IFramePage
  },
  // props: {
  //   url: {
  //     type: String,
  //     default: ''
  //   }
  // },
  data () {
    return {
      url: ''
    }
  },
  mounted () {
    this.getPageMeta()
  },
  updated () {
    this.getPageMeta()
  },
  methods: {
    getPageMeta () {
      this.url = this.$route.meta.url
    }
  },
  watch: {
    '$route': function () {
      this.getPageMeta()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
