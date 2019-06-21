<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 250px;" class="filter-item" placeholder="订单编号" v-model="listQuery.billNo">
      </el-input>
      <el-date-picker
        style="width: 350px"
        class="filter-item"
        v-model="dates"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions">
      </el-date-picker>

      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.billStatus" placeholder="状态">
        <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>

      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="订单编号" width="250">
        <template slot-scope="scope">
          <span>{{scope.row.billNo}}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" width="150" label="下单时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | timeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付编号">
        <template slot-scope="scope">
          <span>{{scope.row.payCode}}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="客户">
        <template slot-scope="scope">
          <span>{{scope.row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单金额">
        <template slot-scope="scope">
          <span>¥{{scope.row.billAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="优惠金额">
        <template slot-scope="scope">
          <span>¥{{scope.row.prefAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="应付金额">
        <template slot-scope="scope">
          <span>¥{{scope.row.payableAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="实付金额">
        <template slot-scope="scope">
          <span>¥{{scope.row.paidAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150" align="center" label="备注">
        <template slot-scope="scope">
          <span>{{scope.row.note}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.billStatus | statusFilter">{{ scope.row.billStatus | billStatusFilter }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button v-if="scope.row.billStatus=='P'" size="small" type="primary" @click="handleModifyStatus(scope.row,'S')">付款
          </el-button>
          <el-button v-if="scope.row.billStatus=='P'" size="small" type="danger" @click="handleModifyStatus(scope.row,'C')">取消
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import { fetchList, fetchOrder ,updateOrderStatus} from '@/api/order'
import waves from '@/directive/waves/index.js' // 水波纹指令
import { parseTime } from '@/utils'

const calendarTypeOptions = [
  { key: '', display_name: '全部' },
  { key: 'P', display_name: '待付款' },
  { key: 'S', display_name: '已付款' },
  { key: 'C', display_name: '已取消' }
]
const aweek=function () {
  const end = new Date();
  const start = new Date();
  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
  return [start, end];
}

export default {
  name: 'orderList',
  directives: {
    waves
  },
  data() {
    return {
      opBy:this.$store.state.user.name,
      list: null,
      total: null,
      listLoading: true,
      dates: aweek(),
      listQuery: {
        page: 1,
        limit: 20,
        billNo:'',
        startDate: '',
        endDate:'',
        billStatus: ''
      },
      calendarTypeOptions,
      dialogStatus: '',
      dialogPvVisible: false,
      pvData: [],
      tableKey: 0,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    }
  },
  filters: {
    timeFilter(time){
      return parseTime(time,'YYYY-MM-DD HH:mm:ss');
    },
    statusFilter(status) {
      const statusMap = {
        P: 'warning',
        S: 'success',
        C: 'info',
      }
      return statusMap[status]
    },
    billStatusFilter(status) {
      const statusMap = {
        P: '待付款',
        S: '已付款',
        C: '已取消',
      }
      return statusMap[status]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.listQuery.startDate=this.dates[0];
      this.listQuery.endDate=this.dates[1];
      fetchList(this.listQuery).then(data => {
        this.list = data.result;
        this.total = data.total;
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleModifyStatus(row, billStatus) {
      this.$confirm("您确定要操作吗？操作后不可恢复!","提示",{type:'warning'}).then(()=> {
        updateOrderStatus({billNo: row.billNo, billStatus,opBy:this.opBy}).then(data => {
          this.$message({
            message: data.msg,
            type: 'success'
          })
          row.billStatus = billStatus;
        })
      }).catch((error)=>{});
    }
  }
}
</script>
