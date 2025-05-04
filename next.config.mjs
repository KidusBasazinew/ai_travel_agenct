/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "countryflagsapi.com",
        pathname: "/**",
      },
    ],
    domains: [
      "lh3.googleusercontent.com",
      "flagcdn.com",
      "countryflagsapi.com",
    ],
  },
};

export default nextConfig;
