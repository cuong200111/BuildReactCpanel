/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * ReportHrmPage
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles, Card, CardContent, CardHeader, CardActions, makeStyles, Button } from '@material-ui/core';
import { createStructuredSelector } from 'reselect';
import { Fullscreen } from '@material-ui/icons';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import lang3 from '../../assets/img/girls.jpg';
import lang2 from '../../assets/img/Womans.jpg';
import lang from '../../assets/img/Mans.jpg';
import injectReducer from 'utils/injectReducer';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import CustomChartWrapper from '../../components/Charts/CustomChartWrapper';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import makeSelectReportHrmPage, { makeSelectDataEmploy } from './selectors';
import { Grid, Typography, Paper } from '../../components/LifetekUi';
import { mergeData as mergeDataCatagory } from '../ConfigHrmPage/actions';
import { Comment } from 'components/LifetekUi';
import { mergeData as mergeDataPersonnel } from '../PersonnelPage/actions';
import reducer from './reducer';
import { Close } from '@material-ui/icons';
import saga from './saga';
import { API_LATE_AND_LEAVE } from 'config/urlConfig';
import moment from 'moment';
import ColumnXYChartHuman from './Charts/ColumnXYChartHuman';
import ColumnXYChartWage from './Charts/ColumnXYChartWage';
import TimekeepTable from './TimekeepTable';
import { mergeData, getApi, getIncreasesOrDecreases, getLate, getHrm, getWage, getHrmSagaDataemploy } from './actions';
import ExportTable from './exportTable';
import ExportTable1 from './exportTable1';
import ExportTable2 from './exportTable2';
import { tableToExcelCustomNoList, tableToPDF } from '../../helper';
import { SORT_EMPLOY_DATE } from './constants';
import { makeSelectProfile } from '../Dashboard/selectors';
import { SwipeableDrawer } from '../../components/LifetekUi';
import PersonnelDetail from './PersonnelDetail';
am4core.useTheme(Am4themesAnimated);
const ReportBox = props =>
  props.noData ? (
    <div item md={3} spacing={4} style={{ background: 'white', padding: '25px 10px', width: '23%', position: 'relative' }} />
  ) : (
    <div item md={3} spacing={4} style={{ background: props.color, borderRadius: '3px', padding: '25px 10px', width: '23%', position: 'relative' }}>
      <div style={{ padding: 5, zIndex: 999 }}>
        <Typography style={{ color: 'white' }} variant="h4">
          {props.number}
        </Typography>
        <Typography variant="body1">{props.text}</Typography>
      </div>
      <div
        className="hover-dashboard"
        style={{
          position: 'absolute',
          background: props.backColor,
          textAlign: 'center',
          padding: 'auto',
          display: 'block',
          textDecoration: 'none',
          width: '100%',
          bottom: 0,
          left: 0,
          right: 0,
          cursor: 'pointer',
          zIndex: 555,
        }}
        onClick={props.openDetail}
      >
        Xem chi tiết
      </div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.2,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          zIndex: 88,
          fontSize: '70px',
          padding: 5,
        }}
      >
        {props.icon}
      </div>
    </div>
  );

