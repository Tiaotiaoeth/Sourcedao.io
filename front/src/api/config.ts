const env = process.env.WEB_ENV

// exam
export const EXAM_ADDRESS = (env === 'pro') ? ''
  : (env === 'pre' ? ''
    : (env === 'sit' ? '0xa5402b2dF555029cc039d7DB917325118FdD791c'
      : (env === 'dev' ? '0xa5402b2dF555029cc039d7DB917325118FdD791c'
        : '0xa5402b2dF555029cc039d7DB917325118FdD791c')))

// reward
export const REWARD_ADDRESS = (env === 'pro') ? ''
  : (env === 'pre' ? ''
    : (env === 'sit' ? '0xF1cCf9f4824929EA8a2B18ED571B6759e6da3fDf'
      : (env === 'dev' ? '0xF1cCf9f4824929EA8a2B18ED571B6759e6da3fDf'
        : '0xF1cCf9f4824929EA8a2B18ED571B6759e6da3fDf')))

// check
export const CHECK_ADDRESS = (env === 'pro') ? ''
  : (env === 'pre' ? ''
    : (env === 'sit' ? '0xC4Bd238B4d502f8BA801decb95D00b08c74e5937'
      : (env === 'dev' ? '0xC4Bd238B4d502f8BA801decb95D00b08c74e5937'
        : '0xC4Bd238B4d502f8BA801decb95D00b08c74e5937')))

// Workflow
export const WORKFLOW_ADDRESS = (env === 'pro') ? ''
  : (env === 'pre' ? ''
    : (env === 'sit' ? '0x0051Cd4974604C1721D5521019C242FE27aD453B'
      : (env === 'dev' ? '0x0051Cd4974604C1721D5521019C242FE27aD453B'
        : '0x0051Cd4974604C1721D5521019C242FE27aD453B')))