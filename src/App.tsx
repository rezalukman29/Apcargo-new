import { Button } from '@chakra-ui/button';
import { Box, Flex, Text } from '@chakra-ui/layout';
import { Modal, ModalContent, ModalOverlay } from '@chakra-ui/modal';
import {
  useToast
} from '@chakra-ui/react';
import { Spinner } from '@chakra-ui/spinner';
import axios from 'axios';
import findIndex from 'lodash/findIndex';
import groupBy from 'lodash/groupBy';
import uniqBy from 'lodash/uniqBy';
import React, { useEffect, useState } from 'react';
import { ActionMeta, OnChangeValue } from 'react-select';
import { v4 as uuidv4 } from 'uuid';
import AppHeader from './components/molecules/AppHeader';
import DataTabelBuying from './components/molecules/DataTabelBuying';
import DataTabelSelling from './components/molecules/DataTabelSelling';
import FormBuying from './components/molecules/FormBuying';
import FormSelling from './components/molecules/FormSelling';
import {
  IAppHeaderForm,
  IDataBuying,
  IDataSeling,
  IDataTabelBuying,
  IDataValue,
  IFormBuying,
  IFormSelling,
  ISelectJobSheetID,
} from './interface';
import {
  getCurrency,
  getGrandTotal,
  getPrice,
  getTax,
  getTotalIDR,
  getTotalUSD,
} from './utils/selling';
export interface IDataItem {
  label: string;
  data: any;
}

export const convertUSDFormat = (
  num: number,
  type: 'IDR' | 'USD' | 'NominalDollar'
): string => {
  const fixNum = num; // Number(num.toString().replaceAll('.', ''));
  if (fixNum < 1) {
    return String(fixNum);
  } else {
    if (type === 'IDR') {
      const result = new Intl.NumberFormat('en-ID', {
        style: 'currency',
        currency: 'IDR',
      })
        .format(fixNum)
        .replace(/[IDR]/gi, '')
        .replace(/(\.+\d{2})/, '')
        .trimLeft();
      // parseFloat((a-b).toFixed(2));
      return result.slice(2, result.length) // fix error format "p 340,00"

    } else if (type === 'USD') {
      return num.toLocaleString('en-US', {
        currency: 'USD',
      });
    } else {
      return num.toString();
    }
  }
};

const DummyCustomerID: ISelectJobSheetID[] = [
  {
    value: '1',
    label: 'Daniel Roy',
  },
  {
    value: '2',
    label: 'Rendy',
  },
  {
    value: '3',
    label: 'John Doe',
  },
];

const DUMMY_SELLING: IDataSeling[] = [
  {
    id: '1',
    fixIsiJobsheetID: {
      label: 'Label',
      value: '23',
    },
    nominalDipakai1IDR2USD: '2',
    nominal: '30',
    kurs: '10',
    nominalDollar: '100',
    customerID: DummyCustomerID[0],
    qty: 2,
    percentage: 10,
    valueAddedTax: 'yes',
  },
];

