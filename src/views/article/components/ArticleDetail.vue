<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <sticky class-name="sub-navbar">
        <CommentDropdown v-model="postForm.comment_disabled" />
        <PlatformDropdown v-model="postForm.platforms" />
        <SourceUrlDropdown v-model="postForm.source_uri" />
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">发布
        </el-button>
        <el-button v-loading="loading" type="warning" @click="draftForm">草稿</el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>

          <el-col :span="24">
            <el-form-item label="封面(700x400):" prop="coverImg">
              <Croppa ref="coverImg" v-model="postForm.coverImg" :width="350" :height="200" :quality="2"></Croppa>
            </el-form-item>
            <el-form-item  prop="title">
              <MDinput v-model="postForm.title" :maxlength="64" name="name" required>
                标题
              </MDinput>
            </el-form-item>
            <el-form-item style="margin-bottom: 40px;" prop="subTitle">
              <MDinput v-model="postForm.subTitle" :maxlength="100" name="name">
                副标题
              </MDinput>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="45px" label="作者:" class="postInfo-container-item">
                    <el-input v-model="postForm.author"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="10">
                  <el-form-item label-width="80px" label="发布时间:" class="postInfo-container-item">
                    <el-date-picker v-model="postForm.createTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间"/>
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item  label-width="80px" label="分类:" class="postInfo-container-item" prop="blogClassID">
                    <el-select v-model="postForm.blogClassID"  placeholder="分类" clearable>
                      <el-option
                        v-for="item in blogClass_options"
                        :key="item.blogClassID"
                        :label="item.name"
                        :value="item.blogClassID">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item style="margin-bottom: 40px;" label-width="45px" label="摘要:" prop="about">
          <el-input :rows="1" v-model="postForm.about" type="textarea" class="article-textarea" autosize placeholder="请输入内容"/>
          <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}字</span>
        </el-form-item>

        <div class="editor-container">
          <Ueditor ref="editor" :height="400" v-model="postForm.content" />
        </div>

      </div>
    </el-form>

  </div>
</template>

<script>
  import Ueditor from '@/components/Ueditor'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { validateURL } from '@/utils/validate'
import { fetchList,createModel,fetchModel ,updateModel} from '@/api/model'
import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'
import Croppa from '@/components/Croppa'
const defaultForm = {
  title: '', // 文章题目
  subTitle: '', // 文章题目
  content: '', // 文章内容
  about: '', // 文章摘要
  source_uri: '', // 文章外链
  coverImg: '', // 文章图片
  createTime: undefined, // 前台展示时间
  blogID: undefined,
  blogClassID: '',
  platforms: ['a-platform'],
  comment_disabled: false,
  importance: 0
}

export default {
  name: 'ArticleDetail',
  components: { Ueditor, MDinput, Croppa, Sticky, CommentDropdown, PlatformDropdown, SourceUrlDropdown },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validateURL(value)) {
          callback()
        } else {
          this.$message({
            message: '外链url填写不正确',
            type: 'error'
          })
          callback(new Error('外链url填写不正确'))
        }
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      blogClass_options: [],
      rules: {
        blogClassID: [{ validator: validateRequire ,trigger: 'blur'}],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
      },
      tempRoute: {}
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.about.length
    },
    lang() {
      return this.$store.getters.language
    }
  },
  created() {
    this.initData()
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    initData(){
      fetchList('blog_class',{where:"status !='C' and parentID=0",page:1,limit:100}).then(data => {
        this.blogClass_options = data.result;
      });
    },
    fetchData(id) {
      fetchModel('blog',id).then(res => {
        this.postForm = res.result;
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = this.lang === 'zh' ? '编辑文章' : 'Edit Article'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('updateVisitedView', route)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$refs.coverImg.clear();
      this.$refs['editor'].setContent('');
    },
    saveData(){
      this.loading = true
      if (!this.isEdit) {
        createModel('blog',this.postForm).then(res => {
          this.$notify({
            title: '成功',
            message: res.msg,
            type: 'success',
            duration: 2000
          });
          if (!this.isEdit) this.resetForm('postForm');
          this.loading = false;
        }).catch(err => {
          this.loading = false;
          console.log(err)
        })
      }else{
        updateModel('blog', this.postForm.blogID ,this.postForm).then(res => {
          this.$notify({
            title: '成功',
            message: res.msg,
            type: 'success',
            duration: 2000
          });
          if (!this.isEdit) this.resetForm('postForm');
          this.loading = false;
        }).catch(err => {
          this.loading = false;
          console.log(err)
        })
      }
    },
    async submitForm() {
      let res=await this.$refs['coverImg'].upload();
      if(res) {
        this.$refs.postForm.validate(valid => {
          if (valid) {
            this.saveData();
          } else {
            console.log('error submit!!');
          }
        });
      }
    },
    draftForm() {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
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
