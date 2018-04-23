/**
 * Criado por Adriel Mendes 27/10/2017
 */

const thenfunc = require('q');
const request = require('request');
const cheerio = require('cheerio');

exports.search = function (searchStr) {
    const defr = thenfunc.defer();
	var result = [];
    const option = {url: 'https://btdb.to/q/' + encodeURIComponent(searchStr) + '/?sort=popular'};
    request(option, function (err, resp, html) {
        var $ = cheerio.load(html);
        var elems = $('li[class=search-ret-item]'), count = elems.length;
        elems.each(function () {
            var magnet = $(this).find('a[class=magnet]').attr('href');
            var name = $(this).find('.item-title a').attr('title');
            var size = $(this).find('.item-meta-info-value').eq(0).text();
            var popularity = $(this).find('.item-meta-info-value').eq(3).text();
			var list_files = [];

			var files = $(this).find('.file')
			files.each((i, file) => {
				list_files.push({
					type: $(file).find('.file-icon').find('i').attr('class').replace('fa', '').replace('fa-', '').replace('-o', '').trim(),
					name: $(file).find('.file-name').text().trim(),
				});
			})

            result.push({magnet, name, size, popularity, list_files});
            if (!--count)
                defr.resolve(result);
        });

    });
    return defr.promise;
};
