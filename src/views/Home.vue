<template>
  <div class="table">
    <el-button type="primary" @click="dialogFormVisible = true;" class="btn">录入信息</el-button>
    <el-table
            :data="tableData"
            border
            style="width: 100%">
      <el-table-column
              prop="date"
              label="日期"
              width="180">
      </el-table-column>
      <el-table-column
              prop="name"
              label="姓名"
              width="180">
      </el-table-column>
      <el-table-column
              prop="address"
              label="地址">
      </el-table-column>
      <el-table-column
              prop="delete"
              label="操作">
        <template slot-scope="scope">
          <el-button type="danger" class="del"  @click="deleteInfo(scope.row.id)" round>删除</el-button>
        </template>
      </el-table-column>
    </el-table>



    <el-dialog title="录入用户" :visible.sync="dialogFormVisible" class="dialog_box">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="ruleForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="ruleForm.address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addUser('ruleForm')">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>

      </div>
    </el-dialog>
  </div>



</template>

<script>
// @ is an alias to /src

import axios from "axios";
import { Message } from "element-ui";

export default {


  name: "home",

  data() {
    //字段验证
    var checkName = (rule, value, callback) => {
      var reg = /^[\u4e00-\u9fa5]{1,4}$/;
      if (!value) {
        return callback(new Error("姓名不能为空"));
      } else if (!reg.test(value)) {
        return callback(new Error("姓名格式为中文,长度为1~4"));
      }
      callback();
    };
    var checkAddress = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("地址不能为空"));
      }
      callback();
    };




    return {
      dialogFormVisible: false,
      dialogOneList: false,
      oneList: { name: "", address: "" },
      searchVal: "",
      timer: null,
      id: null, //保存用户点击编辑时的id
      ruleForm: {
        name: "",
        address: ""
      },
      rules: {
        name: [{ validator: checkName, trigger: "blur" }],
        address: [{ validator: checkAddress, trigger: "blur" }]
      },
      form: {
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      formLabelWidth: "120px",
      tableData: []




    };
  },
  methods: {



    //获取数据列表
    getList() {
      axios.get("http://localhost:9090/user").then(response => {
        let res = response.data;
        res.forEach((item) => {
           // 将数据的格式做一个转换
           item.date = this.getTime(item.date)
        });
        this.tableData = res;
      });
    },
    //补零操作
    addZero(num) {
      if (parseInt(num) < 10) {
        num = "0" + num;
      }
      return num;
    },
    //根据时间戳计算时间
    getTime(timestamp) {
      var oDate = new Date(timestamp),
              oYear = oDate.getFullYear(),
              oMonth = oDate.getMonth() + 1,
              oDay = oDate.getDate(),
              oHour = oDate.getHours(),
              oMin = oDate.getMinutes(),
              oSen = oDate.getSeconds(),
              oTime =
                      oYear +
                      "-" +
                      this.addZero(oMonth) +
                      "-" +
                      this.addZero(oDay) +
                      " " +
                      this.addZero(oHour) +
                      ":" +
                      this.addZero(oMin) +
                      ":" +
                      this.addZero(oSen);
      return oTime;
    },
    //获取添加的用户信息并存入数据库
    addUser(ruleForm) {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) {
          //提交失败
          return false;
        } else {
          //验证通过，发送 ajax 请求
          const payload = {
            date: new Date().getTime(),
            name: this.ruleForm.name,
            address: this.ruleForm.address
          };
          axios.post("http://localhost:9090/user", payload).then(response => {
            if (response.status == 201) {
              Message({
                message: "录入成功",
                type: "success"
              });
              //录入成功后重新请求
              this.getList();
              //关闭dialog
              this.dialogFormVisible = false;
              //清除输入框中的数据
              this.ruleForm.name = "";
              this.ruleForm.address = "";
            } else {
              Message.error("录入失败");
            }
          });
        }
      });
    },
    //删除操作
    deleteInfo(index) {
      // console.log(index);
      axios.delete(`http://localhost:9090/user/${index}`).then(res => {
        if(res.status === 200){
          this.getList();
        }
      });
    }
  },

  created() {
    this.getList();
  }
};
</script>

<style lang="less">

  .table{
    width: 800px;
    height: 400px;
    margin: 50px auto;
    .btn{
      display: block;
      margin: auto;
    }
    .del{
      border-radius: 5px!important;
      margin-left: 20px!important;
    }
    .dialog_box{
    }
  }
</style>

