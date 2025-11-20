import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NewCharts, NewDate } from '../redux/actions';
import styles from './Components.module.css';
import data from '../data.json';

const HeaderLeftCol: React.FC = () => {
    const dispatch = useDispatch();
    const [DropdownText, SetDropdownText] = useState("All variations selected");
    const [CountDropdown, SetCountDropdown] = useState<number[]>([]);  
    const [date, SetDate] = useState('Month');

    const updateCountDropdown = (updater: (prev: number[]) => number[]): void => {
        SetCountDropdown(prev => {
            const newArray = updater(prev);
            dispatch(NewCharts(newArray));
            return newArray;
        });
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
        SetDropdownText(CountDropdown.length === 0 ? "All variations selected" : `${CountDropdown.length} variations selected`);
    }, [CountDropdown]);
  return (
    <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-4">
        <button className={`${styles.button} dropdown-toggle`} type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">{DropdownText}</button>
        <ul className={`dropdown-menu ${styles.ul}`} aria-labelledby="dropdownMenuButton1">
            <li onClick={() => SetDropdown("All variations selected")} className={CountDropdown.length === 0 ? styles.active : ''}>All variations</li>
            {data.variations.map(item => (
                <li key={item.id} onClick={() => SetDropdown(item.name, item.id)} className={CountDropdown.includes(item.id) ? styles.active : ''}>{item.name}</li>
            ))}
        </ul>
        <button className={`${styles.button2} dropdown-toggle`} type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">{date}</button>
        <ul className={`dropdown-menu ${styles.ul2}`} aria-labelledby="dropdownMenuButton2">
            <li className={date === 'Day' ? styles.active : ''} onClick={() => SetDates('Day')}>Day</li>
            <li className={date === 'Week' ? styles.active : ''} onClick={() => SetDates('Week')}>Week</li>
            <li className={date === 'Month' ? styles.active : ''} onClick={() => SetDates('Month')}>Month</li>
        </ul>
    </div>
  )
}

export default HeaderLeftCol;