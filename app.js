const thenfunc = require('q')
const request = require('request')
const cheerio = require('cheerio')
const async = require('async')

const website_url = 'https://btdb.to/q/'

exports.search = (searchStr, params) => {
	const defr = thenfunc.defer()
	let result = []

	if (params) {
		params.page_min = params.page_min || 1
		params.page_max = params.page_max || 1
		params.sorts = params.sorts || ''
		params.timeout = (params.timeout && parseInt(params.timeout) == params.timeout ? params.timeout : 0)
	}

	async.times(((params.page_max - params.page_min) + 1), (index, times_cb) => {
		const option = {url: website_url + encodeURIComponent(searchStr) + '/' + 
(params.page_min + index) + '?sort=' + params.sorts}
		if (params.timeout) {
			option.timeout = params.timeout
		}
		request(option, (err, resp, html) => {
			if (err || !html) {
				return times_cb()
			}

			let $ = cheerio.load(html)
			let elems = $('li[class=search-ret-item]')
			let count = elems.length

			elems.each((i, elem) => {
				let torrent = {
					magnet: $(elem).find('a[class=magnet]').attr('href'),
					name: $(elem).find('.item-title a').attr('title'),
					size: $(elem).find('.item-meta-info-value').eq(0).text(),
					popularity: $(elem).find('.item-meta-info-value').eq(3).text(),
					list_files: []
				}

				$(elem).find('.file').each((i, file) => {
					torrent.list_files.push({
						type: $(file).find('.file-icon').find('i').attr('class').replace('fa', '').replace('fa-', '').replace('-o', '').trim(),
						name: $(file).find('.file-name').text().trim(),
						size: $(file).find('.file-size').text().trim()
					})
				})

				result.push(torrent)
				if (!--count) { return times_cb() }
			})
		})
	}, (err, res) => {
		return defr.resolve(result)
	})
	return defr.promise
}
