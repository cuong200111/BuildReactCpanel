/**
 *
 * ConfigHrmTimekeepPage
 *
 */

import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import { Grid } from '@material-ui/core';
import { Paper, VerticalTab, VerticalTabs } from 'components/LifetekUi';
import { changeSnackbar } from 'containers/Dashboard/actions';
import moment from 'moment';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { makeSelectMiniActive, makeSelectProfile } from '../../../Dashboard/selectors';
import {
  addConfigTimekeeping,
  addHoliday,
  addShift,
  addSymbol,
  addTimekeepType,
  deleteConfigTimekeeping,
  deleteHoliday,
  deleteShift,
  deleteSymbol,
  deleteTimekeepType,
  getAllConfigTimekeeping,
  getAllHoliday,
  getAllShift,
  getAllSymbol,
  getAllTimekeepType,
  mergeData,
  updateConfigTimekeeping,
  updateHoliday,
  updateShift,
  updateSymbol,
  updateTimekeepType,
} from './actions';
import ConfigShiftPage from './components/ConfigShiftPage/Loadable';
import ConfigTimekeeping from './components/ConfigTimekeeping/Loadable';
import HolidaysPage from './components/HolidaysPage/Loadable';
import SymbolPage from './components/SymbolPage/Loadable';
import TimekeepingTypePage from './components/TimekeepingTypePage/Loadable';
import reducer from './reducer';
import saga from './saga';
import makeSelectConfigHrmTimekeep from './selectors';
/* eslint-disable react/prefer-stateless-function */

export class ConfigHrmTimekeepPage extends React.Component {
  state = {
    tab: 0,
    tabIndex: 0,
  };

  componentDidMount() {
    this.props.getAllHoliday();
    this.props.getAllTimekeepType();
    this.props.getAllSymbol();
    this.props.getAllShift();
  }

  handleHolidaySave = data => {
    if (data._id) {
      this.props.updateHoliday(data);
    } else {
      this.props.addHoliday(data);
    }
  };

  handleSymboldSave = data => {
    if (data._id) {
      this.props.updateSymbol(data);
    } else {
      this.props.addSymbol(data);
    }
  };

  handleTimekeepingTypeSave = data => {
    if (data._id) {
      this.props.updateTimekeepType(data);
    } else {
      this.props.addTimekeepType(data);
    }
  };

  handleConfigTimekeepingSave = data => {
    const newData ={
      ...data,
      lastSyncTime: data.lastSyncTime ? new Date(moment(data.lastSyncTime).format("DD/MM/YYYY HH:mm"))*1: null
    }
    console.log("thêm mới cập nhật máy chấm công", newData)

    if (data._id) {
      this.props.updateConfigTimekeeping(newData);
    } else {
      this.props.addConfigTimekeeping(newData);
    }
  };

  handleConfigShiftSave = data => {
    if (data._id) {
      this.props.updateShift(data);
    } else {
      this.props.addShift(data);
    }
  };

