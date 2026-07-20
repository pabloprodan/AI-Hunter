import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@ai-hunter/ui', '@ai-hunter/core', '@ai-hunter/types', '@ai-hunter/utils'],
};

export default nextConfig;
