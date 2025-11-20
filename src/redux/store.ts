import { createStore } from 'redux';
import counterReducer from './reducer';

const store = createStore(counterReducer);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;