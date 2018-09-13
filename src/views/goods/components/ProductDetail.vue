<template>
  <div class="createPost-container">
    <el-form class="form-container" status-icon :model="postForm" :rules="rules" ref="postForm">

      <sticky :className="'sub-navbar '+postForm.status">
        <template v-if="fetchSuccess">
          <el-dropdown trigger="click">
            <el-button>{{!postForm.comment_disabled?'评论已打开':'评论已关闭'}}
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu class="no-padding" slot="dropdown">
              <el-dropdown-item>
                <el-radio-group style="padding: 10px;" v-model="postForm.comment_disabled">
                  <el-radio :label="true">关闭评论</el-radio>
                  <el-radio :label="false">打开评论</el-radio>
                </el-radio-group>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm()">发布
          </el-button>
          <el-button style="margin-left: 10px;" @click="resetForm('postForm')">重置
          </el-button>
        </template>
        <template v-else>
          <el-tag>发送异常错误,刷新页面,或者联系老大</el-tag>
        </template>

      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="21">
            <el-row>
            <el-col :span="6">
              <el-tooltip class="item" effect="dark" content="商品封面" placement="top">
            <el-upload
              class="avatar-uploader"
              :action="uploadURL"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeImgUpload">
              <img v-if="postForm.imgurl" :src="postForm.imgurl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
              </el-tooltip>
            </el-col>
            <el-col :span="15">
              <el-form-item style="" prop="title">
                <MDinput name="name" v-model="postForm.title" required :maxlength="100">
                  标题
                </MDinput>
                <span v-show="postForm.title.length>=26" class='title-prompt'>APP可能会显示不全</span>
              </el-form-item>
              <el-form-item label="商品名称:" prop="name">

                  <el-input  placeholder="请输入商品名称" v-model="postForm.name">
                  </el-input>

                <span class="word-counter" v-show="contentShortLength">{{contentShortLength}}字</span>
              </el-form-item>
            </el-col>
            </el-row>
            <div class="postInfo-container">
                <el-row>
                <el-col :span="6">
                  <el-form-item label="类型:" class="postInfo-container-item"  prop="goodsType">
                    <el-select clearable class="filter-item" style="min-width:200px;" v-model="postForm.goodsType" placeholder="类型">
                      <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                  <el-col :span="6">
                    <el-form-item label="市场价:" class="postInfo-container-item" prop="priceMarket">
                      <el-input-number placeholder="市场价" style='min-width:200px;' v-model.number="postForm.priceMarket">
                      </el-input-number>
                    </el-form-item>
                  </el-col>
                <el-col :span="6">
                    <el-form-item label="销售价:" class="postInfo-container-item" prop="price">
                      <el-input-number placeholder="销售价" style='min-width:200px;' v-model.number="postForm.price">
                      </el-input-number>
                    </el-form-item>
                </el-col>
                  <el-col :span="6">
                    <el-form-item  label="状态:" class="postInfo-container-item" prop="goodsStatus">
                      <el-select clearable class="filter-item" style="min-width:200px;" v-model="postForm.goodsStatus" placeholder="状态">
                        <el-option v-for="item in  calendargoodsStatusOptions" :key="item.key" :label="item.display_name" :value="item.key">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item  label="库存:" class="postInfo-container-item" prop="stock">
                    <el-input-number placeholder="库存" style='min-width:200px;' v-model.number="postForm.stock">
                    </el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item  label="显示顺序:" class="postInfo-container-item" prop="sortNo">
                      <el-input-number placeholder="显示顺序" style='min-width:200px;' v-model.number="postForm.sortNo">
                      </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item  label="推荐:" class="postInfo-container-item">
                      <el-checkbox v-model="postForm.recommendFlag" style='min-width:200px;' label="首页" border></el-checkbox>
                    </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <div class="editor-container">
          <tinymce :height=400 ref="editor" v-model="postForm.note"></tinymce>
        </div>
        <el-upload
          ref="uploadImages"
          :action="uploadURL"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-success="handlePictureCardSuccess"
          :on-remove="handleRemove"
          :file-list="postForm.goodsImages"
          :before-upload="beforeImgUpload">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" size="tiny">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </div>
    </el-form>

  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/singleImage'
import MDinput from '@/components/MDinput'
import Multiselect from 'vue-multiselect'// 使用的一个多选框组件，element-ui的select不能满足所有需求
import 'vue-multiselect/dist/vue-multiselect.min.css'// 多选框组件css
import Sticky from '@/components/Sticky' // 粘性header组件
import { fetchGoods,postGoods } from '@/api/goods'

import ElRow from "element-ui/packages/row/src/row";
import ElInputNumber from "../../../../node_modules/element-ui/packages/input-number/src/input-number.vue";

