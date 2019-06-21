<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="订单编号">
      <template slot-scope="scope">
        {{scope.row.billNo}}
      </template>
    </el-table-column>
    <el-table-column label="应付金额" min-width="200" align="center">
      <template slot-scope="scope">
        ¥{{scope.row.payableAmount | toThousandslsFilter}}
      </template>
    </el-table-column>
    <el-table-column label="实付金额" min-width="200" align="center">
      <template slot-scope="scope">
        ¥{{scope.row.paidAmount | toThousandslsFilter}}
      </template>
    </el-table-column>
    <el-table-column label="状态"  width="100" align="center">
      <template slot-scope="scope">
        <el-tag  :type="scope.row.billStatus | statusFilter"> {{scope.row.billStatus | billStatusFilter}}</el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  import { fetchList } from '@/api/order'
  const aweek=function () {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
    return [start, end];
  }
  export default {
    data() {
      return {
        list: null,
        listQuery: {
          page: 1,
          limit: 10,
          billNo:'',
          startDate: aweek()[0],
          endDate:aweek()[1],
          billStatus: ''
        },
      }
    },
    filters: {
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
      this.fetchData()
    },
    methods: {
      fetchData() {
        fetchList(this.listQuery).then(data => {
          this.list = data.result;
        })
      } }

  }
</script>
