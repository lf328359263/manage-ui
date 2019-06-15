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
      <a-cascader :options="options" @change="onChange" placeholder="Please select" />
    </div>
    <a-table :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" rowKey="propKey" :columns="columns" :dataSource="data" >
      <template slot="status" slot-scope="text">
        <a-tag color="green" v-if="text === 'UP'">{{ text }}</a-tag>
        <a-tag color="red" v-else>{{ text }}</a-tag>
      </template>
    </a-table>
  </a-card>
</template>

<script>
import { getConfigMeta, getServiceConfig } from '../../../src/api/admin'
// import { formatDate } from '../../utils/util'

export default {
  data () {
    return {
      data: [],
      options: [{
        value: 'master',
        label: 'master',
        children: [{
          value: 'dev',
          label: 'dev',
          children: [{
            value: 'auth',
            label: 'auth'
          }]
        }]
      }],
      columns: [
        // {
        //   title: 'id',
        //   dataIndex: 'id'
        // },
        {
          title: 'KEY',
          dataIndex: 'propKey'
        },
        {
          title: 'VALUE',
          dataIndex: 'propValue'
        }
      ],
      selectedRowKeys: [], // Check here to configure the default column
      loading: false
    }
  },
  created: function () {
    this.getAppMeta()
  },
  computed: {
  },
  methods: {
    refreshPage () {
      this.getAppMeta()
    },
    onChange (value) {
      const params = {
        label: value[0],
        profile: value[1],
        application: value[2]
      }
      this.serviceConfig(params)
    },
    serviceConfig (params) {
      getServiceConfig(params).then(req => {
        if (req.status && req.status === '200') {
          this.data = req.data
        }
      })
    },
    getAppMeta () {
      getConfigMeta().then(req => {
        if (req.status && req.status === '200') {
          const op = []
          for (const label in req.data) {
            const profileChildren = []
            for (const profile in req.data[label]) {
              const appChildren = []
              req.data[label][profile].forEach(application => {
                appChildren.push({
                  label: application,
                  value: application
                })
              })
              profileChildren.push({
                label: profile,
                value: profile,
                children: appChildren
              })
            }
            op.push({
              label: label,
              value: label,
              children: profileChildren
            })
          }
          this.options = op
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
