const express = require("express");
const fs = require("fs");
const path = require("path");
const asciidoctor = require("@asciidoctor/core")();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

// Serve individual posts
app.get("/p/:filename", (req, res) => {
	const filename = req.params.filename;
	const title = filename
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
	const filePath = path.join(__dirname, "posts", filename);

	fs.readFile(`${filePath}.adoc`, "utf8", (err, data) => {
		if (err) {
			return res.status(404).send("Post not found");
		}

		const options = {
			doctype: "article",
			header_footer: false,
			attributes: {
				showtitle: true,
				icons: "font",
				sectanchors: "",
				sectlinks: "",
				linkcss: false,
			},
		};

		const htmlContent = asciidoctor.convert(data, options);
		res.send(`
      <html>
        <head>
          <title>${title}</title>
          <meta charset="UTF-8" />
		      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="stylesheet" href="/main.css">
          <link rel="stylesheet" href="/posts.css">
        </head>
        <body>
          <div class="container content">
            <div class="header">
              <a href="https://x.com/tobthecreator" target="_blank">@tobthecreator</a>
              ::
              <a href="/">Home</a>
              //
              <a href="https://twitter.com/messages/compose?recipient_id=862743485186789376&text=Howdy!">Contact</a>
            </div>
            ${htmlContent}
          </div>
        </body>
      </html>
    `);
	});
});

app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});
