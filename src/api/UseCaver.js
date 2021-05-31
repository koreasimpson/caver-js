import Caver from "caver-js"
import COUNT_ABI from "../abi/CounterABI.json"
import {
	ACCESS_KEY_ID,
	SECRET_ACCESS_KEY,
	CHAIN_ID,
	CONTRACT_ADDRESS,
	WALLET_ADDRESS
} from "../constants"

// KAS API를 호출하기 위한 헤더값
const option = {
	headers: [
		{
			name: "Authorization",
			value: "Basic " + Buffer.from(ACCESS_KEY_ID + ":" + SECRET_ACCESS_KEY).toString("base64")
		},
		{
			name: "x-chain-id",
			value: CHAIN_ID
		}
	]
}

const caver = new Caver(
	new Caver.providers.HttpProvider("https://node-api.klaytnapi.com/v1/klaytn", option)
)

const CountContract = new caver.contract(COUNT_ABI, CONTRACT_ADDRESS)

export const getBalance = address => {
	// caver.rpc.klay.getBalance(address) : 잔고 조회
	// caver.utils.convertFromPeb : Peb 단위 변환
	return caver.rpc.klay.getBalance(address).then(response => {
		const balance = caver.utils.convertFromPeb(caver.utils.hexToNumberString(response))

		return balance
	})
}

export const getOwnedTokens = async address => {
	const result = await CountContract.methods.ownedTokens(address).call()

	return result
}

export const getTokenOwner = async tokenId => {
	const result = await CountContract.methods.tokenOwner(tokenId).call()

	return result
}

export const getTokenUri = async tokenId => {
	const result = await CountContract.methods.tokenURIs(tokenId).call()

	return result
}

export const minWithTokenURI = async (tokenId, tokenUri) => {
	try {
		// 사용할 account 설정
		const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY
		const deployer = caver.wallet.keyring.createFromPrivateKey(PRIVATE_KEY)
		caver.wallet.add(deployer)
		// 스마트 컨트랙트 실행 트랜젝션 날리기
		// 결과 확인

		const receipt = await CountContract.methods
			.minWithTokenURI(WALLET_ADDRESS, tokenId, tokenUri)
			.send({
				from: deployer.address,
				gas: "0x4bfd200"
			})
	} catch (e) {
		console.error(e)
	}
}

export const setTokenUri = async newTokenUri => {
	try {
		// 사용할 account 설정
		const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY
		const deployer = caver.wallet.keyring.createFromPrivateKey(PRIVATE_KEY)
		caver.wallet.add(deployer)
		// 스마트 컨트랙트 실행 트랜젝션 날리기
		// 결과 확인

		const receipt = await CountContract.methods.setCount(newTokenUri).send({
			from: deployer.address,
			gas: "0x4bfd200"
		})
	} catch (e) {
		console.error(e)
	}
}

// export const setCount = async newCount => {
// 	try {
// 		// 사용할 account 설정
// 		const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY
// 		const deployer = caver.wallet.keyring.createFromPrivateKey(PRIVATE_KEY)
// 		caver.wallet.add(deployer)
// 		// 스마트 컨트랙트 실행 트랜젝션 날리기
// 		// 결과 확인

// 		const receipt = await CountContract.methods.setCount(newCount).send({
// 			from: deployer.address,
// 			gas: "0x4bfd200"
// 		})
// 		console.log(receipt)
// 	} catch (e) {
// 		console.error(e)
// 	}
// }
