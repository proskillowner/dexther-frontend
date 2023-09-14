import React, { useContext } from "react";
import { withTranslation } from 'react-i18next';
import i18next from 'i18next';
import Box from '@mui/material/Box';
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import { DataGrid, gridPageSizeSelector, gridPaginationModelSelector, gridRowCountSelector, gridClasses } from '@mui/x-data-grid';
import CopyAll from '@mui/icons-material/CopyAll';
import ArrowDown from '@mui/icons-material/ArrowDownward';
import ArrowUp from '@mui/icons-material/ArrowUpward';
import Alert from '@mui/material/Alert';
import Fab from '@mui/material/Fab';
import FilterIcon from '@mui/icons-material/FilterList';
import { useNavigate } from 'react-router-dom';
import cgreen from "../media/c_green.svg"
import rgreen from "../media/r_green.svg"
import honeypot from "../media/honeypot.png"
import { SERVER_URL, API_GET_CHAIN } from '../Api.js'

import MainContext, { GET_POOL, GET_POOL_LOG } from "../context/MainContext";

import {
  useGridApiContext,
  useGridSelector
} from "@mui/x-data-grid";
import TablePagination from "@mui/material/TablePagination";
import Filter from "./Filter";

export const withNavigation = (Component) => {
  return props => <Component {...props} navigate={useNavigate()} />;
}

const formatDecimal = (value) => {
  let nf = new Intl.NumberFormat('en-US');

  var s = ""
  var p = Math.abs(value)
  if (p > 1000000000) {
    s = nf.format((value / 1000000000.0).toFixed(2)) + "B"
  }
  else
    if (p > 1000000) {
      s = nf.format((value / 1000000.0).toFixed(2)) + "M"
    }
    else
      if (p > 1000) {
        s = nf.format((value / 1000.0).toFixed(2)) + "K"
      }
      else {
        s = nf.format((value).toFixed(2))
      }

  return s
}

const formatCurrency = (value, maximumFractionDigits) => {
  let nf = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits });
  return value ? nf.format(value) : "-";
}

const formatMoney = (value) => {
  let nf = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

  var s = ""
  var p = Math.abs(value)
  if (p > 1000000000) {
    s = nf.format((value / 1000000000.0).toFixed(2)) + "B"
  }
  else
    if (p > 1000000) {
      s = nf.format((value / 1000000.0).toFixed(2)) + "M"
    }
    else
      if (p > 1000) {
        s = nf.format((value / 1000.0).toFixed(2)) + "K"
      }
      else {
        s = nf.format((value).toFixed(2))
      }

  return s
}

const formatPct = (value) => {
  let nf = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });
  return value ? (nf.format(value * 100) + "%") : "0%";
}

const COLUMN_OPTIONS = {
  headerClassName: 'super-app-theme--header',
  filterable: true,
  hideable: true,
  sortable: true,
  sortingOrder: ['asc', 'desc'],
  disableColumnMenu: false,
}

const COLUMN_ID = {
  ...COLUMN_OPTIONS,
  field: 'id',
  renderHeader: (params) => (
    <strong>
      {'NO'}
    </strong>
  ),
  width: 50,
  headerAlign: 'right',
  align: "right",
  filterable: false,
  hideable: false,
  sortable: false,
  renderCell: (params) => (
    <div>
      {params.value}
    </div>
  ),
}

const COLUMN_CHAIN_NAME = {
  ...COLUMN_OPTIONS,
  field: 'chain_name',
  renderHeader: (params) => (
    <strong>
      {i18next.t("column_chain")}
    </strong>
  ),
  width: 100,
  sortable: false,
  renderCell: (params) => (
    <div>
      Ethereum
    </div>
  ),
}

