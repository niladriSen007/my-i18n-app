const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const uploadToS3 = (filePath, s3Key) => {
  const fileContent = fs.readFileSync(filePath);
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: s3Key,
    Body: fileContent,
    ContentType: 'application/zip'
  };
  return s3.upload(params).promise();
};

const compressFolder = (folderPath, outputZip) => {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputZip);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', resolve);
    archive.on('error', reject);

    archive.pipe(output);
    archive.directory(folderPath, false);
    archive.finalize();
  });
};

const main = async () => {
  const buildDir = path.join(__dirname, '../build');
  const zipFile = path.join(__dirname, '../build.zip');

  await compressFolder(buildDir, zipFile);
  await uploadToS3(zipFile, 'build.zip');

  console.log('Build uploaded to S3 successfully.');
};

main().catch(console.error);