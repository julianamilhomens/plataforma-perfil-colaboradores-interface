/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  },
  
  // Configurações de imagem (caso precise no futuro)
  images: {
    domains: ['localhost'],
    unoptimized: true, // Para deploy estático se necessário
  },

  // Headers de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  // Configurações do compilador
  compiler: {
    // Remove console.log em produção
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Configurações experimentais
  experimental: {
    // Permite uso do app directory
    appDir: true,
  },

  // Configurações de bundle
  webpack: (config, { isServer }) => {
    // Otimizações customizadas se necessário
    return config
  },
}

export default nextConfig;