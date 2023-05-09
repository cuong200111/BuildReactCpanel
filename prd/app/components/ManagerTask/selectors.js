import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addTemplatePage state domain
 */

const selectManagerTaskDomain = state => state.get('managerTask', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddTemplatePage
 */

const makeSelectManagerTask = () => createSelector(selectAddTemplatePageDomain, substate => substate.toJS());

export default makeSelectManagerTask;
export { selectManagerTaskDomain };
