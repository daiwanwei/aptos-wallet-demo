import {WalletClient} from "@martiandao/aptos-web3-bip44.js";

export interface CollectionInfo {
    creator: string
    collectionName: string
    imageTemplate?: string
}

export interface Token {
    creator: string
    collectionName: string
    tokenName: string
    propertyVersion: string
    amount:number
    imageTemplate?: string
}

export interface TokenInfo {
    creator: string
    collectionName: string
    tokenName: string
    propertyVersion: string
    amount: number
    image: string
}

export async function getUserTokens(
    client: WalletClient, user: string,
): Promise<Token[]> {
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

export async function getCollectionDataHandle(
    client:WalletClient,creator:string
):Promise<string>{
    const res:{data: any }=await client.getAccountResource(
        creator,"0x3::token::Collections"
    )
    const {handle} =res.data["token_data"]
    return handle
}

export async function getTokenInfo(
    client:WalletClient,collectionHandle:string,info:Token
):Promise<TokenInfo> {
    const tableItemRequest = {
        key_type: "0x3::token::TokenDataId",
        value_type: "0x3::token::TokenData",
        key: {
            creator:info.creator,
            name:info.tokenName,
            collection:info.collectionName,
        },
    };
    const token = await client.aptosClient.getTableItem(
        collectionHandle,
        tableItemRequest
    );
    const image=info.imageTemplate? convertUrl(token.uri,info.imageTemplate):token.uri
    return {
        collectionName:info.collectionName,
        tokenName:token.name,
        image,
        creator: info.creator,
        propertyVersion: info.propertyVersion,
        amount:info.amount
    }
}

function convertUrl(url:string,template:string):string{
    const reg=/ipfs:\/\/(.*)\/(.*).json/
    const regExpMatchArray=url.match(reg)
    if (!regExpMatchArray) return url
    const file=regExpMatchArray[2]
    return `${template}${file}.png`
}

export async function getHeldTokens(
    client: WalletClient, user: string,collections:CollectionInfo[]
):Promise<Token[]> {
    const userTokens = await getUserTokens(client, user)
    const collectionMap = new Map()
    for (const {creator, collectionName,imageTemplate} of collections) {
        const key = `collection::${creator}::${collectionName}`
        if (!collectionMap.has(key)) {
            collectionMap.set(key,{imageTemplate})
        }
    }
    const metadata:Token[]=[]
    userTokens
            .forEach((token) => {
                const {creator, collectionName}=token
                const key=`collection::${creator}::${collectionName}`
                if (collectionMap.has(key)){
                    const {imageTemplate}=collectionMap.get(key)
                    metadata.push({...token,imageTemplate})
                }
            })
    return metadata
}
