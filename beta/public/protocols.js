'use strict'


let underlyingAssets = {}
let beefyRatio = {}
let realtTokens = []
let balancerPools = {}


// beefy.finance - get all ratio
const beefy_ratio = 'https://api.beefy.finance/lps'
// realt.co - get all tokens
const realt_tokens = 'https://api.realt.community/v1/token'


// AAVE - Ethereum
const aave_ethereum_request = `
query
{
  atokens {
    id
    underlyingAssetAddress
  }
  vtokens {
    id
    underlyingAssetAddress
  }
  stokens {
    id
    underlyingAssetAddress
  }
}
`
// Use TheGraph API - https://thegraph.com/legacy-explorer/subgraph/aave/protocol-v2
async function callAaveEthereumUnderlyingAddresses() {
	return await get('https://api.thegraph.com/subgraphs/name/aave/protocol-v2', aave_ethereum_request)
}


// Compound - Ethereum
const compound_ethereum_request = `
query
{
  markets {
    id
    underlyingAddress
    exchangeRate
  }
}
`
// Use TheGraph API - https://thegraph.com/legacy-explorer/subgraph/graphprotocol/compound-v2
async function callCompoundEthereumUnderlyingAddresses() {
	return await get('https://api.thegraph.com/subgraphs/name/graphprotocol/compound-v2', compound_ethereum_request)
}




// AAVEv2 - Polygon
const aave_polygon_request = `
query
{
  atokens {
    id
    underlyingAssetAddress
  }
  vtokens {
    id
    underlyingAssetAddress
  }
  stokens {
    id
    underlyingAssetAddress
  }
}
`
// Use TheGraph API - https://thegraph.com/legacy-explorer/subgraph/aave/aave-v2-matic
async function callAavePolygonUnderlyingAddresses() {
	return await get('https://api.thegraph.com/subgraphs/name/aave/aave-v2-matic', aave_polygon_request)
}


// AAVEv3 - Polygon
const aave_v3_polygon_request = `
query
{
  subTokens(first: 1000) {
    id
    underlyingAssetAddress
    pool {
      reserves {
        underlyingAsset
        symbol
        name
        decimals
        price {
          priceInEth
        }
        aToken {
          id
          underlyingAssetAddress
        }
        vToken {
          id
          underlyingAssetAddress
        }
        sToken {
          id
          underlyingAssetAddress
        }
      }
    }
  }
}
`
// Use TheGraph API - https://thegraph.com/hosted-service/subgraph/aave/protocol-v3-polygon
async function callAaveV3PolygonUnderlyingAddresses() {
	return await get('https://api.thegraph.com/subgraphs/name/aave/protocol-v3-polygon', aave_v3_polygon_request)
}



// RMM (AAVEv2) - Gnosis - RealT
const rmm_gnosis_request = `
query
{
  atokens {
    id
    underlyingAssetAddress
  }
  vtokens {
    id
    underlyingAssetAddress
  }
  stokens {
    id
    underlyingAssetAddress
  }
}
`
// Use TheGraph API - https://thegraph.com/hosted-service/subgraph/realtoken-thegraph/rmm-realt
async function callRmmGnosisUnderlyingAddresses() {
	return await get('https://api.thegraph.com/subgraphs/name/realtoken-thegraph/rmm-realt', rmm_gnosis_request)
}



// Venus - BSC
const venus_bsc_request = `
query
{
  markets {
    id
    underlyingAddress
    exchangeRate
  }
}
`
// Use TheGraph API - https://thegraph.com/legacy-explorer/subgraph/venusprotocol/venus-subgraph
async function callVenusBscUnderlyingAddresses() {
	return await get('https://api.thegraph.com/subgraphs/name/venusprotocol/venus-subgraph', venus_bsc_request)
}



// Balancer Pools
const balancer_pools_request = `
query
{
  tokens(first: 1000,
    where: {
      symbol_starts_with: "B-"
    }
  ) {
      symbol
      name
      address
    	latestUSDPrice
    }
}
`
// Use TheGraph API
// https://thegraph.com/hosted-service/subgraph/balancer-labs/balancer-v2
// https://thegraph.com/hosted-service/subgraph/balancer-labs/balancer-polygon-v2
// https://thegraph.com/hosted-service/subgraph/balancer-labs/balancer-arbitrum-v2
async function callBalancerPoolsRequest(network) {
  switch (network) {
    case 'ETHEREUM':
      return await get('https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-v2', balancer_pools_request)
      break
    case 'POLYGON':
      return await get('https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-polygon-v2', balancer_pools_request)
      break
    case 'ARBITRUM_ONE':
      return await get('https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-arbitrum-v2', balancer_pools_request)
      break
    default:
      return await get('https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-v2', balancer_pools_request)
  }
}




