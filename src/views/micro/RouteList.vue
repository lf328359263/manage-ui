<template>
  <a-card>
    <div style="margin-bottom: 16px">
      <a-button
        type="primary"
        @click="refreshPage"
        :loading="loading"
      >
        刷新
      </a-button>
    </div>
    <a-table :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" rowKey="id" :columns="columns" :dataSource="data" >
      <template slot="status" slot-scope="text">
        <a-tag color="green" v-if="text === 'UP'">{{ text }}</a-tag>
        <a-tag color="red" v-else>{{ text }}</a-tag>
      </template>
    </a-table>
  </a-card>
</template>

<script>
import { getRouteInfo } from '../../../src/api/admin'
// import { formatDate } from '../../utils/util'

export default {
  data () {
    return {
      data: [],
      columns: [
        {
          title: 'id',
          dataIndex: 'id'
        },
        {
          title: '网关路径',
          dataIndex: 'path'
        },
        {
          title: '服务',
          dataIndex: 'serviceId'
        },
        {
          title: '目标地址',
          dataIndex: 'url'
        },
        {
          title: '过滤头信息',
          dataIndex: 'sensitiveHeaders'
        },
        {
          title: '描述',
          dataIndex: 'description'
        },
        {
          title: '过滤前缀',
          dataIndex: 'stripPrefix'
        },
        {
          title: '重试',
          dataIndex: 'retryable'
        },
        {
          title: 'customSensitiveHeaders',
          dataIndex: 'customSensitiveHeaders'
        },
        {
          title: '生效',
          dataIndex: 'enable'
        }
      ],
      selectedRowKeys: [], // Check here to configure the default column
      loading: false
    }
  },
  created: function () {
    this.refreshPage()
  },
  computed: {
  },
  methods: {
    refreshPage () {
      this.routes()
    },
    routes (params) {
      getRouteInfo(params).then(req => {
        if (req.status && req.status === '200') {
          this.data = req.data.content
        }
      })
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    }
  }
}
</script>

<style scoped>

</style>
