import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NewCharts, NewDate } from '../redux/actions';
import styles from './Components.module.css';
import data from '../data.json';
import { ThemeState } from '../redux/reducer';

const HeaderLeftCol: React.FC = () => {
    const dispatch = useDispatch();
    const theme = useSelector((state: ThemeState) => state.theme);
    const themeClass = theme === 'dark' ? styles.dark : styles.light;
    const [DropdownText, SetDropdownText] = useState("All variations selected");
    const [CountDropdown, SetCountDropdown] = useState<number[]>([]);  
    const [date, SetDate] = useState('Month');

    const updateCountDropdown = (updater: (prev: number[]) => number[]): void => {
        SetCountDropdown(prev => updater(prev));
    };

    const SetDropdown = (text: string, id?: number): void => {
        if (typeof id === "number") {
            updateCountDropdown(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
        } else {
            SetDropdownText(text); 
            updateCountDropdown(() => []);
        }
    };

    const SetDates = (dates: string): void => {
        SetDate(dates);
        dispatch(NewDate(dates));
    };

    useEffect(() => {
        dispatch(NewCharts(CountDropdown));
    }, [CountDropdown, dispatch]);
    
    useEffect(() => {
        if (CountDropdown.length === 3) {
            SetDropdown("All variations selected");  
            return
        }
        SetDropdownText(
            CountDropdown.length === 0 || CountDropdown.length === 3
            ? "All variations selected"
            : `${CountDropdown.length} variations selected`
        );
    }, [CountDropdown]);
  return (
    <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-5 col-sm-12">
        <button className={`${styles.button} dropdown-toggle ${themeClass}`} type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">{DropdownText}</button>
        <ul className={`dropdown-menu ${styles.ul} ${themeClass}`} aria-labelledby="dropdownMenuButton1">
            <li onClick={() => SetDropdown("All variations selected")} className={`${CountDropdown.length === 0 ? styles.active : ''} ${themeClass}`}>All variations</li>
            {data.variations.map(item => (
                <li key={item.id} onClick={() => SetDropdown(item.name, item.id)} className={`${CountDropdown.includes(item.id) ? styles.active : ''} ${themeClass}`}>{item.name}</li>
            ))}
        </ul>
        <button className={`${styles.button2} dropdown-toggle ${themeClass}`} type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">{date}</button>
        <ul className={`dropdown-menu ${styles.ul2} ${themeClass}`} aria-labelledby="dropdownMenuButton2">
            <li className={`${date === 'Day' ? styles.active : '' } ${themeClass}`} onClick={() => SetDates('Day')}>Day</li>
            <li className={`${date === 'Week' ? styles.active : '' } ${themeClass}`} onClick={() => SetDates('Week')}>Week</li>
            <li className={`${date === 'Month' ? styles.active : '' } ${themeClass}`} onClick={() => SetDates('Month')}>Month</li>
        </ul>
    </div>
  )
}

export default HeaderLeftCol;