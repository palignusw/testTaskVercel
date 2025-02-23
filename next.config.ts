const withTM = require('next-transpile-modules')([
	'antd',
	'@ant-design/icons',
	'@ant-design/icons-svg',
	'rc-util',
	'rc-pagination',
	'rc-picker',
	'rc-menu',
	'rc-dropdown',
	'rc-select',
	'rc-tree',
	'rc-table',
	'rc-tabs',
	'rc-input',
])

const nextConfig = withTM({
	reactStrictMode: true,
	webpack: (config: any) => {
		config.module.rules.push({
			test: /\.m?js/,
			resolve: {
				fullySpecified: false,
			},
		})
		return config
	},
})

module.exports = nextConfig
