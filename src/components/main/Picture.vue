<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters"   align="left" >
        <el-form-item  >
          <el-input v-model="filters.query" placeholder="请输入文件名 图片" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getRows" icon="el-icon-search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="handleAdd" icon="el-icon-upload">上传</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-table :data="rows" style="width: 100%" stripe border  height="550">

      <el-table-column label="文件名" :show-overflow-tooltip="true" align="left">
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
      <el-table-column label="大小" width="200" align="left">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.filesize }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改日期" width="200" align="left">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.modifieddate }}</span>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
  let data = () => {
    return {
      filters: {},
      rows: [],
      res: {}
    }
  }

  let handleAdd = function() {


  }

  let handleEdit = function(index, row) {
    console.log(index, row);
  }

  let handleDelete = function(index, row) {
    console.log(index, row);
  }
  let handleDownload = function(index, row) {

    console.log(index, row);
  }
  let getFileInfosucc = function (res) {
    console.log(res)
    if(res.data.msg==="成功"){

      this.rows = res.data.data;
      for(var i=0; i<this.rows.length; i++ ){
        if(this.rows[i].filetype ==='图片'){

        }else{
          this.rows.splice(i--,1)
        }
      }
    }

  }
  let getRows = function() {

    var api = 'http://127.0.0.1:18080/fall/'+this.uid;
    this.$axios.get(api).then(this.getFileInfosucc);

  }

  export default {
    data: data,
    methods: {
      //添加
      handleAdd,
      //修改
      handleEdit,
      //删除
      handleDelete,
      //获取分页
      getRows,
      getFileInfosucc
    },
    mounted: function() {
      this.uid = this.$route.params.uid
      this.getRows()
    }
  }
</script>

<style scoped>
</style>

