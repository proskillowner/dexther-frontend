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
    field: 'operation_start_time',
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
      scanPoolCreationTimeRange: this.props.data != null ? this.props.data.scanPoolCreationTimeRange : null,
      scanMinTokenPriceUsd: this.props.data != null ? this.props.data.scanMinTokenPriceUsd : null,
      scanMaxTokenPriceUsd: this.props.data != null ? this.props.data.scanMaxTokenPriceUsd : null,
      scanMinPoolInitialLiquidityUsd: this.props.data != null ? this.props.data.scanMinPoolInitialLiquidityUsd : null,
      scanMaxPoolInitialLiquidityUsd: this.props.data != null ? this.props.data.scanMaxPoolInitialLiquidityUsd : null,
      scanMinPoolTotalLiquidityUsd: this.props.data != null ? this.props.data.scanMinPoolTotalLiquidityUsd : null,
      scanMaxPoolTotalLiquidityUsd: this.props.data != null ? this.props.data.scanMaxPoolTotalLiquidityUsd : null,
      scanMinPoolTotalTxs: this.props.data != null ? this.props.data.scanMinPoolTotalTxs : null,
      scanMaxPoolTotalTxs: this.props.data != null ? this.props.data.scanMaxPoolTotalTxs : null,
      scanMinTokenTotalHolders: this.props.data != null ? this.props.data.scanMinTokenTotalHolders : null,
      scanMaxTokenTotalHolders: this.props.data != null ? this.props.data.scanMaxTokenTotalHolders : null,
      scanMinTokenTotalMarketCapUsd: this.props.data != null ? this.props.data.scanMinTokenTotalMarketCapUsd : null,
      scanMaxTokenTotalMarketCapUsd: this.props.data != null ? this.props.data.scanMaxTokenTotalMarketCapUsd : null,
      scanMinVolume24H: this.props.data != null ? this.props.data.scanMinVolume24H : null,
      scanMaxVolume24H: this.props.data != null ? this.props.data.scanMaxVolume24H : null,
      dialogCronLog: false,
      loading: false,
      rows: []
    }

    this.setSyncInterval = this.setSyncInterval.bind(this)
    this.setScanInterval = this.setScanInterval.bind(this)
    this.setScanMaxPoolCount = this.setScanMaxPoolCount.bind(this)
    this.setScanPoolCreationTimeRange = this.setScanPoolCreationTimeRange.bind(this)
    this.setScanMinTokenPriceUsd = this.setScanMinTokenPriceUsd.bind(this)
    this.setScanMaxTokenPriceUsd = this.setScanMaxTokenPriceUsd.bind(this)
    this.setScanMinPoolInitialLiquidityUsd = this.setScanMinPoolInitialLiquidityUsd.bind(this)
    this.setScanMaxPoolInitialLiquidityUsd = this.setScanMaxPoolInitialLiquidityUsd.bind(this)
    this.setScanMinPoolTotalLiquidityUsd = this.setScanMinPoolTotalLiquidityUsd.bind(this)
    this.setScanMaxPoolTotalLiquidityUsd = this.setScanMaxPoolTotalLiquidityUsd.bind(this)
    this.setScanMinPoolTotalTxs = this.setScanMinPoolTotalTxs.bind(this)
    this.setScanMaxPoolTotalTxs = this.setScanMaxPoolTotalTxs.bind(this)
    this.setScanMinTokenTotalHolders = this.setScanMinTokenTotalHolders.bind(this)
    this.setScanMaxTokenTotalHolders = this.setScanMaxTokenTotalHolders.bind(this)
    this.setScanMinTokenTotalMarketCapUsd = this.setScanMinTokenTotalMarketCapUsd.bind(this)
    this.setScanMaxTokenTotalMarketCapUsd = this.setScanMaxTokenTotalMarketCapUsd.bind(this)
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

  setScanPoolCreationTimeRange(value) {
    this.setState({
      scanPoolCreationTimeRange: value
    })
  }

  setScanMinTokenPriceUsd(value) {
    this.setState({
      scanMinTokenPriceUsd: value
    })
  }

  setScanMaxTokenPriceUsd(value) {
    this.setState({
      scanMaxTokenPriceUsd: value
    })
  }

  setScanMinPoolInitialLiquidityUsd(value) {
    this.setState({
      scanMinPoolInitialLiquidityUsd: value
    })
  }

  setScanMaxPoolInitialLiquidityUsd(value) {
    this.setState({
      scanMaxPoolInitialLiquidityUsd: value
    })
  }

  setScanMinPoolTotalLiquidityUsd(value) {
    this.setState({
      scanMinPoolTotalLiquidityUsd: value
    })
  }

  setScanMaxPoolTotalLiquidityUsd(value) {
    this.setState({
      scanMaxPoolTotalLiquidityUsd: value
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

  setScanMinTokenTotalMarketCapUsd(value) {
    this.setState({
      scanMinTokenTotalMarketCapUsd: value
    })
  }

  setScanMaxTokenTotalMarketCapUsd(value) {
    this.setState({
      scanMaxTokenTotalMarketCapUsd: value
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
        scanPoolCreationTimeRange: config['scan_pool_creation_time_range'] / (60 * 60),
        scanMinPoolInitialLiquidityUsd: config['scan_min_pool_initial_liquidity_usd'],
        scanMaxPoolInitialLiquidityUsd: config['scan_max_pool_initial_liquidity_usd'],
        scanMinPoolTotalLiquidityUsd: config['scan_min_pool_total_liquidity_usd'],
        scanMaxPoolTotalLiquidityUsd: config['scan_max_pool_total_liquidity_usd'],
        scanMinPoolTotalTxs: config['scan_min_pool_total_txs'],
        scanMaxPoolTotalTxs: config['scan_max_pool_total_txs'],
        scanMinTokenTotalHolders: config['scan_min_token_total_holders'],
        scanMaxTokenTotalHolders: config['scan_max_token_total_holders'],
        scanMinTokenTotalMarketCapUsd: config['scan_min_token_total_market_cap_usd'],
        scanMaxTokenTotalMarketCapUsd: config['scan_max_token_total_market_cap_usd'],
        scanMinVolume24H: config['scan_min_volume_24h'],
        scanMaxVolume24H: config['scan_max_volume_24h'],
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
        scan_pool_creation_time_range: this.state.scanPoolCreationTimeRange ? this.state.scanPoolCreationTimeRange * (60 * 60) : null,
        scan_min_token_price_usd: this.state.scanMinTokenPriceUsd ? this.state.scanMinTokenPriceUsd : null,
        scan_min_pool_initial_liquidity_usd: this.state.scanMinPoolInitialLiquidityUsd ? this.state.scanMinPoolInitialLiquidityUsd : null,
        scan_max_pool_initial_liquidity_usd: this.state.scanMaxPoolInitialLiquidityUsd ? this.state.scanMaxPoolInitialLiquidityUsd : null,
        scan_min_pool_total_liquidity_usd: this.state.scanMinPoolTotalLiquidityUsd ? this.state.scanMinPoolTotalLiquidityUsd : null,
        scan_max_pool_total_liquidity_usd: this.state.scanMaxPoolTotalLiquidityUsd ? this.state.scanMaxPoolTotalLiquidityUsd : null,
        scan_min_pool_total_txs: this.state.scanMinPoolTotalTxs ? this.state.scanMinPoolTotalTxs : null,
        scan_max_pool_total_txs: this.state.scanMaxPoolTotalTxs ? this.state.scanMaxPoolTotalTxs : null,
        scan_min_token_total_holders: this.state.scanMinTokenTotalHolders ? this.state.scanMinTokenTotalHolders : null,
        scan_max_token_total_holders: this.state.scanMaxTokenTotalHolders ? this.state.scanMaxTokenTotalHolders : null,
        scan_min_token_total_market_cap_usd: this.state.scanMinTokenTotalMarketCapUsd ? this.state.scanMinTokenTotalMarketCapUsd : null,
        scan_max_token_total_market_cap_usd: this.state.scanMaxTokenTotalMarketCapUsd ? this.state.scanMaxTokenTotalMarketCapUsd : null,
        scan_min_volume_24h: this.state.scanMinVolume24H ? this.state.scanMinVolume24H : null,
        scan_max_volume_24h: this.state.scanMaxVolume24H ? this.state.scanMaxVolume24H : null,
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
                value={this.state.poolCreationTimeRange ? this.state.poolCreationTimeRange : ""}
                onChange={(event) => {
                  this.setPoolCreationTimeRange(event.target.value);
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
                value={this.state.poolCreationTimeRange ? this.state.poolCreationTimeRange : ""}
                onChange={(event) => {
                  this.setPoolCreationTimeRange(event.target.value);
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
                value={this.state.scanMinPoolInitialLiquidityUsd ? this.state.scanMinPoolInitialLiquidityUsd : ""}
                onChange={(event) => {
                  this.setMinPoolInitialLiquidityUsd(event.target.value);
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
                value={this.state.scanMaxPoolInitialLiquidityUsd ? this.state.scanMaxPoolInitialLiquidityUsd : ""}
                onChange={(event) => {
                  this.setMaxPoolInitialLiquidityUsd(event.target.value);
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
                value={this.state.scanMinPoolTotalLiquidityUsd ? this.state.scanMinPoolTotalLiquidityUsd : ""}
                onChange={(event) => {
                  this.setMinPoolTotalLiquidityUsd(event.target.value);
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
                value={this.state.scanMaxPoolTotalLiquidityUsd ? this.state.scanMaxPoolTotalLiquidityUsd : ""}
                onChange={(event) => {
                  this.setMaxPoolTotalLiquidityUsd(event.target.value);
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
                value={this.state.scanMinTokenTotalMarketCapUsd ? this.state.scanMinTokenTotalMarketCapUsd : ""}
                onChange={(event) => {
                  this.setMinTokenTotalMarketCapUsd(event.target.value);
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
                value={this.state.scanMaxTokenTotalMarketCapUsd ? this.state.scanMaxTokenTotalMarketCapUsd : ""}
                onChange={(event) => {
                  this.setMaxTokenTotalMarketCapUsd(event.target.value);
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