const COLUMN_PROTOCOL = {
  ...COLUMN_OPTIONS,
  field: 'token_symbol',
  renderHeader: (params) => (
    <strong>
      {i18next.t("column_name_protocol")}
      <span id="arrowTokenSymbolDown" style={{ display: "none" }}>
        <ArrowDown style={{ verticalAlign: "middle" }}></ArrowDown>
      </span>
      <span id="arrowTokenSymbolUp" style={{ display: "none" }}>
        <ArrowUp style={{ verticalAlign: "middle" }}></ArrowUp>
      </span>
    </strong>
  ),
  width: 150,
  renderCell: (params) => (
    <div>
      <div onClick={() => history(params)} className="App-link"><u>{params.value}</u></div>
      <div style={{ marginTop: 4 }}>
        <img src={cgreen} style={{ width: 16, height: 16, marginLeft: 5, display: params.row.token_contract_verified == 1 ? 'inline' : 'none' }} />
        <img src={rgreen} style={{ width: 16, height: 16, marginLeft: 5, display: params.row.token_contract_renounced == 1 ? 'inline' : 'none' }} />
        {/* <img src={honeypot} style={{ marginLeft: params.row.hist_contract_verified == 1 || params.row.hist_contract_verified == 1 ? 6 : 0, width: 16, height: 16, display: params.row.hist_honey_pot == 1 ? 'inline' : 'none' }} /> */}
      </div>
      <div style={{ marginTop: 4, display: params.row.hist_buy_tax != null && params.row.hist_sell_tax != null ? "inline" : "none" }}>
        <span>BT: {formatPct(params.row.hist_buy_tax)}</span>
        &nbsp;&nbsp;
        <span>ST: {formatPct(params.row.hist_sell_tax)}</span>
      </div>
    </div>
  ),
}

const COLUMN_POOL_INDEX = {
  ...COLUMN_OPTIONS,
  field: 'pool_index',
  renderHeader: (params) => (
    <strong>
      {i18next.t("column_pool_index")}
      <span id="arrowPoolIndexDown" style={{ display: "none" }}>
        <ArrowDown style={{ verticalAlign: "middle" }}></ArrowDown>
      </span>
      <span id="arrowPoolIndexUp" style={{ display: "none" }}>
        <ArrowUp style={{ verticalAlign: "middle" }}></ArrowUp>
      </span>
    </strong>
  ),
  width: 100,
  headerAlign: 'right',
  align: "right",
  renderCell: (params) => (
    <div>
      {params.value}
    </div>
  ),
}

const COLUMN_TOKEN_ADDRESS = {
  ...COLUMN_OPTIONS,
  field: 'token_address',
  renderHeader: (params) => (
    <strong>
      {i18next.t("column_token_address")}
    </strong>
  ),
  width: 200,
  sortable: false,
  renderCell: (params) => (
    <div>
      {params.value.substring(0, 15)}...
      <CopyAll onClick={() => copy(params)}
        sx={{ width: 16, height: 16, cursor: "pointer" }}
        aria-label="dclose"
      >
      </CopyAll>
      <div>
        <a href="#" onClick={() => etherscan_token(params.value)} className="App-link" style={{ marginRight: 5 }} target="_blank">ETHERSCAN</a>
        <a href="#" onClick={() => tokensniffer(params.value)} className="App-link" style={{ marginLeft: 5 }} target="_blank">TOKENSNIFFER</a>
      </div>
    </div>
  ),
}

const COLUMN_POOL_ADDRESS = {
  ...COLUMN_OPTIONS,
  field: 'pool_address',
  renderHeader: (params) => (
    <strong>
      {i18next.t("column_pool_address")}
    </strong>
  ),
  width: 200,
  sortable: false,
  renderCell: (params) => (
    <div>
      {params.value.substring(0, 15)}...
      <CopyAll onClick={() => copy(params)}
        sx={{ width: 16, height: 16, cursor: "pointer" }}
        aria-label="dclose"
      >
      </CopyAll>
      <div>
        <a href="#" onClick={() => etherscan(params.value)} className="App-link" style={{ marginRight: 5 }} target="_blank">ETHERSCAN</a>
        <a href="#" onClick={() => dextools(params)} className="App-link" style={{ marginLeft: 5 }} target="_blank">DEXTOOLS</a>
      </div>
    </div>
  ),
}

const COLUMN_POOL_CREATION_TIME = {
  ...COLUMN_OPTIONS,
  field: 'pool_creation_time',
  renderHeader: (params) => (
    <strong>
      {i18next.t("column_creation_time")}
      <span id="arrowPoolCreationTimeDown" style={{ display: "none" }}>
        <ArrowDown style={{ verticalAlign: "middle" }}></ArrowDown>
      </span>
      <span id="arrowPoolCreationTimeUp" style={{ display: "none" }}>
        <ArrowUp style={{ verticalAlign: "middle" }}></ArrowUp>
      </span>
    </strong>
  ),
  width: 150,
  headerAlign: 'center',
  align: "center",
  renderCell: (params) => {
    var mydate = new Date(params.value * 1000);
    return mydate.toLocaleDateString("en-US") + " " + mydate.toLocaleTimeString("en-US")
  }
}

