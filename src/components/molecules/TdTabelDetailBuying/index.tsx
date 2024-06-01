import Button from '@mui/material/Button';
import { Flex } from '@chakra-ui/layout';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import React from 'react';
import { convertUSDFormat } from '../../../App';
import style from './style.module.css';

interface IProps {
  id?: number;
  name: string;
  total?: string;
  nominal?: string;
  kurs?: string;
  nominalDolar?: string;
  haveAction?: boolean;
  isHumico?: boolean;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const TdTabelDetailBuying: React.FC<IProps> = (props) => {
  const handleEdit = () => {
    if (props.haveAction && props.onEdit) {
      props.onEdit(Number(props.id) ?? 0);
    }
  };
  const handleDelete = () => {
    if (props.haveAction && props.onDelete) {
      props.onDelete(Number(props.id) ?? 0);
    }
  };

  if (props.isHumico) {
    return (
      <TableRow
        key={new Date().getTime()}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell className={style.dataTabelDetail}>
          {props.name.replaceAll('_', ' ')}
        </TableCell>
        <TableCell align='right' className={style.dataTabelDetail}>
          {props.total ? convertUSDFormat(Number(props.total ?? 0), 'IDR') : 0}
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow
      key={new Date().getTime()}
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <TableCell className={style.dataTabelDetail}>
        {props.name.replaceAll('_', ' ')}
      </TableCell>
      <TableCell align='right' className={style.dataTabelDetail}>
        {props.total ? convertUSDFormat(Number(props.total ?? 0), 'IDR') : 0}
      </TableCell>
      <TableCell align='right' className={style.dataTabelDetail}>
        {props.nominal
          ? convertUSDFormat(Number(props.nominal ?? 0), 'IDR')
          : 0}
      </TableCell>
      <TableCell align='right' className={style.dataTabelDetail}>
        {props.kurs ? convertUSDFormat(Number(props.kurs ?? 0), 'IDR') : 0}
      </TableCell>
      <TableCell align='right' className={style.dataTabelDetail}>
        {props.nominalDolar
          ? convertUSDFormat(Number(props.nominalDolar), 'IDR')
          : 0}
      </TableCell>
      <TableCell align='center' className={style.dataTabelDetail}>
        {props.haveAction && (
          <Flex justifyContent='center' alignItems='center' gridGap='15px'>
            {props.onEdit && (
              <Button
                size='medium'
                color='primary'
                onClick={handleEdit}
                style={{
                  backgroundColor: '#ED8936',
                  fontWeight: '600',
                  color: 'white',
                }}
              >
                Edit
              </Button>
            )}
            {props.onDelete && (
              <Button
                size='medium'
                color='primary'
                onClick={handleDelete}
                style={{
                  backgroundColor: '#F56565',
                  fontWeight: '600',
                  color: 'white',
                }}
              >
                Delete
              </Button>
            )}
          </Flex>
        )}
      </TableCell>
    </TableRow>
  );
};

export default TdTabelDetailBuying;