function ColumnXYChart(props) {
  const { id, data, category } = props;

  useEffect(
    () => {
      const chart = am4core.create(id, am4charts.XYChart);
      const title = chart.titles.create();
      title.text = props.title;
      title.fontSize = 25;
      title.marginBottom = 30;
      title.fontWeight = 'bold';
      // Add data
      chart.data = data;

      // Create axes
      const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.renderer.minGridDistance = 30;
      categoryAxis.dataFields.category = category;
      categoryAxis.renderer.inversed = false;
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.cellStartLocation = 0.1;
      categoryAxis.renderer.cellEndLocation = 0.9;
      categoryAxis.renderer.minGridDistance = 40;

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.opposite = false;
      valueAxis.min = 0;
      // Create series
      function createSeries(field, name) {
        const series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = field;
        series.dataFields.categoryX = category;
        series.name = name;
        series.tooltipText = '{categoryX}: [b]{valueY}[/]';
        series.strokeWidth = 2;
        series.sequencedInterpolation = true;
        series.sequencedInterpolationDelay = 1;

        const bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.stroke = am4core.color('#fff');
        bullet.circle.strokeWidth = 2;

        return series;
      }
      if (props.value) {
        props.value.map(item => createSeries(item.field, item.name));
      }

      if (props.lenged) {
        chart.legend = new am4charts.Legend();
      }
      chart.cursor = new am4charts.XYCursor();
      return () => {
        chart.dispose();
      };
    },
    [data],
  );

  return <div id={id} {...props} />;
}
function ColumnPieChart(props) {
  const { id, data, type = '', titleTex, isExport, all, leave, isFullScreen } = props;
  const [exportAnchor, setExportAnchor] = useState(null);

  let circleChart1;
  useEffect(
    () => {
      const chart = am4core.create(id, am4charts.PieChart);
      // Add data
      chart.data = data;

      const title = chart.titles.create();
      title.text = titleTex && titleTex.toUpperCase();
      title.fontSize = 20;
      title.marginBottom = 10;
      title.fontWeight = 'bold';

      // Add and configure Series
      const pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = 'value';
      pieSeries.dataFields.category = 'name';
      pieSeries.dataFields.id = 'fields';
      chart.legend = new am4charts.Legend();
      pieSeries.legendSettings.itemValueText = '{value}';
      chart.legend.position = 'right';
      chart.legend.scrollable = true;
      circleChart1 = chart;

      chart.innerRadius = am4core.percent(55);

      // disable logo
      if (chart.logo) {
        chart.logo.disabled = true;
      }

      pieSeries.labels.template.disabled = true;
      pieSeries.ticks.template.disabled = true;
    },
    [data],
  );
  useEffect(
    () => () => {
      if (circleChart1) {
        circleChart1.dispose();
      }
    },
    [data],
  );

  return (
    <React.Fragment style={{ position: 'relative' }}>
      <div {...props} style={{ height: '100%', padding: '20px 0', marginTop: 20, width: '100%' }} id={id} />

      {isFullScreen ? (
        <>
          {/*   - full màn hình */}
          <div
            style={{
              position: 'relative',
              top: '-48%',
              left: '93%',
              transform: 'translate(-50%, -50%)',
              fontWeight: 'bold',
            }}
          >
            {`${all - leave} / ${all}`} <br />
          </div>
          <div
            style={{
              position: 'relative',
              top: '-47%',
              left: '91%',
              transform: 'translate(-50%, -50%)',
              fontWeight: 'bold',
              color: 'rgb(192 123 131)',
            }}
          >
            <p>Tổng số nhân sự</p>
          </div>{' '}
        </>
      ) : (
        <>
          {/*  lúc ban đầu - nửa màn hình */}
          <div
            style={{
              position: 'relative',
              top: '-48%',
              left: '84%',
              transform: 'translate(-50%, -50%)',
              fontWeight: 'bold',
            }}
          >
            {`${all - leave} / ${all}`} <br />
          </div>
          <div
            style={{
              position: 'relative',
              top: '-47%',
              left: '80%',
              transform: 'translate(-50%, -50%)',
              fontWeight: 'bold',
              color: 'rgb(192 123 131)',
            }}
          >
            <p>Tổng số nhân sự</p>
          </div>{' '}
        </>
      )}
    </React.Fragment>
  );
}

ReportBox.defaultProps = {
  color: 'linear-gradient(to right, #03A9F4, #03a9f4ad)',
  icon: 'CardTravel',
};

const Report = props => (
  <div
    item
    md={3}
    spacing={4}
    style={{
      background: props.color,
      borderRadius: '3px',
      padding: '25px 10px',
      width: props.size ? props.size : '20%',
      position: 'relative',
      marginTop: 20,
    }}
  >
    <div style={{ padding: 5, zIndex: 999 }}>
      <Typography style={{ color: 'white' }} variant="h4">
        {props.number}
      </Typography>
      <Typography variant="body1">{props.text}</Typography>
    </div>
    <div
      className="hover-dashboard"
      style={{
        position: 'absolute',
        background: props.backColor,
        textAlign: 'center',
        padding: 'auto',
        display: 'block',
        textDecoration: 'none',
        width: '100%',
        bottom: 0,
        left: 0,
        right: 0,
        cursor: 'pointer',
        zIndex: 555,
      }}
      onClick={props.openDetail}
    >
      Xem chi tiết
    </div>
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.2,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        zIndex: 88,
        fontSize: '70px',
        padding: 5,
      }}
    >
      {props.icon}
    </div>
  </div>
);

