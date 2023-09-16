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

const COLUMN_OPTIONS = {
  headerClassName: 'super-app-theme--header',
  filterable: false,
  hideable: false,
  sortable: false,
  disableColumnMenu: true,
}

const columns = [
  {
    ...COLUMN_OPTIONS,
    type: 'number',
    field: 'id',
    renderHeader: (params) => (
      <strong>
        {'NO'}
      </strong>
    ),
    width: 50,
    renderCell: (params) => {
      return params.value
    }
  },

  {
    ...COLUMN_OPTIONS,
    field: 'operation_start_timestamp',
    renderHeader: (params) => (
      <strong>
        {i18next.t("start_time")}
      </strong>
    ),
    width: 150,
    headerAlign: 'center',
    align: "center",
    renderCell: (params) => {
      const mydate = new Date(params.value * 1000)
      return mydate.toLocaleDateString("en-US") + " " + mydate.toLocaleTimeString("en-US")
    }
  },

  {
    ...COLUMN_OPTIONS,
    field: 'operation_type',
    renderHeader: (params) => (
      <strong>
        {i18next.t("type")}
      </strong>
    ),
    width: 150,
    renderCell: (params) => {
      if (params.value === 1) return i18next.t("sync")
      if (params.value === 2) return i18next.t("scan")
      return i18next.t("unknown")
    }
  },

  {
    ...COLUMN_OPTIONS,
    type: 'number',
    field: 'operation_duration',
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
    width: 100,
    renderCell: (params) => {
      return params.value
    }
  },

  {
    ...COLUMN_OPTIONS,
    field: 'operation_status',
    renderHeader: (params) => (
      <strong>
        {i18next.t("status")}
      </strong>
    ),
    width: 100,
    renderCell: (params) => {
      return params.value === 0 ? i18next.t("success") : (params.value === 1 ? i18next.t("failed") : i18next.t("unknown"))
    }
  },

  {
    ...COLUMN_OPTIONS,
    field: 'operation_description',
    renderHeader: (params) => (
      <strong>
        {i18next.t("description")}
      </strong>
    ),
    width: 580,
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
      scanMaxPoolCount: this.props.data ? this.props.data.scanMaxPoolCount : null,
      scanPoolCreationTimestampRange: this.props.data != null ? this.props.data.scanPoolCreationTimestampRange : null,
      scanMinTokenPrice: this.props.data != null ? this.props.data.scanMinTokenPrice : null,
      scanMaxTokenPrice: this.props.data != null ? this.props.data.scanMaxTokenPrice : null,
      scanMinPoolInitialLiquidity: this.props.data != null ? this.props.data.scanMinPoolInitialLiquidity : null,
      scanMaxPoolInitialLiquidity: this.props.data != null ? this.props.data.scanMaxPoolInitialLiquidity : null,
      scanMinPoolTotalLiquidity: this.props.data != null ? this.props.data.scanMinPoolTotalLiquidity : null,
      scanMaxPoolTotalLiquidity: this.props.data != null ? this.props.data.scanMaxPoolTotalLiquidity : null,
      scanMinPoolTotalTxs: this.props.data != null ? this.props.data.scanMinPoolTotalTxs : null,
      scanMaxPoolTotalTxs: this.props.data != null ? this.props.data.scanMaxPoolTotalTxs : null,
      scanMinTokenTotalHolders: this.props.data != null ? this.props.data.scanMinTokenTotalHolders : null,
      scanMaxTokenTotalHolders: this.props.data != null ? this.props.data.scanMaxTokenTotalHolders : null,
      scanMinTokenTotalMarketCap: this.props.data != null ? this.props.data.scanMinTokenTotalMarketCap : null,
      scanMaxTokenTotalMarketCap: this.props.data != null ? this.props.data.scanMaxTokenTotalMarketCap : null,
      scanMinVolume24H: this.props.data != null ? this.props.data.scanMinVolume24H : null,
      scanMaxVolume24H: this.props.data != null ? this.props.data.scanMaxVolume24H : null,
      dialogCronLog: false,
      loading: false,
      rows: []
    }

    this.setSyncInterval = this.setSyncInterval.bind(this)
    this.setScanInterval = this.setScanInterval.bind(this)
    this.setScanMaxPoolCount = this.setScanMaxPoolCount.bind(this)
    this.setScanPoolCreationTimestampRange = this.setScanPoolCreationTimestampRange.bind(this)
    this.setScanMinTokenPrice = this.setScanMinTokenPrice.bind(this)
    this.setScanMaxTokenPrice = this.setScanMaxTokenPrice.bind(this)
    this.setScanMinPoolInitialLiquidity = this.setScanMinPoolInitialLiquidity.bind(this)
    this.setScanMaxPoolInitialLiquidity = this.setScanMaxPoolInitialLiquidity.bind(this)
    this.setScanMinPoolTotalLiquidity = this.setScanMinPoolTotalLiquidity.bind(this)
    this.setScanMaxPoolTotalLiquidity = this.setScanMaxPoolTotalLiquidity.bind(this)
    this.setScanMinPoolTotalTxs = this.setScanMinPoolTotalTxs.bind(this)
    this.setScanMaxPoolTotalTxs = this.setScanMaxPoolTotalTxs.bind(this)
    this.setScanMinTokenTotalHolders = this.setScanMinTokenTotalHolders.bind(this)
    this.setScanMaxTokenTotalHolders = this.setScanMaxTokenTotalHolders.bind(this)
    this.setScanMinTokenTotalMarketCap = this.setScanMinTokenTotalMarketCap.bind(this)
    this.setScanMaxTokenTotalMarketCap = this.setScanMaxTokenTotalMarketCap.bind(this)
    this.setScanMinVolume24H = this.setScanMinVolume24H.bind(this)
    this.setScanMaxVolume24H = this.setScanMaxVolume24H.bind(this)

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

  setScanMaxPoolCount(value) {
    this.setState({
      scanMaxPoolCount: value,
    })
  };

  setScanPoolCreationTimestampRange(value) {
    this.setState({
      scanPoolCreationTimestampRange: value
    })
  }

  setScanMinTokenPrice(value) {
    this.setState({
      scanMinTokenPrice: value
    })
  }

  setScanMaxTokenPrice(value) {
    this.setState({
      scanMaxTokenPrice: value
    })
  }

  setScanMinPoolInitialLiquidity(value) {
    this.setState({
      scanMinPoolInitialLiquidity: value
    })
  }

  setScanMaxPoolInitialLiquidity(value) {
    this.setState({
      scanMaxPoolInitialLiquidity: value
    })
  }

  setScanMinPoolTotalLiquidity(value) {
    this.setState({
      scanMinPoolTotalLiquidity: value
    })
  }

  setScanMaxPoolTotalLiquidity(value) {
    this.setState({
      scanMaxPoolTotalLiquidity: value
    })
  }

  setScanMinPoolTotalTxs(value) {
    this.setState({
      scanMinPoolTotalTxs: value
    })
  }

  setScanMaxPoolTotalTxs(value) {
    this.setState({
      scanMaxPoolTotalTxs: value
    })
  }

  setScanMinTokenTotalHolders(value) {
    this.setState({
      scanMinTokenTotalHolders: value
    })
  }

  setScanMaxTokenTotalHolders(value) {
    this.setState({
      scanMaxTokenTotalHolders: value
    })
  }

  setScanMinTokenTotalMarketCap(value) {
    this.setState({
      scanMinTokenTotalMarketCap: value
    })
  }

  setScanMaxTokenTotalMarketCap(value) {
    this.setState({
      scanMaxTokenTotalMarketCap: value
    })
  }

  setScanMinVolume24H(value) {
    this.setState({
      scanMinVolume24H: value
    })
  }

  setScanMaxVolume24H(value) {
    this.setState({
      scanMaxVolume24H: value
    })
  }

  async loadConfig() {
    try {
      const config = await this.context.loadConfig()

      this.setState({
        syncInterval: config['sync_interval'] / 60,
        scanInterval: config['scan_interval'] / 60,
        scanMaxPoolCount: config['scan_max_pool_count'],
        scanPoolCreationTimestampRange: config['scan_pool_creation_timestamp_range'] / (60 * 60),
        scanMinPoolInitialLiquidity: config['keyword_scan_min_pool_initial_liquidity'],
        scanMaxPoolInitialLiquidity: config['keyword_scan_max_pool_initial_liquidity'],
        scanMinPoolTotalLiquidity: config['keyword_scan_min_pool_total_liquidity'],
        scanMaxPoolTotalLiquidity: config['keyword_scan_max_pool_total_liquidity'],
        scanMinPoolTotalTxs: config['keyword_scan_min_pool_total_txs'],
        scanMaxPoolTotalTxs: config['keyword_scan_max_pool_total_txs'],
        scanMinTokenTotalHolders: config['keyword_scan_min_token_total_holders'],
        scanMaxTokenTotalHolders: config['keyword_scan_max_token_total_holders'],
        scanMinTokenTotalMarketCap: config['keyword_scan_min_token_total_market_cap'],
        scanMaxTokenTotalMarketCap: config['keyword_scan_max_token_total_market_cap'],
        scanMinVolume24H: config['keyword_scan_min_volume_24h'],
        scanMaxVolume24H: config['keyword_scan_max_volume_24h'],
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
        scan_max_pool_count: this.state.scanMaxPoolCount ? this.state.scanMaxPoolCount : null,
        scan_pool_creation_timestamp_range: this.state.scanPoolCreationTimestampRange ? this.state.scanPoolCreationTimestampRange * (60 * 60) : null,
        keyword_scan_min_token_price: this.state.scanMinTokenPrice ? this.state.scanMinTokenPrice : null,
        keyword_scan_max_token_price: this.state.scanMaxTokenPrice ? this.state.scanMaxTokenPrice : null,
        keyword_scan_min_pool_initial_liquidity: this.state.scanMinPoolInitialLiquidity ? this.state.scanMinPoolInitialLiquidity : null,
        keyword_scan_max_pool_initial_liquidity: this.state.scanMaxPoolInitialLiquidity ? this.state.scanMaxPoolInitialLiquidity : null,
        keyword_scan_min_pool_total_liquidity: this.state.scanMinPoolTotalLiquidity ? this.state.scanMinPoolTotalLiquidity : null,
        keyword_scan_max_pool_total_liquidity: this.state.scanMaxPoolTotalLiquidity ? this.state.scanMaxPoolTotalLiquidity : null,
        keyword_scan_min_pool_total_txs: this.state.scanMinPoolTotalTxs ? this.state.scanMinPoolTotalTxs : null,
        keyword_scan_max_pool_total_txs: this.state.scanMaxPoolTotalTxs ? this.state.scanMaxPoolTotalTxs : null,
        keyword_scan_min_token_total_holders: this.state.scanMinTokenTotalHolders ? this.state.scanMinTokenTotalHolders : null,
        keyword_scan_max_token_total_holders: this.state.scanMaxTokenTotalHolders ? this.state.scanMaxTokenTotalHolders : null,
        keyword_scan_min_token_total_market_cap: this.state.scanMinTokenTotalMarketCap ? this.state.scanMinTokenTotalMarketCap : null,
        keyword_scan_max_token_total_market_cap: this.state.scanMaxTokenTotalMarketCap ? this.state.scanMaxTokenTotalMarketCap : null,
        keyword_scan_min_volume_24h: this.state.scanMinVolume24H ? this.state.scanMinVolume24H : null,
        keyword_scan_max_volume_24h: this.state.scanMaxVolume24H ? this.state.scanMaxVolume24H : null,
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
            operation_start_timestamp: row.operation_start_timestamp,
            operation_type: row.operation_type,
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
      <div style={{ paddingBottom: 10 }}>
        <div style={{ marginLeft: 16, marginRight: 16 }}>
          <div>
            <span className="App-Label-Filter-Block">{t("chains")}</span>
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
          </div>
          <div style={{ columnCount: 2, marginTop: 10 }}>
            <div style={{ clear: "both", height: 50 }}>
              <span className="App-Label-Filter-Block">{t("sync_interval")}</span>
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
              <span style={{ marginTop: 4 }} className="App-Label-Filter-Inline">{t("minute")}</span>
            </div>
            <div style={{ clear: "both", height: 50 }}>
              <span className="App-Label-Filter-Block">{t("scan_interval")}</span>
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
              <span style={{ marginTop: 4 }} className="App-Label-Filter-Inline">{t("minute")}</span>
            </div>
          </div>
          <h4>{t("scan_filter")}</h4>
          <div style={{ columnCount: 2 }}>
            <div style={{ clear: "both", height: 50 }}>
              <span className="App-Label-Filter-Block">{t("scan_count")}</span>
              <CssTextField
                type="number"
                style={{ width: 125 }}
                size="small"
                variant="outlined"
                value={this.state.scanMaxPoolCount ? this.state.scanMaxPoolCount : ""}
                onChange={(event) => {
                  this.setScanMaxPoolCount(event.target.value);
                }}
                InputLabelProps={{
                  shrink: false,
                  className: "App-TextField-Filter"
                }}
                InputProps={{
                  className: "App-TextField-Filter"
                }} />
            </div>
            <div style={{ clear: "both", height: 50 }}>
              <span className="App-Label-Filter-Block">{t("listed_since")}</span>
              <CssTextField
                type="number"
                style={{ width: 125 }}
                size="small"
                variant="outlined"
                value={this.state.scanPoolCreationTimestampRange ? this.state.scanPoolCreationTimestampRange : ""}
                onChange={(event) => {
                  this.setScanPoolCreationTimestampRange(event.target.value);
                }}
                InputLabelProps={{
                  shrink: false,
                  className: "App-TextField-Filter"
                }}
                InputProps={{
                  className: "App-TextField-Filter"
                }} />
              <span className="App-Label-Filter-Inline">{t("hours_before_now")}</span>
            </div>
            <div style={{ clear: "both", height: 50 }}>
              <span className="App-Label-Filter-Block">{t("initial_liquidity_usd")}</span>
              <CssTextField
                type="number"
                style={{ width: 125 }}
                size="small"
                variant="outlined"
                value={this.state.scanMinPoolInitialLiquidity ? this.state.scanMinPoolInitialLiquidity : ""}
                onChange={(event) => {
                  this.setMinPoolInitialLiquidity(event.target.value);
                }}
                InputLabelProps={{
                  shrink: false,
                  className: "App-TextField-Filter"
                }}
                InputProps={{
                  className: "App-TextField-Filter"
                }} />
              <span className="App-Label-Filter-Inline">{t("to")}</span>
              <CssTextField
                type="number"
                style={{ width: 125 }}
                size="small"
                value={this.state.scanMaxPoolInitialLiquidity ? this.state.scanMaxPoolInitialLiquidity : ""}
                onChange={(event) => {
                  this.setMaxPoolInitialLiquidity(event.target.value);
                }}
                variant="outlined"
                InputLabelProps={{
                  shrink: false,
                  className: "App-TextField-Filter"
                }}
                InputProps={{
                  className: "App-TextField-Filter"
                }} />
            </div>
            <div style={{ clear: "both", height: 50 }}>
              <span className="App-Label-Filter-Block">{t("total_liquidity_usd")}</span>
              <CssTextField
                type="number"
                style={{ width: 125 }}
                size="small"
                variant="outlined"
                value={this.state.scanMinPoolTotalLiquidity ? this.state.scanMinPoolTotalLiquidity : ""}
                onChange={(event) => {
                  this.setMinPoolTotalLiquidity(event.target.value);
                }}
                InputLabelProps={{
                  shrink: false,
                  className: "App-TextField-Filter"
                }}
                InputProps={{
                  className: "App-TextField-Filter"
                }} />
              <span className="App-Label-Filter-Inline">{t("to")}</span>
              <CssTextField
                type="number"
                style={{ width: 125 }}
                size="small"
                value={this.state.scanMaxPoolTotalLiquidity ? this.state.scanMaxPoolTotalLiquidity : ""}
                onChange={(event) => {
                  this.setMaxPoolTotalLiquidity(event.target.value);
                }}
                variant="outlined"
                InputLabelProps={{
                  shrink: false,
                  className: "App-TextField-Filter"
                }}
                InputProps={{
                  className: "App-TextField-Filter"
                }} />
            </div>
            <div style={{ clear: "both", height: 50 }}>
              <span className="App-Label-Filter-Block">{t("total_txs")}</span>
              <CssTextField
                type="number"
                style={{ width: 125 }}
                size="small"
                variant="outlined"
                value={this.state.scanMinPoolTotalTxs ? this.state.scanMinPoolTotalTxs : ""}
                onChange={(event) => {
                  this.setMinPoolTotalTxs(event.target.value);
                }}
                InputLabelProps={{
                  shrink: false,
                  className: "App-TextField-Filter"
                }}
                InputProps={{
                  className: "App-TextField-Filter"
                }} />
              <span className="App-Label-Filter-Inline">{t("to")}</span>
              <CssTextField
                type="number"
                style={{ width: 125 }}
                size="small"
                variant="outlined"
                value={this.state.scanMaxPoolTotalTxs ? this.state.scanMaxPoolTotalTxs : ""}
                onChange={(event) => {
                  this.setMaxPoolTotalTxs(event.target.value);
                }}
                InputLabelProps={{
                  shrink: false,
                  className: "App-TextField-Filter"
                }}
                InputProps={{
                  className: "App-TextField-Filter"
                }} />
            </div>
            <div style={{ clear: "both", height: 50 }}>
              <span className="App-Label-Filter-Block">{t("token_holders")}</span>
              <CssTextField
                type="number"
                style={{ width: 125 }}
                size="small"
                variant="outlined"
                value={this.state.scanMinTokenTotalHolders ? this.state.scanMinTokenTotalHolders : ""}
                onChange={(event) => {
                  this.setMinTokenTotalHolders(event.target.value);
                }}
                InputLabelProps={{
                  shrink: false,
                  className: "App-TextField-Filter"
                }}
                InputProps={{
                  className: "App-TextField-Filter"
                }} />
              <span className="App-Label-Filter-Inline">{t("to")}</span>
              <CssTextField
                type="number"
                style={{ width: 125 }}
                size="small"
                variant="outlined"
                value={this.state.scanMaxTokenTotalHolders ? this.state.scanMaxTokenTotalHolders : ""}
                onChange={(event) => {
                  this.setMaxTokenTotalHolders(event.target.value);
                }}
                InputLabelProps={{
                  shrink: false,
                  className: "App-TextField-Filter"
                }}
                InputProps={{
                  className: "App-TextField-Filter"
                }} />
            </div>
            <div style={{ clear: "both", height: 50 }}>
              <span className="App-Label-Filter-Block">{t("total_market_cap_usd")}</span>
              <CssTextField
                type="number"
                style={{ width: 125 }}
                size="small"
                variant="outlined"
                value={this.state.scanMinTokenTotalMarketCap ? this.state.scanMinTokenTotalMarketCap : ""}
                onChange={(event) => {
                  this.setMinTokenTotalMarketCap(event.target.value);
                }}
                InputLabelProps={{
                  shrink: false,
                  className: "App-TextField-Filter"
                }}
                InputProps={{
                  className: "App-TextField-Filter"
                }} />
              <span className="App-Label-Filter-Inline">{t("to")}</span>
              <CssTextField
                type="number"
                style={{ width: 125 }}
                size="small"
                variant="outlined"
                value={this.state.scanMaxTokenTotalMarketCap ? this.state.scanMaxTokenTotalMarketCap : ""}
                onChange={(event) => {
                  this.setMaxTokenTotalMarketCap(event.target.value);
                }}
                InputLabelProps={{
                  shrink: false,
                  className: "App-TextField-Filter"
                }}
                InputProps={{
                  className: "App-TextField-Filter"
                }} />
            </div>
            <div style={{ clear: "both", height: 50 }}>
              <span className="App-Label-Filter-Block">{t("volume_24h")}</span>
              <CssTextField
                type="number"
                style={{ width: 125 }}
                size="small"
                variant="outlined"
                value={this.state.scanMinVolume24H ? this.state.scanMinVolume24H : ""}
                onChange={(event) => {
                  this.setMinVolume24H(event.target.value);
                }}
                InputLabelProps={{
                  shrink: false,
                  className: "App-TextField-Filter"
                }}
                InputProps={{
                  className: "App-TextField-Filter"
                }} />
              <span className="App-Label-Filter-Inline">{t("to")}</span>
              <CssTextField
                type="number"
                style={{ width: 125 }}
                size="small"
                variant="outlined"
                value={this.state.scanMaxVolume24H ? this.state.scanMaxVolume24H : ""}
                onChange={(event) => {
                  this.setMaxVolume24H(event.target.value);
                }}
                InputLabelProps={{
                  shrink: false,
                  className: "App-TextField-Filter"
                }}
                InputProps={{
                  className: "App-TextField-Filter"
                }} />
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
        fullWidth={true}
        maxWidth="lg"
      >
        <DialogTitle id="alert-dialog-title">
          {t("log_job_title")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" style={{ color: "#ffffff", width: "100%" }}>
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