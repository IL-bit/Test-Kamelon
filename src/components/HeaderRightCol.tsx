import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { NewStyle } from '../redux/actions';
import { ZoomMinus, ZoomPlus, ZoomReset, ChangeTheme } from '../redux/actions';
import select from '../img/select.svg';
import plus from '../img/plus.svg';
import minus from '../img/minus.svg';
import sun from '../img/sun.svg';
import moon from '../img/moon.svg';
import reset from '../img/reset.svg';
import styles from './Components.module.css';


const HeaderRightCol: React.FC = () => {
    const dispatch = useDispatch();
    const [style, SetStyle] = useState('line');

    const SetStyles = (style: string): void => {
        SetStyle(style);
        dispatch(NewStyle(style));
    };

  return (
    <div className="col-xxl-4 col-xl-4 col-lg-5 col-md-5 d-flex justify-content-end">
        <button className={`${styles.button3} dropdown-toggle`} type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">Line style: {style}</button>
        <ul className={`dropdown-menu ${styles.ul3}`} aria-labelledby="dropdownMenuButton2">
            <li className={style === 'line' ? styles.active : ''} onClick={() => SetStyles('line')}>Line</li>
            <li className={style === 'smooth' ? styles.active : ''} onClick={() => SetStyles('smooth')}>Smooth</li>
            <li className={style === 'area' ? styles.active : ''} onClick={() => SetStyles('area')}>Area</li>
        </ul>
        <button className={styles.selectBtn}><img src={select} alt="#" /></button>
        <div className={styles.zoom}>
            <button onClick={() => dispatch(ZoomMinus())}><img src={minus} alt="#" /></button>
            <button onClick={() => dispatch(ZoomPlus())}><img src={plus} alt="#" /></button>
        </div>
        <div className={styles.theme}>
            <button onClick={() => dispatch(ChangeTheme('light'))}><img src={sun} alt="#" /></button>
            <button onClick={() => dispatch(ChangeTheme('dark'))}><img src={moon} alt="#" /></button>
        </div>
        <button className={styles.reset} onClick={() => dispatch(ZoomReset())}><img src={reset} alt="#" /></button>
    </div>
  )
}

export default HeaderRightCol;