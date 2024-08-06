const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');

// console.log("Starting...");
// let readData;

// const data = fs.readFileSync('./txt/input.txt', 'utf-8');
// fs.readFile('./txt/input.txt','utf-8',(err, data) => {
//     if (err) return console.error(err.message);
//     readData = data;
//     console.log(data);
// })
// console.log(data);

// fs.writeFileSync('./txt/output.txt', `the data I just read is ${data}.\nthe data is ${Date.now()}`);
// fs.writeFile('./txt/output.txt',`the data I just read is ${readData}.\nthe data is ${Date.now()}`,(err) => {
//     if (err) return console.error(err);
//     console.log("written");
// })
// console.log("written to file");\


const productsData = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const products = JSON.parse(productsData);

const overview = fs.readFileSync(`${__dirname}/templates/overview.html`,'utf-8');
const product = fs.readFileSync(`${__dirname}/templates/product.html`,'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');

const server = http.createServer((req, res)=>{
    // const url = req.url;
    const {query,pathname} = url.parse(req.url, true);
    if(pathname === "/" || pathname === "/overview"){
        res.writeHead(200,{
            'Content-Type': 'text/html'
        })

        const cards = products.map(product => replaceTemplate(product,templateCard)).join('');
        const output = overview.replace(/{%PRODUCT_CARDS%}/g,cards);
        res.end(output)
    }
    else if(pathname === "/products"){
        const productObj = products[query.id];
        const output = replaceTemplate(productObj,product);
        res.writeHead(200,{
            'Content-Type': 'text/html'
        });
        res.end(output)
    }
    else if(pathname === "/api"){
        res.writeHead(200,{
            'Content-Type': 'application/json'
        });
        res.end(productsData);
    }
    else{
        res.writeHead(404,{
            'Content-type': 'text/html',
            'my-own-header': 'custom-header',
        });
        res.end("<p><b>Page not found</b></p>")
    }
});
server.listen(8080,'127.0.0.1',()=>{
    console.log("listening on 8080")
})