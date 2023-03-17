const env = process.env.WEB_ENV

// exam
export const EXAM_ADDRESS = (env === 'pro') ? ''
  : (env === 'pre' ? ''
    : (env === 'sit' ? ':0x6d581bE549490098c76B66e508A7064dC632FFD6'
      : (env === 'dev' ? ':0x6d581bE549490098c76B66e508A7064dC632FFD6'
        : ':0x6d581bE549490098c76B66e508A7064dC632FFD6')))

// reward
export const REWARD_ADDRESS = (env === 'pro') ? ''
  : (env === 'pre' ? ''
    : (env === 'sit' ? '0x8a44cD755DdE378E721Fbc9c149c8237AB96cb12'
      : (env === 'dev' ? '0x8a44cD755DdE378E721Fbc9c149c8237AB96cb12'
        : '0x8a44cD755DdE378E721Fbc9c149c8237AB96cb12')))

// check
export const CHECK_ADDRESS = (env === 'pro') ? ''
  : (env === 'pre' ? ''
    : (env === 'sit' ? ':0x6AF4404C2ee6cdaEeBf7Dd50775d71F233b04caa'
      : (env === 'dev' ? ':0x6AF4404C2ee6cdaEeBf7Dd50775d71F233b04caa'
        : ':0x6AF4404C2ee6cdaEeBf7Dd50775d71F233b04caa')))

// Workflow
export const WORKFLOW_ADDRESS = (env === 'pro') ? ''
  : (env === 'pre' ? ''
    : (env === 'sit' ? '0x0854ba02173B93904Cb8c6C7e944afA477E4c6f7'
      : (env === 'dev' ? '0x0854ba02173B93904Cb8c6C7e944afA477E4c6f7'
        : '0x0854ba02173B93904Cb8c6C7e944afA477E4c6f7')))

// API_HOST
export const API_HOST = (env === 'pro') ? ''
  : (env === 'pre' ? ''
    : (env === 'sit' ? '//15.152.36.175:8080'
      : (env === 'dev' ? '//15.152.36.175:8080'
        : '//15.152.36.175:8080')))

// IPFS_HOST
export const IPFS_HOST = (env === 'pro') ? ' '
  : (env === 'pre' ? ' '
    : (env === 'sit' ? ' '
      : (env === 'dev' ? ' '
        : '/api')))
// export const IPFS_HOST = (env === 'pro') ? ''
//   : (env === 'pre' ? ''
//     : (env === 'sit' ? '//15.152.36.175:5001'
//       : (env === 'dev' ? '//15.152.36.175:5001'
//         : '//15.152.36.175:5001')))