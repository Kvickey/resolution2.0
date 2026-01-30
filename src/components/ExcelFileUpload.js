import React from 'react';
import Form from 'react-bootstrap/Form';
import * as XLSX from 'xlsx';
import { headers } from '../utils/headers';
import { blheaders } from '../utils/blheaders';
import { plheaders } from '../utils/plheaders';

const ExcelFileUpload = ({
  onFileChange,
  onErrorFileGenerated,
  onErrorCount,
  selectedProductID,
  setIsDataPresent,
  setValidationErrors,
}) => {

  const PRODUCT_HEADERS_MAP = {
    1: headers,
    4: blheaders,
    // 3: plheaders,
  };

  const resolvedHeaders = React.useMemo(() => {
    return PRODUCT_HEADERS_MAP[selectedProductID] || [];
  }, [selectedProductID]);

  // ---------------- ERROR EXCEL ----------------
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

  // ---------------- DATE CONVERSION ----------------
  const convertToMMDDYYYY = (dateStr) => {
    if (!dateStr) return dateStr;
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const [dd, mm, yyyy] = parts;
      return `${mm}-${dd}-${yyyy}`;
    }
    return dateStr;
  };

  // ---------------- HEADER VALIDATION ----------------
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

  // ---------------- DATA VALIDATION (FIXED) ----------------
  const validateData = (data, expectedHeaders, resolvedHeaders) => {
    const errors = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (!row) continue;

      expectedHeaders.forEach((header) => {
        const headerDef = resolvedHeaders.find((h) => h.name === header);
        if (!headerDef || !headerDef.validations) return;

        let cellValue = row[header];
        if (typeof cellValue === 'string') cellValue = cellValue.trim();

        for (const validation of headerDef.validations) {
          switch (validation.type) {
            case 'notEmpty':
              if (!cellValue) {
                errors.push({ row: i + 2, column: header, message: validation.message });
                return;
              }
              break;

            case 'integer':
              if (cellValue && !Number.isInteger(Number(cellValue))) {
                errors.push({ row: i + 2, column: header, message: validation.message });
                return;
              }
              break;

            case 'number':
              if (cellValue && isNaN(Number(cellValue))) {
                errors.push({ row: i + 2, column: header, message: validation.message });
                return;
              }
              break;

            case 'textOnly':
              if (cellValue && !/^[A-Za-z\s&]+$/.test(cellValue)) {
                errors.push({ row: i + 2, column: header, message: validation.message });
                return;
              }
              break;

            case 'combOnly':
              if (cellValue && !/^[A-Za-z0-9\-]+$/.test(cellValue)) {
                errors.push({ row: i + 2, column: header, message: validation.message });
                return;
              }
              break;

            case 'dateOnly':
              if (!cellValue || typeof cellValue !== 'string') {
                errors.push({ row: i + 2, column: header, message: validation.message });
                return;
              }

              const parts = cellValue.split('-');
              if (parts.length !== 3) {
                errors.push({ row: i + 2, column: header, message: validation.message });
                return;
              }

              const [dd, mm, yyyy] = parts.map(Number);
              const date = new Date(yyyy, mm - 1, dd);

              if (
                date.getFullYear() !== yyyy ||
                date.getMonth() !== mm - 1 ||
                date.getDate() !== dd
              ) {
                errors.push({ row: i + 2, column: header, message: validation.message });
              }
              break;
          }
        }
      });
    }
    return errors;
  };

  // ---------------- FILE UPLOAD ----------------
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array', raw: false });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      let jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '' });

      jsonData = jsonData.map((row) => ({
        ...row,
        LRN_date: convertToMMDDYYYY(row.LRN_date),
        Ref_date: convertToMMDDYYYY(row.Ref_date),
        FCR_DATE: convertToMMDDYYYY(row.FCR_DATE),
        LOC_Date: convertToMMDDYYYY(row.LOC_Date),
      }));

      if (jsonData.length === 0) {
        setIsDataPresent(false);
        setValidationErrors([]);
        onErrorCount(0);
        return;
      }

      setIsDataPresent(true);

      const excelHeaders = Object.keys(jsonData[0]);
      const expectedHeaders = resolvedHeaders.map((h) => h.name);

      const headerErrors = validateHeaders(excelHeaders, expectedHeaders);
      if (headerErrors.length) {
        setValidationErrors(headerErrors);
        onErrorCount(headerErrors.length);
        onErrorFileGenerated(generateErrorExcel(headerErrors));
        return;
      }

      const dataErrors = validateData(jsonData, expectedHeaders, resolvedHeaders);
      if (dataErrors.length) {
        setValidationErrors(dataErrors);
        onErrorCount(dataErrors.length);
        onErrorFileGenerated(generateErrorExcel(dataErrors));
        return;
      }

      onErrorCount(0);
      onFileChange(jsonData);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <Form.Group>
      <Form.Control
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        style={{ fontSize: '12px' }}
      />
    </Form.Group>
  );
};

export default ExcelFileUpload;