  render() {
    const { tab, tabIndex } = this.state;
    const { profile } = this.props;
    const { configHrmTimekeepPage, deleteSymbol, deleteTimekeepType, deleteHoliday, deleteConfigTimekeeping, deleteShift } = this.props;
    const {
      holidays,
      symbols,
      timekeepTypes,
      configTimekeeping,
      shifts,
      addShiftSuccess,
      updateShiftSuccess,
      deleteShiftSuccess,
      reload,
    } = configHrmTimekeepPage;
    return (
      <div>
        <Helmet>
          <title>Config HRM</title>
          <meta name="description" content="Description of ConfigHrmTimekeepPage" />
        </Helmet>
        <Paper>
          <Grid container>
            <Grid item xs={2}>
              <VerticalTabs style={{ display: 'inline-block' }} value={tab} onChange={(e, tab) => this.setState({ tab })}>
                <VerticalTab style={{ textAlign: 'left', textTransform: 'none' }} value={0} label="Cấu hình ký hiệu chấm công" />
                <VerticalTab style={{ textAlign: 'left', textTransform: 'none' }} value={1} label="Cấu hình loại chấm công" />
                <VerticalTab style={{ textAlign: 'left', textTransform: 'none' }} value={2} label="Cấu hình ngày nghỉ lễ" />
                <VerticalTab style={{ textAlign: 'left', textTransform: 'none' }} value={4} label="Cấu hình máy chấm công" />
                <VerticalTab style={{ textAlign: 'left', textTransform: 'none' }} value={5} label="Cấu hình ca làm việc" />
                <VerticalTab style={{ textAlign: 'left', textTransform: 'none' }} value={6} label="Cấu hình ngày làm việc" />
              </VerticalTabs>
            </Grid>
            <Grid item xs={10} xl={10} md={10}>
              {tab === 0 && (
                <SymbolPage
                  data={symbols}
                  holidays={holidays}
                  timekeepTypes={timekeepTypes}
                  onChangeSnackBar={this.props.onChangeSnackbar}
                  onSave={this.handleSymboldSave}
                  onDelete={deleteSymbol}
                />
              )}

              {tab === 1 && (
                <TimekeepingTypePage
                  data={timekeepTypes}
                  onChangeSnackBar={this.props.onChangeSnackbar}
                  onSave={this.handleTimekeepingTypeSave}
                  onDelete={deleteTimekeepType}
                />
              )}
             
              {tab === 2 && (
                <HolidaysPage
                  // data={holidays}
                  data={holidays.filter((el)=>(el.type !=="vacation" && el.type !=="often"))}
                  onSave={this.handleHolidaySave}
                  onChangeSnackBar={this.props.onChangeSnackbar}
                  onDelete={deleteHoliday}
                />
              )}
              {tab === 4 && (
                <ConfigTimekeeping
                  miniActive={this.props.miniActive}
                  profile={this.props.profile}
                  data={configTimekeeping}
                  reload={reload}
                  onChangeSnackBar={this.props.onChangeSnackbar}
                  onSave={this.handleConfigTimekeepingSave}
                  onDelete={deleteConfigTimekeeping}
                />
              )}
              {tab === 5 && (
                <ConfigShiftPage
                  shifts={shifts}
                  onSave={this.handleConfigShiftSave}
                  onDelete={deleteShift}
                  addShiftSuccess={addShiftSuccess}
                  updateShiftSuccess={updateShiftSuccess}
                  deleteShiftSuccess={deleteShiftSuccess}
                  symbols={symbols}
                />
              )}
               {tab === 6 && (
                <HolidaysPage
                  // data={holidays}
                  data={holidays.filter((el)=>(el.type === "vacation" ||  el.type === "often"))}

                  onSave={this.handleHolidaySave}
                  onChangeSnackBar={this.props.onChangeSnackbar}
                  onDelete={deleteHoliday}
                  isHolidaysInWeek
                />
              )}
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
}

ConfigHrmTimekeepPage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  configHrmTimekeepPage: makeSelectConfigHrmTimekeep(),
  miniActive: makeSelectMiniActive(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    mergeData: data => {
      dispatch(mergeData(data));
    },
    getAllHoliday: () => {
      dispatch(getAllHoliday());
    },
    getAllTimekeepType: () => {
      dispatch(getAllTimekeepType());
    },
    getAllConfigTimekeeping: () => {
      dispatch(getAllConfigTimekeeping());
    },
    getAllSymbol: () => {
      dispatch(getAllSymbol());
    },
    getAllShift: () => dispatch(getAllShift()),

    // add
    addHoliday: data => {
      dispatch(addHoliday(data));
    },
    addTimekeepType: data => {
      dispatch(addTimekeepType(data));
    },
    addConfigTimekeeping: data => {
      dispatch(addConfigTimekeeping(data));
    },
    addSymbol: data => {
      dispatch(addSymbol(data));
    },
    addShift: data => dispatch(addShift(data)),
    // update
    updateHoliday: (_id, data) => {
      dispatch(updateHoliday(_id, data));
    },
    updateTimekeepType: data => {
      dispatch(updateTimekeepType(data));
    },
    updateConfigTimekeeping: data => {
      dispatch(updateConfigTimekeeping(data));
    },
    updateSymbol: data => {
      dispatch(updateSymbol(data));
    },
    updateShift: data => {
      dispatch(updateShift(data));
    },
    // delete
    deleteHoliday: _id => {
      dispatch(deleteHoliday(_id));
    },
    deleteTimekeepType: data => {
      dispatch(deleteTimekeepType(data));
    },
    deleteConfigTimekeeping: data => {
      dispatch(deleteConfigTimekeeping(data));
    },
    deleteSymbol: data => {
      dispatch(deleteSymbol(data));
    },
    deleteShift: _id => dispatch(deleteShift(_id)),

    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'configHrmTimekeep', reducer });
const withSaga = injectSaga({ key: 'configHrmTimekeep', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ConfigHrmTimekeepPage);
