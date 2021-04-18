<template>
    <div class="table">
        <div class="crumbs">
            <i class="el-icon-tickets">歌曲信息</i>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" size="mini" @click="deleteAll">批量删除</el-button>
                <!-- 姓名模糊查询 -->
                <el-input v-model="select_word" size="mini" placeholder="请输入歌曲名" class="handle-input"/>
                <el-button type="primary" size="mini" @click="centerDialogVisable=true">添加歌曲</el-button>
            </div>
        </div>
        <!-- 查询所有歌手 -->
        <el-table size="mini" ref="multipleTable" border style="width:100%" height="700px" :data="data" @selection-change="handelSelectionChange">
            <!-- 批量删除 -->
            <el-table-column type="selection" width="40"/>
            <el-table-column label="歌曲图片" width="110" align="center">
                <!-- 当前单元格 -- 当前条数据 -->
                <template slot-scope="scope">
                    <div class="song_img">
                        <!-- 数据库存的是相对地址 理应还需要一个项目地址前缀 vue 提供了一个store进行存放 -->
                        <img :src="getUrl(scope.row.pic)" style="width:100%"/>
                    </div>
                    <div class="play" @click="setSongUrl(scope.row.url, scope.row.name)">
                        <div v-if="toggle == scope.row.name">
                            <svg class="icon">
                                <use xlink:href="#icon-zanting"></use>
                            </svg>
                        </div>
                        <div v-if="toggle != scope.row.name">
                            <svg class="icon">
                                <use xlink:href="#icon-bofanganniu"></use>
                            </svg>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="歌手-歌名" width="120" align="center"/>
            <el-table-column prop="introduction" label="专辑" width="150" align="center"/>
            <el-table-column label="歌词" align="center">
                <template slot-scope="scope">
                    <ul style="height:100px; overflow:scroll">
                        <li v-for="(item, index) in parseLyric(scope.row.lyric)" :key="index">
                            {{item}}
                        </li>
                    </ul>
                </template>
            </el-table-column>
            <!-- 资源更新 -->
            <el-table-column label="资源更新" align="center" width="100px">
                <template slot-scope="scope">
                    <el-upload :action="uploadUrl(scope.row.id)" 
                    :before-upload="beforeAvatarUpload" :on-success="handleAvatarSuccess">
                        <el-button size="mini">更新图片</el-button>
                    </el-upload>
                    <br>
                    <el-upload :action="uploadSongUrl(scope.row.id)" 
                    :before-upload="beforeSongUpload" :on-success="handleSongSuccess">
                        <el-button size="mini">更新歌曲</el-button>
                    </el-upload>
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
        <el-dialog title="添加歌曲" :visible.sync="centerDialogVisable" width="400px" center>
            <el-form :model="registForm" ref="registForm" label-width="80px" action="" id="tf">
                <div>
                    <label for="">歌名</label>
                    <el-input type="text" name="name"></el-input>
                </div>
                <div>
                    <label for="">专辑</label>
                    <el-input type="text" name="introduction"></el-input>
                </div>
                <div>
                    <label for="">歌词</label>
                    <el-input type="textarea" name="lyric"></el-input>
                </div>
                <div>
                    <label for="">歌曲上传</label>
                    <input type="file" name="file">
                </div>
            </el-form>
            <span slot="footer">
                <el-button size="mini" @click="centerDialogVisable=false">取消</el-button>
                <el-button size="mini" @click="addSong">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="修改歌曲" :visible.sync="editVisible" width="600px" center>
            <el-form :model="form" ref="form" label-width="80px">
                <el-form-item prop="name" label="歌手-歌名" size="mini">
                    <el-input v-model="form.name" placeholder="歌手-歌名"></el-input>
                </el-form-item>
                <el-form-item prop="introduction" label="专辑" size="mini">
                    <el-input v-model="form.introduction" placeholder="专辑"></el-input>
                </el-form-item>
                <el-form-item prop="lyric" label="歌词" size="mini">
                    <el-input v-model="form.lyric" placeholder="歌词" type="textarea"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button size="mini" @click="editVisible=false">取消</el-button>
                <el-button size="mini" @click="editSave">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="删除歌曲" :visible.sync="delVisible" width="300px" center>
            <div align="center">删除不可恢复，是否确定删除？</div>
            <span slot="footer">
                <el-button size="mini" @click="delVisible=false">取消</el-button>
                <el-button size="mini" @click="delRow">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {mixin} from "../mixins/index";
