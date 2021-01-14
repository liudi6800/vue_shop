<template>
    <div>
      <el-form :inline="true" ref="eachFrom" :model="eachFrom" class="demo-form-inline">
        <el-form-item label="品牌名称" prop="name">
          <el-input v-model="eachFrom.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="eachFromSubmit">查询</el-button>
          <el-button type="primary" @click="eachFromRes('eachFrom')">重置</el-button>
        </el-form-item>
      </el-form>

      <el-button type="primary" @click="addBrand">新增品牌</el-button>
      <el-table  :data="data"  style="width: 100%">
        <el-table-column type="selection" width="55"> </el-table-column>

        <el-table-column prop="id"  label="序号" width="180"> </el-table-column>

        <el-table-column  prop="name"  label="品牌名称"  width="180"> </el-table-column>

        <el-table-column  prop="bandE"  label="首字母"   width="180">  </el-table-column>

        <el-table-column  prop="imgpath" label="图片log"  width="180">
          <template slot-scope="scope">
            <img style="width: 100px; height: 100px"  :src="'http://localhost:8083'+scope.row.imgpath"  />
          </template>
        </el-table-column>

        <el-table-column   prop="isdel" label="是否展示" width="180"  :formatter="formatterIsdel">  </el-table-column>

        <el-table-column prop="bandDesc"  label="品牌介绍"  width="180"> </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit"  circle size="mini" type="danger"
              @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[2, 3, 5, 7]"
        :page-size="100"
        layout="total,sizes, prev, pager, next, jumper "
        :total="count">
      </el-pagination>

      <!--   新增模板-->
      <el-dialog title="新增品牌"  :visible.sync="addHtml"  >
      <el-form ref="addForm" :model="addForm" label-width="180px"  >
        <el-form-item label="品牌名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="品牌首字母" prop="bandE">
          <el-input v-model="addForm.bandE"></el-input>
        </el-form-item>

        <el-form-item label="品牌Log" prop="imgpath">
          <el-upload
            class="avatar-uploader"
            action="http://192.168.1.224:8083/api/brand/uploadImgPath"
            :show-file-list="false"
            :on-success="uploadSucces">
            <img v-if="imagPath" :src="'http://localhost:8083'+imagPath"  class="avatar" v-model="addForm.imgpath">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="品牌故事" prop="bandDesc">
          <el-input
            type="textarea"
            :rows="4"
            autosize
            show-word-limit="true"
            placeholder="请输入内容"
            maxlength="50"
            v-model="addForm.bandDesc">
          </el-input>

        </el-form-item>

        <el-form-item label="品牌排序" prop="ord">
          <el-input v-model="addForm.ord"></el-input>
        </el-form-item>

        <el-form-item label="是否显示" prop="isdel">
            <el-radio v-model="addForm.isdel" label="0" border>是</el-radio>
            <el-radio v-model="addForm.isdel" label="1" border>否</el-radio>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="addSubmit">立即新增</el-button>
          <el-button @click="addRest('addForm')">取消</el-button>
        </el-form-item>
      </el-form>
      </el-dialog>

      <!--   修改品牌模板-------------------->
      <el-dialog title="修改品牌"  :visible.sync="updateHtml">
        <el-form ref="updateForm"  :model="updateForm" label-width="180px">
          <el-input v-model="updateForm.id" disabled></el-input>
          <el-form-item label="品牌名称" prop="name">
            <el-input v-model="updateForm.name"></el-input>
          </el-form-item>
          <el-form-item label="品牌首字母" prop="bandE">
            <el-input v-model="updateForm.bandE"></el-input>
          </el-form-item>

          <el-form-item label="品牌Log" prop="imgpaths">
            <el-upload
              class="avatar-uploader"
              action="http://192.168.1.224:8083/api/brand/uploadImgPath"
              :show-file-list="false"
              :on-success="updateuploadSucces">
              <img v-if="imagPath" :src="'http://localhost:8083'+imagPath"  class="avatar" v-model="updateForm.imgpaths">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <el-form-item label="品牌故事" prop="bandDesc">
            <el-input
              type="textarea"
              :rows="4"
              autosize
              placeholder="请输入内容"
              show-word-limit="true"
              maxlength="50"
              v-model="updateForm.bandDesc">
            </el-input>

          </el-form-item >
          <el-form-item label="品牌排序" prop="ord">
            <el-input v-model="updateForm.ord"></el-input>
          </el-form-item>

          <el-form-item label="是否显示" prop="isdel">
            <el-radio v-model="updateForm.isdel" :label="0" border>是</el-radio>
            <el-radio v-model="updateForm.isdel" :label="1" border>否</el-radio>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="updateSubmit">立即修改</el-button>
            <el-button type="primary" @click="updateRest('updateForm')">取消</el-button>
          </el-form-item>

        </el-form>
      </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "ShopBrand",
      data(){
          return{
            data:[],
            addForm:{
              name:"",
              imgpath:"",
              bandE:"",
              bandDesc:"",
              ord:"",
              isdel:"0"
            },
            updateForm:{
              id:"",
              name:"",
              imgpath:"",
              bandE:"",
              bandDesc:"",
              ord:"",
              isdel:"0",
            },
            eachFrom:{
              page:"1",
              limit:"2",
              name:""
            },
            count:0,
            addHtml:false,
            updateHtml:false,
            imagPath:"",
          }
      },
      created:function () {
      this.quertShopBrandData();
      },
      methods:{
        handleSizeChange:function (val) {
          this.eachFrom.limit=val;
         this.quertShopBrandData();
        },
        handleCurrentChange:function (val) {
          this.eachFrom.page=val;
          this.quertShopBrandData();
        },
        handleEdit:function (index,row) {
          this.updateHtml=true;
          this.imagPath="";
          this.updateForm=row;
          this.imagPath=row.imgpath;
        },
        quertShopBrandData:function () {
          var qthis=this;
          this.$ajax.get("http://192.168.1.224:8083/api/brand/getData?"+this.$qs.stringify(this.eachFrom)).then(
            function (res) {
              qthis.data=res.data.data.data;
              qthis.count=res.data.data.count;
            }
          ).catch(err=>console.log(err))
        },
        addBrand:function () {
          this.$nextTick(()=>{
            this.$refs[addForm].resetFields();
          })
          this.imagPath="";
          this.addHtml=true;
        },
        addSubmit:function () {
          this.$ajax.post("http://192.168.1.224:8083/api/brand/add",this.$qs.stringify(this.addForm)).then((res)=>{
              console.log(res);
              this.addHtml=false;
              location.reload();
          }
          ).catch(err=>console.log(err))
        },
        updateSubmit:function(){
          console.log(this.updateForm);
          this.$ajax.post("http://192.168.1.224:8083/api/brand/update",this.$qs.stringify(this.updateForm)).then((res)=>{
              console.log(res);
              this.updateHtml=false;
              location.reload();
            }
          ).catch(err=>console.log(err))
        },
        uploadSucces:function (a) {
         this.addForm.imgpath=a.data;
          this.imagPath=a.data;
        },
        updateuploadSucces:function (a) {
          this.updateForm.imgpaths=a.data;
          this.imagPath=a.data;
        },
         addRest:function (addFrom) {
          this.addHtml=false;
          this.$refs[addFrom].resetFields();
        },
        updateRest:function (updateFrom) {
          this.updateHtml=false;
          this.$refs[updateFrom].resetFields();
        },
        eachFromRes:function(eachFromRes){
          this.$refs[eachFromRes].resetFields();
        },
        eachFromSubmit:function () {
          this.quertShopBrandData();
        },
        formatterIsdel:function (a,b,c,d) {
          return c==0?"是":"否";
        }
      }
    }
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
