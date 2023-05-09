import { createSelector } from 'reselect';
import { initialState } from './reducer';
import { initialState as initialStateDashboard } from '../Dashboard/reducer';
import { initialState as initialStateAddContract } from './../ContractPage/reducer'
import { initialState as initialStateAddBill } from './../AddBillPage/reducer'
/**
 * Direct selector to the boDialog state domain
 */

const selectBoDialogDomain = state => state.get('boDialog', initialState);
const selectDashBoardPageDomain = state => state.get('dashboardPage', initialStateDashboard);
const selectAddContractPageDomain = state => state.get('addContractPage', initialStateAddContract);
const selectAddBillDomain = state => state.get('addBillPage', initialStateAddBill);
/**
 * Other specific selectors
 */

/**
 * Default selector used by BoDialog
 */

const makeSelectBoDialog = () => createSelector(selectBoDialogDomain, substate => substate.toJS());
const makeSelectDashboardPage = () => createSelector(selectDashBoardPageDomain, substate => substate.toJS());
const makeSelectAddContractPage = () => createSelector(selectAddContractPageDomain, substate => substate.toJS());
const makeSelectAddBill = () => createSelector(selectAddBillDomain, substate => substate.toJS());
export default makeSelectBoDialog;
export {
    selectBoDialogDomain,
    selectDashBoardPageDomain,
    makeSelectDashboardPage,
    makeSelectAddContractPage,
    makeSelectAddBill
};
