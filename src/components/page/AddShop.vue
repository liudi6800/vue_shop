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
            <el-input-number v-model="addForm.price"  :step="0.1" ></el-input-number>
          </el-form-item>

          <el-form-item label="商品库存">
            <el-input-number v-model="addForm.stocks"></el-input-number>

          </el-form-item>

          <el-form-item label="商品排序">
            <el-input-number v-model="addForm.sortNum"></el-input-number>

          </el-form-item>


          <el-form-item>
            <el-button type="primary" style="margin-top: 12px;" @click="next1('addForm')">下一步，填写商品属性</el-button>
          </el-form-item>
        </el-form>

      </div>



      <div v-if="active==2">
        <el-form ref="form" :model="addForm2" label-width="80px">


          <el-form-item label="商品类型" prop="typeId"    >
            <el-select v-model="addForm2.typeId" placeholder="请选择" style="width: 300px" @change="getBandData">
              <el-option
                v-for="item in shopTyep"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item  v-if="skuData.length>0"  label="商品规格" >
                <el-form-item  v-for="a in skuData" :key="a.id" :label="a.nameCH" >


                  <el-checkbox-group v-if="a.type==2" v-model="a.isCheck"  @change="skuChang">
                    <el-checkbox-button v-for="b in a.values"     :key="b.id" :label="b.nameCH"   :checked="b.checked" ></el-checkbox-button>
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
              prop="price"
              label="价格"
              width="180">
              <template slot-scope="scope">
                 <el-input  v-model="scope.row.price" />
              </template>
            </el-table-column>

            <el-table-column
              prop="count"
              label="库存"
              width="180">
              <template slot-scope="scope">
              <el-input   v-model="scope.row.count"/>
              </template>
            </el-table-column>

          </el-table>










          <el-form-item  v-if="proData.length>0"  label="商品参数" >
            <el-form-item  v-for="a in proData" :key="a.id" :label="a.nameCH" >

              <el-select v-if="a.type==0"    v-model="addForm2.se[a.id]" placeholder="请选择">
                  <el-option
                    v-for="b in a.values"
                    :key="b.id"
                    :label="b.nameCH"
                    :value="b.id">
                  </el-option>
              </el-select>

              <el-radio-group v-if="a.type==1" v-model="addForm2.ra">
                <el-radio v-for="b in a.values"  :label="b.id"  ></el-radio>
              </el-radio-group>

              <el-checkbox-group v-if="a.type==2" v-model="addForm2.ch">
                <el-checkbox-button v-for="b in a.values"    :key="b.id" :label="b.nameCH"></el-checkbox-button>
              </el-checkbox-group>


              <el-input v-if="a.type==3" ></el-input>

            </el-form-item>
          </el-form-item>



          <el-button   style="margin-top: 12px;" @click="active--">上一步，填写商品信息</el-button>
          <el-button type="primary" style="margin-top: 12px;" @click="active++">下一步，提交商品信息</el-button>
        </el-form>

      </div>




      <div v-if="active==3">

        <el-form ref="form" :model="addForm2" label-width="80px">

        <el-form-item label="商品图片" prop="imgpaths">
          <el-upload
            class="avatar-uploader"
            action="http://localhost:8083/api/brand/uploadImgPath"
            :show-file-list="false"
            :on-success="LoglocadSucces">
            <img v-if="imagPath" :src="imagPath"  class="avatar" v-model="imgpaths">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>


        <el-button   style="margin-top: 12px;" @click="active--">上一步，填写商品属性</el-button>
        <el-button type="primary" style="margin-top: 12px;" >提交，商品信息</el-button>

        </el-form>
      </div>


    </div>




</template>

<script>
  export default {
    name: "Shop",
    data(){
      return{
        twodDscartes:[],
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
        addForm2:{
          se:[],
          ra:"",
          dx:[],
          ch:[],
          in:""
        },
        shopBand:[],
        skuData:[],
        proData:[],
        shopTyep:[],
        addForms: {

          name: [
          { required: true, message: '请输入属性名称', trigger: 'blur' },
          { max: 15, message: '长度最多 15 个字符', trigger: 'blur' }
          ],
          title: [
          { required: true, message: '请输入属性名称', trigger: 'blur' },
          { max: 15, message: '长度最多 15 个字符', trigger: 'blur' },
           ],

        },
        tableShow:false,
        imagPath:"",
        cols:[],//表动态列头
        tableData:[],
        imgpaths:""
      }
    },
    created:function () {
      this.queryBandData();
    },
    methods:{



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

            let tf=Array.isArray(valuesAttr);
            if(tf==true){
              let  tableValue={};
              for (let j = 0; j < valuesAttr.length; j++) {
                let key=this.cols[j].name;
                tableValue[key]=valuesAttr[j];
              }
              this.tableData.push(tableValue);
            }else{
              debugger;
              for (let k= 0; k < res.length; k++) {
                var  atableValue={};
                let key=this.cols[0].name;
                atableValue[key]=res[k];
                this.tableData.push(atableValue);
              }

            }
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
















      queryBandData:function(){
        this.$ajax.get("http://localhost:8083/api/brand/getAllBandData").then(res=>this.shopBand=res.data.data).catch(err=>console.log(err));
      },
      getBandData:function(val){
        this.skuData=[];
        this.proData=[];
        this.tableShow=false;
        this.$ajax.get("http://localhost:8083/api/property/selectShopProByTypeId?typeId="+val).then(res=>{
          let shopProperData=res.data.data;
           if(shopProperData.length>0){
             for (let i = 0; i <shopProperData.length ; i++) {
               if (shopProperData[i].isSKU == 0) {
                 if (shopProperData[i].type != 3) {
                  this.$ajax.get("http://192.168.1.224:8083/api/proValue/selectProValueByproId?proId="+shopProperData[i].id).then(res=>{
                    shopProperData[i].values=res.data.data;
                    shopProperData[i].isCheck=[];
                    this.skuData.push(shopProperData[i]);
                  })
                 }else{
                   shopProperData[i].isCheck=[];
                   this.skuData.push(shopProperData[i]);
                 }


               } else {
                 if (shopProperData[i].type != 3) {
                   this.$ajax.get("http://192.168.1.224:8083/api/proValue/selectProValueByproId?proId="+shopProperData[i].id).then(res=>{

                     shopProperData[i].values=res.data.data;
                     this.proData.push(shopProperData[i]);
                   })
                 }else{
                   this.proData.push(shopProperData[i]);
                 }

               }
             }
             console.log(this.skuData);
           }
        }).catch(err=>console.log(err));

      },


      next1:function (addForm)  {
        this.$refs[addForm].validate((valid) => {
          if (valid) {
            this.active++;
           if(this.shopTyep.length<=0){
             this.queryShopType();
           }

          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },



      /*处理分类数据*/
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
      },  LoglocadSucces:function (a) {

        this.addForm2.imgpath=a.data;
        this.imagPath=a.data;
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