const COLUMN_LOG_TIME = {
  ...COLUMN_OPTIONS,
  field: 'log_time',
  renderHeader: (params) => (
    <strong>
      {i18next.t("column_history_time")}
      <span id="arrowLogTimeDown" style={{ display: "none" }}>
        <ArrowDown style={{ verticalAlign: "middle" }}></ArrowDown>
      </span>
      <span id="arrowLogTimeUp" style={{ display: "none" }}>
        <ArrowUp style={{ verticalAlign: "middle" }}></ArrowUp>
      </span>
    </strong>
  ),
  width: 150,
  headerAlign: 'center',
  align: "center",
  renderCell: (params) => {
    var mydate = new Date(params.value * 1000);
    return mydate.toLocaleDateString("en-US") + " " + mydate.toLocaleTimeString("en-US")
  }
}

const COLUMN_TOKEN_PRICE = {
  ...COLUMN_OPTIONS,
  type: 'number',
  field: 'token_price_usd',
  renderHeader: (params) => (
    <strong>
      {i18next.t("column_price")}
      <span id="arrowTokenPriceDown" style={{ display: "none" }}>
        <ArrowDown style={{ verticalAlign: "middle" }}></ArrowDown>
      </span>
      <span id="arrowTokenPriceUp" style={{ display: "none" }}>
        <ArrowUp style={{ verticalAlign: "middle" }}></ArrowUp>
      </span>
    </strong>
  ),
  width: 150,
  renderCell: (params) => (
    <div style={{ textAlign: "right" }}>
      <div>
        <a href="#" onClick={() => dextools(params)} className="App-link" target="_blank">{formatCurrency(params.row.pool_total_liquidity_usd > 1 ? params.value : 0, 12)}</a>
      </div>
    </div>
  )
}

const COLUMN_POOL_AMOUNT = {
  ...COLUMN_OPTIONS,
  type: 'number',
  field: 'pool_initial_liquidity_usd',
  renderHeader: (params) => (
    <strong>
      {i18next.t("column_pool_amount")}
      <span id="arrowPoolInitialLiquidityDown" style={{ display: "none" }}>
        <ArrowDown style={{ verticalAlign: "middle" }}></ArrowDown>
      </span>
      <span id="arrowPoolInitialLiquidityUp" style={{ display: "none" }}>
        <ArrowUp style={{ verticalAlign: "middle" }}></ArrowUp>
      </span>
    </strong>
  ),
  width: 150,
  renderCell: (params) => {
    return formatCurrency(params.value > 1 ? params.value : 0, 6);
  }
}

const COLUMN_POOL_TOTAL_LIQUIDITY = {
  ...COLUMN_OPTIONS,
  type: 'number',
  field: 'pool_total_liquidity_usd',
  renderHeader: (params) => (
    <strong>
      {i18next.t("column_total_liquidity")}
      <span id="arrowPoolTotalLiquidityDown" style={{ display: "none" }}>
        <ArrowDown style={{ verticalAlign: "middle" }}></ArrowDown>
      </span>
      <span id="arrowPoolTotalLiquidityUp" style={{ display: "none" }}>
        <ArrowUp style={{ verticalAlign: "middle" }}></ArrowUp>
      </span>
    </strong>
  ),
  width: 150,
  renderCell: (params) => {
    return formatCurrency(params.value > 1 ? params.value : 0, 0);
  }
}

const COLUMN_POOL_TOTAL_TXS = {
  ...COLUMN_OPTIONS,
  type: 'number',
  field: 'pool_total_txs',
  renderHeader: (params) => (
    <strong>
      {i18next.t("column_total_txs")}
      <span id="arrowPoolTotalTxsDown" style={{ display: "none" }}>
        <ArrowDown style={{ verticalAlign: "middle" }}></ArrowDown>
      </span>
      <span id="arrowPoolTotalTxsUp" style={{ display: "none" }}>
        <ArrowUp style={{ verticalAlign: "middle" }}></ArrowUp>
      </span>
    </strong>
  ),
  width: 100,
  renderCell: (params) => {
    let nf = new Intl.NumberFormat('en-US');
    return params.value ? nf.format(params.value) : "-";
  }
}

const COLUMN_TOKEN_TOTAL_HOLDERS = {
  ...COLUMN_OPTIONS,
  type: 'number',
  field: 'token_total_holders',
  renderHeader: (params) => (
    <strong>
      {i18next.t("column_holders")}
      <span id="arrowTokenTotalHoldersDown" style={{ display: "none" }}>
        <ArrowDown style={{ verticalAlign: "middle" }}></ArrowDown>
      </span>
      <span id="arrowTokenTotalHoldersUp" style={{ display: "none" }}>
        <ArrowUp style={{ verticalAlign: "middle" }}></ArrowUp>
      </span>
    </strong>
  ),
  width: 100,
  renderCell: (params) => {
    let nf = new Intl.NumberFormat('en-US');
    return params.value ? (nf.format(params.value)) : "-";
  }
}

