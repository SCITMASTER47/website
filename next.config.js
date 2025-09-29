/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cross-origin 요청 허용 설정
  allowedDevOrigins: [
    "1.235.197.68",
    "localhost",
    "127.0.0.1",
    "ffce1dcd753c.ngrok-free.app",
  ],

  images: {
    domains: [
      "www.jlpt.or.kr",
      "lh7-rt.googleusercontent.com",
      "imagesisa.ybmnet.co.kr",
      "mo.q-net.or.kr",
      "scit472.s3.ap-northeast-2.amazonaws.com",
    ],
  },

  // 이렇게 logging 설정은 최상위 속성으로
  logging: {
    fetches: {
      fullUrl: true, // fetch 요청하면 전체 URL 보여줌
      hmrRefreshes: true, // HMR 복구된 fetch도 로깅
    },
    incomingRequests: {
      ignore: [/\api\/v1\/health/],
    },
  },
  devIndicators: false,
  reactStrictMode: false,
};

module.exports = nextConfig;
