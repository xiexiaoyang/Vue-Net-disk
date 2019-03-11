<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters"   align="left" >
        <el-form-item  >
          <el-input v-model="fnameQuery" placeholder="请输入文件名 all" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="handleQuery " icon="el-icon-search" >查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="handleupLoad" icon="el-icon-upload">上传</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-table :data="rows" style="width: 100%" stripe border  height="550"
              :default-sort = "{prop: ['fname','size','date'], order: 'descending'}">

      <el-table-column label="文件名" :show-overflow-tooltip="true" align="left" prop="fname" sortable>
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>文件名: {{ scope.row.filename }}</p>
            <p>文件类型: {{ scope.row.filetype }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.filename }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="300"  align="left">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"><i class="el-icon-edit"></i>编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"><i class="el-icon-delete"></i>删除</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="handleDownload(scope.$index, scope.row)"><i class="el-icon-download"></i>下载</el-button>
        </template>
      </el-table-column>
      <el-table-column label="大小" width="200" align="left" prop="size" sortable>
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.filesize }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改日期" width="200" align="left"   prop="date" sortable >
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.modifieddate }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!--对话框-->
    <el-dialog title="修改文件名" :visible.sync="formVisible" :close-on-click-modal="false">
      <el-form  label-width="100px" >
        <el-form-item label="文件名" prop="name">
          <el-input v-model="fname" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="formVisible = false">取消</el-button>
        <el-button type="primary" @click.native="handleModiSubmit" >提交</el-button>
      </div>
    </el-dialog>
<!--上传-->
    <el-dialog title="文件上传" :visible.sync="upLoadVisible" :close-on-click-modal="false">
      <template>
        <!--<div class="hello">-->
          <!--<form>-->
            <!--<input type="file" @change="getFile($event)">-->
            <!--<button class="button button-primary button-pill button-small" @click="submit($event)">提交</button>-->
          <!--</form>-->
        <!--</div>-->
        <el-upload
          class="upload-demo"
          ref="upload"
          :action="'http://localhost:18080/upload/singlefile/'+this.uid"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          :auto-upload="false"
          :data="updata"
          :on-success = 'handleSucess'
          :on-error = 'handleuploadError'
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
          <div slot="tip" class="el-upload__tip"></div>
        </el-upload>
      </template>

    </el-dialog>
  </section>
</template>

<script>
  let data = () => {
    return {
      uid: '',
      filters: {},
      rows: [],
      res: {},
      formVisible: false,
      upLoadVisible: false,
      fname: '',
      index: '',
      fnameQuery: '',
      file: '',
      updata: {
        uname: '小白'
      },
      fileList: []
    }
  }
let handleQuery = function () {
  for(var i=0; i<this.rows.length; i++ ){
    if(this.rows[i].filename.indexOf(this.fnameQuery) == -1){
      this.rows.splice(i--,1)
    }
  }
}
  let handleupLoad = function() {
    this.upLoadVisible = true
  }

  let handleEdit = function(index, row) {
    this.fname = row.filename
    this.index = index
    this.formVisible = true
  }
let handleModiSubmit = function () {
  var row1 = this.rows[this.index]
  console.log(row1)
  var api = 'http://localhost:18080/file/'+row1.fid
  var params = new URLSearchParams();
  params.append( 'fid', row1.fid);
  params.append( 'filename', this.fname);
  this.$axios.put(api, params,{
    headers:{ 'Content-Type': 'application/x-www-form-urlencoded'}
  }).then(this.getModiSucc);

}
let getModiSucc = function (resm) {
  if(resm.data.msg=='成功'){
    this.$message({
      type: 'success',
      message: '修改成功!'
    })
    this.formVisible = false

    this.getRows()
  }
}
  let handleDelete = function(index, row) {
    this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {

      this.$axios.delete('http://localhost:18080/file/' + row.fid).then(res => {

        if (!res.data.msg=='成功') {
          this.$message({
            type: 'error',
            message: res.data.message
          })
          return
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getRows()
      })
    }).catch(e => {})
  }
let handleDownload = function(index, row) {
  var api = 'http://localhost:18080//Download/'+row.fid;
  this.$axios.get(api).then(function (res) {
    if(res){
      alert("下载成功! 文件保存在 C:\\Users\\25090\\Desktop\\down")

    }else{
      alert("下载失败！")
    }
  })
  console.log(index, row);
}
let getFileInfosucc = function (res) {
    console.log(res)
    if(res.data.msg==="成功"){

      this.rows = res.data.data;

    }

}
  let getRows = function() {

    var api = 'http://localhost:18080/fall/'+this.uid;
    this.$axios.get(api).then(this.getFileInfosucc);

  }

  export default {
    data: data,
    methods: {
      //添加
      handleupLoad,
      //修改
      handleEdit,
      //删除
      handleDelete,
      //下载
      handleDownload,
      getRows,
      getFileInfosucc,
      handleModiSubmit,
      getModiSucc,
      handleQuery,

      submitUpload() {
        this.$refs.upload.submit();
        //this.afterUpload()
      },
      afterUpload(){
        var api = 'http://localhost:18080/upload/getUid/'+this.uid;
        this.$axios.get(api).then(function (res) {
          console.log(res);
        })
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleSucess(){
        this.$message({
          type: 'success',
          message: '上传成功!'
        })
        this.getRows();
        this.$refs.upload.clearFiles();
        this.upLoadVisible = false

      }
      ,
      handleuploadError(){
        this.$message({
          type: 'error',
          message: "上传失败"
        })
      }
    },


    mounted: function() {
      this.uid = this.$route.params.uid
      this.getRows()
    }
  }
</script>

<style scoped>
</style>

