import React from "react";
import { withTranslation } from 'react-i18next';
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/CloseOutlined';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Button from '@mui/material/Button';
import dayjs, { Dayjs } from 'dayjs';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';

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

class Filter extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  
    constructor(props) {
        super(props)    
        
        const { cookies } = this.props;

        if (this.props.data != null) {
            var startCreationDate = this.props.data.start_creation_date
            var sStartCreationDate = ""
            if (startCreationDate) {
                var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                var dateFormat = new Date(startCreationDate*1)

                var year = dateFormat.getFullYear();
                var month = months[dateFormat.getMonth()];
                var date = dateFormat.getDate();
                var hour = dateFormat.getHours();
                var min = dateFormat.getMinutes();
                var sec = dateFormat.getSeconds();

                var sStartCreationDate = month +", " + date + " " + year + " " + hour + ":" + min + ":" + sec
            }  
            
            var endCreationDate = this.props.data.end_creation_date
            var sEndCreationDate = ""
            if (endCreationDate) {
                var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                var dateFormat = new Date(endCreationDate*1)

                var year = dateFormat.getFullYear();
                var month = months[dateFormat.getMonth()];
                var date = dateFormat.getDate();
                var hour = dateFormat.getHours();
                var min = dateFormat.getMinutes();
                var sec = dateFormat.getSeconds();

                var sEndCreationDate = month +", " + date + " " + year + " " + hour + ":" + min + ":" + sec
            }  
        }

        this.state = {
            selectedChains: this.props.data != null && this.props.data.chains ? this.props.data.chains.split(',') : [] ,
            name: this.props.data != null ? this.props.data.name : "" ,
            address: this.props.data != null ? this.props.data.address : "" ,
            pairAddress: this.props.data != null ? this.props.data.pair_address : ""  ,
            startPrice: this.props.data != null ? this.props.data.start_price : "" ,
            endPrice: this.props.data != null ? this.props.data.end_price : null ,
            startLiquidity: this.props.data != null ? this.props.data.start_liquidity : null ,
            endLiquidity: this.props.data != null ? this.props.data.end_liquidity : null ,
            startMarketCap: this.props.data != null ? this.props.data.start_market_cap : null ,
            endMarketCap: this.props.data != null ? this.props.data.end_market_cap : null ,
            startTotalSupply: this.props.data != null ? this.props.data.start_total_supply : null ,
            endTotalSupply: this.props.data != null ? this.props.data.end_total_supply : null ,
            startHolder: this.props.data != null ? this.props.data.start_holder : null ,
            endHolder: this.props.data != null ? this.props.data.end_holder : null ,
            startTotalTx: this.props.data != null ? this.props.data.start_total_tx : null ,
            endTotalTx: this.props.data != null ? this.props.data.end_total_tx : null ,
            startVolume24H: this.props.data != null ? this.props.data.start_volume_24h : null ,
            endVolume24H: this.props.data != null ? this.props.data.end_volume_24h : null ,            
            startCreationDate: dayjs(sStartCreationDate),
            endCreationDate: dayjs(sEndCreationDate),
                                                
        }   

        this.setChain = this.setChain.bind(this)
        this.setName = this.setName.bind(this)
        this.setAddress = this.setAddress.bind(this)
        this.setPairAddress = this.setPairAddress.bind(this)
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
        this.setStartCreationDate = this.setStartCreationDate.bind(this)
        this.setEndCreationDate = this.setEndCreationDate.bind(this)
        
        this.submit = this.submit.bind(this)
        this.clear = this.clear.bind(this)
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

    setChain(event) {
        const {
          target: { value },
        } = event;

        this.setState(
          {
            selectedChains: typeof value === 'string' ? value.split(',') : value
          }
        )
      };  

    setName(value) {
        this.setState({
            name: value
        })
    }

    setAddress(value) {
        this.setState({
            address: value
        })
    }

    setPairAddress(value) {
        this.setState({
            pairAddress: value
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

    setStartCreationDate(value) {
        this.setState({
            startCreationDate: value
        })
    }

    setEndCreationDate(value) {
        this.setState({
            endCreationDate: value
        })
    }

    clear() {
        this.setState(
            {
                chain: "",
                name: "",
                address: "",
                pairAddress: "",    
                startPrice: "",   
                endPrice: "",   
                startLiquidity: "",   
                endLiquidity: "",   
                startMarketCap: "",   
                endMarketCap: "",  
                startTotalSupply: "",  
                endTotalSupply: "",      
                startHolder: "",      
                endHolder: "", 
                startTotalTx: "", 
                endTotalTx: "",
                startVolume24H: "", 
                endVolume24H: "",                
                startCreationDate: "",  
                endCreationDate: "",                                                  
            }
        )

    }
    

    submit() {
        const { cookies } = this.props;


        var model = new Object()
        model.chains =  this.state.selectedChains.length > 0 ? this.state.selectedChains.join(",") : null
        model.name =  this.state.name
        model.address =  this.state.address
        model.pairAddress =  this.state.pairAddress

        model.startPrice =  this.state.startPrice != null && this.state.startPrice.length > 0 ? this.state.startPrice : null
        model.endPrice =  this.state.endPrice != null && this.state.endPrice.length > 0 ? this.state.endPrice : null
        model.startLiquidity =  this.state.startLiquidity != null && this.state.startLiquidity.length > 0 ? this.state.startLiquidity : null
        model.endLiquidity =  this.state.endLiquidity != null && this.state.endLiquidity.length > 0 ? this.state.endLiquidity : null
        model.startMarketCap =  this.state.startMarketCap != null && this.state.startMarketCap.length > 0 ? this.state.startMarketCap : null
        model.endMarketCap =  this.state.endMarketCap != null && this.state.endMarketCap.length > 0 ? this.state.endMarketCap : null
        model.startTotalSupply =  this.state.startTotalSupply != null && this.state.startTotalSupply.length > 0 ? this.state.startTotalSupply : null
        model.endTotalSupply =  this.state.endTotalSupply != null && this.state.endTotalSupply.length > 0 ? this.state.endTotalSupply : null
        model.startHolder =  this.state.startHolder != null && this.state.startHolder.length > 0 ? this.state.startHolder : null
        model.endHolder =  this.state.endHolder != null && this.state.endHolder.length > 0 ? this.state.endHolder : null
        model.startTotalTx =  this.state.startTotalTx != null && this.state.startTotalTx.length > 0 ? this.state.startTotalTx : null
        model.endTotalTx =  this.state.endTotalTx != null && this.state.endTotalTx.length > 0 ? this.state.endTotalTx : null
        model.startVolume24H =  this.state.startVolume24H != null && this.state.startVolume24H.length > 0 ? this.state.startVolume24H : null
        model.endVolume24H =  this.state.endVolume24H != null && this.state.endVolume24H.length > 0 ? this.state.endVolume24H: null

        model.startCreationDate = this.state.startCreationDate
        model.startCreationTimeStamp = this.state.startCreationDate+0

        model.endCreationDate =  this.state.endCreationDate
        model.endCreationTimeStamp = this.state.endCreationDate+0
        
        this.props.onFilter(model)
    }


    render() {
        const { t } = this.props;
        if (this.props.data != null) {
            var startCreationDate = this.props.data.start_creation_date
            var sStartCreationDate = ""
            if (startCreationDate) {
                var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                var dateFormat = new Date(startCreationDate*1)

                var year = dateFormat.getFullYear();
                var month = months[dateFormat.getMonth()];
                var date = dateFormat.getDate();
                var hour = dateFormat.getHours();
                var min = dateFormat.getMinutes();
                var sec = dateFormat.getSeconds();

                var sStartCreationDate = month +", " + date + " " + year + " " + hour + ":" + min + ":" + sec
            }  
            
            var endCreationDate = this.props.data.end_creation_date
            var sEndCreationDate = ""
            if (endCreationDate) {
                var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                var dateFormat = new Date(endCreationDate*1)

                var year = dateFormat.getFullYear();
                var month = months[dateFormat.getMonth()];
                var date = dateFormat.getDate();
                var hour = dateFormat.getHours();
                var min = dateFormat.getMinutes();
                var sec = dateFormat.getSeconds();

                var sEndCreationDate = month +", " + date + " " + year + " " + hour + ":" + min + ":" + sec
            }  
        }
        return <div style={{display: this.props.open}}>
            <Box sx={style}>
                <div style={{background: "#3b3f46", width: '100%', opacity: 1}}>
                    <div style={{marginLeft: 16, marginRight: 16}}>
                        <CloseIcon style={{float: "right", cursor: "pointer"}} onClick={this.props.onClose}>
                        </CloseIcon>
                        <h3>{t("filter")}</h3>                    
                        <div style={{columnCount: 2}}>
                            <div style={{clear: "both", marginTop: 6, display: this.props.hist != "true"  ? "inline" : "none"}}>
                              <CssSelect
                                multiple
                                value={this.state.selectedChains}
                                onChange={this.setChain}
                                renderValue={(selected) => selected.join(', ')}
                                MenuProps={MenuProps}>
                                {this.props.chains.map((arr) => (
                                  <MenuItem key={arr.label} value={arr.label}>
                                    <Checkbox 
                                      checked={this.state.selectedChains.indexOf(arr.label) > -1} 
                                      style ={{
                                        color: "#ffffff",
                                      }}/>
                                    <ListItemText primary={arr.label} />
                                  </MenuItem>
                                ))}
                                </CssSelect>
                              <span className="App-Label-Filter">{t("chains")}</span>
                            </div>
                            <div style={{clear: "both", marginTop: 6, display: this.props.hist != "true"  ? "inline" : "none"}}>
                            <CssTextField 
                                style={{width: 400}}                    
                                size="small"
                                variant="outlined" 
                                value={this.state.name}
                                onChange={(event) => {
                                    this.setName(event.target.value);
                                  }}         
                                InputLabelProps={{
                                    shrink: false,
                                    className: "App-TextField-Filter"
                                }} 
                                InputProps={{
                                    className: "App-TextField-Filter"
                                }}/>
                            <span className="App-Label-Filter">{t("name_protocol")}</span>
                            </div>
                            <div style={{clear: "both", marginTop: 6, display: this.props.hist != "true"  ? "inline" : "none"}}>
                            <CssTextField 
                                style={{width: 400}}                    
                                size="small"
                                variant="outlined" 
                                value={this.state.address}
                                onChange={(event) => {
                                    this.setAddress(event.target.value);
                                  }}    
                                InputLabelProps={{
                                    shrink: false,
                                    className: "App-TextField-Filter"
                                }} 
                                InputProps={{
                                    className: "App-TextField-Filter"
                                }}/>
                            <span className="App-Label-Filter">{t("token_address")}</span>
                            </div>
                            <div style={{clear: "both", marginTop: 6, display: this.props.hist != "true"  ? "inline" : "none"}}>
                                <CssTextField 
                                    style={{width: 400}}                    
                                    size="small"
                                    variant="outlined" 
                                    value={this.state.pairAddress}
                                    onChange={(event) => {
                                        this.setPairAddress(event.target.value);
                                      }}    
                                    InputLabelProps={{
                                        shrink: false,
                                        className: "App-TextField-Filter"
                                    }} 
                                    InputProps={{
                                        className: "App-TextField-Filter"
                                    }}/>
                                <span className="App-Label-Filter">{t("pair_address")}</span>
                            </div>
                            <div style={{clear: "both", marginTop: 6}}>                                
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="id-id">
                                    <DateTimePicker 
                                    value={this.state.startCreationDate}
                                    onChange={(newValue) => this.setStartCreationDate(newValue)}
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
                                <span className="App-Label-Filter-NoFloat">{t("to")}</span>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker
                                    value={this.state.endCreationDate}
                                    onChange={(newValue) => this.setEndCreationDate(newValue)}
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
                                      }}  />
                                </LocalizationProvider> 
                                <span className="App-Label-Filter">{this.props.hist != "true" ? t("date_creation_range") : t("date_history_range")}</span>
                            </div>
                            <div style={{clear: "both", marginTop: 6}}>
                                <CssTextField 
                                    type="number"
                                    style={{width: 125}}                    
                                    size="small"
                                    variant="outlined" 
                                    value={this.state.startPrice}
                                    onChange={(event) => {
                                        this.setStartPrice(event.target.value);
                                      }}    
                                    InputLabelProps={{
                                        shrink: false,
                                        className: "App-TextField-Filter"
                                    }} 
                                    InputProps={{
                                        className: "App-TextField-Filter"
                                    }}/>
                                    <span className="App-Label-Filter-NoFloat">{t("to")}</span>
                                    <CssTextField 
                                    type="number"
                                    style={{width: 125}}                    
                                    size="small"
                                    variant="outlined" 
                                    value={this.state.endPrice}
                                    onChange={(event) => {
                                        this.setEndPrice(event.target.value);
                                      }}    
                                    InputLabelProps={{
                                        shrink: false,
                                        className: "App-TextField-Filter"
                                    }} 
                                    InputProps={{
                                        className: "App-TextField-Filter"
                                    }}/>
                                <span className="App-Label-Filter">{t("price_range_usd")}</span>
                            </div>
                            <div style={{clear: "both", marginTop: 6}}>
                            <CssTextField 
                                type="number"
                                style={{width: 125}}                    
                                size="small"
                                variant="outlined" 
                                value={this.state.startLiquidity}
                                onChange={(event) => {
                                    this.setStartLiquidity(event.target.value);
                                  }}  
                                InputLabelProps={{
                                    shrink: false,
                                    className: "App-TextField-Filter"
                                }} 
                                InputProps={{
                                    className: "App-TextField-Filter"
                                }}/>
                                <span className="App-Label-Filter-NoFloat">{t("to")}</span>
                                <CssTextField 
                                type="number"
                                style={{width: 125}}                    
                                size="small"
                                value={this.state.endLiquidity}
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
                                }}/>
                            <span className="App-Label-Filter">{t("total_liquidity_range_usd")}</span>
                            </div>
                            <div style={{clear: "both", marginTop: 6}}>
                                <CssTextField 
                                    type="number"
                                    style={{width: 125}}                    
                                    size="small"
                                    variant="outlined" 
                                    value={this.state.startMarketCap}
                                    onChange={(event) => {
                                        this.setStartMarketCap(event.target.value);
                                      }}  
                                    InputLabelProps={{
                                        shrink: false,
                                        className: "App-TextField-Filter"
                                    }} 
                                    InputProps={{
                                        className: "App-TextField-Filter"
                                    }}/>
                                    <span className="App-Label-Filter-NoFloat">{t("to")}</span>
                                    <CssTextField 
                                    type="number"
                                    style={{width: 125}}                    
                                    size="small"
                                    variant="outlined" 
                                    value={this.state.endMarketCap}
                                    onChange={(event) => {
                                        this.setEndMarketCap(event.target.value);
                                      }}  
                                    InputLabelProps={{
                                        shrink: false,
                                        className: "App-TextField-Filter"
                                    }} 
                                    InputProps={{
                                        className: "App-TextField-Filter"
                                    }}/>
                                <span className="App-Label-Filter">{t("total_market_cap_range_usd")}</span>
                            </div>
                            <div style={{clear: "both", marginTop: 6}}>
                                <CssTextField 
                                    type="number"
                                    style={{width: 125}}                    
                                    size="small"
                                    variant="outlined" 
                                    value={this.state.startTotalSupply}
                                    onChange={(event) => {
                                        this.setStartTotalSupply(event.target.value);
                                      }}  
                                    InputLabelProps={{
                                        shrink: false,
                                        className: "App-TextField-Filter"
                                    }} 
                                    InputProps={{
                                        className: "App-TextField-Filter"
                                    }}/>
                                    <span className="App-Label-Filter-NoFloat">{t("to")}</span>
                                    <CssTextField 
                                    type="number"
                                    style={{width: 125}}                    
                                    size="small"
                                    variant="outlined" 
                                    value={this.state.endTotalSupply}
                                    onChange={(event) => {
                                        this.setEndTotalSupply(event.target.value);
                                      }}  
                                    InputLabelProps={{
                                        shrink: false,
                                        className: "App-TextField-Filter"
                                    }} 
                                    InputProps={{
                                        className: "App-TextField-Filter"
                                    }}/>
                                <span className="App-Label-Filter">{t("total_supply_range")}</span>
                            </div>
                            <div style={{clear: "both", marginTop: 6}}>
                                <CssTextField 
                                    type="number"
                                    style={{width: 125}}                    
                                    size="small"
                                    variant="outlined" 
                                    value={this.state.startHolder}
                                    onChange={(event) => {
                                        this.setStartHolder(event.target.value);
                                      }}  
                                    InputLabelProps={{
                                        shrink: false,
                                        className: "App-TextField-Filter"
                                    }} 
                                    InputProps={{
                                        className: "App-TextField-Filter"
                                    }}/>
                                    <span className="App-Label-Filter-NoFloat">{t("to")}</span>
                                    <CssTextField 
                                    type="number"
                                    style={{width: 125}}                    
                                    size="small"
                                    variant="outlined" 
                                    value={this.state.endHolder}
                                    onChange={(event) => {
                                        this.setEndHolder(event.target.value);
                                      }}  
                                    InputLabelProps={{
                                        shrink: false,
                                        className: "App-TextField-Filter"
                                    }} 
                                    InputProps={{
                                        className: "App-TextField-Filter"
                                    }}/>
                                <span className="App-Label-Filter">{t("holder_range_k")}</span>
                            </div>
                            <div style={{clear: "both", marginTop: 6}}>
                                <CssTextField 
                                    type="number"
                                    style={{width: 125}}                    
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
                                    }}/>
                                    <span className="App-Label-Filter-NoFloat">{t("to")}</span>
                                    <CssTextField 
                                    type="number"
                                    style={{width: 125}}                    
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
                                    }}/>
                                <span className="App-Label-Filter">{t("volume_24h_range")}</span>
                            </div>
                            <div style={{clear: "both", marginTop: 6}}>
                                <CssTextField 
                                    type="number"
                                    style={{width: 125}}                    
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
                                    }}/>
                                    <span className="App-Label-Filter-NoFloat">{t("to")}</span>
                                    <CssTextField 
                                    type="number"
                                    style={{width: 125}}                    
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
                                    }}/>
                                <span className="App-Label-Filter">{t("total_tx_range")}</span>
                            </div>
                        </div>
                        <div style={{textAlign: "center", marginTop: 16, marginBottom: 16}}>
                            <Button onClick={this.submit} style={{width: 200, marginRight: 12}} variant="contained">{t("apply")}</Button>
                            <Button onClick={this.clear} style={{width: 200, marginLeft: 12}} variant="outlined">{t("clear")}</Button>
                        </div>
                        
                    
                    </div>

                </div>                
            </Box>
            
        </div>
    }
}

export default withCookies(withTranslation()(Filter));