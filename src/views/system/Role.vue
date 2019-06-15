<template>
  <a-card>
    <a-form :form="form" @submit="handleSubmit" >
      <a-form-item v-bind="formItemLayout" label="角色">
        <a-input
          v-decorator="[
            'name',
            {
              initialValue: role.name,
              rules: [{ required: true, message: '请输入角色名', whitespace: true }]
            }
          ]"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="描述">
        <a-input
          v-decorator="[
            'description',
            {
              initialValue: role.description,
              rules: [{ required: true, message: '确认描述信息', whitespace: true }]
            }
          ]"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="接口权限">
        <!--<edit-table :columns="pColumns" :loadData="role.permissions"></edit-table>-->
        <a-card>
          <a-table
            rowKey="ext"
            :columns="pColumns"
            :dataSource="role.permissions"
            :bordered="bordered"
          >
            <template slot="operation" slot-scope="text, record">
              <div>
                <a-button style="margin-right: 10px" size="small" @click="handleEdit(record)">编辑</a-button>
                <a-button style="margin-right: 10px" size="small" type="danger" @click="handleDelete(record.ext)">删除</a-button>
              </div>
            </template>
          </a-table>
          <div>
            <a-button type="primary" @click="showModal">
              添加权限
            </a-button>
            <a-modal
              v-model="visible"
              title="添加"
              onOk="handleOk"
            >
              <template slot="footer">
                <a-button key="back" @click="handleCancel">取消</a-button>
                <a-button key="submit" type="primary" @click="handleOk">
                  确认
                </a-button>
              </template>
              <a-form :form="formChild" @submit="addPermission" style="width: 80%" >
                <a-form-item v-bind="formItemLayout" :label="item.title" v-for="item in pColumns" :key="item.id" v-if="!item.formHidden">
                  <a-input
                    v-decorator="[
                      item.dataIndex,
                      {
                        rules: [{ required: true, message: '必填', whitespace: true }]
                      }
                    ]"
                  />
                </a-form-item>
              </a-form>
            </a-modal>
          </div>
        </a-card>
      </a-form-item>
      <a-form-item v-bind="tailFormItemLayout">
        <a-button type="primary" html-type="submit">
          保存
        </a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import { saveRole } from '../../api/admin'
import AFormItem from 'ant-design-vue/es/form/FormItem'
// import EditTable from './common/EditTable'

export default {
  components: { AFormItem },
  data () {
    return {
      role: {
        id: '',
        name: '',
        description: '',
        permissions: []
      },
      visible: false,
      bordered: true,
      pColumns: [
        {
          title: '权限',
          dataIndex: 'ext'
        },
        {
          title: '名称',
          dataIndex: 'name'
        },
        {
          title: '服务名',
          dataIndex: 'application'
        },
        {
          title: '路径',
          dataIndex: 'path'
        },
        {
          title: '方法',
          dataIndex: 'method'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          formHidden: true,
          scopedSlots: { customRender: 'operation' },
          width: '150px'
        }
      ],
      confirmDirty: false,
      autoCompleteResult: [],
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        }
      },
      tailFormItemLayout: {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0
          },
          sm: {
            span: 16,
            offset: 8
          }
        }
      }
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
    this.formChild = this.$form.createForm(this)
  },
  mounted () {
    this.initRole()
  },
  methods: {
    showModal () {
      this.visible = true
    },
    handleOk (e) {
      if (!this.role.permissions) {
        this.role.permissions = []
      }
      this.role.permissions.push(this.formChild.getFieldsValue())
      this.loading = true
      setTimeout(() => {
        this.visible = false
        this.loading = false
      }, 200)
    },
    handleCancel (e) {
      this.visible = false
    },
    initRole () {
      if (this.$route.params) {
        this.role = this.$route.params
      }
    },
    handleSubmit (e) {
      e.preventDefault()
      const tmpRole = this.form.getFieldsValue()
      if (this.role.id && this.role.id !== '') {
        tmpRole.id = this.role.id
      }
      tmpRole.permissions = this.role.permissions
      saveRole(tmpRole)
        .then(res => {
          if (res['status'] && res['status'] === '200') {
            this.$router.push({
              name: 'roles'
            })
          }
        }).catch(err => {
          console.log(err)
          this.$notification['error']({
            message: '错误',
            description: err.response.msg || '请求出现错误，请稍后再试',
            duration: 4
          })
        })
    },
    handleDelete (record) {
      this.role.permissions = this.role.permissions.filter(p => p.ext !== record)
    },
    addPermission (e) {
      console.log(this.formChild.getFieldsValue())
    },
    handleConfirmBlur (e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    }
  }
}
</script>
