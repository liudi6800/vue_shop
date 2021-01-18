<template>
  <div>


      <el-steps :active="active" finish-status="success">
        <el-step title="填写商品信息"></el-step>
        <el-step title="填写属性信息"></el-step>
        <el-step title="提交订单"></el-step>
      </el-steps>


      <div v-if="active==1"  >
        <el-form ref="addForm" :rules="addForms" :model="addForm" label-width="80px">
          <el-form-item label="商品品牌" prop="bandId">
            <el-select v-model="addForm.bandId" placeholder="请选择" >
              <el-option
                v-for="item in shopBand"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="商品名称" prop="name">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>

          <el-form-item label="商品标题" prop="title">
            <el-input v-model="addForm.title"></el-input>
          </el-form-item>

          <el-form-item label="商品介绍">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="addForm.productdecs">
            </el-input>

          </el-form-item>

          <el-form-item label="商品价格">
            <el-input v-model="addForm.price"></el-input>
          </el-form-item>

          <el-form-item label="商品库存">
            <el-input v-model="addForm.stocks"></el-input>
          </el-form-item>

          <el-form-item label="商品排序">
            <el-input v-model="addForm.sortNum"></el-input>
          </el-form-item>


          <el-form-item>
            <el-button type="primary" style="margin-top: 12px;" @click="next1('addForm')">下一步，填写商品属性</el-button>
          </el-form-item>
        </el-form>

      </div>



      <div v-if="active==2">
        <el-form ref="form" :model="form1" label-width="80px">


          <el-form-item label="商品类型" prop="typeId"    >
            <el-select v-model="addForm.typeId" placeholder="请选择" style="width: 300px" @change="getBandData()">
              <el-option
                v-for="item in shopTyep"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="商品规格" >
            <div>

            </div>
          </el-form-item>



          <el-button   style="margin-top: 12px;" @click="next2">上一步，填写商品信息</el-button>
          <el-button type="primary" style="margin-top: 12px;" @click="next1">下一步，提交商品信息</el-button>
        </el-form>

      </div>




      <div v-if="active==3">
        <h1>666666666</h1>
        <el-button   style="margin-top: 12px;" @click="next2">上一步，填写商品属性</el-button>
        <el-button type="primary" style="margin-top: 12px;" >提交，商品信息</el-button>

      </div>


    </div>


</template>

<script>
  export default {
    name: "Shop",
    data(){
      return{

        active: 1,
        addForm:{
          name:"",
          title:"",
          bandId:[],
          productdecs:"",
          price:"",
          stocks:"",
          sortNum:"",
        },
        form1:{},
        shopBand:[],
        shopProperData:[],
        shopTyep:[],
        addForms: {
          bandId: [
            {   required: true, message: '请选择商品品牌', trigger: 'change' }
          ],
          name: [
          { required: true, message: '请输入属性名称', trigger: 'blur' },
          { max: 15, message: '长度最多 15 个字符', trigger: 'blur' }
          ],
          title: [
          { required: true, message: '请输入属性名称', trigger: 'blur' },
          { max: 15, message: '长度最多 15 个字符', trigger: 'blur' },
           ],


        }
      }
    },
    created:function () {
      this.queryBandData();
      this.queryShopType();
      this.queryShopProperty();

    },
    methods:{
      queryBandData:function(){
        this.$ajax.get("http://localhost:8083/api/brand/getAllBandData").then(res=>this.shopBand=res.data.data).catch(err=>console.log(err));
      },
      queryShopProperty:function(){
        this.$ajax.get("http://192.168.1.224:8083/api/property/getAllData").then(res=>this.shopProperData=res.data.data).catch(err=>console.log(err));
      },
      next1:function (addForm)  {
        this.$refs[addForm].validate((valid) => {
          if (valid) {
            this.active++;
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      next2:function ()  {
        this.active--;
      },



      queryShopType:function(){

        this.$ajax.get("http://localhost:8083/api/type/getData").then(res=> {
          this.shopTyeps=res.data.data;
          var shopData=res.data.data;
          for (let i = 0; i < shopData.length; i++) {
            const datum = shopData[i];
            if(datum.pid==0){
              this.typeName=datum.name;
            }
          }
          for (let i = 0; i <shopData.length ; i++) {
            var rf=this.isPrent(shopData[i]);
            var data ={};
            if(rf==false){
              data.id=shopData[i].id;
              data.name=shopData[i].name;
              data.pid=shopData[i].pid;
              this.shopTyep.push(data);
            }
          }

          //遍历所有的子节点
          for (let i = 0; i <this.shopTyep.length ; i++) {
            this.typeName="";

            //处理子节点的name属性
            this.chandleName(this.shopTyep[i]);

            var a= this.typeName.split("/").reverse().join("/");
            this.shopTyep[i].name=a.substring(0,a.length-1);
          }

        })
      },
      //给我一个节点  得到层级name
      chandleName:function(node){
        if(node.pid!=0){ //临界值
          this.typeName+="/"+node.name;
          //上级节点
          for (let i = 0; i <this.shopTyeps.length ; i++) {
            if(node.pid==this.shopTyeps[i].id){
              this.chandleName(this.shopTyeps[i]);
              break;
            }
          }
        }else{
          this.typeName+="/"+node.name;
        }
      },
      isPrent:function(data){
        for (let i = 0; i <this.shopTyeps.length ; i++) {
          if(data.id==this.shopTyeps[i].pid){
            return  true;
          }
        }
        return false;
      },
      getBandData:function () {
        let a =this.addForm.typeId;
        debugger;
        for (let i = 0; i < this.shopProperData.length; i++) {
            if(a==this.shopProperData[i].typeId){
            console.log(this.shopProperData[i]);
            }
        }

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
