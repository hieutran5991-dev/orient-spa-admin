export const CURRENCY = {
  VND: "VND",
  USD: "USD",
} as const;

export const formatPriceWithCurrency = (
  price: number | string,
  currency: string = "VND"
) => {
  if (currency === CURRENCY.VND) {
    const priceNumber =
      typeof price === "string" ? parseInt(price) : Number(price);

    return Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: CURRENCY.VND,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(priceNumber)
      .replace(/\./g, ",");
  }

  if (currency === CURRENCY.USD) {
    const priceNumber =
      typeof price === "string" ? parseFloat(price) : Number(price);

    return Intl.NumberFormat("en-US", {
      style: "currency",
      currency: CURRENCY.USD,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(priceNumber);
  }

  return typeof price === "string" ? price : price.toString();
};