/* eslint-disable react/prefer-stateless-function */
export class ReportHrmPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataUser: {},
      fullScreen: false,
      fakeData: [
        {
          name: 'Hải Yến',
          avatar:
            'https://www.google.com/imgres?imgurl=https%3A%2F%2Fi.pinimg.com%2F564x%2Ff7%2Fa5%2F48%2Ff7a5489830eef765b2ba8bc77f66e25d.jpg&imgrefurl=https%3A%2F%2Fwww.pinterest.com%2Fpin%2F1149121661142005209%2F&tbnid=3ASb-VCsT4BZ0M&vet=12ahUKEwjv9aXT6571AhVszIsBHRSzAIIQMygAegUIARCkAQ..i&docid=sCXO-4aqWgijfM&w=540&h=720&itg=1&q=%E1%BA%A3nh%20g%C3%A1i%20%C4%91%E1%BA%B9p&ved=2ahUKEwjv9aXT6571AhVszIsBHRSzAIIQMygAegUIARCkAQ',
        },
        {
          name: 'Quỳnh Chi',
          avatar:
            'https://www.google.com/imgres?imgurl=https%3A%2F%2Fi.pinimg.com%2F564x%2Ff7%2Fa5%2F48%2Ff7a5489830eef765b2ba8bc77f66e25d.jpg&imgrefurl=https%3A%2F%2Fwww.pinterest.com%2Fpin%2F1149121661142005209%2F&tbnid=3ASb-VCsT4BZ0M&vet=12ahUKEwjv9aXT6571AhVszIsBHRSzAIIQMygAegUIARCkAQ..i&docid=sCXO-4aqWgijfM&w=540&h=720&itg=1&q=%E1%BA%A3nh%20g%C3%A1i%20%C4%91%E1%BA%B9p&ved=2ahUKEwjv9aXT6571AhVszIsBHRSzAIIQMygAegUIARCkAQ',
        },
      ],
      exportAnchor: null,
      openExcel: null,
      openExcell: null,
      openExcel2: null,
      exportHrm: null,
      exportLate: null,
      exportWage: null,
      exportDate: '',
      filterDepartment: undefined,
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
      openDetailPersonal: false,
    };
  }

  handleChangeOpenExcel = (key, data) => {
    this.setState({ [key]: data });
  };

  handleChangeExportAnchor = data => {
    this.setState({ exportAnchor: data });
  };
  openPersonnel = () => {
    this.props.history.push('/hrm/personnel');
  };
  handleOpenExcel = () => {
    this.setState({ openExcel: null });
  };
  handleCheckFullScreen = () => {
    this.setState({ fullScreen: !this.state.fullScreen });
  };
  openCatagory = () => {
    this.props.history.push('/hrm/configHrm');
    this.props.mergeDataCatagory({ tab: 1 });
  };

  handleCloseExcel = () => {
    const type = this.state.openExcel;
    this.setState({ openExcel: null });
    let title = 'Báo cáo theo tình hình nhân sự';
    let html = [];
    let htmlTotal = 0;
    switch (type) {
      case 'PDF':
        const { totalPage = 1, pageNumber = 1 } = {};
        const content = tableToPDF('ExportTable', '', 'Báo cáo theo tình hình nhân sự', 'Báo cáo theo tình hình nhân sự');
        // this.setState({html: [e => [...e, { content, pageNumber }]]});
        // this.setState({htmlTotal: totalPage});
        html = [{ content, pageNumber }];
        htmlTotal = totalPage;
        if (html.length > 0 && htmlTotal !== 0) {
          if (html.length === htmlTotal) {
            for (let index = 0; index < htmlTotal; index++) {
              const win = window.open();
              win.document.write(html[index].content);
              win.document.close();
              win.print();
            }
          }
        }
        break;
      default:
        tableToExcelCustomNoList('ExportTable', 'W3C Example Table', undefined, undefined, title);
    }
  };
  handleCloseHrm = () => {
    const type = this.state.openExcel2;
    this.setState({ openExcel2: null });
    let title = 'Báo cáo theo biến động nhân sự';
    let html = [];
    let htmlTotal = 0;
    switch (type) {
      case 'PDF':
        const { totalPage = 1, pageNumber = 1 } = {};
        const content = tableToPDF('ExportTable1', '', 'Báo cáo theo biến động nhân sự', 'Báo cáo theo biến động nhân sự');
        // this.setState({html: [e => [...e, { content, pageNumber }]]});
        // this.setState({htmlTotal: totalPage});
        html = [{ content, pageNumber }];
        htmlTotal = totalPage;
        if (html.length > 0 && htmlTotal !== 0) {
          if (html.length === htmlTotal) {
            for (let index = 0; index < htmlTotal; index++) {
              const win = window.open();
              win.document.write(html[index].content);
              win.document.close();
              win.print();
            }
          }
        }
        break;
      default:
        tableToExcelCustomNoList('ExportTable1', 'W3C Example Table', undefined, undefined, title);
    }
  };
  handleCloseWage = () => {
    const type = this.state.openExcell;
    this.setState({ openExcell: null });
    let title = 'Báo cáo theo biến động lương';
    let html = [];
    let htmlTotal = 0;
    switch (type) {
      case 'PDF':
        const { totalPage = 1, pageNumber = 1 } = {};
        const content = tableToPDF('ExportTable2', '', 'Báo cáo theo biến động lương', 'Báo cáo theo biến động lương');
        // this.setState({html: [e => [...e, { content, pageNumber }]]});
        // this.setState({htmlTotal: totalPage});
        html = [{ content, pageNumber }];
        htmlTotal = totalPage;
        if (html.length > 0 && htmlTotal !== 0) {
          if (html.length === htmlTotal) {
            for (let index = 0; index < htmlTotal; index++) {
              const win = window.open();
              win.document.write(html[index].content);
              win.document.close();
              win.print();
            }
          }
        }
        break;
      default:
        tableToExcelCustomNoList('ExportTable2', 'W3C Example Table', undefined, undefined, title);
    }
  };
  openIncrease = () => {
    this.props.history.push('/hrm/personnel');
    this.props.mergeDataPersonnel({ tab: 4 });
  };
  getDataLateAndLeave = () => {
    fetch(`${API_LATE_AND_LEAVE}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ dataUser: data.data });
      });
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps && nextProps.fields !== this.props.fields) {
      return true;
    }
    if (nextProps && nextProps.reportHrmPage && nextProps.reportHrmPage.lateData !== this.props.reportHrmPage.lateData) {
      return true;
    }
    if (nextProps && nextProps.getStateDataEmploy && nextProps.getStateDataEmploy.dataEmploy !== this.props.getStateDataEmploy.dataEmploy) {
      return true;
    }
    if (nextProps && nextProps.reportHrmPage && nextProps.reportHrmPage.hrmData !== this.props.reportHrmPage.hrmData) {
      return true;
    }
    if (nextProps && nextProps.reportHrmPage && nextProps.reportHrmPage.wageData !== this.props.reportHrmPage.wageData) {
      return true;
    }
    if (nextProps && nextProps.reportHrmPage && nextProps.reportHrmPage.lateAndLeave !== this.props.reportHrmPage.lateAndLeave) {
      return true;
    }

    if (this.state.openDetailPersonal !== nextState.openDetailPersonal) {
      return true;
    }
    if (this.state.fakeData !== nextState.fakeData) {
      return true;
    }
    if (this.state.openExcel !== nextState.openExcel) {
      return true;
    }
    if (this.state.openExcell !== nextState.openExcell) {
      return true;
    }
    if (this.state.openExcel2 !== nextState.openExcel2) {
      return true;
    }
    if (this.state.fullScreen !== nextState.fullScreen) {
      return true;
    }
    if (this.state.exportDate !== nextState.exportDate) {
      return true;
    }
    if (this.state.filterDepartment !== nextState.filterDepartment) {
      return true;
    }
    if (this.state.startDate !== nextState.startDate) {
      return true;
    }
    if (this.state.endDate !== nextState.endDate) {
      return true;
    }
    if (this.state.organizationUnit !== nextState.organizationUnit) {
      return true;
    }
    if (this.state.allData !== nextState.allData) {
      return true;
    }

    return false;
  }

  componentDidMount() {
    this.props.getApi();
    this.props.getIncreasesOrDecreases();
    this.props.getLate();
    this.props.getHrm();
    this.props.getWage();
    let { startDate, endDate } = this.state;
    let actionEmploy = {
      payload: { startDate, endDate },
    };
    this.props.getDataEmploy(actionEmploy);

    const hrmStatus = JSON.parse(localStorage.getItem('hrmStatus'));
    const foundKanban = hrmStatus && hrmStatus.find(item => item.code === 'ST01');
    const { data } = foundKanban;
    if (data) {
      const formatData = data.map(item => ({ field: item._id, name: item.name }));
      this.setState({ fields: formatData });
    }
    const date = moment().format('YYYY-MM-DD');
    this.setState({ exportDate: date });
  }

  openHrmPage(kanbanStatus) {
    this.props.history.push(`hrm/personnel?kanbanStatus=${kanbanStatus}`);
  }
  deleteData = (e, number) => {
    const newData = this.state.fakeData.filter((i, index) => number !== index);
    this.setState({ fakeData: newData });
  };
  onFilter = idDepartmentFilter => {
    this.setState({
      filterDepartment: idDepartmentFilter,
    });
  };
  handleChangeDate = (name, value) => {
    this.setState({ [name]: value });
  };

  componentDidUpdate(prevProps, prevState) {
    // if (prevState.filterDepartment !== this.state.filterDepartment) {
    //   let filterDepartment = this.state.filterDepartment
    //   this.props.getIncreasesOrDecreases(filterDepartment);

    //   const hrmStatus = JSON.parse(localStorage.getItem('hrmStatus'));
    //   const foundKanban = hrmStatus && hrmStatus.find(item => item.code === 'ST01');
    //   const { data } = foundKanban;
    //   if (data) {
    //     const formatData = data.map(item => ({ field: item._id, name: item.name }));
    //     this.setState({ fields: formatData });
    //   }
    //   const date = moment().format('YYYY-MM-DD');
    //   this.setState({ exportDate: date });

    // }
    if (!this.state.organizationUnit && this.props.profile) {
      this.setState({ organizationUnit: this.props.profile.organizationUnit && this.props.profile.organizationUnit.organizationUnitId });
    }
    if (
      prevState.startDate !== this.state.startDate ||
      prevState.endDate !== this.state.endDate ||
      prevState.organizationUnit !== this.state.organizationUnit
    ) {
      let { startDate, endDate, organizationUnit } = this.state;
      let actionUpdateSort = {
        payload: { startDate, endDate, organizationUnit },
      };
      this.props.getDataEmploy(actionUpdateSort);
    }
    if (
      prevProps.getStateDataEmploy &&
      this.props.getStateDataEmploy &&
      prevProps.getStateDataEmploy.dataEmploy !== this.props.getStateDataEmploy.dataEmploy
    ) {
      const { getStateDataEmploy = {} } = this.props;
      const { dataEmploy = {} } = getStateDataEmploy;

      const arrayDataEmploy = (getStateDataEmploy && getStateDataEmploy.dataEmploy && getStateDataEmploy.dataEmploy.resurt) || [];

      const { onBusiness = [], hrmEmpNew = [] } = dataEmploy;

      const dataPie = [
        {
          name: 'Nhân viên đi muộn',
          value: this.numberTypeData(arrayDataEmploy, 'late'),
          code: 'late',
        },
        {
          name: 'Nhân viên vắng mặt',
          value: this.numberTypeData(arrayDataEmploy, 'leave'),
          code: 'leave',
        },
        {
          name: 'Làm việc Online',
          value: this.numberTypeData(arrayDataEmploy, 'online'),
          code: 'online',
        },
        {
          name: 'Làm việc OnSite',
          value: this.numberTypeData(arrayDataEmploy, 'onsite'),
          code: 'onsite',
        },
        {
          name: 'Nhân viên đi công tác',
          value: onBusiness.length,
          hasCode: 'onBusiness',
        },
        {
          name: 'Nhân viên mới',
          value: hrmEmpNew.length,
          hasCode: 'hrmEmpNew',
        },
      ];
      const dataKanban = (dataEmploy && dataEmploy.dataKanban) || [];
      const hrmStatus = JSON.parse(localStorage.getItem('hrmStatus'));
      const foundKanban = hrmStatus && hrmStatus.find(item => item.code === 'ST01');
      const data = foundKanban ? foundKanban.data : [];
      let formatData = [];
      if (data) {
        formatData = data.map(item => ({ field: item._id, name: item.name }));
      }
      formatData.forEach(itemKb => {
        const value = dataKanban.find(it => it.id === itemKb.field);
        itemKb.value = (value && value.listPeople && Array.isArray(value.listPeople) && value.listPeople.length) || 0;
      });
      const allData = Array.isArray(formatData) && formatData.concat(dataPie || []);
      this.setState({ allData: allData });
      this.setState({ dataAllPersonal: dataEmploy });
    }
  }
  //lay so luong nhan vien theo tung truong (di muon, nghi .....)
  numberTypeData = (arr, field) => {
    if (Array.isArray(arr) && arr.length > 0) {
      return arr.reduce((prev, current, index) => {
        return prev + current[field];
      }, 0);
    }
  };
  handleChangeDepartment = value => {
    this.setState({
      organizationUnit: value && value.department,
    });
  };

  render() {
    const { reportHrmPage, loadingChart, getIncreasesOrDecreases, getLate, profile, getHrm, getWage, getStateDataEmploy = {} } = this.props;
    const { increasesOrDecreases, personnel, catagory, lateData, hrmData, wageData } = reportHrmPage;

    const { fields, fullScreen, allData, dataAllPersonal = [] } = this.state;
    const hrmReport = {};
    const feMalePercent = (((lateData && lateData.female) / (lateData && lateData.hrm)) * 100).toFixed(0);
    const malePercent = (((lateData && lateData.male) / (lateData && lateData.hrm)) * 100).toFixed(0);
    const { dataEmploy = {} } = getStateDataEmploy;
    if (increasesOrDecreases && fields) {
      const currentMonth = moment().get('M');
      const currentMonthData = increasesOrDecreases[currentMonth];
      if (currentMonthData) {
        fields.forEach(itemKb => {
          itemKb.value = currentMonthData[itemKb.field];
        });
      }
    }
    // const allData = Array.isArray(fields) && fields.concat(dataPie || []);

    let currentMonth = new Date().getMonth();
    return (
      <div>
        <Paper>
          <Grid container spacing={12}>
            <Grid container xs={12}>
              <Grid item xs={6} style={{ marginTop: 0 }}>
                <Typography style={{ fontSize: 18 }}>LỊCH CHẤM CÔNG - THÁNG {currentMonth + 1}</Typography>
                <TimekeepTable />
              </Grid>
              <Grid item xs={6} style={{ marginTop: 50 }}>
                <CustomChartWrapper
                  onFilter={this.onFilter}
                  height="450px"
                  onRefresh={getLate}
                  isLoading={loadingChart}
                  handleCheckFullScreen={() => this.handleCheckFullScreen()}
                  // handleOpenExcel={()=>this.handleOpenExcel()}
                  handleChangeExportAnchor={this.handleChangeExportAnchor}
                  handleChangeOpenExcel={this.handleChangeOpenExcel}
                  exportLate
                  code="hrm"
                  profile={profile}
                  showsortDate={true}
                  handleChangeDate={this.handleChangeDate}
                  handleChangeDepartment={this.handleChangeDepartment}
                >
                  <ColumnPieChart
                    id="chartData"
                    data={allData}
                    all={(dataEmploy && dataEmploy.hrm) || 0}
                    leave={(dataEmploy && dataEmploy.hrm - dataEmploy.Present) || 0}
                    titleTex="Tình hình nhân sự"
                    isFullScreen={this.state.fullScreen}
                  />
                </CustomChartWrapper>

                {/* Button chi tiết */}
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  style={{ marginLeft: '630px' }}
                  onClick={() => {
                    this.setState({ openDetailPersonal: true });
                  }}
                >
                  Chi tiết
                </Button>

                <ExportTable
                  exportType={this.state.openExcel}
                  open={this.state.openExcel}
                  onClose={() => this.handleCloseExcel()}
                  row={allData}
                  exportDate={this.state.exportDate}
                />
              </Grid>
              {
                this.state.openDetailPersonal && <SwipeableDrawer
                width={window.innerWidth - 260}
                anchor="right"
                onClose={() => {
                  this.setState({ openDetailPersonal: false });
                }}
                open={this.state.openDetailPersonal}
              >
                <div style={{ width: window.innerWidth - 260 }}>
                  <PersonnelDetail
                    onClose={() => {
                      this.setState({ openDetailPersonal: false });
                    }}
                    listTab={allData}
                    dataAllPersonal={dataAllPersonal}
                  />
                </div>
              </SwipeableDrawer>
              }
              
              {/* <Grid container style={{ height: 400, marginTop: 30 }}>
                 <Grid item xs={6}>
                   <CustomChartWrapper height="330px" onRefresh={getIncreasesOrDecreases} isLoading={loadingChart}>
                   </CustomChartWrapper>
                 </Grid>
                 <Grid item container xs={6} style={{ paddingLeft: 70 }}>
                   <Grid item xs={6} style={{ width: '100%', margin: '8px 0', justifyContent: 'flex-end' }}>
                     <Typography style={{ color: 'red', fontSize: 26, paddingLeft: 25 }}>{`${malePercent}%`}</Typography>
                     <img alt="Nguyễn văn A" src={lang} style={{ height: 200 }} />
                   </Grid>
                   <Grid item xs={6} style={{ width: '100%', margin: '8px 0' }}>
                     <Typography style={{ color: 'red', fontSize: 26, paddingLeft: 25 }}>{`${feMalePercent}%`}</Typography>
                     <img alt="Nguyễn thị B" src={lang2} style={{ height: 200 }} />
                   </Grid>
                 </Grid>
               </Grid> */}
            </Grid>
            <Grid container xs={12}>
              <Grid item xs={6} style={{ marginTop: 33, marginBottom: 10 }}>
                <CustomChartWrapper
                  onRefresh={getHrm}
                  isLoading={loadingChart}
                  handleChangeExportAnchor={this.handleChangeExportAnchor}
                  handleChangeOpenExcel={this.handleChangeOpenExcel}
                  exportHrm
                >
                  <ColumnXYChartHuman data={hrmData} id="chartDataHuman" />
                </CustomChartWrapper>
                <ExportTable1
                  exportType={this.state.openExcel2}
                  open={this.state.openExcel2}
                  onClose={() => this.handleCloseHrm()}
                  row={hrmData}
                  exportDate={this.state.exportDate}
                />
              </Grid>
              <Grid item xs={6} style={{ marginTop: 32, marginBottom: 10 }}>
                <CustomChartWrapper
                  onRefresh={getWage}
                  isLoading={loadingChart}
                  handleChangeExportAnchor={this.handleChangeExportAnchor}
                  handleChangeOpenExcel={this.handleChangeOpenExcel}
                  exportWage
                >
                  <ColumnXYChartWage id="chartDataWage" data={wageData} />
                </CustomChartWrapper>
                <ExportTable2
                  exportType={this.state.openExcell}
                  open={this.state.openExcell}
                  onClose={() => this.handleCloseWage()}
                  row={wageData}
                  exportDate={this.state.exportDate}
                />
              </Grid>
              {/* <Grid item xs={12} style={{ marginTop: 33 }}>
                 <Grid item xs={12} container direction="row" justify="flex-end" style={{ paddingRight: 50 }}>
                   <Grid item xs={6}>
                   </Grid>
                   {this.state.fakeData.map((item, index) => (
                     <Grid item xs={6} container direction="row" justify="flex-end">
                       <Card style={{ height: 100, width: 300, backgroundColor: '#f8f3f2' }}>
                         <Grid container direction="row" justify="flex-end" style={{ height: 0 }}>
                           <Close onClick={e => this.deleteData(e, index)} style={{ height: 15, transform: 'translate(15px, -5px)' }} />
                         </Grid>
                         <Grid container style={{ marginTop: -14 }}>
                           <Grid item xs={4}>
                             <img src={lang3} style={{ height: 70, width: 70, transform: 'translate(10px, 8px)', borderRadius: 5 }} />
                           </Grid>
                           <Grid item xs={8}>
                             <Typography>Hôm nay là sinh nhật</Typography>
                             <p style={{fontWeight: 700, paddingLeft: 10, marginTop: -10}}>{item.name}</p>
                           </Grid>
                         </Grid>
                       </Card>
                     </Grid>
                   ))}
                 </Grid>
                 <Grid item xs={8} style={{ marginTop: 30 }}>
                   <Comment code="HRMWage" />
                 </Grid>
               </Grid> */}
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
}

ReportHrmPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  reportHrmPage: makeSelectReportHrmPage(),
  getStateDataEmploy: makeSelectDataEmploy(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    getApi: () => dispatch(getApi()),
    mergeDataCatagory: data => dispatch(mergeDataCatagory(data)),
    mergeDataPersonnel: data => dispatch(mergeDataPersonnel(data)),
    getIncreasesOrDecreases: idDepartmentFilter => dispatch(getIncreasesOrDecreases(idDepartmentFilter)),
    getLate: () => dispatch(getLate()),
    getHrm: () => dispatch(getHrm()),
    getWage: () => dispatch(getWage()),
    getDataEmploy: data => dispatch(getHrmSagaDataemploy(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'reportHrmPage', reducer });
const withSaga = injectSaga({ key: 'reportHrmPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ReportHrmPage);
