<template>
  <a-card>
    <div style="margin-bottom: 16px">
      <a-button
        type="primary"
        @click="start"
        :loading="loading"
      >
        重新加载
      </a-button>
    </div>
    <a-table :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :columns="columns" :dataSource="data" >
      <template slot="status" slot-scope="text">
        <a-tag color="green" v-if="text === 'UP'">{{ text }}</a-tag>
        <a-tag color="red" v-else>{{ text }}</a-tag>
      </template>
    </a-table>
  </a-card>
</template>

<script>
import { getServices } from '../../../src/api/services'
import { formatDate } from '../../utils/util'

export default {
  data () {
    return {
      data: [],
      columns: [
        {
          title: 'APP',
          dataIndex: 'app'
        },
        {
          title: '实例ID',
          dataIndex: 'instanceId'
        },
        {
          title: '主机',
          dataIndex: 'hostName'
        },
        {
          title: 'vip地址',
          dataIndex: 'vipAddress'
        },
        {
          title: 'sid',
          dataIndex: 'sid'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '最后更新时间',
          dataIndex: 'lastUpdatedTimestamp'
        }
      ],
      selectedRowKeys: [], // Check here to configure the default column
      loading: false
    }
  },
  created: function () {
    this.getApps()
  },
  computed: {
  },
  methods: {
    getApps () {
      getServices().then(response => {
        this.data = []
        const responseData = JSON.parse(JSON.stringify(response))
        responseData['applications']['application'].forEach((line, key) => {
          line['instance'].forEach((instance, k) => {
            instance['key'] = key + '_' + k
            instance['lastUpdatedTimestamp'] = formatDate(new Date(instance['lastUpdatedTimestamp']), 'yyyy-MM-dd HH:mm:ss')
            this.data.push(instance)
          })
        })
      })
    },
    start () {
      this.loading = true
      // setTimeout(() => {
      //   this.loading = false
      //   this.selectedRowKeys = []
      // }, 1000)
      this.getApps()
      setTimeout(() => {
        this.loading = false
        this.selectedRowKeys = []
      }, 200)
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    }
  }
}
</script>

<style scoped>

</style>
