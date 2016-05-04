
import { handleActions } from 'redux-actions';

const initialState = {
  levels: '',
  logging: true,
  logs: []
};

const maxLogs = 1024;

export const actionHandlers = {

  'update devLogsLevels' (state, action) {
    return {
      ...state,
      levels: `${action.payload}`
    };
  },

  'remove devLogs' (state, action) {
    return {
      ...state,
      logs: []
    };
  },

  'update devLogging' (state, action) {
    return {
      ...state,
      logging: action.payload
    };
  },

  'update devLogs' (state, action) {
    if (!state.logging) {
      return { ...state };
    }

    return {
      ...state,
      logs: action.payload.concat(state.logs).slice(0, maxLogs)
    };
  }

};

export default handleActions(actionHandlers, initialState);
