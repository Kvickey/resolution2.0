import React, { useState } from "react";
import { Form } from "react-bootstrap";
import * as XLSX from "xlsx";
import { headers } from "../utils/headers";
import { kotakheaders } from "../utils/kotakheaders";

const ExcelFileUpload = ({
  onFileChange,
  onErrorFileGenerated,
  onErrorCount,
  bankId,
}) => {
  const [validationErrors, setValidationErrors] = useState([]);

  // console.log(bankId);

  // Function to generate an Excel file from errors
  const generateErrorExcel = (errors) => {
    // Prepare the data for the Excel file
    const errorData = [["Row", "Column", "Message"]]; // Headers for the Excel file
    errors.forEach((error) => {
      errorData.push([
        error.row || "Header",
        error.column || "-",
        error.message,
      ]);
    });

    // Create a new workbook and worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(errorData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Errors");

    // Create a Blob from the workbook and convert it to an Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    console.log("Generated error file with errors:", errors);
    return blob;
  };

  // Function to validate data based on header rules
  const validateData = (headers, data) => {
    const errors = [];

    if (!data || data.length === 0) {
      console.error("No data available for validation.");
      return errors;
    }

    // Validate headers first
    const excelHeaders = Object.keys(data[0]); // First row contains headers from Excel
    // const savedHeaders = headers.map((header) => header.name); // Extract header names from headers.js
    let savedHeaders;

    console.log(bankId);

    if (bankId === "1") {
      savedHeaders = headers.map((header) => header.name); // Extract header names from headers.js when bankid is 1
    } else if (bankId === "2") {
      console.log("Kotak");
      savedHeaders = kotakheaders.map((header) => header.name); // Extract header names from kotakheaders.js when bankid is 2
    }

    console.log(savedHeaders);

    // Strict header match check (checks both content and order)
    if (excelHeaders.length !== savedHeaders.length) {
      errors.push({
        row: 0,
        message: `Header length mismatch! Expected ${savedHeaders.length} columns but got ${excelHeaders.length}.`,
      });
      console.log(
        `Header length mismatch! Expected ${savedHeaders.length} columns but got ${excelHeaders.length}.`
      );
      return errors;
    }

    for (let i = 0; i < savedHeaders.length; i++) {
      if (excelHeaders[i] !== savedHeaders[i]) {
        errors.push({
          row: 0,
          message: `Headers do not match! Expected "${
            savedHeaders[i]
          }" at column ${i + 1}, but got "${excelHeaders[i]}"`,
        });
        console.log(
          `Headers do not match! Expected "${savedHeaders[i]}" at column ${
            i + 1
          }, but got "${excelHeaders[i]}"`
        );
        return errors;
      }
    }

    // Proceed with data validation if headers match
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row) continue;

      savedHeaders.forEach((header) => {
        let cellValue =
          row[header.name] !== undefined && row[header.name] !== null
            ? row[header.name]
            : "";

        if (!header || !header.validations) {
          return;
        }

        let validationFailed = false; // Flag to stop further validation if one fails

        header.validations.forEach((validation) => {
          if (validationFailed) {
            return; // Skip further validation if one validation has already failed
          }

          switch (validation.type) {
            case "notEmpty":
              // console.log(`Validating notEmpty for Row ${i + 1}, Column ${header.name}:`, cellValue);
              if (
                cellValue === undefined ||
                cellValue === null ||
                (typeof cellValue === "string" && cellValue.trim() === "") ||
                cellValue === ""
              ) {
                errors.push({
                  row: i + 1,
                  column: header.name,
                  message: `${header.name} cannot be empty`,
                });
                console.log(
                  `Row ${i + 1}, Column ${header.name}: ${
                    header.name
                  } cannot be empty`
                );
                validationFailed = true; // Set flag to true
                return; // Break out of this validation
              }
              break;
            case "integer":
              if (cellValue && !Number.isInteger(Number(cellValue))) {
                errors.push({
                  row: i + 1,
                  column: header.name,
                  message: `${header.name} must be an integer`,
                });
                console.log(
                  `Row ${i + 1}, Column ${header.name}: ${
                    header.name
                  } must be an integer`
                );
                validationFailed = true; // Set flag to true
                return; // Break out of this validation
              }
              break;
            case "number":
              if (!cellValue || isNaN(Number(cellValue))) {
                errors.push({
                  row: i + 1,
                  column: header.name,
                  message: `${header.name} must be a number`,
                });
                console.log(
                  `Row ${i + 1}, Column ${header.name}: ${
                    header.name
                  } must be a number`
                );
                validationFailed = true; // Set flag to true
                return; // Break out of this validation
              }
              break;
            case "textOnly":
              if (cellValue && !/^[A-Za-z\s&.]*$/.test(cellValue)) {
                errors.push({
                  row: i + 1,
                  column: header.name,
                  message: `${header.name} must contain only text, spaces, and ampersands`,
                });
                console.log(
                  `Row ${i + 1}, Column ${header.name}: ${
                    header.name
                  } must contain only text, spaces, and ampersands`
                );
                validationFailed = true; // Set flag to true
                return; // Break out of this validation
              }
              break;
            case "combOnly":
              if (cellValue && !/^[A-Za-z0-9-]*$/.test(cellValue)) {
                errors.push({
                  row: i + 1,
                  column: header.name,
                  message: `${header.name} must contain only text, number, and hyphen`,
                });
                console.log(
                  `Row ${i + 1}, Column ${header.name}: ${
                    header.name
                  } must contain only text, number, and hyphen`
                );
                validationFailed = true; // Set flag to true
                return; // Break out of this validation
              }
              break;
            case "dateOnly":
              if (typeof cellValue === "string") {
                const parts = cellValue.split("-");
                if (parts.length !== 3) {
                  errors.push({
                    row: i + 1,
                    column: header.name,
                    message: `${header.name} must be a valid date (dd-mm-yyyy)`,
                  });
                  console.log(
                    `Row ${i + 1}, Column ${header.name}: ${
                      header.name
                    } must be a valid date (dd-mm-yyyy)`
                  );
                  validationFailed = true; // Set flag to true
                  return; // Break out of this validation
                }

                const day = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10) - 1;
                const year = parseInt(parts[2], 10);
                const date = new Date(year, month, day);

                if (
                  date.getFullYear() !== year ||
                  date.getMonth() !== month ||
                  date.getDate() !== day
                ) {
                  errors.push({
                    row: i + 1,
                    column: header.name,
                    message: `${header.name} must be a valid date (dd-mm-yyyy)`,
                  });
                  console.log(
                    `Row ${i + 1}, Column ${header.name}: ${
                      header.name
                    } must be a valid date (dd-mm-yyyy)`
                  );
                  validationFailed = true; // Set flag to true
                  return; // Break out of this validation
                }
              } else {
                errors.push({
                  row: i + 1,
                  column: header.name,
                  message: `${header.name} must be a valid date (dd-mm-yyyy)`,
                });
                console.log(
                  `Row ${i + 1}, Column ${header.name}: ${
                    header.name
                  } must be a valid date (dd-mm-yyyy)`
                );
                validationFailed = true; // Set flag to true
                return; // Break out of this validation
              }
              break;
            default:
              break;
          }
        });
      });
    }

    console.log("All errors:", errors);
    return errors;
  };

  // Function to handle file upload and validate data
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      // Validate the data and collect all errors
      const allErrors = validateData(headers, jsonData);
      setValidationErrors(allErrors);

      if (allErrors.length > 0) {
        const errorFile = generateErrorExcel(allErrors);
        onErrorFileGenerated(errorFile); // Send the error Excel file to parent component
        onErrorCount(allErrors.length); // Send the error count to parent component
      } else {
        onFileChange(jsonData); // Pass data to parent if no errors
        onErrorCount(0); // Reset error count if there are no errors
      }
    };

    reader.readAsArrayBuffer(file); // Read the file as a buffer
  };

  return (
    <div>
      <Form.Group>
        <Form.Control
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="custom_input"
        />
      </Form.Group>
    </div>
  );
};

export default ExcelFileUpload;
