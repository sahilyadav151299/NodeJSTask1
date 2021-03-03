const fs = require('fs');

const requestHandler = (req, res) => {
    
    const url = req.url;
    const method = req.method;

    if(url === '/'){
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Greetings</title></head>');
        res.write('<body>');
        res.write('<h1>Have A Good Day!</h1>');
        res.write('</body>');
        res.write('</html>');
        return res.end();
    }

    if(url === '/create'){
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Form</title></head>');
        res.write('<body>');
        res.write('<form action="/add" method="POST">');
        res.write('<label for="username">Enter Username</label><br>');
        res.write('<input type="text" name="username"><br>');
        res.write('<button type="submit">Send</button><br>');
        res.write('</form>');
        res.write('</body>');
        res.write('</html>');
        return res.end();
    }

    if(url === '/add' && method === 'POST'){
        
        let body = [];

        req.on('data', (chunk) => {
            body.push(chunk);
        });

        req.on('end', () => {
            const parseBody = Buffer.concat(body).toString();
            const message = parseBody.split("=")[1] + "\n";
            
            fs.appendFile('username.txt', message, (err) => {
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            }); 
        });
    } 
    
    if(url === '/users'){
            fs.access('./username.txt', fs.F_OK, (err) => {
                if(err){
                    res.statusCode = 302;
                    res.setHeader('Location', '/create');
                    return res.end();
                }
                else{
                        const users = [];
                        fs.readFile('username.txt', (err, data) => {
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        
                        users.push(...data.toString().split('\n'));
                         
                        res.write('<html>');
                        res.write('<head><title>User Info</title></head>');
                        res.write('<body>');
                        res.write('<h2>User Information</h2>');
                        
                        for(const user of users){
                            res.write(`<h4>${user}</h4>`);    
                        }
                        res.write('</body>');
                        res.write('</html>');
                        return res.end();
                    });
                }
            });
    }
}

module.exports = requestHandler;