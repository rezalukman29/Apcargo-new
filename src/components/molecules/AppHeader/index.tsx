import { Button } from '@chakra-ui/button';
import { Input } from '@chakra-ui/input';
import { Box, Flex, Link, Text } from '@chakra-ui/layout';
import { Table, Tbody, Td, Tr } from '@chakra-ui/table';
import React, { useEffect, useState } from 'react';
import { IAppHeaderForm } from '../../../interface';
import ShipIcon from '../../../icons/ship.svg';
import { Icon, Skeleton } from '@chakra-ui/react';
import {
  convertPriceStringToNumber,
  toFormatPrice,
} from '../../../utils/currency';
// import { ReactComponent as ListIcon } from '../../../icons/ship.svg';

interface IProps {
  title: string;
  lokasiStuffing: any;
  listContainer: any[];
  dataAppHeaderForm: IAppHeaderForm;
  handleChangeDataAppHeaderForm: (
    event: any //React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  loadingGetJobsheet: boolean;
}

const AppHeader: React.FC<IProps> = (props) => {
  const [idParams, setIdParams] = useState('');

  useEffect(() => {
    if (document.location) {
      let loc: any = document.location;
      let params: any = new URL(loc).searchParams;
      let paramsId: any = params.get('id');
      // const paramArr = window.location.href.split('/');
      // const paramsId = paramArr[paramArr.length - 1];
      setIdParams(paramsId);
    }
  }, []);

  return (
    <Box w='full' mb='25px'>
      <Box w='full'>
        <Flex w='full' alignItems='center' justifyContent='space-between'>
          {props.loadingGetJobsheet ? (
            <Flex alignItems='center' gridGap='15px' w='full'>
              <Skeleton w='250px' h='40px' />
              <Skeleton w='250px' h='40px' />
              <Skeleton w='250px' h='40px' />
            </Flex>
          ) : (
            props.listContainer.map((container: any, index: number) => (
              <Flex alignItems='center' key={index} gridGap='15px' w='full'>
                <Text
                  padding='10px 16px'
                  fontSize='16px'
                  fontWeight='bold'
                  color='#fff'
                  backgroundColor='#E2AA57'
                  borderRadius='32px'
                >
                  No Container: {container?.kodecontainer ?? 'null'}
                </Text>
                <Text
                  padding='10px 16px'
                  fontSize='16px'
                  fontWeight='bold'
                  color='#fff'
                  backgroundColor='#E2AA57'
                  borderRadius='32px'
                >
                  No Seal: {container?.noseal ?? 'null'}
                </Text>
                <Text
                  padding='10px 16px'
                  fontSize='16px'
                  fontWeight='bold'
                  color='#fff'
                  backgroundColor='#E2AA57'
                  borderRadius='32px'
                >
                  Capacity: {container?.nama ?? 'null'}
                </Text>
                {/* <Text padding="10px 16px" fontSize='20px' fontWeight='bold' color='#000000'>
                Notes: {container?.notes ?? 'null'}
              </Text> */}
              </Flex>
            ))
          )}
          <Flex
            alignItems='center'
            gridGap='14px'
            width='full'
            justifyContent='flex-end'
          >
            <Icon
              width='18'
              height='18'
              viewBox='0 0 18 18'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <g clipPath='url(#clip0_202_43)'>
                <path
                  d='M17.25 15C17.0511 15 16.8603 15.079 16.7197 15.2197C16.579 15.3603 16.5 15.5511 16.5 15.75C16.5 16.008 15.9885 16.5 15.1875 16.5C14.9625 16.5079 14.7385 16.4656 14.5319 16.3763C14.3252 16.2869 14.1411 16.1526 13.9928 15.9833C14.0221 15.9354 14.0541 15.8894 14.0887 15.8453C15.3119 14.5625 16.1344 12.951 16.4557 11.208C16.5509 10.6836 16.4568 10.1424 16.1902 9.68095C15.9236 9.21946 15.5018 8.86758 15 8.688V6.75C15 5.95435 14.6839 5.19129 14.1213 4.62868C13.5587 4.06607 12.7956 3.75 12 3.75V3C12 2.20435 11.6839 1.44129 11.1213 0.87868C10.5587 0.316071 9.79565 0 9 0C8.20435 0 7.44129 0.316071 6.87868 0.87868C6.31607 1.44129 6 2.20435 6 3V3.75C5.20435 3.75 4.44129 4.06607 3.87868 4.62868C3.31607 5.19129 3 5.95435 3 6.75V8.67825C2.49195 8.85374 2.0635 9.20532 1.79221 9.66934C1.52092 10.1334 1.42471 10.6792 1.521 11.208C1.85037 12.9531 2.68095 14.5645 3.91125 15.8453C3.94724 15.8905 3.98055 15.9378 4.011 15.987C3.86253 16.157 3.67771 16.2913 3.47023 16.3801C3.26276 16.4689 3.03796 16.5099 2.8125 16.5C1.99575 16.5 1.5 15.9795 1.5 15.75C1.5 15.5511 1.42098 15.3603 1.28033 15.2197C1.13968 15.079 0.948912 15 0.75 15C0.551088 15 0.360322 15.079 0.21967 15.2197C0.0790176 15.3603 0 15.5511 0 15.75C0 16.9695 1.2885 18 2.8125 18C3.57088 18.0069 4.30643 17.7407 4.88475 17.25C5.46157 17.7317 6.18868 17.9966 6.94021 17.9988C7.69174 18.001 8.42038 17.7404 9 17.262C9.58173 17.7399 10.3118 18.0001 11.0647 17.9979C11.8175 17.9957 12.5461 17.7313 13.125 17.25C13.6999 17.738 14.4304 18.0041 15.1845 18C16.7115 18 18 16.9695 18 15.75C18 15.5511 17.921 15.3603 17.7803 15.2197C17.6397 15.079 17.4489 15 17.25 15ZM7.5 3C7.5 2.60218 7.65804 2.22064 7.93934 1.93934C8.22064 1.65804 8.60218 1.5 9 1.5C9.39782 1.5 9.77936 1.65804 10.0607 1.93934C10.342 2.22064 10.5 2.60218 10.5 3V3.75H7.5V3ZM6 5.25H12C12.3978 5.25 12.7794 5.40804 13.0607 5.68934C13.342 5.97064 13.5 6.35218 13.5 6.75V8.19L9.711 6.9465C9.25039 6.79499 8.75336 6.79499 8.29275 6.9465L4.5 8.18475V6.75C4.5 6.35218 4.65804 5.97064 4.93934 5.68934C5.22064 5.40804 5.60218 5.25 6 5.25ZM6.9375 16.5C6.68682 16.5137 6.43687 16.4623 6.21198 16.3507C5.98709 16.2391 5.79494 16.0712 5.65425 15.8633C5.49803 15.4888 5.28336 15.1414 5.01825 14.8343C3.98431 13.7638 3.28321 12.4163 3 10.9553C2.96537 10.7755 2.99645 10.5894 3.08758 10.4306C3.17872 10.2719 3.32383 10.1512 3.4965 10.0905L8.25 8.53725V15.75C8.25 16.008 7.7385 16.5 6.9375 16.5ZM11.0625 16.5C10.2458 16.5 9.75 15.9795 9.75 15.75V8.538L14.4788 10.0898C14.652 10.1503 14.7977 10.2711 14.8894 10.4301C14.9811 10.5891 15.0126 10.7757 14.9783 10.956C14.7032 12.4151 14.0095 13.7626 12.9818 14.8343C12.7149 15.1419 12.5001 15.491 12.3458 15.8678C12.205 16.0753 12.0127 16.2427 11.7877 16.3536C11.5628 16.4644 11.3129 16.5149 11.0625 16.5Z'
                  fill='#8C8C8C'
                />
              </g>
              <defs>
                <clipPath id='clip0_202_43'>
                  <rect width='18' height='18' fill='white' />
                </clipPath>
              </defs>
            </Icon>
            {props.loadingGetJobsheet ? (
              <Skeleton w='50%' h='30px' />
            ) : (
              <Text
                lineHeight='25px'
                fontSize='18px'
                fontWeight='600'
                color='#8C8C8C'
              >
                {props.lokasiStuffing}
              </Text>
            )}
          </Flex>
        </Flex>
        <Flex
          alignItems='center'
          justifyContent='space-between'
          marginTop='21px'
        >
          {props.loadingGetJobsheet ? (
            <Skeleton w='80%' h='40px' />
          ) : (
            props.title && (
              <Text
                fontSize='20px'
                fontWeight='bold'
                padding='16px 24px'
                color='#fff'
                backgroundColor='#E25757'
                borderRadius='16px'
              >
                {props.title}
              </Text>
            )
          )}
          <Flex alignItems='center' gridGap='24px' marginLeft='auto'>
            <Button
              color='#FFFFFF'
              fontSize='14px'
              fontWeight='bold'
              lineHeight='19px'
              background='#71C087'
              borderRadius='8px'
            >
              Print
            </Button>
            <Button
              color='#FFFFFF'
              fontSize='14px'
              fontWeight='bold'
              lineHeight='19px'
              background='#E2AA57'
              borderRadius='8px'
            >
              Report
            </Button>
          </Flex>
        </Flex>
        {idParams && (
          <Link
            _hover={{
              textDecoration: 'unset',
            }}
            target='_blank'
            href={`https://panellokasee.host/apcargo/public/admin/fix_mainjobsheet?parent_table=fix_shipment&parent_columns=kodeshipment,stuffing&parent_columns_alias=&parent_id=${idParams}&return_url=https%3A%2F%2Fpanellokasee.host%2Fapcargo%2Fpublic%2Fadmin%2Ffix_shipment52&foreign_key=fix_shipment_id&label=Job+Sheet`}
          >
            <Button my='3' w='full' colorScheme='linkedin'>
              Lihat Jobsheet
            </Button>
          </Link>
        )}
        {/* {props.title && (
          <Text mr='15px' fontSize='20px' fontWeight='bold' color='#000000'>
            Lokasi Stuffing:{' '}
            {props.lokasiStuffing ? `${props.lokasiStuffing}` : 'null'}
          </Text>
        )} */}

        {/* {props.dataAppHeaderForm.mjid && (
          <a
            href={`https://panellokasee.host/apcargo/public/admin/fix_mainjobsheet/lihatjobsheet/${props.dataAppHeaderForm.mjid}`}
            rel='noreferrer'
            target='_blank'
          >
            <Button
              width='150px'
              height='35px'
              bgColor='blue.300'
              color='white'
              mb='25px'
              mt='20px'
            >
              Lihat hasil
            </Button>
          </a>
        )} */}
        <Box marginTop='46px'>
          <Text
            fontWeight='900'
            fontSize='20px'
            lineHeight='27px'
            color='#333333'
          >
            Job Sheet
          </Text>
          <Flex alignItems='center' gridGap='48px' marginTop='31px'>
            <Box>
              <Text
                color='#686868'
                fontSize='14px'
                lineHeight='19px'
                marginBottom='15px'
              >
                EMKL
              </Text>
              <Input
                name='emkl'
                value={props.dataAppHeaderForm.emkl}
                onChange={props.handleChangeDataAppHeaderForm}
                height='40px'
                aria-label='emkl'
                w='full'
              />
            </Box>
            <Box>
              <Text
                color='#686868'
                fontSize='14px'
                lineHeight='19px'
                marginBottom='15px'
              >
                Rate Pajak
              </Text>
              <Input
                name='ratePajak'
                onChange={(e) =>
                  props.handleChangeDataAppHeaderForm({
                    target: {
                      name: 'ratePajak',
                      value: convertPriceStringToNumber(e.target.value),
                    },
                  })
                }
                value={toFormatPrice(props.dataAppHeaderForm.ratePajak, 'IDR')}
                // value={props.dataAppHeaderForm.ratePajak}
                // onChange={props.handleChangeDataAppHeaderForm}
                height='40px'
                type='string'
              />
            </Box>
            <Box>
              <Text
                color='#686868'
                fontSize='14px'
                lineHeight='19px'
                marginBottom='15px'
              >
                Rate Bonus
              </Text>
              <Input
                name='rateBonus'
                // value={convertUSDFormat(
                //   Number(props.dataAppHeaderForm.rateBonus),
                //   'IDR'
                // )}
                // value={props.dataAppHeaderForm.rateBonus}
                // onChange={props.handleChangeDataAppHeaderForm}
                height='40px'
                type='string'
                onChange={(e) =>
                  props.handleChangeDataAppHeaderForm({
                    target: {
                      name: 'rateBonus',
                      value: convertPriceStringToNumber(e.target.value),
                    },
                  })
                }
                value={toFormatPrice(props.dataAppHeaderForm.rateBonus, 'IDR')}
              />
            </Box>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default AppHeader;
