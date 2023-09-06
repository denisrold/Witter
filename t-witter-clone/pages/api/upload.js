import multyparty from "multiparty";
import S3 from "aws-sdk/clients/s3";
import fs from "fs";
import path from "path";
import User from "@/models/users";
export default async function handle(req, res) {
  const s3Client = new S3({
    region: "sa-east-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });

  const form = new multyparty.Form();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      throw err;
    }
    const userId = fields["userId"][0];
    //const fileInfo = files["cover"][0];

    const type = Object.keys(files)[0];
    const fileInfo = files[type][0];
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
      async (err, data) => {
        if (type === "cover" || type === "image") {
          await User.findByIdAndUpdate(userId, {
            [type]: data.Location,
          });
        }

        fs.unlinkSync(fileInfo.path);
        res.json({ err, data, fileInfo, source: data.Location });
      }
    );
  });
}

export const config = {
  api: {
    bodyParser: false, //disable body parser for this route
  },
};
