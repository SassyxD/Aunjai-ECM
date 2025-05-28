/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        turbo: {
            enabled: false
        },
        serverActions: {
            enabled: false
        },
        typedRoutes: false
    },
    webpack: (config) => {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            lightningcss: false
        };
        return config;
    },
    async rewrites() {
        return [
            {
                source: '/api/blacklist-proxy/:path*',
                destination: 'https://blacklistseller.com/:path*',
                basePath: false
            }
        ];
    },
    async headers() {
        return [
            {
                source: '/api/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Credentials', value: 'true' },
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                    { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
                    { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' }
                ]
            }
        ];
    }
};

module.exports = nextConfig; 