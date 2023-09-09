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

const formatDecimaOri = (value) => {
  let nf = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 12 });
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

const columns = [
  {
    field: 'id',
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
    renderCell: (params) => (
      <div>
        {params.value}
      </div>
    ),
  },

  {
    field: 'hist_chain',
    renderHeader: (params) => (
      <strong>
        {i18next.t("column_chain")}
        <span id="arrowChainDown" style={{ display: "none" }}>
          <ArrowDown style={{ verticalAlign: "middle" }}></ArrowDown>
        </span>
        <span id="arrowChainUp" style={{ display: "none" }}>
          <ArrowUp style={{ verticalAlign: "middle" }}></ArrowUp>
        </span>
      </strong>
    ),
    headerClassName: 'super-app-theme--header',
    width: 120,
    hideable: false,
    disableColumnMenu: true,
    hideSortIcons: true,
    sortingOrder: ['asc', 'desc'],
    renderCell: (params) => (
      <div>
        Ethereum
      </div>
    ),
  },
  {
    field: 'hist_name',
    renderHeader: (params) => (
      <strong>
        {i18next.t("column_name")}
        <span id="arrowNameDown" style={{ display: "none" }}>
          <ArrowDown style={{ verticalAlign: "middle" }}></ArrowDown>
        </span>
        <span id="arrowNameUp" style={{ display: "none" }}>
          <ArrowUp style={{ verticalAlign: "middle" }}></ArrowUp>
        </span>
      </strong>
    ),
    headerClassName: 'super-app-theme--header',
    width: 150,
    headerAlign: 'left',
    align: "left",
    disableColumnMenu: true,
    hideable: false,
    hideSortIcons: true,
    sortingOrder: ['asc', 'desc'],
    renderCell: (params) => (
      <div>
        <div onClick={() => history(params)} className="App-link"><u>{/*params.value.replace("/", " / ")*/params.value + ' / WETH'}</u></div>
        <div style={{ marginTop: 4 }}>
          <img src={cgreen} style={{ width: 16, height: 16, marginLeft: 5, display: params.row.hist_contract_verified == 1 ? 'inline' : 'none' }} />
          <img src={rgreen} style={{ width: 16, height: 16, marginLeft: 5, display: params.row.hist_contract_renounced == 1 ? 'inline' : 'none' }} />
          {/* <img src={honeypot} style={{ marginLeft: params.row.hist_contract_verified == 1 || params.row.hist_contract_verified == 1 ? 6 : 0, width: 16, height: 16, display: params.row.hist_honey_pot == 1 ? 'inline' : 'none' }} /> */}
        </div>
        <div style={{ marginTop: 4, display: params.row.hist_buy_tax != null && params.row.hist_sell_tax != null ? "inline" : "none" }}>
          <span>BT: {formatPct(params.row.hist_buy_tax)}</span>
          &nbsp;&nbsp;
          <span>ST: {formatPct(params.row.hist_sell_tax)}</span>
        </div>
      </div>
    ),

  },
  {
    field: 'hist_token_address',
    renderHeader: (params) => (
      <strong>
        {i18next.t("column_token_address")}
      </strong>
    ),
    headerClassName: 'super-app-theme--header',
    width: 200,
    disableColumnMenu: true,
    filterable: false,
    sortable: false,
    hideSortIcons: true,
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
          <a href="#" onClick={() => tokensniffer(params.value)} className="App-link" style={{ marginLeft: 5 }} target="_blank">TOKENSNIFFER</a>
        </div>
      </div>
    ),
  },
  {
    field: 'hist_pair_address',
    renderHeader: (params) => (
      <strong>
        {i18next.t("column_pair_address")}
      </strong>
    ),
    headerClassName: 'super-app-theme--header',
    width: 200,
    disableColumnMenu: true,
    sortable: false,
    filterable: false,
    hideSortIcons: true,
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
          <a href="#" onClick={() => dextools(params.value)} className="App-link" style={{ marginLeft: 5 }} target="_blank">DEXTOOLS</a>
        </div>
      </div>
    ),

  },
  {
    headerAlign: 'center',
    field: 'hist_creation',
    renderHeader: (params) => (
      <strong>
        {i18next.t("column_creation_time")}
        <span id="arrowCreationDown" style={{ display: "none" }}>
          <ArrowDown style={{ verticalAlign: "middle" }}></ArrowDown>
        </span>
        <span id="arrowCreationUp" style={{ display: "none" }}>
          <ArrowUp style={{ verticalAlign: "middle" }}></ArrowUp>
        </span>
      </strong>
    ),
    filterable: false,
    headerClassName: 'super-app-theme--header',
    width: 150,
    align: "center",
    disableColumnMenu: true,
    hideSortIcons: true,
    sortingOrder: ['desc', 'asc'],
    renderCell: (params) => {
      var mydate = new Date(params.value * 1000);
      return mydate.toLocaleDateString("en-US") + " " + mydate.toLocaleTimeString("en-US")
    }
  },
  {
    type: 'number',
    field: 'hist_price',
    renderHeader: (params) => (
      <strong>
        {i18next.t("column_price")}
        <span id="arrowPriceDown" style={{ display: "none" }}>
          <ArrowDown style={{ verticalAlign: "middle" }}></ArrowDown>
        </span>
        <span id="arrowPriceUp" style={{ display: "none" }}>
          <ArrowUp style={{ verticalAlign: "middle" }}></ArrowUp>
        </span>
      </strong>
    ),
    headerClassName: 'super-app-theme--header',
    width: 120,
    disableColumnMenu: true,
    hideSortIcons: true,
    sortingOrder: ['asc', 'desc'],
    renderCell: (params) => (
      <div style={{ textAlign: "right" }}>
        <div>
          <a href="#" onClick={() => dextools(params)} className="App-link" target="_blank">{formatDecimaOri(params.value)}</a>
          {/* {params.value ? `${params.value} ETH` : '-'} */}
        </div>
      </div>
    )
  },
  {
    type: 'number',
    field: 'hist_pool_amount',
    renderHeader: (params) => (
      <strong>
        {i18next.t("column_pool_amount")}
        <span id="arrowLiquidityDown" style={{ display: "none" }}>
          <ArrowDown style={{ verticalAlign: "middle" }}></ArrowDown>
        </span>
        <span id="arrowLiquidityUp" style={{ display: "none" }}>
          <ArrowUp style={{ verticalAlign: "middle" }}></ArrowUp>
        </span>
      </strong>
    ),
    headerClassName: 'super-app-theme--header',
    width: 140,
    disableColumnMenu: true,
    hideSortIcons: true,
    sortingOrder: ['asc', 'desc'],
    renderCell: (params) => {
      const nf = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 6 });
      return params.value ? nf.format(params.value) : "-";
      // return params.value ? `${parseInt(params.value * 100) / 100} ETH` : '-'
    }

  },
  {
    type: 'number',
    field: 'hist_total_liquidity',
    renderHeader: (params) => (
      <strong>
        {i18next.t("column_total_liquidity")}
        <span id="arrowLiquidityDown" style={{ display: "none" }}>
          <ArrowDown style={{ verticalAlign: "middle" }}></ArrowDown>
        </span>
        <span id="arrowLiquidityUp" style={{ display: "none" }}>
          <ArrowUp style={{ verticalAlign: "middle" }}></ArrowUp>
        </span>
      </strong>
    ),
    headerClassName: 'super-app-theme--header',
    width: 140,
    disableColumnMenu: true,
    hideSortIcons: true,
    sortingOrder: ['asc', 'desc'],
    renderCell: (params) => {
      const nf = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
      return parseInt(params.value) ? nf.format(params.value) : "-";
      // return params.value ? `${parseInt(params.value * 100) / 100} ETH` : '-'
    }

  },
  {
    type: 'number',
    field: 'hist_holders',
    renderHeader: (params) => (
      <strong>
        {i18next.t("column_holders")}
        <span id="arrowHoldersDown" style={{ display: "none" }}>
          <ArrowDown style={{ verticalAlign: "middle" }}></ArrowDown>
        </span>
        <span id="arrowHoldersUp" style={{ display: "none" }}>
          <ArrowUp style={{ verticalAlign: "middle" }}></ArrowUp>
        </span>
      </strong>
    ),
    headerClassName: 'super-app-theme--header',
    width: 100,
    disableColumnMenu: true,
    hideSortIcons: true,
    sortingOrder: ['asc', 'desc'],
    renderCell: (params) => {
      let nf = new Intl.NumberFormat('en-US');
      return params.value ? (nf.format(params.value)) : "-";
    }

  },
  {
    type: 'number',
    field: 'hist_total_tx',
    renderHeader: (params) => (
      <strong>
        {i18next.t("column_total_tx")}
        <span id="arrowTxDown" style={{ display: "none" }}>
          <ArrowDown style={{ verticalAlign: "middle" }}></ArrowDown>
        </span>
        <span id="arrowTxUp" style={{ display: "none" }}>
          <ArrowUp style={{ verticalAlign: "middle" }}></ArrowUp>
        </span>
      </strong>
    ),
    headerClassName: 'super-app-theme--header',
    width: 100,
    disableColumnMenu: true,
    hideSortIcons: true,
    sortingOrder: ['asc', 'desc'],
    renderCell: (params) => {
      let nf = new Intl.NumberFormat('en-US');
      return params.value ? nf.format(params.value) : "-";
    }

  },
  {
    type: 'number',
    field: 'hist_volume_24h',
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
    headerClassName: 'super-app-theme--header',
    width: 110,
    disableColumnMenu: true,
    hideSortIcons: true,
    sortingOrder: ['asc', 'desc'],
    renderCell: (params) => {
      return params.value ? formatMoney(params.value) : "-";
    }

  },
  {
    field: 'hist_market_cap',
    renderHeader: (params) => (
      <strong>
        {i18next.t("column_total_market_cap")}
        <span id="arrowMarketCapDown" style={{ display: "none" }}>
          <ArrowDown style={{ verticalAlign: "middle" }}></ArrowDown>
        </span>
        <span id="arrowMarketCapUp" style={{ display: "none" }}>
          <ArrowUp style={{ verticalAlign: "middle" }}></ArrowUp>
        </span>
      </strong>
    ),
    headerClassName: 'super-app-theme--header',
    width: 180,
    type: 'number',
    disableColumnMenu: true,
    hideSortIcons: true,
    sortingOrder: ['asc', 'desc'],
    renderCell: (params) => {
      return params.value ? formatMoney(params.value) : "-";
    }
  },
  {
    type: 'number',
    field: 'hist_supply',
    renderHeader: (params) => (
      <strong>
        {i18next.t("column_total_supply")}
        <span id="arrowSupplyDown" style={{ display: "none" }}>
          <ArrowDown style={{ verticalAlign: "middle" }}></ArrowDown>
        </span>
        <span id="arrowSupplyUp" style={{ display: "none" }}>
          <ArrowUp style={{ verticalAlign: "middle" }}></ArrowUp>
        </span>
      </strong>
    ),
    headerClassName: 'super-app-theme--header',
    width: 140,
    disableColumnMenu: true,
    hideSortIcons: true,
    sortingOrder: ['asc', 'desc'],
    renderCell: (params) => {
      return params.value ? formatDecimal(params.value) : "-";
    }

  },/*
      {
        type: 'number',
        field: 'hist_buy_24h',
        renderHeader: (params) => (
          <strong>
            {i18next.t("column_buy_24h")}
            <span id="arrowBuy24HDown" style={{display: "none"}}>
              <ArrowDown style={{verticalAlign: "middle"}}></ArrowDown>
            </span>
            <span id="arrowBuy24HUp" style={{display: "none"}}>
              <ArrowUp style={{verticalAlign: "middle"}}></ArrowUp>
            </span>
          </strong>
        ),
        headerClassName: 'super-app-theme--header',
        width: 100,
        disableColumnMenu: true,
        hideSortIcons: true,
        sortingOrder: ['asc', 'desc'],
        renderCell: (params) => {
            let nf = new Intl.NumberFormat('en-US');
            return params.value ? nf.format(params.value) : "-";
        }        

      },
      {
        type: 'number',
        field: 'hist_sell_24h',
        renderHeader: (params) => (
          <strong>
            {i18next.t("column_sell_24h")}
            <span id="arrowSell24HDown" style={{display: "none"}}>
              <ArrowDown style={{verticalAlign: "middle"}}></ArrowDown>
            </span>
            <span id="arrowSell24HUp" style={{display: "none"}}>
              <ArrowUp style={{verticalAlign: "middle"}}></ArrowUp>
            </span>
          </strong>
        ),
        headerClassName: 'super-app-theme--header',
        width: 100,
        disableColumnMenu: true,
        hideSortIcons: true,
        sortingOrder: ['asc', 'desc'],
        renderCell: (params) => {
            let nf = new Intl.NumberFormat('en-US');
            return params.value ? nf.format(params.value) : "-";
        }        

      },
      {
        type: 'number',
        field: 'hist_swap_24h',
        renderHeader: (params) => (
          <strong>
            {i18next.t("column_swap_24h")}
            <span id="arrowSwap24HDown" style={{display: "none"}}>
              <ArrowDown style={{verticalAlign: "middle"}}></ArrowDown>
            </span>
            <span id="arrowSwap24HUp" style={{display: "none"}}>
              <ArrowUp style={{verticalAlign: "middle"}}></ArrowUp>
            </span>
          </strong>
        ),
        headerClassName: 'super-app-theme--header',
        width: 100,
        disableColumnMenu: true,
        hideSortIcons: true,
        sortingOrder: ['asc', 'desc'],
        renderCell: (params) => {
            let nf = new Intl.NumberFormat('en-US');
            return params.value ? nf.format(params.value) : "-";
        }        

      },*/
  {
    type: 'number',
    field: 'hist_dextscore',
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
    headerClassName: 'super-app-theme--header',
    width: 120,
    disableColumnMenu: true,
    hideSortIcons: true,
    sortingOrder: ['asc', 'desc'],
    renderCell: (params) => {
      let nf = new Intl.NumberFormat('en-US');
      return params.value ? nf.format(params.value) : "-";
    }

  },
  {
    type: 'number',
    field: 'hist_volume_1h',
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
    headerClassName: 'super-app-theme--header',
    width: 120,
    disableColumnMenu: true,
    hideSortIcons: true,
    sortingOrder: ['asc', 'desc'],
    renderCell: (params) => {
      return params.value ? formatMoney(params.value) : "-";
    }

  },/*
      {
        type: 'number',
        field: 'hist_buy_1h',
        hide: true,
        renderHeader: (params) => (
          <strong>
            {i18next.t("column_buy_1h")}
            <span id="arrowBuy1HDown" style={{display: "none"}}>
              <ArrowDown style={{verticalAlign: "middle"}}></ArrowDown>
            </span>
            <span id="arrowBuy1HUp" style={{display: "none"}}>
              <ArrowUp style={{verticalAlign: "middle"}}></ArrowUp>
            </span>
          </strong>
        ),
        headerClassName: 'super-app-theme--header',
        width: 100,
        disableColumnMenu: true,
        hideSortIcons: true,
        sortingOrder: ['asc', 'desc'],
        renderCell: (params) => {
            let nf = new Intl.NumberFormat('en-US');
            return params.value ? nf.format(params.value) : "-";
        }        

      },
      {
        type: 'number',
        field: 'hist_sell_1h',
        renderHeader: (params) => (
          <strong>
            {i18next.t("column_sell_1h")}
            <span id="arrowSell1HDown" style={{display: "none"}}>
              <ArrowDown style={{verticalAlign: "middle"}}></ArrowDown>
            </span>
            <span id="arrowSell1HUp" style={{display: "none"}}>
              <ArrowUp style={{verticalAlign: "middle"}}></ArrowUp>
            </span>
          </strong>
        ),
        headerClassName: 'super-app-theme--header',
        width: 100,
        disableColumnMenu: true,
        hideSortIcons: true,
        sortingOrder: ['asc', 'desc'],
        renderCell: (params) => {
            let nf = new Intl.NumberFormat('en-US');
            return params.value ? nf.format(params.value) : "-";
        }        

      },
      {
        type: 'number',
        field: 'hist_swap_1h',
        renderHeader: (params) => (
          <strong>
            {i18next.t("column_swap_1h")}
            <span id="arrowSwap1HDown" style={{display: "none"}}>
              <ArrowDown style={{verticalAlign: "middle"}}></ArrowDown>
            </span>
            <span id="arrowSwap1HUp" style={{display: "none"}}>
              <ArrowUp style={{verticalAlign: "middle"}}></ArrowUp>
            </span>
          </strong>
        ),
        headerClassName: 'super-app-theme--header',
        width: 100,
        disableColumnMenu: true,
        hideSortIcons: true,
        sortingOrder: ['asc', 'desc'],
        renderCell: (params) => {
            let nf = new Intl.NumberFormat('en-US');
            return params.value ? nf.format(params.value) : "-";
        }        

      }*/

];

