const PROJECT_ID = process.argv[2]

const { execSync } = require("child_process");
const { readFileSync } = require("fs");

const npmSpawnPath = execSync("npm root -g");
const firebaseToolsPath = `${npmSpawnPath.toString().trim()}/firebase-tools`

const { getGlobalDefaultAccount } = require(`${firebaseToolsPath}/lib/auth.js`);
const { getCredentialPathAsync } = require(`${firebaseToolsPath}/lib/defaultCredentials.js`);
const { getAccessToken } = require(`${firebaseToolsPath}/lib/auth.js`);

async function main() {
  const account = getGlobalDefaultAccount()
  const credPath = await getCredentialPathAsync(account)
  const userToken = readFileSync(credPath, "utf-8")

  const refreshToken = JSON.parse(userToken).refresh_token
  const accessTokenInfo = await getAccessToken(refreshToken, [])
  const accessToken = accessTokenInfo.access_token;

  const response = await fetch(`https://identitytoolkit.googleapis.com/admin/v2/projects/${PROJECT_ID}/config`, {
    headers: {
      "Authorization": `Bearer ${accessToken}`
    },
    method: "GET",
  })

  const responseText = await response.text()

  console.log("--- blockingFunctions")
  console.log(JSON.parse(responseText)["blockingFunctions"])
}

main()