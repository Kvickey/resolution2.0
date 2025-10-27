import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import * as XLSX from 'xlsx';
import { headers } from '../utils/headers'; // your headers with validation rules

const ExcelFileUpload = ({
  onFileChange,
  onErrorFileGenerated,
  onErrorCount,
  bankId,
  selectedProductID,
  setIsDataPresent,
  validationErrors,
  setValidationErrors,
}) => {
  // Generates an Excel file containing validation errors for user download
  const generateErrorExcel = (errors) => {
    const errorData = [['Row', 'Column', 'Message']];
    errors.forEach(({ row, column, message }) => {
      errorData.push([row, column || '-', message]);
    });
    const worksheet = XLSX.utils.aoa_to_sheet(errorData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Errors');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return new Blob([excelBuffer], { type: 'application/octet-stream' });
  };

  // Converts date from dd-mm-yyyy to mm-dd-yyyy for correct JS Date parsing
  const convertToMMDDYYYY = (dateStr) => {
    if (!dateStr) return dateStr;
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const [dd, mm, yyyy] = parts;
      return `${mm}-${dd}-${yyyy}`;
    }
    return dateStr;
  };

  // Validates that the Excel file headers exactly match expected headers
  const validateHeaders = (excelHeaders, expectedHeaders) => {
    const errors = [];
    if (excelHeaders.length !== expectedHeaders.length) {
      errors.push({
        row: 0,
        message: `Header length mismatch! Expected ${expectedHeaders.length} columns but got ${excelHeaders.length}.`,
      });
      return errors;
    }
    for (let i = 0; i < expectedHeaders.length; i++) {
      if (excelHeaders[i] !== expectedHeaders[i]) {
        errors.push({
          row: 0,
          message: `Headers do not match! Expected '${expectedHeaders[i]}' at column ${i + 1}, but got '${excelHeaders[i]}'`,
        });
      }
    }
    return errors;
  };

  // Validates the data rows based on the validations specified for each header
  const validateData = (data, savedHeaders) => {
    const errors = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row) continue;
      savedHeaders.forEach((header) => {
        const headerDef = headers.find((h) => h.name === header);
        if (!headerDef || !headerDef.validations) return;
        let cellValue = row[header];
        if (typeof cellValue === 'string') cellValue = cellValue.trim();
        let validationFailed = false;
        for (const validation of headerDef.validations) {
          if (validationFailed) break;
          switch (validation.type) {
            case 'notEmpty':
              if (!cellValue || cellValue === '') {
                errors.push({ row: i + 1, column: header, message: validation.message });
                validationFailed = true;
              }
              break;
            case 'integer':
              if (cellValue && !Number.isInteger(Number(cellValue))) {
                errors.push({ row: i + 1, column: header, message: validation.message });
                validationFailed = true;
              }
              break;
            case 'number':
              if (cellValue && isNaN(Number(cellValue))) {
                errors.push({ row: i + 1, column: header, message: validation.message });
                validationFailed = true;
              }
              break;
            case 'textOnly':
              if (cellValue && !/^[A-Za-z\s&]+$/.test(cellValue)) {
                errors.push({ row: i + 1, column: header, message: validation.message });
                validationFailed = true;
              }
              break;
            case 'combOnly':
              if (cellValue && !/^[A-Za-z0-9\-]+$/.test(cellValue)) {
                errors.push({ row: i + 1, column: header, message: validation.message });
                validationFailed = true;
              }
              break;
            case 'dateOnly':
              if (cellValue && typeof cellValue === 'string') {
                const parts = cellValue.split('-');
                if (parts.length !== 3) {
                  errors.push({ row: i + 1, column: header, message: validation.message });
                  validationFailed = true;
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
                  errors.push({ row: i + 1, column: header, message: validation.message });
                  validationFailed = true;
                }
              } else {
                errors.push({ row: i + 1, column: header, message: validation.message });
                validationFailed = true;
              }
              break;
          }
        }
      });
    }
    return errors;
  };

  // Main file upload handler that triggers all validations
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array', cellDates: true, dateNF: 'dd-mm-yyyy' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      let jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });

      // Optional: convert date fields for consistent parsing
      jsonData = jsonData.map((row) => ({
        ...row,
        LRN_date: convertToMMDDYYYY(row.LRN_date),
        Ref_date: convertToMMDDYYYY(row.Ref_date),
        FCR_DATE: convertToMMDDYYYY(row.FCR_DATE),
        LOC_Date: convertToMMDDYYYY(row.LOC_Date),
        // Add more date fields here as required
      }));

      if (jsonData.length === 0) {
        setIsDataPresent(false);
        setValidationErrors([]);
        onErrorCount(0);
        return;
      }
      setIsDataPresent(true);

      const excelHeaders = Object.keys(jsonData[0]);
      const expectedHeaders = headers.map((h) => h.name);

      // Validate headers
      const headerErrors = validateHeaders(excelHeaders, expectedHeaders);
      if (headerErrors.length > 0) {
        setValidationErrors(headerErrors);
        onErrorCount(headerErrors.length);
        onErrorFileGenerated(generateErrorExcel(headerErrors));
        return;
      }

      // Validate data rows
      const dataErrors = validateData(jsonData, expectedHeaders);
      setValidationErrors(dataErrors);

      if (dataErrors.length > 0) {
        onErrorCount(dataErrors.length);
        onErrorFileGenerated(generateErrorExcel(dataErrors));
        return;
      }

      // If no errors, pass data for further processing
      onErrorCount(0);
      onFileChange(jsonData);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <Form.Group>
      <Form.Control
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="custom-input"
        style={{ fontSize: '12px' }}
      />
    </Form.Group>
  );
};

export default ExcelFileUpload;
