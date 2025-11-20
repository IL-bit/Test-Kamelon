import React from 'react';
import './App.css';
import HeaderLeftCol from './components/HeaderLeftCol';
import HeaderRightCol from './components/HeaderRightCol';

const App: React.FC = () => {
  return (
    <div className="container">
      <div className="row justify-content-between">
        <HeaderLeftCol />
        <HeaderRightCol />
      </div>
      <div className="row"></div>
    </div>
  );
};

export default App;
