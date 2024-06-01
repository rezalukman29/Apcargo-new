import { Button } from '@chakra-ui/button';
import { Input } from '@chakra-ui/input';
import { Box, Flex, Text } from '@chakra-ui/layout';
import Select, { ActionMeta, OnChangeValue } from 'react-select';
import React from 'react';
import { IFormBuying, ISelectJobSheetID } from '../../../interface';
import { colourStyles } from '../../../utils/select2';
interface IProps {
  listSelectJobSheetID: ISelectJobSheetID[];
  dataBuyingForm: IFormBuying;
  idEditFormBuying: number | null;
  handleClearFormData: (formName: 'buying' | 'selling') => void;
  handleChangeDataFormBuying: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleAddUpdateListDataBuying: () => void;
  handleChangeJobSheetIDBuying: (
    newValue: OnChangeValue<ISelectJobSheetID, false>,
    actionMeta: ActionMeta<any>
  ) => void;
}

const FormBuying: React.FC<IProps> = (props) => {
  const nominal = props.dataBuyingForm.nominal?.length ?? 0;
  const kurs = props.dataBuyingForm.kurs?.length ?? 0;
  const nominalDollar = props.dataBuyingForm.nominalDollar?.length ?? 0;
  const nominalDipakai1IDR2USD =
    props.dataBuyingForm.nominalDipakai1IDR2USD?.length ?? 0;
  const isDisabledSubmit = (): boolean => {
    if (
      props.dataBuyingForm.fixIsiJobsheetID === null ||
      nominalDipakai1IDR2USD === 0 ||
      nominal === 0 ||
      kurs === 0 ||
      nominalDollar === 0
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
        Buying
      </Text>
      <Box marginTop='39px' w='full'>
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
            onChange={props.handleChangeJobSheetIDBuying}
            placeholder='Select jobsheet id'
            styles={colourStyles}
            value={props.dataBuyingForm.fixIsiJobsheetID}
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
            onChange={props.handleChangeDataFormBuying}
            height='40px'
            value={props.dataBuyingForm.nominalDipakai1IDR2USD}
            type='number'
            max={2}
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
            onChange={props.handleChangeDataFormBuying}
            height='40px'
            value={props.dataBuyingForm.nominal}
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
            Kurs
          </Text>
          <Input
            name='kurs'
            onChange={props.handleChangeDataFormBuying}
            height='40px'
            value={props.dataBuyingForm.kurs}
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
            onChange={props.handleChangeDataFormBuying}
            height='40px'
            value={props.dataBuyingForm.nominalDollar}
            type='text'
          />
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
          onClick={props.handleAddUpdateListDataBuying}
          disabled={isDisabledSubmit()}
          _hover={{}}
        >
          {props.idEditFormBuying ? 'Update Data' : 'Add Data'}
        </Button>
        <Button
          borderRadius='8px'
          minWidth='111px'
          minHeight='51px'
          width='150px'
          height='35px'
          bgColor='#E2AA57'
          color='white'
          onClick={() => props.handleClearFormData('buying')}
          _hover={{}}
        >
          Cancel
        </Button>
      </Flex>
    </Box>
  );
};

export default FormBuying;
