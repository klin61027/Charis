<template>
  <div class="stat-card">
    <div class="stat-val">{{ value }}</div>
    <div class="stat-lbl">{{ label }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  value: string | number
  label: string
}>()
</script>

<style scoped>
.stat-card {
  flex: 1;
  background: #ffffff;
  border: 0.5px solid #e2e0d8;
  padding: 14px 12px;
  text-align: center;
}
.stat-val {
  font-size: 18px;
  font-weight: 500;
  color: #1a1a1a;
}
.stat-lbl {
  font-size: 11px;
  color: #a0a0a8;
  margin-top: 2px;
}
</style>
