import React, { useEffect, useState } from "react";
import { API_BASE_URL as url } from "../utils/constants";
import LoadingSpinner from "../components/LoadingSpinner";
import ReusableTable from "../components/ReusableTable";

const CaseTrackingLotWise = () => {
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [lotData, setLotData] = useState([]);
  const [currentPage2, setCurrentPage2] = useState(1);
  const [formData, setFormData] = useState({
    Client_id: "",
    Product_id: "",
    Lot_no: "",
  });

  const fetchData = async (endpoint) => {
    try {
      const response = await fetch(url + "/api/" + endpoint);
      const result = await response.json();
      const data = Array.isArray(result) ? result : JSON.parse(result);
      if (data) return data;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }

    return [];
  };
  useEffect(() => {
    const getClients = async () => {
      const data = await fetchData("Client");
      setClients(data);
    };
    getClients();
  }, []);
  useEffect(() => {
    if (formData.Client_id) {
      const getProducts = async () => {
        const data = await fetchData(
          "products?client_id=" + formData.Client_id
        );
        setProducts(data);
      };
      getProducts();
    }
  }, [formData.Client_id]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    setFormData((preValue) => ({ ...preValue, [name]: value }));
  };
  const inputValidation = () => {
    if (
      formData.Client_id === "" ||
      formData.Product_id === "" ||
      formData.Lot_no === ""
    )
      return false;
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputValidation()) {
      const data = await fetchData("Lot?Lot_no=" + formData.Lot_no);
      setLotData(data);
    }
  };


  // Table Logic
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage2 * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems2 = lotData.slice(indexOfFirstItem, indexOfLastItem);

  // calculate total page numbers
  const pageNumbers2 = Array.from(
    { length: Math.ceil(tableData.length / itemsPerPage) },
    (_, i) => i + 1
  );

  if (loading) return <LoadingSpinner />;
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="row my-2 gap-4 px-md-3">
          <div className="col-md col-12">
            <select
              class="form-select custom_input"
              aria-label="Default select example"
              value={formData.Client_id}
              name="Client_id"
              onChange={handleChange}
            >
              <option value="">Choose a Bank</option>
              {clients &&
                clients.map((item) => (
                  <option value={item.Client_id} key={item.Client_id}>
                    {item.client_name}
                  </option>
                ))}
            </select>
          </div>
          <div className="col-md col-12">
            <select
              class="form-select custom_input"
              aria-label="Default select example"
              value={formData.Product_id}
              name="Product_id"
              onChange={handleChange}
            >
              <option value="">Choose a Product</option>
              {products &&
                products.map((item) => (
                  <option value={item.Product_id} key={item.Product_id}>
                    {item.Product_name}
                  </option>
                ))}
            </select>
          </div>
          <div className="col-md col-12">
            <input
              type="number"
              className="form-control custom_input"
              placeholder="Enter Lot Number..."
              name="Lot_no"
              value={formData.Lot_no}
              onChange={(e)=> e.target.value > 0 && handleChange(e)}
            />
          </div>
          <div className="col-md col-12 text-center text-md-start">
            <button className="custBtn text-nowrap">Show Data</button>
          </div>
        </div>
      </form>
      {lotData.length !== 0 && (
        <div className="row">
          <div className="col-md-12">
            <ReusableTable
              data={currentItems2}
              currentPage={currentPage2}
              pageNumbers={pageNumbers2}
              setCurrentPage={setCurrentPage2}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseTrackingLotWise;