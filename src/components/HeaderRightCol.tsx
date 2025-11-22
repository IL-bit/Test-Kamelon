import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ZoomMinus, ZoomPlus, ZoomReset, ChangeTheme, ChangeStyle, DownLoad } from '../redux/actions';
import select from '../img/select.svg';
import plus from '../img/plus.svg';
import minus from '../img/minus.svg';
import sun from '../img/sun.svg';
import moon from '../img/moon.svg';
import reset from '../img/reset.svg';
import styles from './Components.module.css';
import { ThemeState } from '../redux/reducer';

const HeaderRightCol: React.FC = () => {
  const dispatch = useDispatch();

  const theme = useSelector((s: ThemeState) => s.theme);
  const themeClass = theme === 'dark' ? styles.dark : styles.light;

  const [style, SetStyle] = useState<'line' | 'smooth' | 'area'>('line');

  const styleOptions: Array<'line' | 'smooth' | 'area'> = ['line', 'smooth', 'area'];

  const SetStyles = (s: typeof style): void => {
    SetStyle(s);
    dispatch(ChangeStyle(s));
  };

  return (
    <div className="col-xxl-4 col-xl-4 col-lg-5 col-md-7 col-sm-12 d-flex justify-content-md-end">

      <button className={`${styles.button3} dropdown-toggle ${themeClass}`} data-bs-toggle="dropdown">Line style: {style}</button>

      <ul className={`dropdown-menu ${styles.ul3}`}>
        {styleOptions.map(opt => (
          <li key={opt} onClick={() => SetStyles(opt)} className={`${style === opt ? styles.active : ''} ${themeClass}`}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</li>
        ))}
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
  );
};

export default HeaderRightCol;