const defaultForm = {
  goodsID:'',
  title: '', // 标题
  note: '', // 详情
  name: '', // 名称
  goodsType:'',
  imgurl:'',
  price:0,
  priceMarket:0,
  stock:500,
  goodsStatus:'0',
  sortNo:0,
  goodsImages:[],
  recommendFlag:false,
  comment_disabled: false
}

const calendarTypeOptions = [
  { key: 'T', display_name: '主题' },
  { key: 'C', display_name: '组件' }
]
const calendargoodsStatusOptions = [
  { key: '0', display_name: '新建' },
  { key: 'D', display_name: '下架' },
  { key: 'U', display_name: '上架' },
  { key: 'C', display_name: '删除' }
]


export default {
  name: 'productDetail',
  components: {
    ElInputNumber,
    ElRow,
    Tinymce, MDinput, Upload, Multiselect, Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    goods_id:''
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      uploadURL: process.env.BASE_API+'/upload/image',
      calendarTypeOptions,
      calendargoodsStatusOptions,
      postForm: Object.assign({}, defaultForm),
      fetchSuccess: true,
      loading: false,
      rules: {
        title: [{ required: true, message:'请输入标题', trigger: 'blur' }],
        name: [{ required: true,  message:'请输入商品名',trigger: 'blur' }],
        goodsType:[{ required: true,  message:'请选择类型',trigger: 'blur' }],
        price:[{type: 'number', required: true,  message:'请输入价格',trigger: 'blur' }],
        priceMarket:[{type: 'number', required: true,  message:'请输入市场价',trigger: 'blur' }],
        goodsStatus:[{ required: true,  message:'请选择状态',trigger: 'blur' }]
      }
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.name.length
    }
  },
  created() {
    if (this.isEdit) {
      this.fetchData()
    } else {
      this.postForm = Object.assign({opBy:this.$store.state.user.name}, defaultForm);
      this.postForm.goodsImages=[];
    }
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.postForm.imgurl='';
      this.$refs['editor'].setContent('');
      this.postForm.goodsImages=[];
    },
    handleRemove(file, fileList) {
      for (var i = 0; i < this.postForm.goodsImages.length; i++) {
        if (this.postForm.goodsImages[i].name == file.name) {
          this.postForm.goodsImages.splice(i, 1);
          return;
        }
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handlePictureCardSuccess(res, file) {
      this.postForm.goodsImages.push({name:file.name,url:file.response.result,status:file.status});
    },
    handleAvatarSuccess(res, file) {
      if(res.success) {
        this.postForm.imgurl = res.result;
      }else{
        this.$message({
          message: res.msg,
          type: 'error'
        })
      }
    },
    beforeImgUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    fetchData() {
      fetchGoods(this.goods_id).then(res => {
        this.postForm = res.result;
      }).catch(err => {
        this.fetchSuccess = false
        console.log(err)
      })
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          if(this.postForm.goodsStatus=='U'){
            this.$confirm("当前商品为上架状态，您确定要发布吗？","提示").then(()=>{
              this.loading = true;
              postGoods(this.postForm).then(res => {
                this.fetchSuccess = true;
                this.$notify({
                  title: '成功',
                  message: '商品发布成功',
                  type: 'success',
                  duration: 2000
                });
                if (!this.isEdit) this.resetForm('postForm');
                this.loading = false;
                this.postForm.status = 'published';
              }).catch(err => {
                this.fetchSuccess = false;
                this.postForm.status = 'draft';
                console.log(err)
              })
            });
          }else {
            this.loading = true;
            postGoods(this.postForm).then(res => {
                this.fetchSuccess = true;
                this.$notify({
                  title: '成功',
                  message: '商品发布成功',
                  type: 'success',
                  duration: 2000
                });
                this.resetForm('postForm');
              this.loading = false;
              this.postForm.status = 'published';
            }).catch(err => {
              this.fetchSuccess = false;
              this.postForm.status = 'draft';
              console.log(err)
            })
          }
        } else {
          console.log('error submit!!');
          return false
        }
      })
    }
  }
}
</script>
<style>
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
    width: 300px;
    height: 200px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    height: 200px;
    display: block;
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .title-prompt{
    position: absolute;
    right: 0px;
    font-size: 12px;
    top:10px;
    color:#ff4949;
  }
  .createPost-container {
    position: relative;
    .createPost-main-container {
      padding: 40px 45px 20px 50px;
      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;
        .postInfo-container-item {
          float: left;
        }
      }
      .editor-container {
        min-height: 500px;
        margin: 0 0 30px;
        .editor-upload-btn-container {
            text-align: right;
            margin-right: 10px;
            .editor-upload-btn {
                display: inline-block;
            }
        }
      }
    }
    .word-counter {
      width: 40px;
      position: absolute;
      right: -10px;
      top: 0px;
    }
  }
</style>

