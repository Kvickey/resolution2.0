import React, { useEffect, useState } from "react";
import { useAuth } from "../../components/AuthProvider";
import { API_BASE_URL } from "../../utils/constants";

const ZoomMeetList = () => {
  const [arbId, setArbId] = useState("");
  const { user, logout } = useAuth();
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    // console.log(user);
    setArbId(user[0].Ref_id);
  }, [user]);

  //   console.log(arbId);

  useEffect(() => {
    const fetchMeetings = async () => {
      if (!arbId) return;
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/Meetings?Arb_id=${arbId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const parsedMeetings = Array.isArray(result)
          ? result
          : JSON.parse(result); // Ensure parsedArbitrators is an array
        setMeetings(parsedMeetings);
      } catch (error) {
        // setError1(error.message);
      }
    };

    fetchMeetings();
  }, [arbId]);

  console.log(meetings);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);

//   const totalItems = getData.length;
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const currentItems = getData.slice(startIndex, startIndex + itemsPerPage);
//   const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return <div>ZoomMeetList</div>;
};

export default ZoomMeetList;
