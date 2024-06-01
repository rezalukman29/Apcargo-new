import { PERCENT_TAX } from '../constant';

export const getCurrency = (total: string | undefined): string => {
  const type = total ?? '';
  if (type === '1') {
    return 'IDR';
  } else if (type === '2') {
    return 'USD';
  } else {
    return '-';
  }
};

export const getPrice = (
  total: string | undefined,
  nominal: string | undefined,
  nominalDolar: string | undefined
): number => {
  const type = getCurrency(total);
  if (type === 'IDR') {
    return Number(nominal) ?? 0;
  } else if (type === 'USD') {
    return Number(nominalDolar) ?? 0;
  } else {
    return 0;
  }
};

export const getTotalIDR = (
  qty: number | undefined,
  percentage: number | undefined,
  total: string | undefined,
  nominal: string | undefined,
  nominalDolar: string | undefined
): number => {
  const type = getCurrency(total);
  const price = getPrice(total, nominal, nominalDolar);
  const qtyFix = qty ?? 0;
  let percentageFix = percentage ?? 0;
  percentageFix = percentageFix === 0 ? 1 : percentageFix / 100;

  if (type === 'IDR') {
    return price * qtyFix * percentageFix;
  } else if (type === 'USD') {
    return 0;
  } else {
    return 0;
  }
};

export const getTotalUSD = (
  qty: number | undefined,
  percentage: number | undefined,
  total: string | undefined,
  nominal: string | undefined,
  nominalDolar: string | undefined
): number => {
  const type = getCurrency(total);
  const price = getPrice(total, nominal, nominalDolar);
  const qtyFix = qty ?? 0;
  let percentageFix = percentage ?? 0;
  percentageFix = percentageFix === 0 ? 1 : percentageFix / 100;

  if (type === 'IDR') {
    return 0;
  } else if (type === 'USD') {
    return price * qtyFix * percentageFix;
  } else {
    return 0;
  }
};

export const getGrandTotal = (
  kurs: string | undefined,
  qty: number | undefined,
  percentage: number | undefined,
  total: string | undefined,
  nominal: string | undefined,
  nominalDolar: string | undefined
): number => {
  const type = getCurrency(total);
  const totalIDR = getTotalIDR(qty, percentage, total, nominal, nominalDolar);
  const totalUSD = getTotalUSD(qty, percentage, total, nominal, nominalDolar);
  const rate = Number(kurs) ?? 0;

  if (type === 'IDR') {
    return totalIDR;
  } else if (type === 'USD') {
    return totalUSD * rate;
  } else {
    return 0;
  }
};

export const getTax = (
  valueAddedTax: string | undefined,
  kurs: string | undefined,
  qty: number | undefined,
  percentage: number | undefined,
  total: string | undefined,
  nominal: string | undefined,
  nominalDolar: string | undefined
): number => {
  const grandTotal = getGrandTotal(
    kurs,
    qty,
    percentage,
    total,
    nominal,
    nominalDolar
  );

  if (valueAddedTax === 'yes') {
    return grandTotal * PERCENT_TAX;
  } else if (valueAddedTax === 'no') {
    return 0;
  } else {
    return 0;
  }
};
