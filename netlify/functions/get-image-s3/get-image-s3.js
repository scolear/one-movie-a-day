const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const client = new S3Client({ region: "eu-west-3" });

const handler = async (event) => {
  try {
    const key = event.queryStringParameters.key;
    const response = await client.send(new GetObjectCommand({Bucket: 'onemovieaday', Key: key}));
    const buff = Buffer.from(await response.Body.transformToByteArray());
    return {
        "statusCode": 200,
        "body": JSON.stringify(buff),
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
