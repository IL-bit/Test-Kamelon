import { createReducer } from '@reduxjs/toolkit';
import { ChangeStyle, ChangeTheme, NewCharts, NewDate} from './actions'; 

export interface AppState {
  valueZoom: number;
  theme: string;
  style: string;
  charts: number[];
  date: string,
  download: boolean
}

const initialState: AppState = {
  valueZoom: 0,
  theme: 'light',
  style: 'line',
  charts: [],
  date: 'Month',
  download: false
};

const appReducer = createReducer(initialState, (builder) => {
  builder
    .addCase('ZOOMPLUS', (state) => {
      state.valueZoom += 5;
    })
    .addCase('ZOOMMINUS', (state) => {
      state.valueZoom -= 5;
    })
    .addCase('ZOOMRESET', (state) => {
      state.valueZoom = 0;
    })
    .addCase(ChangeStyle, (state, action) => {  
      state.style = action.payload;
    })
    .addCase(ChangeTheme, (state, action) => {  
      state.theme = action.payload;
    })
    .addCase(NewCharts, (state, action) => {  
      state.charts = action.payload;
    })
    .addCase(NewDate, (state, action) => {  
      state.date= action.payload;
    })    
    .addCase('DOWNLOAD', (state) => {
      state.download = true;
    })
    .addCase('NODOWNLOAD', (state) => {
      state.download = false;
    });
});

export default appReducer;