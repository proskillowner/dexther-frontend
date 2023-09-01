import { createContext, useEffect, useState } from "react";
import { SERVER_URL, API_GET_POOL } from "../Api";

export const BlockContext = createContext('BLOCKS')

export function BlockContextProvider ({children}) {

	const [blockList, setBlockList] = useState([])

	useEffect(() => {
		console.log(blockList)
	}, [blockList])

	const loadList = async ({sortModel, pageModel, filterModel, chain, token, trail}) => {
		
    if (pageModel == null) {
      pageModel = new Object()
      pageModel.page = 0
      pageModel.pageSize = 5
    }

    await fetch(`${SERVER_URL}${API_GET_POOL}`, {
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
      .then((response) => response.json())
      .then((data) => {
				console.log(data)
        let tableData = blockList.slice();
        data.map((row, index) => {
					let exist = tableData.findIndex(block => block.id == (pageModel.page * pageModel.pageSize + index + 1))
					if (exist < 0) {
						tableData.push({
							id: pageModel.page * pageModel.pageSize + index + 1,
							hist_address: row.token_address,
							hist_name: row.token_symbol,
							hist_pair_address: row.pool_address,
							hist_creation: row.pool_create_time,
							hist_price: row.token_price,
							hist_total_liquidity: row.total_liquidity,
						})
					}
        })
				// tableData.
				setBlockList(tableData)
      })
      .catch((err) => {
        console.log(err.message)
      })
	}

	const gettList = (page, pageSize) => {
		if (blockList.length < page*pageSize) {
			loadList({
				sortModel: {},
				pageModel: {
					pageSize: 5,
					page: 0,
				},
				filterModel: {},
				chain: 0,
				token: '',
				trail: ''
			})
			// loadList
		}
	}

	return (
		<BlockContext.Provider value={blockList}>
			{children}
		</BlockContext.Provider>
	)
}