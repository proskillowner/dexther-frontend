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
import { SERVER_URL, API_GET_CONFIG, API_SET_CONFIG, API_GET_CHAIN } from '../../Api.js'


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
  width: 350,
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


class SearchFilter extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };


  constructor(props) {
    super(props)

    const { cookies } = this.props;
    this.state = {
      selectedChains: this.props.data != null ? this.props.data.selectedChains : [],
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
      chains: []

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

    this.submit = this.submit.bind(this)
    this.loadData = this.loadData.bind(this)
    this.chainOnChange = this.chainOnChange.bind(this)
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

  componentDidMount() {
    this.loadData()
    this.loadChains()
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

  async loadData() {

    await fetch(`${SERVER_URL}${API_GET_CONFIG}`, {
      method: 'POST',
    })
      .then((response) => response.json())
      .then((data) => {
        const chains = 'Ethereum'

        this.setState(
          {
            startPrice: this.getConfigValue(data, "start_price"),
            endPrice: this.getConfigValue(data, "end_price"),
            startLiquidity: this.getConfigValue(data, "start_liquidity"),
            endLiquidity: this.getConfigValue(data, "end_liquidity"),
            startMarketCap: this.getConfigValue(data, "start_market_cap"),
            endMarketCap: this.getConfigValue(data, "end_market_cap"),
            startTotalSupply: this.getConfigValue(data, "start_total_supply"),
            endTotalSupply: this.getConfigValue(data, "end_total_supply"),
            startHolder: this.getConfigValue(data, "start_holder"),
            endHolder: this.getConfigValue(data, "end_holder"),
            startTotalTx: this.getConfigValue(data, "start_total_tx"),
            endTotalTx: this.getConfigValue(data, "end_total_tx"),
            startVolume24H: this.getConfigValue(data, "start_volume_24h"),
            endVolume24H: this.getConfigValue(data, "end_volume_24h"),
            timeRange: this.getConfigValue(data, "time_range"),
            selectedChains: chains ? chains.split(",") : []
          }
        )
      })
      .catch((err) => {
        alert(err.message)
      })

  }

  getConfigValue(config, config_key) {
    for (var i = 0; i < config.length; i++) {
      if (config[i].config_key == config_key) {
        return config[i].config_value
      }
    }

    return ""
  }

  submit() {
    const { cookies } = this.props;

    const data = {}

    // data.chains = this.state.selectedChains.length > 0 ? this.state.selectedChains.join(",") : null
    data.start_price = this.state.startPrice ? this.state.startPrice : null
    data.end_price = this.state.endPrice ? this.state.endPrice : null
    data.start_liquidity = this.state.startLiquidity ? this.state.startLiquidity : null
    data.end_liquidity = this.state.endLiquidity ? this.state.endLiquidity : null
    data.start_market_cap = this.state.startMarketCap ? this.state.startMarketCap : null
    data.end_market_cap = this.state.endMarketCap ? this.state.endMarketCap : null
    data.start_total_supply = this.state.startTotalSupply ? this.state.startTotalSupply : null
    data.end_total_supply = this.state.endTotalSupply ? this.state.endTotalSupply : null
    data.start_holder = this.state.startHolder ? this.state.startHolder : null
    data.end_holder = this.state.endHolder ? this.state.endHolder : null
    data.start_total_tx = this.state.startTotalTx ? this.state.startTotalTx : null
    data.end_total_tx = this.state.endTotalTx ? this.state.endTotalTx : null
    data.start_volume_24h = this.state.startVolume24H ? this.state.startVolume24H : null
    data.end_volume_24h = this.state.endVolume24H ? this.state.endVolume24H : null
    data.time_range = this.state.timeRange ? this.state.timeRange : null

    this.save(data)
  }


  async save(data) {
    const { t } = this.props;

    const configs = []

    for (const key in data) {
      configs.push({
        config_key: key,
        config_value: data[key]
      })
    }

    await fetch(`${SERVER_URL}${API_SET_CONFIG}`, {
      method: 'POST',
      body: JSON.stringify(configs),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        alert(t("save_search_default_value_success"))
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

  render() {
    const { t } = this.props;

    var chains = this.state.chains ? this.state.chains : []

    return <div>
      <div className='Dashboard-content'>
        <h2>{t("search_default_value")}</h2>
      </div>
      <div >
        <div style={{ marginLeft: 16, marginRight: 16 }}>
          <div style={{ columnCount: 2 }}>
            <div>
              <CssSelect
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
        <Button onClick={this.submit} style={{ marginTop: 16, paddingLeft: 16, paddingRight: 16 }} variant="contained">{t("save_search_default_value")}</Button>
      </div>
    </div>
  }
}

export default withCookies(withTranslation()(SearchFilter));