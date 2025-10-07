/** @type {import('next').NextConfig} */

import withTM from "next-transpile-modules";

const nextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'service-app-docs.s3.us-east-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    turbo: false, // disable Turbopack
  },
};

export default withTM([
  "@fullcalendar/common",
  "@babel/preset-react",
  "@fullcalendar/common",
  "@fullcalendar/daygrid",
  "@fullcalendar/interaction",
  "@fullcalendar/react",
  "@fullcalendar/timegrid",
  "@fullcalendar/timeline",
  "@fullcalendar/resource-timeline",
  "react-advanced-datetimerange-picker",
  "react-datetime-picker",
])(nextConfig);