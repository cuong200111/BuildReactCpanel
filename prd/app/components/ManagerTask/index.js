
import React, { useState, useEffect , useCallback , useMemo, memo} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Grid, Paper, TableCell, TableHead, Table, TableBody, TableRow } from '@material-ui/core';
import { DatePicker } from 'material-ui-pickers';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import { AsyncAutocomplete, Grid as GridLT } from '../LifetekUi';
import { makeSelectProfile } from '../../containers/Dashboard/selectors';
import './style.scss'
import { API_TASK_EMPLOYEE_VIEW_TASK, API_TASK_PROJECT } from '../../config/urlConfig';
import moment from 'moment'
import DepartmentAndEmployee from '../Filter/DepartmentAndEmployee';
import { data } from '../../containers/OrganizationalStructurePage/overview-data';
import { fetchData, serialize } from '../../helper';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import AssignmentIcon from '@material-ui/icons/Assignment';

// import { changeTab } from './actions'

function ManagerTask(props) {
  const { allocationPage, profile } = props;
  const [dataFilter, setDataFilter] = useState({
    startDate: moment().startOf("week"),
    endDate: moment().endOf("week"),
  })
  const [data, setData] = useState([])
  const [taskId, setTaskId] = useState()

  const [arrayDay, setArrayDay] = useState([])
  
  const [open, setOpen] = React.useState(false);
  const [dataDetail, setDataDetail] = React.useState([]);


  const handleClickOpen = (dataSelect) => {
    if (dataSelect && Array.isArray(dataSelect) && dataSelect.length) {
      setDataDetail(dataSelect)
      setOpen(true);
    }else {
      setOpen(false);
      setDataDetail([])
    }

  };

  const handleClose = () => {
    setOpen(false);
    setDataDetail([])
  };



  useEffect(() => {
    const { startDate, endDate, orgId, employee , taskId} = dataFilter
    let url = `${API_TASK_EMPLOYEE_VIEW_TASK}?startDate=${moment(startDate).toISOString()}&endDate=${moment(endDate).toISOString()}`
    orgId ? url = `${url}&orgId=${orgId}` : url
    taskId ? url = `${url}&taskId=${taskId}` : url
    employee && employee._id ? url = `${url}&employee=${employee._id}` : url
    fetchData(url)
      .then((res) => {

        setData(res.data || [])
        const length = dataFilter.endDate.diff(dataFilter.startDate, "days") + 1
        setArrayDay(Array.from(Array(length).keys()))
      }).catch(() => {
        setData([])
      })
      return () => {
        
    } 
  }, [dataFilter])


  const handleChangeDepartmentAndEmployee = (result) => {
    const { department, employee } = result;
    console.log(department, employee, 'department, employee')
    if (department) {
      const newFilter = { ...dataFilter, orgId: department };
      delete newFilter.employeeId;
      setDataFilter(newFilter)
    }
    if (employee && employee._id) {
      setDataFilter({ ...dataFilter, employee: employee });
    }
  }
  const handleRenderTask = useCallback ((item = {}, currentDate, morning) => {
    // const { tasks = [] } = item
    // const newCurrentDate = currentDate && new Date(moment(currentDate, "DD/MM/YYY").format("DD/MM/YYYY 00:00")) * 1 || 0
    // const currentTaskMorning = tasks.filter((el) => {
    //   const startDate = el.startDate && new Date(moment(el.startDate).format("DD/MM/YYYY 00:00")) * 1 || 0
    //   const endDate = el.endDate && new Date(moment(el.endDate).format("DD/MM/YYYY 12:00")) * 1 || 0
    //   if (startDate && startDate <= newCurrentDate && newCurrentDate <= endDate) return true
    // })
    // const currentTaskAf = tasks.filter((el) => {
    //   const startDate = el.startDate && new Date(moment(el.startDate).format("DD/MM/YYYY 12:00")) * 1 || 0
    //   const endDate = el.endDate && new Date(moment(el.endDate).format("DD/MM/YYYY 23:59")) * 1 || 0
    //   if (startDate && startDate <= newCurrentDate && newCurrentDate <= endDate) return true
    // })
    // const lengthMorning = currentTaskMorning.length || 0
    // const lengthAf = currentTaskAf.length || 0

    const handleStyle = (lengthTask) => {
      if (!lengthTask) return { padding: 0, width: '50%' ,borderRight: "0.5px solid grey"}
      else if (lengthTask === 1) {
        return {
          backgroundColor: "yellow",
          padding: 0, width: '50%',
          borderRight: "0.5px solid grey"
        }
      } else {
        return {
          backgroundColor: "red",
          padding: 0, width: '50%',
          borderRight: "0.5px solid grey"
        }
      }

    }
    // let allTasks = [...currentTaskAf, ...currentTaskMorning]
    // function removeDuplicates(arr) { return arr.filter((item, index) => arr.findIndex(it => item._id === it._id) === index) }
    // allTasks = removeDuplicates(allTasks) || []
    const { tasks = [] } = item
    const newCurrentDate = currentDate && new Date(moment(currentDate, "DD/MM/YYY").format("MM/DD/YYYY 00:00")) * 1 || 0
    const currentTask = tasks.filter((el) => {
      const startDate = el.startDate && new Date(moment(el.startDate).format("MM/DD/YYYY 00:00")) * 1 || 0
      const endDate = el.endDate && new Date(moment(el.endDate).format("MM/DD/YYYY 23:59")) * 1 || 0
      if (startDate && newCurrentDate && startDate <= newCurrentDate && newCurrentDate <= endDate) return true
    })
    const length = currentTask.length || 0
    return <>
    {/* style={{ borderRight: "0.5px solid grey", padding: 0 }} */}
      <TableCell  style={handleStyle(length)} key={item._id}  onClick={() => {
            handleClickOpen(currentTask)
          }}>
        {/* <TableRow style={{
          padding: 0, height: 30, width: '100%',
          display: 'flex',
          'justify-content': 'space-between',
        }}
          onClick={() => {
            handleClickOpen(allTasks)
          }}
        >
          <TableCell style={handleStyle(lengthMorning)}><div style={{ width: '100%' }}></div></TableCell>
          <TableCell style={handleStyle(lengthAf)}><div style={{ width: '100%' }}></div></TableCell>
        </TableRow> */}
      </TableCell>
    </>
  }, [arrayDay])


  const handleRender = useCallback(()=>{
    return <>
     <div id="table-wrapper">
    
          <div id="table-scroll">
            <Table style={{ border: "0.5px solid grey" }}>
              <TableHead >
                <TableRow style={{ backgroundColor: "aqua" }}>
                  <TableCell style={{ minWidth: 250, borderRight: "0.5px solid grey", textAlign: "center" }}>
                    Tên nhân viên

                  </TableCell>
                  {Array.isArray(arrayDay) && arrayDay.map((item, idx) => {
                    return <TableCell key={item.id} style={{ borderRight: "0.5px solid grey", textAlign: "center" }}  >
                      {
                        moment(dataFilter.startDate).add(idx, "day").format("DD/MM/YYYY")
                      }
                    </TableCell>

                  })}
                </TableRow>
              </TableHead>
              <TableBody >
                {Array.isArray(data) && data.map((item, index) => {
                  return <>
                    <TableRow style={index % 2 === 0 ? { height: "30px" } : { backgroundColor: "#EBECEC", height: "30px" }} key={item.id}>
                      <TableCell style={{ minWidth: 250, borderRight: "0.5px solid grey" }}>{item.name}</TableCell>
                      {Array.isArray(arrayDay) && arrayDay.map((it, idx) => {
                        return (<>
                          {/* <TableCell key={item._id}> */}

                          {handleRenderTask(item, moment(dataFilter.startDate).add(idx, "day").format("DD/MM/YYYY"))}

                          {/* </TableCell> */}
                        </>
                        )
                      })}
                    </TableRow>
                  </>
                })}
              </TableBody>
            </Table>
          </div>
        </div>
    </>
  }, [arrayDay])
  return (
    <Paper style={{ padding: 10 }}>
      <Grid item sm={12}>
        <Grid container spacing={8}>
          <Grid item xs={8}>
            <Grid container spacing={8}>
              <Grid item xs={3}>
                <DatePicker
                  inputVariant="outlined"
                  format="DD/MM/YYYY"
                  value={dataFilter.startDate}
                  clearable
                  variant="outlined"
                  label="Ngày bắt đầu"
                  margin="dense"
                  fullWidth
                  onChange={date => {
                    setDataFilter({ ...dataFilter, startDate: moment(date).startOf("day") })
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <DatePicker
                  inputVariant="outlined"
                  format="DD/MM/YYYY"
                  value={dataFilter.endDate}
                  clearable
                  variant="outlined"
                  label="Ngày kết thúc"
                  margin="dense"
                  fullWidth
                  onChange={date => {
                    setDataFilter({ ...dataFilter, endDate: moment(date).startOf("day") })
                  }}
                />
              </Grid>
              <Grid item md={6}>
                <DepartmentAndEmployee
                  department={dataFilter.orgId}
                  employee={dataFilter.employee || ''}
                  onChange={handleChangeDepartmentAndEmployee}
                  profile={profile}
                  moduleCode={"Task"}
                />
              </Grid>

              
              
            </Grid>
          
          </Grid>
          <Grid item md={2}>
              <AsyncAutocomplete
              label="Dự án"
              filter={{
                isProject: true,
                // $or: [
                //   {type: 1},
                //   {type: 2},
                //   {type: 3},
                //   {type: 4}
                // ]
              }}
              onChange={value => {
                setDataFilter({...dataFilter, taskId: value && value._id || false})
                
              }}
              url={API_TASK_PROJECT}
            />
              </Grid>
        </Grid>
      </Grid>
      <Grid item sm={12} style={{ margin: '20px', overflow: 'auto' }}>
        {
          handleRender()
        }
       

      </Grid>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth={"md"}fullWidth>
        <DialogContent style={{ fontSize: 15, fontWeight: 500 }}>
          {
            dataDetail && Array.isArray(dataDetail) && dataDetail.length && dataDetail.map((el) => {
              return (
                <>
                  <Grid item md={12}>
                    <Grid xs={12} container>
                      <Grid md={1} sm = {1}>
                      <AssignmentIcon color="primary"/>
                      </Grid>

                      <Grid item md={5} container>
                        Tên công việc :  {el.name}
                      </Grid>
                      <Grid item md={6} container>
                      Tiến độ :  {el.progress} %
                      </Grid>
                    </Grid>
                    <Grid xs={12} container>
                    <Grid item md={6} container>
                    Từ ngày: {moment(el.startDate).format("DD/MM/YYYY HH:MM")}
                      </Grid>
                      <Grid item md={6} container>
                    Đến ngày: {moment(el.endDate).format("DD/MM/YYYY HH:MM")} 
                      </Grid>
                    </Grid>
                    <Grid xs={12}> Người giao việc: {el.inChargeStr} </Grid>
                  </Grid>
                </>
              )
            }) || null
          }

        </DialogContent>
      </Dialog>
    </Paper >

  );
}

export default compose( memo)(ManagerTask);
// ManagerTask.propTypes = {
//   dispatch: PropTypes.func.isRequired,
// };

// const mapStateToProps = createStructuredSelector({
//   // dashboardPage: makeSelectDashboardPage(),
//   profile: makeSelectProfile(),

// });

// function mapDispatchToProps(dispatch) {
//   return {
//     dispatch,
//     // changeTab: index => dispatch(changeTab(index)),
//   };
// }

// const withConnect = connect(
//   mapStateToProps,
//   mapDispatchToProps,
// );

// const withReducer = injectReducer({ key: 'managerTask', reducer });
// const withSaga = injectSaga({ key: 'managerTask', saga });

// export default compose(
//   memo,
//   withReducer,
//   withSaga,
//   withConnect,
// )(ManagerTask);