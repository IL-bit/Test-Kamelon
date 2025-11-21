import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import './App.css';
import HeaderLeftCol from './components/HeaderLeftCol';
import HeaderRightCol from './components/HeaderRightCol';
import Charts from './components/Chart';

interface ThemeState {
  theme: string
}

const App: React.FC = () => {
  const theme = useSelector((state: ThemeState) => state.theme);
  useEffect(() => {
    const body = document.body;
    body.classList.add(theme);
    return () => {
      if (theme) {
        body.classList.remove(theme);
      }
    };
  }, [theme]);
  return (
    <div className="container">
      <div className="row justify-content-between">
        <HeaderLeftCol />
        <HeaderRightCol />
      </div>
      <div className="row">
        <Charts />
      </div>
    </div>
  );
};

export default App;
