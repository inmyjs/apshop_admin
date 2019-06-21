<template>
  <div class="croppa-div">
    <croppa v-model="myCroppa"
            :width="width"
            :height="height"
            :quality="quality"
            accept="image/*"
            :zoom-speed="10"
            :file-size-limit="1024000"
            @file-type-mismatch="onFileTypeMismatch"
            @file-size-exceed="onFileSizeExceed"
            @file-choose="onFileChoose"
            @image-remove="onImageRemove"
            :prevent-white-space="true"
            placeholder="Choose an image"
            :style="myCroppaStyle"
            :placeholder-font-size="16">
      <img crossOrigin="anonymous" :src="imgUrl"
           slot="initial">
      <img slot="placeholder" :src="scan">
    </croppa>
    <img class="upload-icon" :src="accept" @click="upload" v-if="isUpload">
  </div>
</template>

<script>
  import { upload} from '@/api/file'
  import scan from './scan.png'
  import accept from './accept.png'
  import 'vue-croppa/dist/vue-croppa.css'
  import Croppa from 'vue-croppa'
  const croppa=Croppa.component

  export default {
    name: 'Croppa',
    components: {croppa },
    props: {
      value: {
        type: String,
        default: ''
      },
      height: {
        type: Number,
        required: false,
        default: 240
      },
      width: {
        type: Number,
        required: false,
        default: 240
      },
      index: {
        type: Number,
        required: false,
        default: 0
      },
      quality: {
        type: Number,
        required: false,
        default: 1
      },
      required: {
        type: Boolean,
        required: false,
        default: true
      },
      isShowUpload: {
        type: Boolean,
        required: false,
        default: false
      },
    },
    data(){
      return {
        scan:scan,
        accept:accept,
        myCroppa: {},
        hasChange: false,
        isUpload: false,
        hasInit: false,
        myCroppaStyle:'height:'+this.height+'px;',
        imgUrl:this.value,
      }
    },
    watch: {
      value(val) {
        if (!this.hasChange&&!this.hasInit) {
          this.imgUrl = val || '';
          this.hasInit=true;
        }
      }
    },
    methods:{
      clear(){
        this.myCroppa.remove();
      },
      onFileChoose(file){
        this.hasChange=true;
        if(this.isShowUpload)
          this.isUpload= true;
        this.$emit('onSelect', file);
      },
      onImageRemove () {
        this.emitInput('')
        this.isUpload= false;
        this.$emit('onRemove',this.index);
      },
      onFileTypeMismatch (file) {
        this.$message({
          message: 'Please choose a jpeg or png file.',
          type: 'error'
        })
      },
      onFileSizeExceed (file) {
        this.$message({
          message: 'Please choose a file smaller than 1MB.',
          type: 'error'
        })
      },
      emitInput(val) {
        this.$emit('input', val)
      },
      async upload(){
        if(this.value) {
          return true;
        }
        if(this.required) {
          let blob = await this.myCroppa.promisedBlob('image/jpeg', 1)
          if (!blob) {
            this.$message({
              message: '请选择1张图片',
              type: 'error'
            })
            return false;
          }
          let data=await upload(this.myCroppa.chosenFile.name, blob);
          this.isUpload= false;
          this.emitInput(data.result.docUrl);
          this.$emit('onUpload',{name:this.myCroppa.chosenFile.name,url:data.result.docUrl});
          this.$notify({
            message: '图片上传成功',
            type: 'success'
          })
        }
        return true;
      }
    }
  }
</script>

<style scoped>
  .croppa-div{
    position: relative;
  }
  .upload-icon{
    position: absolute;
    width:24px;
    height:24px;
    color: green;
    right: -5px;
    top: 20px;
    cursor: pointer;
  }
</style>
