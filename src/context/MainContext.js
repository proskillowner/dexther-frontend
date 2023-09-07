import React, { createContext, useEffect, useState } from "react";
import { SERVER_URL, API_GET_CONFIG, API_SET_CONFIG, API_GET_POOL } from "../Api";

const MainContext = createContext()

class MainContextProvider extends React.Component {

	state = {
		tableData: null,
		config: null,
	}

	loadTableData = async ({ sortModel, pageModel, filterModel, chain, token, trail }) => {

		if (pageModel == null) {
			pageModel = {
				page_number: 0,
				page_size: 50,
			}
		}

		let response = await fetch(`${SERVER_URL}${API_GET_POOL}`, {
			method: 'POST',
			body: JSON.stringify({
				sort: sortModel,
				page: pageModel,
				filter: filterModel,
				chain: chain,
				token: token,
				trail: trail == "true" ? "true" : "false"
			}),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		})

		let data = await response.json()

		let rowData = []
		data.pool_data.map((row, index) => {
			let exist = rowData.findIndex(block => block.id == (pageModel.page_number * pageModel.page_size + index + 1))
			if (exist < 0) {
				rowData.push({
					id: pageModel.page_number * pageModel.page_size + index + 1,
					hist_token_address: row.token_address,
					hist_name: row.token_symbol,
					hist_pair_address: row.pool_address,
					hist_creation: row.pool_creation_time,
					hist_price: row.token_price * data.coin_price,
					hist_pool_amount: 0,
					hist_total_liquidity: row.total_liquidity * data.coin_price * 2,
					hist_holders: 0,
					hist_total_tx: row.pool_total_txs,
					hist_market_cap: parseInt(row.token_total_supply) / 10 ** row.token_decimals * row.token_price * data.coin_price,
					hist_supply: parseInt(row.token_total_supply) / 10 ** row.token_decimals,
					hist_contract_verified: row.token_contract_verified,
					hist_contract_renounced: row.token_contract_renounced,
				})
			}
		})

		const tableData = {
			totalCount: data.pool_count,
			coinPrice: data.coin_price,
			rowData,
		}

		this.setState({
			tableData
		})

		return tableData
	}

	loadConfig = async () => {
		const config = {}

		const response = await fetch(`${SERVER_URL}${API_GET_CONFIG}`, {
			method: 'POST',
		})

		const data = await response.json()

		for (const item of data) {
			config[item.config_key] = item.config_value
		}

		this.setState({ config })

		return config
	}

	saveConfig = async (config) => {
		this.setState({ config })

		const data = []

		for (const config_key in config) {
			data.push({
				chain_id: 1,
				exchange_id: 1,
				config_key: config_key,
				config_value: config[config_key] ? config[config_key] : null,
			})
		}

		await fetch(`${SERVER_URL}${API_SET_CONFIG}`, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		})
	}

	render() {
		const { children } = this.props
		const { tableData } = this.state

		return (
			<MainContext.Provider value={{
				tableData,
				loadTableData: this.loadTableData,
				loadConfig: this.loadConfig,
				saveConfig: this.saveConfig,
			}}>
				{children}
			</MainContext.Provider>
		)
	}

}

export default MainContext
export { MainContextProvider }