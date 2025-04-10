import { useState } from 'react';
import { toast } from 'react-toastify';

const API_BASE_URL = 'your_api_base_url'; // replace with your actual API base URL

const useMailHandler = () => {
  const [loading, setLoading] = useState(false);
  const [mailDone, setMailDone] = useState(false);

  const handleMail = async (data) => {
    const dataForMail = data.map((item) => ({
      Client_id: item.Client_id,
      Product_id: item.product_id,
      Ref_no: item.REFERENCE_NO,
      Service_add: item.E_MAIL_ID,
      Service_type_id: 3,
      Process_id: 1,
      Case_id: item.Case_id,
    }));
    console.log(dataForMail);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/Services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ case: dataForMail }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to upload data: ${response.status} ${response.statusText} - ${errorText}`
        );
      }
      const result = await response.json();
      console.log('Upload response:', result);
      setMailDone(true);
      toast.success('Mail Sent Successfully', {
        position: toast.POSITION.BOTTOM_RIGHT,
        theme: 'colored',
      });
    } catch (error) {
      console.error('Error uploading data:', error);
      toast.error('Error sending mail. Please try again.', {
        position: toast.POSITION.BOTTOM_RIGHT,
        theme: 'colored',
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, mailDone, handleMail };
};

export default useMailHandler;
