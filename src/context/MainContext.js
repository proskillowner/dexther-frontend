import React, { createContext, useEffect, useState } from "react";
import {
	SERVER_URL,
	API_GET_CONFIG,
	API_SET_CONFIG,
	API_GET_POOL_LOG,
	API_IS_SYNC_CHECKED,
	API_GET_SCAN_SCORE,
	API_SET_SCAN_SCORE
} from "../Api";

const MainContext = createContext()

export const GET_POOL = 1
export const GET_POOL_LOG = 2

class MainContextProvider extends React.Component {

	state = {
		tableData: null,
		config: null,
		localConfig: null,
	}

	isSyncChecked = async () => {
		let response = await fetch(`${SERVER_URL}${API_IS_SYNC_CHECKED}`, {
			method: 'POST',
			body: JSON.stringify(),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		})

		response = await response.json()

		return response.is_sync_checked
	}

	loadTableData = async ({ sortModel, pageModel, filterModel, chain, token, trail, pool_address }) => {
		const requestBody = {}

		requestBody.chain_id = 1

		if (pool_address) {
			requestBody.pool_address = pool_address
		}

		if (filterModel) {
			requestBody.where = filterModel
		}

		if (sortModel && sortModel.length) {
			requestBody.order = {
				order_field: sortModel[0].field,
				order_direction: sortModel[0].sort,
			}
		}

		if (pageModel) {
			requestBody.limit = {
				limit_offset: pageModel.page * pageModel.pageSize,
				limit_count: pageModel.pageSize,
			}
		}

		let response = await fetch(`${SERVER_URL}${API_GET_POOL_LOG}`, {
			method: 'POST',
			body: JSON.stringify(requestBody),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		})

		response = await response.json()

		const totalCount = response.pool_log_count
		const poolLogData = response.pool_log_data

		const rowData = []

		poolLogData.map((poolLog, index) => {
			rowData.push({
				id: pageModel.page * pageModel.pageSize + index + 1,
				token_symbol: `${poolLog.token_symbol} / ${poolLog.base_token_symbol}`,
				pool_index: poolLog.pool_index,
				pool_address: poolLog.pool_address,
				token_address: poolLog.token_address,
				pool_creation_timestamp: poolLog.pool_creation_timestamp,
				log_timestamp: poolLog.log_timestamp,
				token_price: poolLog.token_price,
				pool_initial_amount: poolLog.pool_initial_amount,
				pool_total_liquidity: poolLog.pool_total_liquidity,
				pool_total_txs: poolLog.pool_total_txs,
				token_total_holders: poolLog.token_total_holders,
				token_total_supply: poolLog.token_total_supply,
				token_total_market_cap: poolLog.token_total_market_cap,
				volume_24h: /*poolLog.pool_volume_24h*/0,
				scan_score: poolLog.scan_score,
				token_contract_verified: poolLog.token_contract_verified,
				token_contract_renounced: poolLog.token_contract_renounced,
			})
		})

		const tableData = {
			totalCount,
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

		this.setState({ config, loadConfig: config })

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

	getScanScore = async ({ pool_address }) => {
		const requestBody = {
			chain_id: 1,
			pool_address
		}

		let response = await fetch(`${SERVER_URL}${API_GET_SCAN_SCORE}`, {
			method: 'POST',
			body: JSON.stringify(requestBody),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		})

		response = await response.json()

		return response.scan_score ? response.scan_score : 0
	}

	setScanScore = async ({ pool_address, scan_score }) => {
		const requestBody = {
			chain_id: 1,
			pool_address,
			scan_score,
		}

		await fetch(`${SERVER_URL}${API_SET_SCAN_SCORE}`, {
			method: 'POST',
			body: JSON.stringify(requestBody),
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
				isSyncChecked: this.isSyncChecked,
				loadConfig: this.loadConfig,
				saveConfig: this.saveConfig,
				getScanScore: this.getScanScore,
				setScanScore: this.setScanScore,
			}}>
				{children}
			</MainContext.Provider>
		)
	}

}

export default MainContext
export { MainContextProvider }