const COLUMN_TOKEN_TOTAL_SUPPLY = {
  ...COLUMN_OPTIONS,
  type: 'number',
  field: 'token_total_supply',
  renderHeader: (params) => (
    <strong>
      {i18next.t("column_total_supply")}
      <span id="arrowTokenTotalSupplyDown" style={{ display: "none" }}>
        <ArrowDown style={{ verticalAlign: "middle" }}></ArrowDown>
      </span>
      <span id="arrowTokenTotalSupplyUp" style={{ display: "none" }}>
        <ArrowUp style={{ verticalAlign: "middle" }}></ArrowUp>
      </span>
    </strong>
  ),
  width: 150,
  renderCell: (params) => {
    return params.value ? formatDecimal(params.value) : "-";
  }
}

const COLUMN_TOKEN_TOTAL_MARKET_CAP = {
  ...COLUMN_OPTIONS,
  field: 'token_total_market_cap_usd',
  renderHeader: (params) => (
    <strong>
      {i18next.t("column_total_market_cap")}
      <span id="arrowTokenTotalMarketCapDown" style={{ display: "none" }}>
        <ArrowDown style={{ verticalAlign: "middle" }}></ArrowDown>
      </span>
      <span id="arrowTokenTotalMarketCapUp" style={{ display: "none" }}>
        <ArrowUp style={{ verticalAlign: "middle" }}></ArrowUp>
      </span>
    </strong>
  ),
  width: 150,
  renderCell: (params) => {
    return params.value ? formatMoney(params.value) : "-";
  }
}

const COLUMN_VOLUME_1H = {
  ...COLUMN_OPTIONS,
  type: 'number',
  field: 'volume_1h',
  renderHeader: (params) => (
    <strong>
      {i18next.t("column_volume_1h")}
      <span id="arrowVolume1HDown" style={{ display: "none" }}>
        <ArrowDown style={{ verticalAlign: "middle" }}></ArrowDown>
      </span>
      <span id="arrowVolume1HUp" style={{ display: "none" }}>
        <ArrowUp style={{ verticalAlign: "middle" }}></ArrowUp>
      </span>
    </strong>
  ),
  width: 150,
  renderCell: (params) => {
    return params.value ? formatMoney(params.value) : "-";
  }
}

const COLUMN_VOLUME_24H = {
  ...COLUMN_OPTIONS,
  type: 'number',
  field: 'volume_24h',
  renderHeader: (params) => (
    <strong>
      {i18next.t("column_volume_24h")}
      <span id="arrowVolume24HDown" style={{ display: "none" }}>
        <ArrowDown style={{ verticalAlign: "middle" }}></ArrowDown>
      </span>
      <span id="arrowVolume24HUp" style={{ display: "none" }}>
        <ArrowUp style={{ verticalAlign: "middle" }}></ArrowUp>
      </span>
    </strong>
  ),
  width: 150,
  renderCell: (params) => {
    return params.value ? formatMoney(params.value) : "-";
  }
}

const COLUMN_DEXTSCORE = {
  ...COLUMN_OPTIONS,
  type: 'number',
  field: 'dextscore',
  renderHeader: (params) => (
    <strong>
      {i18next.t("column_dexscore")}
      <span id="arrowDextScoreDown" style={{ display: "none" }}>
        <ArrowDown style={{ verticalAlign: "middle" }}></ArrowDown>
      </span>
      <span id="arrowDextScoreUp" style={{ display: "none" }}>
        <ArrowUp style={{ verticalAlign: "middle" }}></ArrowUp>
      </span>
    </strong>
  ),
  width: 100,
  renderCell: (params) => {
    let nf = new Intl.NumberFormat('en-US');
    return params.value ? nf.format(params.value) : "-";
  }
}

