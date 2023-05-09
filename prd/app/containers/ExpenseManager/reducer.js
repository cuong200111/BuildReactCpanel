/*
 *
 * ExpenseManager reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, MERGE_DATA } from './constants';

export const initialState = fromJS({
  openDrawer: false,
  openDialog: false,
  openItem: false,
  openBudget: false,
  openExpense: false,
});

function expenseManagerReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    default:
      return state;
  }
}

export default expenseManagerReducer;
