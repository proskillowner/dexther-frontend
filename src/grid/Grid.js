import React, { useContext } from "react";
import { withTranslation } from 'react-i18next';
import i18next, { t } from 'i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import { DataGrid, gridPageSizeSelector, gridPaginationModelSelector, gridRowCountSelector, gridClasses, useGridApiRef, GridCellEditStopReasons } from '@mui/x-data-grid';
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
import { SERVER_URL, API_GET_CHAIN, API_GET_SCAN_SCORE, API_SET_SCAN_SCORE } from '../Api.js'

import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

import MainContext from "../context/MainContext";

import {
  useGridApiContext,
  useGridSelector
} from "@mui/x-data-grid";
import TablePagination from "@mui/material/TablePagination";
import Filter from "./Filter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCancel, faCheck, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Typography } from "@mui/material";

export const withNavigation = (Component) => {
  return props => <Component {...props} navigate={useNavigate()} />;
}

const formatCurrency = (value, maximumFractionDigits) => {
  value = value ? value : 0
  let nf = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits });
  return nf.format(value);
}

const formatDecimal = (value) => {
  value = value ? value : 0

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

const formatMoney = (value) => {
  value = value ? value : 0

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
  value = value ? value : 0
  let nf = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });
  return (nf.format(value * 100) + "%");
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
  type: 'number',
  field: 'id',
  renderHeader: (params) => (
    <strong>
      {'NO'}
    </strong>
  ),
  width: 40,
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
  minWidth: 80,
  sortable: false,
  renderCell: (params) => (
    <div>
      Ethereum
    </div>
  ),
}

const COLUMN_SYMBOL = {
  ...COLUMN_OPTIONS,
  field: 'token_symbol',
  renderHeader: (params) => (
    <strong>
      {i18next.t("column_token_symbol")}
      <span id="arrowTokenSymbolDown" style={{ display: "none" }}>
        <ArrowDown style={{ verticalAlign: "middle" }}></ArrowDown>
      </span>
      <span id="arrowTokenSymbolUp" style={{ display: "none" }}>
        <ArrowUp style={{ verticalAlign: "middle" }}></ArrowUp>
      </span>
    </strong>
  ),
  maxWidth: 200,
  minWidth: 120,
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
  type: 'number',
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
  minWidth: 80,
  renderCell: (params) => (
    <div>
      {params.value}
    </div>
  ),
}

const COLUMN_SCAN_SCORE = {
  ...COLUMN_OPTIONS,
  field: 'scan_score',
  type: 'number',
  renderHeader: (params) => (
    <strong>
      {i18next.t("column_scan_score")}
      <span id="arrowPoolIndexDown" style={{ display: "none" }}>
        <ArrowDown style={{ verticalAlign: "middle" }}></ArrowDown>
      </span>
      <span id="arrowPoolIndexUp" style={{ display: "none" }}>
        <ArrowUp style={{ verticalAlign: "middle" }}></ArrowUp>
      </span>
    </strong>
  ),
  minWidth: 80,
  editable: true,
  renderCell: (params) => (
    <div>
      {params.value ? params.value : ""}
      <a onClick={() => editScanScore(params)} className="App-link" style={{ marginLeft: 5 }}>
        <FontAwesomeIcon icon={faEdit} />
      </a>
    </div>
  ),
  renderEditCell: (params) => {
    return (
      <div style={{ width: '100%', position: 'relative' }}>
        <input type="number" style={{ width: '100%' }} value={params.value} onChange={e => params.api.setEditCellValue({ id: params.id, field: params.field, value: e.target.value })} />
        <div style={{ position: 'absolute', width: '100%', display: 'flex' }}>
          <Typography typeof="span" sx={(theme) => ({
            width: '50%', textAlign: 'center', padding: '2px', fontSize: '14px', color: 'green', backgroundColor: 'gray', opacity: 1, '&:hover': { opacity: 0.7 }
          })} onClick={async () => {
            if (params.value < -1 || params.value > 10) {
              alert('Scan score MUST between -1 and 10')
              return
            }

            const requestBody = {
              chain_id: 1,
              pool_address: params.row.pool_address,
              scan_score: parseInt(params.value),
            }

            await fetch(`${SERVER_URL}${API_SET_SCAN_SCORE}`, {
              method: 'POST',
              body: JSON.stringify(requestBody),
              headers: {
                'Content-type': 'application/json; charset=UTF-8',
              },
            })

            params.api.stopCellEditMode({ id: params.id, field: params.field })
          }}><FontAwesomeIcon icon={faCheck} /></Typography>
          <Typography typeof="span" sx={(theme) => ({
            width: '50%', textAlign: 'center', padding: '2px', fontSize: '14px', color: 'red', backgroundColor: 'gray', opacity: 1, '&:hover': { opacity: 0.7 }
          })} onClick={async () => {
            const requestBody = {
              chain_id: 1,
              pool_address: params.row.pool_address,
            }

            let response = await fetch(`${SERVER_URL}${API_GET_SCAN_SCORE}`, {
              method: 'POST',
              body: JSON.stringify(requestBody),
              headers: {
                'Content-type': 'application/json; charset=UTF-8',
              },
            })

            response = await response.json()

            params.api.setEditCellValue({ id: params.id, field: params.field, value: response.scan_score })

            params.api.stopCellEditMode({ id: params.id, field: params.field })
          }}><FontAwesomeIcon icon={faCancel} /></Typography>
        </div>
      </div>
    )
  }
}

