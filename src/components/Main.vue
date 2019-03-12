<template>
  <section>
    <el-container class="container">
      <!--左边-->
      <el-aside :width="collapsed? '65px' : '200px' ">
        <el-container>
          <el-header>
          <span class="menu-button" v-if="collapsed" @click.prevent="collapsed=!collapsed">
            <i class="fa fa-align-justify"></i>
          </span>
            <span v-else class="system-name">{{systemName}}</span>
          </el-header>
          <el-main>
            <el-menu :default-active="$route.path" :collapse="collapsed">
              <template v-for="(item,index) in menus">
                <el-submenu :index="index+''" v-if="!item.leaf">
                  <template slot="title"><i :class="item.iconCls"></i>
                    <span v-if="!collapsed">{{item.name}}</span>
                  </template>
                  <el-menu-item v-for="child in item.children"
                                :index="child.path" :key="child.path"
                                @click="$router.push({
            name: child.name,
            params: {
              uid: urootid

            }
          })">
                    {{child.name}}
                  </el-menu-item>
                </el-submenu>
                <el-menu-item v-if="item.leaf&&item.children.length>0"
                              :index="item.children[0].path"><i :class="item.iconCls"></i>
                  {{item.children[0].name}}
                </el-menu-item>
              </template>
            </el-menu>
          </el-main>
        </el-container>
      </el-aside>
      <!--内容-->
      <el-container>
        <!--页眉-->
        <el-header class="header">
          <el-row>
            <el-col :span="18" class="header-title">
              <span v-if="collapsed" class="system-name">{{systemName}}</span>
              <span v-else class="menu-button" @click.prevent="collapsed=!collapsed">
              <i class="fa fa-align-justify"></i>
            </span>
            </el-col>
            <el-col :span="6">
              <span class="el-dropdown-link userinfo-inner">
              你好：{{userName}} 用户
            </span>
              <el-button  @click="loadUIfo"
                         class="userinfo-inner"><i class="el-icon-edit-outline" ></i>
                修改</el-button>

              <el-button  @click="dialogVisible1 = true"
                          class="userinfo-inner"><i class="el-icon-close"></i>
                注销</el-button>

            </el-col>
          </el-row>
        </el-header>
        <!--中间-->
        <el-main class="main">
          <transition name="el-zoom-in-center" mode="out-in">
            <router-view></router-view>
          </transition>
        </el-main>
      </el-container>
    </el-container>
    <!--对话框-->
    <el-dialog title="用户信息修改" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form :model="form" label-width="100px" :rules="rule" ref="form">
        <el-form-item label="姓名" >
          <el-input v-model="form.uname" :disabled="true" />
        </el-form-item>
        <el-form-item label="电话号码" >
          <el-input v-model="form.tel" />
        </el-form-item>
        <el-form-item label="电子邮件" >
          <el-input v-model="form.email" />
        </el-form-item>

        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="form.sex" >
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click.native="modiUInfo">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title=""
      :visible.sync="dialogVisible1"
      width="30%"
     >
      <span>确定退出？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible1 = false">取 消</el-button>
    <el-button type="primary" @click="dialogout">确 定</el-button>
  </span>
    </el-dialog>
  </section>

</template>

<script>

  let dialogout = function () {

    this.$router.push('/')
  }
  let loadUIfo = function () {
    var api = 'http://127.0.0.1:18080/user/'+this.urootid
    this.$axios.get(api).then(this.getUserInfosucc)
    this.dialogVisible = true
  }
  let getUserInfosucc = function(res){
    if(res.data.msg==='成功'){
      this.form.uid = res.data.data.uid;
      this.form.uname = res.data.data.uname;
      this.form.tel = res.data.data.phone;
      this.form.email =res.data.data.email;
      this.form.sex = res.data.data.sex;
    }
  }
  let modiUInfo = function () {

        var api = 'http://127.0.0.1:18080/user/'+this.urootid
        var params = new URLSearchParams();
        params.append( 'uname', this.form.uname);
        params.append('uid', this.form.uid);
        params.append('sex', this.form.sex );
        params.append('phone' , this.form.tel);
        params.append('email', this.form.email );
        this.$axios.put(api, params,{
          headers:{ 'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(this.getUerInfoSucc);



    this.dialogVisible = false
  }
  let initMenu = function() {
    for (let i in this.$router.options.routes) {
      let root = this.$router.options.routes[i]
      if (root.hidden)
        continue
      let children = []
      for (let j in root.children) {
        let item = root.children[j]
        if (item.hidden)
          continue
        children.push(item)
      }

      if (children.length < 1)
        continue

      this.menus.push(root)
      root.children = children
    }
  }

  export default {
    data (){
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
      return{
        collapsed: false,
        systemName: '网络云盘管理系统',
        userName: '',
        urootid: '',
        menus: [],
        dialogVisible: false,
        dialogVisible1: false,
        form:{
          uid: '',
        uname: '',
        tel: '',
        email: '',
        sex: ''},

        rule: {
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
      initMenu,
      dialogout,
      modiUInfo,
      loadUIfo,
      getUserInfosucc


    },
    mounted: function() {
      this.urootid = this.$route.params.uid
      this.userName = this.$route.params.uname
      console.log("1111111111111"+this.urootid)
      // if(this.userName==null){
      //   this.$router.push('/')
      // }
      this.initMenu()
    }
  }
</script>




<style scoped="scoped"
       lang="scss">
  $width: 100%;
  $height: 100%;
  $background-color: #0b0a3e;
  $header-color: #fff;
  $header-height: 60px;
  .regform {
    margin: 20px auto;
    width: 310px;
    background: #fff;
    box-shadow: 0 0 10px #B4BCCC;
    padding: 30px 30px 0 30px;
    border-radius: 25px;
  }
  .container {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    .el-aside {
      .el-header {
        line-height: $header-height;
        background-color: $background-color;
        color: $header-color;
        text-align: center;
      }
      .el-container {
        height: $height;
        .el-main {
          padding: 0;
        }
      }
    }

    .main {
      width: $width;
      height: $height;
    }

    .menu-button {
      width: 14px;
      cursor: pointer;
    }

    .userinfo-inner {
      cursor: pointer;
    }

    .el-menu {
      height: $height;
    }

    .header {
      background-color: $background-color;
      color: $header-color;
      text-align: center;
      line-height: $header-height;
      padding: 0;

      .header-title {
        text-align: left;
        span {
          padding: 0 20px;
        }
      }
    }

    .system-name {
      font-size: large;
      font-weight: bold;
    }
  }
</style>
