import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NODownLoad } from "../redux/actions";
import { ThemeState } from '../redux/reducer';
import Chart from "chart.js/auto";
import ToolTip from "./ToolTip";
import zoomPlugin from 'chartjs-plugin-zoom';
import styles from './Components.module.css';
import rawJson from '../data.json';

interface DateState { date: string };
interface StyleState { style: string };
interface ChartsState { charts: number[] };
interface ZoomState { valueZoom: number };
interface DownloadState { download: boolean };

interface DayData {
  date: string;
  visits: { [key: string]: number };
  conversions: { [key: string]: number };
};

interface RootData {
  variations: { id: number; name: string }[];
  data: DayData[];
};

export interface DataSet {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
  fill: boolean;
  tension: number;
  id: number;
};

const Charts: React.FC = () => {
  const dispatch = useDispatch();
  const data = rawJson as RootData;

  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const isDownload = useSelector((s: DownloadState) => s.download);
  const currStyle = useSelector((s: StyleState) => s.style);
  const currTheme = useSelector((s: ThemeState) => s.theme);
  const currTypeDate = useSelector((s: DateState) => s.date);
  const currChartsSet = useSelector((s: ChartsState) => s.charts);
  const currZoom = useSelector((s: ZoomState) => s.valueZoom);

  const [isHovered, setIsHovered] = useState(false);
  const [tooltipData, setTooltipData] = useState<{ date: string; values: { label: string; value: number; color: string }[]; } | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

  const [datasets, setDatasets] = useState<DataSet[]>([]);

  const currColor = currTheme === "light" ? "#e0e0e0" : "#000027";
  const currColorText = currTheme === "light" ? "#000" : "#fff";

  const chartColors = [
    { border: "rgba(255, 99, 71, 1)", bg: "rgba(255, 99, 71, 0.2)" },
    { border: "rgba(0, 255, 255, 1)", bg: "rgba(0, 255, 255, 0.2)" },
    { border: "rgba(255, 255, 0, 1)", bg: "rgba(255, 255, 0, 0.2)" },
    { border: "rgba(0, 255, 127, 1)", bg: "rgba(0, 255, 127, 0.2)" },
    { border: "rgba(255, 0, 255, 1)", bg: "rgba(255, 0, 255, 0.2)" },
    { border: "rgba(255, 165, 0, 1)", bg: "rgba(255, 165, 0, 0.2)" },
    { border: "rgba(0, 191, 255, 1)", bg: "rgba(0, 191, 255, 0.2)" },
  ];

  const allLabels = data.data.map(d => d.date).sort();

  const allDataSets: DataSet[] = data.variations.map((v, idx) => {
    const color = chartColors[idx % chartColors.length];
    const values = data.data.map(day => {
      const visits = day.visits[String(v.id)] ?? day.visits[v.id] ?? 0;
      const conv = day.conversions[String(v.id)] ?? day.conversions[v.id] ?? 0;
      return visits === 0 ? 0 : Math.round((conv / visits) * 100);
    });
    return {
      label: v.name,
      data: values,
      borderColor: color.border,
      backgroundColor: color.bg,
      fill: false,
      tension: 0,
      id: v.id
    };
  });

  // Style
  const ChangeStyle = () => {
    const stylesMap: Record<string, { fill: boolean; tension: number }> = {
      line: { fill: false, tension: 0 },
      area: { fill: true, tension: 0.4 },
      smooth: { fill: false, tension: 0.4 }
    };

    const config = stylesMap[currStyle] ?? stylesMap.line;

    allDataSets.forEach(ds => {
      ds.fill = config.fill;
      ds.tension = config.tension;
    });
  };

  // Day/Week
  const getSliceRange = (type: string) => {
    if (type === "Day") {
      return { labels: allLabels };
    }

    const labels: string[] = [];
    for (let i = 0; i < allLabels.length; i += 7) {
      const start = allLabels[i];
      const end = allLabels[Math.min(i + 6, allLabels.length - 1)];
      labels.push(`${start} - ${end}`);
    }

    return { labels };
  };

  const calculateMaxY = (ds: { data: number[] }[]) =>
    Math.ceil(Math.max(...ds.flatMap(s => s.data)) * 1.15);

  // Download
  useEffect(() => {
    if (!isDownload) return;

    dispatch(NODownLoad());
    const chart = chartInstanceRef.current;
    if (!chart) return;

    const url = chart.toBase64Image();
    const a = document.createElement("a");
    a.href = url;
    a.download = "chart.png";
    a.click();
  }, [isDownload, dispatch]);

  // Zoom
  const initialXRange = useRef({ min: 0, max: 0 });
  useEffect(() => {
    const chart = chartInstanceRef.current;
    if (!chart) return;

    const x = chart.scales["x"] as any;

    if (initialXRange.current.min === 0 && initialXRange.current.max === 0) {
      initialXRange.current = { min: x.min, max: x.max };
    }

    const { min, max } = initialXRange.current;
    const center = (min + max) / 2;
    const span = max - min;
    const scale = 1 + currZoom / 10;

    x.options.min = center - span / 2 / scale;
    x.options.max = center + span / 2 / scale;

    chart.update("none");
  }, [currZoom]);

  // Chart
  useEffect(() => {
    ChangeStyle();
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    const slice = getSliceRange(currTypeDate);
    const labels = slice.labels;

    const visibleSets = currChartsSet.length > 0 ? allDataSets.filter(ds => currChartsSet.includes(ds.id)) : allDataSets;

    const finalSets = currTypeDate === "Week" ? visibleSets.map(ds => {
      const length = Math.ceil(ds.data.length / 7);
      const weekly = Array.from({ length }, (_, i) => {
        const chunk = ds.data.slice(i * 7, i * 7 + 7);
        return Math.round(chunk.reduce((a, b) => a + b, 0) / chunk.length);
      });
      return { ...ds, data: weekly };
    }) : visibleSets;

    setDatasets(finalSets);

    const chartData = { labels, datasets: finalSets };

    const options: any = {
      responsive: true,
      scales: {
        y: {
          min: 0,
          max: calculateMaxY(finalSets),
          ticks: {
            color: currColorText,
            callback: (v: number) => `${v}%`
          },
          grid: { display: false, borderColor: "#fff", color: currColor }
        },
        x: {
          ticks: { color: currColorText },
          grid: { display: false, borderColor: "#fff", color: currColor }
        }
      },
      plugins: {
        zoom: {
          zoom: { wheel: { enabled: false }, pinch: { enabled: false }, mode: "x" as const },
          pan: { enabled: false }
        },
        legend: { display: false },
        tooltip: {
          enabled: false,
          intersect: false,
          external: function (this: any, args: { chart: Chart; tooltip: any }) {
            const tooltip = args.tooltip;
            if (!tooltip || tooltip.opacity === 0) {
              setIsHovered(false);
              setTooltipData(null);
              setTooltipPosition(null);
              return;
            }

            const idx = tooltip.dataPoints?.[0]?.dataIndex;
            if (idx == null) return;

            setIsHovered(true);
            setTooltipPosition({ x: tooltip.x, y: tooltip.y });

            setTooltipData({
              date: labels[idx],
              values: finalSets.map(ds => ({
                label: ds.label,
                value: ds.data[idx],
                color: ds.borderColor
              }))
            });
          }
        }
      },
      elements: { point: { radius: 0 } }
    };

    if (chartInstanceRef.current) chartInstanceRef.current.destroy();
    chartInstanceRef.current = new Chart(ctx, { type: "line", data: chartData, options });

    return () => chartInstanceRef.current?.destroy();
  }, [currColor, currTypeDate, currChartsSet, currStyle, currColorText]);

  return (
    <div className="col-12">
      <div className={styles.chart}>
        <canvas ref={chartRef}></canvas>

        {isHovered && tooltipData && tooltipPosition && (
          <ToolTip
            variations={datasets}
            tooltipData={tooltipData}
            position={tooltipPosition}
          />
        )}
      </div>
    </div>
  );
};

export default Charts;
