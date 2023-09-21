import React from "react";
import { Menu, Dropdown, Button, Space } from "antd";
import {useNavigate} from 'react-router-dom'
import "../resources/default-layout.css";

import { SettingOutlined ,HomeOutlined} from '@ant-design/icons';


function DefaultLayout(props) {

  const navigate = useNavigate();

  return (
    <div className="layout">
      <div className="header d-flex justify-content-between align-items-center">
        <div onClick={()=>navigate('/')}>
          <h1 className="logo"> <img src="../../logo.png" style={{height:50,background:'#028282'}} /> EXCELLENCE TECHNICAL TASK</h1>
        </div>
        <div style={{display:'flex'}}> 
        {/* <div className="homeicon"><HomeOutlined  size={'large'} style={{color:'#fff'}}/></div> */}
        <Button
          className="homeicon"
          type="primary"
          icon={<HomeOutlined />}
          onClick={() => navigate('/')}
        >
          
        </Button>
        <Button
          type="primary"
          icon={<SettingOutlined />}
          onClick={() => navigate('/settings')}
        >
          SETTINGS
        </Button>
        </div>
      
      </div>

      <div className={props?.height == 'new-content' ? "new-content": "content"}>{props.children}</div>
    </div>
  );
}

export default DefaultLayout;
