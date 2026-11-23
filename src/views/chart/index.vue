<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { EChartsOption } from 'echarts'
import ChartBox from '@/components/ChartBox.vue'
import { fetchCharts } from '@/api/dashboard'
import type { ChartData } from '@/types'

const data = ref<ChartData | null>(null)

onMounted(async () => {
  data.value = await fetchCharts()
})

const lineOption = computed<EChartsOption>(() => ({
  title: { text: '一周访问趋势', left: 'left', textStyle: { fontSize: 14, fontWeight: 500 } },
  tooltip: { trigger: 'axis' },
  grid: { left: 50, right: 24, top: 50, bottom: 30 },
  xAxis: { type: 'category', data: data.value?.line.categories ?? [], boundaryGap: false },
  yAxis: { type: 'value' },
  series: [
    {
      name: '访问量',
      type: 'line',
      smooth: true,
      data: data.value?.line.values ?? [],
      itemStyle: { color: '#2563eb' },
      areaStyle: { color: '#dbeafe' }
    }
  ]
}))

const barOption = computed<EChartsOption>(() => ({
  title: { text: '设备分类销量', left: 'left', textStyle: { fontSize: 14, fontWeight: 500 } },
  tooltip: { trigger: 'axis' },
  grid: { left: 50, right: 24, top: 50, bottom: 30 },
  xAxis: { type: 'category', data: data.value?.bar.categories ?? [] },
  yAxis: { type: 'value' },
  series: [
    {
      name: '销量',
      type: 'bar',
      barWidth: '45%',
      data: data.value?.bar.values ?? [],
      itemStyle: { color: '#0f9d75', borderRadius: [4, 4, 0, 0] }
    }
  ]
}))

const pieOption = computed<EChartsOption>(() => ({
  title: { text: '访问来源占比', left: 'left', textStyle: { fontSize: 14, fontWeight: 500 } },
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  legend: { bottom: 0 },
  series: [
    {
      name: '来源',
      type: 'pie',
      radius: ['35%', '60%'],
      center: ['50%', '52%'],
      data: data.value?.pie ?? [],
      label: { formatter: '{b} {d}%' }
    }
  ]
}))
</script>

<template>
  <div>
    <div class="page-card chart-block">
      <ChartBox :option="lineOption" height="340px" />
    </div>
    <div class="chart-row">
      <div class="page-card chart-block">
        <ChartBox :option="barOption" height="320px" />
      </div>
      <div class="page-card chart-block">
        <ChartBox :option="pieOption" height="320px" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-block {
  min-width: 0;
}

.chart-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;
}

@media (max-width: 1000px) {
  .chart-row {
    grid-template-columns: 1fr;
  }
}
</style>
