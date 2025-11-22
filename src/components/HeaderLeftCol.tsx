import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NewCharts, NewDate } from '../redux/actions';
import styles from './Components.module.css';
import data from '../data.json';
import { ThemeState } from '../redux/reducer';

const HeaderLeftCol: React.FC = () => {
  const dispatch = useDispatch();

  const theme = useSelector((s: ThemeState) => s.theme);
  const themeClass = theme === 'dark' ? styles.dark : styles.light;

  const [CountDropdown, SetCountDropdown] = useState<number[]>([]);
  const [date, SetDate] = useState<'Day' | 'Week'>('Week');

  const DropdownText = CountDropdown.length === 0 || CountDropdown.length === data.variations.length ? "All variations selected" : `${CountDropdown.length} variations selected`;

  // Dropdown
  const SetDropdown = (text: string, id?: number): void => {
    if (typeof id === "number") {
      SetCountDropdown(prev =>
        prev.includes(id)
          ? prev.filter(item => item !== id)
          : [...prev, id]
      );
    } else {
      SetCountDropdown([]);
    }
  };

  // Date
  const SetDates = (d: 'Day' | 'Week'): void => {
    SetDate(d);
    dispatch(NewDate(d));
  };

  useEffect(() => {
    dispatch(NewCharts(CountDropdown));
  }, [CountDropdown, dispatch]);

  return (
    <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-5 col-sm-12">
      <button className={`${styles.button} dropdown-toggle ${themeClass}`} data-bs-toggle="dropdown">{DropdownText}</button>

      <ul className={`dropdown-menu ${styles.ul} ${themeClass}`}>
        <li onClick={() => SetDropdown("All variations selected")} className={`${CountDropdown.length === 0 ? styles.active : ""} ${themeClass}`}>All variationsa</li>
        {data.variations.map(item => (
          <li key={item.id} onClick={() => SetDropdown(item.name, item.id)} className={`${CountDropdown.includes(item.id) ? styles.active : ""} ${themeClass}`}>{item.name}</li>
        ))}
      </ul>

      <button className={`${styles.button2} dropdown-toggle ${themeClass}`} data-bs-toggle="dropdown">{date}</button>

      <ul className={`dropdown-menu ${styles.ul2} ${themeClass}`}>
        {["Day", "Week"].map((d) => (
          <li key={d} className={`${date === d ? styles.active : ''} ${themeClass}`} onClick={() => SetDates(d as "Day" | "Week")}>{d}</li>
        ))}
      </ul>

    </div>
  );
};

export default HeaderLeftCol;