const historyColumns = []

for (var i = 0; i < columns.length; i++) {
  var column = columns[i]

  if (column.field == "hist_chain" || column.field == "hist_name" || column.field == "hist_token_address"
    || column.field == "hist_pair_address" || column.field == "hist_creation") {
    continue;
  }

  historyColumns.push(columns[i])

  if (column.field == "idx") {
    historyColumns.push({
      headerAlign: 'center',
      field: 'hist_log_time',
      renderHeader: (params) => (
        <strong>
          {i18next.t("column_history_time")}
          <span id="arrowCreationDown" style={{ display: "none" }}>
            <ArrowDown style={{ verticalAlign: "middle" }}></ArrowDown>
          </span>
          <span id="arrowCreationUp" style={{ display: "none" }}>
            <ArrowUp style={{ verticalAlign: "middle" }}></ArrowUp>
          </span>
        </strong>
      ),
      filterable: false,
      headerClassName: 'super-app-theme--header',
      width: 150,
      align: "center",
      disableColumnMenu: true,
      hideSortIcons: true,
      sortingOrder: ['desc', 'asc'],
      renderCell: (params) => {
        var mydate = new Date(params.value * 1000);
        return mydate.toLocaleDateString("en-US") + " " + mydate.toLocaleTimeString("en-US")
      }
    })
  }

}



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
      sortField: this.props.hist == "true" ? 'hist_created' : 'hist_creation',
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
    this.props.navigate("/history?token=" + params.row.hist_token_address + "&pair=" + params.row.hist_pair_address, { replace: false });
  }

  etherscan(address) {
    window.open("https://etherscan.io/address/" + address, '_blank', 'noopener,noreferrer')
  }

  tokensniffer(token_address) {
    window.open("https://tokensniffer.com/token/eth/" + token_address, '_blank', 'noopener,noreferrer')
  }

  dextools(pair_address) {
    window.open("https://www.dextools.io/app/en/ether/pair-explorer/" + pair_address, '_blank', 'noopener,noreferrer')
  }

  onCellClick(params) {
    if (params.field == "hist_token_address" || params.field == "hist_pair_address") {
      navigator.clipboard.writeText(params.value)
      this.setState({
        alertCopiedOpen: "block"
      })
      setTimeout(this.closeAlertCopiedOpen, 1000)
    }
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
          sortModel: {},
          pageModel: {
            page_number: pageModel.page,
            page_size: pageModel.pageSize,
          },
          filterModel: {},
          chain: 0,
          token: '',
          trail: '',
        }, GET_POOL_LOG, this.props.pair)
      } else {
        tableData = await this.context.loadTableData({
          sortModel: {},
          pageModel: {
            page_number: pageModel.page,
            page_size: pageModel.pageSize,
          },
          filterModel: {},
          chain: 0,
          token: '',
          trail: '',
        }, GET_POOL)
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
  }

  setSortIcon(data) {
    // chain

    var arrowChainDown = window.document.getElementById("arrowChainDown")
    if (arrowChainDown) {
      arrowChainDown.style.display = data.sortField == "hist_chain" && data.sortDir == "desc" ? "inline" : "none"
    }

    var arrowChainUp = window.document.getElementById("arrowChainUp")
    if (arrowChainUp) {
      arrowChainUp.style.display = data.sortField == "hist_chain" && data.sortDir == "asc" ? "inline" : "none"
    }


    // name

    var arrowNameDown = window.document.getElementById("arrowNameDown")
    if (arrowNameDown) {
      arrowNameDown.style.display = data.sortField == "hist_name" && data.sortDir == "desc" ? "inline" : "none"
    }

    var arrowNameUp = window.document.getElementById("arrowNameUp")
    if (arrowNameUp) {
      arrowNameUp.style.display = data.sortField == "hist_name" && data.sortDir == "asc" ? "inline" : "none"
    }

    // creation

    var arrowCreationDown = window.document.getElementById("arrowCreationDown")
    if (arrowCreationDown) {
      arrowCreationDown.style.display = (data.sortField == "hist_creation" || data.sortField == "hist_created") && data.sortDir == "desc" ? "inline" : "none"
    }

    var arrowCreationUp = window.document.getElementById("arrowCreationUp")
    if (arrowCreationUp) {
      arrowCreationUp.style.display = (data.sortField == "hist_creation" || data.sortField == "hist_created") && data.sortDir == "asc" ? "inline" : "none"
    }

    // price

    var arrowPricenDown = window.document.getElementById("arrowPriceDown")
    if (arrowPricenDown) {
      arrowPricenDown.style.display = data.sortField == "hist_price" && data.sortDir == "desc" ? "inline" : "none"
    }

    var arrowPricenUp = window.document.getElementById("arrowPriceUp")
    if (arrowPricenUp) {
      arrowPricenUp.style.display = data.sortField == "hist_price" && data.sortDir == "asc" ? "inline" : "none"
    }

    // total liquidity

    var arrowLiquidityDown = window.document.getElementById("arrowLiquidityDown")
    if (arrowLiquidityDown) {
      arrowLiquidityDown.style.display = data.sortField == "hist_total_liquidity" && data.sortDir == "desc" ? "inline" : "none"
    }

    var arrowLiquidityUp = window.document.getElementById("arrowLiquidityUp")
    if (arrowLiquidityUp) {
      arrowLiquidityUp.style.display = data.sortField == "hist_total_liquidity" && data.sortDir == "asc" ? "inline" : "none"
    }

    // market cap

    var arrowMarketCapDown = window.document.getElementById("arrowMarketCapDown")
    if (arrowLiquidityUp) {
      arrowLiquidityUp.style.display = data.sortField == "hist_market_cap" && data.sortDir == "desc" ? "inline" : "none"
    }

    var arrowMarketCapUp = window.document.getElementById("arrowMarketCapUp")
    if (arrowMarketCapUp) {
      arrowMarketCapUp.style.display = data.sortField == "hist_market_cap" && data.sortDir == "asc" ? "inline" : "none"
    }

    // supply
    var arrowSupplyDown = window.document.getElementById("arrowSupplyDown")
    if (arrowSupplyDown) {
      arrowSupplyDown.style.display = data.sortField == "hist_supply" && data.sortDir == "desc" ? "inline" : "none"
    }

    var arrowSupplyUp = window.document.getElementById("arrowSupplyUp")
    if (arrowSupplyUp) {
      arrowSupplyUp.style.display = data.sortField == "hist_supply" && data.sortDir == "asc" ? "inline" : "none"
    }

    // holders

    var arrowHoldersDown = window.document.getElementById("arrowHoldersDown")
    if (arrowHoldersDown) {
      arrowHoldersDown.style.display = data.sortField == "hist_holders" && data.sortDir == "desc" ? "inline" : "none"
    }

    var arrowHoldersUp = window.document.getElementById("arrowHoldersUp")
    if (arrowHoldersUp) {
      arrowHoldersUp.style.display = data.sortField == "hist_holders" && data.sortDir == "asc" ? "inline" : "none"
    }

    // volume 24H

    var arrowVolume24HDown = window.document.getElementById("arrowVolume24HDown")
    if (arrowVolume24HDown) {
      arrowVolume24HDown.style.display = data.sortField == "hist_volume_24h" && data.sortDir == "desc" ? "inline" : "none"
    }

    var arrowVolume24HUp = window.document.getElementById("arrowVolume24HUp")
    if (arrowVolume24HUp) {
      arrowVolume24HUp.style.display = data.sortField == "hist_volume_24h" && data.sortDir == "asc" ? "inline" : "none"
    }

    // buy 24H

    var arrowBuy24HDown = window.document.getElementById("arrowBuy24HDown")
    if (arrowBuy24HDown) {
      arrowBuy24HDown.style.display = data.sortField == "hist_buy_24h" && data.sortDir == "desc" ? "inline" : "none"
    }

    var arrowBuy24HUp = window.document.getElementById("arrowBuy24HUp")
    if (arrowBuy24HUp) {
      arrowBuy24HUp.style.display = data.sortField == "hist_buy_24h" && data.sortDir == "asc" ? "inline" : "none"
    }

    // sell 24H

    var arrowSell24HDown = window.document.getElementById("arrowSell24HDown")
    if (arrowSell24HDown) {
      arrowSell24HDown.style.display = data.sortField == "hist_sell_24h" && data.sortDir == "desc" ? "inline" : "none"
    }

    var arrowSell24HUp = window.document.getElementById("arrowSell24HUp")
    if (arrowSell24HUp) {
      arrowSell24HUp.style.display = data.sortField == "hist_sell_24h" && data.sortDir == "asc" ? "inline" : "none"
    }

    // swap 24H

    var arrowSwap24HDown = window.document.getElementById("arrowSwap24HDown")
    if (arrowSwap24HDown) {
      arrowSwap24HDown.style.display = data.sortField == "hist_swap_24h" && data.sortDir == "desc" ? "inline" : "none"
    }

    var arrowSwap24HUp = window.document.getElementById("arrowSwap24HUp")
    if (arrowSwap24HUp) {
      arrowSwap24HUp.style.display = data.sortField == "hist_swap_24h" && data.sortDir == "asc" ? "inline" : "none"
    }

    // total tx
    var arrowTxDown = window.document.getElementById("arrowTxDown")
    if (arrowTxDown) {
      arrowTxDown.style.display = data.sortField == "hist_total_tx" && data.sortDir == "desc" ? "inline" : "none"
    }

    var arrowTxUp = window.document.getElementById("arrowTxUp")
    if (arrowTxUp) {
      arrowTxUp.style.display = data.sortField == "hist_total_tx" && data.sortDir == "asc" ? "inline" : "none"
    }

    // dextscore

    var arrowDextScoreDown = window.document.getElementById("arrowDextScoreDown")
    if (arrowDextScoreDown) {
      arrowDextScoreDown.style.display = data.sortField == "hist_dextscore" && data.sortDir == "desc" ? "inline" : "none"
    }

    var arrowDextScoreUp = window.document.getElementById("arrowDextScoreUp")
    if (arrowDextScoreUp) {
      arrowDextScoreUp.style.display = data.sortField == "hist_dextscore" && data.sortDir == "asc" ? "inline" : "none"
    }

    // volume 1 h

    var arrowVolume1HDown = window.document.getElementById("arrowVolume1HDown")
    if (arrowVolume1HDown) {
      arrowVolume1HDown.style.display = data.sortField == "hist_volume_1h" && data.sortDir == "desc" ? "inline" : "none"
    }

    var arrowVolume1HUp = window.document.getElementById("arrowVolume1HUp")
    if (arrowVolume1HUp) {
      arrowVolume1HUp.style.display = data.sortField == "hist_volume_1h" && data.sortDir == "asc" ? "inline" : "none"
    }

    // buy 1 h

    var arrowBuy1HDown = window.document.getElementById("arrowBuy1HDown")
    if (arrowBuy1HDown) {
      arrowBuy1HDown.style.display = data.sortField == "hist_buy_1h" && data.sortDir == "desc" ? "inline" : "none"
    }

    var arrowBuy1HUp = window.document.getElementById("arrowBuy1HUp")
    if (arrowBuy1HUp) {
      arrowBuy1HUp.style.display = data.sortField == "hist_buy_1h" && data.sortDir == "asc" ? "inline" : "none"
    }

    // sell 1 h

    var arrowSell1HDown = window.document.getElementById("arrowSell1HDown")
    if (arrowSell1HDown) {
      arrowSell1HDown.style.display = data.sortField == "hist_sell_1h" && data.sortDir == "desc" ? "inline" : "none"
    }

    var arrowSell1HUp = window.document.getElementById("arrowSell1HUp")
    if (arrowSell1HUp) {
      arrowSell1HUp.style.display = data.sortField == "hist_sell_1h" && data.sortDir == "asc" ? "inline" : "none"
    }

    // swap 1 h

    var arrowSwap1HDown = window.document.getElementById("arrowSwap1HDown")
    if (arrowSwap1HDown) {
      arrowSwap1HDown.style.display = data.sortField == "hist_swap_1h" && data.sortDir == "desc" ? "inline" : "none"
    }

    var arrowSwap1HUp = window.document.getElementById("arrowSwap1HUp")
    if (arrowSwap1HUp) {
      arrowSwap1HUp.style.display = data.sortField == "hist_swap_1h" && data.sortDir == "asc" ? "inline" : "none"
    }

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
            }
          })}
          rows={this.state.rows}
          columns={this.props.hist == "true" ? historyColumns : columns}
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