import React, { createContext, useEffect, useState } from "react";
import { SERVER_URL, API_GET_POOL } from "../Api";

const BlockContext = createContext()

class BlockContextProvider extends React.Component {

	state = {
		tableData: {
			totalCount: 0,
			ethPrice: 0,
			rowData: [],
		}
	}

	loadTableData = async ({sortModel, pageModel, filterModel, chain, token, trail}) => {
		
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
        'Access-Control-Allow-Origin': '*',
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

	render() {
		const { children } = this.props
		const { tableData } = this.state

		return (
			<BlockContext.Provider value={{tableData, loadTableData: this.loadTableData}}>
				{children}
			</BlockContext.Provider>
		)
	}

}

export default BlockContext
export { BlockContextProvider }