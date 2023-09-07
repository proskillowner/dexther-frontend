import React from "react";
import { withTranslation } from 'react-i18next';
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';

import { CssSelect, CssTextField, style } from "../../Style.js";
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

class SearchFilter extends React.Component {
  static contextType = MainContext
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };


  constructor(props) {
    super(props)

    const { cookies } = this.props;

    this.state = {
      startPrice: this.props.data != null ? this.props.data.startPrice : null,
      endPrice: this.props.data != null ? this.props.data.endPrice : null,
      startLiquidity: this.props.data != null ? this.props.data.startLiquidity : null,
      endLiquidity: this.props.data != null ? this.props.data.endLiquidity : null,
      startMarketCap: this.props.data != null ? this.props.data.startMarketCap : null,
      endMarketCap: this.props.data != null ? this.props.data.endMarketCap : null,
      startTotalSupply: this.props.data != null ? this.props.data.startTotalSupply : null,
      endTotalSupply: this.props.data != null ? this.props.data.endTotalSupply : null,
      startHolder: this.props.data != null ? this.props.data.startHolder : null,
      endHolder: this.props.data != null ? this.props.data.endHolder : null,
      startTotalTx: this.props.data != null ? this.props.data.startTotalTx : null,
      endTotalTx: this.props.data != null ? this.props.data.endTotalTx : null,
      startVolume24H: this.props.data != null ? this.props.data.startVolume24H : null,
      endVolume24H: this.props.data != null ? this.props.data.endVolume24H : null,
      startCreationDate: this.props.data != null ? this.props.data.startCreationDate : null,
      endCreationDate: this.props.data != null ? this.props.data.endCreationDate : null,
    }

    this.setStartPrice = this.setStartPrice.bind(this)
    this.setEndPrice = this.setEndPrice.bind(this)
    this.setStartLiquidity = this.setStartLiquidity.bind(this)
    this.setEndLiquidity = this.setEndLiquidity.bind(this)
    this.setStartMarketCap = this.setStartMarketCap.bind(this)
    this.setEndMarketCap = this.setEndMarketCap.bind(this)
    this.setStartTotalSupply = this.setStartTotalSupply.bind(this)
    this.setEndTotalSupply = this.setEndTotalSupply.bind(this)
    this.setStartHolder = this.setStartHolder.bind(this)
    this.setEndHolder = this.setEndHolder.bind(this)
    this.setStartTotalTx = this.setStartTotalTx.bind(this)
    this.setEndTotalTx = this.setEndTotalTx.bind(this)
    this.setStartVolume24H = this.setStartVolume24H.bind(this)
    this.setEndVolume24H = this.setEndVolume24H.bind(this)
    this.setTimeRange = this.setTimeRange.bind(this)

    this.loadConfig = this.loadConfig.bind(this)
    this.saveConfig = this.saveConfig.bind(this)
    this.chainOnChange = this.chainOnChange.bind(this)
  }

  componentDidMount() {
    this.loadConfig()
  }

  setStartVolume24H(value) {
    this.setState({
      startVolume24H: value
    })
  }

  setEndVolume24H(value) {
    this.setState({
      endVolume24H: value
    })
  }

  setStartTotalTx(value) {
    this.setState({
      startTotalTx: value
    })
  }

  setEndTotalTx(value) {
    this.setState({
      endTotalTx: value
    })
  }

  setStartHolder(value) {
    this.setState({
      startHolder: value
    })
  }

  setEndHolder(value) {
    this.setState({
      endHolder: value
    })
  }

  setStartTotalSupply(value) {
    this.setState({
      startTotalSupply: value
    })
  }

  setEndTotalSupply(value) {
    this.setState({
      endTotalSupply: value
    })
  }

  setStartPrice(value) {
    this.setState({
      startPrice: value
    })
  }

  setEndPrice(value) {
    this.setState({
      endPrice: value
    })
  }

  setStartLiquidity(value) {
    this.setState({
      startLiquidity: value
    })
  }

  setEndLiquidity(value) {
    this.setState({
      endLiquidity: value
    })
  }

  setStartMarketCap(value) {
    this.setState({
      startMarketCap: value
    })
  }

  setEndMarketCap(value) {
    this.setState({
      endMarketCap: value
    })
  }

  setTimeRange(value) {
    this.setState({
      timeRange: value
    })
  }

  async loadConfig() {
    try {
      const config = await this.context.loadConfig()

      this.setState({
        startPrice: config["start_token_price"],
        endPrice: config["end_token_price"],
        startLiquidity: config["start_pool_liquidity"],
        endLiquidity: config["end_pool_liquidity"],
        startMarketCap: config["start_token_market_cap"],
        endMarketCap: config["end_token_market_cap"],
        startTotalSupply: config["start_token_total_supply"],
        endTotalSupply: config["end_token_total_supply"],
        startHolder: config["start_token_total_holders"],
        endHolder: config["end_token_total_holders"],
        startTotalTx: config["start_pool_total_txs"],
        endTotalTx: config["end_pool_total_txs"],
        startVolume24H: config["start_pool_volume_24h"],
        endVolume24H: config["end_pool_volume_24h"],
        timeRange: config["time_range"],
      })
    } catch (error) {
      alert(error.message)
    }
  }

  async saveConfig() {
    try {
      const { t } = this.props;

      const config = {
        start_token_price: this.state.startPrice ? this.state.startPrice : null,
        end_token_price: this.state.endPrice ? this.state.endPrice : null,
        start_pool_liquidity: this.state.startLiquidity ? this.state.startLiquidity : null,
        end_pool_liquidity: this.state.endLiquidity ? this.state.endLiquidity : null,
        start_token_market_cap: this.state.startMarketCap ? this.state.startMarketCap : null,
        end_token_market_cap: this.state.endMarketCap ? this.state.endMarketCap : null,
        start_token_total_supply: this.state.startTotalSupply ? this.state.startTotalSupply : null,
        end_token_total_supply: this.state.endTotalSupply ? this.state.endTotalSupply : null,
        start_token_total_holders: this.state.startHolder ? this.state.startHolder : null,
        end_token_total_holders: this.state.endHolder ? this.state.endHolder : null,
        start_pool_total_txs: this.state.startTotalTx ? this.state.startTotalTx : null,
        end_pool_total_txs: this.state.endTotalTx ? this.state.endTotalTx : null,
        start_pool_volume_24h: this.state.startVolume24H ? this.state.startVolume24H : null,
        end_pool_volume_24h: this.state.endVolume24H ? this.state.endVolume24H : null,
        time_range: this.state.timeRange ? this.state.timeRange : null,
      }

      await this.context.saveConfig(config)
      alert(t("save_search_default_value_success"))
    } catch (error) {
      alert(error.message)
    }
  }

  chainOnChange(event) {
  };

  render() {
    const { t } = this.props;

    const chains = ['Ethereum']
    const selectedChains = ['Ethereum']

    return <div>
      <h2>{t("search_default_value")}</h2>
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
                value={this.state.timeRange ? this.state.timeRange : ""}
                onChange={(event) => {
                  this.setTimeRange(event.target.value);
                }}
                InputLabelProps={{
                  shrink: false,
                  className: "App-TextField-Filter"
                }}
                InputProps={{
                  className: "App-TextField-Filter"
                }} />
              <span className="App-Label-Filter-NoFloat">{t("hours_from_now")}</span>
              <span className="App-Label-Filter">{t("date_creation_range")}</span>
            </div>
            <div style={{ clear: "both", marginTop: 6 }}>
              <CssTextField
                type="number"
                style={{ width: 125 }}
                size="small"
                variant="outlined"
                value={this.state.startPrice ? this.state.startPrice : ""}
                onChange={(event) => {
                  this.setStartPrice(event.target.value);
                }}
                InputLabelProps={{
                  shrink: false,
                  className: "App-TextField-Filter"
                }}
                InputProps={{
                  className: "App-TextField-Filter"
                }} />
              <span className="App-Label-Filter-NoFloat">{t("to")}</span>
              <CssTextField
                type="number"
                style={{ width: 125 }}
                size="small"
                variant="outlined"
                value={this.state.endPrice ? this.state.endPrice : ""}
                onChange={(event) => {
                  this.setEndPrice(event.target.value);
                }}
                InputLabelProps={{
                  shrink: false,
                  className: "App-TextField-Filter"
                }}
                InputProps={{
                  className: "App-TextField-Filter"
                }} />
              <span className="App-Label-Filter">{t("price_range_usd")}</span>
            </div>
            <div style={{ clear: "both", marginTop: 6 }}>
              <CssTextField
                type="number"
                style={{ width: 125 }}
                size="small"
                variant="outlined"
                value={this.state.startLiquidity ? this.state.startLiquidity : ""}
                onChange={(event) => {
                  this.setStartLiquidity(event.target.value);
                }}
                InputLabelProps={{
                  shrink: false,
                  className: "App-TextField-Filter"
                }}
                InputProps={{
                  className: "App-TextField-Filter"
                }} />
              <span className="App-Label-Filter-NoFloat">{t("to")}</span>
              <CssTextField
                type="number"
                style={{ width: 125 }}
                size="small"
                value={this.state.endLiquidity ? this.state.endLiquidity : ""}
                onChange={(event) => {
                  this.setEndLiquidity(event.target.value);
                }}
                variant="outlined"
                InputLabelProps={{
                  shrink: false,
                  className: "App-TextField-Filter"
                }}
                InputProps={{
                  className: "App-TextField-Filter"
                }} />
              <span className="App-Label-Filter">{t("total_liquidity_range_usd")}</span>
            </div>
            <div style={{ clear: "both", marginTop: 6 }}>
              <CssTextField
                type="number"
                style={{ width: 125 }}
                size="small"
                variant="outlined"
                value={this.state.startMarketCap ? this.state.startMarketCap : ""}
                onChange={(event) => {
                  this.setStartMarketCap(event.target.value);
                }}
                InputLabelProps={{
                  shrink: false,
                  className: "App-TextField-Filter"
                }}
                InputProps={{
                  className: "App-TextField-Filter"
                }} />
              <span className="App-Label-Filter-NoFloat">{t("to")}</span>
              <CssTextField
                type="number"
                style={{ width: 125 }}
                size="small"
                variant="outlined"
                value={this.state.endMarketCap ? this.state.endMarketCap : ""}
                onChange={(event) => {
                  this.setEndMarketCap(event.target.value);
                }}
                InputLabelProps={{
                  shrink: false,
                  className: "App-TextField-Filter"
                }}
                InputProps={{
                  className: "App-TextField-Filter"
                }} />
              <span className="App-Label-Filter">{t("total_market_cap_range_usd")}</span>
            </div>
            <div style={{ clear: "both", marginTop: 6 }}>
              <CssTextField
                type="number"
                style={{ width: 125 }}
                size="small"
                variant="outlined"
                value={this.state.startTotalSupply ? this.state.startTotalSupply : ""}
                onChange={(event) => {
                  this.setStartTotalSupply(event.target.value);
                }}
                InputLabelProps={{
                  shrink: false,
                  className: "App-TextField-Filter"
                }}
                InputProps={{
                  className: "App-TextField-Filter"
                }} />
              <span className="App-Label-Filter-NoFloat">{t("to")}</span>
              <CssTextField
                type="number"
                style={{ width: 125 }}
                size="small"
                variant="outlined"
                value={this.state.endTotalSupply ? this.state.endTotalSupply : ""}
                onChange={(event) => {
                  this.setEndTotalSupply(event.target.value);
                }}
                InputLabelProps={{
                  shrink: false,
                  className: "App-TextField-Filter"
                }}
                InputProps={{
                  className: "App-TextField-Filter"
                }} />
              <span className="App-Label-Filter">{t("total_supply_range")}</span>
            </div>
            <div style={{ clear: "both", marginTop: 6 }}>
              <CssTextField
                type="number"
                style={{ width: 125 }}
                size="small"
                variant="outlined"
                value={this.state.startHolder ? this.state.startHolder : ""}
                onChange={(event) => {
                  this.setStartHolder(event.target.value);
                }}
                InputLabelProps={{
                  shrink: false,
                  className: "App-TextField-Filter"
                }}
                InputProps={{
                  className: "App-TextField-Filter"
                }} />
              <span className="App-Label-Filter-NoFloat">{t("to")}</span>
              <CssTextField
                type="number"
                style={{ width: 125 }}
                size="small"
                variant="outlined"
                value={this.state.endHolder ? this.state.endHolder : ""}
                onChange={(event) => {
                  this.setEndHolder(event.target.value);
                }}
                InputLabelProps={{
                  shrink: false,
                  className: "App-TextField-Filter"
                }}
                InputProps={{
                  className: "App-TextField-Filter"
                }} />
              <span className="App-Label-Filter">{t("holder_range_k")}</span>
            </div>
            <div style={{ clear: "both", marginTop: 6 }}>
              <CssTextField
                type="number"
                style={{ width: 125 }}
                size="small"
                variant="outlined"
                value={this.state.startVolume24H}
                onChange={(event) => {
                  this.setStartVolume24H(event.target.value);
                }}
                InputLabelProps={{
                  shrink: false,
                  className: "App-TextField-Filter"
                }}
                InputProps={{
                  className: "App-TextField-Filter"
                }} />
              <span className="App-Label-Filter-NoFloat">{t("to")}</span>
              <CssTextField
                type="number"
                style={{ width: 125 }}
                size="small"
                variant="outlined"
                value={this.state.endVolume24H}
                onChange={(event) => {
                  this.setEndVolume24H(event.target.value);
                }}
                InputLabelProps={{
                  shrink: false,
                  className: "App-TextField-Filter"
                }}
                InputProps={{
                  className: "App-TextField-Filter"
                }} />
              <span className="App-Label-Filter">{t("volume_24h_range")}</span>
            </div>
            <div style={{ clear: "both", marginTop: 6 }}>
              <CssTextField
                type="number"
                style={{ width: 125 }}
                size="small"
                variant="outlined"
                value={this.state.startTotalTx}
                onChange={(event) => {
                  this.setStartTotalTx(event.target.value);
                }}
                InputLabelProps={{
                  shrink: false,
                  className: "App-TextField-Filter"
                }}
                InputProps={{
                  className: "App-TextField-Filter"
                }} />
              <span className="App-Label-Filter-NoFloat">{t("to")}</span>
              <CssTextField
                type="number"
                style={{ width: 125 }}
                size="small"
                variant="outlined"
                value={this.state.endTotalTx}
                onChange={(event) => {
                  this.setEndTotalTx(event.target.value);
                }}
                InputLabelProps={{
                  shrink: false,
                  className: "App-TextField-Filter"
                }}
                InputProps={{
                  className: "App-TextField-Filter"
                }} />
              <span className="App-Label-Filter">{t("total_tx_range")}</span>
            </div>

          </div>
        </div>
        <Button onClick={this.saveConfig} style={{ marginTop: 16, paddingLeft: 16, paddingRight: 16 }} variant="contained">{t("save_search_default_value")}</Button>
      </div>
    </div>
  }
}

export default withCookies(withTranslation()(SearchFilter));