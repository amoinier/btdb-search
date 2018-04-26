var btdb = require('../app.js');
btdb.search('Ubuntu', {sorts: 'popular', page_min: 3, page_max: 5, timeout: 0}).then(data => {console.log(JSON.stringify(data, null, 2));});
