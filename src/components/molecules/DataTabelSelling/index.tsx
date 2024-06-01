import { Box, Flex, Text } from '@chakra-ui/layout';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import groupBy from 'lodash/groupBy';
import uniqBy from 'lodash/uniqBy';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { IDataSeling, IDataTabelBuying } from '../../../interface';
import TdTabelDetail from '../TdTabelDetail';
import React, { useState, useEffect } from 'react';
import { RenderDetailTabelBuying } from '../RenderDetailTabelBuying';
import { muiTheme } from '../../../utils/mui';
import {
  getCurrency,
  getPrice,
  getTotalIDR,
  getTotalUSD,
  getGrandTotal,
  getTax,
} from '../../../utils/selling';
import { Button } from '@chakra-ui/button';
import { convertUSDFormat } from '../../../App';

interface IProps {
  listDataSelling: IDataSeling[];
  dataAktifSell: any[];
  dataTabelDetailSelling: any[];
  handleEditDataSelling: (id: string) => void;
  handleDeleteDataSelling: (id: string) => void;
  getBiayaLapangName: (id: string) => string;
  handleEditDataAktifSell: (id: string) => void;
  handleDeleteDataAktifSell: (id: string) => void;
  handleDeleteDataCustomer: (id: string) => void;
}

const DataTabelSelling: React.FC<IProps> = (props) => {
  const [listDataSellingGroup, setListDataSellingGroup] = useState<any>([]); // array 2 dimensi dari tipe data IDataSeling
  let total3A: number = 0;
  let total3B: number = 0;
  let total3C: number = 0;

  useEffect(() => {
    const dataWithCustomerId = props.listDataSelling.filter(
      (dt) => dt.customerID !== null
    );
    const dataWithoutCustomerId = props.listDataSelling.filter(
      (dt) => dt.customerID === null
    );
    const sellingGroupsWithoutCustomerId: any = groupBy(
      dataWithoutCustomerId,
      'jid' // 'customerID.value'
    );
    const sellingGroupsWithCustomerId: any = groupBy(
      dataWithCustomerId,
      'customerID.value'
    );

    const countCustomerWithoutCustomerId = uniqBy(dataWithoutCustomerId, 'jid'); // 'customerID');
    let temp: any = [];
    countCustomerWithoutCustomerId.map((customer: any) => {
      temp.push(sellingGroupsWithoutCustomerId[customer.jid]);
    });

    const countCustomerWithCustomerId = uniqBy(
      dataWithCustomerId,
      'customerID'
    );
    countCustomerWithCustomerId.map((customer: any) => {
      temp.push(sellingGroupsWithCustomerId[customer.customerID.value]);
    });
    setListDataSellingGroup(temp);
  }, [props.listDataSelling]);

  return (
    <ThemeProvider theme={muiTheme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      {listDataSellingGroup.map(
        (listDataSeling: IDataSeling[], index: number) => {
          total3A = 0;
          total3B = 0;
          total3C = 0;
          return (
            <Box
              w='full'
              borderWidth='2px'
              borderColor='gray.400'
              height='auto'
              key={index}
              marginTop='30px'
            >
              <Box
                borderRadius='16px'
                h='300px'
                maxH='300px'
                overflowY='scroll'
                padding='10px'
              >
                {listDataSeling[0].customerID?.label ? (
                  <Text fontSize='18px' fontWeight='bold' my='10px'>
                    {listDataSeling[0].customerID?.label}
                  </Text>
                ) : (
                  <Text
                    fontSize='18px'
                    color='red'
                    fontStyle='italic'
                    fontWeight='bold'
                    my='10px'
                  >
                    Customer Info Sedang Dalam Bermasalah
                  </Text>
                )}
                <Table
                  sx={{ minWidth: 750 }}
                  stickyHeader
                  aria-label='sticky table'
                  size='small'
                >
                  <TableHead>
                    <TableRow>
                      {/* <TableCell style={{ minWidth: 200 }}>Customer ID</TableCell> */}
                      <TableCell style={{ minWidth: 170 }} align='left'>
                        ITEMS
                      </TableCell>
                      <TableCell style={{ minWidth: 170 }} align='left'>
                        QTY (Quantity)
                      </TableCell>
                      <TableCell style={{ minWidth: 170 }} align='left'>
                        Percentage
                      </TableCell>
                      <TableCell style={{ minWidth: 170 }} align='left'>
                        CUR
                      </TableCell>
                      <TableCell style={{ minWidth: 170 }} align='left'>
                        Price
                      </TableCell>
                      <TableCell style={{ minWidth: 170 }} align='left'>
                        Rate
                      </TableCell>
                      <TableCell style={{ minWidth: 170 }} align='left'>
                        Total IDR
                      </TableCell>
                      <TableCell style={{ minWidth: 170 }} align='left'>
                        Total USD
                      </TableCell>
                      <TableCell style={{ minWidth: 170 }} align='left'>
                        Grand Total
                      </TableCell>
                      <TableCell style={{ minWidth: 170 }} align='left'>
                        Tax
                      </TableCell>
                      <TableCell style={{ minWidth: 170 }} align='center'>
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* name data tabel akan diambil dari data select Fix Isi Jobsheet ID */}
                    {listDataSeling.map(
                      (dataSeling: IDataSeling, keyList: number) => {
                        let currency = getCurrency(
                          dataSeling.nominalDipakai1IDR2USD
                        );
                        let price = getPrice(
                          dataSeling.nominalDipakai1IDR2USD,
                          dataSeling.nominal,
                          dataSeling.nominalDollar
                        );
                        let totalIDR = getTotalIDR(
                          dataSeling.qty,
                          dataSeling.percentage,
                          dataSeling.nominalDipakai1IDR2USD,
                          dataSeling.nominal,
                          dataSeling.nominalDollar
                        );
                        let totalUSD = getTotalUSD(
                          dataSeling.qty,
                          dataSeling.percentage,
                          dataSeling.nominalDipakai1IDR2USD,
                          dataSeling.nominal,
                          dataSeling.nominalDollar
                        );
                        let grandTotal = getGrandTotal(
                          dataSeling.kurs,
                          dataSeling.qty,
                          dataSeling.percentage,
                          dataSeling.nominalDipakai1IDR2USD,
                          dataSeling.nominal,
                          dataSeling.nominalDollar
                        );
                        let tax = getTax(
                          dataSeling.valueAddedTax,
                          dataSeling.kurs,
                          dataSeling.qty,
                          dataSeling.percentage,
                          dataSeling.nominalDipakai1IDR2USD,
                          dataSeling.nominal,
                          dataSeling.nominalDollar
                        );
                        total3A = grandTotal;
                        total3B = tax;
                        total3C = total3A + total3B;
                        return (
                          <TdTabelDetail
                            haveAction={true}
                            name={
                              dataSeling.fixIsiJobsheetID?.label ??
                              'ERROR_TIDAK_DITEMUKAN'
                            }
                            total={String(dataSeling.nominalDipakai1IDR2USD)}
                            nominal={String(dataSeling.nominal)}
                            kurs={String(dataSeling.kurs)}
                            nominalDolar={String(dataSeling.nominalDollar)}
                            key={keyList}
                            onEdit={props.handleEditDataSelling}
                            onDelete={props.handleDeleteDataSelling}
                            id={dataSeling.id}
                            customerID={dataSeling.customerID}
                            qty={dataSeling.qty}
                            percentage={dataSeling.percentage}
                            valueAddedTax={dataSeling.valueAddedTax}
                            isCustom={true}
                            currency={currency}
                            price={price}
                            totalIDR={totalIDR}
                            totalUSD={totalUSD}
                            grandTotal={grandTotal}
                            tax={tax}
                          />
                        );
                      }
                    )}
                    <TableRow>
                      <TableCell rowSpan={4} />
                      <TableCell rowSpan={4} />
                      <TableCell rowSpan={4} />
                      <TableCell rowSpan={4} />
                      <TableCell rowSpan={4} />
                      <TableCell rowSpan={4} />
                      <TableCell rowSpan={4} />
                      <TableCell rowSpan={4} />
                      <TableCell colSpan={2} />
                      <TableCell align='left'>
                        {convertUSDFormat(total3A, 'IDR')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2}>Tax</TableCell>
                      <TableCell align='left'>
                        {convertUSDFormat(total3B, 'IDR')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2}>Total</TableCell>
                      <TableCell align='left'>
                        {convertUSDFormat(total3C, 'IDR')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align='center' colSpan={3}>
                        <Button
                          style={{
                            backgroundColor: '#29b6f6',
                            borderRadius: 8,
                            height: 50,
                            width: '100%',
                            fontSize: 16,
                            fontWeight: 600,
                            color: 'white',
                          }}
                        >
                          Go To Invoice
                        </Button>
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
              <Flex justifyContent='center' my='20px'>
                <Button
                  onClick={() =>
                    props.handleDeleteDataCustomer(
                      listDataSeling[0].customerID?.value ?? '0'
                    )
                  }
                  style={{
                    backgroundColor: '#e64a19',
                    borderRadius: 8,
                    height: 50,
                    width: '50%',
                    fontSize: 16,
                    fontWeight: 600,
                    color: 'white',
                  }}
                >
                  Delete Table
                </Button>
              </Flex>
            </Box>
          );
        }
      )}
      <Box
        display='none'
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
                {/* <TableCell style={{ minWidth: 200 }}>Customer ID</TableCell> */}
                <TableCell style={{ minWidth: 200 }} align='left'>
                  Fix Isi Jobsheet ID
                </TableCell>
                <TableCell style={{ minWidth: 170 }} align='left'>
                  Nominal Dipakai 1 IDR 2 USD
                </TableCell>
                <TableCell style={{ minWidth: 170 }} align='left'>
                  Nominal
                </TableCell>
                <TableCell style={{ minWidth: 170 }} align='left'>
                  Kurs
                </TableCell>
                <TableCell style={{ minWidth: 170 }} align='left'>
                  Nominal Dollar
                </TableCell>
                {/* <TableCell style={{ minWidth: 170 }} align='left'>
                  QTY (Quantity)
                </TableCell>
                <TableCell style={{ minWidth: 170 }} align='left'>
                  Percentage
                </TableCell>
                <TableCell style={{ minWidth: 170 }} align='left'>
                  Valued Added Tax
                </TableCell> */}
                <TableCell style={{ minWidth: 170 }} align='center'>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.dataAktifSell.map((data: any, index: number) => (
                <TdTabelDetail
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
                  onEdit={props.handleEditDataAktifSell}
                  onDelete={props.handleDeleteDataAktifSell}
                  id={data.id}
                />
              ))}
              {props.dataTabelDetailSelling.map(
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
                      return <RenderDetailTabelBuying data={dt} key={index} />;
                    })}
                  </>
                )
              )}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default DataTabelSelling;
