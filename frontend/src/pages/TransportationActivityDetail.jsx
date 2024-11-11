import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import TransportationActivityContainer from '../components/transportationActivityContainer';
import { useTransportationActivityStore } from '../store/transportationActivity.js';
import { FiLoader } from "react-icons/fi";



function TransportationActivityDetail() { // Updated to PascalCase
  const { id } = useParams();  
  const { transportationActivities, getTransportationActivities } = useTransportationActivityStore();
  const navigate = useNavigate();

  useEffect(() => {
      if (!id) {
          navigate("/");
      } else {
          getTransportationActivities({ _id: id });
      }
  }, [id, getTransportationActivities, navigate]);

  if (!transportationActivities[0]) {
      return <FiLoader size={50} className="animate-spin mx-auto mt-[49vh]" />;
  }

  return (
      <div>
          <h1>Transportation Activity Detail</h1>
          <TransportationActivityContainer activity={transportationActivities[0]} />
      </div>
  );
}

export default TransportationActivityDetail;