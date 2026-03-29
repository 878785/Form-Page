const http = require('http');
const fs = require('fs');
const path = require('path');

// request handler
const requesthandler = (req, res) => {
    console.log(req.url);

  
 // Home Page (Success Page)
if (req.method === 'GET' && req.url === '/home') {
    res.setHeader('Content-Type', 'text/html');
    res.write(`
    <html>
    <head>
        <title>Submission Successful</title>
        <link rel="stylesheet" href="/style.css">
    </head>
    <body>
        <div class="container">
            <span class="success-icon">✅</span>
            <h1>Success!</h1>
            <p>Aapka message <b>Sumit Mishra</b> ki file me ja chuka hain aur save ho chuka hain.</p>
            <a href="/" class="btn-link">Back to Form</a>
        </div>
    </body>
    </html>
    `);
    return res.end();
}
        

    // Submit handler
    if (req.method === 'POST' && req.url === '/submit') {
        const body = [];

        req.on('data', (chunk) => {
            body.push(chunk);
        });

        req.on('end', () => {
            const parsedbody = Buffer.concat(body).toString();

            const params = new URLSearchParams(parsedbody);
            const data = Object.fromEntries(params);


            //file create + data save
            fs.writeFileSync('user-data.txt',JSON.stringify(data));

            res.statusCode = 302;
            res.setHeader('Location', '/home');
            return res.end();
        });

        return;
    }

    // CSS serve
    if (req.url === '/style.css') {
        const filePath = path.join(__dirname, 'style.css');
        fs.readFile(filePath, (err, data) => {
            res.setHeader('Content-Type', 'text/css');
            res.write(data);
            res.end();
        });
        return;
    }

    // HTML
    res.setHeader('Content-Type', 'text/html');
    res.write(`
        <html>
        <head>
        <title>Login Form</title>
        <link rel="stylesheet" href="/style.css">
        </head>
        <body>
<div class="container">
    <form class="form" method="POST" action="/submit">
        <h2>Contact Us</h2>

        <div class="input-group">
            <input type="text" name="name" required>
            <label>Name</label>
        </div>

        <div class="input-group">
            <input type="email" name="email" required>
            <label>Email</label>
        </div>

        <div class="input-group">
            <input type="password" name="password" required>
            <label>Password</label>
        </div>

        <div class="input-group">
            <textarea name="message" required></textarea>
            <label>Message</label>
        </div>

        <button type="submit">Submit</button>
    </form>
</div>
</body>
</html>
    `);

    return res.end();
};


// create server
const server = http.createServer(requesthandler);

const Port = 3009;

// start server
server.listen(Port, () => {
    console.log(`Server is running at http://localhost:${Port}`);
});