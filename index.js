const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Configurazione S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,     
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Nuova rotta per generare una signed URL
app.get('/generate-signed-url', async (req, res) => {
  const { fileName } = req.query; 
  const bucketName = 'tattoo-ai-images'; // <-- Cambia se il bucket è diverso

  if (!fileName) {
    return res.status(400).json({ error: 'Missing fileName query param' });
  }

  const params = {
    Bucket: bucketName,
    Key: fileName,
    Expires: 300,   
    ResponseContentDisposition: 'attachment',
  };

  try {
    const url = s3.getSignedUrl('getObject', params);
    res.json({ url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error generating signed URL' });
  }
});

// Avvia il server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server ready on port ${PORT}`);
});
