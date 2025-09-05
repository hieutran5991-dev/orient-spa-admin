export const formatDateForDisplay = (date: Date, includeTime: boolean = false, startOfDay: boolean = true): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const time = includeTime ? (startOfDay ? ' 00:00:00' : ' 23:59:59') : '';
  return `${year}-${month}-${day}` + time;
};

export const createStartOfDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

export const createEndOfDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
};