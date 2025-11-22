import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NODownLoad } from "../redux/actions";
import { ThemeState } from '../redux/reducer';
import Chart from "chart.js/auto";
import ToolTip from "./ToolTip";
import zoomPlugin from 'chartjs-plugin-zoom';
import styles from './Components.module.css';
import rawJson from '../data.json';

interface DateState {
  date: string
};
interface StyleState {
  style: string
};
interface ChartsState {
  charts: number[]
};
interface ZoomState {
  valueZoom: number
};
interface DownloadState {
  download: boolean
}

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
  label: string,
  data: number[],
  borderColor: string,
  backgroundColor: string,
  fill: boolean,
  tension: number,
  id: number
};


const Charts: React.FC = () => {
  const dispatch = useDispatch();
  const data = rawJson as RootData;
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const isDownload = useSelector((state: DownloadState) => state.download);
  const currStyle = useSelector((state: StyleState) => state.style);
  const currTheme = useSelector((state: ThemeState) => state.theme);
  const currColor = currTheme === 'light' ? "#e0e0e0" : "#000027";
  const currColorText = currTheme === 'light' ? "#000" : "#fff";
  const chartColors = [
    { border: "rgba(255, 99, 71, 1)", bg: "rgba(255, 99, 71, 0.2)" },
    { border: "rgba(0, 255, 255, 1)", bg: "rgba(0, 255, 255, 0.2)" },
    { border: "rgba(255, 255, 0, 1)", bg: "rgba(255, 255, 0, 0.2)" },
    { border: "rgba(0, 255, 127, 1)", bg: "rgba(0, 255, 127, 0.2)" },
    { border: "rgba(255, 0, 255, 1)", bg: "rgba(255, 0, 255, 0.2)" },
    { border: "rgba(255, 165, 0, 1)", bg: "rgba(255, 165, 0, 0.2)" },
    { border: "rgba(0, 191, 255, 1)", bg: "rgba(0, 191, 255, 0.2)" },
  ];

  const currTypeDate = useSelector((state: DateState) => state.date);
  const currChartsSet = useSelector((state: ChartsState) => state.charts);
  const currZoom = useSelector((state: ZoomState) => state.valueZoom);

  const [isHovered, setIsHovered] = useState(false);
  const [tooltipData, setTooltipData] = useState<{ date: string; values: { label: string; value: number; color: string }[] } | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [datasets, setDatasets] = useState<DataSet[]>([]);

  const allLabels: string[] = data.data.map(item => item.date).sort();
  const allDataSets: DataSet[] = data.variations.map((variation, index) => {
    const id = String(variation.id);
    const color = chartColors[index % chartColors.length]; 
    const datasetValues = data.data.map(day => {
      const visits = day.visits[id] ?? 0;
      const conversions = day.conversions[id] ?? 0;
      if (visits === 0) return 0;
      return Math.round((conversions / visits) * 100);
    });

    return {
      label: variation.name,
      data: datasetValues,
      borderColor: color.border,
      backgroundColor: color.bg,
      fill: false,
      tension: 0,
      id: variation.id
    };
  });

  const ChangeStyle = () => {
    if (currStyle === 'area') {
      allDataSets.forEach(ds => {
        ds.fill = true;
        ds.tension = 0.4;
      });
    };
    if (currStyle === 'line') {
      allDataSets.forEach(ds => {
        ds.fill = false;
        ds.tension = 0;
      });
    };
    if (currStyle === 'smooth') {
      allDataSets.forEach(ds => {
        ds.fill = false;
        ds.tension = 0.4;
      });
    }
  };



  const getSliceRange = (type: string, allLabels: string[]) => {
    const lastDate = allLabels[allLabels.length - 1];
    const lastMonth = lastDate.slice(0, 7);          
    if (type === "Day") {
      return allLabels.length - 2;
    };
    if (type === "Week") {
      return allLabels.length - 7;
    };
    if (type === "Month") {
      let index = allLabels.length - 1;
      while (index >= 0 && allLabels[index].startsWith(lastMonth)) {
        index--;
      }
      return index + 1;
    };
    return 0;
  };
  const calculateMaxY = (datasets: { data: number[] }[], paddingPercent = 15): number => {
    const maxValue = Math.max(...datasets.flatMap(d => d.data));
    return Math.ceil(maxValue * (1 + paddingPercent / 100));
  };
  const downloadChart = () => {
    if (isDownload) {
      dispatch(NODownLoad());
      const chart = chartInstanceRef.current;
      if (!chart) return;
      const url = chart.toBase64Image();
      const a = document.createElement('a');
      a.href = url;
      a.download = 'chart.png';
      a.click();
    };     
  };

  useEffect(() => {
    downloadChart();
  }, [isDownload]);

  const initialXRangeRef = useRef<{ min: number; max: number }>({ min: 0, max: 0 });
  useEffect(() => {
    const chart = chartInstanceRef.current;
    if (!chart) return;

    const xScale = chart.scales['x'];
    if (initialXRangeRef.current.min === 0 && initialXRangeRef.current.max === 0) {
      initialXRangeRef.current = { min: xScale.min, max: xScale.max };
    };
    const { min, max } = initialXRangeRef.current;
    const center = (min + max) / 2;
    const range = max - min;
    const scale = 1 + currZoom / 10;
    const newMin = center - (range / 2) / scale;
    const newMax = center + (range / 2) / scale;

    xScale.options.min = newMin;
    xScale.options.max = newMax;

    chart.update('none');
  }, [currZoom]);
  useEffect(() => {
    ChangeStyle();
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    const startIndex = getSliceRange(currTypeDate, allLabels);
    const labels = allLabels.slice(startIndex);

    const filteredDatasets: DataSet[] = currChartsSet.length > 0 ? allDataSets.filter(ds => currChartsSet.includes(ds.id)) : allDataSets;
    setDatasets(filteredDatasets); 
    const data = { labels, datasets: filteredDatasets };

    const options = {
      responsive: true,
      scales: {
        y: {
          min: 0,
          max: calculateMaxY(datasets),
          ticks: {
            color: currColorText, 
            callback: function (
              this: any,
              tickValue: string | number,
              index: number,
              ticks: any[]
            ): string | number | string[] | number[] | null | undefined {
              return `${tickValue}%`;
            }
          },

          grid: {
            display: false,
            drawBorder: true,
            borderColor: '#fff',
            color: currColor,
            tickColor: currColor
          },
        },
        x: {
          grid: {
            display: false,
            drawBorder: true,
            color: currColor,
            borderColor: '#fff',
            tickColor: currColor
          },
          ticks: {
            color: currColorText, 
          }
        },
      },
      plugins: {
        zoom: {
          zoom: {
            wheel: { enabled: false },
            pinch: { enabled: false },
            mode: 'x' as const,
          },
          pan: {
            enabled: false,
          }
        },
        legend: { display: false },
        tooltip: {
          enabled: false,
          intersect: false, 
          external: (context: any) => {
            console.log('Tooltip external called:', context.tooltip);
            if (context.tooltip.opacity === 0) {
              setIsHovered(false);
              setTooltipData(null);
              setTooltipPosition(null);
              return;
            }
            setIsHovered(true);
            const dataIndex = context.tooltip.dataPoints[0]?.dataIndex;
            if (dataIndex === undefined) return; 
            const date = labels[dataIndex];
            const values = filteredDatasets.map(ds => ({
              label: ds.label,
              value: ds.data[dataIndex],
              color: ds.borderColor
            }));
            setTooltipData({ date, values });
            setTooltipPosition({ x: context.tooltip.x, y: context.tooltip.y });
          }
        },
      },
      elements: {
        point: {
          radius: 0, 
        },
      },
    };

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }
    chartInstanceRef.current = new Chart(ctx, { type: "line", data, options });

    return () => { chartInstanceRef.current?.destroy() };
    
  }, [currColor, currTypeDate, currChartsSet, currStyle]);


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
}

export default Charts;
  