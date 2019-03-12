<template>
  <el-main>
    <el-form
      :model="ReginForm"
      ref="ReginForm"
      :rules="rule"
      class="regform"
      label-width="0">

      <h3>用户注册</h3>

      <el-form-item prop="username">
        <el-input
          type="text"
          v-model="ReginForm.username"
          placeholder="用户名或邮箱">
        </el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          type="password"
          v-model="ReginForm.password"
          placeholder="密码">
        </el-input>
      </el-form-item>

      <el-form-item prop="confirmpassword">
        <el-input
          type="password"
          v-model="ReginForm.confirmpassword"
          placeholder="确认密码">
        </el-input>
      </el-form-item>

      <el-form-item prop="email">
        <el-input
          type="email"
          v-model="ReginForm.email"
          placeholder="电子邮件">
        </el-input>
      </el-form-item>

      <el-form-item prop="tel">
        <el-input
          type="text"
          v-model.number="ReginForm.tel"
          placeholder="电话号码">
        </el-input>
      </el-form-item>

      <el-form-item prop="name">
        <el-radio v-model="ReginForm.sex" label="男">男</el-radio>
        <el-radio v-model="ReginForm.sex" label="女">女</el-radio>
      </el-form-item>

      <el-form-item >
        <el-button
          type="success"
          class="submitBtn"
          round
          @click.native.prevent="submit"
          :loading="logining">
          注册
        </el-button>
        <el-button
          type="primary"
          class="resetBtn"
          round
          @click.native.prevent="reset">
          重置
        </el-button>
        <hr>
        <p>已经有账号，马上去<span class="to" @click="tologin">登录</span></p>
      </el-form-item>

    </el-form>
  </el-main>
</template>
<script>
  export default {
    data () {

      let confirmpasswordCheck = (rule, value, callback) => {
        if (value === '') {
          console.log("密码验证："+this.ReginForm.password)
          return callback(new Error('密码是必须的'))
        } else if (value !== this.ReginForm.password) {
          return callback(new Error('两次输入的密码不一致'))
        } else {
          return callback()
        }
      }
      let telCheck = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('电话号码是必须的'))
        } else if (!Number.isInteger(value)) {
          return callback(new Error('电话号码必须是数字'))
        } else if (value.toString().length !== 11) {
          return callback(new Error('电话号码必须是11位数字'))
        } else {
          callback()
        }
      }
      return {
        uid: '',
        ReginForm: {
          username: '',
          password: '',
          confirmpassword: '',
          tel: '',
          email: '',
          sex: '',
        },
        logining: false,
        rule: {
          username: [
            {
              required: true,
              max: 20,
              min: 2,
              message: '用户名是必须的，长度为7-14位',
              trigger: 'blur'
            }
          ],
          password: [
            {
              required: true,
              message: '密码是必须的！',
              trigger: 'blur'
            }
          ],
          confirmpassword: [
            {
              required: true,
              validator: confirmpasswordCheck,
              trigger: 'blur'
            }
          ],
          tel: [
            {
              required: true,
              validator: telCheck,
              trigger: 'blur'
            }
          ],
          email: [
            {
              required: true,
              type: 'email',
              message: '请输入正确的电子邮件格式(xxx@xxx.com)',
              trigger: 'blur'
            }
          ]

        }
      }
    },
    methods: {
      // ...
      submit () {
        this.$refs.ReginForm.validate(valid => {
          if (valid) {
            this.logining = true
            console.log('开始写入后台数据！')
            var api = 'http://152.136.69.13:18080/user'
            var params = new URLSearchParams();
            params.append( 'uname', this.ReginForm.username);
            params.append('password', this.ReginForm.password);
            params.append('againpassword', this.ReginForm.confirmpassword);
            params.append('sex', this.ReginForm.sex );
            params.append('phone' , this.ReginForm.tel);
            params.append('email', this.ReginForm.email );
            this.$axios.post(api, params,{
              headers:{ 'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(this.getUerInfoSucc);
            this.logining = false;
          }
          else {
            console.log('submit err')
          }
        })
      },
      getUerInfoSucc(res){
        console.log(res)
        let {code, msg, data} = res.data
        console.log(data)
        if(msg!=="成功"){
          this.$message({
            type: 'error',
            message: msg
          })
        }else
        {
          this.$message({
            type: 'success',
            message: '注册'+msg
          })
          // 跳转到我的信息的页面

          this.$router.push({
            name: '菜单',
            params: {
              uid: data.uid,
              uname: data.uname
            }
          })
        }
      },
      reset () {
        this.$refs.ReginForm.resetFields()
      },
      tologin () {
        this.$router.push('/')
      }
    }
  }
</script>

<style scoped>
  .regform {
    margin: 20px auto;
    width: 310px;
    background: #fff;
    box-shadow: 0 0 10px #B4BCCC;
    padding: 30px 30px 0 30px;
    border-radius: 25px;
  }
  .submitBtn {
    width: 65%;
  }
  .to {
    color: #FA5555;
    cursor: pointer;
  }
</style>
