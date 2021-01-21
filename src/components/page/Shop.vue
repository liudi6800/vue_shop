<template>
  <div>

    <el-form :inline="true" ref="eachFroms" :model="eachFroms" class="demo-form-inline">
      <el-form-item label="品牌名称" prop="name">
        <el-input v-model="eachFroms.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="eachFromSubmit">查询</el-button>
        <el-button type="primary" @click="eachFromRes('eachFroms')">重置</el-button>
      </el-form-item>
    </el-form>


    <el-button type="primary" @click="addluyou">
    <router-link to="/addShop">新增商品</router-link>
    </el-button>

    <el-table
      :data="shopData"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="商品名称"
        width="80">
      </el-table-column>
      <el-table-column
        prop="title"
        label="商品标题"
        width="80">
      </el-table-column>
      <el-table-column
        :formatter="bandAll"
        prop="bandId"
        label="商品品牌"
        width="80">
      </el-table-column>
      <el-table-column
        prop="productdecs"
        label="商品介绍"
        width="180">
      </el-table-column>
      <el-table-column
        prop="price"
        label="商品价格"
        width="80">
      </el-table-column>
      <el-table-column
        prop="stocks"
        label="商品库存"
        width="80">
      </el-table-column>

      <el-table-column
        prop="imgPath"
        label="商品图片"
        width="140">
        <template slot-scope="scope">
          <img   style="width: 100px; height: 100px"  :src="scope.row.imgPath"  />
        </template>
      </el-table-column>

      <el-table-column    align="center"  label="是否上架"  width="180"  >

        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isDel"
            :active-value="0"
            :inactive-value="1"
            active-text="是"
            inactive-text="否"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="change(scope.row)">
          </el-switch>

        </template>
      </el-table-column>



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
      :page-sizes="[3, 5, 7, 10]"
      :page-size="100"
      layout="total,sizes, prev, pager, next, jumper "
      :total="count">
    </el-pagination>







    <!--   修改品牌模板-------------------->
    <el-dialog title="修改商品"  :visible.sync="updateHtml">
      <el-form ref="updateForm"   :model="updateForm" label-width="80px">
        <el-form-item label="商品品牌" prop="bandId">
          <el-select v-model="updateForm.bandId" placeholder="请选择" >
            <el-option
              v-for="item in shopBand"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品名称" prop="name">
          <el-input v-model="updateForm.name"></el-input>
        </el-form-item>

        <el-form-item label="商品标题" prop="title">
          <el-input v-model="updateForm.title"></el-input>
        </el-form-item>

        <el-form-item label="商品介绍">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
            v-model="updateForm.productdecs">
          </el-input>

        </el-form-item>

        <el-form-item label="商品价格">
          <el-input-number v-model="updateForm.price"  :step="0.1" ></el-input-number>
        </el-form-item>

        <el-form-item label="商品库存">
          <el-input-number v-model="updateForm.stocks"></el-input-number>

        </el-form-item>

        <el-form-item label="商品排序">
          <el-input-number v-model="updateForm.sortNum"></el-input-number>

        </el-form-item>

        <el-form-item label="商品图片" prop="imgpaths">
          <el-upload
            class="avatar-uploader"
            action="http://localhost:8083/api/brand/uploadImgPath"
            :show-file-list="false"
            :on-success="LoglocadSucces">
            <img v-if="imagPath" :src="imagPath"  class="avatar" v-model="updateForm.imgPath">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="margin-top: 12px;" @click="updateFrom('updateFrom')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>







</template>

<script>
    export default {
        name: "Shop",
      data(){
          return{
            eachFroms:{
              page:1,
              limit:3,
              name:""
            },
            updateForm:{
              bandId:"",
              name:"",
              title:"",
              productdecs:"",
              price:"",
              stocks:"",
              sortNum:"",
              imgPath:""
            },
            shopData:[],
            shopBand:[],
            count:0,
            updateHtml:false,
            imagPath:""

          }
      },
      created:function () {
          this.queryBand();
        this.queryShopData();
      },
      methods:{
        queryShopData:function () {
          this.$ajax.get("http://localhost:8083/api/shop/selectShop?"+this.$qs.stringify(this.eachFroms)).then(res=>{
            this.shopData=res.data.data.data;
            this.count=res.data.data.count;
          }).catch(err=>{console.log(err)});
        },
        queryBand:function () {
          this.$ajax.get("http://192.168.1.224:8083/api/brand/getAllBandData").then(res=>{
            this.shopBand=res.data.data;
          }).catch(err=>{console.log(err)});
        },
        bandAll:function (a,b,c,d) {
          for (let i = 0; i <this.shopBand.length ; i++) {
            if(this.shopBand[i].id==c){
              return this.shopBand[i].name;
            }
          }
        },
        handleSizeChange:function (val) {
          this.eachFroms.limit=val;
          this.queryShopData();
        },
        handleCurrentChange:function (val) {
          this.eachFroms.page=val;
          this.queryShopData();
        },
        handleEdit:function (index,row) {
          this.updateHtml=true;
          this.updateForm= JSON.parse(JSON.stringify(row));
          this.imagPath=row.imgPath;
        },
        updateFrom:function () {
        this.$ajax.post("http://localhost:8083/api/shop/updateShop",this.$qs.stringify(this.updateForm)).then(res=>{
          this.updateHtml=false;
          this.$message.success("修改成功");
          this.queryShopData();
        })
        },
        LoglocadSucces:function (a) {
          this.updateForm.imgPath=a.data;
          this.imagPath=a.data;
        },
        eachFromSubmit:function () {
          this.queryShopData();
        },
        eachFromRes:function (eachFroms) {
          this.$refs[eachFroms].resetFields();

        },
        change:function (row) {
          debugger;
          this.$ajax.delete("http://localhost:8083/api/shop/delShop",{
            params:{
              id:row.id,isDel:row.isDel
            }
          }).then(res=> this.quertShopPropertyData()).catch(err=>console.log(err));

        },





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
