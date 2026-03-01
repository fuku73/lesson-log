/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [{ source: "/backup", destination: "/how-to/transfer", permanent: true }];
  }
};
module.exports = nextConfig;
