import { Box, Text } from '@chakra-ui/layout';
import CssBaseline from '@mui/material/CssBaseline';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { IDataBuying, IDataTabelBuying } from '../../../interface';
import { muiTheme } from '../../../utils/mui';
import { RenderDetailTabelBuying } from '../RenderDetailTabelBuying';
import TdTabelDetailBuying from '../TdTabelDetailBuying';
interface IProps {
  listDataBuying: IDataBuying[];
  dataAktifBuy: any[];
  dataTabelDetailBuying: IDataTabelBuying[];
  dataTabelBuyingHumico: any[];
  handleEditDataBuying: (id: number) => void;
  handleDeleteDataBuying: (id: number) => void;
  getBiayaLapangName: (id: string) => string;
  handleEditDataAktifBuy: (id: number) => void;
  handleDeleteDataAktifBuy: (id: number) => void;
}
const DataTabelBuying: React.FC<IProps> = (props) => {
  return (
    <ThemeProvider theme={muiTheme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <Box
        w='full'
        borderWidth='2px'
        borderColor='gray.400'
        height='auto'
        marginTop='30px'
      >
        <Box borderRadius='16px' h='600px' maxH='600px' overflowY='scroll'>
          <Table
            sx={{ minWidth: 750 }}
            stickyHeader
            aria-label='sticky table'
            size='small'
          >
            <TableHead>
              <TableRow>
                <TableCell style={{ minWidth: 200 }}>
                  Fix Isi Jobsheet ID
                </TableCell>
                <TableCell style={{ minWidth: 170 }} align='right'>
                  Nominal Dipakai 1 IDR 2 USD
                </TableCell>
                <TableCell style={{ minWidth: 170 }} align='right'>
                  Nominal
                </TableCell>
                <TableCell style={{ minWidth: 170 }} align='right'>
                  Kurs
                </TableCell>
                <TableCell style={{ minWidth: 170 }} align='right'>
                  Nominal Dollar
                </TableCell>
                <TableCell style={{ minWidth: 170 }} align='center'>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.listDataBuying.map(
                (dataBuying: IDataBuying, index: number) => (
                  <TdTabelDetailBuying
                    haveAction={true}
                    name={dataBuying.fixIsiJobsheetID?.label ?? ''}
                    total={String(dataBuying.nominalDipakai1IDR2USD)}
                    nominal={String(dataBuying.nominal)}
                    kurs={String(dataBuying.kurs)}
                    nominalDolar={String(dataBuying.nominalDollar)}
                    key={index}
                    onEdit={props.handleEditDataBuying}
                    onDelete={props.handleDeleteDataBuying}
                    id={dataBuying.id}
                  />
                )
              )}
              {props.dataAktifBuy.map((data: any, index: number) => (
                <TdTabelDetailBuying
                  haveAction={true}
                  name={
                    data.fix_isijobsheet_id?.label ??
                    props.getBiayaLapangName(data.fix_isijobsheet_id)
                  }
                  total={data.nominaldipakai}
                  nominal={data.nominal}
                  kurs={data.kurs}
                  nominalDolar={data.nominaldolar}
                  key={index}
                  onEdit={props.handleEditDataAktifBuy}
                  onDelete={props.handleDeleteDataAktifBuy}
                  id={data.id}
                />
              ))}
              {props.dataTabelDetailBuying.map(
                (data: IDataTabelBuying, index: number) => (
                  <>
                    <Text
                      mt='10px'
                      fontSize='13px'
                      borderStyle='none'
                      px='0px'
                      fontWeight='bold'
                      ml='4px'
                      textTransform='capitalize'
                      key={index}
                    >
                      {data.label}
                    </Text>
                    {data.data.map((dt: any, index: number) => {
                      return <RenderDetailTabelBuying key={index} data={dt} />;
                    })}
                  </>
                )
              )}
              {/* {props.dataTabelBuyingHumico.map((data: any, index: number) => (
                <>
                  <Text
                    mt='10px'
                    fontSize='13px'
                    borderStyle='none'
                    px='0px'
                    fontWeight='bold'
                    ml='4px'
                    textTransform='capitalize'
                    key={index}
                  >
                    {data.label}
                  </Text>
                  {data.data.map((dt: any, index2: number) => {
                    return (
                      <>
                        <TdTabelDetail
                          name={dt[0].label ?? ''}
                          total={dt[0].value ?? 0}
                          key={index2}
                          isHumico={true}
                        />
                        <TdTabelDetail
                          name={dt[1].label ?? ''}
                          total={dt[1].value ?? 0}
                          key={index2}
                          isHumico={true}
                        />
                      </>
                    );
                  })}
                </>
              ))} */}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default DataTabelBuying;
