require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const dns = require("dns");
const urlparser = require("url");
const bodyParser = require("body-parser");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

// app.post('/api/shorturl', function(req, res) {
//   const url = req.body.url;
//   const urlCode = shortId.generate();

// })

let Urls = [];

app.post("/api/shorturl", (req, res) => {
  const bodyurl = req.body.url;

  dns.lookup(urlparser.parse(bodyurl).hostname, (err, address) => {
    if (!address) {
      res.json({ error: "Invalid URL" });
    } else {
      let shortUrl = Urls.length + 1
      Urls.push({
        original_url: bodyurl,
        short_url: shortUrl,
      })
      res.json({
        original_url: bodyurl,
        short_url: shortUrl,
      })
    }
  })
})

app.get("/api/shorturl/:id", (req, res) => {
  const id = req.params.id;
  const url = Urls.find((data) => data.short_url == id)
  if (url) {
    return res.redirect(url.original_url)
  } else {
    return res.status(404).json("No URL found")
  }
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
