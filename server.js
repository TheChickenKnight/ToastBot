var express = require('express'),app = express(), port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/website'));
app.get('/', (req, res) => res.render('index'));
app.listen(port, () => console.log('app running'));