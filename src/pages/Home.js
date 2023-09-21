import { DatePicker, message, Select, Table,Button } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import Spinner from "../components/Spinner";
import "../resources/schedules.css";
import {
  UploadOutlined,
  UnorderedListOutlined,
  AreaChartOutlined,
} from "@ant-design/icons";
import moment from "moment";
import Analatics from "../components/Analatics";
import { API_URL } from "../constants/constants";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";




const { RangePicker } = DatePicker;

function Home() {

  const [loading, setLoading] = useState(false);
  const [transactionsData, setTransactionsData] = useState([]);
  const [classData, setClassData] = useState([]);
  const [instructorData, setInstructorData] = useState([]);
  const [frequency, setFrequency] = useState("0");
  const [type, setType] = useState("all");
  const [ins, setIns] = useState("all");
  const [selectedRange, setSelectedRange] = useState([]);
  const [viewType, setViewType] = useState("table");
  const [styleClass,setStyleClass] =useState('filter d-flex justify-content-between  align-items-center')


  const navigate = useNavigate();

  const getClassesTypes = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/classes/fetch-classess-instructor`
      );
      let formatedDatas = [{
        label:'All ',
        value:'all'
      }]
      let formatedDatas_ins = [{
        label:'All',
        value:'all'
      }]
      if(response.data){
         response?.data?.data?.classes?.map((item)=>{
              formatedDatas.push({
                  label:item?.class_name,
                  value:item?._id,
               })
         })
         response?.data?.data?.instructors?.map((item)=>{
          formatedDatas_ins.push({
              label:item?.fullName,
              value:item?._id,
           })
     })
         setClassData(formatedDatas);
         setInstructorData(formatedDatas_ins)
      }
    
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  const getSchedules = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/api/schedules/get-all-schedules`,
        {
          frequency,
          ...(frequency === "custom" && { selectedRange }),
          type,
          ins
        
        },
      );
      if(response.data){

          const formatedData = response?.data?.map((item)=>{

          const dateStart = moment(item?.dateTimeStartOfClass);
          const dateEnd = moment(item?.dateTimeEndOfClass);

               return {
                  key:item?._id,
                  studentName:item?.studentID.fullName,
                  registrationID:item?.registrationID,
                  instructorName:item?.instructorID.fullName,
                  className:item?.classID.class_name,
                  dateTimeStartOfClass:moment(dateStart).format('MMM Do YYYY, h:mm a'),
                  dateTimeEndOfClass:dateEnd.diff(dateStart, 'minutes')

               }
         })
         setTransactionsData(formatedData);
         setLoading(false);
      }
    
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong");
    }
  };

  useEffect(()=>{
    getClassesTypes();
  },[])

  useEffect(() => {
    getSchedules();
    socket.on('connection',() => {
      console.log("Connection SuccessFull")
    })
    socket.on('get-all-schedules',(msg) => {
      //console.log("Message ",msg)
    })
  }, [frequency, selectedRange, type,ins]);
  
  useEffect(()=>{
    if(viewType === 'table')
       setStyleClass('filter d-flex justify-content-between align-items-center' )
    else
       setStyleClass('filter d-flex justify-content-end align-items-center')
  },[viewType])
  const columns = [
    {
      title: "Date",
      dataIndex: "dateTimeStartOfClass",
      render: (text) => <span style={{fontWeight:700,color: '#036868'}}>{text}</span>,
      key: "dateTimeStartOfClass",
    },
    {
      title: "RegistrationID",
      dataIndex: "registrationID",
      key: "registrationID",
    },
    {
      title: "Student",
      dataIndex: "studentName",
      key: "studentName",
    },
   
    {
      title: "Instructor",
      dataIndex: "instructorName",
      key: "instructorName",
    },
    {
      title: "Class Type",
      dataIndex: "className",
      key: "className",
    },
    {
      title: "Duration(minutes)",
      dataIndex: "dateTimeEndOfClass",
      key: "dateTimeEndOfClass",
    },

  ];

  let locale = {
    emptyText: (
      <span>
        <p>
       
<dotlottie-player src="https://lottie.host/b5d91f8b-3e41-43ab-8c4d-c9c1b8358e38/A3ejvPxBZn.json" background="transparent" speed="1" style={{width: 250, height: 250,margin:'auto'}} direction="1" mode="normal" loop autoplay></dotlottie-player>
          No Schedules Found!...
        </p>
       
      </span>
    )
  };

  return (
    <DefaultLayout  height={viewType==='table' ? 'content':'content'}>
      {loading && <Spinner />}
    
      <div className={`${styleClass}`}>
       {viewType === 'table' &&
        <div className="d-flex">
          <div className="d-flex flex-column">
            <h6>Select Frequency</h6>
            <Select value={frequency} onChange={(value) => setFrequency(value)}>
            <Select.Option value="0">All</Select.Option>
              <Select.Option value="7">Last 1 Week</Select.Option>
              <Select.Option value="30">Last 1 Month</Select.Option>
              <Select.Option value="365">Last 1 Year</Select.Option>
              <Select.Option value="custom">Custom</Select.Option>
            </Select>
            {frequency === "custom" && (
              <><div className="mt-2 mb-2">
                <RangePicker
                  allowClear ={false}
                  value={selectedRange}
                  onChange={(values) => setSelectedRange(values)}
                />
              </div>
              </>

            )}
          </div>
          <div className="d-flex flex-column mx-5">
            <h6>Filter By Class</h6>
            <Select
              defaultValue="all"
              style={{ width: 120 }}
              onChange={(value) => setType(value)}
              options={classData}
            />

          </div>
          <div className="d-flex flex-column mx-0">
            <h6>Filter By Instructor</h6>
           
             <Select
              defaultValue="all"
              style={{ width: 120 }}
              onChange={(value) => setIns(value)}
              options={instructorData}
            />
          </div>
         
        </div>
       }

        <div className="d-flex">
       
        <div style={{alignItems: "center",display: "flex"}}>
         
            <div className="view-switch  mx-5" >
              <UnorderedListOutlined
                className={`mx-3 ${
                  viewType === "table" ? "active-icon" : "inactive-icon"
                } `}
                onClick={() => setViewType("table")}
                size={30}
          
              />
              <AreaChartOutlined
                className={`${
                  viewType === "analytics" ? "active-icon" : "inactive-icon"
                } `}
                onClick={() => setViewType("analytics")}
                size={30}
               
              />
            </div>
          </div>
          <Button  className="primary" type="primary"   onClick={() => navigate('/upload')} icon={<UploadOutlined />} size={'large'}>
          UPLOAD CSV
          </Button>
        </div>
      </div>

      <div className="table-analtics table-responsive">
      
        {viewType === "table" ? (
          <div className="table">
            <h4  style={{marginBottom:20,marginTop:20}}>Class Shedules</h4>
            <Table locale={locale}  columns={columns} dataSource={transactionsData} />
          </div>
        ) : (
          <Analatics />
        )}
      </div>

    </DefaultLayout>
  );
}

export default Home;
