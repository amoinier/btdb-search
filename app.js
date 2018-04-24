/**
 * Criado por Adriel Mendes 27/10/2017
 */

const thenfunc = require('q')
const request = require('request')
const cheerio = require('cheerio')
const async = require('async')

exports.search = function (searchStr, options) {
  const defr = thenfunc.defer()
  let result = []
  let startPage = 1, endPage = 1, sort = ''

  if (options) {
    startPage = options.page_min || 1
    endPage = options.page_max || 1
    sort = options.sorts || ''
  }

  async.times(((endPage - startPage) + 1), (index, times_cb) => {
    const option = {url: 'https://btdb.to/q/' + encodeURIComponent(searchStr) + '/' + (startPage + index) + '?sort=' + sort}
	    request(option, function (err, resp, html) {
	        let $ = cheerio.load(html)
	        let elems = $('li[class=search-ret-item]'), count = elems.length
	        elems.each(function () {
	            let magnet = $(this).find('a[class=magnet]').attr('href')
	            let name = $(this).find('.item-title a').attr('title')
	            let size = $(this).find('.item-meta-info-value').eq(0).text()
	            let popularity = $(this).find('.item-meta-info-value').eq(3).text()
          let list_files = []

          let files = $(this).find('.file')
          files.each((i, file) => {
            list_files.push({
              type: $(file).find('.file-icon').find('i').attr('class').replace('fa', '').replace('fa-', '').replace('-o', '').trim(),
              name: $(file).find('.file-name').text().trim(),
              size: $(file).find('.file-size').text().trim()
            })
          })

	            result.push({magnet, name, size, popularity, list_files})
	            if (!--count) { return times_cb() }
	        })
    })
  }, (err, res) => {
    return defr.resolve(result)
  })
  return defr.promise
}
