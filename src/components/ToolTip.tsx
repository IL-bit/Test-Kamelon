import React from 'react';
import { DataSet } from './Chart';
import { useSelector } from 'react-redux';
import { ThemeState } from '../redux/reducer';
import styles from './Components.module.css';
import calendar from '../img/calendar.svg';


interface ToolTipProps {
  variations: DataSet[];
  tooltipData: { date: string; values: { label: string; value: number; color: string }[] };
  position: { x: number; y: number };
};

const ToolTip: React.FC<ToolTipProps> = ({ variations, tooltipData, position }) => {
  const theme = useSelector((state: ThemeState) => state.theme);
  const themeClass = theme === 'dark' ? styles.dark : styles.light;
  
  const sortedValues = [...tooltipData.values].sort((a, b) => b.value - a.value);

  return (
    <div className={`${styles.toolTip} ${themeClass}`} style={{left: position.x + 10, top: position.y - 10}}>
      <div><img src={calendar} alt="#" /><p>{tooltipData.date}</p></div>
      <hr />
      <div className={`${styles.toolTipVariations} ${themeClass}`}>
        {sortedValues.map((v, index) => (
          <div key={index}>
            <div style={{ backgroundColor: v.color }}></div>
            <p>{v.label}</p>
            <p>{v.value}%</p>
          </div>
        ))}
      </div> 
    </div>
  );
};

export default ToolTip;
