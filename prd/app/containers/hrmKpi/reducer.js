/*
 *
 * ConfigHrmPage reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, MERGE_DATA } from './constants';

export const initialState = fromJS({ data: '', sources: [], listSt: [], tab: 0 });

function hrmKpiPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    
    default:
      return state;
  }
}

export default hrmKpiPageReducer;