async function getAaveEthereumUnderlyingAddresses(callback) {
	let underlying = {}
	try {
		underlying = await callAaveEthereumUnderlyingAddresses()
	} catch(error) {
		console.log(error)
		// setTimeout(getAaveEthereumUnderlyingAddresses, 30000)
		return
	}

	// setTimeout(getAaveEthereumUnderlyingAddresses, 300000)

	if(!underlying || !underlying.data) {
		return
	}
	underlying.data.atokens.forEach((item, i) => {
		underlyingAssets['ETHEREUM-' + item.id] = {
			address: item.underlyingAssetAddress,
			rate: 1,
			debt: 1
		}
	})
	underlying.data.vtokens.forEach((item, i) => {
		underlyingAssets['ETHEREUM-' + item.id] = {
			address: item.underlyingAssetAddress,
			rate: 1,
			debt: -1
		}
	})
	underlying.data.stokens.forEach((item, i) => {
		underlyingAssets['ETHEREUM-' + item.id] = {
			address: item.underlyingAssetAddress,
			rate: 1,
			debt: -1
		}
	})
}


async function getCompoundEthereumUnderlyingAddresses(callback) {
	let underlying = {}
	try {
		underlying = await callCompoundEthereumUnderlyingAddresses()
	} catch(error) {
		console.log(error)
		// setTimeout(getCompoundEthereumUnderlyingAddresses, 30000)
		return
	}

	// setTimeout(getCompoundEthereumUnderlyingAddresses, 300000)

	if(!underlying || !underlying.data || !underlying.data.markets) {
		return
	}
	underlying.data.markets.forEach((item, i) => {
		underlyingAssets['ETHEREUM-' + item.id] = {
			address: item.underlyingAddress,
			rate: item.exchangeRate,
			debt: 1
		}
	})
}



async function getAavePolygonUnderlyingAddresses(callback) {
	let underlying = {}
	try {
		underlying = await callAavePolygonUnderlyingAddresses()
	} catch(error) {
		console.log(error)
		// setTimeout(getAavePolygonUnderlyingAddresses, 30000)
		return
	}

	// setTimeout(getAavePolygonUnderlyingAddresses, 300000)

	if(!underlying || !underlying.data) {
		return
	}
	underlying.data.atokens.forEach((item, i) => {
		underlyingAssets['POLYGON-' + item.id] = {
			address: item.underlyingAssetAddress,
			rate: 1,
			debt: 1
		}
	})
	underlying.data.vtokens.forEach((item, i) => {
		underlyingAssets['POLYGON-' + item.id] = {
			address: item.underlyingAssetAddress,
			rate: 1,
			debt: -1
		}
	})
	underlying.data.stokens.forEach((item, i) => {
		underlyingAssets['POLYGON-' + item.id] = {
			address: item.underlyingAssetAddress,
			rate: 1,
			debt: -1
		}
	})
}


async function getAaveV3PolygonUnderlyingAddresses(callback) {
	let underlying = {}
	try {
		underlying = await callAaveV3PolygonUnderlyingAddresses()
	} catch(error) {
		console.log(error)
		// setTimeout(callAaveV3PolygonUnderlyingAddresses, 30000)
		return
	}

	// setTimeout(callAaveV3PolygonUnderlyingAddresses, 300000)

	if(!underlying || !underlying.data) {
		return
	}
	underlying.data.subTokens.forEach((item, i) => {
		underlyingAssets['POLYGON-' + item.id] = {
			address: item.underlyingAssetAddress,
			rate: 1,
			debt: 1
		}
	})
	/*underlying.data.vtokens.forEach((item, i) => {
		underlyingAssets['POLYGON-' + item.id] = {
			address: item.underlyingAssetAddress,
			rate: 1,
			debt: -1
		}
	})
	underlying.data.stokens.forEach((item, i) => {
		underlyingAssets['POLYGON-' + item.id] = {
			address: item.underlyingAssetAddress,
			rate: 1,
			debt: -1
		}
	})*/
}



async function getRmmGnosisUnderlyingAddresses(callback) {
	let underlying = {}
	try {
		underlying = await callRmmGnosisUnderlyingAddresses()
	} catch(error) {
		console.log(error)
		// setTimeout(getRmmGnosisUnderlyingAddresses, 30000)
		return
	}

	// setTimeout(getRmmGnosisUnderlyingAddresses, 300000)

	if(!underlying || !underlying.data) {
		return
	}
	underlying.data.atokens.forEach((item, i) => {
		underlyingAssets['XDAI-' + item.id] = {
			address: item.underlyingAssetAddress,
			rate: 1,
			debt: 1
		}
	})
	underlying.data.vtokens.forEach((item, i) => {
		underlyingAssets['XDAI-' + item.id] = {
			address: item.underlyingAssetAddress,
			rate: 1,
			debt: -1
		}
	})
	underlying.data.stokens.forEach((item, i) => {
		underlyingAssets['XDAI-' + item.id] = {
			address: item.underlyingAssetAddress,
			rate: 1,
			debt: -1
		}
	})
}




