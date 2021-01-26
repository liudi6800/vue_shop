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



    <router-link to="/addShop"><el-button type="primary">新增商品 </el-button></router-link>


    <el-table
      :data="shopData"
      style="width: 100%">

      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="id"
        label="商品序号"
        width="80">
      </el-table-column>
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
        :formatter="typeAll"
        prop="typeId"
        label="商品类型"
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

      <el-table-column label="属性参数" align="center">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit"  circle size="mini" type="danger"
                     @click="skuEdit(scope.$index, scope.row)">sku属性</el-button>

          <el-button icon="el-icon-edit"  circle size="mini" type="danger"
                     @click="noSkuEdit(scope.$index, scope.row)">非sku属性</el-button>
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



    <!--                  修改sku数据模板          -->

    <el-dialog title="修改Sku属性"  :visible.sync="skuHtml">

      <el-form ref="form" :model="addForm2" label-width="80px">


        <el-form-item label="商品类型" prop="typeId"    >
          <el-select v-model="addForm2.typeId" placeholder="请选择" style="width: 300px"  >
            <el-option
              v-for="item in shopType"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item  v-if="skuData.length>0"  label="商品规格">
          <el-form-item  v-for="a in skuData" :key="a.id" :label="a.nameCH" >


            <el-checkbox-group v-if="a.type==2" v-model="a.isCheck" >
              <el-checkbox-button v-for="b in a.values"     :key="b.id" :label="b.nameCH"  @change="skuChang()" ></el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
        </el-form-item>


        <el-table

          v-if="tableShow"
          :data="tableData"
          style="width: 100%">

          <el-table-column width="220" v-for="item in cols" :key="item.id" :prop="item.name"
                           :label="item.nameCH" >
          </el-table-column>

          <el-table-column

            label="价格"
            width="180">
            <template slot-scope="scope">
              <el-input  v-model="scope.row.prices"  />
            </template>
          </el-table-column>

          <el-table-column

            label="库存"
            width="180">
            <template slot-scope="scope">
              <el-input   v-model="scope.row.storcks"  />
            </template>
          </el-table-column>

        </el-table>



        <el-form-item  v-if="proData.length>0"  label="商品参数" >
          <el-form-item  v-for="a in proData" :key="a.id" :label="a.nameCH" >

            <el-select v-if="a.type==0"   v-model="a.isCheck" placeholder="请选择">
              <el-option
                v-for="b in a.values"
                :key="b.id"
                :label="b.nameCH"
                :value="b.id">
              </el-option>
            </el-select>

            <el-radio-group v-if="a.type==1" v-model="a.isCheck">
              <el-radio v-for="b in a.values" :key="b.id"  :label="b.id"  >{{b.nameCH}}</el-radio>
            </el-radio-group>

            <el-checkbox-group v-if="a.type==2"  v-model="a.isCheck">
              <el-checkbox-button v-for="b in a.values"    :key="b.id" :label="b.nameCH"></el-checkbox-button>
            </el-checkbox-group>


            <el-input v-if="a.type==3" v-model="a.isCheck"></el-input>

          </el-form-item>
        </el-form-item>

        <el-button type="primary" style="margin-top: 12px;" @click="updateSkuFrom" >提交，提交商品信息</el-button>
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
            addForm2:{

            },
            shopData:[],
            shopBand:[],
            shopType:[],
            count:0,
            updateHtml:false,
            skuHtml:false,
            noSkuHtml:false,
            imagPath:"",
            tableShow:false,
            skuData:[],
            proData:[],
            tableData:[],
            TypeDataData:[],
            typeId:"",
            cols:[],//表动态列头
          }
      },
      created:function () {
          this.queryBand();
          this.queryType();
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
          this.$ajax.get("http://localhost:8083/api/brand/getAllBandData").then(res=>{
            this.shopBand=res.data.data;
          }).catch(err=>{console.log(err)});
        },queryType:function () {
          this.$ajax.get("http://localhost:8083/api/type/getData").then(res=>{
            this.shopType=res.data.data;
          }).catch(err=>{console.log(err)});
        },
        bandAll:function (a,b,c,d) {
          for (let i = 0; i <this.shopBand.length ; i++) {
            if(this.shopBand[i].id==c){
              return this.shopBand[i].name;
            }
          }
        },
        typeAll:function(a,b,c,d){
          for (let i = 0; i <this.shopType.length ; i++) {
            if(this.shopType[i].id==c){
              return this.shopType[i].name;
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
        skuEdit:async function (index,row) {
        this.skuHtml=true;
        this.addForm2.typeId=JSON.parse(JSON.stringify(row.typeId));
        await this.getBandData2();

          await this.getBandData(row.id);

           this.showTable();

        },

        getBandData:async function(id){


          this.tableShow=false;
          let datas=await this.$ajax.get("http://localhost:8083/api/property/selectShopProByproId?proId="+id);
          //处理sku
          debugger;
          let data=datas.data.data.skudata;
          //遍历所有的sku属性
          for (let i = 0; i <this.skuData.length ; i++) {
            //得到一个sku属性
            this.skuData[i].isCheck=data[this.skuData[i].name];
          }

          //处理attr
          let data2=datas.data.data.attrdata;
          //遍历所有的sku属性
          for (let i = 0; i <this.proData.length ; i++) {
            //得到一个sku属性
            this.proData[i].isCheck=data2[this.proData[i].name];
          }

          //table赋值
          this.tableData=datas.data.data.tableData;



        },

        showTable:function(){



          //判断是否需要回显table
          if(this.skuData.length>0){
            this.tableShow=true;
            //设置动态表头 //动态表头[ {id:skudata.id,name:skudata.name,nameCH:skudata.nameCH}]
            for (let i = 0; i <this.skuData.length ; i++) {
              this.cols.push({"id":this.skuData[i].id,"nameCH":this.skuData[i].nameCH,"name":this.skuData[i].name});
            }

          }

        },
        skuChang:function () {

          this.cols=[];
          this.tableData=[];

          //声明笛卡尔积的参数
          let dikaParams=[];
          let flag=true;
          for (let i = 0; i <this.skuData.length ; i++) {

            this.cols.push({"id":this.skuData[i].id,"nameCH":this.skuData[i].nameCH,"name":this.skuData[i].name});
            //添加笛卡尔积参数
            dikaParams.push(this.skuData[i].isCheck);

            if(this.skuData[i].isCheck.length==0){
              flag=false;
              break;
            }
          }
          if(flag==true){
            let res=this.calcDescartes(dikaParams);

            for (let i = 0; i <res.length ; i++) {

              //得到数据
              let valuesAttr=res[i];
              let  tableValue={};

              if(typeof valuesAttr=="object"){
                for (let j = 0; j < valuesAttr.length; j++) {
                  let key=this.cols[j].name;
                  tableValue[key]=valuesAttr[j];
                }
              }else{
                let key=this.cols[0].name;
                tableValue[key]=valuesAttr;
              }
              /* 格式写出来  sku的属性   [{cols.name:笛卡尔积的值,pricess：,storcks}]      */


              this.tableData.push(tableValue);

            }
          }
          this.tableShow=flag;
        },calcDescartes:function(array) {
          if (array.length < 2) return array[0] || [];
          return [].reduce.call(array, function (col, set) {
            var res = [];
            col.forEach(function (c) {
              set.forEach(function (s) {
                var t = [].concat(Array.isArray(c) ? c : [c]);
                t.push(s);
                res.push(t);
              })
            });
            return res;
          });
        },

        getBandData2:async function(){

         let res=await this.$ajax.get("http://localhost:8083/api/property/selectShopProDataByTypeId?typeId="+this.addForm2.typeId)
            this.skuData = res.data.data.skuDatas;
            this.proData = res.data.data.noSkuData;
            for (let i = 0; i <this.skuData.length ; i++) {
              this.skuData[i].isCheck=[];
            }

            for (let i = 0; i <this.proData.length ; i++) {
              this.proData[i].isCheck=[];
            }

        },


        updateSkuFrom:function () {
          this.$message.error("不会写修改")

         /* if(this.tableShow==true){
            let  atrrs=[];
            debugger;
            for (let i = 0; i <this.proData.length ; i++) {
              let  attData={};
              attData[this.proData[i].name]=this.proData[i].isCheck;
              atrrs.push(attData);

            }
            this.addForm.proData=JSON.stringify(atrrs);
            this.addForm.skuData=JSON.stringify(this.tableData);
            this.$ajax.post("http://localhost:8083/api/shopTypeData/updateSkuFrom",this.$qs.stringify(this.addForm)).then(res=>{
              location.reload();
              this.$message.success("新增成功");
            })
          }else{
            this.$message.error("数据不能为空")
          }





*/


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
