// 工具类
export const mixin = {
    methods: {
        // 提示信息
        notify(title, type){
            this.$notify({
                title: title,
                type: type
            })
        },
        // 根据相对地址获取绝对地址
        getUrl(url){
            return `${this.$store.state.HOST}/${url}`
        },
        //根据 0 1 2 3 转换为性别中文
        changeSex(value){
            if (value == 0) {
                return '女';
            }
            if (value == 1) {
                return '男';
            }
            if (value == 2) {
                return '组合';
            }
            if (value == 3) {
                return '不明';
            }
            return value;
        },
        // 获取生日
        attachBirth(val){
            return String(val).substr(0,10);
        },
        // 上传图片之前的校验
        beforeAvatarUpload(file){
            const isJPG = (file.type === 'image/jpeg') || (file.type === 'image/png');
            if (!isJPG) {
                this.$message.error('上传头像图片只能是jpg或png格式');
                return false;
            }
            // 是否大于 2M
            const isLimit2M = (file.size / 1024 / 1024) < 2;
            if (!isLimit2M) {
                this.$message.error('上传头像图片大小不能超过2MB');
                return false;
            }
            return true;
        },
        // 上传图片成功后要做的工作 res： 结果
        handleAvatarSuccess(res){
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
        // 弹出删除窗口
        handleDelete(id){
            this.idx = id;
            this.delVisible = true;
        },
        // 把已经选择的项复制给 multipleSelection
        handelSelectionChange(val){
            this.multipleSelection = val;
        },
        // 批量删除已经选择的项
        deleteAll(){
            for(let item of this.multipleSelection){
                this.handleDelete(item.id);
                this.delRow();
            }
            this.multipleSelection = [];
        }
    },
    
}