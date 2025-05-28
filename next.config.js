/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        turbo: false,
        serverActions: false,
        typedRoutes: false
    },
    webpack: (config) => {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            lightningcss: false
        };
        return config;
    }
};

module.exports = nextConfig; 