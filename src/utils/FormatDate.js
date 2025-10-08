// Format date to MM-DD-YYYY
export const formatDate = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date); // Convert to Date object

  if (isNaN(parsedDate)) return ""; // Check if the date is invalid

  const day = String(parsedDate.getDate()).padStart(2, "0");
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const year = parsedDate.getFullYear();

  return `${month}-${day}-${year}`;
};