async function getVenusBscUnderlyingAddresses(callback) {
	let underlying = {}
	try {
		underlying = await callVenusBscUnderlyingAddresses()
	} catch(error) {
		console.log(error)
		// setTimeout(getVenusBscUnderlyingAddresses, 30000)
		return
	}

	// setTimeout(getVenusBscUnderlyingAddresses, 300000)

	if(!underlying || !underlying.data || !underlying.data.markets) {
		return
	}
	underlying.data.markets.forEach((item, i) => {
		underlyingAssets['BSC-' + item.id] = {
			address: item.underlyingAddress,
			rate: item.exchangeRate,
			debt: 1
		}
	})
}




/* Coingecko */
async function getCoingeckoPrice(address, network) {
	address = address.toLowerCase()
	let token = coingecko[network + '-' + address]
	if(token && Date.now() - token.updatedAt < 120000) {
		return token.price
	}

	return fetch(SERVER_URL + '/coingecko/' + NETWORK[network].coingecko_name + '/' + address)
		.then((response) => response.json())
		.then((token) => {
			coingecko[network + '-' + address] = { ...token, updatedAt: Date.now() }
			return token.price
		})
		.catch(() => {
			coingecko[network + '-' + address] = { updatedAt: Date.now() }
			return
		})
}



/* Beefy.Finance */
async function getPriceFromBeefy(contract, symbol, balance, network) {
	if(Object.keys(beefyRatio).length === 0 || Date.now() - beefyRatio.updatedAt > 60000) {
		beefyRatio = await get(beefy_ratio)
		beefyRatio.updatedAt = Date.now()
	}
	const key = Object.keys(beefyRatio).find((item) => item.replace(/-/g, '').toLowerCase().endsWith(symbol.replace(/-/g, '').toLowerCase().substr(3)))
	if(key) {
		return beefyRatio[key]
	} else {
		try {
			let underlyingContract = await getBeefyUnderlying(contract, network)
			return await getCoingeckoPrice(underlyingContract, network)
		} catch {
			return
		}
	}
}


/* RealT */
async function getPriceFromRealT(contract, symbol, balance, network) {
	if(realtTokens.length === 0) {
		realtTokens = await get(realt_tokens)
	}
	const token = realtTokens.find((token) => token.uuid.toLowerCase() === contract.toLowerCase())
	if(token) {
		return token.tokenPrice
	}
  return
}


/* Balancer Pool */
async function getPriceFromBalancerPool(contract, symbol, balance, network) {
	if(!balancerPools[network] || balancerPools[network]?.tokens?.length === 0 || Date.now() - balancerPools[network].updatedAt > 60000) {
		let data = await callBalancerPoolsRequest(network)
    balancerPools[network] = data.data
		balancerPools[network].updatedAt = Date.now()
	}
	const price = balancerPools[network].tokens.find(token => token.address === contract)?.latestUSDPrice
	if(price) {
		return price
	} else {
		try {
			return await getCoingeckoPrice(contract, network)
		} catch {
			return
		}
	}
}


/* Utils - Return the Contract depending on the network */
const getBeefyUnderlying = async (contractAddress, network) => {
	const wantABI = [
		// want
		{
			'constant':true,
			'inputs':[],
			'name':'want',
			'outputs':[{'name':'','type':'address','internalType':'contract IERC20'}],
			'type':'function',
			'stateMutability':'view',
			'payable':false
		}
	]
	let contract = null
	switch (network) {
	case NETWORK.ETHEREUM.enum:
		contract = new web3_ethereum.eth.Contract(wantABI, contractAddress)
		break
	case NETWORK.POLYGON.enum:
		contract = new web3_polygon.eth.Contract(wantABI, contractAddress)
		break
	case NETWORK.FANTOM.enum:
		contract = new web3_fantom.eth.Contract(wantABI, contractAddress)
		break
	case NETWORK.XDAI.enum:
		contract = new web3_xdai.eth.Contract(wantABI, contractAddress)
		break
	case NETWORK.BSC.enum:
		contract = new web3_bsc.eth.Contract(wantABI, contractAddress)
		break
	default:
	}

	return await contract.methods.want().call()
}
