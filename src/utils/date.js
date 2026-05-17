export const formatDate = (dateStr) => {
  if (!dateStr) return "";

  const [year, month, day] = dateStr.split("-");
  if (!year || !month || !day) return dateStr;

  return `${day}/${month}/${year}`;
};

export const getPeriod = ({ startDate, endDate } = {}) => {
  const start = formatDate(startDate);
  const end = endDate ? formatDate(endDate) : "Atual";

  if (!start) return "";

  return `${start} - ${end}`;
};
