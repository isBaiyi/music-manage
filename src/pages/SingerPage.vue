<template>
    <div class="table">
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" size="mini" @click="deleteAll">批量删除</el-button>
                <!-- 姓名模糊查询 -->
                <el-input v-model="select_word" size="mini" placeholder="请输入歌手名" class="handle-input"/>
                <el-button type="primary" size="mini" @click="centerDialogVisable=true">添加歌手</el-button>
            </div>
        </div>
        <!-- 查询所有歌手 -->
        <el-table size="mini" border style="width:100%" height="700px" :data="data" @selection-change="handelSelectionChange">
            <!-- 批量删除 -->
            <el-table-column type="selection" width="40"/>
            <el-table-column label="歌手图片" width="110" align="center">
                <!-- 当前单元格 -- 当前条数据 -->
                <template slot-scope="scope">
                    <div class="singer-img">
                        <!-- 数据库存的是相对地址 理应还需要一个项目地址前缀 vue 提供了一个store进行存放 -->
                        <img :src="getUrl(scope.row.pic)" style="width:100%"/>
                    </div>
                    <el-upload :action="uploadUrl(scope.row.id)" 
                    :before-upload="beforeAvatarUpload" :on-success="handleAvatarSuccess">
                        <el-button size="mini">更新图片</el-button>
                    </el-upload>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="歌手" width="120" align="center"/>
            <el-table-column label="性别"  width="50" align="center">
                <template slot-scope="scope">
                    {{changeSex(scope.row.sex)}}
                </template>
            </el-table-column> 
            <el-table-column prop="birth" label="生日" width="120" align="center">
                <template slot-scope="scope">
                    {{attachBirth(scope.row.birth)}}
                </template>
            </el-table-column>
            <el-table-column prop="location" label="地区" width="100" align="center"/>
            <el-table-column label="简介" >
                <template slot-scope="scope">
                    <p style="height:100px;overflow:scroll">{{scope.row.introduction}}</p>
                </template>
            </el-table-column>
            <el-table-column label="歌曲管理" width="110" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" @click="songEdit(scope.row.id, scope.row.name)">歌曲管理</el-button>
                </template>
            </el-table-column>
            <!-- 歌手相关操作 -->
            <el-table-column label="操作" width="150" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" type="info" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页功能 -->
        <div class="pageination">
            <!-- background：背景 layout：输出内容   @current-change: 点击后跳转到下一页-->
            <el-pagination background layout="total,prev,pager,next" :current-page="currentPage"
            :page-size="pageSize" :total="tableData.length" @current-change="handelCurrentChange"/>
        </div>
        <el-dialog title="添加歌手" :visible.sync="centerDialogVisable" width="400px" center>
            <el-form :model="registForm" ref="registForm" label-width="80px" :rules="rules">
                <el-form-item prop="name" label="歌手名" size="mini">
                    <el-input v-model="registForm.name" placeholder="歌手名"></el-input>
                </el-form-item>
                <el-form-item label="性别" size="mini">
                    <input type="radio" name="sex" value="0" v-model="registForm.sex">&nbsp;女&nbsp;&nbsp;
                    <input type="radio" name="sex" value="1" v-model="registForm.sex">&nbsp;男&nbsp;&nbsp;
                    <input type="radio" name="sex" value="2" v-model="registForm.sex">&nbsp;组合&nbsp;&nbsp;
                    <input type="radio" name="sex" value="3" v-model="registForm.sex">&nbsp;不明
                </el-form-item>
                <el-form-item prop="birth" label="生日" size="mini">
                    <el-date-picker type="date" placeholder="选择日期" v-model="registForm.birth" style="width:100%">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="location" label="地区" size="mini">
                    <el-input v-model="registForm.location" placeholder="地区"></el-input>
                </el-form-item>
                <el-form-item prop="introduction" label="简介" size="mini">
                    <el-input v-model="registForm.introduction" placeholder="简介" type="textarea"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button size="mini" @click="centerDialogVisable=false">取消</el-button>
                <el-button size="mini" @click="addSinger">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="修改歌手" :visible.sync="editVisible" width="400px" center>
            <el-form :model="form" ref="form" label-width="80px" :rules="rules">
                <el-form-item prop="name" label="歌手名" size="mini">
                    <el-input v-model="form.name" placeholder="歌手名"></el-input>
                </el-form-item>
                <el-form-item label="性别" size="mini">
                    <input type="radio" name="sex" value="0" v-model="form.sex">&nbsp;女&nbsp;&nbsp;
                    <input type="radio" name="sex" value="1" v-model="form.sex">&nbsp;男&nbsp;&nbsp;
                    <input type="radio" name="sex" value="2" v-model="form.sex">&nbsp;组合&nbsp;&nbsp;
                    <input type="radio" name="sex" value="3" v-model="form.sex">&nbsp;不明
                </el-form-item>
                <el-form-item label="生日" size="mini">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.birth" style="width:100%">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="location" label="地区" size="mini">
                    <el-input v-model="form.location" placeholder="地区"></el-input>
                </el-form-item>
                <el-form-item prop="introduction" label="简介" size="mini">
                    <el-input v-model="form.introduction" placeholder="简介" type="textarea"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button size="mini" @click="editVisible=false">取消</el-button>
                <el-button size="mini" @click="editSave">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="删除歌手" :visible.sync="delVisible" width="300px" center>
            <div align="center">删除不可恢复，是否确定删除？</div>
            <span slot="footer">
                <el-button size="mini" @click="delVisible=false">取消</el-button>
                <el-button size="mini" @click="delRow">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {setSinger, getAllSinger, updateSinger, deleteSinger} from "../api/index";
