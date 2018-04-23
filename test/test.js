var btdb = require('../app.js');
btdb.search('Ubuntu').then(data => {console.log(JSON.stringify(data, null, 2));});
