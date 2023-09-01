import multyparty from "multiparty";
import S3 from "aws-sdk/clients/s3";
import fs from "fs";
import path from "path";
export default async function handle(req, res) {
  const s3Client = new S3({
    region: "sa-east-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });

  const form = new multyparty.Form({
    uploadDir: "./public",
  });
  form.parse(req, async (err, fields, files) => {
    if (err) {
      throw err;
    }

    const fileInfo = files["cover"][0];

    //path para diferentes sistemas operativos.
    const fileName = path.basename(fileInfo.path);

    s3Client.upload(
      {
        Bucket: "denis-twitter-clone",
        Body: fs.readFileSync(fileInfo.path),
        ACL: "public-read",
        Key: fileName,
        ContentType: fileInfo.headers["content-type"],
      },
      (err, data) => {
        res.json({ err, data, fileInfo });
      }
    );
  });
}

export const config = {
  api: {
    bodyParser: false, //disable body parser for this route
  },
};
