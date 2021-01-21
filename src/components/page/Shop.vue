<template>
  <div>
    <h1>商品展示</h1>
    <el-table
      :data="shopData"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="商品名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="title"
        label="商品标题"
        width="180">
      </el-table-column>
      <el-table-column
        :formatter="bandAll"
        prop="bandId"
        label="商品品牌"
        width="180">
      </el-table-column>
      <el-table-column
        prop="productdecs"
        label="商品介绍"
        width="180">
      </el-table-column>
      <el-table-column
        prop="price"
        label="商品价格"
        width="180">
      </el-table-column>
      <el-table-column
        prop="stocks"
        label="商品库存"
        width="180">
      </el-table-column>
      <el-table-column
        prop="imgPath"
        label="商品图片"
        width="180">
        <template slot-scope="scope">
          <img   style="width: 100px; height: 100px"  :src="scope.row.imgPath"  />
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




  </div>







</template>

<script>
    export default {
        name: "Shop",
      data(){
          return{
            eachFroms:{
              page:1,
              limit:3
            },
            shopData:[],
            shopBand:[],
            count:0

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





      }




      }
</script>

<style scoped>

</style>