import {mapGetters} from 'vuex';
import '@/assets/js/iconfont.js';
import {selectById, updateSong, deleteSong} from "../api/index";
export default {
    mixins:[mixin],
    data(){
        return{
            singerId: '',               // singer传过来的 id
            singerName: '',             // 歌手名
            centerDialogVisable: false,  //添加弹窗是否显示
            editVisible: false,          //编辑弹窗是否显示
            delVisible: false,           //删除弹窗是否显示
            registForm:{ // 添加框
                name: "",
                singerName:'',          // 歌手中文名
                introduction: '',
                lyric: ''                // 歌词
            },
            form:{ // 编辑框
                id: '',
                name: "",
                introduction: '',
                lyric: ''
            },
            tableData: [],
            tempData: [],
            // 输入的文字
            select_word: '',
            pageSize: 5, // 分页每页大小
            currentPage: 1, // 当前页
            multipleSelection: [],   // 代表哪些项已经被选择 √
            toggle: false            // 播放器的显示图标状态
        }
    },
    computed:{
        ...mapGetters([
            'isPlay'
        ]),
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
        this.singerId = this.$route.query.id;
        this.singerName = this.$route.query.name;
        this.getData();
    },
    destroyed(){
        this.$store.commit('setIsPlay', false);
    },
    methods:{
         // 获取当前页
        handelCurrentChange(val){
            this.currentPage = val;
        },
        // 根据歌手id查询歌曲列表
        getData(){
            this.tempData = [];
            this.tableData = [];
            let params = new URLSearchParams();
            params.append('id', this.singerId);
            selectById(params).then(res => {
                this.tempData = res;
                this.tableData = res;
                this.currentPage = 1;
            })
        },
        // 添加歌曲
        addSong(){
            let _this = this;
            var form = new FormData(document.getElementById('tf'));
            form.append('singerId', this.singerId);
            form.set('name',this.singerName + '-' + form.get('name'));
            if (!form.get('lyric')) {
                form.set('lyric', '[00:00:00]暂无歌词');
            }
            var req = new XMLHttpRequest();
            req.onreadystatechange = function(){
                // req.readyState == 4 获取到返回的完整数据
                // req.status == 200 说明和后台正常交互完成
                if (req.readyState == 4 && req.status == 200) {
                    let res = JSON.parse(req.response);
                    if (res.code) {
                        _this.getData();
                        _this.registForm = {};
                        _this.notify(res.msg, 'success');
                    } else{
                        _this.notify('保存失败', 'error');
                    }
                }
            }
            req.open('post', `${_this.$store.state.HOST}/song/insert`, true);
            req.send(form);
            _this.centerDialogVisable = false;
        },
        // 弹出编辑页面
        handleEdit(row){
            this.editVisible = true;
            this.form = {
                id: row.id,
                name: row.name,
                introduction: row.introduction,
                lyric: row.lyric
            }
        },
        // 保存编辑页面修改的数据
        editSave(){
            let params = new URLSearchParams();
            params.append('id', this.form.id);
            params.append('name', this.form.name);
            params.append('introduction', this.form.introduction);
            params.append('lyric', this.form.lyric);

            updateSong(params).then(res => {
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
        },
        // 更新图片
        uploadUrl(id){
            return `${this.$store.state.HOST}/song/updateSongPic?id=${id}`
        },
        // 删除一名歌手
        delRow(){
            let params = new URLSearchParams();
            params.append('id', this.idx);
            deleteSong(params).then(res => {
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
        //解析歌词
        parseLyric(text){
            let lines = text.split("\n");
            let pattern = /\[\d{2}:\d{2}.(\d{3}|\d{2})\]/g;
            let result = [];
            for(let item of lines){
                let value = item.replace(pattern,'');
                result.push(value);
            }
            return result;
        },
        // 上传歌曲之前的校验
        beforeSongUpload(file){
            // 文件扩展名 保留 . 后面的
            var testMsg = file.name.substring(file.name.lastIndexOf('.') + 1);
            if (testMsg != 'mp3') {
                this.$message({
                    message: '上传文件只能是mp3格式',
                    type: 'error'
                });
                return false;
            }
            return true;
        },
        // 上传歌曲成功后要做的工作 res： 结果
        handleSongSuccess(res){
            let _this = this;
            if (res.code == 1) {
                // 重新查询 刷新页面
                _this.getData();
                _this.$notify({
                    title: '上传成功',
                    type: 'success'
                });
            } else {
                _this.$notify({
                    title: '上传失败',
                    type: 'error'
                });
            }
        },
        // 更新歌曲 url
        uploadSongUrl(id){
            return `${this.$store.state.HOST}/song/updateSongUrl?id=${id}`
        },
        // 切换播放音乐歌曲
        setSongUrl(url, name) {
            this.toggle = name;
            this.$store.commit('setUrl', this.$store.state.HOST + url);
            if (this.isPlay) {
                this.$store.commit('setIsPlay', false);
            } else{
                this.$store.commit('setIsPlay', true);
            }
        }
    },
    
}
</script>

<style scoped>
.handle-box{
    margin-bottom: 20px;
}

.song_img{
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
.play{
    position: absolute;
    z-index: 100;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    top: 18px;
    left: 15px;
}

.icon{
    width: 2em;
    height: 2em;
    color: white;
    fill: currentColor;
    overflow: hidden;
}
</style>