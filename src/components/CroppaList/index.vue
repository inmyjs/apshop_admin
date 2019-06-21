<template>
  <ul class="upload-list">
    <li v-for="(item, index) in list">
    <Croppa
      :index="index"
            v-model="item.url"
            :width="width"
            :height="height"
            :isShowUpload="true"
            @onSelect="onSelect"
            @onRemove="onRemove"
            @onUpload="onUpload"
            :quality="quality">
    </Croppa>
    </li>
  </ul>
</template>

<script>
  import Croppa from '@/components/Croppa'

  export default {
    name: 'CroppaList',
    components: {Croppa },
    props: {
      value: {
        type: Array,
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
      quality: {
        type: Number,
        required: false,
        default: 1
      },
    },
    data(){
      return {
        hasChange: false,
        hasInit: false,
        list:[
          {
            url:'',
            name:'',
          }
        ],
        uploadList:[]
      }
    },
    watch: {
      value(val) {
        if (!this.hasChange&&!this.hasInit) {
          if(Array.isArray(val) &&val.length>0) {
            this.list = val.concat([{
              url:'',
              name:'',
            }]);
            this.uploadList=this.uploadList.concat(val);
          }
          this.hasInit=true;
        }
      }
    },
    methods:{
      onSelect(file){
        this.list.push({
          url:'',
          name:''
        })
      },
      onRemove(index){
        this.hasChange=true;
        this.list.splice(index, 1);
        this.uploadList.splice(index, 1);
        this.$emit('input', this.uploadList);
      },
      onUpload(file){
        this.hasChange=true;
        this.uploadList.push(file);
        this.$emit('input', this.uploadList);
      }
    }
  }
</script>

<style scoped>
  .upload-list,.upload-list li{
    list-style:none; /* 将默认的列表符号去掉 */
    padding:0; /* 将默认的内边距去掉 */
    margin:0; /* 将默认的外边距去掉 */
  }
  .upload-list li {
    float:left; /* 往左浮动 */
    margin-right: 10px;
  }
</style>
