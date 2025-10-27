import React, { useState } from "react";
import ExcelFileUpload from "../../components/ExcelFileUpload";

const GenerateAward = () => {
  const [excelData, setExcelData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
   const [isDataPresent, setIsDataPresent] = useState(false);

  // Excel Data
  const [errorResponses, setErrorResponses] = useState([]);
  const [errorExcelBlob, setErrorExcelBlob] = useState(null);
  const [errorCount, setErrorCount] = useState(0);
  const [validationErrors, setValidationErrors] = useState([]);

  const handleFileChange = (data) => {
    const updatedData = data.map(({ SR_NO, ...rest }) => rest);
    setExcelData(updatedData);
    setTotalRecords(updatedData.length);
    // setActiveStep(1);
  };

  console.log(excelData);

  const handleErrorFileGenerated = (errorFile) => setErrorExcelBlob(errorFile);
  const handleErrorCount = (count) => setErrorCount(count);

  return (
    <div className="container">
      <div className="row">
        <ExcelFileUpload
          onFileChange={handleFileChange}
          onErrorFileGenerated={handleErrorFileGenerated}
          onErrorCount={handleErrorCount}
          setIsDataPresent={setIsDataPresent}
          validationErrors={validationErrors}
          setValidationErrors={setValidationErrors}
        />
      </div>
    </div>
  );
};

export default GenerateAward;
