var btdb = require('../app.js');
btdb.search('Ubuntu', {sorts: 'popular', page_min: 1, page_max: 5}).then(data => {console.log(JSON.stringify(data, null, 2));});
