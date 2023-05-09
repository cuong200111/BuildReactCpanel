import { IconButton, InputAdornment } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { Grid } from 'components/LifetekUi';
import React, { useCallback, useEffect, useState } from 'react';

import CustomAppBar from 'components/CustomAppBar';
import Department from 'components/Filter/DepartmentAndEmployee';
import CustomInputBase from 'components/Input/CustomInputBase';
import { SwipeableDrawer } from 'components/LifetekUi';
import { DateTimePicker } from 'material-ui-pickers';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EditEmployees from '../EditEmployees/Loadable';
import './index.css';

import moment from 'moment';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { mergeData as MergeData } from '../../../../../../../Dashboard/actions';
function AddTimekeeping(props) {
  const { update, timekeeping, onUpdate, onClose, onChangeSnackbar, profile } = props;
  const [configState, setConfigState] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [configMessages, setConfigMessages] = useState({});
  const [selectEditEmployees, setSelectEditEmployees] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // const lastSyncTime = configState.lastSyncTime;
  // const formattedDate = lastSyncTime ? new Date(parseInt(lastSyncTime)).toISOString().substr(0, 16) : lastSyncTime;

  useEffect(
    () => {
      if (timekeeping) {
        setConfigState({ ...timekeeping });
      } else {
        setConfigState({});
      }
    },
    [timekeeping],
  );

  // useEffect(
  //   () => {
  //     const messages = viewConfigCheckForm(code, configState);
  //     setConfigMessages(messages);
  //     return () => {
  //       messages;
  //     };
  //   },
  //   [configState],
  // );

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [localData, setLocalData] = useState({
    // hrmEmployeeId: {},
    date: '',
    approved: [],
    type: '',
    reason: '',
    toDate: moment(),
    fromDate: moment(),
  });

  const handleOpenEditConfigDialog = row => {
    setSelectEditEmployees(row);
    setOpenDialog(true);
  };

  useEffect(() => {
    return () => {
      setTimeout(() => {
        props.onMergeData({ hiddenHeader: false });
      }, 1);
    };
  }, []);

  const handleCloseEditConfigDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const handleInputChange = e => {
    setConfigState({
      ...configState,
      [e.target.name]: e.target.value,
    });
  };

  const handleLastSyncTimeChange = date => {
    setConfigState({
      ...configState,
      lastSyncTime: date,
    });
  };

  const handeChangeDepartment = useCallback(
    result => {
      const { department } = result;
      setConfigState({ ...configState, organizationUnit: department });
    },
    [configState],
  );

  const handleTimekeepingUpdate = e => {
    if (Object.keys(configMessages).length) {
      onChangeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' });
    } else {
      onUpdate(configState);
    }
  };

  return (
    <React.Fragment>
      <Grid container spacing={24} style={{ marginTop: 70, padding: 10 }}>
        <CustomAppBar className isTask title="CẤU HÌNH MÁY CHẤM CÔNG" onGoBack={() => props.onClose()} onSubmit={handleTimekeepingUpdate} />

        <Grid item xl={6} xs={6}>
          <CustomInputBase name="code" label="Mã máy chấm công" onChange={handleInputChange} value={configState.code} />
        </Grid>
        <Grid item xl={6} xs={6}>
          <CustomInputBase name="name" label="Tên máy chấm công" onChange={handleInputChange} value={configState.name} />
        </Grid>
        <Grid item xl={6} xs={6}>
          <CustomInputBase name="port" label="Port" onChange={handleInputChange} value={configState.port} />
        </Grid>
        <Grid item xl={6} xs={6}>
          <CustomInputBase name="ip" label="Địa chỉ ip" onChange={handleInputChange} value={configState.ip} />
        </Grid>

        <Grid item xl={6} xs={6} style={{ padding: '16px 12px' }}>
          <Department
            onChange={handeChangeDepartment}
            department={configState.organizationUnit}
            disableEmployee
            moduleCode="hrm"
            fullWidth
            profile={profile}
          />
        </Grid>
        <Grid item xl={6} xs={6} style={{ marginTop: '-5px' }}>
          <CustomInputBase
            label="Mật khẩu"
            value={configState.password}
            name="password"
            onChange={handleInputChange}
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handlePasswordVisibility}>
                    {showPassword ? <Visibility style={{ color: '#000' }} /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
            required
          />
        </Grid>
        <Grid item md={3} style={{ padding: '10px 2px' }}>
          {/* <MuiPickersUtilsProvider > */}
         {
          console.log(configState, 'configState')
         }
          <div style={{ display: 'flex' }}>
            <DateTimePicker
              inputVariant="outlined"
              format="DD/MM/YYYY HH:mm"
              // error={!addWorkingSchedule.timeEnd}
              // helperText={addWorkingSchedule.timeEnd ? null : 'Không được bỏ trống'}
              label={'Đồng bộ thông tin từ thời điểm: '}
              value={configState.lastSyncTime}
              // value={formattedDate}
              name="timeEnd"
              margin="dense"
              variant="outlined"
              // onChange={handleInputChange}
              onChange={handleLastSyncTimeChange}
              fullWidth
              // keyboard
              style={{ paddingLeft: 10 }}
            />
          </div>
          {/* </MuiPickersUtilsProvider> */}
        </Grid>
        <SwipeableDrawer anchor="right" onClose={handleCloseEditConfigDialog} open={openDialog} width={window.innerWidth - 260}>
          <Grid>
            <EditEmployees employees={selectEditEmployees} onClose={handleCloseEditConfigDialog} propsAll={props} />
          </Grid>
        </SwipeableDrawer>
      </Grid>
    </React.Fragment>
  );
}

AddTimekeeping.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};
const mapStateToProps = createStructuredSelector({});

function mapDispatchToProps(dispatch) {
  return {
    onMergeData: data => dispatch(MergeData(data)),
  };
}
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(AddTimekeeping);