function App() {
  const toast = useToast();
  const [listSelectJobSheetID, setListSelectJobSheetID] = useState<
    ISelectJobSheetID[]
  >([]);
  const [listCustomerID, setListCustomerID] = useState<ISelectJobSheetID[]>([]);
  const [dataTabelDetailBuying, setDataTabelDetailBuying] = useState<
    IDataTabelBuying[]
  >([]);
  const [dataTabelDetailSelling, setDataTabelDetailSelling] = useState<any[]>(
    []
  );
  const [dataTabelBuyingHumico, setDataTabelBuyingHumico] = useState<any[]>([]);
  const [title, setTitle] = useState<string>('');
  const [lokasiStuffing, setLokasiStuffing] = useState<any>('');
  const [dataAktifBuy, setDataAktifBuy] = useState<any[]>([]);
  const [dataAktifSell, setDataAktifSell] = useState<any[]>([]);
  const [isLoadingFetch, setIsLoadingFetch] = useState<boolean>(false);
  const [isLoadingFetchPost, setIsLoadingFetchPost] = useState<boolean>(false);
  const [listDataBuying, setListDataBuying] = useState<IDataBuying[]>([]);
  const [listDataSelling, setListDataSelling] = useState<IDataSeling[]>([]);
  const [dataAppHeaderForm, setDataAppHeaderForm] = useState<IAppHeaderForm>({
    mjid: '',
    sid: '',
    emkl: '',
    ratePajak: '',
    rateBonus: '',
  });
  const [dataBuyingForm, setDataBuyingForm] = useState<IFormBuying>({
    fixIsiJobsheetID: null,
    nominalDipakai1IDR2USD: '',
    nominal: '',
    kurs: '',
    nominalDollar: '',
  });
  const [dataSellingForm, setDataSellingForm] = useState<IFormSelling>({
    fixIsiJobsheetID: null,
    nominalDipakai1IDR2USD: '',
    nominal: '',
    kurs: '',
    nominalDollar: '',
    customerID: null,
    qty: 0,
    percentage: 0,
    valueAddedTax: 'no',
  });
  const [idEditFormBuying, setIdEditFormBuying] = useState<number | null>(null);
  const [idEditFormSelling, setIdEditFormSelling] = useState<string>('');
  const [isEditExitsAktifBuy, setIsEditExitsAktifBuy] =
    useState<boolean>(false);
  const [isEditExitsAktifSell, setIsEditExitsAktifSell] =
    useState<boolean>(false);
  const [listContainer, setListContainer] = useState<any[]>([]);
  const [loadingGetJobsheet, setLoadingGetJobsheet] = useState(false);

  const getDataJobsheetID = async () => {
    const response = await axios.get(
      'https://panellokasee.host/apcargo/public/admin/getJSbuyingSelling'
    );
    let temp: ISelectJobSheetID[] = [];

    if (response.status === 200) {
      if (response.data.hasOwnProperty('hasil')) {
        response.data.hasil.forEach((jobSheet: any) => {
          temp.push({
            value: jobSheet.id,
            label: jobSheet.nama,
          });
        });
        setListSelectJobSheetID(temp);
      }
    }
    return temp;
  };

  const handleChangeJobSheetIDBuying = (
    newValue: OnChangeValue<ISelectJobSheetID, false>,
    actionMeta: ActionMeta<any>
  ) => {
    setDataBuyingForm({
      ...dataBuyingForm,
      fixIsiJobsheetID: newValue,
    });
  };

  const handleChangeValueAddedTaxSelling = (value: string) => {
    setDataSellingForm({
      ...dataSellingForm,
      valueAddedTax: value,
    });
  };

  const handleChangeJobSheetIDSelling = (
    newValue: OnChangeValue<ISelectJobSheetID, false>,
    actionMeta: ActionMeta<any>
  ) => {
    setDataSellingForm({
      ...dataSellingForm,
      fixIsiJobsheetID: newValue,
    });
  };

  const handleChangeCustomerIDSelling = (
    newValue: OnChangeValue<ISelectJobSheetID, false>,
    actionMeta: ActionMeta<any>
  ) => {
    setDataSellingForm({
      ...dataSellingForm,
      customerID: newValue,
    });

    // const indexCustomer = findIndex(listDataSelling, [
    //   'customerID.value',
    //   newValue?.value,
    // ]);
    // if (indexCustomer === -1) {
    //   // Add new customer data
    //   const temp = [
    //     ...listDataSelling,
    //     {
    //       id: new Date().getTime(),
    //       fixIsiJobsheetID: null,
    //       nominalDipakai1IDR2USD: '',
    //       nominal: '',
    //       kurs: '',
    //       nominalDollar: '',
    //       customerID: newValue,
    //       qty: 0,
    //       percentage: 0,
    //       valueAddedTax: 'no',
    //     },
    //   ].sort((a, b) => {
    //     if (a.id > b.id) return -1;
    //     if (a.id < b.id) return 1;
    //     return 0;
    //   });
    //   setListDataSelling(temp);
    // } else {
    //   // Update new customer data
    // }
  };
  const handleChangeDataAppHeaderForm = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event.target.name === 'emkl') {
      setDataAppHeaderForm({
        ...dataAppHeaderForm,
        [event.target.name]: event.target.value,
      });
    } else {
      const re = /^([0-9]|[^,$\w])*$/;
      let num = event.target.value; // .replaceAll(',', '');
      if (event.target.value === '' || re.test(num)) {
        setDataAppHeaderForm({
          ...dataAppHeaderForm,
          [event.target.name]: num,
        });
      }
    }
  };

  const handleChangeDataFormBuying = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const re = /^([0-9]|[^,$\w])*$/;
    let num = event.target.value; // .replaceAll(',', '');
    if (event.target.value === '' || re.test(num)) {
      // only input number
      let temp: any = {
        ...dataBuyingForm,
        [event.target.name]: num,
      };
      if (temp.kurs === '999' || temp.nominal === '999') {
        setDataBuyingForm({
          ...temp,
          nominalDollar: '',
        });
      } else {
        if (event.target.name === 'nominal' || event.target.name === 'kurs') {
          // nominal + kurs = dollar
          const nominal = Number(temp.nominal) / Number(temp.kurs);
          temp = {
            ...temp,
            nominalDollar: String(
              nominal == Infinity ? 0 : isNaN(nominal) ? 0 : nominal
            ),
          };
          setDataBuyingForm(temp);
        } else if (
          event.target.name === 'nominalDollar' ||
          event.target.name === 'kurs'
        ) {
          // dollar + kurs = nominal
          const nominal = Number(temp.nominalDollar) * Number(temp.kurs);
          temp = {
            ...temp,
            nominal: String(
              nominal == Infinity ? 0 : isNaN(nominal) ? 0 : nominal
            ),
          };
          setDataBuyingForm(temp);
        } else if (event.target.name === 'nominalDipakai1IDR2USD') {
          if (Number(num) > 2) {
            temp = {
              ...temp,
              [event.target.name]: '',
            };
          }
          setDataBuyingForm(temp);
        } else {
          setDataBuyingForm({
            ...temp,
          });
        }
      }
    }
  };

  const handleChangeDataFormSelling = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const re = /^([0-9]|[^,$\w])*$/;
    let num = event.target.value; // .replaceAll(',', '');
    if (event.target.value === '' || re.test(num)) {
      let temp = {
        ...dataSellingForm,
        [event.target.name]: num,
      };
      if (temp.kurs === '999' || temp.nominal === '999') {
        setDataSellingForm({
          ...temp,
          nominalDollar: '',
        });
      } else {
        if (event.target.name === 'nominal' || event.target.name === 'kurs') {
          // nominal + kurs = dollar
          const nominal = Number(temp.nominal) / Number(temp.kurs);
          temp = {
            ...temp,
            nominalDollar: String(
              nominal == Infinity ? 0 : isNaN(nominal) ? 0 : nominal
            ),
          };
          setDataSellingForm(temp);
        } else if (
          event.target.name === 'nominalDollar' ||
          event.target.name === 'kurs'
        ) {
          // dollar + kurs = nominal
          const nominal = Number(temp.nominalDollar) * Number(temp.kurs);
          temp = {
            ...temp,
            nominal: String(
              nominal == Infinity ? 0 : isNaN(nominal) ? 0 : nominal
            ),
          };
          setDataSellingForm(temp);
        } else if (event.target.name === 'nominalDipakai1IDR2USD') {
          if (Number(num) > 2) {
            temp = {
              ...temp,
              [event.target.name]: '',
            };
          }
          setDataSellingForm(temp);
        } else {
          setDataSellingForm({
            ...temp,
          });
        }
      }
    }
  };

  const handleAddUpdateListDataBuying = () => {
    if (idEditFormBuying) {
      if (isEditExitsAktifBuy) {
        // update data aktif buy from API
        const indexData = findIndex(dataAktifBuy, [
          'id',
          String(idEditFormBuying),
        ]);
        setDataAktifBuy([
          ...dataAktifBuy.slice(0, indexData),
          {
            ...dataAktifBuy[indexData],
            id: String(idEditFormBuying),
            fix_isijobsheet_id: dataBuyingForm.fixIsiJobsheetID?.value ?? '',
            nominaldipakai: dataBuyingForm.nominalDipakai1IDR2USD,
            nominal: dataBuyingForm.nominal,
            kurs: dataBuyingForm.kurs,
            nominaldolar: dataBuyingForm.nominalDollar,
          },
          ...dataAktifBuy.slice(indexData + 1, dataAktifBuy.length),
        ]);
        setIsEditExitsAktifBuy(false);
      } else {
        const indexData = findIndex(listDataBuying, ['id', idEditFormBuying]);
        setListDataBuying([
          ...listDataBuying.slice(0, indexData),
          {
            id: idEditFormBuying,
            fixIsiJobsheetID: dataBuyingForm.fixIsiJobsheetID,
            nominalDipakai1IDR2USD: dataBuyingForm.nominalDipakai1IDR2USD,
            nominal: dataBuyingForm.nominal,
            kurs: dataBuyingForm.kurs,
            nominalDollar: dataBuyingForm.nominalDollar,
          },
          ...listDataBuying.slice(indexData + 1, listDataBuying.length),
        ]);
      }
      setIdEditFormBuying(null);
      toast({
        title: 'Success',
        description: 'success update data buying.',
        status: 'success',
        position: 'bottom-right',
        duration: 5000,
        isClosable: true,
      });
    } else {
      const temp = [
        ...listDataBuying,
        {
          id: new Date().getTime(),
          fixIsiJobsheetID: dataBuyingForm.fixIsiJobsheetID,
          nominalDipakai1IDR2USD: dataBuyingForm.nominalDipakai1IDR2USD,
          nominal: dataBuyingForm.nominal,
          kurs: dataBuyingForm.kurs,
          nominalDollar: dataBuyingForm.nominalDollar,
        },
      ].sort((a, b) => {
        if (a.id > b.id) return -1;
        if (a.id < b.id) return 1;
        return 0;
      });
      setListDataBuying(temp);
      toast({
        title: 'Success',
        description: 'success add data buying.',
        status: 'success',
        position: 'bottom-right',
        duration: 5000,
        isClosable: true,
      });
    }
    handleClearFormData('buying');
  };

  const handleAddUpdateListDataSelling = () => {
    if (idEditFormSelling) {
      if (isEditExitsAktifSell) {
        const indexData = findIndex(dataAktifSell, [
          'id',
          String(idEditFormSelling),
        ]);
        setDataAktifSell([
          ...dataAktifSell.slice(0, indexData),
          {
            ...dataAktifSell[indexData],
            id: String(idEditFormSelling),
            fix_isijobsheet_id: dataSellingForm.fixIsiJobsheetID?.value ?? '',
            nominaldipakai: dataSellingForm.nominalDipakai1IDR2USD,
            nominal: dataSellingForm.nominal,
            kurs: dataSellingForm.kurs,
            nominaldolar: dataSellingForm.nominalDollar,
            customerID: dataSellingForm.customerID,
            qty: dataSellingForm.qty,
            percentage: dataSellingForm.percentage,
            valueAddedTax: dataSellingForm.valueAddedTax,
          },
          ...dataAktifSell.slice(indexData + 1, dataAktifSell.length),
        ]);
        setIsEditExitsAktifBuy(false);
      } else {
        const indexData = findIndex(listDataSelling, [
          'id',
          String(idEditFormSelling),
        ]);
        const updateData = [
          ...listDataSelling.slice(0, indexData),
          {
            id: idEditFormSelling,
            fixIsiJobsheetID: dataSellingForm.fixIsiJobsheetID,
            nominalDipakai1IDR2USD: dataSellingForm.nominalDipakai1IDR2USD,
            nominal: dataSellingForm.nominal,
            kurs: dataSellingForm.kurs,
            nominalDollar: dataSellingForm.nominalDollar,
            customerID: dataSellingForm.customerID,
            qty: dataSellingForm.qty,
            percentage: dataSellingForm.percentage,
            valueAddedTax: dataSellingForm.valueAddedTax,
          },
          ...listDataSelling.slice(indexData + 1, listDataSelling.length),
        ];
        setListDataSelling(updateData);
      }
      setIdEditFormSelling('');
      toast({
        title: 'Success',
        description: 'success update data selling.',
        status: 'success',
        position: 'bottom-right',
        duration: 5000,
        isClosable: true,
      });
    } else {
      // const indexCustomer = findIndex(listDataSelling, [
      //   'customerID.value',
      //   dataSellingForm.customerID?.value,
      // ]);
      // if (indexCustomer === -1) {
      const temp = [
        ...listDataSelling,
        {
          id: uuidv4(),
          fixIsiJobsheetID: dataSellingForm.fixIsiJobsheetID,
          nominalDipakai1IDR2USD: dataSellingForm.nominalDipakai1IDR2USD,
          nominal: dataSellingForm.nominal,
          kurs: dataSellingForm.kurs,
          nominalDollar: dataSellingForm.nominalDollar,
          customerID: dataSellingForm.customerID,
          qty: dataSellingForm.qty,
          percentage: dataSellingForm.percentage,
          valueAddedTax: dataSellingForm.valueAddedTax,
        },
      ].sort((a, b) => {
        if (a.id > b.id) return -1;
        if (a.id < b.id) return 1;
        return 0;
      });
      setListDataSelling(temp);
      toast({
        title: 'Success',
        description: 'success add data selling.',
        status: 'success',
        duration: 5000,
        position: 'bottom-right',
        isClosable: true,
      });
      // } else {
      //   setListDataSelling([
      //     ...listDataSelling.slice(0, indexCustomer),
      //     {
      //       id: listDataSelling[indexCustomer].id,
      //       fixIsiJobsheetID: dataSellingForm.fixIsiJobsheetID,
      //       nominalDipakai1IDR2USD: dataSellingForm.nominalDipakai1IDR2USD,
      //       nominal: dataSellingForm.nominal,
      //       kurs: dataSellingForm.kurs,
      //       nominalDollar: dataSellingForm.nominalDollar,
      //       customerID: dataSellingForm.customerID,
      //       qty: dataSellingForm.qty,
      //       percentage: dataSellingForm.percentage,
      //       valueAddedTax: dataSellingForm.valueAddedTax,
      //     },
      //     ...listDataSelling.slice(indexCustomer + 1, listDataSelling.length),
      //   ]);
      //   toast({
      //     title: 'Success',
      //     description: 'success update data selling.',
      //     status: 'success',
      //     position: 'bottom-right',
      //     duration: 5000,
      //     isClosable: true,
      //   });
      // }
    }
    handleClearFormData('selling');
  };

  const handleClearFormData = (formName: 'buying' | 'selling') => {
    if (formName === 'buying') {
      setDataBuyingForm({
        fixIsiJobsheetID: null,
        nominalDipakai1IDR2USD: '',
        nominal: '',
        kurs: '',
        nominalDollar: '',
      });
    } else {
      setDataSellingForm({
        fixIsiJobsheetID: null,
        nominalDipakai1IDR2USD: '',
        nominal: '',
        kurs: '',
        nominalDollar: '',
        customerID: null,
        qty: 0,
        percentage: 0,
        valueAddedTax: 'no',
      });
    }
    if (isEditExitsAktifBuy) {
      setIsEditExitsAktifBuy(false);
    }
    if (isEditExitsAktifSell) {
      setIsEditExitsAktifSell(false);
    }
    if (idEditFormBuying !== null) {
      setIdEditFormBuying(null);
    }
    if (idEditFormSelling !== '') {
      setIdEditFormSelling('');
    }
  };

  const handleEditDataBuying = (id: number) => {
    if (isEditExitsAktifBuy) {
      setIsEditExitsAktifBuy(false);
    }
    let selectedData = listDataBuying.filter(
      (data: IDataBuying) => data.id === id
    );
    if (selectedData.length > 0) {
      setIdEditFormBuying(id);
      setDataBuyingForm({
        fixIsiJobsheetID: selectedData[0].fixIsiJobsheetID,
        nominalDipakai1IDR2USD: selectedData[0].nominalDipakai1IDR2USD,
        nominal: selectedData[0].nominal,
        kurs: selectedData[0].kurs,
        nominalDollar: selectedData[0].nominalDollar,
      });
    }
  };

  const handleEditDataAktifBuy = (id: number) => {
    let selectedData = dataAktifBuy.filter(
      (data: any) => Number(data.id) === id
    );
    // console.log('id', id);

    if (selectedData.length > 0) {
      let fixIsiJobsheetID = listSelectJobSheetID.filter(
        (job: ISelectJobSheetID) =>
          job.value === selectedData[0].fix_isijobsheet_id
      );
      setIdEditFormBuying(id);
      setIsEditExitsAktifBuy(true);
      setDataBuyingForm({
        fixIsiJobsheetID:
          fixIsiJobsheetID[0] ?? selectedData[0].fix_isijobsheet_id,
        nominalDipakai1IDR2USD: selectedData[0].nominaldipakai,
        nominal: selectedData[0].nominal,
        kurs: selectedData[0].kurs,
        nominalDollar: selectedData[0].nominaldolar,
      });
    }
  };

  const handleDeleteDataBuying = (id: number) => {
    const newDataBuying = listDataBuying.filter(
      (data: IDataBuying) => data.id !== id
    );
    setListDataBuying(newDataBuying);
  };

  const handleDeleteDataAktifBuy = (id: number) => {
    const newData = dataAktifBuy.filter((data: any) => Number(data.id) !== id);
    setDataAktifBuy(newData);
  };

  const handleEditDataSelling = (id: string) => {
    if (isEditExitsAktifSell) {
      setIsEditExitsAktifSell(false);
    }
    let selectedData = listDataSelling.filter(
      (data: IDataSeling) => data.id === id
    );
    if (selectedData.length > 0) {
      setIdEditFormSelling(String(id));
      setDataSellingForm({
        fixIsiJobsheetID: selectedData[0].fixIsiJobsheetID,
        nominalDipakai1IDR2USD: selectedData[0].nominalDipakai1IDR2USD,
        nominal: selectedData[0].nominal,
        kurs: selectedData[0].kurs,
        nominalDollar: selectedData[0].nominalDollar,
        customerID: selectedData[0].customerID,
        qty: selectedData[0].qty,
        percentage: selectedData[0].percentage,
        valueAddedTax: selectedData[0].valueAddedTax,
      });
    }
  };

  const handleEditDataAktifSell = (id: string) => {
    // console.log('dataAktifSell', dataAktifSell);
    // console.log('id', id);
    let selectedData = dataAktifSell.filter(
      (data: any) => String(data.id) === id
    );

    if (selectedData.length > 0) {
      let fixIsiJobsheetID = listSelectJobSheetID.filter(
        (job: ISelectJobSheetID) =>
          job.value === selectedData[0].fix_isijobsheet_id
      );
      setIdEditFormSelling(id);
      setIsEditExitsAktifSell(true);
      setDataSellingForm({
        fixIsiJobsheetID:
          fixIsiJobsheetID[0] ?? selectedData[0].fix_isijobsheet_id,
        nominalDipakai1IDR2USD: selectedData[0].nominaldipakai,
        nominal: selectedData[0].nominal,
        kurs: selectedData[0].kurs,
        nominalDollar: selectedData[0].nominaldolar,
        customerID: selectedData[0].customerID,
        qty: selectedData[0].qty,
        percentage: selectedData[0].percentage,
        valueAddedTax: selectedData[0].valueAddedTax,
      });
    }
  };

  const handleDeleteDataAktifSell = (id: string) => {
    const newData = dataAktifSell.filter((data: any) => data.id !== id);
    setDataAktifSell(newData);
  };

  const handleDeleteDataSelling = (id: string) => {
    const newDataSelling = listDataSelling.filter(
      (data: IDataSeling) => data.id !== id
    );
    setListDataSelling(newDataSelling);
  };

  const getDataPanel = async (id: string) => {
    setLoadingGetJobsheet(true);
    const response = await axios.get(
      `https://panellokasee.host/apcargo/public/admin/getJSData/${id}`
    );
    if (response.status === 200) {
      let dataPasif: any[] = [];
      const dataAktifSell: any[] = [];
      const pasif = response.data.hasil.pasif;
      const aktif = response.data.hasil.aktif;
      let tempCustomer: ISelectJobSheetID[] = [];
      let tempBuy: any = [];
      let tempSell: any = [];
      aktif.buy.forEach((data: any) => {
        let fixIsiJobsheetID = listSelectJobSheetID.filter(
          (job: ISelectJobSheetID) => job.value === data.fix_isijobsheet_id
        );
        if (fixIsiJobsheetID.length > 0) {
          tempBuy.push({
            ...data,
            fix_isijobsheet_id: fixIsiJobsheetID[0],
          });
        } else {
          tempBuy.push(data);
        }
      });
      setTitle(aktif.tableatas.kodeshipment);
      setLokasiStuffing(aktif.tableatas.lokasistuffing);
      setListContainer(response.data.hasil.container);
      response.data.hasil.customer.forEach((customer: any) => {
        tempCustomer.push({
          label: customer.joinname,
          value: customer.id,
        });
      });
      setListCustomerID(tempCustomer);
      aktif.sell.forEach((data: any) => {
        if (data.id !== null) {
          let fixIsiJobsheetID = listSelectJobSheetID.filter(
            (job: ISelectJobSheetID) => job.value === data.fix_isijobsheet_id
          );
          if (fixIsiJobsheetID.length > 0) {
            tempSell.push({
              ...data,
              fix_isijobsheet_id: fixIsiJobsheetID[0],
            });
          } else {
            tempSell.push(data);
          }
        }
      });
      setDataAktifBuy(tempBuy);
      // setDataAktifSell(tempSell);

      for (let key in pasif) {
        let tempData: any[] = [];
        pasif[key].map((da: any) => {
          let temp: IDataValue[] = [];
          for (let keyDt in da) {
            temp.push({
              label: keyDt,
              value: da[keyDt],
            });
          }
          tempData.push(temp);
        });
        dataPasif.push({
          label: key,
          data: tempData,
        });
      }
      const humico = dataPasif.filter((dt: any) => dt.label === 'humico');
      dataPasif = dataPasif.filter((dt: any) => dt.label !== 'humico');
      setDataTabelBuyingHumico(humico);
      setDataTabelDetailBuying(dataPasif);
      setDataTabelDetailSelling(dataAktifSell);
      setDataAppHeaderForm({
        sid: aktif.tableatas.sid ?? '',
        mjid: aktif.tableatas.mjid ?? '',
        emkl: aktif.tableatas.emkl ?? '',
        ratePajak: aktif.tableatas.rate_pajak ?? '',
        rateBonus: aktif.tableatas.rate_bonus ?? '',
      });

      // set tabel selling
      // setListDataSelling] = useState<IDataSeling[]
      const getCustomerName = (id: any) => {
        // console.log('listCustomerID', listCustomerID);
        const selected = tempCustomer.filter(
          (cstmr: any) => cstmr.value === id
        )[0];
        return selected ? selected : null;
      };
      const listJobSheet = await getDataJobsheetID();
      const getJobSheet = (id: any) => {
        // console.log('listCustomerID', listCustomerID);
        const selected = listJobSheet.filter(
          (cstmr: any) => cstmr.value === id
        )[0];
        return selected ? selected : null;
      };

      let tempListDataSelling: any[] = [];
      aktif.sell.forEach((data: any) => {
        tempListDataSelling.push({
          id: data.id ? data.id : uuidv4(),
          fixIsiJobsheetID: getJobSheet(data.fix_isijobsheet_id),
          nominalDipakai1IDR2USD: data.nominaldipakai,
          nominal: data.nominal,
          kurs: data.kurs,
          nominalDollar: data.nominaldolar,
          customerID: getCustomerName(data.customer_id),
          qty: data.qty ? data.qty : 0,
          percentage: data.percentage ? data.percentage : 0,
          valueAddedTax: data.valueaddedtax ? data.valueaddedtax : 'no',
        });
      });
      setListDataSelling(tempListDataSelling);
    }
    setLoadingGetJobsheet(false);
  };

  const getBiayaLapangName = (id: string): string => {
    let fixIsiJobsheetID = listSelectJobSheetID.filter(
      (job: ISelectJobSheetID) => job.value === id
    );
    if (fixIsiJobsheetID.length > 0) {
      return fixIsiJobsheetID[0].label;
    }
    return 'null';
  };

  const handlePostData = (e: any) => {
    e.preventDefault();
    setIsLoadingFetchPost(true);
    let dataBuying: any[] = [];
    let dataSelling: any[] = [];
    let dataSellingAktif: any[] = [];
    listDataBuying.forEach((data: IDataBuying) => {
      dataBuying.push({
        nominaldipakai: data.nominalDipakai1IDR2USD,
        nominal: data.nominal,
        kurs: data.kurs,
        nominaldolar: data.nominalDollar,
        biayalapangan: data.fixIsiJobsheetID?.value ?? null,
      });
    });
    const sellingGroups: any = groupBy(listDataSelling, 'customerID.value');
    const countCustomer = uniqBy(listDataSelling, 'customerID');
    let costomerSellingGroups: any = [];
    let customerSelling: any[] = [];
    let tempSelling: any = [];
    countCustomer.map((customer: any) => {
      costomerSellingGroups.push(sellingGroups[customer.customerID.value]);
    });
    costomerSellingGroups.forEach((customerSellings: IDataSeling[]) => {
      let total3A: number = 0;
      let total3B: number = 0;
      let total3C: number = 0;
      customerSellings.forEach((selling: IDataSeling) => {
        let currency = getCurrency(selling.nominalDipakai1IDR2USD);
        let price = getPrice(
          selling.nominalDipakai1IDR2USD,
          selling.nominal,
          selling.nominalDollar
        );
        let totalIDR = getTotalIDR(
          selling.qty,
          selling.percentage,
          selling.nominalDipakai1IDR2USD,
          selling.nominal,
          selling.nominalDollar
        );
        let totalUSD = getTotalUSD(
          selling.qty,
          selling.percentage,
          selling.nominalDipakai1IDR2USD,
          selling.nominal,
          selling.nominalDollar
        );
        let grandTotal = getGrandTotal(
          selling.kurs,
          selling.qty,
          selling.percentage,
          selling.nominalDipakai1IDR2USD,
          selling.nominal,
          selling.nominalDollar
        );
        let tax = getTax(
          selling.valueAddedTax,
          selling.kurs,
          selling.qty,
          selling.percentage,
          selling.nominalDipakai1IDR2USD,
          selling.nominal,
          selling.nominalDollar
        );
        total3A = total3A + grandTotal;
        total3B = total3B + tax;
        total3C = total3C + total3A + total3B;
        tempSelling.push({
          nominaldipakai: selling.nominalDipakai1IDR2USD,
          nominal: selling.nominal,
          kurs: selling.kurs,
          nominaldolar: selling.nominalDollar,
          biayalapangan: selling.fixIsiJobsheetID?.value ?? null,
          qty: selling.qty,
          percentage: selling.percentage,
          valueAddedTax: selling.valueAddedTax,
          currency: currency,
          price: price,
          totalIDR: totalIDR,
          totalUSD: totalUSD,
          grandTotal: grandTotal,
          tax: tax,
        });
      });
      customerSelling.push({
        customerId: customerSellings[0].customerID,
        data3A: total3A,
        taxTotal: total3B,
        total: total3C,
        dataSellings: tempSelling,
      });
    });

    // listDataSelling.forEach((data: IDataSeling) => {
    //   dataSelling.push({
    //     nominaldipakai: data.nominalDipakai1IDR2USD,
    //     nominal: data.nominal,
    //     kurs: data.kurs,
    //     nominaldolar: data.nominalDollar,
    //     biayalapangan: data.fixIsiJobsheetID?.value ?? null,
    //     customerID: data.customerID,
    //     qty: data.qty,
    //     percentage: data.percentage,
    //     valueAddedTax: data.valueAddedTax,
    //     // customerID
    //     // qty
    //     // percentage
    //     // valueAddedTax
    //     // currency
    //     // price
    //     // totalIDR
    //     // totalUSD
    //     // grandTotal
    //     // tax
    //   });
    // });
    dataAktifBuy.forEach((data: any) => {
      dataBuying.push({
        nominaldipakai: data.nominaldipakai,
        nominal: data.nominal,
        kurs: data.kurs,
        nominaldolar: data.nominaldolar,
        biayalapangan:
          data.fix_isijobsheet_id?.value ?? data.fix_isijobsheet_id,
        jid: data.jid,
      });
    });
    dataAktifSell.forEach((data: any) => {
      dataSellingAktif.push({
        nominaldipakai: data.nominaldipakai,
        nominal: data.nominal,
        kurs: data.kurs,
        nominaldolar: data.nominaldolar,
        biayalapangan:
          data.fix_isijobsheet_id?.value ?? data.fix_isijobsheet_id,
        jid: data.jid,
      });
    });

    const data = {
      jobsheet: {
        mjid: dataAppHeaderForm.mjid ?? 0,
        sid: dataAppHeaderForm.sid ?? 0,
        js: {
          rate_pajak: dataAppHeaderForm.ratePajak ?? 0,
          bonus: dataAppHeaderForm.rateBonus ?? 0,
          emkl: dataAppHeaderForm.emkl ?? 0,
        },
        buying: dataBuying,
        selling: tempSelling,
        sellingAktif: dataSellingAktif,
      },
    };
    axios
      .post('https://panellokasee.host/apcargo/public/postDataJS', data)
      .then((res: any) => {
        setIsLoadingFetchPost(false);
        toast({
          title: 'Success',
          description: 'Success post data.',
          status: 'success',
          position: 'bottom-right',
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((err: any) => {
        setIsLoadingFetchPost(false);
        toast({
          title: 'Failed',
          description: 'Pailed post data.',
          status: 'error',
          position: 'bottom-right',
          duration: 5000,
          isClosable: true,
        });
        console.log('err', err);
      });
  };

  /**
   * With
   * customerID and fixIsiJobsheetID */
  const handlePostDataNewTest = (e: any) => {
    e.preventDefault();
    setIsLoadingFetchPost(true);
    let dataBuying: any[] = [];
    let dataSelling: any[] = [];
    let dataSellingAktif: any[] = [];
    listDataBuying.forEach((data: IDataBuying) => {
      dataBuying.push({
        nominaldipakai: data.nominalDipakai1IDR2USD,
        nominal: data.nominal,
        kurs: data.kurs,
        nominaldolar: data.nominalDollar,
        biayalapangan: data.fixIsiJobsheetID?.value ?? null,
      });
    });
    const sellingGroups: any = groupBy(listDataSelling, 'customerID.value');
    const countCustomer = uniqBy(listDataSelling, 'customerID');
    let costomerSellingGroups: any = [];
    let customerSelling: any[] = [];
    let tempSelling: any = [];
    let IS_HAVE_ERROR_DATA = false;
    countCustomer.map((customer: any, i: number) => {
      if (customer.customerID) {
        costomerSellingGroups.push(sellingGroups[customer.customerID.value]);
      } else {
        IS_HAVE_ERROR_DATA = true;
        return;
      }
    });
    if (IS_HAVE_ERROR_DATA) {
      toast({
        title: 'Data Error',
        description: 'Gagal post data karena ada data selling yang error.',
        status: 'error',
        position: 'bottom-right',
        duration: 5000,
        isClosable: true,
      });
      setIsLoadingFetchPost(false);
      return;
    }
    costomerSellingGroups.forEach((customerSellings: IDataSeling[]) => {
      let total3A: number = 0;
      let total3B: number = 0;
      let total3C: number = 0;
      customerSellings.forEach((selling: IDataSeling) => {
        if (selling.customerID === null || selling.fixIsiJobsheetID === null) {
          IS_HAVE_ERROR_DATA = true;
          return;
        }
        let currency = getCurrency(selling.nominalDipakai1IDR2USD);
        let price = getPrice(
          selling.nominalDipakai1IDR2USD,
          selling.nominal,
          selling.nominalDollar
        );
        let totalIDR = getTotalIDR(
          selling.qty,
          selling.percentage,
          selling.nominalDipakai1IDR2USD,
          selling.nominal,
          selling.nominalDollar
        );
        let totalUSD = getTotalUSD(
          selling.qty,
          selling.percentage,
          selling.nominalDipakai1IDR2USD,
          selling.nominal,
          selling.nominalDollar
        );
        let grandTotal = getGrandTotal(
          selling.kurs,
          selling.qty,
          selling.percentage,
          selling.nominalDipakai1IDR2USD,
          selling.nominal,
          selling.nominalDollar
        );
        let tax = getTax(
          selling.valueAddedTax,
          selling.kurs,
          selling.qty,
          selling.percentage,
          selling.nominalDipakai1IDR2USD,
          selling.nominal,
          selling.nominalDollar
        );
        total3A = total3A + grandTotal;
        total3B = total3B + tax;
        total3C = total3C + total3A + total3B;
        tempSelling.push({
          nominaldipakai: selling.nominalDipakai1IDR2USD,
          nominal: selling.nominal,
          kurs: selling.kurs,
          nominaldolar: selling.nominalDollar,
          biayalapangan: selling.fixIsiJobsheetID?.value ?? null,
          qty: selling.qty,
          percentage: selling.percentage,
          valueAddedTax: selling.valueAddedTax,
          currency: currency,
          price: price,
          totalIDR: totalIDR,
          totalUSD: totalUSD,
          grandTotal: grandTotal,
          tax: tax,
          customerID: selling.customerID?.value ?? null,
          fixIsiJobsheetID: selling.fixIsiJobsheetID?.value ?? null,
        });
      });
      customerSelling.push({
        customerId: customerSellings[0].customerID,
        data3A: total3A,
        taxTotal: total3B,
        total: total3C,
        dataSellings: tempSelling,
      });
    });

    // listDataSelling.forEach((data: IDataSeling) => {
    //   dataSelling.push({
    //     nominaldipakai: data.nominalDipakai1IDR2USD,
    //     nominal: data.nominal,
    //     kurs: data.kurs,
    //     nominaldolar: data.nominalDollar,
    //     biayalapangan: data.fixIsiJobsheetID?.value ?? null,
    //     customerID: data.customerID,
    //     qty: data.qty,
    //     percentage: data.percentage,
    //     valueAddedTax: data.valueAddedTax,
    //     // customerID
    //     // qty
    //     // percentage
    //     // valueAddedTax
    //     // currency
    //     // price
    //     // totalIDR
    //     // totalUSD
    //     // grandTotal
    //     // tax
    //   });
    // });
    dataAktifBuy.forEach((data: any) => {
      dataBuying.push({
        nominaldipakai: data.nominaldipakai,
        nominal: data.nominal,
        kurs: data.kurs,
        nominaldolar: data.nominaldolar,
        biayalapangan:
          data.fix_isijobsheet_id?.value ?? data.fix_isijobsheet_id,
        jid: data.jid,
      });
    });
    dataAktifSell.forEach((data: any) => {
      dataSellingAktif.push({
        nominaldipakai: data.nominaldipakai,
        nominal: data.nominal,
        kurs: data.kurs,
        nominaldolar: data.nominaldolar,
        biayalapangan:
          data.fix_isijobsheet_id?.value ?? data.fix_isijobsheet_id,
        jid: data.jid,
      });
    });
    if (IS_HAVE_ERROR_DATA) {
      toast({
        title: 'Data Error',
        description: 'Gagal post data karena ada data selling yang error.',
        status: 'error',
        position: 'bottom-right',
        duration: 5000,
        isClosable: true,
      });
      setIsLoadingFetchPost(false);
      return;
    }

    const data = {
      jobsheet: {
        mjid: dataAppHeaderForm.mjid ?? 0,
        sid: dataAppHeaderForm.sid ?? 0,
        js: {
          rate_pajak: dataAppHeaderForm.ratePajak ?? 0,
          bonus: dataAppHeaderForm.rateBonus ?? 0,
          emkl: dataAppHeaderForm.emkl ?? 0,
        },
        buying: dataBuying,
        selling: tempSelling,
        sellingAktif: dataSellingAktif,
      },
    };
    // console.log('data', data);
    // setIsLoadingFetchPost(false);
    axios
      .post('https://panellokasee.host/apcargo/public/postDataJS', data)
      .then((res: any) => {
        setIsLoadingFetchPost(false);
        toast({
          title: 'Success',
          description: 'Success post data.',
          status: 'success',
          position: 'bottom-right',
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((err: any) => {
        setIsLoadingFetchPost(false);
        toast({
          title: 'Failed',
          description: 'Failed post data.',
          status: 'error',
          position: 'bottom-right',
          duration: 5000,
          isClosable: true,
        });
        console.log('err', err);
      });
  };

  const handleDeleteDataCustomer = (customerId: string) => {
    let updated = listDataSelling.filter(
      (selling: IDataSeling) =>
        String(selling.customerID?.value ?? '0') !== String(customerId)
    );
    setListDataSelling(updated);
  };

  // useEffect(() => {
  //   getDataJobsheetID();
  //   const paramArr = window.location.href.split('/');
  //   const paramsId = paramArr[paramArr.length - 1];
  //   if (paramsId) {
  //     getDataPanel(paramsId);
  //   }
  // }, []);

  useEffect(() => {
    getDataJobsheetID();
    // setTimeout(() => {
    if (document.location) {
      let loc: any = document.location;
      let params: any = new URL(loc).searchParams;
      let paramsId: any = params.get('id');
      // const paramArr = window.location.href.split('/');
      // const paramsId = paramArr[paramArr.length - 1];
      if (paramsId) {
        getDataPanel(paramsId);
      }
    }
    // }, 1000);
  }, []);
  return (
    <Box p='20px 40px'>
      <Box w='full' mt='20px'>
        {/* Header App */}
        <AppHeader
          loadingGetJobsheet={loadingGetJobsheet}
          title={title}
          lokasiStuffing={lokasiStuffing}
          listContainer={listContainer}
          dataAppHeaderForm={dataAppHeaderForm}
          handleChangeDataAppHeaderForm={handleChangeDataAppHeaderForm}
        />
        {/* Form App */}
        <Box w='full'>
          <Flex
            gridGap='3'
            flexDirection={{
              base: 'column',
              sm: 'column',
              md: 'row',
              xl: 'row',
            }}
          >
            {/* Form Buying */}
            <FormBuying
              listSelectJobSheetID={listSelectJobSheetID}
              dataBuyingForm={dataBuyingForm}
              idEditFormBuying={idEditFormBuying}
              handleClearFormData={handleClearFormData}
              handleChangeDataFormBuying={handleChangeDataFormBuying}
              handleAddUpdateListDataBuying={handleAddUpdateListDataBuying}
              handleChangeJobSheetIDBuying={handleChangeJobSheetIDBuying}
            />
            {/* Form Seling */}
            <FormSelling
              listSelectJobSheetID={listSelectJobSheetID}
              listCustomerID={listCustomerID}
              handleChangeValueAddedTaxSelling={
                handleChangeValueAddedTaxSelling
              }
              dataSellingForm={dataSellingForm}
              idEditFormSelling={idEditFormSelling}
              handleChangeDataFormSelling={handleChangeDataFormSelling}
              handleAddUpdateListDataSelling={handleAddUpdateListDataSelling}
              handleClearFormData={handleClearFormData}
              handleChangeJobSheetIDSelling={handleChangeJobSheetIDSelling}
              handleChangeCustomerIDSelling={handleChangeCustomerIDSelling}
            />
          </Flex>
        </Box>
        {/* Tabel Detail */}
        <Box w='full' mt='10px'>
          <Flex
            w='full'
            gridGap='3'
            flexDirection={{
              base: 'column',
              sm: 'column',
              md: 'row',
              xl: 'row',
            }}
            justifyContent='space-between'
          >
            <Box
              w={{
                base: '100%',
                sm: '100%',
                md: '50%',
                xl: '50%',
              }}
            >
              {/* Tabel detail buying */}
              <DataTabelBuying
                listDataBuying={listDataBuying}
                dataAktifBuy={dataAktifBuy}
                dataTabelDetailBuying={dataTabelDetailBuying}
                dataTabelBuyingHumico={dataTabelBuyingHumico}
                handleEditDataBuying={handleEditDataBuying}
                handleDeleteDataBuying={handleDeleteDataBuying}
                getBiayaLapangName={getBiayaLapangName}
                handleEditDataAktifBuy={handleEditDataAktifBuy}
                handleDeleteDataAktifBuy={handleDeleteDataAktifBuy}
              />
            </Box>
            <Box
              w={{
                base: '100%',
                sm: '100%',
                md: '50%',
                xl: '50%',
              }}
            >
              {/* Tabel detail seling */}
              <DataTabelSelling
                listDataSelling={listDataSelling}
                dataAktifSell={dataAktifSell}
                dataTabelDetailSelling={dataTabelDetailSelling}
                handleEditDataSelling={handleEditDataSelling}
                handleDeleteDataSelling={handleDeleteDataSelling}
                getBiayaLapangName={getBiayaLapangName}
                handleEditDataAktifSell={handleEditDataAktifSell}
                handleDeleteDataAktifSell={handleDeleteDataAktifSell}
                handleDeleteDataCustomer={handleDeleteDataCustomer}
              // listCustomerID={listCustomerID}
              />
            </Box>
          </Flex>
        </Box>
        {/* Footer App */}
        <Flex
          w='full'
          my='25px'
          flexDirection='column'
          gridGap='10px'
          alignItems='center'
          justifyContent='center'
        >
          {/* <Button
            bgColor='green.300'
            color='white'
            w={320}
            onClick={handlePostData}
            type='submit'
            isLoading={isLoadingFetchPost}
            _hover={{}}
            _focus={{}}
          >
            POST API
          </Button> */}
          {/* <Popover trigger={'hover'} placement='top'>
            <PopoverTrigger> */}
          <Button
            bgColor='green.300'
            color='white'
            w={320}
            onClick={handlePostDataNewTest}
            type='submit'
            isLoading={isLoadingFetchPost}
            _hover={{}}
            _focus={{}}
          // isDisabled={true}
          >
            POST API
          </Button>
          {/* </PopoverTrigger>
            <PopoverContent> */}
          {/* <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Confirmation!</PopoverHeader>
              <PopoverBody>
                Sisitem sedang dalam perbaikan error customer. Tidak bisa
                melakukan post data.
              </PopoverBody>
            </PopoverContent>
          </Popover> */}
        </Flex>
      </Box>
      <Modal
        onClose={() => setIsLoadingFetch(false)}
        closeOnOverlayClick={false}
        isOpen={isLoadingFetch}
      >
        <ModalOverlay />
        <ModalContent
          bgColor='transparent'
          display='flex'
          justifyContent='center'
          maxH='100vh'
          alignItems='center'
        >
          <Spinner
            thickness='6px'
            speed='0.65s'
            emptyColor='gray.200'
            color='green.400'
            size='xl'
          />
        </ModalContent>
      </Modal>
      <Text
        fontStyle='italic'
        color='yellow.500'
        fontWeight='bold'
        mt='100px'
        textAlign='center'
        fontSize='sm'
      >
        Version 4823
      </Text>
    </Box>
  );
}

export default App;
