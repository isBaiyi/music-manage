<template>
    <div class="table">
        <div class="crumbs">
            <i class="el-icon-tickets">歌单歌曲信息</i>
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
        <el-table size="mini" ref="multipleTable" border style="width:100%" height="700px" :data="tableData" @selection-change="handelSelectionChange">
            <!-- 批量删除 -->
            <el-table-column type="selection" width="40"/>
            <el-table-column prop="name" label="歌手-歌名" align="center"/>
            <!-- 歌单歌曲相关操作 -->
            <el-table-column label="操作" width="150" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="添加歌曲" :visible.sync="centerDialogVisable" width="400px" center>
            <el-form :model="registForm" ref="registForm" label-width="80px" action="" id="tf">
                <el-form-item prop="singName" label="歌手名字" size="mini">
                    <el-input v-model="registForm.singerName" placeholder="歌手名字"></el-input>
                </el-form-item>
                <el-form-item prop="songName" label="歌曲名字" size="mini">
                    <el-input v-model="registForm.songName" placeholder="歌曲名字"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button size="mini" @click="centerDialogVisable=false">取消</el-button>
                <el-button size="mini" @click="getSongId">确定</el-button>
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
import {selectBySongListId, selectBySongId, selectBySongName, deleteListSong, listSongAdd} from "../api/index";
export default {
    mixins:[mixin],
    data(){
        return{
            centerDialogVisable: false,  //添加弹窗是否显示
            delVisible: false,           //删除弹窗是否显示
            registForm:{ // 添加框
                singerName: '',          // 歌手
                songName: ''             // 歌曲名字
            },
            tableData: [],
            tempData: [],
            // 输入的文字
            select_word: '',
            idx: -1,
            multipleSelection: [],   // 代表哪些项已经被选择 √
            songListId: ''           // 歌单id
        }
    },
    // 监控页面是是否发生变化
    watch:{
        // 搜索框里面的内容发生变化的时候，搜索结果 table列表的内容跟着它的内容发生变化 --> 实现条件查询
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
        this.songListId = this.$route.query.id;
        this.getData();
    },
    methods:{
        // 根据歌手id查询歌曲列表
        getData(){
            this.tempData = [];
            this.tableData = [];
            let params = new URLSearchParams();
            params.append('songListId', this.songListId);
            selectBySongListId(params).then(res => {
                // 查询返回的数据是一个列表，这里需要遍历查询得到数据
                for(let item of res){
                    this.getSong(item.songId);  // 把列表中的 songId 传过去
                }
            })
        },
        // 根据歌曲 id 查询歌曲对象放到 tableData 和 tempData 中
        getSong(id){
            let params = new URLSearchParams();
            params.append('id', id);
            selectBySongId(params).then(res => {
                // 得到 song
                this.tempData.push(res);
                this.tableData.push(res);
            })
            .catch(err => {
                console.log(err);
            });   
        },
        // 添加歌曲前的准备，获取到歌曲 id
        getSongId(){
            let _this = this;
            // 此处需要注意的是 前台的歌手名称
            var name = _this.registForm.singerName + "-" + _this.registForm.songName;
            let params = new URLSearchParams();
            params.append('songName', name);
            selectBySongName(params).then(
                res => {
                    _this.addSong(res[0].id);
                }
            )
        },
        // 添加歌单歌曲
        addSong(songId){
            let _this = this;
            let params = new URLSearchParams();
            params.append('songId', songId);
            params.append('songListId', this.songListId);

            listSongAdd(params).then(res => {
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
            _this.centerDialogVisable = false;
        },
        // 删除一条歌单歌曲
        delRow(){
            let params = new URLSearchParams();
            params.append('songListId', this.songListId);
            params.append('songId', this.idx);
            deleteListSong(params).then(res => {
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