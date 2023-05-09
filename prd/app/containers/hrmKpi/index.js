/**
 *
 * ConfigHrmPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'redux';
import messages from './messages';
import { injectIntl } from 'react-intl';
import { Tabs, Tab, Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid } from '@material-ui/core';
// import { Add } from '@material-ui/icons';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import {
  addCategoryAction,
  fetchAllCategoryAction,
  getDefault,
  updateCategoryAction,
  fetchAllStatusAction,
  addStatusAction,
  addHRMStatusAction,
  deleteStatusAction,
  updateStatusIndexAction,
  updateStatusAction,
  mergeData,
  resetAllCategory,
  resetAllStatus,
  editHRMStatusAction,
  deleteHRMStatusAction,
  editHRMCategoryAction,
  deleteCategoryAction,
} from './actions';
import { changeSnackbar } from '../Dashboard/actions';
import makeSelectConfigHrmPage from './selectors';
import reducer from './reducer';
import saga from './saga';

import ListPage from '../../components/List';
import { API_HRM_KPI } from '../../config/urlConfig';

/* eslint-disable react/prefer-stateless-function */
export class hrmKpi extends React.Component {
  state = {
  };
  mapFunction = (item)=>{
    return {
      ...item,
      hrmEmployeeId: item['hrmEmployeeId.name'] || ''
    }
  }
  render() {
    const {  } = this.state;
    const {  } = this.props;
    const { intl } = this.props;
    return (
      <div>
        <Helmet>
          <title>hrmKpi</title>
          <meta name="description" content="Description of ConfigHrmPage" />
        </Helmet>   

                      <ListPage
                      height="620px"
                      code="hrmKpi"
                      apiUrl={API_HRM_KPI}
                      exportExcel
                      withPagination
                      // reload={reload}
                      // onEdit={this.handleEditClick}
                      // settingBar={[this.addClick()]}
                      disableAdd
                      disableMenuAction
                      // disableImport
                      // disableViewConfig
                      // filter={{
                      //   costType: this.state.valueOfTab,
                      // }}
                      mapFunction={this.mapFunction}
             

                    />  
      </div>
    );
  }
}

hrmKpi.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  hrmKpi: makeSelectConfigHrmPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,

    // Status

  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'hrmKpi', reducer });
const withSaga = injectSaga({ key: 'hrmKpi', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(hrmKpi);
