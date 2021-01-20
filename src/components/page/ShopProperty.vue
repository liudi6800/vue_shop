<template>
  <div>
    <el-form :inline="true" ref="eachFrom" :model="eachFrom" class="demo-form-inline">
      <el-form-item label="属性名称" prop="name">
        <el-input v-model="eachFrom.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="eachFromSubmit">查询</el-button>
        <el-button type="primary" @click="eachFromRes('eachFrom')">重置</el-button>
      </el-form-item>
    </el-form>

    <el-button type="primary" @click="addBrand">新增属性</el-button>


    <el-table  :data="data"  style="width: 100%">
      <el-table-column type="selection" width="55" align="center" > </el-table-column>

      <el-table-column prop="id"  align="center"  label="序号" width="80"> </el-table-column>

      <el-table-column  prop="name"  align="center"  label="属性名称"  width="80"> </el-table-column>

      <el-table-column  prop="nameCH" align="center"   label="属性中文名 "   width="110">  </el-table-column>

      <el-table-column   prop="typeId" align="center"  label="分类名称" width="170"   :formatter="formattertypeId">  </el-table-column>

      <el-table-column   prop="isSKU"  align="center" label="是否为Sku" width="110"  :formatter="formatterIsSku">  </el-table-column>

      <el-table-column prop="type"  align="center"  label="属性的类型"  width="110" :formatter="formatterIsType"> </el-table-column>

      <el-table-column    align="center"  label="是否展示"  width="180"  >

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

      <el-table-column label="操作"   align="center"  width="320">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit"  circle size="mini" type="danger"
                     @click="handleEdit(scope.$index, scope.row)">
            修改
          </el-button>

          <el-button icon="el-icon-edit"  circle size="mini" type="danger"
                     @click="handleDel(scope.$index, scope.row)">
            删除
          </el-button>

          <el-button icon="el-icon-edit"  v-if="scope.row.type!=3" circle size="mini" type="danger"
                     @click="setValue(scope.$index, scope.row)">
            设置参数值
          </el-button>

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
      <el-form ref="addForm" :rules="rules" :model="addForm" label-width="180px"  >


        <el-form-item label="属性名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>


        <el-form-item label="属性中文名" prop="nameCH">
          <el-input v-model="addForm.nameCH"></el-input>
        </el-form-item>

        <el-form-item label="分类类型" prop="typeId">
        <el-select v-model="addForm.typeId" placeholder="请选择">
          <el-option
            v-for="item in shopTyep"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        </el-form-item>

        <el-form-item label="属性的类型" prop="type">
          <el-radio v-model="addForm.types" :label="0" border>下拉框</el-radio>
          <el-radio v-model="addForm.types" :label="1" border>单选框</el-radio>
          <el-radio v-model="addForm.types" :label="2" border>复选框</el-radio>
          <el-radio v-model="addForm.types" :label="3" border>输入框</el-radio>
        </el-form-item>

        <el-form-item label="是否为Sku" prop="isSku">
          <el-radio v-model="addForm.isSKU" :label="0" border>是</el-radio>
          <el-radio v-model="addForm.isSKU" :label="1" border>否</el-radio>
        </el-form-item>


        <el-form-item>
          <el-button type="primary" @click="addSubmit('addForm')">立即新增</el-button>
          <el-button @click="addRest('addForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--   修改品牌模板-------------------->
    <el-dialog title="修改品牌"  :visible.sync="updateHtml">
      <el-form ref="updateFrom"  :rules="rules" :model="updateForm" label-width="180px"  >


        <el-form-item label="属性名称" prop="name">
          <el-input v-model="updateForm.name"></el-input>
        </el-form-item>


        <el-form-item label="属性中文名" prop="nameCH">
          <el-input v-model="updateForm.nameCH"></el-input>
        </el-form-item>


        <el-form-item label="分类类型" prop="typeId">
          <el-select v-model="updateForm.typeId" placeholder="请选择">
            <el-option
              v-for="item in shopTyep"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="属性的类型" prop="type">
          <el-radio v-model="updateForm.type" :label="0" border>下拉框</el-radio>
          <el-radio v-model="updateForm.type" :label="1" border>单选框</el-radio>
          <el-radio v-model="updateForm.type" :label="2" border>复选框</el-radio>
          <el-radio v-model="updateForm.type" :label="3" border>输入框</el-radio>
        </el-form-item>

        <el-form-item label="是否为Sku" prop="isSku">
          <el-radio v-model="updateForm.isSKU" :label="0" border>是</el-radio>
          <el-radio v-model="updateForm.isSKU" :label="1" border>否</el-radio>
        </el-form-item>

        <el-form-item label="是否展示" prop="isDel">
          <el-radio v-model="updateForm.isDel" :label="0" border>是</el-radio>
          <el-radio v-model="updateForm.isDel" :label="1" border>否</el-radio>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="updateSubmit('updateFrom')">立即修改</el-button>
          <el-button @click="addRest('updateFrom')">取消</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>

    <!-------------------------------------设置属性值的所有模板---------------------------------------->

    <el-dialog    :title="proName"   :visible.sync="setValueHtml" width="1000px">
      <el-button type="primary" @click="addValuea">新增{{proName}}</el-button>
      <el-table :data="proValue">
        <el-table-column   label="" width="150"></el-table-column>
        <el-table-column property="nameCH" label="属性名"></el-table-column>
        <el-table-column property="name" label="属性值" width="200"></el-table-column>
        <el-table-column label="操作" align="center" width="380">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit"  circle size="mini" type="danger"
                       @click="updateValuea(scope.$index, scope.row)">
              修改{{proName}}
            </el-button>

            <el-button icon="el-icon-edit"  circle size="mini" type="danger"
                       @click="delValuea(scope.$index, scope.row)">
              删除{{proName}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>


    <!--   新增模板-->
    <el-dialog title="新增属性值"  :visible.sync="addValueHtml"  >
      <el-form ref="addproValue" :rules="rules" :model="addproValue" label-width="180px"  >

        <el-form-item label="属性名" prop="nameCH">
          <el-input v-model="addproValue.nameCH"></el-input>
        </el-form-item>

        <el-form-item label="属性值值" prop="name">
          <el-input v-model="addproValue.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addproValueSubmit('addproValue')">立即新增</el-button>

        </el-form-item>
      </el-form>
    </el-dialog>


    <!--   修改模板-->
    <el-dialog title="修改属性值"  :visible.sync="updateValueHtml"  >
      <el-form ref="updateproValue" :rules="rules" :model="updateproValue" label-width="180px"  >

        <el-form-item label="属性名称" prop="nameCH">
          <el-input v-model="updateproValue.nameCH"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="updateValueSubmit('updateproValue')">立即修改</el-button>

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
        shopTyeps:[],
        shopTyep:[],
        shopTyepsss:[],
        proValue:[],
        addproValue:{
          name:"",
          nameCH:""
        },
        updateproValue:{
          name:"",
          nameCH:""
        },
        addForm:{
          name:"",
          nameCH:"",
          typeId:"",
          isSKU:"",
          type:"",
          types:""
        },
        updateForm:{
          name:"",
          nameCH:"",
          typeId:"",
          isSKU:"",
          type:"",
          isDel:"",

        },

        eachFrom:{
          page:"1",
          limit:"2",
          name:""
        },
        count:0,
        addHtml:false,
        updateHtml:false,
        setValueHtml:false,
        addValueHtml:false,
        updateValueHtml:false,
        ccg:true,
        typeName:"",
        proName:"",


        rules: {
          name: [
            { required: true, message: '请输入属性名称', trigger: 'blur' },
            { max: 15, message: '长度最多 15 个字符', trigger: 'blur' }
          ],
          nameCH: [
            { max: 15, message: '长度最多 15 个字符', trigger: 'blur' },
            { required: true, message: '请输入属性名称', trigger: 'blur' },
          ],

        }
      }
    },
    created:function () {
      this.queryShopType();
      this.quertShopPropertyData();
    },
    methods:{
      handleSizeChange:function (val) {
        this.eachFrom.limit=val;
        this.quertShopPropertyData();
      },
      handleCurrentChange:function (val) {
        this.eachFrom.page=val;
        this.quertShopPropertyData();
      },
      handleEdit:function (index,row) {

        this.updateHtml=true;
        this.updateForm=row;


      },
      setValue:function(index,row){
        this.proName= row.nameCH+"的值";
        this.addproValue.proId=row.id;
        this.updateproValue.proId=row.id;
        this.setValueHtml=true;
        this.quertProValueByProId(row.id);
      },
      addValuea:function( ){
        this.setValueHtml=false;
        this.addValueHtml=true;
        this.addproValue={}
        this.addproValue.proId=this.updateproValue.proId;
      },
      addproValueSubmit:function(addproValue){
        this.$refs[addproValue].validate((valid) => {
          if (valid) {
            this.$ajax.post("http://localhost:8083/api/proValue/addProValue",this.$qs.stringify(this.addproValue)).then((res)=>{
              console.log(res);
              this.addValueHtml=false;
              this.setValueHtml=true;
              this.quertProValueByProId(this.addproValue.proId);
            }).catch(err=>{console.log(err)})
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      updateValuea:function (index,row) {

        this.updateValueHtml=true;
        this.updateproValue=row;

      },
      delValuea:function(index,row){


        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.$ajax.delete("http://localhost:8083/api/proValue/delProValue?id="+row.id).then((res)=>{
            console.log(res);
            this.$message.success("删除成功");
            this.quertProValueByProId(row.proId);
          }).catch(err=>{console.log(err)})
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });


      },
      updateValueSubmit:function(updateproValue){

        this.$refs[updateproValue].validate((valid) => {
          if (valid) {
            this.$ajax.post("http://localhost:8083/api/proValue/updateProValue",this.$qs.stringify(this.updateproValue)).then((res)=>{
              console.log(res);
              this.updateValueHtml=false;
            this.quertProValueByProId(this.updateproValue.proId);
            }).catch(err=>{console.log(err)})
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      quertProValueByProId(proId){
        this.$ajax.get("http://localhost:8083/api/proValue/selectProValueByproId?proId="+proId).then((res)=>{
          this.proValue=res.data.data;

        }).catch(err=>{console.log(err)})

      },

      handleDel:function (index,row) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.$ajax.delete("http://localhost:8083/api/property/delete?id="+row.id).then(
            function (res) {
              console.log(res);
              location.reload();
            }
          ).catch(err=>console.log(err))
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      quertShopPropertyData:function () {
        var qthis=this;
        this.$ajax.get("http://localhost:8083/api/property/getData?"+this.$qs.stringify(this.eachFrom)).then(
          function (res) {
            qthis.data=res.data.data.data;
            qthis.count=res.data.data.count;
          }
        ).catch(err=>console.log(err))
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

      addBrand:function () {
        this.addForm={};
        this.addHtml=true;
      },
      addSubmit:function (addForm) {
        this.$refs[addForm].validate((valid) => {
          if (valid) {
            this.addForm.type=this.addForm.types;
            this.$ajax.post("http://localhost:8083/api/property/add",this.$qs.stringify(this.addForm)).then((res)=>{
                console.log(res);
                this.addHtml=false;
                this.quertShopPropertyData();
              }
            ).catch(err=>console.log(err))
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      updateSubmit:function(updateFrom){
        this.$refs[updateFrom].validate((valid) => {
          if (valid) {

            this.updateForm.imgpath = this.updateForm.imgpaths;

            console.log(this.updateForm);
            this.$ajax.post("http://localhost:8083/api/property/update",this.$qs.stringify(this.updateForm)).then((res)=>{
              this.$message.success("修改成功");
                this.updateHtml=false;
              this.quertShopPropertyData();
              }
            ).catch(err=>console.log(err))
          } else {
            console.log('error submit!!');
            return false;
          }
        });
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
        this.quertShopPropertyData();
      },
      formatterIsdel:function (a,b,c,d) {
        return c==0?"是":"否";
      },
      formatterIsSku:function (a,b,c,d) {
        return c==0?"是":"否";
      },
      formatterIsType:function (a,b,c,d) {
        return c==0?"下拉框": c==1?"单选框": c==2?"复选框": c==3?"输入框":"";
      },
      formattertypeId:function (a,b,c,d) {
        for (let i = 0; i <this.shopTyep.length ; i++) {
          if(c==this.shopTyep[i].id){
            return this.shopTyep[i].name;
          }
        }
      },
      change:function (row) {
            debugger;
          this.$ajax.delete("http://192.168.1.224:8083/api/property/delete",{
            params:{
              id:row.id,isDel:row.isDel
            }
          }).then(res=> this.quertShopPropertyData()).catch(err=>console.log(err));

      }

    }
  }
</script>

<style scoped>

</style>
