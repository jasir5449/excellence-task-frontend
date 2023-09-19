import React from "react";
import "../resources/analatics.css";
import LineChart from "./LineChart";

function Analatics({ schedules }) {

  const chartData = {
    labels: ["2023-09-01", "2023-09-02", "2023-09-03", "2023-09-04"],
    values: [5, 8, 6, 10],
  };

  const totalSchedules = schedules?.length;


  return (
    <div className="analytics">
      <div className="row">
      </div>
       <hr />
      <div className="row">
        <div className="col-md-12">
          <div className="category-analysis">
            <h4>Line Chart</h4>
          <LineChart data={chartData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analatics;
