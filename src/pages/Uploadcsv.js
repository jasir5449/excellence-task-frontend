import { message, Table ,Tag} from "antd";
import React, { useState, useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import Spinner from "../components/Spinner";
import "../resources/schedules.css";
import moment from "moment";
import { API_URL } from "../constants/constants";

import { InboxOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import { socket } from "../socket";
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
    beforeUpload:()=>{setIsUploading(true); setUploadedData([]);return true;},
    async onChange(info) {
      setShowupload(true)
      const { status } = info.file;
      console.log(status)
      if (status !== 'uploading') {
         console.log('uploading');
       }
      if (status === 'done') {
        console.log("done===",info.file.response);
        if(info.file.response){
            //setUploadedData([])
        // const formatedData = info?.file?.response.data?.map((item,index)=>{
        //          return {
        //             key:index,
        //             studentID:item?.studentID,
        //             registrationID:item?.registrationID,
        //             instructorID:item?.instructorID,
        //             classID:item?.classID,
        //             dateTimeStartOfClass:item?.dateTimeStartOfClass,
        //             action:item?.action,
        //             status:item?.status,
  
        //          }
        //    })
        //    setUploadedData(formatedData);
        } 
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
      title: "RegistrationID",
      dataIndex: "registrationID",
    },
   
    {
      title: "StudentID",
      dataIndex: "studentID",
    },
    {
      title: "InstructorID",
      dataIndex: "instructorID",
    },

    {
      title: "ClassID",
      dataIndex: "classID",
    },
    {
        title: "Date",
        dataIndex: "dateTimeStartOfClass",
        render: (text) => <span style={{fontWeight:500,color: '#036868'}}>{text == 'Invalid date' ? '': moment(text).format('YYYY-MM-DD HH:mm')}</span>,
    },
    {
      title: "Action",
      dataIndex: "action",
    },
    {
        title: "Message",
        dataIndex: "status",
        render(status, record) {
            console.log(status,record)
            let colorcode='';
              if(status.code == 1005) {
                colorcode = 'success';
              }
              else if(status.code == 1006){
                colorcode = 'success';
              }
              else if(status.code == 1007){
                colorcode = 'success';
              }
              else{
                colorcode = 'error';
              }
            
            return  <Tag color={colorcode}>{status?.message?.toUpperCase()}</Tag> 
          },
      },

  ];

  useEffect(() => {
    socket.on('upload-response',(msg) => {
        //console.log("msg",msg.dateTimeStartOfClass)
        const dateStart =  moment(msg.dateTimeStartOfClass);
        setUploadedData((prevState) => {
            msg['key'] = prevState.length + 1;
            msg['dateTimeStartOfClass'] = moment(msg.dateTimeStartOfClass, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD[T]HH:mm:ss')
            return [
                ...prevState,
                msg   
            ]
        })
    })
  },[])

console.log("uploaded Data ",uploadedData)

let locale = {
    emptyText: (
      <span>
        <p>
       
<dotlottie-player src="https://lottie.host/b5d91f8b-3e41-43ab-8c4d-c9c1b8358e38/A3ejvPxBZn.json" background="transparent" speed="1" style={{width: 250, height: 250,margin:'auto'}} direction="1" mode="normal" loop autoplay></dotlottie-player>
          No data uploaded!....
        </p>
       
      </span>
    )
  };

  return (
    <DefaultLayout>
      {loading && <Spinner />}
      <div style={{marginBottom:20}}>
           <Dragger {...props} showUploadList={showupload} disabled={showupload}  maxCount={1}>
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
            <Table  locale={locale}  columns={columns} dataSource={uploadedData} />
          </div>
      </div>

    </DefaultLayout>
  );
}

export default Uploadcsv;
