import React from "react";
import i18next from 'i18next';
import { withTranslation } from 'react-i18next';
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CssSelect, CssTextField, style } from "../../Style.js";
import { SERVER_URL, API_GET_OPERATION_LOG, API_GET_CHAIN, API_GET_CONFIG, API_SET_CONFIG } from '../../Api.js'

import { DataGrid, gridPageSizeSelector, gridPaginationModelSelector, gridRowCountSelector, gridClasses } from '@mui/x-data-grid';

import MainContext from "../../context/MainContext";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      background: "#282c34",
      color: "#ffffff"
    },
  },
};

const columns = [
  {
    field: 'idx',
    renderHeader: (params) => (
      <strong>
        {'NO'}
      </strong>
    ),
    headerClassName: 'super-app-theme--header',
    headerAlign: 'right',
    align: "right",
    width: 40,
    disableColumnMenu: true,
    hideSortIcons: true,
    hideable: false,
    sortable: false,
    renderCell: (params) => {
      return params.id
    }
  },

  {
    field: 'operation_start_time',
    renderHeader: (params) => (
      <strong>
        {i18next.t("start_time")}
      </strong>
    ),
    headerClassName: 'super-app-theme--header',
    width: 140,
    sortable: false,
    hideable: false,
    disableColumnMenu: true,
    hideSortIcons: true,
    renderCell: (params) => {
      const mydate = new Date(params.value * 1000)
      return mydate.toLocaleDateString("en-US") + " " + mydate.toLocaleTimeString("en-US")
    }
  },

  {
    field: 'operation_duration',
    type: 'number',
    renderHeader: (params) => (
      <div>
        <Typography style={{ fontSize: 11 }}>
          <strong>
            {i18next.t("duration")}
          </strong>
        </Typography>
        <Typography style={{ fontSize: 11 }}>
          <strong>
            ({i18next.t("second")})
          </strong>
        </Typography>

      </div>
    ),
    headerClassName: 'super-app-theme--header',
    width: 80,
    sortable: false,
    hideable: false,
    disableColumnMenu: true,
    hideSortIcons: true,
    renderCell: (params) => {
      return params.value
    }
  },

  {
    field: 'operation_status',
    renderHeader: (params) => (
      <strong>
        {i18next.t("status")}
      </strong>
    ),
    headerClassName: 'super-app-theme--header',
    width: 80,
    sortable: false,
    hideable: false,
    disableColumnMenu: true,
    hideSortIcons: true,
    renderCell: (params) => {
      return params.value === 0 ? i18next.t("success") : (params.value === 1 ? i18next.t("failed") : i18next.t("unknown"))
    }
  },

  {
    field: 'operation_description',
    renderHeader: (params) => (
      <strong>
        {i18next.t("description")}
      </strong>
    ),
    headerClassName: 'super-app-theme--header',
    width: 250,
    sortable: false,
    hideable: false,
    disableColumnMenu: true,
    hideSortIcons: true,
    renderCell: (params) => {
      return params.value
    }
  },
];

class DataSettings extends React.Component {
  static contextType = MainContext
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    super(props)

    const { cookies } = this.props;
    this.state = {
      syncInterval: this.props.data ? this.props.data.syncInterval : null,
      scanInterval: this.props.data ? this.props.data.scanInterval : null,
      scanCount: this.props.data ? this.props.data.scanCount : null,
      dialogCronLog: false,
      loading: false,
      rows: []
    }

    this.setSyncInterval = this.setSyncInterval.bind(this)
    this.setScanInterval = this.setScanInterval.bind(this)

    this.loadConfig = this.loadConfig.bind(this)
    this.saveConfig = this.saveConfig.bind(this)
    this.chainOnChange = this.chainOnChange.bind(this)

