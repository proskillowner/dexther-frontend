import React from "react";
import i18next from 'i18next';
import { withTranslation } from 'react-i18next';
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { SERVER_URL, API_GET_SYNC_INFO, API_SET_SYNC_INTERVAL, API_GET_SYNC_LOG, API_GET_CHAIN } from '../../Api.js'

import { DataGrid, gridPageSizeSelector, gridPaginationModelSelector, gridRowCountSelector, gridClasses } from '@mui/x-data-grid';

const DEFAULT_INTERVAL = 10

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

const CssSelect = styled(Select)(() => ({
  color: "#ffffff",
  "&.MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#A0AAB4"
    },
    "&:hover fieldset": {
      borderColor: "#ffffff"
    },
    "&.Mui-focused fieldset": {
      borderColor: "#A0AAB4"
    },
    "& .MuiSvgIcon-root": {
      color: "#ffffff",
    },
  }
}));

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#A0AAB4',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#B2BAC2',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#E0E3E7',
    },
    '&:hover fieldset': {
      borderColor: '#B2BAC2',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#6F7E8C',
    },
  },
});

const style = {
  position: "fixed",
  top: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "flex-end",
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
    field: 'sync_start_time',
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
    field: 'sync_duration',
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
    field: 'sync_status',
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
    field: 'sync_description',
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
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };


  constructor(props) {
    super(props)

    const { cookies } = this.props;
    this.state = {
      dialogCronLog: false,
      loading: false,
      selectedChains: this.props.data != null ? this.props.data.selectedChains : [],
      interval: this.props.data != null ? this.props.data.interval : DEFAULT_INTERVAL,
      isErrorInterval: false,
      errorText: "",
      chains: [],
      rows: []

    }

    this.submit = this.submit.bind(this)
    this.loadData = this.loadData.bind(this)
    this.chainOnChange = this.chainOnChange.bind(this)
    this.setInterval = this.setInterval.bind(this)
    this.showCronLog = this.showCronLog.bind(this)
    this.closeCronLog = this.closeCronLog.bind(this)
  }

  async loadChains() {
    await fetch(`${SERVER_URL}${API_GET_CHAIN}`, {
      method: 'POST',
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState(
          {
            chains: data
          }, this.loadData
        )
      })
      .catch((err) => {
        this.loadData()
      })
  }

  componentDidMount() {
    this.loadChains()
  }

  async loadData() {
    var allSelected = []
    for (var i = 0; i < this.state.chains.length; i++) {
      allSelected.push(this.state.chains[i].name)
    }

    await fetch(`${SERVER_URL}${API_GET_SYNC_INFO}`, {
      method: 'POST',
    })
      .then((response) => response.json())
      .then((data) => {
        for (const sync_info of data) {
          const chain_id = /*sync_info.chain_id*/'Ethereum'
          const sync_interval = sync_info.sync_interval / 60

          this.setState({
            interval: sync_interval ? sync_interval : DEFAULT_INTERVAL,
            selectedChains: chain_id ? chain_id.split(",") : allSelected
          })
        }
      })
      .catch((err) => {
        alert(err.message)
      })

  }

  showCronLog() {
    this.setState({
      dialogCronLog: true
    })

    this.loadCronLog()
  }

  async loadCronLog() {
    await fetch(`${SERVER_URL}${API_GET_SYNC_LOG}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        let tableData = [];
        data.map((row, index) => {
          tableData.push({
            id: index + 1,
            sync_start_time: row.sync_start_time,
            sync_duration: row.sync_duration,
            sync_status: row.sync_status,
            sync_description: row.sync_description,
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

  submit() {
    const { t } = this.props;

    const data = []

    const data_chains = this.state.selectedChains.length > 0 ? this.state.selectedChains.join(",") : null
    const sync_interval = this.state.interval != null ? this.state.interval : null

    if (!sync_interval) {
      this.setState({
        isErrorInterval: true,
        errorText: t("data_interval_empty")
      })
    }
    else
      if (sync_interval < 1) {
        this.setState({
          isErrorInterval: true,
          errorText: t("data_interval_invalid")
        })
      }
      else {
        this.save([{
          chain_id: 1,
          exchange_id: 1,
          sync_interval: sync_interval * 60,
        }])
      }

  }


  async save(data) {
    const { t } = this.props;

    await fetch(`${SERVER_URL}${API_SET_SYNC_INTERVAL}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        alert(t("save_data_settings_success"))
      })
      .catch((err) => {
        alert(err.message)
      })

  }

  chainOnChange(event) {
    const {
      target: { value },
    } = event;

    this.setState(
      {
        selectedChains: typeof value === 'string' ? value.split(',') : value
      }
    )
  };

  setInterval(value) {
    this.setState(
      {
        interval: value,
        isErrorInterval: false,
        errorText: ""
      }
    )
  };

  closeCronLog() {
    this.setState({
      dialogCronLog: false
    })
  }


  render() {
    const { t } = this.props;

    var chains = this.state.chains ? this.state.chains : []

    return <div>
      <h2>{t("data_settings")}</h2>
      <div >
        <div style={{ marginLeft: 16, marginRight: 16 }}>
          <div>
            <div>
              <CssSelect
                style={{ width: "80%" }}
                multiple
                value={this.state.selectedChains}
                onChange={this.chainOnChange}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}>
                {chains.map((arr) => (
                  <MenuItem key={arr.name} value={arr.name}>
                    <Checkbox
                      checked={this.state.selectedChains.indexOf(arr.name) > -1}
                      style={{
                        color: "#ffffff",
                      }} />
                    <ListItemText primary={arr.name} />
                  </MenuItem>
                ))}
              </CssSelect>
              <span className="App-Label-Filter">{t("chains")}</span>
            </div>


            <div style={{ clear: "both", marginTop: 6 }}>
              <CssTextField
                type="number"
                style={{ width: 180 }}
                size="small"
                variant="outlined"
                value={this.state.interval}
                error={this.state.isErrorInterval}
                helperText={this.state.errorText}
                onChange={(event) => {
                  this.setInterval(event.target.value);
                }}
                InputLabelProps={{
                  shrink: false,
                  className: "App-TextField-Filter"
                }}
                InputProps={{
                  className: "App-TextField-Filter"
                }} />
              <span style={{ marginTop: 4 }} className="App-Label-Filter-NoFloat">{t("minute")}</span>
              <span onClick={this.showCronLog} className="App-link" style={{ marginLeft: 16 }}>{t("log_job")}</span>
              <span className="App-Label-Filter">{t("data_interval")}</span>
            </div>

          </div>
        </div>
        <Button onClick={this.submit} style={{ marginTop: 16, paddingLeft: 16, paddingRight: 16 }} variant="contained">{t("save_data_settings")}</Button>
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