import React from 'react';
import { withTranslation } from 'react-i18next';
import '../App.css';
import TokarAppBar from '../appbar/TokarAppBar';
import i18next from 'i18next';
import Grid from '../grid/Grid';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function Dashboard(props) {
  const [gridKey, setGridKey] = useState(0);
  const [subTitle, setSubTitle] = useState("");

  const scheduleCheckData = () => {
    setTimeout(checkRequestData, 5000)
  }

  const checkRequestData = async () => {
    // await fetch(`${SERVER_URL}${API_GET_CONFIG}`, {
    //   method: 'POST',
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     var found = false
    //     for (let i = 0; i < data.length; i++) {
    //       if (data[i].name == "data_request") {
    //         found = true
    //         break
    //       }
    //     }

    //     if (found) {
    //       scheduleCheckData()
    //     }
    //     else {
    //       alert("Reload data berhasil")
    //       setGridKey(gridKey + 1)

    //     }
    //   })
    //   .catch((err) => {

    //   })
  }

  const onReloadData = async () => {
    // const { t } = withTranslation();

    // let response = await fetch(window.BASE_URL + '/addhist')
    //   .then((response) => response.json())
    //   .then((data) => {
    //     if (data.hist == "1") {
    //       alert(i18next.t("request_load_data"))
    //       scheduleCheckData()
    //     }
    //     else {
    //       alert(i18next.t("request_load_data_on_progress"))
    //     }
    //   })
    //   .catch((err) => {
    //     alert(err.message)
    //   })
  }

  const updateData = (data) => {

    //var parts = data.now.split(" ")
    //var dateParts = parts[0].split('-');
    //var timeParts = parts[1].split(':');

    //var mydate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], timeParts[0], timeParts[1], timeParts[2]); 
    var mydate = new Date(data.now)

    if (props.trail) {
      setSubTitle(i18next.t("audit_trail"))
    }
    else
      if (props.hist) {
        setSubTitle(i18next.t("history") + " " + data.detail.hist_chain + ", " + data.detail.hist_name)
      }
      else {
        setSubTitle(i18next.t("current_latest_date") + " " + mydate.toLocaleDateString("en-US") + " " + mydate.toLocaleTimeString("en-US"))
      }
  }

  const [searchParams] = useSearchParams();

  return (
    <div className='Dashboard'>
      <TokarAppBar
        showBack={props.hist || props.trail}
        trail={props.trail ? "true" : "false"}
        subTitle={subTitle}
        onReloadData={onReloadData} />
      <div className='Dashboard-content'>
        <Grid
          hist={props.hist ? "true" : "false"}
          trail={props.trail ? "true" : "false"}
          chain={searchParams.get('chain')}
          token={searchParams.get('token')}
          pair={searchParams.get('pair')}
          key={gridKey}
          updateData={updateData}
        />
      </div>

    </div>

  );
}

export default Dashboard;