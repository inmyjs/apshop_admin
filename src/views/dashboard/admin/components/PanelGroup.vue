<template>
  <el-row class="panel-group" :gutter="40">
    <el-col :span="6">
      <div class='card-panel' @click="handleSetLineChartData('register')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">新注册</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="reports.register" :duration="1000"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="card-panel" @click="handleSetLineChartData('account')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">收益</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="reports.account" :duration="1000"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="card-panel" @click="handleSetLineChartData('order')">
        <div class="card-panel-icon-wrapper icon-shoppingCard">
          <svg-icon icon-class="shoppingCard" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">订单</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="reports.order" :duration="1000"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">留言</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="reports.guestBook" :duration="1000"></count-to>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
  import { getReportAPI} from '@/api/report'
import CountTo from 'vue-count-to'

export default {
  data(){
    return {
      reports:{
        register:0,
        guestBook:0,
        account:0,
        order:0,
      }
    }
  },
  components: {
    CountTo
  },
  created() {
    this.getReport()
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData',type);
    },
    getReport(){
      getReportAPI().then(data => {
        this.reports = data.result;
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 20px;
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
         background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shoppingCard {
        background: #34bfa3
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shoppingCard {
      color: #34bfa3
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

</style>
