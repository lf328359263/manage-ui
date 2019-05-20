<template>
  <div>
    <iframe id="ref" :src="url" frameborder="0" width="100%"></iframe>
  </div>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      required: true,
      default: 'https://www.baidu.com'
    }
  },
  data () {
    return {
    }
  },
  mounted () {
    function changeRefIFrame () {
      const ref = document.getElementById('ref')
      const deviceHeight = document.body.clientHeight
      ref.style.height = (Number(deviceHeight) - 138) + 'px'
    }
    changeRefIFrame()
    window.onresize = function () {
      changeRefIFrame()
    }
  }
}
</script>

<style scoped>
</style>
