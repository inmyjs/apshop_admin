<template>
  <div class="dashboard-editor-container">
    <panel-group @handleSetLineChartData="handleSetLineChartData"></panel-group>

    <el-row style="margin-top:30px;background:#fff;padding:15px 15px 0;">
      <line-chart :chart-data="lineChartData"></line-chart>
    </el-row>

   <!-- <el-row style="margin-top:30px;" :gutter="30">
      <el-col :span="8">
        <div class="chart-wrapper">
          <raddar-chart></raddar-chart>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="chart-wrapper">
          <pie-chart></pie-chart>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="chart-wrapper">
          <bar-chart></bar-chart>
        </div>
      </el-col>
    </el-row>-->

    <el-row style="margin-top:30px;">
      <el-col :span="24" style="padding-right:8px;">
        <transaction-table></transaction-table>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'

import { getReportDetail} from '@/api/report'
const lineChartData = {
  register: '新注册',
  guestBook: '留言',
  account: '收益',
  order: '订单'
}

export default {
  name: 'dashboard-admin',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TransactionTable,
    TodoList,
    BoxCard
  },
  data() {
    return {
      lineChartData: {xdata:[],ydata:[],reportName:''}
    }
  },
  created() {
    this.handleSetLineChartData('register')
  },
  methods: {
    handleSetLineChartData(type) {
      getReportDetail({type:'D',reportType:type,range:30}).then(data => {
        var res=data.result;
        this.lineChartData = {ydata:res.ydata,xdata:res.xdata,reportName:lineChartData[type]};
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 30px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 15px 15px 0;
  }
}
</style>
