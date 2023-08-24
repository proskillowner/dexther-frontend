import React from 'react';
import '../../App.css';
import TokarAppBar from '../../appbar/TokarAppBar';
import { useState } from 'react';
import Filter from './SearchFilter';
import i18next from 'i18next';
import SearchFilter from './SearchFilter';
import DataSettings from './DataSettings';


function Settings(props) {
  const [subTitle, setSubTitle] = useState("");
  
  return (
    <div className='Dashboard'>      
        <TokarAppBar
          showBack={true}
          subTitle={i18next.t("settings")} />        
        <div className='Dashboard' style={{marginLeft: 16}}>
          <SearchFilter />
          <DataSettings />
        </div>
    </div>
    
  );
}

export default Settings;