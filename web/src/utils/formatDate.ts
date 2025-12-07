export const formatDate = (
  date: string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
) => {
  return new Date(date).toLocaleDateString("en-US", options);
};
