import TdTabelDetail from '../TdTabelDetail';

interface IPropsRender {
  data: any;
}
export const RenderDetailTabelBuying: React.FC<IPropsRender> = (props) => {
  const selectName = props.data.filter((dt: any) => dt.label === 'nama');
  const selectTotal = props.data.filter((dt: any) => dt.label === 'dolar');
  const selectNominal = props.data.filter((dt: any) => dt.label === 'nominal');
  const selectKurs = props.data.filter((dt: any) => dt.label === 'kurs');
  const selectNominalDolar = props.data.filter(
    (dt: any) => dt.label === 'nominalkredit'
  );
  return (
    <TdTabelDetail
      name={selectName[0]?.value ?? ''}
      total={selectTotal[0]?.value ?? ''}
      nominal={selectNominal[0]?.value ?? ''}
      kurs={selectKurs[0]?.value ?? ''}
      nominalDolar={selectNominalDolar[0]?.value ?? ''}
    />
  );
};
