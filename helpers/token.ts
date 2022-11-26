import {WalletClient} from "@martiandao/aptos-web3-bip44.js";

export interface HoldToken {
    creator: string
    collectionName: string
    tokenName: string
    propertyVersion: string
    amount: number
}

export async function getUserTokens(
    client: WalletClient, user: string,
): Promise<HoldToken[]> {
    let hold = []
    const results = await client.getTokenIds(user)
    for (let id of results.tokenIds) {
        const {data} = id
        const tokenDataId = data["token_data_id"]
        const amount = id["difference"]
        if (amount > 0) {
            hold.push({
                creator: tokenDataId["creator"],
                collectionName: tokenDataId["collection"],
                tokenName: tokenDataId["name"],
                propertyVersion: data["property_version"],
                amount,
            })
        }
    }
    return hold
}

export interface TokenInfo {
    creator: string
    collectionName: string
    tokenName: string
    propertyVersion: string
}


export function verifyHolder(
    userTokens: TokenInfo[], whitelistTokens: TokenInfo[]
): boolean {
    const userTokenSet=new Set()
    for (let uToken of userTokens) {
        const {
            creator,
            collectionName,
            tokenName,
            propertyVersion
        }=uToken
        const name=`NAME::${creator}::${collectionName}::${tokenName}::${propertyVersion}`
        userTokenSet.add(name)
    }
    for (let wToken of whitelistTokens) {
        const {
            creator,
            collectionName,
            tokenName,
            propertyVersion
        }=wToken
        const name=`NAME::${creator}::${collectionName}::${tokenName}::${propertyVersion}`
        if (userTokenSet.has(name)) {
            console.log(`${name}`)
            return true
        }
    }
    return false
}
