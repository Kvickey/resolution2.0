// // Format date to MM-DD-YYYY
// export const formatDate = (date) => {
//   if (!date) return "";

//   const parsedDate = new Date(date); // Convert to Date object

//   if (isNaN(parsedDate)) return ""; // Check if the date is invalid

//   const day = String(parsedDate.getDate()).padStart(2, "0");
//   const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
//   const year = parsedDate.getFullYear();

//   return `${month}-${day}-${year}`;
// };

// Format date to MM/DD/YYYY
export const formatDate = (date) => {
  if (!date) return "";

  let parsedDate;

  // 🧠 Handle Excel serial numbers
  if (typeof date === "number") {
    parsedDate = new Date(Math.round((date - 25569) * 86400 * 1000));
  } else {
    parsedDate = new Date(date);
  }

  if (isNaN(parsedDate)) return ""; // Invalid date check

  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");
  const year = parsedDate.getFullYear();

  return `${month}/${day}/${year}`;
};