import {mixin} from "../mixins/index";
export default {
    mixins:[mixin],
    data(){
        return{
            centerDialogVisable: false,  //添加弹窗是否显示
            editVisible: false,          //编辑弹窗是否显示
            delVisible: false,           //删除弹窗是否显示
            registForm:{ // 添加框
                name: "",
                sex:'',
                birth: '',
                location: '',
                introduction: ''
            },
            form:{ // 编辑框
                id: '',
                name: "",
                sex:'',
                birth: '',
                location: '',
                introduction: ''
            },
            tableData: [],
            tempData: [],
            // 输入的文字
            select_word: '',
            pageSize: 5, // 分页每页大小
            currentPage: 1, // 当前页
            idx: -1,       // 当前选择项 ---> 删除使用
            multipleSelection: [],   // 代表哪些项已经被选择 √
            // 表单验证
            rules: {
                name: [
                    {required: true, message: '请输入歌手名', trigger: 'blur'}
                ],
                location: [
                    {required: true, message: '请输入地区', trigger: 'blur'}
                ],
                introduction: [
                    {required: true, message: '请输入简介', trigger: 'blur'}
                ]
            }
        }
    },
    computed:{
        // 计算当前搜索结果表的数据
        data(){
            return this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
        }
    },
    // 监控页面是是否发生变化
    watch:{
        // 搜索框里面的内容发生变化的时候，搜索结果 table列表的内容跟着它的内容发生变化
        select_word: function(){
            if (this.select_word == '') {
                this.tableData = this.tempData;
            } else {
                this.tableData = [];
                for(let item of this.tempData){
                    if (item.name.includes(this.select_word)) {
                        this.tableData.push(item);
                    }
                }
            }
        }
    },
    created(){
        this.getData();
    },
    methods:{
        // 查询所有歌手
        getData(){
            this.tempData = [];
            this.tableData = [];
            getAllSinger().then(res => {
                this.tempData = res;
                this.tableData = res;
                this.currentPage = 1;
            })
        },
        // 添加歌手
        addSinger(){
             // 提交前 判断 用户名 密码是否为 null 通过 registForm 上的 rules 进行校验 返回检验结果
            this.$refs['registForm'].validate(valid => {
                if (valid) {
                    let d = this.registForm.birth;
                    let datetime = d.getFullYear()+'-'+(d.getMonth()+1+'-'+d.getDate());
                    let params = new URLSearchParams();
                    params.append('name', this.registForm.name);
                    params.append('sex', this.registForm.sex);
                    params.append('pic', '/img/singerPic/hhh.jpg');
                    params.append('birth',datetime);
                    params.append('location', this.registForm.location);
                    params.append('introduction', this.registForm.introduction);

                    setSinger(params).then(res => {
                        if (res.code == 1) {
                            this.getData();
                            this.notify('添加成功', "success");
                        } else{
                            this.notify('添加失败', "error");
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
                    this.centerDialogVisable = false;
                }
            })
        },
        // 弹出编辑页面
        handleEdit(row){
            this.editVisible = true;
            this.form = {
                id: row.id,
                name: row.name,
                sex: row.sex,
                birth: row.birth,
                location: row.location,
                introduction: row.introduction
            }
        },
        // 保存编辑页面修改的数据
        editSave(){
             // 提交前 判断 用户名 密码是否为 null 通过 registForm 上的 rules 进行校验 返回检验结果
            this.$refs['form'].validate(valid => {
                if (valid) {
                    let d = new Date(this.form.birth);
                    let datetime = d.getFullYear()+'-'+(d.getMonth()+1+'-'+d.getDate());
                    let params = new URLSearchParams();
                    params.append('id', this.form.id);
                    params.append('name', this.form.name);
                    params.append('sex', this.form.sex);
                    params.append('birth',datetime);
                    params.append('location', this.form.location);
                    params.append('introduction', this.form.introduction);

                    updateSinger(params).then(res => {
                        if (res.code == 1) {
                            this.getData();
                            this.notify('修改成功', "success");
                        } else{
                            this.notify('修改失败', "error");
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
                    this.editVisible = false;
                }
            })
        },
        // 更新图片
        uploadUrl(id){
            return `${this.$store.state.HOST}/singer/updateSingerPic?id=${id}`
        },
        // 获取当前页
        handelCurrentChange(val){
            this.currentPage = val;
        },
        // 删除一名歌手
        delRow(){
            let params = new URLSearchParams();
            params.append('id', this.idx);
            deleteSinger(params).then(res => {
                if (res) {
                    this.getData();
                    this.notify('删除成功', "success");
                } else{
                    this.notify('删除失败', "error");
                }
            })
            .catch(err => {
                console.log(err);
            });
            this.delVisible = false;
        },
        // 转向歌曲管理页面
        songEdit(id, name){
            this.$router.push({path:`/Song`, query:{id,name}})
        }
    }
}
</script>

<style scoped>
.handle-box{
    margin-bottom: 20px;
}

.singer-img{
    width: 100%;
    height: 80px;
    border-radius: 5px;
    margin-bottom: 5px;
    overflow: hidden;
}

.handle-input{
    width: 300px;
    display: inline-block;
}

.pageination{
    display: flex;
    justify-content: center;
}
</style>