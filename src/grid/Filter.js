import React from "react";
import { withTranslation } from 'react-i18next';
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/CloseOutlined';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Button from '@mui/material/Button';
import dayjs from 'dayjs';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';

import { CssSelect, CssTextField, style } from "../Style.js";

import MainContext from "../context/MainContext";

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

class Filter extends React.Component {
  static contextType = MainContext

  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };


  constructor(props) {
    super(props)

    const { cookies } = this.props;

    this.state = {
      searchSubTokenSymbol: this.props.data != null ? this.props.data.keyword_search_sub_token_symbol : null,
      searchSubTokenAddress: this.props.data != null ? this.props.data.keyword_search_sub_token_address : null,
      searchSubPoolAddress: this.props.data != null ? this.props.data.keyword_search_sub_pool_address : null,
      searchPoolCreationTimestampRange: this.props.data != null ? this.props.data.search_pool_creation_timestamp_range : null,
      searchMinTokenPrice: this.props.data != null ? this.props.data.keyword_search_min_token_price : null,
      searchMaxTokenPrice: this.props.data != null ? this.props.data.keyword_search_max_token_price : null,
      searchMinPoolInitialLiquidity: this.props.data != null ? this.props.data.keyword_search_min_pool_initial_liquidity : null,
      searchMaxPoolInitialLiquidity: this.props.data != null ? this.props.data.keyword_search_max_pool_initial_liquidity : null,
      searchMinPoolTotalLiquidity: this.props.data != null ? this.props.data.keyword_search_min_pool_total_liquidity : null,
      searchMaxPoolTotalLiquidity: this.props.data != null ? this.props.data.keyword_search_max_pool_total_liquidity : null,
      searchMinPoolTotalTxs: this.props.data != null ? this.props.data.keyword_search_min_pool_total_txs : null,
      searchMaxPoolTotalTxs: this.props.data != null ? this.props.data.keyword_search_max_pool_total_txs : null,
      searchMinTokenTotalHolders: this.props.data != null ? this.props.data.keyword_search_min_token_total_holders : null,
      searchMaxTokenTotalHolders: this.props.data != null ? this.props.data.keyword_search_max_token_total_holders : null,
      searchMinTokenTotalSupply: this.props.data != null ? this.props.data.keyword_search_min_token_total_supply : null,
      searchMaxTokenTotalSupply: this.props.data != null ? this.props.data.keyword_search_max_token_total_supply : null,
      searchMinTokenTotalMarketCap: this.props.data != null ? this.props.data.keyword_search_min_token_total_market_cap : null,
      searchMaxTokenTotalMarketCap: this.props.data != null ? this.props.data.keyword_search_max_token_total_market_cap : null,
      searchMinVolume1H: this.props.data != null ? this.props.data.keyword_search_min_volume_1h : null,
      searchMaxVolume1H: this.props.data != null ? this.props.data.keyword_search_max_volume_1h : null,
      searchMinVolume24H: this.props.data != null ? this.props.data.keyword_search_min_volume_24h : null,
      searchMaxVolume24H: this.props.data != null ? this.props.data.keyword_search_max_volume_24h : null,
      searchValueTokenContractVerified: this.props.data != null ? this.props.data.search_contract_verified : null,
      searchValueTokenContractRenounced: this.props.data != null ? this.props.data.search_contract_renounced : null,
    }

    this.setSearchSubTokenSymbol = this.setSearchSubTokenSymbol.bind(this)
    this.setSearchSubTokenAddress = this.setSearchSubTokenAddress.bind(this)
    this.setSearchSubPoolAddress = this.setSearchSubPoolAddress.bind(this)
    this.setSearchPoolCreationTimestampRange = this.setSearchPoolCreationTimestampRange.bind(this)
    this.setSearchMinTokenPrice = this.setSearchMinTokenPrice.bind(this)
    this.setSearchMaxTokenPrice = this.setSearchMaxTokenPrice.bind(this)
    this.setSearchMinPoolInitialLiquidity = this.setSearchMinPoolInitialLiquidity.bind(this)
    this.setSearchMaxPoolInitialLiquidity = this.setSearchMaxPoolInitialLiquidity.bind(this)
    this.setSearchMinPoolTotalLiquidity = this.setSearchMinPoolTotalLiquidity.bind(this)
    this.setSearchMaxPoolTotalLiquidity = this.setSearchMaxPoolTotalLiquidity.bind(this)
    this.setSearchMinPoolTotalTxs = this.setSearchMinPoolTotalTxs.bind(this)
    this.setSearchMaxPoolTotalTxs = this.setSearchMaxPoolTotalTxs.bind(this)
    this.setSearchMinTokenTotalHolders = this.setSearchMinTokenTotalHolders.bind(this)
    this.setSearchMaxTokenTotalHolders = this.setSearchMaxTokenTotalHolders.bind(this)
    this.setSearchMinTokenTotalSupply = this.setSearchMinTokenTotalSupply.bind(this)
    this.setSearchMaxTokenTotalSupply = this.setSearchMaxTokenTotalSupply.bind(this)
    this.setSearchMinTokenTotalMarketCap = this.setSearchMinTokenTotalMarketCap.bind(this)
    this.setSearchMaxTokenTotalMarketCap = this.setSearchMaxTokenTotalMarketCap.bind(this)
    this.setSearchMinPoolVolume1H = this.setSearchMinVolume1H.bind(this)
    this.setSearchMaxPoolVolume1H = this.setSearchMaxVolume1H.bind(this)
    this.setSearchMinPoolVolume24H = this.setSearchMinVolume24H.bind(this)
    this.setSearchMaxPoolVolume24H = this.setSearchMaxVolume24H.bind(this)
    this.setSearchValueTokenContractVerified = this.setSearchValueTokenContractVerified.bind(this)
    this.setSearchValueTokenContractRenounced = this.setSearchValueTokenContractRenounced.bind(this)

    this.loadConfig = this.loadConfig.bind(this)
    this.applyFilter = this.applyFilter.bind(this)
    this.clearFilter = this.clearFilter.bind(this)
  }

  componentDidMount() {
    this.loadConfig()
  }

  setSearchSubTokenSymbol(value) {
    this.setState({
      searchSubTokenSymbol: value
    })
  }

  setSearchSubTokenAddress(value) {
    this.setState({
      searchSubTokenAddress: value
    })
  }

  setSearchSubPoolAddress(value) {
    this.setState({
      searchSubPoolAddress: value
    })
  }

  setSearchPoolCreationTimestampRange(value) {
    this.setState({
      searchPoolCreationTimestampRange: value
    })
  }

  setSearchMinTokenPrice(value) {
    this.setState({
      searchMinTokenPrice: value
    })
  }

  setSearchMaxTokenPrice(value) {
    this.setState({
      searchMaxTokenPrice: value
    })
  }

  setSearchMinPoolInitialLiquidity(value) {
    this.setState({
      searchMinPoolInitialLiquidity: value
    })
  }

  setSearchMaxPoolInitialLiquidity(value) {
    this.setState({
      searchMaxPoolInitialLiquidity: value
    })
  }

  setSearchMinPoolTotalLiquidity(value) {
    this.setState({
      searchMinPoolTotalLiquidity: value
    })
  }

  setSearchMaxPoolTotalLiquidity(value) {
    this.setState({
      searchMaxPoolTotalLiquidity: value
    })
  }

  setSearchMinPoolTotalTxs(value) {
    this.setState({
      searchMinPoolTotalTxs: value
    })
  }

  setSearchMaxPoolTotalTxs(value) {
    this.setState({
      searchMaxPoolTotalTxs: value
    })
  }

  setSearchMinTokenTotalHolders(value) {
    this.setState({
      searchMinTokenTotalHolders: value
    })
  }

  setSearchMaxTokenTotalHolders(value) {
    this.setState({
      searchMaxTokenTotalHolders: value
    })
  }

  setSearchMinTokenTotalSupply(value) {
    this.setState({
      searchMinTokenTotalSupply: value
    })
  }

  setSearchMaxTokenTotalSupply(value) {
    this.setState({
      searchMaxTokenTotalSupply: value
    })
  }

  setSearchMinTokenTotalMarketCap(value) {
    this.setState({
      searchMinTokenTotalMarketCap: value
    })
  }

  setSearchMaxTokenTotalMarketCap(value) {
    this.setState({
      searchMaxTokenTotalMarketCap: value
    })
  }

  setSearchMinVolume1H(value) {
    this.setState({
      searchMinVolume1H: value
    })
  }

  setSearchMaxVolume1H(value) {
    this.setState({
      searchMaxVolume1H: value
    })
  }

  setSearchMinVolume24H(value) {
    this.setState({
      searchMinVolume24H: value
    })
  }

  setSearchMaxVolume24H(value) {
    this.setState({
      searchMaxVolume24H: value
    })
  }

  setSearchValueTokenContractVerified(value) {
    this.setState({
      searchValueTokenContractVerified: value
    })
  }

  setSearchValueTokenContractRenounced(value) {
    this.setState({
      searchValueTokenContractRenounced: value
    })
  }

  clearFilter() {
    this.setState(
      {
        searchSubTokenSymbol: null,
        searchSubTokenAddress: null,
        searchSubPoolAddress: null,
        searchPoolCreationTimestampRange: null,
        searchMinTokenPrice: null,
        searchMaxTokenPrice: null,
        searchMinPoolInitialLiquidity: null,
        searchMaxPoolInitialLiquidity: null,
        searchMinPoolTotalLiquidity: null,
        searchMaxPoolTotalLiquidity: null,
        searchMinPoolTotalTxs: null,
        searchMaxPoolTotalTxs: null,
        searchMinTokenTotalHolders: null,
        searchMaxTokenTotalHolders: null,
        searchMinTokenTotalSupply: null,
        searchMaxTokenTotalSupply: null,
        searchMinTokenTotalMarketCap: null,
        searchMaxTokenTotalMarketCap: null,
        searchMinVolume1H: null,
        searchMaxVolume1H: null,
        searchMinVolume24H: null,
        searchMaxVolume24H: null,
        searchValueTokenContractVerified: null,
        searchValueTokenContractRenounced: null,
      }
    )
  }

  async loadConfig() {
    try {
      const config = await this.context.loadConfig()

      this.setState({
        searchPoolCreationTimestampRange: config['search_pool_creation_timestamp_range'] / (60 * 60),
        searchMinPoolInitialLiquidity: config['keyword_search_min_pool_initial_liquidity'],
        searchMaxPoolInitialLiquidity: config['keyword_search_max_pool_initial_liquidity'],
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
        serachMinVolume1H: config['keyword_search_min_volume_1h'],
        searchMaxVolume1H: config['keyword_search_max_volume_1h'],
        searchMinVolume24H: config['keyword_search_min_volume_24h'],
        searchMaxVolume24H: config['keyword_search_max_volume_24h'],
        searchValueTokenContractVerified: config['keyword_search_value_token_contract_verified'] ? true : false,
        searchValueTokenContractRenounced: config['keyword_search_value_token_contract_renounced'] ? true : false,
      })
    } catch (error) {
      alert(error.message)
    }
  }

  applyFilter() {
    const { cookies } = this.props;

    const filter = {
      keyword_search_sub_token_symbol: this.state.searchSubTokenSymbol ? this.state.searchSubTokenSymbol : null,
      keyword_search_sub_token_address: this.state.searchSubTokenAddress ? this.state.searchSubTokenAddress : null,
      keyword_search_sub_pool_address: this.state.searchSubPoolAddress ? this.state.searchSubPoolAddress : null,
      keyword_search_min_pool_creation_timestamp: this.state.searchPoolCreationTimestampRange ? Date.now() / 1000 - this.state.searchPoolCreationTimestampRange * 60 * 60 : null,
      keyword_search_max_pool_creation_timestamp: this.state.searchPoolCreationTimestampRange ? Date.now() / 1000 : null,
      keyword_search_min_token_price: this.state.searchMinTokenPrice ? this.state.searchMinTokenPrice : null,
      keyword_search_max_token_price: this.state.searchMaxTokenPrice ? this.state.searchMaxTokenPrice : null,
      keyword_search_min_pool_initial_liquidity: this.state.searchMinPoolInitialLiquidity ? this.state.searchMinPoolInitialLiquidity : null,
      keyword_search_max_pool_initial_liquidity: this.state.searchMaxPoolInitialLiquidity ? this.state.searchMaxPoolInitialLiquidity : null,
      keyword_search_min_pool_total_liquidity: this.state.searchMinPoolTotalLiquidity ? this.state.searchMinPoolTotalLiquidity : null,
      keyword_search_max_pool_total_liquidity: this.state.searchMaxPoolTotalLiquidity ? this.state.searchMaxPoolTotalLiquidity : null,
      keyword_search_min_pool_total_txs: this.state.searchMinPoolTotalTxs ? this.state.searchMinPoolTotalTxs : null,
      keyword_search_max_pool_total_txs: this.state.searchMaxPoolTotalTxs ? this.state.searchMaxPoolTotalTxs : null,
      keyword_search_min_token_total_holders: this.state.searchMinTokenTotalHolders ? this.state.searchMinTokenTotalHolders : null,
      keyword_search_max_token_total_holders: this.state.searchMaxTokenTotalHolders ? this.state.searchMaxTokenTotalHolders : null,
      keyword_search_min_token_total_supply: this.state.searchMinTokenTotalSupply ? this.state.searchMinTokenTotalSupply : null,
      keyword_search_max_token_total_supply: this.state.searchMaxTokenTotalSupply ? this.state.searchMaxTokenTotalSupply : null,
      keyword_search_min_token_total_market_cap: this.state.searchMinTokenTotalMarketCap ? this.state.searchMinTokenTotalMarketCap : null,
      keyword_search_max_token_total_market_cap: this.state.searchMaxTokenTotalMarketCap ? this.state.searchMaxTokenTotalMarketCap : null,
      keyword_search_min_volume_1h: this.state.searchMinVolume1H ? this.state.searchMinVolume1H : null,
      keyword_search_max_volume_1h: this.state.searchMaxVolume1H ? this.state.searchMaxVolume1H : null,
      keyword_search_min_volume_24h: this.state.searchMinVolume24H ? this.state.searchMinVolume24H : null,
      keyword_search_max_volume_24h: this.state.searchMaxVolume24H ? this.state.searchMaxVolume24H : null,
      keyword_search_value_token_contract_verified: this.state.searchValueTokenContractVerified ? this.state.searchValueTokenContractVerified : null,
      keyword_search_value_token_contract_renounced: this.state.searchValueTokenContractRenounced ? this.state.searchValueTokenContractRenounced : null,
    }

    this.props.onFilter(filter)
  }


  render() {
    const { t } = this.props;

    const chains = ['Ethereum']
    const selectedChains = ['Ethereum']

    return <div style={{ display: this.props.open }}>
      <Box sx={style}>
        <div style={{ background: "#3b3f46", width: '100%', opacity: 1 }}>
          <div style={{ marginLeft: 16, marginRight: 16 }}>
            <CloseIcon style={{ float: "right", cursor: "pointer" }} onClick={this.props.onClose}>
            </CloseIcon>
            <h3>{t("filter")}</h3>
            <div>
              <div style={{ clear: "both", height: 50, display: this.props.hist != "true" ? "inline" : "none" }}>
                <span className="App-Label-Filter-Block">{t("chains")}</span>
                <CssSelect
                  multiple
                  value={selectedChains}
                  onChange={this.setChain}
                  renderValue={(selected) => selected.join(', ')}
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
                  <span className="App-Label-Filter-Block">{t("name_protocol")}</span>
                  <CssTextField
                    style={{ width: 300 }}
                    size="small"
                    variant="outlined"
                    value={this.state.searchSubTokenSymbol ? this.state.searchSubTokenSymbol : ""}
                    onChange={(event) => {
                      this.setSearchSubTokenSymbol(event.target.value);
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
                  <span className="App-Label-Filter-Block">{t("token_address")}</span>
                  <CssTextField
                    style={{ width: 300 }}
                    size="small"
                    variant="outlined"
                    value={this.state.searchSubTokenAddress ? this.state.searchSubTokenAddress : ""}
                    onChange={(event) => {
                      this.setSearchSubTokenAddress(event.target.value);
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
                  <span className="App-Label-Filter-Block">{t("pool_address")}</span>
                  <CssTextField
                    style={{ width: 300 }}
                    size="small"
                    variant="outlined"
                    value={this.state.searchSubPoolAddress ? this.state.searchSubPoolAddress : ""}
                    onChange={(event) => {
                      this.setSearchSubPoolAddress(event.target.value);
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
                    value={this.state.searchPoolCreationTimestampRange ? this.state.searchPoolCreationTimestampRange : ""}
                    onChange={(event) => {
                      this.setSearchPoolCreationTimestampRange(event.target.value);
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
                  <span className="App-Label-Filter-Block">{t("price_usd")}</span>
                  <CssTextField
                    type="number"
                    style={{ width: 125 }}
                    size="small"
                    variant="outlined"
                    value={this.state.searchMinTokenPrice ? this.state.searchMinTokenPrice : ""}
                    onChange={(event) => {
                      this.setSearchMinTokenPrice(event.target.value);
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
                    value={this.state.searchMaxTokenPrice ? this.state.searchMaxTokenPrice : ""}
                    onChange={(event) => {
                      this.setSearchMaxTokenPrice(event.target.value);
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
                  <span className="App-Label-Filter-Block">{t("initial_liquidity_usd")}</span>
                  <CssTextField
                    type="number"
                    style={{ width: 125 }}
                    size="small"
                    variant="outlined"
                    value={this.state.searchMinPoolInitialLiquidity ? this.state.searchMinPoolInitialLiquidity : ""}
                    onChange={(event) => {
                      this.setSearchMinPoolInitialLiquidity(event.target.value);
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
                    value={this.state.searchMaxPoolInitialLiquidity ? this.state.searchMaxPoolInitialLiquidity : ""}
                    onChange={(event) => {
                      this.setSearchMaxPoolInitialLiquidity(event.target.value);
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
                    value={this.state.searchMinPoolTotalLiquidity ? this.state.searchMinPoolTotalLiquidity : ""}
                    onChange={(event) => {
                      this.setSearchMinPoolTotalLiquidity(event.target.value);
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
                    value={this.state.searchMaxPoolTotalLiquidity ? this.state.searchMaxPoolTotalLiquidity : ""}
                    onChange={(event) => {
                      this.setSearchMaxPoolTotalLiquidity(event.target.value);
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
                    value={this.state.searchMinPoolTotalTxs ? this.state.searchMinPoolTotalTxs : ""}
                    onChange={(event) => {
                      this.setSearchMinPoolTotalTxs(event.target.value);
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
                    value={this.state.searchMaxPoolTotalTxs ? this.state.searchMaxPoolTotalTxs : ""}
                    onChange={(event) => {
                      this.setSearchMaxPoolTotalTxs(event.target.value);
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
                    value={this.state.searchMinTokenTotalHolders ? this.state.searchMinTokenTotalHolders : ""}
                    onChange={(event) => {
                      this.setSearchMinTokenTotalHolders(event.target.value);
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
                    value={this.state.searchMaxTokenTotalHolders ? this.state.searchMaxTokenTotalHolders : ""}
                    onChange={(event) => {
                      this.setSearchMaxTokenTotalHolders(event.target.value);
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
                  <span className="App-Label-Filter-Block">{t("total_supply")}</span>
                  <CssTextField
                    type="number"
                    style={{ width: 125 }}
                    size="small"
                    variant="outlined"
                    value={this.state.searchMinTokenTotalSupply ? this.state.searchMinTokenTotalSupply : ""}
                    onChange={(event) => {
                      this.setSearchMinTokenTotalSupply(event.target.value);
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
                    value={this.state.searchMaxTokenTotalSupply ? this.state.searchMaxTokenTotalSupply : ""}
                    onChange={(event) => {
                      this.setSearchMaxTokenTotalSupply(event.target.value);
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
                    value={this.state.searchMinTokenTotalMarketCap ? this.state.searchMinTokenTotalMarketCap : ""}
                    onChange={(event) => {
                      this.setSearchMinTokenTotalMarketCap(event.target.value);
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
                    value={this.state.searchMaxTokenTotalMarketCap ? this.state.searchMaxTokenTotalMarketCap : ""}
                    onChange={(event) => {
                      this.setSearchMaxTokenTotalMarketCap(event.target.value);
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
                  <span className="App-Label-Filter-Block">{t("volume_1h")}</span>
                  <CssTextField
                    type="number"
                    style={{ width: 125 }}
                    size="small"
                    variant="outlined"
                    value={this.state.searchMinVolume1H ? this.state.searchMinVolume1H : ""}
                    onChange={(event) => {
                      this.setSearchMinVolume1H(event.target.value);
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
                    value={this.state.searchMaxVolume1H ? this.state.searchMaxVolume1H : ""}
                    onChange={(event) => {
                      this.setSearchMaxVolume1H(event.target.value);
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
                    value={this.state.searchMinVolume24H ? this.state.searchMinVolume24H : ""}
                    onChange={(event) => {
                      this.setSearchMinVolume24H(event.target.value);
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
                    value={this.state.searchMaxVolume24H ? this.state.searchMaxVolume24H : ""}
                    onChange={(event) => {
                      this.setSearchMaxVolume24H(event.target.value);
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
                  <span className="App-Label-Filter-Block">{t("contract_verified")}</span>
                  <Checkbox
                    checked={this.state.searchValueTokenContractVerified}
                    onChange={(event) => {
                      this.setSearchValueTokenContractVerified(event.target.checked);
                    }}
                    style={{
                      color: "#ffffff",
                    }} />
                </div>
                <div style={{ clear: "both", height: 50 }}>
                  <span className="App-Label-Filter-Block">{t("contract_renounced")}</span>
                  <Checkbox
                    checked={this.state.searchValueTokenContractRenounced}
                    onChange={(event) => {
                      this.setSearchValueTokenContractRenounced(event.target.checked);
                    }}
                    style={{
                      color: "#ffffff",
                    }} />
                </div>
              </div>
            </div>
            <div style={{ textAlign: "center", marginTop: 16, marginBottom: 16 }}>
              <Button onClick={this.applyFilter} style={{ width: 200, marginRight: 12 }} variant="contained">{t("apply")}</Button>
              <Button onClick={this.clearFilter} style={{ width: 200, marginLeft: 12 }} variant="outlined">{t("clear")}</Button>
            </div>
          </div>
        </div>
      </Box>
    </div>
  }
}

export default withCookies(withTranslation()(Filter));