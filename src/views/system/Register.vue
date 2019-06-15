<template>
  <a-card>
    <a-form :form="form" @submit="handleSubmit" style="width: 50%">
      <a-form-item v-bind="formItemLayout" label="用户名">
        <a-input
          v-decorator="[
            'username',
            {
              initialValue: user.username,
              rules: [{ required: true, message: '请输入用户名', whitespace: true }]
            }
          ]"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="昵称">
        <a-input
          v-decorator="[
            'nickname',
            {
              initialValue: user.nickname,
              rules: [{ required: true, message: '请输入昵称', whitespace: true }]
            }
          ]"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="邮箱">
        <a-input
          v-decorator="[
            'email',
            {
              initialValue: user.email,
              rules: [
                {
                  type: 'email',
                  message: '邮箱地址有误'
                },
                {
                  required: true,
                  message: '请输入邮箱'
                }
              ],
              validateTrigger: 'onBlur'
            }
          ]"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout" v-if="updatePassword" label="密码">
        <a-input
          v-decorator="[
            'password',
            {
              rules: [
                {
                  required: true,
                  message: '请输入密码'
                },
                {
                  validator: validateToNextPassword
                }
              ]
            }
          ]"
          type="password"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout" v-if="updatePassword" label="确认密码">
        <a-input
          v-decorator="[
            'confirm',
            {
              rules: [
                {
                  required: true,
                  message: '请确认你的密码'
                },
                {
                  validator: compareToFirstPassword
                }
              ],
              validateTrigger: 'onBlur'
            }
          ]"
          type="password"
          @blur="handleConfirmBlur"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="角色">
        <a-transfer
          :dataSource="mockData"
          :titles="['所有', '拥有']"
          showSearch
          :filterOption="filterOption"
          :targetKeys="targetKeys"
          @change="handleChange"
          @search="handleSearch"
          :render="item => item.title"
        >
        </a-transfer>
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
import { getRoles, saveUser } from '../../api/admin'

export default {
  data () {
    return {
      user: {
        username: '',
        nickname: '',
        email: '',
        password: '',
        authorities: []
      },
      id: 0,
      updatePassword: true,
      mockData: [
        {
          key: '',
          title: '',
          description: ''
        }
      ],
      targetKeys: [],
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
  },
  mounted () {
    this.getMock()
    this.initUser()
  },
  created () {
    this.getMock()
  },
  methods: {
    initUser () {
      if (this.$route.params && this.$route.params.id) {
        this.updatePassword = false
        this.user = this.$route.params
        this.id = this.$route.params['id']
      }
      if (this.user.authorities && this.user.authorities.length > 0) {
        this.user.authorities.forEach(role => {
          this.targetKeys.push(role['id'].toString())
        })
      }
    },
    getMock () {
      const targetKeys = []
      const mockData = []
      getRoles().then(res => {
        this.loadData = res['data']
        this.loadData.forEach(role => {
          const data = {
            key: role['id'].toString(),
            title: role['description'],
            description: role['name']
          }
          mockData.push(data)
        })
      })
      this.mockData = mockData
      this.targetKeys = targetKeys
    },
    filterOption (inputValue, option) {
      return option.description.indexOf(inputValue) > -1
    },
    handleChange (targetKeys, direction, moveKeys) {
      this.targetKeys = targetKeys
    },
    handleSearch (dir, value) {
    },
    handleSubmit (e) {
      e.preventDefault()
      const tmpUser = this.form.getFieldsValue()
      if (this.id > 0) {
        tmpUser.id = this.id
      }
      tmpUser.authorities = []
      this.targetKeys.forEach(i => {
        tmpUser.authorities.push({ 'id': i })
      })
      saveUser(tmpUser).then(res => {
        if (res.status && res.status === '200') {
          this.$router.push({
            name: 'users'
          })
        }
      }).catch(err => {
        this.$notification['error']({
          message: '错误',
          description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
          duration: 4
        })
      })
    },
    handleConfirmBlur (e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },
    compareToFirstPassword (rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue('password')) {
        // eslint-disable-next-line
        callback('Two passwords that you enter is inconsistent!')
      } else {
        callback()
      }
    },
    validateToNextPassword (rule, value, callback) {
      const form = this.form
      if (value && this.confirmDirty) {
        form.validateFields(['confirm'], { force: true })
      }
      callback()
    }
  }
}
</script>
