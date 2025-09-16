import React, { useEffect, useState } from "react";
import ArbitratorList from "./ArbitratorList";
import AddArbitrator from "./AddArbitrator";
import { API_BASE_URL, API_BASE_URL as url } from "../../utils/constants";

const Arbitrator = () => {
  const [arbitrators, setArbitrators] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(0);

  // ✅ Fetch arbitrators from API once on mount
  useEffect(() => {
    const fetchArbitrators = async () => {
      try {
        const response = await fetch(`${url}/api/arbitrator`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const parsed = Array.isArray(result) ? result : JSON.parse(result);
        setArbitrators(parsed);
      } catch (error) {
        console.error("Error fetching arbitrators:", error);
      }
    };

    fetchArbitrators();
  }, [refreshFlag]);

  // console.log(arbitrators);
  

  // Save or update record
  const handleSave = (data) => {
    if (selectedRecord) {
      // update
      setArbitrators((prev) =>
        prev.map((arb) =>
          arb.id === selectedRecord.id ? { ...data, id: arb.id } : arb
        )
      );
    } else {
      // add new
      const newId = arbitrators.length
        ? arbitrators[arbitrators.length - 1].id + 1
        : 1;
      setArbitrators((prev) => [...prev, { ...data, id: newId }]);
    }
    setShowForm(false);
    setSelectedRecord(null);
    setRefreshFlag((prev) => prev + 1);
  };

  // Delete record
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      console.log(id);
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/DelArb`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Arb_id: id }),
        });
  
        if (response.ok) {
          // Update state only if deletion was successful
          setArbitrators((prev) => prev.filter((arb) => arb.id !== id));
          alert("Arbitrator deleted successfully");
        } else {
          const errorData = await response.json();
          alert("Failed to delete: " + (errorData.message || "Unknown error"));
        }
        setRefreshFlag((prev) => prev + 1);
      } catch (error) {
        console.error("Error deleting arbitrator:", error);
        alert("Something went wrong. Please try again.");
      }
    }
  };
  
  

  return (
    <div className="container mt-4">
      {showForm ? (
        <AddArbitrator
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setSelectedRecord(null);
          }}
          initialData={selectedRecord}
        />
      ) : (
        <ArbitratorList
          arbitrators={arbitrators}
          onAdd={() => {
            setSelectedRecord(null);
            setShowForm(true);
          }}
          onUpdate={(record) => {
            setSelectedRecord(record);
            setShowForm(true);
          }}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Arbitrator;
