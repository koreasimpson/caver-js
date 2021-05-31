import * as React from "react"
import { useState, useEffect } from "react"
// import logo from "./logo.svg"
// import Caver from "caver-js"
// import QRCode from "qrcode.react"
import { minWithTokenURI, getOwnedTokens, getTokenOwner, getTokenUri } from "./api/UseCaver"
import { WALLET_ADDRESS } from "./constants/"
// import * as KlipAPI from "./api/UseKlip"
import "./App.css"

function App() {
	const [mintTokenId, setMintTokenId] = useState("")
	const [mintTokenUri, setMintTokenUri] = useState("")
	const [myTokens, setMyTokens] = useState([])

	const onMinWithTokenURI = async () => {
		await minWithTokenURI(mintTokenId, mintTokenUri)
		await getOwnedTokens(WALLET_ADDRESS).then(res => {
			setMyTokens(res)
		})
	}

	const onGetTokenOwner = tokenId => {
		getTokenOwner(tokenId).then(res => {
			alert(`token owner's address = ${res}`)
		})
	}

	const onGetTokenUri = tokenId => {
		getTokenUri(tokenId).then(res => {
			alert(`token's URI = ${res}`)
		})
	}

	useEffect(() => {
		getOwnedTokens(WALLET_ADDRESS).then(res => {
			setMyTokens(res)
		})
	}, [])

	return (
		<div className="App">
			<header className="App-header">계정 주소 : {WALLET_ADDRESS}</header>
			<main>
				<div className="mint">
					<label htmlFor="mintTokenId">
						TokenID :{" "}
						<input
							type="text"
							placeholder="token id를 입력하세요"
							value={mintTokenId}
							onChange={e => setMintTokenId(e.currentTarget.value)}
						/>
					</label>
					<label htmlFor="minTokenUri">
						TokenURI :{" "}
						<input
							type="text"
							placeholder="tokenURI를 입력하세요"
							value={mintTokenUri}
							onChange={e => setMintTokenUri(e.currentTarget.value)}
						/>
					</label>
					<button onClick={onMinWithTokenURI}>토큰 발행하기</button>
				</div>
				<hr />
				<div>
					<div>
						<p>소유한 토큰</p>
						<ul>
							{myTokens.map(tokenId => (
								<li key={tokenId}>
									{`token ID = ${tokenId}`}
									<button onClick={() => onGetTokenOwner(tokenId)}>토큰의 소유자 확인하기</button>
									<button onClick={() => onGetTokenUri(tokenId)}>토큰의 URI 확인하기</button>
								</li>
							))}
						</ul>
					</div>
				</div>
			</main>
		</div>
	)
}

export default App
