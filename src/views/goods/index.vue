<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 400px;" class="filter-item" placeholder="标题" v-model="listQuery.title">
      </el-input>

      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.type" placeholder="类型">
        <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>

      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">添加</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="商品编号" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.goodsID}}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="发布时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | timeFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="标题">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.title}}</span>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" label="类型">
        <template slot-scope="scope">
          <span>{{scope.row.goodsType | typeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="单价">
        <template slot-scope="scope">
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="销售量" width="95">
        <template slot-scope="scope">
          <span class="link-type" @click='handleFetchPv(scope.row.numSale)'>{{scope.row.numSale}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="是否推荐" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.recommendFlag | recommendFilter">{{ scope.row.recommendFlag | goodsRecommendFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.goodsStatus | statusFilter">{{ scope.row.goodsStatus | goodsStatusFilter }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <el-button v-if="scope.row.goodsStatus!='U'" size="small" type="success" @click="handleModifyStatus(scope.row,'U')">上架
          </el-button>
          <el-button v-if="scope.row.goodsStatus=='U'" size="small" @click="handleModifyStatus(scope.row,'D')">下架
          </el-button>
          <el-button v-if="scope.row.recommendFlag=='0'" size="small" type="primary" @click="handleRecommendFlag(scope.row,'1')">推荐
          </el-button>
          <el-button v-if="scope.row.recommendFlag=='1'" size="small" type="info" @click="handleRecommendFlag(scope.row,'0')">不推荐
          </el-button>
          <el-button v-if="scope.row.goodsStatus!='C'" size="small" type="danger" @click="handleModifyStatus(scope.row,'C')">删除
          </el-button>
          <el-button v-if="scope.row.goodsStatus=='C'" size="small" type="primary" @click="handleModifyStatus(scope.row,'0')">恢复
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog title="阅读数统计" :visible.sync="dialogPvVisible">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="渠道"> </el-table-column>
        <el-table-column prop="pv" label="pv"> </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, fetchPv ,updateGoodsStatus,updateRecommendFlag} from '@/api/goods'
import waves from '@/directive/waves/index.js' // 水波纹指令
import { parseTime } from '@/utils'

const calendarTypeOptions = [
  { key: 'E', display_name: '实物' },
  { key: 'V', display_name: '虚拟商品' }
]

// arr to obj
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'productList',
  directives: {
    waves
  },
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        title: '',
        type: ''
      },
      calendarTypeOptions,
      dialogStatus: '',
      dialogPvVisible: false,
      pvData: [],
      tableKey: 0
    }
  },
  filters: {
    timeFilter(time){
      return parseTime(time,'YYYY-MM-DD HH:mm:ss');
    },
    statusFilter(status) {
      const statusMap = {
        D: 'info',
        0: 'info',
        U: 'success',
        C: 'error',
      }
      return statusMap[status]
    },
    goodsStatusFilter(status) {
      const statusMap = {
        D: '下架',
        U: '上架',
        C: '删除',
        0: '新建',
      }
      return statusMap[status]
    },
    recommendFilter(status) {
      const statusMap = {
        0: 'info',
        1: 'success',
      }
      return statusMap[status]
    },
    goodsRecommendFilter(status) {
      const statusMap = {
        0: '不推荐',
        1: '推荐',
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
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
    handleModifyStatus(row, goodsStatus) {
      updateGoodsStatus({goodsID:row.goodsID,goodsStatus}).then(data => {
        this.$message({
          message: data.msg,
          type: 'success'
        })
        row.goodsStatus = goodsStatus;
      })
    },
    handleRecommendFlag(row, recommendFlag) {
      updateRecommendFlag({goodsID:row.goodsID,recommendFlag}).then(data => {
        this.$message({
          message: data.msg,
          type: 'success'
        })
        row.recommendFlag = recommendFlag;
      })
    },
    handleCreate() {
      this.$router.push({path: '/goods/create'})
    },
    handleUpdate(row) {
      this.$router.push({path: '/goods/edit/'+row.goodsID});
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    }
  }
}
</script>
