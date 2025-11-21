import React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ZoomMinus, ZoomPlus, ZoomReset, ChangeTheme, ChangeStyle, DownLoad} from '../redux/actions';
import select from '../img/select.svg';
import plus from '../img/plus.svg';
import minus from '../img/minus.svg';
import sun from '../img/sun.svg';
import moon from '../img/moon.svg';
import reset from '../img/reset.svg';
import styles from './Components.module.css';

interface ThemeState {
  theme: string
};

const HeaderRightCol: React.FC = () => {
    const dispatch = useDispatch();
    const theme = useSelector((state: ThemeState) => state.theme);
    const themeClass = theme === 'dark' ? styles.dark : styles.light;
    const [style, SetStyle] = useState('line');

    const SetStyles = (style: string): void => {
        SetStyle(style);
        dispatch(ChangeStyle(style));
    };

  return (
    <div className="col-xxl-4 col-xl-4 col-lg-5 col-md-7 col-sm-12 d-flex justify-content-md-end">
        <button className={`${styles.button3} dropdown-toggle ${themeClass}`} type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">Line style: {style}</button>
        <ul className={`dropdown-menu ${styles.ul3}`} aria-labelledby="dropdownMenuButton2">
            <li className={`${style === 'line' ? styles.active : ''} ${themeClass}`} onClick={() => SetStyles('line')}>Line</li>
            <li className={`${style === 'smooth' ? styles.active : ''} ${themeClass}`} onClick={() => SetStyles('smooth')}>Smooth</li>
            <li className={`${style === 'area' ? styles.active : ''} ${themeClass}`} onClick={() => SetStyles('area')}>Area</li>
        </ul>
        <button className={`${styles.selectBtn} ${themeClass}`} onClick={() => dispatch(DownLoad())}><img src={select} alt="#" /></button>
        <div className={`${styles.zoom} ${themeClass}`}>
            <button onClick={() => dispatch(ZoomMinus())}><img src={minus} alt="#" /></button>
            <button onClick={() => dispatch(ZoomPlus())}><img src={plus} alt="#" /></button>
        </div>
        <div className={`${styles.theme} ${themeClass}`}>
            <button onClick={() => dispatch(ChangeTheme('light'))}><img src={sun} alt="#" /></button>
            <button onClick={() => dispatch(ChangeTheme('dark'))}><img src={moon} alt="#" /></button>
        </div>
        <button className={styles.reset} onClick={() => dispatch(ZoomReset())}><img src={reset} alt="#" /></button>
    </div>
  )
}

export default HeaderRightCol;