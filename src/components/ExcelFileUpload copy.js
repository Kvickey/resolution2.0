import React, { useState } from "react";
import { Form } from "react-bootstrap";
import * as XLSX from "xlsx";
import { headers } from "../utils/headers"; // Assuming headers.js exports an array of header objects

const ExcelFileUpload = ({ onFileChange }) => {
  const [validationErrors, setValidationErrors] = useState([]);

  // Function to validate data based on header rules
  const validateData = (headers, data) => {
    const errors = [];

    if (!data || data.length === 0) {
      console.error("No data available for validation.");
      return errors;
    }

    // Validate headers first
    const excelHeaders = data[0]; // First row contains headers from Excel
    const savedHeaders = headers.map((header) => header.name); // Extract header names from headers.js

    // Strict header match check (checks both content and order)
    if (excelHeaders.length !== savedHeaders.length) {
      errors.push({
        row: 0,
        message: `Header length mismatch! Expected ${savedHeaders.length} columns but got ${excelHeaders.length}.`,
      });
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
        return errors;
      }
    }

    // Proceed with data validation if headers match
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row) continue;

      headers.forEach((header, index) => {
        let cellValue =
          row[index] !== undefined && row[index] !== null ? row[index] : "";

        if (cellValue === undefined || cellValue === null || cellValue === "") {
          cellValue = "-"; // or use "-" based on your preference
        }

        if (!header || !header.validations) {
          return;
        }

        header.validations.forEach((validation) => {
          switch (validation.type) {
            case "notEmpty":
              if (
                !cellValue ||
                (typeof cellValue === "string" && cellValue.trim() === "")
              ) {
                errors.push({
                  row: i + 1,
                  column: index + 1,
                  message: `${header.name} cannot be empty`,
                });
              }
              break;
            case "integer":
              if (cellValue && !Number.isInteger(Number(cellValue))) {
                errors.push({
                  row: i + 1,
                  column: index + 1,
                  message: `${header.name} must be an integer`,
                });
              }
              break;
            case "number":
              if (!cellValue || isNaN(Number(cellValue))) {
                errors.push({
                  row: i + 1,
                  column: index + 1,
                  message: `${header.name} must be a number`,
                });
              }
              break;
            case "textOnly":
              if (cellValue && !/^[A-Za-z\s&.]*$/.test(cellValue)) {
                errors.push({
                  row: i + 1,
                  column: index + 1,
                  message: `${header.name} must contain only text, spaces, and ampersands`,
                });
              }
              break;
            case "dateOnly":
              if (typeof cellValue === "string") {
                const parts = cellValue.split("-");
                if (parts.length !== 3) {
                  errors.push({
                    row: i + 1,
                    column: index + 1,
                    message: `${header.name} must be a valid date (dd-mm-yyyy)`,
                  });
                  break;
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
                    column: index + 1,
                    message: `${header.name} must be a valid date (dd-mm-yyyy)`,
                  });
                }
              } else {
                errors.push({
                  row: i + 1,
                  column: index + 1,
                  message: `${header.name} must be a valid date (dd-mm-yyyy)`,
                });
              }
              break;
            default:
              break;
          }
        });
      });
    }

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
      const jsonData = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        defval: "",
      });

      // Validate the data and collect all errors
      const allErrors = validateData(headers, jsonData);
      setValidationErrors(allErrors);

      if (allErrors.length === 0) {
        onFileChange(jsonData); // Pass data to parent if no errors
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

      {validationErrors.length > 0 && (
        <div className="validation-errors">
          <h5>Validation Errors:</h5>
          {validationErrors.map((error, index) => (
            <div key={index}>
              {error.row !== 0 && (
                <h6>
                  Row {error.row} Column {error.column}:
                </h6>
              )}
              <p>{error.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExcelFileUpload;