const pool_columns = [
  COLUMN_ID,
  COLUMN_CHAIN_NAME,
  COLUMN_PROTOCOL,
  COLUMN_POOL_INDEX,
  COLUMN_TOKEN_ADDRESS,
  COLUMN_POOL_ADDRESS,
  COLUMN_POOL_CREATION_TIME,
  COLUMN_TOKEN_PRICE,
  COLUMN_POOL_AMOUNT,
  COLUMN_POOL_TOTAL_LIQUIDITY,
  COLUMN_POOL_TOTAL_TXS,
  COLUMN_TOKEN_TOTAL_HOLDERS,
  COLUMN_TOKEN_TOTAL_SUPPLY,
  COLUMN_TOKEN_TOTAL_MARKET_CAP,
  COLUMN_VOLUME_1H,
  COLUMN_VOLUME_24H,
  COLUMN_DEXTSCORE,
]

const pool_log_columns = [
  COLUMN_ID,
  COLUMN_CHAIN_NAME,
  COLUMN_LOG_TIME,
  COLUMN_TOKEN_PRICE,
  COLUMN_POOL_AMOUNT,
  COLUMN_POOL_TOTAL_LIQUIDITY,
  COLUMN_POOL_TOTAL_TXS,
  COLUMN_TOKEN_TOTAL_HOLDERS,
  COLUMN_TOKEN_TOTAL_SUPPLY,
  COLUMN_TOKEN_TOTAL_MARKET_CAP,
  COLUMN_VOLUME_1H,
  COLUMN_VOLUME_24H,
  COLUMN_DEXTSCORE,
]

const history = (params) => {
  window.gridComponent.history(params)
}

const handleChangePage = (event, newPage) => {
  window.gridComponent.setPage(newPage)
}

const handleChangeRowsPerPage = (event) => {
  window.gridComponent.setPageSize(event.target.value)
}

const copy = (params) => {
  window.gridComponent.onCellClick(params)
}

const etherscan = (params) => {
  window.gridComponent.etherscan(params)
}

const etherscan_token = (params) => {
  window.gridComponent.etherscan_token(params)
}

const tokensniffer = (params) => {
  window.gridComponent.tokensniffer(params)
}

const dextools = (params) => {
  window.gridComponent.dextools(params)
}

var sortModel = null
var pageModel = null
var scrollTimeout = null
var filterKeyIndex = 0

export function CustomPagination() {
  const apiRef = useGridApiContext();
  const rowCount = useGridSelector(apiRef, gridRowCountSelector);
  const model = useGridSelector(apiRef, gridPaginationModelSelector);

  return (
    <TablePagination
      component="div"
      count={rowCount}
      page={model.page}
      onPageChange={handleChangePage}
      rowsPerPage={model.pageSize}
      onRowsPerPageChange={handleChangeRowsPerPage}
      sx={{
        '.MuiInputBase-root': {
          backgroundColor: 'black',
        },
        '.MuiTablePagination-toolbar': {
          color: 'white',
        },
        '.MuiBox-root': {
          color: 'black',

          '& .MuiSvgIcon-root': {
            color: 'white',
          },
        },
      }}
    />
  );
}

class Grid extends React.Component {
  static contextType = MainContext
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    super(props)
    window.gridComponent = this
    this.state = {
      rows: [],
      rowCount: 0,
      sortField: this.props.hist != "true" ? 'pool_creation_time' : 'log_time',
      sortDir: "desc",
      page: 0,
      pageSize: 50,
      copyText: "",
      alertCopiedOpen: "none",
      loading: false,
      filterButtonDisplay: 'inline',
      filterOpen: "none",
      filterModel: null,
      chains: [],
      filterKey: 'filterKey'
    }

