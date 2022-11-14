export const formatDate = (date) => {
  return date ? date.toDate().toLocaleString() : '';
}