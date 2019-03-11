<template>
  <el-main>
    <el-form
      :model="LoginForm"
      ref="LoginForm"
      :rules="rule"
      label-width="0"
      class="login-form">
      <h3>用户登录系统</h3>

      <el-form-item prop="uname">
        <el-input
          type="text"
          v-model="LoginForm.uname"
          placeholder="用户名或邮箱" >
        </el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          type="password"
          v-model="LoginForm.password"
          placeholder="请输入密码" >
        </el-input>
      </el-form-item>

      <el-form-item >
        <el-button
          type="danger"
          class="submitBtn"
          round
          @click.native.prevent="submit"
          :loading="logining">
          登录
        </el-button>
        <el-button
          type="primary"
          class="resetBtn"
          round
          @click.native.prevent="reset">
          重置
        </el-button>
        <hr>
        <p>还没有账号，马上去<span class="to" @click="toregin">注册</span></p>
      </el-form-item>
    </el-form>
  </el-main>
</template>

<script>
  import VueEvent from '@/model/VueEvent.js'
  export default {
    // ....
    data () {
      return {
        LoginForm: {
          uname: '',
          password: ''
        },
        logining: false,
        rule: {
          uname: [
            {
              required: true,
              max: 14,
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
          ]
        }
      }
    },

    methods: {
      // ...
      submit () {
        this.$refs.LoginForm.validate(valid => {
          if (valid) {
            this.logining = true
            // this.$axios.get('http://localhost:18080/file').then(
            //   this.getFileSucc
            // )
            console.log('开始请求后台数据，验证返回之类的操作！'+this.LoginForm)
            var api = 'http://localhost:18080/login'
            var params = new URLSearchParams();
            params.append('uname', this.LoginForm.uname);
            params.append('password', this.LoginForm.password);
            console.log(params.toString())
            this.$axios.post(api, params,{
              headers:{ 'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(this.getLoginInfoSucc);
            this.logining = false;
          }else{
            console.log('submit err')
          }
        })
      },
      getLoginInfoSucc(res){
        console.log(res)
        //判断 成功给提示 并跳转主页
        let {code, msg, data} = res.data
        if(msg!=="成功"){
          this.$message({
            type: 'error',
            message: msg
          })
        }else
          {
            this.$message({
              type: 'success',
              message: '登入'+msg
            })

            // 跳转到我的信息的页面
            console.log(data)
            this.$router.push({
              name: '菜单',
              params: {

                uid: data.lid,
                uname: data.uname
              }
            })
        }
      },
      getFileSucc(res){
        console.log(res)
      },
      reset () {
        this.$refs.LoginForm.resetFields()
      },
      toregin () {
        this.$router.push('/regist')
      }
    }
  }
</script>

<style scoped>
  .login-form {
    margin: 20px auto;
    width: 310px;
    background: #fff;
    box-shadow: 0 0 35px #B4BCCC;
    padding: 30px 30px 0 30px;
    border-radius: 25px;
  }
  .submitBtn {
    width: 65%;
  }
  .to {
    color: #67C23A;
    cursor: pointer;
  }
</style>

