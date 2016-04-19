
import { handleActions } from 'redux-actions';

const initialState = {
  levels: '',
  logs: []
};

export const actionHandlers = {

  'update devLogsLevels' (state, action) {
    return {
      ...state,
      levels: `${action.payload}`
    };
  },

  'update devLogs' (state, action) {
    return {
      ...state,
      logs: action.payload
    };
  },

};

export default handleActions(actionHandlers, initialState);
