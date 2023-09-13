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
      subTokenName: this.props.data != null ? this.props.data.sub_token_name : null,
      subTokenAddress: this.props.data != null ? this.props.data.sub_token_address : null,
      subPoolAddress: this.props.data != null ? this.props.data.sub_pool_address : null,
      minPoolCreationTime: this.props.data != null ? this.props.data.min_pool_creation_time : null,
      maxPoolCreationTime: this.props.data != null ? this.props.data.max_pool_creation_time : null,
      minTokenPriceUsd: this.props.data != null ? this.props.data.min_token_price_usd : null,
      maxTokenPriceUsd: this.props.data != null ? this.props.data.max_token_price_usd : null,
      minPoolInitialLiquidityUsd: this.props.data != null ? this.props.data.min_pool_initial_liquidity_usd : null,
      maxPoolInitialLiquidityUsd: this.props.data != null ? this.props.data.max_pool_initial_liquidity_usd : null,
      minPoolTotalLiquidityUsd: this.props.data != null ? this.props.data.min_pool_total_liquidity_usd : null,
      maxPoolTotalLiquidityUsd: this.props.data != null ? this.props.data.max_pool_total_liquidity_usd : null,
      minPoolTotalTxs: this.props.data != null ? this.props.data.min_pool_total_txs : null,
      maxPoolTotalTxs: this.props.data != null ? this.props.data.max_pool_total_txs : null,
      minTokenTotalHolders: this.props.data != null ? this.props.data.min_token_total_holders : null,
      maxTokenTotalHolders: this.props.data != null ? this.props.data.max_token_total_holders : null,
      minTokenTotalSupply: this.props.data != null ? this.props.data.min_token_total_supply : null,
      maxTokenTotalSupply: this.props.data != null ? this.props.data.max_token_total_supply : null,
      minTokenMarketCapUsd: this.props.data != null ? this.props.data.min_token_market_cap_usd : null,
      maxTokenMarketCapUsd: this.props.data != null ? this.props.data.max_token_market_cap_usd : null,
      minVolume1H: this.props.data != null ? this.props.data.min_volume_1h : null,
      maxVolume1H: this.props.data != null ? this.props.data.max_volume_1h : null,
      minVolume24H: this.props.data != null ? this.props.data.min_volume_24h : null,
      maxVolume24H: this.props.data != null ? this.props.data.max_volume_24h : null,
    }

    this.setSubTokenName = this.setSubTokenName.bind(this)
    this.setSubTokenAddress = this.setSubTokenAddress.bind(this)
    this.setSubPoolAddress = this.setSubPoolAddress.bind(this)
    this.setMinPoolCreationTime = this.setMinPoolCreationTime.bind(this)
    this.setMaxPoolCreationTime = this.setMaxPoolCreationTime.bind(this)
    this.setMinTokenPriceUsd = this.setMinTokenPriceUsd.bind(this)
    this.setMaxTokenPriceUsd = this.setMaxTokenPriceUsd.bind(this)
    this.setMinPoolInitialLiquidityUsd = this.setMinPoolInitialLiquidityUsd.bind(this)
    this.setMaxPoolInitialLiquidityUsd = this.setMaxPoolInitialLiquidityUsd.bind(this)
    this.setMinPoolTotalLiquidityUsd = this.setMinPoolTotalLiquidityUsd.bind(this)
    this.setMaxPoolTotalLiquidityUsd = this.setMaxPoolTotalLiquidityUsd.bind(this)
    this.setMinPoolTotalTxs = this.setMinPoolTotalTxs.bind(this)
    this.setMaxPoolTotalTxs = this.setMaxPoolTotalTxs.bind(this)
    this.setMinTokenTotalHolders = this.setMinTokenTotalHolders.bind(this)
    this.setMaxTokenTotalHolders = this.setMaxTokenTotalHolders.bind(this)
    this.setMinTokenTotalSupply = this.setMinTokenTotalSupply.bind(this)
    this.setMaxTokenTotalSupply = this.setMaxTokenTotalSupply.bind(this)
    this.setMinTokenMarketCapUsd = this.setMinTokenMarketCapUsd.bind(this)
    this.setMaxTokenMarketCapUsd = this.setMaxTokenMarketCapUsd.bind(this)
    this.setMinPoolVolume1H = this.setMinVolume1H.bind(this)
    this.setMaxPoolVolume1H = this.setMaxVolume1H.bind(this)
    this.setMinPoolVolume24H = this.setMinVolume24H.bind(this)
    this.setMaxPoolVolume24H = this.setMaxVolume24H.bind(this)

    this.loadConfig = this.loadConfig.bind(this)
    this.applyFilter = this.applyFilter.bind(this)
    this.clearFilter = this.clearFilter.bind(this)
  }

  componentDidMount() {
    this.loadConfig()
  }

  setSubTokenName(value) {
    this.setState({
      subTokenName: value
    })
  }

  setSubTokenAddress(value) {
    this.setState({
      subTokenAddress: value
    })
  }

  setSubPoolAddress(value) {
    this.setState({
      subPoolAddress: value
    })
  }

  setMinPoolCreationTime(value) {
    this.setState({
      minPoolCreationTime: value
    })
  }

  setMaxPoolCreationTime(value) {
    this.setState({
      maxPoolCreationTime: value
    })
  }

  setMinTokenPriceUsd(value) {
    this.setState({
      minTokenPriceUsd: value
    })
  }

  setMaxTokenPriceUsd(value) {
    this.setState({
      maxTokenPriceUsd: value
    })
  }

  setMinPoolInitialLiquidityUsd(value) {
    this.setState({
      minPoolInitialLiquidityUsd: value
    })
  }

  setMaxPoolInitialLiquidityUsd(value) {
    this.setState({
      maxPoolInitialLiquidityUsd: value
    })
  }

  setMinPoolTotalLiquidityUsd(value) {
    this.setState({
      minPoolTotalLiquidityUsd: value
    })
  }

  setMaxPoolTotalLiquidityUsd(value) {
    this.setState({
      maxPoolTotalLiquidityUsd: value
    })
  }

  setMinPoolTotalTxs(value) {
    this.setState({
      minPoolTotalTxs: value
    })
  }

  setMaxPoolTotalTxs(value) {
    this.setState({
      maxPoolTotalTxs: value
    })
  }

  setMinTokenTotalHolders(value) {
    this.setState({
      minTokenTotalHolders: value
    })
  }

  setMaxTokenTotalHolders(value) {
    this.setState({
      maxTokenTotalHolders: value
    })
  }

  setMinTokenTotalSupply(value) {
    this.setState({
      minTokenTotalSupply: value
    })
  }

  setMaxTokenTotalSupply(value) {
    this.setState({
      maxTokenTotalSupply: value
    })
  }

  setMinTokenMarketCapUsd(value) {
    this.setState({
      minTokenMarketCapUsd: value
    })
  }

  setMaxTokenMarketCapUsd(value) {
    this.setState({
      maxTokenMarketCapUsd: value
    })
  }

  setMinVolume1H(value) {
    this.setState({
      minVolume1H: value
    })
  }

  setMaxVolume1H(value) {
    this.setState({
      maxVolume1H: value
    })
  }

  setMinVolume24H(value) {
    this.setState({
      minVolume24H: value
    })
  }

  setMaxVolume24H(value) {
    this.setState({
      maxVolume24H: value
    })
  }

  clearFilter() {
    this.setState(
      {
        subTokenName: null,
        subTokenAddress: null,
        subPoolAddress: null,
        minPoolCreationTime: null,
        maxPoolCreationTime: null,
        minTokenPriceUsd: null,
        maxTokenPriceUsd: null,
        minPoolInitialLiquidityUsd: null,
        maxPoolInitialLiquidityUsd: null,
        minPoolTotalLiquidityUsd: null,
        maxPoolTotalLiquidityUsd: null,
        minPoolTotalTxs: null,
        maxPoolTotalTxs: null,
        minTokenTotalHolders: null,
        maxTokenTotalHolders: null,
        minTokenTotalSupply: null,
        maxTokenTotalSupply: null,
        minTokenMarketCapUsd: null,
        maxTokenMarketCapUsd: null,
        minVolume1H: null,
        maxVolume1H: null,
        minVolume24H: null,
        maxVolume24H: null,
      }
    )
  }

  async loadConfig() {
    try {
      const config = await this.context.loadConfig()

      const poolCreationTimeRange = config['pool_creation_time_range']

      if (poolCreationTimeRange) {
        this.setState({
          minPoolCreationTime: Date.now() - poolCreationTimeRange * 1000,
          maxPoolCreationTime: Date.now(),
        })
      }

      this.setState({
        minPoolInitialLiquidityUsd: config['min_pool_initial_liquidity_usd'],
        maxPoolInitialLiquidityUsd: config['max_pool_initial_liquidity_usd'],
        minPoolTotalLiquidityUsd: config['min_pool_total_liquidity_usd'],
        maxPoolTotalLiquidityUsd: config['max_pool_total_liquidity_usd'],
        minPoolTotalTxs: config['min_pool_total_txs'],
        maxPoolTotalTxs: config['max_pool_total_txs'],
        minTokenTotalHolders: config['min_token_total_holders'],
        maxTokenTotalHolders: config['max_token_total_holders'],
      })
    } catch (error) {
      alert(error.message)
    }
  }

  applyFilter() {
    const { cookies } = this.props;

    const filter = {
      sub_token_name: this.state.subTokenName ? this.state.subTokenName : null,
      sub_token_address: this.state.subTokenAddress ? this.state.subTokenAddress : null,
      sub_pool_address: this.state.subPoolAddress ? this.state.subPoolAddress : null,
      min_pool_creation_time: this.state.minPoolCreationTime ? this.state.minPoolCreationTime / 1000 : null,
      max_pool_creation_time: this.state.maxPoolCreationTime ? this.state.maxPoolCreationTime / 1000 : null,
      min_token_price_usd: this.state.minTokenPriceUsd ? this.state.minTokenPriceUsd : null,
      max_token_price_usd: this.state.maxTokenPriceUsd ? this.state.maxTokenPriceUsd : null,
      min_pool_initial_liquidity_usd: this.state.minPoolInitialLiquidityUsd ? this.state.minPoolInitialLiquidityUsd : null,
      max_pool_initial_iiquidity_usd: this.state.maxPoolInitialLiquidityUsd ? this.state.maxPoolInitialLiquidityUsd : null,
      min_pool_total_liquidity_usd: this.state.minPoolTotalLiquidityUsd ? this.state.minPoolTotalLiquidityUsd : null,
      max_pool_total_iiquidity_usd: this.state.maxPoolTotalLiquidityUsd ? this.state.maxPoolTotalLiquidityUsd : null,
      min_pool_total_txs: this.state.minPoolTotalTxs ? this.state.minPoolTotalTxs : null,
      max_pool_total_txs: this.state.maxPoolTotalTxs ? this.state.maxPoolTotalTxs : null,
      min_token_total_holders: this.state.minTokenTotalHolders ? this.state.minTokenTotalHolders : null,
      max_token_total_holders: this.state.maxTokenTotalHolders ? this.state.maxTokenTotalHolders : null,
      min_token_total_supply: this.state.minTokenTotalSupply ? this.state.minTokenTotalSupply : null,
      max_token_total_supply: this.state.maxTokenTotalSupply ? this.state.maxTokenTotalSupply : null,
      min_token_market_cap_usd: this.state.minTokenMarketCapUsd ? this.state.minTokenMarketCapUsd : null,
      max_token_market_cap_usd: this.state.maxTokenMarketCapUsd ? this.state.maxTokenMarketCapUsd : null,
      min_volume_1h: this.state.minVolume1H ? this.state.minVolume1H : null,
      max_volume_1h: this.state.maxVolume1H ? this.state.maxVolume1H : null,
      min_volume_24h: this.state.minVolume24H ? this.state.minVolume24H : null,
      max_volume_24h: this.state.maxVolume24H ? this.state.maxVolume24H : null,
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
                    value={this.state.subTokenName ? this.state.subTokenName : ""}
                    onChange={(event) => {
                      this.setSubTokenName(event.target.value);
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
                    value={this.state.subTokenAddress ? this.state.subTokenAddress : ""}
                    onChange={(event) => {
                      this.setSubTokenAddress(event.target.value);
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
                    value={this.state.subPoolAddress ? this.state.subPoolAddress : ""}
                    onChange={(event) => {
                      this.setSubPoolAddress(event.target.value);
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
                  <span className="App-Label-Filter-Block">{this.props.hist != "true" ? t("listed_since") : t("date_history_range")}</span>
                  <LocalizationProvider style={{ width: 100 }} dateAdapter={AdapterDayjs} adapterLocale="id-id">
                    <DateTimePicker
                      value={dayjs(this.state.minPoolCreationTime)}
                      onChange={(newValue) => this.setMinPoolCreationTime(newValue)}
                      slotProps={{ textField: { size: 'small' } }}
                      sx={{
                        svg: {
                          color: "#ffffff"
                        },
                        input: {
                          color: "#ffffff"
                        },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#E0E3E7',
                          },
                          '&:hover fieldset': {
                            borderColor: '#B2BAC2',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#A0AAB4',
                          },
                        },
                      }} />
                  </LocalizationProvider>
                  <span className="App-Label-Filter-Inline">{t("to")}</span>
                </div>
                <div style={{ clear: "both", height: 50 }}>
                  <span className="App-Label-Filter-Block">&nbsp;</span>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      value={dayjs(this.state.maxPoolCreationTime)}
                      onChange={(newValue) => this.setMaxPoolCreationTime(newValue)}
                      slotProps={{ textField: { size: 'small' } }}
                      sx={{
                        svg: {
                          color: "#ffffff"
                        },
                        input: {
                          color: "#ffffff"
                        },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#E0E3E7',
                          },
                          '&:hover fieldset': {
                            borderColor: '#B2BAC2',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#A0AAB4',
                          },
                        },
                      }} />
                  </LocalizationProvider>
                </div>
                <div style={{ clear: "both", height: 50 }}>
                  <span className="App-Label-Filter-Block">{t("price_usd")}</span>
                  <CssTextField
                    type="number"
                    style={{ width: 125 }}
                    size="small"
                    variant="outlined"
                    value={this.state.minTokenPriceUsd ? this.state.minTokenPriceUsd : ""}
                    onChange={(event) => {
                      this.setMinTokenPriceUsd(event.target.value);
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
                    value={this.state.maxTokenPriceUsd ? this.state.maxTokenPriceUsd : ""}
                    onChange={(event) => {
                      this.setMaxTokenPriceUsd(event.target.value);
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
                    value={this.state.minPoolInitialLiquidityUsd ? this.state.minPoolInitialLiquidityUsd : ""}
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
                    value={this.state.maxPoolInitialLiquidityUsd ? this.state.maxPoolInitialLiquidityUsd : ""}
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
                    value={this.state.minPoolTotalLiquidityUsd ? this.state.minPoolTotalLiquidityUsd : ""}
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
                    value={this.state.maxPoolTotalLiquidityUsd ? this.state.maxPoolTotalLiquidityUsd : ""}
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
                  <span className="App-Label-Filter-Block">{t("total_supply")}</span>
                  <CssTextField
                    type="number"
                    style={{ width: 125 }}
                    size="small"
                    variant="outlined"
                    value={this.state.minTokenTotalSupply ? this.state.minTokenTotalSupply : ""}
                    onChange={(event) => {
                      this.setMinTokenTotalSupply(event.target.value);
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
                    value={this.state.maxTokenTotalSupply ? this.state.maxTokenTotalSupply : ""}
                    onChange={(event) => {
                      this.setMaxTokenTotalSupply(event.target.value);
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
                    value={this.state.minTokenMarketCapUsd ? this.state.minTokenMarketCapUsd : ""}
                    onChange={(event) => {
                      this.setMinTokenMarketCapUsd(event.target.value);
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
                    value={this.state.maxTokenMarketCapUsd ? this.state.maxTokenMarketCapUsd : ""}
                    onChange={(event) => {
                      this.setMaxTokenMarketCapUsd(event.target.value);
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
                  <span className="App-Label-Filter-Block">{t("token_holder")}</span>
                  <CssTextField
                    type="number"
                    style={{ width: 125 }}
                    size="small"
                    variant="outlined"
                    value={this.state.minTokenTotalHolders ? this.state.minTokenTotalHolders : ""}
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
                    value={this.state.maxTokenTotalHolders ? this.state.maxTokenTotalHolders : ""}
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
                  <span className="App-Label-Filter-Block">{t("total_tx")}</span>
                  <CssTextField
                    type="number"
                    style={{ width: 125 }}
                    size="small"
                    variant="outlined"
                    value={this.state.minPoolTotalTxs ? this.state.minPoolTotalTxs : ""}
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
                    value={this.state.maxPoolTotalTxs ? this.state.maxPoolTotalTxs : ""}
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
                  <span className="App-Label-Filter-Block">{t("volume_1h")}</span>
                  <CssTextField
                    type="number"
                    style={{ width: 125 }}
                    size="small"
                    variant="outlined"
                    value={this.state.minVolume1H ? this.state.minVolume1H : ""}
                    onChange={(event) => {
                      this.setMinVolume1H(event.target.value);
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
                    value={this.state.maxVolume1H ? this.state.maxVolume1H : ""}
                    onChange={(event) => {
                      this.setMaxVolume1H(event.target.value);
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
                    value={this.state.minVolume24H ? this.state.minVolume24H : ""}
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
                    value={this.state.maxVolume24H ? this.state.maxVolume24H : ""}
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