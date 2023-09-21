import React, { useEffect, useState } from 'react'
import DefaultLayout from '../components/DefaultLayout'
import { Button, Checkbox, Form, Input, message } from 'antd';
import axios from 'axios';
import { API_URL } from '../constants/constants';
import Spinner from '../components/Spinner';



const Settings = () => {

    const [form1] = Form.useForm();
    const [updateID, setUpdateID] = useState();
    const [loading, setLoading] = useState(false);
    const [addorupdate, setAddorUpdate] = useState(false);
    const [componentDisabled, setComponentDisabled] = useState(true);


    const getSettings = async () => {
        try {
          setLoading(true)
          const response = await axios.get(
            `${API_URL}/api/settings/get-config-data`
          );
          if(response.data){
             if(response?.data?.message === 'not_found'){
                setAddorUpdate(false)
                setLoading(false)
              }
             else{
                    setAddorUpdate(true)
                    setUpdateID(response?.data?.data?._id)
                    setLoading(false)
                    form1.setFieldsValue({
                        student_max_class_day:response?.data?.data?.student_max_class_day,
                        instructor_max_class_day:response?.data?.data?.instructor_max_class_day,
                        class_duration:response?.data?.data?.class_duration,
                        classtype_max_class_day:response?.data?.data?.classtype_max_class_day
                    })
             }
          }
        
        } catch (error) {
            setLoading(false)
          message.error("Something went wrong");
        }
      };


    useEffect(()=>{
        getSettings();
      },[])

    const onFinish = async (values) => {
        try {
            setLoading(true)
           if(!addorupdate){
            const response = await axios.post(
              `${API_URL}/api/settings/add-config-data`,{
                ...values,
              }, 
            );
            if(response.data){
               console.log(response.data)
               setLoading(false)
               message.success("Config Settings Addedd");
            }
            else{
                setLoading(false)
                message.error("Something went wrong!...");
            }
          }
          else{
                const response = await axios.put(
                  `${API_URL}/api/settings/update-config-data`,  {  
                   payload : {
                    ...values,
                    },
                   configID: updateID,
                 }
                );
                if(response.data){
                    if(response?.data?.message === 'not_found'){
                        setAddorUpdate(false)
                        setLoading(false)
                      }
                     else{
                            setAddorUpdate(true)
                            form1.setFieldsValue({
                                student_max_class_day:response?.data?.data?.student_max_class_day,
                                instructor_max_class_day:response?.data?.data?.instructor_max_class_day,
                                class_duration:response?.data?.data?.class_duration,
                                classtype_max_class_day:response?.data?.data?.classtype_max_class_day
                            })
                            setLoading(false)
                            message.success(" Settings Updated Succesfully");    
                     }
                }
              
          }

          
          } catch (error) {
            setLoading(false)
            message.error("Something went wrong");
          }
    };   
  

return (
<DefaultLayout height={'new-content'}>
{loading && <Spinner />}
   <div className="analytics">
      <div className="row">
        <div className="col-md-12">
          <div className="category-analysis">
    
            <h4>Configration Settings for Schedules  
            <Checkbox style={{ float: 'right'}}
                checked={componentDisabled}
                onChange={(e) => setComponentDisabled(e.target.checked)}
                >
                {'Enable / Disable Settings fields'}
            </Checkbox>
         </h4>
           
                <Form
                    form={form1}
                    name="control-hooks"
                    labelCol={{
                         span: 12,
                    }}
                    wrapperCol={{
                         span: 5,
                    }}
                    style={{
                        maxWidth: 800,
                        margin:'auto',
                        marginTop:30,

                       
                    }}
                     onFinish={onFinish}
                     autoComplete="off"
                     disabled={componentDisabled}
                    >
                    <Form.Item
                        label="Maximum classes per day for student"
                        name="student_max_class_day" >
                        <Input type='number'  style={{width:140}} />
                    </Form.Item>

                    <Form.Item
                        label="Maximum classes per day for instructor"
                        name="instructor_max_class_day" >
                       <Input type='number'   style={{width:140}}/>
                    </Form.Item>

                    <Form.Item
                        label="Maximum Scheules  per day for class"
                        name="classtype_max_class_day" >
                       <Input type='number'  style={{width:140}}/>
                    </Form.Item>

                    <Form.Item
                        label="Duration Of a Schedule"
                        name="class_duration">
                      <Input type='number'  style={{width:140}} />
                    </Form.Item>


                    <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 10
                    }}
                    >
                    <Button type="primary" htmlType="submit" loading={loading}>
                       {addorupdate ? 'UPDATE SETTINGS':'ADD SETTINGS'}
                    </Button>
                    </Form.Item>
                </Form>
          </div>
        </div>
      </div>
    </div>
          
      </DefaultLayout>
  )
}

export default Settings