    this.showCronLog = this.showCronLog.bind(this)
    this.closeCronLog = this.closeCronLog.bind(this)
  }

  componentDidMount() {
    this.loadConfig()
  }

  setSyncInterval(value) {
    this.setState({
      syncInterval: value,
    })
  };

  setScanInterval(value) {
    this.setState({
      scanInterval: value,
    })
  };

  setSyncCount(value) {
    this.setState({
      syncInterval: value,
    })
  };

  async loadConfig() {
    try {
      const config = await this.context.loadConfig()

      this.setState({
        syncInterval: config['sync_interval'] / 60,
        scanInterval: config['scan_interval'] / 60,
        scanCount: config['scan_count'],
      })
    } catch (error) {
      console.error(error.message)
    }
  }

  saveConfig() {
    try {
      const { t } = this.props;

      const config = {
        sync_interval: this.state.syncInterval ? this.state.syncInterval * 60 : null,
        scan_interval: this.state.scanInterval ? this.state.scanInterval * 60 : null,
        scan_count: this.state.scanCount ? this.state.scanCount : null,
      }

      this.context.saveConfig(config)
      alert(t("save_data_settings_success"))
    } catch (error) {
      console.error(error.message)
    }
  }

  showCronLog() {
    this.setState({
      dialogCronLog: true
    })

    this.loadCronLog()
  }

  async loadCronLog() {
    await fetch(`${SERVER_URL}${API_GET_OPERATION_LOG}`, {
      method: 'POST',
      body: JSON.stringify({
        offset: 0,
        count: 100,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        let tableData = [];
        data.map((row, index) => {
          tableData.push({
            id: index + 1,
            operation_start_time: row.operation_start_time,
            operation_duration: row.operation_duration,
            operation_status: row.operation_status,
            operation_description: row.operation_description,
          })
        })
        this.setState({
          rows: tableData
        })
      })
      .catch((err) => {
        alert(err)
      })
  }

  closeCronLog() {
    this.setState({
      dialogCronLog: false
    })
  }

  chainOnChange(event) {
  };

  render() {
    const { t } = this.props;

    const chains = ['Ethereum']
    const selectedChains = ['Ethereum']

    return <div>
      <h2>{t("data_settings")}</h2>
      <div >
        <div style={{ marginLeft: 16, marginRight: 16 }}>
            <div>
              <CssSelect
                multiple
                value={selectedChains}
                onChange={this.chainOnChange}
                renderValue={(selected) => selected.join(',')}
                MenuProps={MenuProps}>
                {chains.map((arr) => (
                  <MenuItem key={arr} value={arr}>
                    <Checkbox
                      checked={selectedChains.indexOf(arr) > -1}
                      style={{
                        color: "#ffffff",
                      }} />
                    <ListItemText primary={arr} />
                  </MenuItem>
                ))}
              </CssSelect>
              <span className="App-Label-Filter">{t("chains")}</span>
            </div>

          <div style={{ columnCount: 2 }}>
            <div style={{ clear: "both", marginTop: 6 }}>
              <CssTextField
                type="number"
                style={{ width: 125 }}
                size="small"
                variant="outlined"
                value={this.state.syncInterval ? this.state.syncInterval : ""}
                onChange={(event) => {
                  this.setSyncInterval(event.target.value);
                }}
                InputLabelProps={{
                  shrink: false,
                  className: "App-TextField-Filter"
                }}
                InputProps={{
                  className: "App-TextField-Filter"
                }} />
              <span style={{ marginTop: 4 }} className="App-Label-Filter-NoFloat">{t("minute")}</span>
              <span className="App-Label-Filter">{t("sync_interval")}</span>
            </div>
            <div style={{ clear: "both", marginTop: 6 }}>
              <CssTextField
                type="number"
                style={{ width: 125 }}
                size="small"
                variant="outlined"
                value={this.state.scanInterval ? this.state.scanInterval : ""}
                onChange={(event) => {
                  this.setScanInterval(event.target.value);
                }}
                InputLabelProps={{
                  shrink: false,
                  className: "App-TextField-Filter"
                }}
                InputProps={{
                  className: "App-TextField-Filter"
                }} />
              <span style={{ marginTop: 4 }} className="App-Label-Filter-NoFloat">{t("minute")}</span>
              <span className="App-Label-Filter">{t("scan_interval")}</span>
            </div>
          </div>
        </div>
        <Button onClick={this.showCronLog} style={{ marginTop: 16, marginRight: 8, paddingLeft: 16, paddingRight: 16 }} variant="contained">{t("log_job")}</Button>
        <Button onClick={this.saveConfig} style={{ marginTop: 16, marginLeft: 8, paddingLeft: 16, paddingRight: 16 }} variant="contained">{t("save_data_settings")}</Button>
      </div>

      <Dialog
        PaperProps={{
          style: {
            backgroundColor: '#282c34',
            boxShadow: 'none',
            color: "#ffffff"
          },
        }}
        open={this.state.dialogCronLog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t("log_job_title")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" style={{ color: "#ffffff" }}>
            <Box sx={{
              width: '100%',
              '& .super-app-theme--header': {
                backgroundColor: '#3b3f46',
                color: '#ffffff',
                fontSize: 11
              }
            }}>
              <DataGrid
                sx={(theme) => ({
                  border: 1,
                  borderColor: "gray",
                  [`.${gridClasses.main}`]: {
                    overflow: "unset"
                  },
                  [`.${gridClasses.columnHeaders}`]: {
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                    borderBottom: 'none',
                  },
                  [`.${gridClasses.root}`]: {
                    outline: "none !important"
                  },
                  [`.${gridClasses.cell}`]: {
                    outline: "none !important",
                    border: 0,
                    borderBottom: 0.5,
                    borderBottomColor: "gray",
                    py: "12px"
                  },
                  [`.${gridClasses.columnHeader}`]: {
                    outline: "none !important"
                  }
                })}
                rows={this.state.rows}
                columns={columns}
                disableRowSelectionOnClick
                getRowClassName={(params) => `Data-Grid-Row`}
                loading={this.state.loading}
                getRowHeight={() => 'auto'}
                hideFooter={true}

              />
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.closeCronLog}>{t("close")}</Button>
        </DialogActions>
      </Dialog>
    </div>
  }
}

export default withCookies(withTranslation()(DataSettings));