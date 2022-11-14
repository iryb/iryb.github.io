export const formatDate = (date) => {
  return date ? date.toDate().toLocaleString() : '';
}

export const formatDateShort = (date) => {
  const options = { day: 'numeric', month: 'short' };

  if (typeof date === 'string') {
    let dateLong = new Date(date);
    return dateLong ? dateLong.toLocaleString('en-US', options) : '';
  }

  return date ? date.toLocaleString('en-US', options) : '';
}