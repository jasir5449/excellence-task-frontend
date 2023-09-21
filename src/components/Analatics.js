import React, { useEffect, useState } from "react";
import "../resources/analatics.css";
import LineChart from "./LineChart";
import axios from "axios";
import { API_URL } from "../constants/constants";
import { message } from "antd";

function Analatics() {

  const [chartDatas,setChartdata] = useState({labels:[],values:[]})


  const getScheduleForGraph = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/schedules/get-graph-data`
      );
      if(response.data){
        setChartdata({
          labels: response?.data?.data?.map((item)=>item?._id),
          values: response?.data?.data?.map((item)=>item?.count),
        })
      }
    
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  useEffect(()=>{
    getScheduleForGraph();
  },[])

  return (
    <div className="analytics">
      <div className="row">
      </div>
       <hr />
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="category-analysis">
            <h4>Line Chart</h4>
          <LineChart data={chartDatas} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analatics;
