import fs from 'fs'
import * as dotenv from 'dotenv'
import got from 'got'

dotenv.config()

async function main() {
  /*
   * Authentication
   */
  const authEndpoint = 'https://auth.hgraph.io/oauth/token'
  const authResponse = await got
    .post(authEndpoint, {
      json: {
        client_id: process.env.HGRAPH_CLIENT_ID,
        client_secret: process.env.HGRAPH_CLIENT_SECRET,
        audience: 'https://api.hgraph.io',
        grant_type: 'client_credentials',
      },
    })
    .json()

  console.log(authResponse)

  /*
   * hgraph query
   */
  const query = fs.readFileSync('lib/SampleHgraphQuery.gql', 'utf8')
  const accountId = 3

  const response = await got
    .post('https://api.hgraph.io/v1/graphql', {
      headers: {
        Authorization: `Bearer ${authResponse.access_token}`,
      },
      json: {
        query,
        variables: {
          accountId,
        },
      },
    })
    .json()

  console.table(response.data.account_balance)
  //console.log(JSON.stringify(response, null, 2))
}

main()
