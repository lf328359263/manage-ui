<template>
  <a-card :bordered="false">
    <div style="margin-bottom: 16px">
      <a-button
        style="margin-right: 16px"
        type="primary"
        @click="start"
        :loading="loading"
      >
        刷新
      </a-button>
      <a-button style="margin-right: 16px" type="primary" @click="handleAdd">新增</a-button>
    </div>
    <a-table
      rowKey="id"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :columns="columns"
      :dataSource="loadData"
      :bordered="bordered"
      :loading="loading"
    >
      <template slot="operation" slot-scope="text, record">
        <div>
          <a-button style="margin-right: 10px" size="small" @click="handleEdit(record)">编辑</a-button>
          <a-button style="margin-right: 10px" size="small" type="danger" @click="handleDelete(record.id)">删除</a-button>
        </div>
      </template>
    </a-table>
  </a-card>
</template>

<script>
// import { getRoleList, getServiceList } from '@/api/manage'
import { getRoles, deleteRole } from '@/api/admin'

export default {
  data () {
    return {
      // 查询参数
      queryParam: {},
      loading: false,
      bordered: true,
      // 表头
      columns: [
        {
          title: 'id',
          dataIndex: 'id'
        },
        {
          title: '角色',
          dataIndex: 'name'
        },
        {
          title: '角色描述',
          dataIndex: 'description'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
          width: '200px'
        }
      ],
      loadData: [],
      selectedRowKeys: []
    }
  },
  created () {
    this.loadRoles()
  },
  methods: {
    loadRoles () {
      this.loadData = []
      getRoles().then(res => {
        this.loadData = res['data']
      })
    },
    start () {
      this.loading = true
      this.loadRoles()
      setTimeout(() => {
        this.loading = false
        this.selectedRowKeys = []
      }, 200)
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    handleAdd () {
      this.$router.push({
        name: 'addRole'
      })
    },
    handleEdit (record) {
      this.$router.push({
        name: 'addRole',
        params: record
      })
    },
    handleDelete (record) {
      deleteRole(record).then(res => {
        if (res['status'] && res['status'] === '200') {
          const tmpData = this.loadData.filter(data => {
            return data.id !== record
          })
          this.loadData = tmpData
          this.start()
        } else {
          this.$notification['error']({
            message: '错误',
            description: res.msg || '请求出现错误，请稍后再试',
            duration: 4
          })
        }
      }).catch(err => {
        this.$notification['error']({
          message: '错误',
          description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
          duration: 4
        })
      })
    }
  },
  watch: {
    /*
      'selectedRows': function (selectedRows) {
        this.needTotalList = this.needTotalList.map(item => {
          return {
            ...item,
            total: selectedRows.reduce( (sum, val) => {
              return sum + val[item.dataIndex]
            }, 0)
          }
        })
      }
      */
  }
}
</script>
