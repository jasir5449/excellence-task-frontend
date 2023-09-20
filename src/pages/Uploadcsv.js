import { message, Table } from "antd";
import React, { useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import Spinner from "../components/Spinner";
import "../resources/schedules.css";
import moment from "moment";
import { API_URL } from "../constants/constants";

import { InboxOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
const { Dragger } = Upload;


function Uploadcsv() {
  const [loading, setLoading] = useState(false);
  const [uploadedData, setUploadedData] = useState([]);
  const [isUploading, setIsUploading] =useState(false);
  const [showupload, setShowupload] = useState(false);


  const props = {
    accept:'.csv',
    name: 'file',
    multiple: false,
    action: `${API_URL}/api/schedules/addRegistrations`,
    beforeUpload:()=>{setIsUploading(true);return true;},
    async onChange(info) {
      setShowupload(true)
      const { status } = info.file;
      console.log(status)
      if (status !== 'uploading') {
         console.log('uploading');
       }
      if (status === 'done') {
        console.log("done===",info.file.response);
        message.success(`${info.file.name} file uploaded successfully.`);
        setIsUploading(false)
        setShowupload(false)
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
 
  };


const columns = [
    {
      title: "Date",
      dataIndex: "dateTimeStartOfClass",
      render: (text) => <span>{moment(text).format("YYYY-MM-DD HH:mm")}</span>,
    },
    {
      title: "Student",
      dataIndex: "studentName",
    },
    {
      title: "Instructor",
      dataIndex: "instructorName",
    },
    {
      title: "Class Type",
      dataIndex: "className",
    },
    {
      title: "Duration(minutes)",
      dataIndex: "dateTimeEndOfClass",
    },
    {
        title: "Error Msg",
        dataIndex: "error",
      },

  ];


  return (
    <DefaultLayout>
      {loading && <Spinner />}
      <div style={{marginBottom:20}}>
           <Dragger {...props} showUploadList={showupload} >
         {isUploading ?<p className="ant-upload-drag-icon">
           Loading....
          </p>: <p className="ant-upload-drag-icon">
            <InboxOutlined color='#008282' style={{color:'#008282'}} />
          </p>
         }
          <p className="ant-upload-text">Click here upload CSV file</p>
          <p className="ant-upload-hint">
            Support for a single csv upload (accept only .csv file). Strictly prohibited from uploading company data or other
            banned files.
          </p>
          </Dragger>
      </div>
 
 
      <div className="table-analtics table-responsive">
          <div className="table">
            <Table columns={columns} dataSource={uploadedData} />
          </div>
      </div>

    </DefaultLayout>
  );
}

export default Uploadcsv;
