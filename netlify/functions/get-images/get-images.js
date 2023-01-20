// for a full working demo of Netlify Identity + Functions, see https://netlify-gotrue-in-react.netlify.com/

const fetch = require('node-fetch')

const handler = async function (event) {
  const url = event.queryStringParameters.url;
  try {
    const response = await fetch(url)
    if (!response.ok) {
      return { statusCode: response.status, body: response.statusText }
    }
    const data = await response.blob();
    const ab = Array.from(new Uint8Array(await data.arrayBuffer()));

    return {
      statusCode: 200,
      body: JSON.stringify({ msg: ab }),
    }
  } catch (error) {
    // output to netlify function log
    console.log(error)
    return {
      statusCode: 500,
      // Could be a custom message or object i.e. JSON.stringify(err)
      body: JSON.stringify({ msg: error.message }),
    }
  }
}

module.exports = { handler }
