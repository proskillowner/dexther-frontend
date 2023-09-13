import React from "react";
import { withTranslation } from 'react-i18next';
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import Button from '@mui/material/Button';
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
      poolCreationTimeRange: this.props.data != null ? this.props.data.poolCreationTimeRange : null,
      minPoolInitialLiquidityUsd: this.props.data != null ? this.props.data.minPoolInitialLiquidityUsd : null,
      maxPoolInitialLiquidityUsd: this.props.data != null ? this.props.data.maxPoolInitialLiquidityUsd : null,
      minPoolTotalLiquidityUsd: this.props.data != null ? this.props.data.minPoolTotalLiquidityUsd : null,
      maxPoolTotalLiquidityUsd: this.props.data != null ? this.props.data.maxPoolTotalLiquidityUsd : null,
      minPoolTotalTxs: this.props.data != null ? this.props.data.minPoolTotalTxs : null,
      maxPoolTotalTxs: this.props.data != null ? this.props.data.maxPoolTotalTxs : null,
      minTokenTotalHolders: this.props.data != null ? this.props.data.minTokenTotalHolders : null,
      maxTokenTotalHolders: this.props.data != null ? this.props.data.maxTokenTotalHolders : null,
    }

    this.setPoolCreationTimeRange = this.setPoolCreationTimeRange.bind(this)
    this.setMinPoolInitialLiquidityUsd = this.setMinPoolInitialLiquidityUsd.bind(this)
    this.setMaxPoolInitialLiquidityUsd = this.setMaxPoolInitialLiquidityUsd.bind(this)
    this.setMinPoolTotalLiquidityUsd = this.setMinPoolTotalLiquidityUsd.bind(this)
    this.setMaxPoolTotalLiquidityUsd = this.setMaxPoolTotalLiquidityUsd.bind(this)
    this.setMinPoolTotalTxs = this.setMinPoolTotalTxs.bind(this)
    this.setMaxPoolTotalTxs = this.setMaxPoolTotalTxs.bind(this)
    this.setMinTokenTotalHolders = this.setMinTokenTotalHolders.bind(this)
    this.setMaxTokenTotalHolders = this.setMaxTokenTotalHolders.bind(this)

    this.loadConfig = this.loadConfig.bind(this)
    this.saveConfig = this.saveConfig.bind(this)
    this.chainOnChange = this.chainOnChange.bind(this)
  }

  componentDidMount() {
    this.loadConfig()
  }

  setPoolCreationTimeRange(value) {
    this.setState({
      poolCreationTimeRange: value
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

  async loadConfig() {
    try {
      const config = await this.context.loadConfig()

      this.setState({
        poolCreationTimeRange: config['pool_creation_time_range'] / (60 * 60),
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

  async saveConfig() {
    try {
      const { t } = this.props;

      const config = {
        pool_creation_time_range: this.state.poolCreationTimeRange ? this.state.poolCreationTimeRange * (60 * 60) : null,
        min_pool_initial_liquidity_usd: this.state.minPoolInitialLiquidityUsd ? this.state.minPoolInitialLiquidityUsd : null,
        max_pool_initial_liquidity_usd: this.state.maxPoolInitialLiquidityUsd ? this.state.maxPoolInitialLiquidityUsd : null,
        min_pool_total_liquidity_usd: this.state.minPoolTotalLiquidityUsd ? this.state.minPoolTotalLiquidityUsd : null,
        max_pool_total_liquidity_usd: this.state.maxPoolTotalLiquidityUsd ? this.state.maxPoolTotalLiquidityUsd : null,
        min_pool_total_txs: this.state.minPoolTotalTxs ? this.state.minPoolTotalTxs : null,
        max_pool_total_txs: this.state.maxPoolTotalTxs ? this.state.maxPoolTotalTxs : null,
        min_token_total_holders: this.state.minTokenTotalHolders ? this.state.minTokenTotalHolders : null,
        max_token_total_holders: this.state.maxTokenTotalHolders ? this.state.maxTokenTotalHolders : null,
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
          <div style={{ clear: "both", marginTop: 6 }}>
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
          <div style={{ columnCount: 2 }}>
            <div style={{ clear: "both", marginTop: 6 }}>
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
            <div style={{ clear: "both", marginTop: 6 }}>
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
            <div style={{ clear: "both", marginTop: 6 }}>
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
            <div style={{ clear: "both", marginTop: 6 }}>
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
          </div>
        </div>
        <Button onClick={this.saveConfig} style={{ marginTop: 16, paddingLeft: 16, paddingRight: 16 }} variant="contained">{t("save_search_default_value")}</Button>
      </div>
    </div>
  }
}

export default withCookies(withTranslation()(SearchFilter));