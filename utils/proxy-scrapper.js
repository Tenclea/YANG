const logger = require('./logger'),
	needle = require('needle');

module.exports = async () => {
	const proxySites = {
		http: [
			'https://api.proxyscrape.com/?request=displayproxies&status=alive&proxytype=https',
			'https://api.proxyscrape.com/?request=displayproxies&status=alive&proxytype=http',
			'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt',
			'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt',
			'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/https.txt',
			'https://raw.githubusercontent.com/sunny9577/proxy-scraper/master/proxies.txt',
			'https://raw.githubusercontent.com/hookzof/socks5_list/master/proxy.txt',
			'https://raw.githubusercontent.com/clarketm/proxy-list/master/proxy-list-raw.txt',
		],
		socks: [
			'https://api.proxyscrape.com/?request=displayproxies&status=alive&proxytype=socks4',
			'https://api.proxyscrape.com/?request=displayproxies&status=alive&proxytype=socks5',
			'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/socks4.txt',
			'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/socks5.txt',
			'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/socks4.txt',
			'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/socks5.txt',
			'https://raw.githubusercontent.com/sunny9577/proxy-scraper/master/proxies.txt',
		],
	};

	const types = Object.keys(proxySites);
	const scrapped = types.map(async t => {
		const r = proxySites[t].map(async s => {
			const res = await needle('get', s, { response_timeout: 5000 }).catch(e => e);
			if (!res.body) return [];
			return res.body.split(/\r?\n/)
				.filter(p => p !== '')
				.map(p => t + '://' + p);
		});
		return await Promise.all(r).catch(e => logger.error(e));
	});
	return await Promise.all(scrapped)
		.then(values => values.reduce((a, b) => a.concat(b.reduce((c, d) => c.concat(d), [])), []))
		.catch(e => logger.error(e));
};
