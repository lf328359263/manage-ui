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
          <a-button style="margin-right: 10px" size="small" type="primary" @click="handlePasswordConfirm(record, handlePassword)">重置密码</a-button>
          <a-button style="margin-right: 10px" size="small" type="danger" @click="handleDeleteConfirm(record, handleDelete)">删除</a-button>
        </div>
      </template>
    </a-table>
  </a-card>
</template>

<script>
// import { getRoleList, getServiceList } from '@/api/manage'
import { getUsers, deleteUser, initPassword } from '@/api/admin'

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
          title: '用户名',
          dataIndex: 'username'
        },
        {
          title: '昵称',
          dataIndex: 'nickname'
        },
        {
          title: '邮箱',
          dataIndex: 'email'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
          width: '240px'
        }
      ],
      loadData: [],

      selectedRowKeys: []
    }
  },
  created () {
    this.loadUsers()
  },
  methods: {
    loadUsers () {
      this.loadData = []
      getUsers().then(res => {
        this.loadData = res['data']['content']
      })
    },
    start () {
      this.loading = true
      this.loadUsers()
      setTimeout(() => {
        this.loading = false
        this.selectedRowKeys = []
      }, 200)
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    handleAdd () {
      this.$router.push('register')
    },
    handleEdit (record) {
      this.$router.push({
        name: 'register',
        params: record
      })
    },
    handlePassword (record) {
      initPassword(record.username).then(res => {
        if (res.status && res.status === '200') {
          this.$notification.success({
            message: '密码初始化',
            description: '成功'
          })
        } else {
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },
    handlePasswordConfirm (record, func) {
      const nickName = record.nickname
      this.$confirm({
        title: '请确认',
        content: '确定要初始化 ' + nickName + ' 的密码吗？',
        onOk () {
          func(record.username)
        },
        onCancel () {}
      })
    },
    handleDeleteConfirm (record, func) {
      const nickName = record.nickname
      this.$confirm({
        title: '请确认',
        content: '确定要删除用户 ' + nickName + ' 吗？',
        onOk () {
          func(record.id)
        },
        onCancel () {}
      })
    },
    handleDelete (record) {
      deleteUser(record).then(res => {
        if (res['status'] && res['status'] === '200') {
          this.start()
        } else {
          this.$notification['error']({
            message: '错误',
            description: res.msg,
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