const COLUMN_TOKEN_ADDRESS = {
  ...COLUMN_OPTIONS,
  field: 'token_address',
  renderHeader: (params) => (
    <strong>
      {i18next.t("column_token_address")}
    </strong>
  ),
  minWidth: 200,
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
  minWidth: 160,
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

const COLUMN_POOL_CREATION_TIMESTAMP = {
  ...COLUMN_OPTIONS,
  field: 'pool_creation_timestamp',
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
  minWidth: 140,
  headerAlign: 'center',
  align: "center",
  renderCell: (params) => {
    var mydate = new Date(params.value * 1000);
    return mydate.toLocaleDateString("en-US") + " " + mydate.toLocaleTimeString("en-US")
  }
}

const COLUMN_LOG_TIMESTAMP = {
  ...COLUMN_OPTIONS,
  field: 'log_timestamp',
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
  minWidth: 140,
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
  field: 'token_price',
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
  minWidth: 120,
  renderCell: (params) => (
    <div style={{ textAlign: "right" }}>
      <div>
        <a href="#" onClick={() => dextools(params)} className="App-link" target="_blank">{params.value ? formatCurrency(params.value, 12) : '-'}</a>
      </div>
    </div>
  )
}

const COLUMN_POOL_AMOUNT = {
  ...COLUMN_OPTIONS,
  type: 'number',
  field: 'pool_initial_amount',
  renderHeader: (params) => (
    <strong>
      {i18next.t("column_pool_amount")}
      <span id="arrowPoolInitialAmountDown" style={{ display: "none" }}>
        <ArrowDown style={{ verticalAlign: "middle" }}></ArrowDown>
      </span>
      <span id="arrowPoolInitialAmountUp" style={{ display: "none" }}>
        <ArrowUp style={{ verticalAlign: "middle" }}></ArrowUp>
      </span>
    </strong>
  ),
  minWidth: 120,
  renderCell: (params) => {
    return /*formatCurrency(params.value, 6)*/'-';
  }
}

const COLUMN_POOL_TOTAL_LIQUIDITY = {
  ...COLUMN_OPTIONS,
  type: 'number',
  field: 'pool_total_liquidity',
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
  minWidth: 120,
  renderCell: (params) => {
    return formatCurrency(params.value, 0);
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
  minWidth: 80,
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
  minWidth: 80,
  renderCell: (params) => {
    let nf = new Intl.NumberFormat('en-US');
    return params.value ? (nf.format(params.value)) : "-";
  }
}

const COLUMN_TOKEN_TOTAL_MARKET_CAP = {
  ...COLUMN_OPTIONS,
  type: 'number',
  field: 'token_total_market_cap',
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
  minWidth: 140,
  renderCell: (params) => {
    return params.value ? formatMoney(params.value) : "-";
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
  minWidth: 120,
  renderCell: (params) => {
    return params.value ? formatDecimal(params.value) : "-";
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
  minWidth: 120,
  renderCell: (params) => {
    return params.value ? formatMoney(params.value) : "-";
  }
}

const pool_columns = [
  COLUMN_ID,
  COLUMN_CHAIN_NAME,
  COLUMN_SYMBOL,
  COLUMN_POOL_INDEX,
  COLUMN_SCAN_SCORE,
  COLUMN_TOKEN_ADDRESS,
  COLUMN_POOL_ADDRESS,
  COLUMN_POOL_CREATION_TIMESTAMP,
  COLUMN_TOKEN_PRICE,
  COLUMN_POOL_AMOUNT,
  COLUMN_POOL_TOTAL_LIQUIDITY,
  COLUMN_POOL_TOTAL_TXS,
  COLUMN_TOKEN_TOTAL_HOLDERS,
  COLUMN_TOKEN_TOTAL_MARKET_CAP,
  COLUMN_TOKEN_TOTAL_SUPPLY,
  COLUMN_VOLUME_24H,
]

const pool_log_columns = [
  COLUMN_ID,
  COLUMN_CHAIN_NAME,
  COLUMN_LOG_TIMESTAMP,
  COLUMN_TOKEN_PRICE,
  COLUMN_POOL_AMOUNT,
  COLUMN_POOL_TOTAL_LIQUIDITY,
  COLUMN_POOL_TOTAL_TXS,
  COLUMN_TOKEN_TOTAL_HOLDERS,
  COLUMN_TOKEN_TOTAL_MARKET_CAP,
  COLUMN_TOKEN_TOTAL_SUPPLY,
  COLUMN_VOLUME_24H,
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

const editScanScore = (params) => {
  window.gridComponent.editScanScore(params)
}

var sortModel = null
var pageModel = null
var scrollTimeout = null
var filterKeyIndex = 0

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
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
      ActionsComponent={TablePaginationActions}
    />
  );
}

const withApiRef = (Componnet) => {
  return (props) => {
    const apiRef = useGridApiRef()
    return <Componnet apiRef={apiRef} {...props} />
  }
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
      sortField: this.props.hist != "true" ? 'pool_creation_timestamp' : 'log_timestamp',
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
      filterKey: 'filterKey',
      poolLogCount: 0,
      timerId: null,
    }

    this.onCellClick = this.onCellClick.bind(this)
    this.closeAlertCopiedOpen = this.closeAlertCopiedOpen.bind(this)
    this.loadData = this.loadData.bind(this)
    this.history = this.history.bind(this)
    this.listenToScroll = this.listenToScroll.bind(this)
    this.onSrollStop = this.onSrollStop.bind(this)
    this.loadFilter = this.loadFilter.bind(this)
    this.showFilter = this.showFilter.bind(this)
    this.hideFilter = this.hideFilter.bind(this)
    this.onFilter = this.onFilter.bind(this)

    sortModel = null
    pageModel = null
  }

  async componentDidMount() {
    // this.loadData()
    await this.context.isSyncChecked()
    const filter = await this.loadFilter()
    this.onFilter(filter)
    window.addEventListener("scroll", this.listenToScroll);

    if (!this.state.timerId) {
      const timerId = setInterval(async () => {
        const isSyncChecked = await this.context.isSyncChecked()

        if (!isSyncChecked) {
          this.loadData()
        }
      }, 60 * 1000)

      this.setState({
        timerId
      })
    }
  }

  componentWillUnmount() {
    if (this.state.timerId) {
      clearInterval(this.state.timerId)
      this.setState({
        timerId: null,
      })
    }
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

  editScanScore(params) {
    this.props.apiRef.current.startCellEditMode({ id: params.id, field: 'scan_score' })
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

  async loadFilter() {
    const config = await this.context.loadConfig()

    const filter = {
      searchPoolCreationTimestampRange: config['search_pool_creation_timestamp_range'] / (60 * 60),
      searchMinTokenPrice: config['keyword_search_min_token_price'],
      searchMaxTokenPrice: config['keyword_search_max_token_price'],
      searchMinPoolInitialAmount: config['keyword_search_min_pool_initial_amount'],
      searchMaxPoolInitialAmount: config['keyword_search_max_pool_initial_amount'],
      searchMinPoolTotalLiquidity: config['keyword_search_min_pool_total_liquidity'],
      searchMaxPoolTotalLiquidity: config['keyword_search_max_pool_total_liquidity'],
      searchMinPoolTotalTxs: config['keyword_search_min_pool_total_txs'],
      searchMaxPoolTotalTxs: config['keyword_search_max_pool_total_txs'],
      searchMinTokenTotalHolders: config['keyword_search_min_token_total_holders'],
      searchMaxTokenTotalHolders: config['keyword_search_max_token_total_holders'],
      searchMinTokenTotalSupply: config['keyword_search_min_token_total_supply'],
      searchMaxTokenTotalSupply: config['keyword_search_max_token_total_supply'],
      searchMinTokenTotalMarketCap: config['keyword_search_min_token_total_market_cap'],
      searchMaxTokenTotalMarketCap: config['keyword_search_max_token_total_market_cap'],
      searchMinVolume24H: config['keyword_search_min_volume_24h'],
      searchMaxVolume24H: config['keyword_search_max_volume_24h'],
      searchMinScanScore: config['keyword_search_min_scan_score'],
      searchMaxScanScore: config['keyword_search_max_scan_score'],
      searchValueTokenContractVerified: config['keyword_search_value_token_contract_verified'] ? true : false,
      searchValueTokenContractRenounced: config['keyword_search_value_token_contract_renounced'] ? true : false,
    }

    const newFilter = {
      keyword_search_sub_token_symbol: filter.searchSubTokenSymbol ? filter.searchSubTokenSymbol : null,
      keyword_search_sub_token_address: filter.searchSubTokenAddress ? filter.searchSubTokenAddress : null,
      keyword_search_sub_pool_address: filter.searchSubPoolAddress ? filter.searchSubPoolAddress : null,
      keyword_search_min_pool_creation_timestamp: filter.searchPoolCreationTimestampRange ? Date.now() / 1000 - filter.searchPoolCreationTimestampRange * 60 * 60 : null,
      keyword_search_max_pool_creation_timestamp: filter.searchPoolCreationTimestampRange ? Date.now() / 1000 : null,
      keyword_search_min_token_price: filter.searchMinTokenPrice ? filter.searchMinTokenPrice : null,
      keyword_search_max_token_price: filter.searchMaxTokenPrice ? filter.searchMaxTokenPrice : null,
      keyword_search_min_pool_initial_amount: filter.searchMinPoolInitialAmount ? filter.searchMinPoolInitialAmount : null,
      keyword_search_max_pool_initial_amount: filter.searchMaxPoolInitialAmount ? filter.searchMaxPoolInitialAmount : null,
      keyword_search_min_pool_total_liquidity: filter.searchMinPoolTotalLiquidity ? filter.searchMinPoolTotalLiquidity : null,
      keyword_search_max_pool_total_liquidity: filter.searchMaxPoolTotalLiquidity ? filter.searchMaxPoolTotalLiquidity : null,
      keyword_search_min_pool_total_txs: filter.searchMinPoolTotalTxs ? filter.searchMinPoolTotalTxs : null,
      keyword_search_max_pool_total_txs: filter.searchMaxPoolTotalTxs ? filter.searchMaxPoolTotalTxs : null,
      keyword_search_min_token_total_holders: filter.searchMinTokenTotalHolders ? filter.searchMinTokenTotalHolders : null,
      keyword_search_max_token_total_holders: filter.searchMaxTokenTotalHolders ? filter.searchMaxTokenTotalHolders : null,
      keyword_search_min_token_total_supply: filter.searchMinTokenTotalSupply ? filter.searchMinTokenTotalSupply : null,
      keyword_search_max_token_total_supply: filter.searchMaxTokenTotalSupply ? filter.searchMaxTokenTotalSupply : null,
      keyword_search_min_token_total_market_cap: filter.searchMinTokenTotalMarketCap ? filter.searchMinTokenTotalMarketCap : null,
      keyword_search_max_token_total_market_cap: filter.searchMaxTokenTotalMarketCap ? filter.searchMaxTokenTotalMarketCap : null,
      keyword_search_min_volume_24h: filter.searchMinVolume24H ? filter.searchMinVolume24H : null,
      keyword_search_max_volume_24h: filter.searchMaxVolume24H ? filter.searchMaxVolume24H : null,
      keyword_search_min_scan_score: filter.searchMinScanScore ? filter.searchMinScanScore : null,
      keyword_search_max_scan_score: filter.searchMaxScanScore ? filter.searchMaxScanScore : null,
      keyword_search_value_token_contract_verified: filter.searchValueTokenContractVerified ? filter.searchValueTokenContractVerified : null,
      keyword_search_value_token_contract_renounced: filter.searchValueTokenContractRenounced ? filter.searchValueTokenContractRenounced : null,
    }

    return newFilter
  }

  async loadData() {
    this.setState({
      loading: true
    })

    if (sortModel == null) {
      sortModel = [{
        field: this.state.sortField,
        sort: this.state.sortDir,
      }]
    }

    if (pageModel == null) {
      pageModel = new Object()
      pageModel.page = 0
      pageModel.pageSize = this.state.pageSize
    }

    let tableData = {}

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

    this.setState(
      {
        rows: tableData.rowData,
        rowCount: tableData.totalCount,
        page: pageModel.page,
        pageSize: pageModel.pageSize,
        loading: false,
      }
    )
  }

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
            },

            ".MuiDataGrid-cell.MuiDataGrid-cell--editing": {
              backgroundColor: "transparent"
            }
          })}
          rows={this.state.rows}
          columns={this.props.hist == "true" ? pool_log_columns : pool_columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: this.state.pageSize,
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
          apiRef={this.props.apiRef}
          onCellEditStop={async (params, event) => {
            if (params.reason === GridCellEditStopReasons.cellFocusOut) {
              event.defaultMuiPrevented = true;
            }
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

export default withNavigation(withCookies(withTranslation()(withApiRef(Grid))));