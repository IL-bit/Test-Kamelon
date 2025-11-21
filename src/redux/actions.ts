import { createAction } from '@reduxjs/toolkit';

export const ChangeStyle = createAction<string>('CHANGESTYLE');
export const ChangeTheme = createAction<string>('CHANGETHEME');

export const ZoomPlus = createAction('ZOOMPLUS');
export const ZoomMinus = createAction('ZOOMMINUS');
export const ZoomReset = createAction('ZOOMRESET');

export const NewCharts = createAction<number[]>('NewCharts');
export const NewDate = createAction<string>('NewDate');

export const DownLoad = createAction('DOWNLOAD');
export const NODownLoad = createAction('NODOWNLOAD');
// export const  = createAction<string>('');