import React, { createContext, useEffect, useState } from "react";
import { SERVER_URL, API_GET_POOL } from "../Api";

const BlockContext = createContext()

class BlockContextProvider extends React.Component {

	state = {
		totalSize: 50,
		blockList: []
	}

	setBlockList = (blockList) => {
		console.log("Update Block List: ", blockList)
		this.setState({blockList})
	}

	loadList = async ({sortModel, pageModel, filterModel, chain, token, trail}) => {
		
    if (pageModel == null) {
      pageModel = new Object()
      pageModel.page = 0
      pageModel.pageSize = 10
    }

    let response = await fetch(`${SERVER_URL}${API_GET_POOL}`, {
      method: 'POST',
      body: JSON.stringify({
        sort: sortModel,
        page: pageModel,
        offset: pageModel.page * pageModel.pageSize,
        count: pageModel.pageSize,
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
		console.log("loaded data: ", data)

		let tableData = []
		data.map((row, index) => {
			let exist = tableData.findIndex(block => block.id == (pageModel.page * pageModel.pageSize + index + 1))
			if (exist < 0) {
				tableData.push({
					id: pageModel.page * pageModel.pageSize + index + 1,
					hist_address: row.token_address,
					hist_name: row.token_symbol,
					hist_pair_address: row.pool_address,
					hist_creation: row.pool_create_time,
					hist_price: row.token_price * row.coin_price,
					hist_total_liquidity: row.total_liquidity * row.coin_price,
					hist_total_tx: row.pool_total_txs,
					hist_market_cap: parseInt(row.token_total_supply) / 10 ** row.token_decimals * row.token_price * row.coin_price,
					hist_supply: parseInt(row.token_total_supply) / 10 ** row.token_decimals,
				})
			}
		})
		console.log(this.state.blockList, this.state.blockList.concat(...tableData), this.state.blockList.concat(tableData))
		this.setBlockList(this.state.blockList.concat(...tableData))
		return tableData
	}
/* 
	getList = (page, pageSize) => {
		if (this.state.blockList.length < page*pageSize) {
			this.loadList({
				sortModel: {},
				pageModel: {
					pageSize: pageSize,
					page: page,
				},
				filterModel: {},
				chain: 0,
				token: '',
				trail: ''
			})
				.then(data => {
					console.log(data)
					return data
				})
				.catch(error => {
					console.log(error)
					return []
				})
		} else {
			return this.state.blockList.slice(page*pageSize, pageSize)
		}
	} */

	render() {
		const { children } = this.props
		const { blockList } = this.state

		return (
			<BlockContext.Provider value={{blockList, loadList: this.loadList}}>
				{children}
			</BlockContext.Provider>
		)
	}

}

export default BlockContext
export { BlockContextProvider }