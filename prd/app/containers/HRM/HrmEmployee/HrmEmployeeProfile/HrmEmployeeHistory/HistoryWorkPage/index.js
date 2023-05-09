/**
 *
 * RelationPage
 *
 */

import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Edit, Add } from '@material-ui/icons';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import ListPage from 'components/List';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { Paper, Typography, SwipeableDrawer } from '../../../../../../components/LifetekUi';
import makeSelectRelationPage from './selectors';
import { API_HISTORY_CHANGE_INFO, API_HRM_RELATION } from '../../../../../../config/urlConfig';
import reducer from './reducer';
import saga from './saga';
import AddRelation from './components/AddRelation';
import { createRelation, updateRelation, deleteRelation } from './actions';
import { Grid } from '@material-ui/core';
import CustomAppBar from 'components/CustomAppBar';
import { makeSelectProfile, makeSelectMiniActive } from '../../../../../Dashboard/selectors';
import moment from 'moment';

/* eslint-disable react/prefer-stateless-function */
function HistoryWorkPage(props) {
  const { relationPage, onCreateRelation, onUpdateRelation, onDeleteRelation, id: hrmEmployeeId, miniActive } = props;
  const { createRelationSuccess, updateRelationSuccess, deleteRelationSuccess, reload } = relationPage;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRelation, setSelectedRelation] = useState(null);
  const filter = {
    hrmEmployeeId: hrmEmployeeId,
  };
  useEffect(
    () => {
      if (createRelationSuccess === true) {
        handleCloseRelationDialog();
      }
      if (!createRelationSuccess) {
      }
    },
    [createRelationSuccess],
  );
  useEffect(
    () => {
      if (updateRelationSuccess === true) {
        handleCloseRelationDialog();
      }
      if (!updateRelationSuccess) {
      }
    },
    [updateRelationSuccess],
  );

  const handleSave = useCallback(data => {
    const { _id: relationId, ...restData } = data;
    if (!relationId) {
      onCreateRelation(data);
    } else {
      onUpdateRelation(relationId, data);
    }
  }, []);

  const handleOpenRelationDialog = () => {
    setSelectedRelation(null);
    setOpenDialog(true);
  };

  const handleCloseRelationDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const addItem = () => <Add onClick={handleOpenRelationDialog}>Open Menu</Add>;

  const handleDelete = ids => onDeleteRelation(hrmEmployeeId, ids);

  const mapFunction = item => {
    return {
      ...item,
      hrmEmployeeId: item['hrmEmployeeId.name'],
      fromDate: item.fromDate &&  moment(item.fromDate).format("DD/MM/YYYY") || '',
      toDate: item.toDate &&  moment(item.toDate).format("DD/MM/YYYY") || '',
    };
  };

  return (
    <Grid style={{ width: !miniActive ? 'calc(100vw - 260px)' : 'calc(100vw - 80px)' }}>
      <CustomAppBar
        title="Lịch sử ca làm việc"
        onGoBack={() => props.onClose && props.onClose()}
        disableAdd
        // onSubmit={this.onSubmit}
      />
      <Grid style={{ marginTop: 80 }}>
        <Paper>
          <ListPage
            code="HistoryChangeInfo"
            parentCode="hrm"
            onEdit={row => {
              setSelectedRelation(row);
              setOpenDialog(true);
            }}
            onDelete={handleDelete}
            reload={reload}
            apiUrl={API_HISTORY_CHANGE_INFO}
            settingBar={[addItem()]}
            filter={filter}
            mapFunction={mapFunction}
            disableAdd
            // exportExcel
            typeTab={[{ hrmEmployeeId: hrmEmployeeId }]}
            importExport="HistoryChangeInfo"
            // client
          />
        </Paper>
        {/* <SwipeableDrawer anchor="right" onClose={handleCloseRelationDialog} open={openDialog} width={window.innerWidth - 260}>
          <div
          // style={{ width: window.innerWidth - 260 }}
          >
            <AddRelation
              code="InfoRelationship"
              hrmEmployeeId={hrmEmployeeId}
              relation={selectedRelation}
              onSave={handleSave}
              miniActive={miniActive}
              onClose={handleCloseRelationDialog}
            />
          </div>
        </SwipeableDrawer> */}
      </Grid>
    </Grid>
  );
}

HistoryWorkPage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  relationPage: makeSelectRelationPage(),
  miniActive: makeSelectMiniActive(),
});

function mapDispatchToProps(dispatch) {
  return {
    // onCreateRelation: data => dispatch(createRelation(data)),
    // onUpdateRelation: (hrmEmployeeId, data) => dispatch(updateRelation(hrmEmployeeId, data)),
    // onDeleteRelation: (hrmEmployeeId, ids) => dispatch(deleteRelation(hrmEmployeeId, ids)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'historyWorkPage', reducer });
const withSaga = injectSaga({ key: 'historyWorkPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(HistoryWorkPage);
