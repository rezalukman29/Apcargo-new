import { Radio, RadioGroup } from '@chakra-ui/react';
import { Button } from '@chakra-ui/button';
import { Input } from '@chakra-ui/input';
import { Box, Flex, Text, Stack } from '@chakra-ui/layout';
import { Table, Tbody, Td, Tr } from '@chakra-ui/table';
import Select, { ActionMeta, OnChangeValue, StylesConfig } from 'react-select';
import React from 'react';
import { IFormSelling, ISelectJobSheetID } from '../../../interface';
import { colourStyles } from '../../../utils/select2';

interface IProps {
  listCustomerID: ISelectJobSheetID[];
  listSelectJobSheetID: ISelectJobSheetID[];
  dataSellingForm: IFormSelling;
  idEditFormSelling: string;
  handleChangeCustomerIDSelling: (
    newValue: OnChangeValue<ISelectJobSheetID, false>,
    actionMeta: ActionMeta<any>
  ) => void;
  handleChangeValueAddedTaxSelling: (value: 'yes' | 'no') => void;
  handleChangeDataFormSelling: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleAddUpdateListDataSelling: () => void;
  handleClearFormData: (formName: 'buying' | 'selling') => void;
  handleChangeJobSheetIDSelling: (
    newValue: OnChangeValue<ISelectJobSheetID, false>,
    actionMeta: ActionMeta<any>
  ) => void;
}

const FormSelling: React.FC<IProps> = (props) => {
  const isDisabledSubmit = (): boolean => {
    if (
      // props.dataSellingForm.customerID === null ||
      props.dataSellingForm.fixIsiJobsheetID === null ||
      props.dataSellingForm.nominalDipakai1IDR2USD.length === 0 ||
      props.dataSellingForm.nominal.length === 0 ||
      props.dataSellingForm.kurs.length === 0 ||
      props.dataSellingForm.nominalDollar.length === 0
      // || props.dataSellingForm.qty < 1
    ) {
      return true;
    }
    return false;
  };

  return (
    <Box
      w={{
        base: '100%',
        sm: '100%',
        md: '50%',
        xl: '50%',
      }}
    >
      <Text fontWeight='900' fontSize='20px' lineHeight='27px' color='#333333'>
        Selling
      </Text>
      <Box marginTop='39px' w='full'>
        <Box w='full' marginBottom='20px'>
          <Text
            color='#686868'
            fontSize='14px'
            lineHeight='19px'
            marginBottom='15px'
          >
            Customer ID
          </Text>
          <Select
            options={props.listCustomerID}
            onChange={props.handleChangeCustomerIDSelling}
            placeholder='Select customer id'
            styles={colourStyles}
            value={props.dataSellingForm.customerID}
            isDisabled={props.idEditFormSelling !== ''}
          />
        </Box>
        <Box w='full' marginBottom='20px'>
          <Text
            color='#686868'
            fontSize='14px'
            lineHeight='19px'
            marginBottom='15px'
          >
            Fix Isi Jobsheet ID
          </Text>
          <Select
            options={props.listSelectJobSheetID}
            onChange={props.handleChangeJobSheetIDSelling}
            placeholder='Select jobsheet id'
            styles={colourStyles}
            value={props.dataSellingForm.fixIsiJobsheetID}
          />
        </Box>
        <Box w='full' marginBottom='20px'>
          <Text
            color='#686868'
            fontSize='14px'
            lineHeight='19px'
            marginBottom='15px'
          >
            Nominal Dipakai 1 IDR 2 USD
          </Text>
          <Input
            name='nominalDipakai1IDR2USD'
            onChange={props.handleChangeDataFormSelling}
            height='40px'
            value={props.dataSellingForm.nominalDipakai1IDR2USD}
            type='string'
          />
        </Box>
        <Box w='full' marginBottom='20px'>
          <Text
            color='#686868'
            fontSize='14px'
            lineHeight='19px'
            marginBottom='15px'
          >
            Nominal
          </Text>
          <Input
            name='nominal'
            onChange={props.handleChangeDataFormSelling}
            height='40px'
            value={props.dataSellingForm.nominal}
          />
        </Box>
        <Box w='full' marginBottom='20px'>
          <Text
            color='#686868'
            fontSize='14px'
            lineHeight='19px'
            marginBottom='15px'
          >
            Kurs
          </Text>
          <Input
            name='kurs'
            onChange={props.handleChangeDataFormSelling}
            height='40px'
            value={props.dataSellingForm.kurs}
            type='string'
          />
        </Box>
        <Box w='full' marginBottom='20px'>
          <Text
            color='#686868'
            fontSize='14px'
            lineHeight='19px'
            marginBottom='15px'
          >
            Nominal Dollar
          </Text>
          <Input
            name='nominalDollar'
            value={props.dataSellingForm.nominalDollar}
            onChange={props.handleChangeDataFormSelling}
            type='text'
            height='40px'
          />
        </Box>
        <Box w='full' marginBottom='20px'>
          <Text
            color='#686868'
            fontSize='14px'
            lineHeight='19px'
            marginBottom='15px'
          >
            QTY (Quantity)
          </Text>
          <Input
            name='qty'
            onChange={props.handleChangeDataFormSelling}
            height='40px'
            value={props.dataSellingForm.qty}
            type='text'
          />
        </Box>
        <Box w='full' marginBottom='20px'>
          <Text
            color='#686868'
            fontSize='14px'
            lineHeight='19px'
            marginBottom='15px'
          >
            Percentage
          </Text>
          <Input
            name='percentage'
            onChange={props.handleChangeDataFormSelling}
            height='40px'
            value={props.dataSellingForm.percentage}
            type='text'
          />
        </Box>
        <Box w='full' marginBottom='20px'>
          <Text
            color='#686868'
            fontSize='14px'
            lineHeight='19px'
            marginBottom='15px'
          >
            Valued Added Tax
          </Text>
          <RadioGroup
            onChange={props.handleChangeValueAddedTaxSelling}
            value={props.dataSellingForm.valueAddedTax}
          >
            <Stack direction='row'>
              <Radio value='yes'>Yes</Radio>
              <Radio value='no'>No</Radio>
            </Stack>
          </RadioGroup>
        </Box>
      </Box>
      <Flex justifyContent='flex-start' w='full' mt='10px' gridGap='15px'>
        <Button
          minWidth='111px'
          minHeight='51px'
          width='150px'
          height='35px'
          bgColor='#71C087'
          color='white'
          borderRadius='8px'
          onClick={props.handleAddUpdateListDataSelling}
          disabled={isDisabledSubmit()}
          _hover={{}}
        >
          {props.idEditFormSelling ? 'Update Data' : 'Add Data'}
        </Button>
        <Button
          borderRadius='8px'
          minWidth='111px'
          minHeight='51px'
          width='150px'
          height='35px'
          bgColor='#E2AA57'
          color='white'
          onClick={() => props.handleClearFormData('selling')}
          _hover={{}}
        >
          Cancel
        </Button>
      </Flex>
    </Box>
  );
};

export default FormSelling;
