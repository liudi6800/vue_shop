<template>
  <div>
    <h1>权限管理</h1>
    <el-tree
      :data="data"
      :props="defaultProps"
      accordion
      node-key="id"
      :default-expanded-keys="[1]"
      :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="addMenu(data)"
            icon="el-icon-plus">
            新增
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="updateMenu(node,data)"
            icon="el-icon-edit">
            修改
          </el-button>
        </span>
      </span>
    </el-tree>

    <!--新增模板-->
    <el-dialog title="新增节点" :visible.sync="addMenuForm">
      <el-form ref="form" :model="addForm" label-width="80px" style="width: 500px;">
        <el-form-item label="节点名称">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="节点路径">
          <el-input v-model="addForm.url"></el-input>
        </el-form-item>
        <el-form-item label="节点类型">
          <el-radio-group v-model="addForm.type">
            <el-radio :label="0">目录</el-radio>
            <el-radio :label="1">菜单</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addMenuForm=false">取 消</el-button>
        <el-button type="primary" @click="addMenuFrom">确 定</el-button>
      </div>
    </el-dialog>

    <!--修改模板-->
    <el-dialog title="新增节点" :visible.sync="updateMenuForm">
      <el-form ref="form" :model="updateForm" label-width="80px" style="width: 500px;">
        <el-form-item label="节点名称">
          <el-input v-model="updateForm.name"></el-input>
        </el-form-item>
        <el-form-item label="节点路径">
          <el-input v-model="updateForm.url"></el-input>
        </el-form-item>
        <el-form-item label="节点类型">
          <el-radio-group v-model="updateForm.type">
            <el-radio :label="0">目录</el-radio>
            <el-radio :label="1">菜单</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否删除">
          <el-radio-group v-model="updateForm.isDel">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateMenuForm=false">取 消</el-button>
        <el-button type="primary" @click="updateMenuData">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "Menu",
    data() {
      return {

        data: [],
        menuData: [],
        menuDataStr: '',
        defaultProps: {},
        addMenuForm: false,
        addForm: {
          pid: "",
          name: "",
          url: "",
          type: "",
          isDel: 0
        },
        updateMenuForm: false,
        updateForm: {
          id: "",
          pid: "",
          name: "",
          url: "",
          type: "",
          isDel: ""
        }
      }
    }, created: function () {
      this.queryMenuData();
    }, methods: {
      addMenu: function (data) {
        this.addForm = {
          pid: "",
          name: "",
          url: "",
          type: "",
          isDel: 0
        };
        this.addMenuForm = true;
        this.addForm.pid = data.id;
      },
      addMenuFrom: function () {
        this.$ajax.post("http://localhost:8083/api/menu/addMenu?" + this.$qs.stringify(this.addForm)).then(res => {
          this.addMenuForm = false;
          location.reload();
          this.$message.success("新增权限成功");
        }).catch(re => {
          console.log(re);
        })
      },
      /*修改权限数据*/
      updateMenu: function (node, data) {
        this.updateMenuForm = true;
        this.$ajax.get("http://localhost:8083/api/menu/selectMenuDataById?id=" + data.id).then(res => {
          this.updateForm = res.data.data;
        }).catch(re => {
          console.log(re);
        })
      },
      updateMenuData: function () {
        this.$ajax.post("http://localhost:8083/api/menu/updateMenu?"+this.$qs.stringify(this.updateForm)).then(res => {
          this.updateMenuForm = false;
          location.reload();
          this.$message.success("修改权限成功");
        }).catch(re => {
          console.log(re);
        })
      },
      //查询所有的权限数据
      queryMenuData: function () {
        this.$ajax.get("http://localhost:8083/api/menu/selectMenuData").then(res => {
          this.menuData = res.data.data;
          this.queryTop();
        }).catch(re => {
          console.log(re);
        })
      },
      //查询顶层的权限数据
      queryTop: function () {
        for (let i = 0; i < this.menuData.length; i++) {
          if (this.menuData[i].pid == 0) {
            this.queryMenuDataStr(this.menuData[i]);
            break;
          }
        }
        this.data.push(JSON.parse(this.menuDataStr));
      },
      //拼接树结构数据
      queryMenuDataStr: function (data) {
        if (data.type == 0) {
          this.menuDataStr += '{"id":' + data.id + ',"label":"' + data.name + '","children":[';
          let count = 0;
          for (let i = 0; i < this.menuData.length; i++) {
            if (this.menuData[i].pid == data.id) {
              count++;
              this.queryMenuDataStr(this.menuData[i]);
              this.menuDataStr += ",";
            }
          }
          if (count != 0) {
            this.menuDataStr = this.menuDataStr.substr(0, this.menuDataStr.length - 1);
          }
          this.menuDataStr += ']}';
        } else {
          this.menuDataStr += '{"id":' + data.id + ',"label":"' + data.name + '"}';
        }
      }
    }
  }
</script>

<style scoped>

</style>
