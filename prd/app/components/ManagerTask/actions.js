/*
 *
 * AddTemplatePage actions
 *
 */

import {
  DEFAULT_ACTION,
  MERGE,
  GET_ALL_TEMPLATE,
  GET_ALL_TEMPLATE_SUCCESS,
  GET_ALL_TEMPLATE_FAILURE,
  GET_ALL_MODULE_CODE,
  GET_ALL_MODULE_CODE_SUCCESS,
  GET_ALL_MODULE_CODE_FAILURE,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export const handleChangeTitle = value => ({
  type: 'CHANGE',
  value,
});
