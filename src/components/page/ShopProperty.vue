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

      <el-table-column   prop="typeId" align="center"  label="分类名称" width="110"   :formatter="formattertypeId">  </el-table-column>

      <el-table-column   prop="isSKU"  align="center" label="是否为Sku" width="110"  :formatter="formatterIsSku">  </el-table-column>

      <el-table-column prop="type"  align="center"  label="属性的类型"  width="110" :formatter="formatterIsType"> </el-table-column>

      <el-table-column prop="isDel"  align="center"  label="是否展示"  width="80" :formatter="formatterIsdel"> </el-table-column>

      <el-table-column label="操作" align="center" width="180">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit"  circle size="mini" type="danger"
                     @click="handleEdit(scope.$index, scope.row)">
            修改
          </el-button>
          <el-button icon="el-icon-edit"  circle size="mini" type="danger"
                     @click="handleDel(scope.$index, scope.row)">
            删除
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
          <el-radio v-model="addForm.type" :label="0" border>下拉框</el-radio>
          <el-radio v-model="addForm.type" :label="1" border>单选框</el-radio>
          <el-radio v-model="addForm.type" :label="2" border>复选框</el-radio>
          <el-radio v-model="addForm.type" :label="3" border>输入框</el-radio>
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
        addForm:{
          name:"",
          nameCH:"",
          typeId:"",
          isSKU:"",
          type:""
        },
        updateForm:{
          name:"",
          nameCH:"",
          typeId:"",
          isSKU:"",
          type:"",
          isDel:""
        },

        eachFrom:{
          page:"1",
          limit:"2",
          name:""
        },
        count:0,
        addHtml:false,
        updateHtml:false,
        ccg:true,
        rules: {
          name: [
            { required: true, message: '请输入属性名称', trigger: 'blur' },
            { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
          ],
          nameCH: [
            { required: true, message: '请输入属性中文名称', trigger: 'blur' },
            { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
          ],
          typeId: [
            { required: true, message: '请选择一个类型', trigger: 'change' }
          ]
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
        debugger;
        this.updateHtml=true;
        this.updateForm=row;
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
        var tthis=this;
        this.$ajax.get("http://localhost:8083/api/type/getData").then(function (res) {
          tthis.shopTyeps=res.data.data;
          var shopData=res.data.data;
          debugger;
          for (let i = 0; i <shopData.length ; i++) {
            var rf=tthis.isPrent(shopData[i]);
            var data ={};
            if(rf==false){
            data.id=shopData[i].id;
            data.name=shopData[i].name;
              tthis.shopTyep.push(data);
            }
          }

        })
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
        this.addHtml=true;
      },
      addSubmit:function (addForm) {
        this.$refs[addForm].validate((valid) => {
          if (valid) {
            this.$ajax.post("http://localhost:8083/api/property/add",this.$qs.stringify(this.addForm)).then((res)=>{
                console.log(res);
                this.addHtml=false;
                location.reload();
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
                console.log(res);
                this.updateHtml=false;
                location.reload();
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
      }
    }
  }
</script>

<style scoped>

</style>
