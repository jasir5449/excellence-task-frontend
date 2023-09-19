import React from "react";
import { Menu, Dropdown, Button, Space } from "antd";
import {useNavigate} from 'react-router-dom'
import "../resources/default-layout.css";


function DefaultLayout(props) {

  const navigate = useNavigate();

  return (
    <div className="layout">
      <div className="header d-flex justify-content-between align-items-center">
        <div onClick={()=>navigate('/')}>
          <h1 className="logo"> <img src="../../logo.png" style={{height:50,background:'#028282'}} /> EXCELLENCE TECHNICAL TASK</h1>
        </div>
      
      </div>

      <div className="content">{props.children}</div>
    </div>
  );
}

export default DefaultLayout;
