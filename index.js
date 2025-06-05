import express from "express";
import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

app.post("/generate-url", (req, res) => {
  const { bucketName, filePath, filename } = req.body;

  const params = {
    Bucket: bucketName,
    Key: filePath,
    Expires: 300, // 5 minuti
    ResponseContentDisposition: `attachment; filename="${filename}"`,
  };

  s3.getSignedUrl("getObject", params, (err, url) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error generating URL");
    }
    res.json({ url });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
