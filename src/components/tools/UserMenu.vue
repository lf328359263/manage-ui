<template>
  <div class="user-wrapper">
    <div class="content-box">
      <a href="https://pro.loacg.com/docs/getting-started" target="_blank">
        <span class="action">
          <a-icon type="question-circle-o"></a-icon>
        </span>
      </a>
      <notice-icon class="action"/>
      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <a-avatar class="avatar" size="small" :src="avatar()"/>
          <span>{{ nickname() }}</span>
        </span>
        <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
          <a-menu-item key="0">
            <router-link :to="{ name: 'center' }">
              <a-icon type="user"/>
              <span>个人中心</span>
            </router-link>
          </a-menu-item>
          <!--<a-menu-item key="1">-->
          <!--<router-link :to="{ name: 'settings' }">-->
          <!--<a-icon type="setting"/>-->
          <!--<span>账户设置</span>-->
          <!--</router-link>-->
          <!--</a-menu-item>-->
          <a-menu-item key="1">
            <a-icon type="key"/>
            <span @click="showModal">修改密码</span>
            <a-modal
              v-model="visible"
              title="修改密码"
              onOk="handleOk"
            >
              <template slot="footer">
                <a-button key="back" @click="handleCancel">取消</a-button>
                <a-button
                  type="primary"
                  htmlType="submit"
                  class="register-button"
                  @click.stop.prevent="handleSubmit"
                >确认
                </a-button>
              </template>
              <a-form :form="form" @submit="handleSubmit" style="width: 50%">
                <a-form-item v-bind="formItemLayout" label="原密码">
                  <a-input
                    v-decorator="[
                      'history',
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
                <a-form-item v-bind="formItemLayout" label="新密码">
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
                <a-form-item v-bind="formItemLayout" label="确认密码">
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
              </a-form>
            </a-modal>
          </a-menu-item>
          <a-menu-divider/>
          <a-menu-item key="3">
            <a href="javascript:;" @click="handleLogout">
              <a-icon type="logout"/>
              <span>退出登录</span>
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
import NoticeIcon from '@/components/NoticeIcon'
import { mapActions, mapGetters } from 'vuex'
import { updatePassword } from '../../api/admin'

export default {
  name: 'UserMenu',
  components: {
    NoticeIcon
  },
  data () {
    return {
      visible: false,
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        }
      }
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  methods: {
    ...mapActions(['Logout']),
    ...mapGetters(['nickname', 'avatar']),
    handleSubmit (e) {
      e.preventDefault()
      const formData = this.form.getFieldsValue()
      updatePassword(formData).then(res => {
        if (res.status && res.status === '200') {
          this.$notification.success({
            message: '密码修改',
            description: '成功'
          })
          this.handleCancel()
        } else {
          this.$notification.error({
            message: 'ERROR',
            description: res.msg
          })
        }
      })
    },
    showModal () {
      this.visible = true
    },
    handleCancel (e) {
      this.visible = false
    },
    handleConfirmBlur (e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },
    compareToFirstPassword (rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue('password')) {
        // eslint-disable-next-line
        callback('两次密码输入不一致')
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
    },
    handleLogout () {
      const that = this

      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk () {
          return that.Logout({}).then(() => {
            window.location.reload()
          }).catch(err => {
            that.$message.error({
              title: '错误',
              description: err.message
            })
          })
        },
        onCancel () {
        }
      })
    }
  }
}
</script>
