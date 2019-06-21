<template>
  <div class="tab-container">
    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane  label="基本设置" name="1">
        <keep-alive>
          <el-form ref="baseConfig" :model="baseConfig" label-width="160px" style="width: 600px;">
          <el-form-item label="关闭网站">
            <el-switch v-model="baseConfig.isClose"></el-switch>
          </el-form-item>
          <el-form-item label="关闭原因">
            <el-input type="textarea" v-model="baseConfig.closeReason"></el-input>
          </el-form-item>
            <el-form-item label="关闭注册">
              <el-switch v-model="baseConfig.isRegister"></el-switch>
            </el-form-item>
            <el-form-item label="ICP备案证书号">
              <el-input v-model="baseConfig.ICPNO"></el-input>
            </el-form-item>
            <el-form-item label="市场价格比例">
              <el-input v-model="baseConfig.marketPriceRatio"></el-input>
            </el-form-item>
            <el-form-item label="消费积分名称">
              <el-input v-model="baseConfig.consumptionPointsName"></el-input>
            </el-form-item>
            <el-form-item label="积分换算比例">
              <el-input v-model="baseConfig.integralConversionRatio"></el-input>
            </el-form-item>
            <el-form-item label="积分支付比例">
              <el-input v-model="baseConfig.integralPaymentRatio"></el-input>
            </el-form-item>
            <el-form-item label="商品货号前缀">
              <el-input v-model="baseConfig.shopNumberPrefix"></el-input>
            </el-form-item>
            <el-form-item label="用户评论是否需要审核">
              <el-switch v-model="baseConfig.isCommentReviewed"></el-switch>
            </el-form-item>
            <el-form-item label="会员注册赠送积分">
              <el-input v-model="baseConfig.registerPresentExp"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmitConfig">保存</el-button>
            </el-form-item>
          </el-form>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane  label="商店信息" name="2">
        <keep-alive>
          <el-form ref="shop" :model="shop" label-width="160px" style="width: 600px;">
            <el-form-item label="寄件人姓名">
              <el-input v-model="shop.sender"></el-input>
            </el-form-item>
            <el-form-item label="商店名称">
              <el-input v-model="shop.shopName"></el-input>
            </el-form-item>
            <el-form-item label="商店标题">
              <el-input v-model="shop.shopTitle" placeholder="商店的标题将显示在浏览器的标题栏"></el-input>
            </el-form-item>
            <el-form-item label="商店描述">
              <el-input v-model="shop.shopDescribe"></el-input>
            </el-form-item>
            <el-form-item label="商店关键字">
              <el-input v-model="shop.shopKeyWord"></el-input>
            </el-form-item>
            <el-form-item label="所在省市区">
              <el-cascader
                :options="region"
                v-model="shop._region"
                @active-item-change="handleItemChange"
                :props="regionProps"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="详细地址">
              <el-input v-model="shop.completeAddress"></el-input>
            </el-form-item>
            <el-form-item label="客服QQ">
              <el-input v-model="shop.serviceQQ"></el-input>
            </el-form-item>
            <el-form-item label="邮件地址">
              <el-input v-model="shop.serviceEmail"></el-input>
            </el-form-item>
            <el-form-item label="客服电话">
              <el-input v-model="shop.serviceCall"></el-input>
            </el-form-item>

            <el-form-item label="商店 Logo(推荐分辨率180x90)">
              <Croppa ref="shopLogo" v-model="shop.shopLogo" :width="180" :height="90"></Croppa>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="onSubmit">保存</el-button>
            </el-form-item>
          </el-form>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import { fetchModel,fetchRegion,createModel,updateModel} from '@/api/model'
  import Croppa from '@/components/Croppa'
  let citis_arr={};
export default {
  name: 'SystemConfig',
  components: { Croppa},
  data() {
    return {
      uploadURL: process.env.BASE_API+'/upload/image',
      activeName: '1',
      region: [{
        region_name: '中国',
        region_id: 1,
        all:{
          region_name: '中国',
          region_id: 1,
        },
        cities: []
      }],
      regionProps: {
        value: 'all',
        label: 'region_name',
        children: 'cities',
      },
      shop: {
        shopID:'',
        _region:[],
        sender: '',
        shopName: '',
        shopTitle: '',
        shopDescribe: '',
        shopKeyWord: '',
        location: '',
        completeAddress: '',
        serviceQQ: '',
        serviceEmail: '',
        serviceCall: '',
        shopLogo: '',
      },
      baseConfig:{
        isClose: false,
        closeReason: '',
        isRegister: false,
        ICPNO: '',
        marketPriceRatio: '',
        consumptionPointsName: '',
        integralConversionRatio: '',
        integralPaymentRatio: '',
        shopNumberPrefix: '',
        isCommentReviewed: false,
        registerPresentExp: '',
      }
    }
  },
  methods: {
    handleItemChange(vals) {
      let val_obj=vals[vals.length-1];
      let val=val_obj.region_id;
      if(!citis_arr[val]) {
        let obj = this.getDataIndex(Number(val), this.region);
        if (obj) {
          citis_arr[val]=obj;
          if (obj.cities && obj.cities.length > 0)
            return;
          fetchRegion(val).then(data => {
            if(data.result.length>0) {
              obj.cities = data.result;
            }
          })
        }
      }
    },
    getDataIndex(val,data){
      for(let v of data) {
        if (v.region_id == val)
          return v;
        if (v.cities && v.cities.length > 0) {
          let res = this.getDataIndex(val, v.cities);
          if (res)
            return res;
        }
      }
    },
    saveData(){
      this.loading = true

      this.shop.location=this.shop._region[0].region_name+this.shop._region[1].region_name+this.shop._region[2].region_name+this.shop._region[3].region_name;

        updateModel('shopConfig',this.shop.shopID ,this.form).then(res => {
          this.$notify({
            title: '成功',
            message: res.msg,
            type: 'success',
            duration: 2000
          });
          this.loading = false;
        }).catch(err => {
          this.loading = false;
          console.log(err)
        })

    },
    onSubmitConfig() {

    },
    async onSubmit() {
      let res=await this.$refs['shopLogo'].upload();
      if(res) {
        this.$refs.shop.validate(valid => {
          if (valid) {
            this.saveData();
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }

    },
    handleAvatarSuccess(res, file) {
      if(res.success) {
        this.shop.shopLogo = res.result.docUrl;
      }else{
        this.$message({
          message: res.msg,
          type: 'error'
        })
      }
    },
    beforeImgUpload(file) {

      const isJPG = /(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(file.type);
      const isLt2M = file.size / 1024 / 1024 < 2;

      if(!isJPG){
        this.$message.error('上传图片只能是JPG/PNG/GIF格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
  }
}
</script>

<style scoped>
  .tab-container{
    margin: 30px;
  }
</style>
