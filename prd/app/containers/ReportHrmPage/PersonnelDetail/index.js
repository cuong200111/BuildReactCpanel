import React, { useEffect, useState } from 'react';
import CustomAppBar from 'components/CustomAppBar';
import { Grid, Menu, MenuItem, TextField, Typography, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Button } from '@material-ui/core';
import { Grid as Grids, PagingPanel } from '@devexpress/dx-react-grid-material-ui';
import moment from 'moment';

import {
  SortingState,
  SelectionState,
  PagingState,
  CustomPaging,
  SearchState,
  IntegratedPaging,
  IntegratedSelection,
  IntegratedFiltering,
  IntegratedSorting,
} from '@devexpress/dx-react-grid';
import { makeStyles } from '@material-ui/styles';
const PersonnelDetail = props => {
  const { listTab, onClose } = props;
  const data = props;

  const [acivebg, setActivebg] = useState(0);
  const [peoples, setPeoples] = useState([]);

  const handleListTab = (item, index) => {
    setActivebg(index);
    const dataEmploy = data.dataAllPersonal;
    if (item.code) {
      // đi muộn ...
      const { code } = item;
      const { resurt = [] } = dataEmploy;
      const found = resurt.filter(it => it[code]);
      setPeoples(found || []);
    } else {
      // lấy trong listpeople
      const { dataKanban = [] } = dataEmploy || {};
      const { field } = item;
      const found = dataKanban.find(it => it.id === field) ? dataKanban.find(it => it.id === field).listPeople : [];
      setPeoples(found || []);
    }
  };
  useEffect(() => {
    if (listTab && Array.isArray(listTab) && listTab.length) {
      handleListTab(listTab[0], 0);
    }
  }, []);
  const styles = makeStyles({
    BorderGrid: {
      boxShadow: '0 0 2px 1px #00000085',
      padding: '4px',
      borderRadius: '8px',
      // margin: '1em 0.6em 0 0',
      cursor: 'pointer',
      textAlign: 'center',
    },
    fixRowSTT: {
      position: 'sticky',
      top: 0,
      border: '1px solid rgba(224, 224, 224, 1)',
      width: '100px',
      textAlign: 'center',
      padding: '1px 16px',
      backgroundColor: '#FFFFFF',
      zIndex: 999,
    },
    tablecellSTT: {
      border: '1px solid rgba(224, 224, 224, 1)',
      width: '100px',
      textAlign: 'center',
      padding: '0px 16px',
    },
    fixRowName: {
      position: 'sticky',
      top: 0,
      border: '1px solid rgba(224, 224, 224, 1)',
      width: '200px',
      textAlign: 'center',
      padding: '1px 16px',
      backgroundColor: '#FFFFFF',
      zIndex: 999,
    },
    fixColumnName: {
      position: 'sticky',
      left: 0,
      border: '1px solid rgba(224, 224, 224, 1)',
      width: '200px',
      textAlign: 'center',
      padding: '0px 16px',
      backgroundColor: '#FFFFFF',
    },
    fixOther: {
      position: 'sticky',
      left: 0,
      border: '1px solid rgba(224, 224, 224, 1)',
      width: 'maxWidth',
      textAlign: 'center',
      padding: '0px 16px',
      backgroundColor: '#FFFFFF',
    },
  });

  const classes = styles();

  return (
    <>
      <CustomAppBar title={'Chi tiết về tình hình nhân sự'} onGoBack={() => onClose()} disableAdd />
      <Grid container style={{ marginTop: 64, paddingTop: '15px' }}>
        {listTab &&
          listTab.map((item, index) => (
            <Grid
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: `${acivebg === index ? 'linear-gradient(to right, #2196F3, #03a9f4b0)' : 'linear-gradient(to right, #fff, #fff)'} `,
                fontWeight: 'bold',
                margin: '6px',
              }}
              className={classes.BorderGrid}
              onClick={() => {
                handleListTab(item, index);
              }}
              item
              xs={1}
            >
              <p
                style={{
                  margin: '0',
                }}
              >
                {item.name}
              </p>
            </Grid>
          ))}
      </Grid>
      <div style={{ height: 'calc(100vh - 210px)', overflow: 'auto', border: '1px solid rgb(169, 169, 169 )', marginTop: '8px' }}>
        <Table stickyHeader aria-label="sticky table" style={{ borderCollapse: 'separate' }}>
          <TableHead style={{ position: 'sticky', top: 0, zIndex: 9999, backgroundColor: '#fff' }}>
            <TableRow>
              <TableCell className={classes.fixRowSTT}>STT</TableCell>
              <TableCell className={classes.fixRowName}>Tên</TableCell>
              <TableCell className={classes.fixRowName}>Mã</TableCell>
              <TableCell className={classes.fixRowName}>Ngày bắt đầu công việc </TableCell>
              <TableCell className={classes.fixRowName}>Vị trí</TableCell>
              <TableCell className={classes.fixOther}>Khác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {peoples &&
              peoples.map((data, index) => (
                <TableRow key={index + 1}>
                  <TableCell className={classes.tablecellSTT}> {index + 1} </TableCell>
                  <TableCell className={classes.fixColumnName}> {data.name} </TableCell>
                  <TableCell className={classes.fixColumnName}> {data._id ? data._id : data.id} </TableCell>
                  <TableCell className={classes.fixColumnName}> {data.beginWork ? moment(data.beginWork).format('DD-MM-YYYY') : ''} </TableCell>
                  <TableCell className={classes.fixColumnName}> {data.position ? data.position.title : ''} </TableCell>
                  <TableCell className={classes.fixOther}> {} </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      {/* <GridItem md={12} css={{ flexDirection: 'none', height: 10 }}>
        <Grids 
        rows={rows} columns={columns}
        >
          <PagingState
            currentPage={currentPage}
            onCurrentPageChange={value => changeCurrentPage(value)}
            pageSize={pageSize}
            onPageSizeChange={value => changePageSize(value)}
          />
          <CustomPaging totalCount={data ? data.count : 10} />
          <PagingPanel messages={{ rowsPerPage: 'Số dòng hiển thị' }} pageSizes={pageSizes} />
        </Grids>
      </GridItem> */}
    </>
  );
};

export default PersonnelDetail;
