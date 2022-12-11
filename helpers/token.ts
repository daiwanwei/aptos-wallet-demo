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

export async function toTokenMetadata(
    client:WalletClient,collectionHandle:string,info:Token,imageTemplate?:string
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
    const image=imageTemplate? convertUrl(token.uri,imageTemplate):token.uri
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

// async function convertUrl(url:string):Promise<string>{
//     const reg=/ipfs:\/\/([A-Za-z0-9_/.]*)/
//     const regExpMatchArray=url.match(reg)
//     if (!regExpMatchArray) return url
//     console.log(regExpMatchArray)
//     const [cid,...reminder]=regExpMatchArray[1].split("/")
//     const file=reminder.join("/")
//     const ipfsUrl=`https://${cid}.ipfs.dweb.link/${file}`
//     const data =await axios.get(ipfsUrl)
//     console.log(data)
//     return ipfsUrl
// }

export async function getHeldTokens(
    client: WalletClient, user: string,collections:CollectionInfo[]
):Promise<TokenInfo[]> {
    const userTokens = await getUserTokens(client, user)
    const handleMap = new Map()
    for (const {creator, collectionName,imageTemplate} of collections) {
        const key = `handle::${creator}::${collectionName}`
        if (!handleMap.has(key)) {
            const handle = await getCollectionDataHandle(client, creator)
            handleMap.set(key, {handle,imageTemplate})
        }
    }
    const metadata = Promise.all(
        userTokens
            .filter(({creator, collectionName}) => handleMap.has(`handle::${creator}::${collectionName}`))
            .map(async (info) => {
                const {creator, collectionName}=info
                const {handle,imageTemplate}=handleMap.get(`handle::${creator}::${collectionName}`)
                console.log(handle)
                return await toTokenMetadata(client,handle,info,imageTemplate)
            }))
    return metadata
}
