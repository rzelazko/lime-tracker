export function getApexPieTooltip({ series, seriesIndex, w }: any): string {
  const value = series[seriesIndex];
  const total = series.reduce((a: number, b: number) => a + b, 0);
  const percent = total ? ((value / total) * 100).toFixed(1) : '0.0';
  const label = w.globals.labels[seriesIndex];
  return `<div class="apexcharts-tooltip-title">${label}: ${percent}% (${value})</div>`;
}
