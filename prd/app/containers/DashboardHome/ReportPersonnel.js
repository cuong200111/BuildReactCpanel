import { Grid, Table, TableBody, TableCell, TableHead , TableRow} from '@material-ui/core';
import moment from 'moment';
import React, { useState } from 'react';
import { useEffect } from 'react';

function ReportPersonnel(props) {
   
    
    const [personnel, setPersonnel] =  useState({})
    useEffect(()=>{
        const {lateData = [], allData = [], dataKanban = [], hrmEmpNew=[], onBusiness=[]} = props
        const newAllData = allData.filter((it)=> it && it.code)
        const newAllDataNoCode = allData.filter((it)=> !it.code && !it.hasCode)
        const newAllDataHasCode = allData.filter((it)=> it.hasCode) 

        let newData = {}
        newAllDataNoCode.map((el)=>{
            const newValue = dataKanban.find((it)=> it.id === el.field)
            newData[el.field] =  newValue && newValue.listPeople || []
        })
        newAllDataHasCode.map((el)=>{
            newData[el.hasCode] =  props && props[el.hasCode] || []
        })
        newAllData.map((el)=>{
            if(el.code)
            newData[el.code] =lateData.filter((it)=> it[el.code])
        })
        console.log(newData, 'newData')

        setPersonnel(newData)
    }, [props.allData , props.lateData, props.dataKanban])
    const renderUser= (listPeople)=>{
        if(!listPeople) return
        return listPeople.map((el)=>{

            return <>
            <TableRow>
                    <TableCell component="td" colSpan={3} >{el.name}</TableCell>
                    <TableCell component="td" colSpan={2} >{el.position && el.position.title}</TableCell>
                    <TableCell component="td" colSpan={2} >{el.organizationUnit && el.organizationUnit.name}</TableCell>
            </TableRow>
              </>
        })
         
    }
    const {lateData, allData = []} = props
  return (
    <>
      <Grid item md={12} style={{ fontSize: 20, textAlign: 'center', fontWeight: 'bold' }}>
        Báo cáo sĩ số nhân sự
      </Grid>
      <Grid item md={12} style={{ marginLeft: 20, fontWeight: 'bold'}}>
         Ngày {(props.startDate && moment(props.startDate).format('DD/MM/YYYY')) }
      </Grid>
      <Grid item md={12} container style={{maxHeight:600, overflowY:"auto"}}>

        <Table >
          <TableHead>
          <TableRow>
                    <TableCell component="th" colSpan={1} style={{textAlign:"center" }}>STT</TableCell>
                    <TableCell component="th" colSpan={3}>Nội dung</TableCell>
                    <TableCell component="th" colSpan={1}>Số lượng</TableCell>
                    <TableCell component="th" colSpan={3}>Tên nhân viên</TableCell>
                    <TableCell component="th" colSpan={2}>Chức vụ</TableCell>
                    <TableCell component="th" colSpan={2}>Phòng ban</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
            {
                allData.map((el, idx)=>{
                    return (
                        <>
            <TableRow>
            <TableCell component="td" colSpan={1}  style={{textAlign:"center" }}>{idx + 1}</TableCell>
            <TableCell component="td" colSpan={3}>{el.name}</TableCell>
            <TableCell component="td" colSpan={1} >{el.value}</TableCell>
            <TableCell component="td" colSpan={7} >
                
                {
                    renderUser(personnel[el.code || el.hasCode || el.field ])
                }
            </TableCell>
            </TableRow>
                        </>
                    )
                })
            }
         


         <TableRow style={{backgroundColor: "#B4C6E7",fontWeight: 'bold', textAlign:"center" }}>
            <TableCell component="td" colSpan={1} style={{fontWeight: 'bold', textAlign:"center" }}>{allData.length + 1}</TableCell>
            <TableCell component="td" colSpan={3} style={{fontWeight: 'bold', textAlign:"center" }}>Sĩ số hiện tại</TableCell>
            <TableCell component="th" colSpan={1}>{props.leave}/{props.all}</TableCell>
            <TableCell component="th" colSpan={3}></TableCell>
            <TableCell component="th" colSpan={2}></TableCell>
            <TableCell component="th" colSpan={2}></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Grid>
    </>
  );
}

export default ReportPersonnel;
