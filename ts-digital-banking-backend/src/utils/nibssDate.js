
const toNibssDate = (date) => {
  if (!date) return date;

  const d = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(d.getTime())) {
    return date;
  }

  return d.toISOString().split("T")[0];
};

module.exports = {
  toNibssDate,
};