    this.onCellClick = this.onCellClick.bind(this)
    this.closeAlertCopiedOpen = this.closeAlertCopiedOpen.bind(this)
    this.loadData = this.loadData.bind(this)
    this.history = this.history.bind(this)
    this.listenToScroll = this.listenToScroll.bind(this)
    this.onSrollStop = this.onSrollStop.bind(this)
    this.showFilter = this.showFilter.bind(this)
    this.hideFilter = this.hideFilter.bind(this)
    this.onFilter = this.onFilter.bind(this)
  }

  componentDidMount() {
    this.loadData()
    window.addEventListener("scroll", this.listenToScroll);
  }

  showFilter() {
    this.setState({
      filterOpen: "inline"
    })

    this.loadChains()
  }

  hideFilter() {
    this.setState({
      filterOpen: "none"
    })
  }

  onFilter(model) {
    this.setState({
      filterOpen: "none",
      filterModel: model
    }, this.loadData)

  }

  listenToScroll(e) {
    this.setState({
      filterButtonDisplay: "none"
    }, this.checkScrollStop)

  }

  checkScrollStop() {
    if (scrollTimeout != null) {
      clearTimeout(scrollTimeout)
    }
    scrollTimeout = setTimeout(this.onSrollStop, 100)
  }

  onSrollStop() {
    this.setState({
      filterButtonDisplay: "inline"
    })
  }

  handleSortModelChange = (model) => {
    sortModel = model

    if (pageModel == null) {
      pageModel = new Object()
      pageModel.page = 0
      pageModel.pageSize = this.state.pageSize
    }
    else {
      pageModel.page = 0
    }
    this.loadData()
  }

  handlePageModelChange = (model) => {
    pageModel = model
    this.loadData()
  }

  setPageSize(pageSize) {
    pageModel = new Object()
    pageModel.page = 0
    pageModel.pageSize = pageSize

    this.loadData()
  }

  history(params) {
    this.props.navigate("/history?token=" + params.row.token_address + "&pair=" + params.row.pool_address, { replace: false });
  }

  etherscan(address) {
    window.open("https://etherscan.io/address/" + address, '_blank', 'noopener,noreferrer')
  }

  etherscan_token(address) {
    window.open("https://etherscan.io/token/" + address, '_blank', 'noopener,noreferrer')
  }

  tokensniffer(params) {
    window.open("https://tokensniffer.com/token/eth/" + params.row.token_address, '_blank', 'noopener,noreferrer')
  }

  dextools(params) {
    window.open("https://www.dextools.io/app/en/ether/pair-explorer/" + params.row.pool_address, '_blank', 'noopener,noreferrer')
  }

  onCellClick(params) {
    navigator.clipboard.writeText(params.value)
    this.setState({
      alertCopiedOpen: "block"
    })
    setTimeout(this.closeAlertCopiedOpen, 1000)
  }

  closeAlertCopiedOpen() {
    this.setState({
      alertCopiedOpen: "none"
    })
  }

  setPage(newPage) {
    if (pageModel == null) {
      pageModel = new Object()
      pageModel.page = newPage
      pageModel.pageSize = this.state.pageSize
    }
    else {
      pageModel.page = newPage
    }

    this.loadData()
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
          }
        )
      })
      .catch((err) => {
      })
  }

  async loadData(keepPage = false) {
    this.setState({
      loading: true
    })

    if (sortModel == null) {
      sortModel = {
        sortField: this.state.sortField,
        sortDir: this.state.sortDir,
      }
    }

    if (pageModel == null) {
      pageModel = new Object()
      pageModel.page = 0
      pageModel.pageSize = this.state.pageSize
    }

    let tableData = {}

    if (keepPage && this.context.tableData && this.context.tableData.totalCount) {
      tableData = this.context.tableData
    } else {
      if (this.props.hist === "true") {
        tableData = await this.context.loadTableData({
          chain_id: 1,
          pool_address: this.props.pair,
          filterModel: this.state.filterModel,
          sortModel,
          pageModel,
          token: '',
          trail: '',
        })
      } else {
        tableData = await this.context.loadTableData({
          chain_id: 1,
          pool_address: null,
          filterModel: this.state.filterModel,
          sortModel,
          pageModel,
          token: '',
          trail: '',
        })
      }
    }

    this.setState(
      {
        rows: tableData.rowData,
        rowCount: tableData.totalCount,
        page: pageModel.page,
        pageSize: pageModel.pageSize,
        loading: false,
      }
    )

    // this.setSortIcon(sortModel)        
    // this.props.updateData(data)
  }
