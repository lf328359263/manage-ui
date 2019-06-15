<template>
  <div class="page-header-index-wide">
    <a-row :gutter="24">
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="总任务数" :total="totalTasks">
          <a-tooltip title="Flink集群提交过的总任务数" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <trend flag="up" style="margin-right: 16px;">
              <span slot="term">周同比</span>
              0%
            </trend>
            <trend flag="down">
              <span slot="term">日同比</span>
              0%
            </trend>
          </div>
          <template slot="footer">总任务数<span>  {{ totalTasks }}</span></template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="正在运行" :total="runningTasks | NumberFormat">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <!--<div>-->
          <!--<mini-area />-->
          <!--</div>-->
          <!--<template slot="footer">日访问量<span> {{ '1234' | NumberFormat }}</span></template>-->
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="完成任务" :total="completeTasks | NumberFormat">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <!--<div>-->
          <!--<mini-bar />-->
          <!--</div>-->
          <!--<template slot="footer">转化率 <span>60%</span></template>-->
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="失败任务" :total="failedTasks | NumberFormat">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <!--<div>-->
          <!--<mini-progress color="rgb(19, 194, 194)" :target="80" :percentage="78" height="8px" />-->
          <!--</div>-->
          <!--<template slot="footer">-->
          <!--<trend flag="down" style="margin-right: 16px;">-->
          <!--<span slot="term">同周比</span>-->
          <!--12%-->
          <!--</trend>-->
          <!--<trend flag="up">-->
          <!--<span slot="term">日环比</span>-->
          <!--80%-->
          <!--</trend>-->
          <!--</template>-->
        </chart-card>
      </a-col>
    </a-row>

    <a-card :loading="loading" :bordered="false" :body-style="{padding: '0'}">
    </a-card>
  </div>
</template>

<script>
import { ChartCard, Trend } from '@/components'
import { getInfo } from '../../api/flink'

export default {
  name: 'Overview',
  components: {
    ChartCard,
    Trend
  },
  data () {
    return {
      loading: false,
      totalTasks: 10,
      runningTasks: 5,
      completeTasks: 4,
      failedTasks: 1
    }
  },
  created () {
    this.initFlinkInfo()
  },
  methods: {
    initFlinkInfo () {
      getInfo().then(res => {
        if (res['status'] && res['status'] === '200') {
          const d = res['data']
          this.runningTasks = d['jobs-running']
          this.failedTasks = d['jobs-failed']
          this.completeTasks = d['jobs-finished']
          this.totalTasks = d['jobs-finished'] + d['jobs-running'] + d['jobs-failed'] + d['jobs-cancelled']
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
    .extra-wrapper {
        line-height: 55px;
        padding-right: 24px;

        .extra-item {
            display: inline-block;
            margin-right: 24px;

            a {
                margin-left: 24px;
            }
        }
    }

    .antd-pro-pages-dashboard-analysis-twoColLayout {
        position: relative;
        display: flex;
        display: block;
        flex-flow: row wrap;

        &.desktop div[class^=ant-col]:last-child {
            position: absolute;
            right: 0;
            height: 100%;
        }
    }

    .antd-pro-pages-dashboard-analysis-salesCard {
        height: calc(100% - 24px);
        /deep/ .ant-card-head {
            position: relative;
        }
    }

    .dashboard-analysis-iconGroup {
        i {
            margin-left: 16px;
            color: rgba(0,0,0,.45);
            cursor: pointer;
            transition: color .32s;
            color: black;
        }
    }
    .analysis-salesTypeRadio {
        position: absolute;
        right: 54px;
        bottom: 12px;
    }
</style>
