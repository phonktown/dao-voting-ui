const basePath = process.env.BASE_PATH || ''
const publicMainnetRPCs = [
  'https://api.noderpc.xyz/rpc-mainnet/public',
  'https://ethereum.publicnode.com',
  'https://nodes.mewapi.io/rpc/eth',
]
const defaultESK = '4FVUV183VQCSSAWFCZ7N631E21N76ED5CV'
const defaultWalletconnectProjectID = 'd944ff3ae6bddde25af8f957eb240ac5'

const rpcUrls_1 =
  (process.env.EL_RPC_URLS_1 && process.env.EL_RPC_URLS_1.split(',')) || publicMainnetRPCs
const rpcUrls_5 =
  process.env.EL_RPC_URLS_5 && process.env.EL_RPC_URLS_5.split(',')
const rpcUrls_17000 =
  process.env.EL_RPC_URLS_17000 && process.env.EL_RPC_URLS_17000.split(',')

const etherscanApiKey = process.env.ETHERSCAN_API_KEY || defaultESK

// Mainnet is the default chain
const _defaultChain =  '1';

// Keep both Mainnet and Holesky as defaults
const defaultSupportedChains = '1,17000'

const defaultChain = process.env.DEFAULT_CHAIN || _defaultChain
const supportedChains = process.env.SUPPORTED_CHAINS || defaultSupportedChains

const cspTrustedHosts = process.env.CSP_TRUSTED_HOSTS
const cspReportOnly = process.env.CSP_REPORT_ONLY
const cspReportUri = process.env.CSP_REPORT_URI

const ipfsMode = process.env.IPFS_MODE
const walletconnectProjectId = process.env.WALLETCONNECT_PROJECT_ID || defaultWalletconnectProjectID

export default {
  basePath,
  webpack5: true,
  experimental: {
    // Fixes a build error with importing Pure ESM modules, e.g. reef-knot
    // Some docs are here:
    // <https://github.com/vercel/next.js/pull/27069>
    // You can see how it is actually used in v12.3.4 here:
    // <https://github.com/vercel/next.js/blob/v12.3.4/packages/next/build/webpack-config.ts#L417>
    // Presumably, it is true by default in next v13 and won't be needed
    esmExternals: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg.react$/i,
      issuer: { and: [/\.(js|ts|md)x?$/] },
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            prettier: false,
            svgo: true,
            svgoConfig: {
              plugins: [
                {
                  name: 'removeViewBox',
                  active: false,
                },
              ],
            },
            titleProp: true,
          },
        },
      ],
    })

    config.module.rules.push({
      test: /\.(t|j)sx?$/,
      use: [
        {
          loader: 'webpack-preprocessor-loader',
          options: {
            params: {
              IPFS_MODE: String(ipfsMode === 'true'),
            },
          },
        },
      ],
    })

    return config
  },
  // WARNING: Vulnerability fix, don't remove until default Next.js image loader is patched
  images: {
    loader: 'custom',
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'same-origin',
          },
        ],
      },
    ]
  },
  devServer(configFunction) {
    return function (proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost)

      config.headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers':
          'X-Requested-With, content-type, Authorization',
      }

      return config
    }
  },
  serverRuntimeConfig: {
    basePath,
    rpcUrls_1,
    rpcUrls_5,
    rpcUrls_17000,
    etherscanApiKey,
    cspTrustedHosts,
    cspReportOnly,
    cspReportUri,
  },
  publicRuntimeConfig: {
    defaultChain,
    supportedChains,
    ipfsMode,
    walletconnectProjectId,
  },
}
