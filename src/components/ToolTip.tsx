import React from 'react';
import { DataSet } from './Chart';
import { useSelector } from 'react-redux';
import { ThemeState } from '../redux/reducer';
import styles from './Components.module.css';
import calendar from '../img/calendar.svg';

interface ToolTipProps {
  variations: DataSet[];
  tooltipData: { date: string; values: { label: string; value: number; color: string }[]; };
  position: { x: number; y: number };
};

const ToolTip: React.FC<ToolTipProps> = ({ variations, tooltipData, position }) => {

  const theme = useSelector((state: ThemeState) => state.theme);
  const themeClass = theme === 'dark' ? styles.dark : styles.light;

  const { date, values } = tooltipData;
  const sortedValues = [...values].sort((a, b) => b.value - a.value);

  return (
    <div className={`${styles.toolTip} ${themeClass}`} style={{ left: position.x + 10, top: position.y - 10 }}>

      <div className={styles.toolTipHeader}>
        <img src={calendar} alt="calendar" />
        <p>{date}</p>
      </div>

      <hr />

      <div className={`${styles.toolTipVariations} ${themeClass}`}>
        {sortedValues.map(({ label, value, color }, index) => (
          <div key={index} className={styles.toolTipVariationItem}>
            <div className={styles.colorBox} style={{ backgroundColor: color }}></div>
            <p>{label}</p>
            <p>{value}%</p>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default ToolTip;
