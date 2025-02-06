import http from 'node:http';
import { readFile } from "node:fs";


http.createServer(
    (req,res) => {
        const path = req.url.toLowerCase();    
        switch(path) {
            case '/':
                readFile('index.html', (err, data) => {
                    if (err) throw err;
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        res.end(data);
                });
                break;
            case '/about':
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end('About page');
                break;
            default:
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end('Not found');
                break;
        }   
    }
).listen(process.env.PORT || 3000);