/*
  setSortIcon(data) {
    var arrowTokenSymbolDown = window.document.getElementById("arrowTokenSymbolDown")
    if (arrowTokenSymbolDown) {
      arrowTokenSymbolDown.style.display = data.sortField == "token_symbol" && data.sortDir == "desc" ? "inline" : "none"
    }

    var arrowTokenSymbolUp = window.document.getElementById("arrowTokenSymbolUp")
    if (arrowTokenSymbolUp) {
      arrowTokenSymbolUp.style.display = data.sortField == "token_symbol" && data.sortDir == "asc" ? "inline" : "none"
    }

    var arrowPoolIndexDown = window.document.getElementById("arrowPoolIndexDown")
    if (arrowPoolIndexDown) {
      arrowPoolIndexDown.style.display = data.sortField == "pool_index" && data.sortDir == "desc" ? "inline" : "none"
    }

    var arrowPoolIndexUp = window.document.getElementById("arrowPoolIndexUp")
    if (arrowPoolIndexUp) {
      arrowPoolIndexUp.style.display = data.sortField == "pool_index" && data.sortDir == "asc" ? "inline" : "none"
    }

    var arrowPoolCreationTimeDown = window.document.getElementById("arrowPoolCreationTimeDown")
    if (arrowPoolCreationTimeDown) {
      arrowPoolCreationTimeDown.style.display = data.sortField == "pool_creation_time" && data.sortDir == "desc" ? "inline" : "none"
    }

    var arrowPoolCreationTimeUp = window.document.getElementById("arrowPoolCreationTimeUp")
    if (arrowPoolCreationTimeUp) {
      arrowPoolCreationTimeUp.style.display = data.sortField == "pool_creation_time" && data.sortDir == "asc" ? "inline" : "none"
    }

    var arrowLogTimeDown = window.document.getElementById("arrowLogTimeDown")
    if (arrowLogTimeDown) {
      arrowLogTimeDown.style.display = data.sortField == "log_time" && data.sortDir == "desc" ? "inline" : "none"
    }

    var arrowLogTimeUp = window.document.getElementById("arrowLogTimeUp")
    if (arrowLogTimeUp) {
      arrowLogTimeUp.style.display = data.sortField == "log_time" && data.sortDir == "asc" ? "inline" : "none"
    }

    var arrowTokenPricenDown = window.document.getElementById("arrowTokenPriceDown")
    if (arrowTokenPricenDown) {
      arrowTokenPricenDown.style.display = data.sortField == "token_price_usd" && data.sortDir == "desc" ? "inline" : "none"
    }

    var arrowTokenPricenUp = window.document.getElementById("arrowTokenPricenUp")
    if (arrowTokenPricenUp) {
      arrowTokenPricenUp.style.display = data.sortField == "token_price_usd" && data.sortDir == "asc" ? "inline" : "none"
    }

    var arrowPoolInitialLiquidityDown = window.document.getElementById("arrowPoolInitialLiquidityDown")
    if (arrowPoolInitialLiquidityDown) {
      arrowPoolInitialLiquidityDown.style.display = data.sortField == "pool_initial_liquidity_usd" && data.sortDir == "desc" ? "inline" : "none"
    }

    var arrowPoolInitialLiquidityUp = window.document.getElementById("arrowPoolInitialLiquidityUp")
    if (arrowPoolInitialLiquidityUp) {
      arrowPoolInitialLiquidityUp.style.display = data.sortField == "pool_initial_liquidity_usd" && data.sortDir == "asc" ? "inline" : "none"
    }

    var arrowPoolTotalLiquidityDown = window.document.getElementById("arrowPoolTotalLiquidityDown")
    if (arrowPoolTotalLiquidityDown) {
      arrowPoolTotalLiquidityDown.style.display = data.sortField == "pool_total_liquidity_usd" && data.sortDir == "desc" ? "inline" : "none"
    }

    var arrowPoolTotalLiquidityUp = window.document.getElementById("arrowPoolTotalLiquidityUp")
    if (arrowPoolTotalLiquidityUp) {
      arrowPoolTotalLiquidityUp.style.display = data.sortField == "pool_total_liquidity_usd" && data.sortDir == "asc" ? "inline" : "none"
    }

    var arrowPoolTotalTxsDown = window.document.getElementById("arrowPoolTotalTxsDown")
    if (arrowPoolTotalTxsDown) {
      arrowPoolTotalTxsDown.style.display = data.sortField == "pool_total_txs" && data.sortDir == "desc" ? "inline" : "none"
    }

    var arrowPoolTotalTxsUp = window.document.getElementById("arrowTxUp")
    if (arrowPoolTotalTxsUp) {
      arrowPoolTotalTxsUp.style.display = data.sortField == "pool_total_txs" && data.sortDir == "asc" ? "inline" : "none"
    }

    var arrowTokenTotalHoldersDown = window.document.getElementById("arrowTokenTotalHoldersDown")
    if (arrowTokenTotalHoldersDown) {
      arrowTokenTotalHoldersDown.style.display = data.sortField == "token_total_holders" && data.sortDir == "desc" ? "inline" : "none"
    }

    var arrowTokenTotalHoldersUp = window.document.getElementById("arrowTokenTotalHoldersUp")
    if (arrowTokenTotalHoldersUp) {
      arrowTokenTotalHoldersUp.style.display = data.sortField == "token_total_holders" && data.sortDir == "asc" ? "inline" : "none"
    }

    var arrowTokenTotalSupplyDown = window.document.getElementById("arrowTokenTotalSupplyDown")
    if (arrowTokenTotalSupplyDown) {
      arrowTokenTotalSupplyDown.style.display = data.sortField == "token_total_supply" && data.sortDir == "desc" ? "inline" : "none"
    }

    var arrowTokenTotalSupplyUp = window.document.getElementById("arrowTokenTotalSupplyUp")
    if (arrowTokenTotalSupplyUp) {
      arrowTokenTotalSupplyUp.style.display = data.sortField == "token_total_supply" && data.sortDir == "asc" ? "inline" : "none"
    }

    var arrowTokenTotalMarketCapDown = window.document.getElementById("arrowTokenTotalMarketCapDown")
    if (arrowTokenTotalMarketCapDown) {
      arrowTokenTotalMarketCapDown.style.display = data.sortField == "token_total_market_cap_usd" && data.sortDir == "desc" ? "inline" : "none"
    }

    var arrowTokenTotalMarketCapUp = window.document.getElementById("arrowTokenTotalMarketCapUp")
    if (arrowTokenTotalMarketCapUp) {
      arrowTokenTotalMarketCapUp.style.display = data.sortField == "token_total_market_cap_usd" && data.sortDir == "asc" ? "inline" : "none"
    }

    var arrowVolume1HDown = window.document.getElementById("arrowVolume1HDown")
    if (arrowVolume1HDown) {
      arrowVolume1HDown.style.display = data.sortField == "volume_1h" && data.sortDir == "desc" ? "inline" : "none"
    }

    var arrowVolume1HUp = window.document.getElementById("arrowVolume1HUp")
    if (arrowVolume1HUp) {
      arrowVolume1HUp.style.display = data.sortField == "volume_1h" && data.sortDir == "asc" ? "inline" : "none"
    }

    var arrowVolume24HDown = window.document.getElementById("arrowVolume24HDown")
    if (arrowVolume24HDown) {
      arrowVolume24HDown.style.display = data.sortField == "volume_24h" && data.sortDir == "desc" ? "inline" : "none"
    }

    var arrowVolume24HUp = window.document.getElementById("arrowVolume24HUp")
    if (arrowVolume24HUp) {
      arrowVolume24HUp.style.display = data.sortField == "hist_volume_24h" && data.sortDir == "asc" ? "inline" : "none"
    }

    var arrowDextScoreDown = window.document.getElementById("arrowDextScoreDown")
    if (arrowDextScoreDown) {
      arrowDextScoreDown.style.display = data.sortField == "hist_dextscore" && data.sortDir == "desc" ? "inline" : "none"
    }

    var arrowDextScoreUp = window.document.getElementById("arrowDextScoreUp")
    if (arrowDextScoreUp) {
      arrowDextScoreUp.style.display = data.sortField == "hist_dextscore" && data.sortDir == "asc" ? "inline" : "none"
    }
  }
*/
  render() {
    const { t } = this.props;

    return <div>
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
              top: 64,
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
          columns={this.props.hist == "true" ? pool_log_columns : pool_columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 50,
                page: this.state.page
              },
            },
            sorting: {
              sortModel: [{ field: this.state.sortField, sort: this.state.sortDir }],
            },
          }}
          paginationModel={{
            pageSize: this.state.pageSize,
            page: this.state.page
          }}
          paginationMode="server"
          sortingMode="server"
          filterMode="server"
          onSortModelChange={this.handleSortModelChange}
          onPaginationModelChange={this.handlePageModelChange}
          rowCount={this.state.rowCount}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
          getRowClassName={(params) => `Data-Grid-Row`}
          loading={this.state.loading}
          getRowHeight={() => 'auto'}
          components={{
            Pagination: CustomPagination
          }}
        />
      </Box>
      <div style={{ position: "absolute", left: "50%", top: "80%", display: this.state.alertCopiedOpen }}><Alert sx={{ background: "#282c34", color: "#ffffff" }} severity="info">{t("text_copied")}</Alert></div>
      <div style={{ position: "fixed", left: "50%", top: "90%", display: this.state.filterButtonDisplay }}>
        <Fab variant="extended" onClick={this.showFilter}>
          <FilterIcon></FilterIcon>
          {t("filter")}
        </Fab>
      </div>
      <Filter
        key={this.state.filterKey}
        chains={this.state.chains}
        data={this.state.filterModel}
        open={this.state.filterOpen}
        hist={this.props.hist}
        onClose={this.hideFilter}
        onFilter={this.onFilter} />
    </div>
  }
}

export default withNavigation(withCookies(withTranslation()(Grid)));