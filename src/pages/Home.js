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
import { Input } from 'antd';
const { Search } = Input;



const { RangePicker } = DatePicker;

function Home() {

  const [loading, setLoading] = useState(false);
  const [transactionsData, setTransactionsData] = useState([]);
  const [classData, setClassData] = useState([]);
  const [frequency, setFrequency] = useState("0");
  const [type, setType] = useState("all");
  const [selectedRange, setSelectedRange] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [viewType, setViewType] = useState("table");
  const [styleClass,setStyleClass] =useState('filter d-flex justify-content-between  align-items-center')


  const navigate = useNavigate();

  const getClassesTypes = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/classes/listClasses`
      );
      let formatedDatas = [{
        label:'all',
        value:'all'
      }]
      if(response.data){
         response?.data?.data?.map((item)=>{
              formatedDatas.push({
                  label:item?.class_name,
                  value:item?._id,
               })
         })
         setClassData(formatedDatas);
      }
    
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  const getTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/api/schedules/get-all-schedules`,
        {
          frequency,
          ...(frequency === "custom" && { selectedRange }),
          type,
          searchValue
        
        },
      );
      if(response.data){
         const formatedData = response?.data?.map((item)=>{
          const dateStart = moment(item?.dateTimeStartOfClass);
          const dateEnd = moment(item?.dateTimeEndOfClass);
               return {
                  studentName:item?.studentID.fullName,
                  instructorName:item?.instructorID.fullName,
                  className:item?.classID.class_name,
                  dateTimeStartOfClass:item?.dateTimeStartOfClass,
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
    getTransactions();
  }, [frequency, selectedRange, type,searchValue]);
  
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

  ];

  const onSearch = (value, _e, info) =>setSearchValue(value);

  return (
    <DefaultLayout>
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
            <h6>Select Class Types</h6>
            <Select
              defaultValue="all"
              style={{ width: 120 }}
              onChange={(value) => setType(value)}
              options={classData}
            />

          </div>
          <div className="d-flex flex-column mx-0">
            <h6>Instructor Name</h6>
            <Search
              placeholder="search instructor name"
              allowClear
              enterButton="Search"
              size="medium"
              onSearch={onSearch}
            />
          </div>
        </div>
       }

        <div className="d-flex">
       
          <div>
          <h6>Views</h6>
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
            <Table columns={columns} dataSource={transactionsData} />
          </div>
        ) : (
          <Analatics />
        )}
      </div>

    </DefaultLayout>
  );
}

export default Home;
