/**
 *
 * HolidaysPage
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Fab,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  DialogTitle,
  Button,
  Grid,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core';
import { Edit, Delete, Add } from '@material-ui/icons';
import SortableTree, { changeNodeAtPath, removeNodeAtPath } from 'react-sortable-tree';

import styles from './styles';
import './styles.css';
import CustomTheme from 'components/ThemeSortBar/index';
import DialogAcceptRemove from 'components/DialogAcceptRemove';
import CustomInputBase from 'components/Input/CustomInputBase';

/* eslint-disable react/prefer-stateless-function */
class HolidaysPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openDialogRemove: false,
      isEditting: false,
      dialogData: { date: 0, month: 0, weight: 0, type: false },
      openDialog: false,
      openDialogIsHolidayInWeek: false,
      rowInfo: undefined,
      treeData: [],
      time: true,

      dialogDataInWeek: { value: 1, type: false, name: '' },
    };
  }

  componentDidMount() {
    this.setState({ treeData: this.props.data });
  }

  componentWillReceiveProps(props) {
    if (props !== this.props) {
      this.setState({
        treeData: props.data,
      });
    }
  }

  handleDialogRemove = () => {
    const { openDialogRemove } = this.state;
    this.setState({
      openDialogRemove: !openDialogRemove,
    });
  };

  handleUpdate = () => {
    const { rowInfo, dialogData, treeData , dialogDataInWeek} = this.state;
    const { isHolidaysInWeek } = this.props;

    if(isHolidaysInWeek){
      console.log("dialogDataInWeek: ", dialogDataInWeek)
      let newData = {
        _id: dialogDataInWeek._id,
        weight: dialogDataInWeek.weight,
        type: dialogDataInWeek.type,
        name: dialogDataInWeek.name,
        value: dialogDataInWeek.value,
        time: dialogDataInWeek.time
      };
      if(! (this.state.dialogDataInWeek && this.state.dialogDataInWeek.type === "vacation")){
        delete newData.value
      }
      const index = ({ treeIndex }) => treeIndex;
      treeData[index] = newData;
      this.setState({ treeData });
      this.props.onSave(newData);
      
    }else {
      if (dialogData.date !== 0 && dialogData.month !== 0 && dialogData.weight !== 0) {
        const newData = {
          _id: dialogData._id,
          date: dialogData.date,
          month: dialogData.month,
          weight: dialogData.weight,
          type: dialogData.type,
        };
        if (newData.date > 0 && newData.date <= 31 && newData.month > 0 && newData.month <= 12) {
          const index = ({ treeIndex }) => treeIndex;
          this.props.onSave(newData);
          treeData[index] = newData;
          this.setState({ treeData });
        } else {
          this.setState({ isEditting: true, openDialog: true });
          this.props.onChangeSnackBar({ status: true, message: 'Ngày hoặc tháng không hợp lệ', variant: 'error' });
        }
      } else {
        this.props.onChangeSnackBar({ status: true, message: 'Dữ liệu nhập vào chưa hợp lệ', variant: 'error' });
      }
    }
    
  };

  handleDelete = rowInfo => {
    const { treeData } = this.state;
    const id = rowInfo.node._id;
    const answer = confirm('Do you want delete this element?');
    if (answer) {
      treeData.splice(rowInfo.treeIndex, 1);
      this.setState({ treeData });
      this.props.onDelete(id);
    }
  };

  handleAdd = () => {
    const { dialogData, treeData, dayInWkeek, dialogDataInWeek } = this.state;
    const { isHolidaysInWeek } = this.props;
    if (isHolidaysInWeek) {
      const newData = {
        ...dialogDataInWeek,
        weight: dialogDataInWeek.weight,
        type: 'vacation',
      };
      const newTree = [...treeData, newData];
      treeData.push(dialogData);
      this.setState({ treeData: newTree, openDialog: false, isEditting: false, openDialogIsHolidayInWeek: false });
      this.props.onSave(newData);
    } else {
      if (dialogData.date !== 0 && dialogData.month !== 0 && dialogData.weight !== 0) {
        if (dialogData.date > 0 && dialogData.date <= 31 && dialogData.month > 0 && dialogData.month <= 12) {
          dialogData.type = dialogData.type === false ? 'sun' : 'moon';
          const newTree = [...treeData, dialogData];
          treeData.push(dialogData);
          this.setState({ treeData: newTree, openDialog: false, isEditting: false, openDialogIsHolidayInWeek: false });
          this.props.onSave(dialogData);
        } else {
          this.setState({ isEditting: true, openDialog: true });
          this.props.onChangeSnackBar({ status: true, message: 'Ngày hoặc tháng không hợp lệ', variant: 'error' });
        }
      } else {
        this.setState({ isEditting: true, openDialog: true });
        this.props.onChangeSnackBar({ status: true, message: 'Dữ liệu nhập vào chưa hợp lệ', variant: 'error' });
      }
    }
  };
  handleOnchange = (event, isHoliday) => {
    if(isHoliday){
      const { dialogDataInWeek } = this.state;
      const target = event.target;
      const name = target.name;
      const value = target.type === 'checkbox' ? (target.checked ? 'moon' : 'sun') : target.value;
      dialogDataInWeek[name] = value;
      this.setState({
        dialogDataInWeek,
      })
    }else {
      const { dialogData } = this.state;
      const target = event.target;
      const name = target.name;
      const value = target.type === 'checkbox' ? (target.checked ? 'moon' : 'sun') : target.value;
      dialogData[name] = value;
      this.setState({
        dialogData,
      });
    }
    
  };

  render() {
    const { classes, isHolidaysInWeek } = this.props;
    const { dialogData, dayInWkeek } = this.state;
    let newData = [];
    this.state.treeData.length > 0 &&
      // this.state.treeData.map(item =>
      //   newData.push({
      //     ...item,
      //     ...{ title: `Ngày ${item.date} - Tháng ${item.month} ${item.type === 'moon' ? '(Âm lịch)' : ''} / ${item.weight}%` },
      //   }),
      // );
      this.state.treeData.map(item => {
        function renderTitle(data) {
          if (data.type === 'vacation' || data.type === 'often') {
            let dayInWkeek = '';
            switch (data.value) {
              case 0:
                dayInWkeek ="Thứ 7"
                break;
              case 1:
                dayInWkeek ="Chủ nhật"
                break;
              case 2:
                dayInWkeek ="Thứ 2"
                break;
              case 3:
                dayInWkeek ="Thứ 3"
                break;
              case 4:
                dayInWkeek ="Thứ 4"
                break;
              case 5:
                dayInWkeek ="Thứ 5"
                break;
              case 6:
                dayInWkeek ="Thứ 6"
                break;
              default:
                dayInWkeek ="Chủ nhật"
                break;
            }
            return `Tiêu đề: ${data.name || ""}  ${data.type === 'vacation' ? ` | ${dayInWkeek}`: ""}  ${data.type === 'vacation' ? '- Ngày nghỉ' : ''} / ${data.weight}%`;
          }
          return `Ngày ${data.date} - Tháng ${data.month} ${data.type === 'moon' ? '(Âm lịch)' : ''} / ${data.weight}%`;
        }
        newData.push({
          ...item,
          ...{ title: renderTitle(item) },
        });
      });
    return (
      <>
        <div>
          <div className="text-right">
            <Button
              color="primary"
              size="small"
              variant="outlined"
              round
              onClick={() => {
                if (isHolidaysInWeek) {
                  console.log('adđ isHolidaysInWeek');

                  this.setState({ isEditting: false, openDialogIsHolidayInWeek: true, dialogDataInWeek: { value: 1, type: "vacation", name: '' } });
                } else {
                  this.setState({ isEditting: false, dialogData: { day: 0, month: 0, weight: 0, type: false }, openDialog: true });
                }
              }}
            >
              <Add /> Thêm mới
            </Button>
          </div>
          <div className={classes.listStyle}>
            <SortableTree
              treeData={newData}
              onChange={treeData => {
                this.setState({ treeData: this.state.treeData });
              }}
              theme={CustomTheme}
              canDrag={({ node }) => !node.noDragging}
              isVirtualized
              // eslint-disable-next-line consistent-return
              generateNodeProps={rowInfo => {
                if (!rowInfo.node.noDragging) {
                  return {
                    buttons: [
                      <Fab
                        color="primary"
                        size="small"
                        onClick={() => {
                          if (isHolidaysInWeek) {
                            const dialogDataInWeek = Object.assign({}, rowInfo.node);
                            console.log('isHolidaysInWeek: ', dialogDataInWeek);
                            this.setState({ isEditting: true, openDialogIsHolidayInWeek: true, dialogDataInWeek, rowInfo });

                          } else {
                            const dialogData = Object.assign({}, rowInfo.node);
                            this.setState({ isEditting: true, openDialog: true, dialogData, rowInfo });
                          }
                        }}
                        style={{ marginLeft: 10, position: 'absolute', right: 50, top: 10 }}
                      >
                        <Edit />
                      </Fab>,
                      <Fab
                        color="secondary"
                        size="small"
                        style={{ marginLeft: 10, position: 'absolute', right: 5, top: 10 }}
                        title="Xóa"
                        onClick={() => {
                          this.handleDelete(rowInfo);
                        }}
                      >
                        <Delete />
                      </Fab>,
                    ],
                  };
                }
              }}
              style={{ fontFamily: 'Tahoma' }}
            />
            <DialogAcceptRemove
              title="Bạn có muốn xóa ngày nghỉ lễ này không?"
              openDialogRemove={this.state.openDialogRemove}
              handleClose={this.handleDialogRemove}
            />{' '}
            <Dialog open={this.state.openDialog} onClose={this.handleDialogAdd}>
              <DialogTitle id="alert-dialog-title">{this.state.isEditting ? 'Cập nhật ngày nghỉ lễ' : 'Thêm mới ngày nghỉ lễ'}</DialogTitle>
              <DialogContent style={{ width: 600 }}>
                <Grid container spacing={16}>
                  <Grid item xs={6}>
                    <CustomInputBase
                      label="Ngày"
                      type="number"
                      className={classes.textField}
                      value={this.state.dialogData.date}
                      onChange={e => this.handleOnchange(e)}
                      error={this.state.dialogData.date === '' || this.state.dialogData.date < 1 || this.state.dialogData.date > 31}
                      helperText={
                        (this.state.dialogData.date === '' && 'Field must fill') ||
                        ((this.state.dialogData.date > 31 && 'Date is not valid') || (this.state.dialogData.date < 1 && 'Date is not valid'))
                      }
                      name="date"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomInputBase
                      label="Tháng"
                      type="number"
                      className={classes.textField}
                      value={this.state.dialogData.month}
                      onChange={e => this.handleOnchange(e)}
                      error={this.state.dialogData.month === '' || this.state.dialogData.month < 1 || this.state.dialogData.month > 12}
                      helperText={
                        (this.state.dialogData.month === '' && 'Field must fill') ||
                        ((this.state.dialogData.month > 12 && 'Month is not valid') || (this.state.dialogData.month < 1 && 'Month is not valid'))
                      }
                      name="month"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomInputBase
                      label="Hệ số"
                      type="number"
                      className={classes.textField}
                      value={this.state.dialogData.weight}
                      onChange={e => this.handleOnchange(e)}
                      error={this.state.dialogData.weight === ''}
                      helperText={this.state.dialogData.weight === '' && 'Field must fill'}
                      name="weight"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={<Checkbox checked={dialogData.type === 'moon' ? true : false} onChange={e => this.handleOnchange(e)} name="type" />}
                      label="Lịch âm"
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    if (this.state.isEditting) {
                      this.setState({ openDialog: false });
                      this.handleUpdate();
                    } else {
                      this.handleAdd();
                    }
                  }}
                  variant="outlined"
                  color="primary"
                >
                  {this.state.isEditting ? 'LƯU' : 'LƯU'}
                </Button>
                <Button
                  onClick={() => {
                    this.setState({ openDialog: false });
                  }}
                  variant="outlined"
                  color="secondary"
                  // autoFocus
                >
                  Hủy
                </Button>
              </DialogActions>
            </Dialog>
            {/* cấu hình ngày làm việc trong tuần */}
            <Dialog open={this.state.openDialogIsHolidayInWeek} onClose={this.handleDialogAdd}>
              <DialogTitle id="alert-dialog-title">
                {this.state.isEditting ? 'Cập nhật ngày nghỉ trong tuần ' : 'Thêm mới ngày nghỉ trong tuần'}
              </DialogTitle>
              <DialogContent style={{ width: 600 }}>
                <Grid container spacing={16} style={{ marginTop: 10 }}>
                  <Grid item xs={this.state.dialogDataInWeek && this.state.dialogDataInWeek.type === "vacation" ? 6 : 12}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="standard-select-currency"
                      value={this.state.dialogDataInWeek.name}
                      InputLabelProps={{ shrink: true }}
                      onChange={data => {
                        let { dialogDataInWeek } = this.state;
                        dialogDataInWeek = {
                          ...dialogDataInWeek,
                          name: data.target.value,
                        };
                        this.setState({ dialogDataInWeek });
                      }}
                      label="Tên tiêu đề"
                    />
                  </Grid>
                  
                  {
                    this.state.dialogDataInWeek && this.state.dialogDataInWeek.type === "vacation" ? <Grid item xs={6}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="standard-select-currency"
                      select
                      label="Ngày trong tuần"
                      value={this.state.dialogDataInWeek.value}
                      InputLabelProps={{ shrink: true }}
                      onChange={data => {
                        let { dialogDataInWeek } = this.state;
                        dialogDataInWeek = {
                          ...dialogDataInWeek,
                          value: data.target.value,
                        };
                        this.setState({ dialogDataInWeek });
                      }}
                    >
                      <MenuItem value={2}>Thứ 2</MenuItem>
                      <MenuItem value={3}>Thứ 3</MenuItem>
                      <MenuItem value={4}>Thứ 4</MenuItem>
                      <MenuItem value={5}>Thứ 5</MenuItem>
                      <MenuItem value={6}>Thứ 6</MenuItem>
                      <MenuItem value={0}>Thứ 7</MenuItem>
                      <MenuItem value={1}>Chủ nhật</MenuItem>
                    </TextField>
                  </Grid> : null
                  }
                  
                  <Grid item xs={12}>
                    <CustomInputBase
                      label="Hệ số"
                      type="number"
                      className={classes.textField}
                      value={this.state.dialogDataInWeek.weight}
                      onChange={e => this.handleOnchange(e, true)}
                      error={this.state.dialogDataInWeek.weight === ''}
                      helperText={this.state.dialogDataInWeek.weight === '' && 'Không được để trống hệ số'}
                      name="weight"
                    />
                  </Grid>
                  <Grid item xs={12} container>
                    <Grid item xs={4}>
                      <Checkbox  name="checkedA" checked={this.state.dialogDataInWeek.time === "AM" ? true : false} onClick={()=>{
                        // this.setState({time: !this.state.time})
                        const {dialogDataInWeek} = this.state
                        dialogDataInWeek.time =  "AM"
                        console.log(dialogDataInWeek, 'dialogDataInWeek')
                        this.setState({dialogDataInWeek})

                      }}/> Làm sáng
                    </Grid>
                    <Grid item xs={4}>
                      <Checkbox  name="checkedA" checked={this.state.dialogDataInWeek.time === "PM" ? true : false} onClick={()=>{
                        const {dialogDataInWeek} = this.state
                        dialogDataInWeek.time = "PM"
                        console.log(dialogDataInWeek, 'dialogDataInWeek')
                        this.setState({dialogDataInWeek})
                      }}
                        /> Làm chiều
                    </Grid>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    if (this.state.isEditting) {
                      this.setState({ openDialogIsHolidayInWeek: false });
                      this.handleUpdate();
                    } else {
                      this.handleAdd();
                    }
                  }}
                  variant="outlined"
                  color="primary"
                >
                  {this.state.isEditting ? 'LƯU' : 'LƯU'}
                </Button>
                <Button
                  onClick={() => {
                    this.setState({ openDialogIsHolidayInWeek: false });
                  }}
                  variant="outlined"
                  color="secondary"
                  // autoFocus
                >
                  Hủy
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </>
    );
  }
}

HolidaysPage.propTypes = {
  classes: PropTypes.object,
  title: PropTypes.string.isRequired,
};

export default withStyles(styles)(HolidaysPage);
