import React from 'react'

import { Card, CardContent, Typography } from '@mui/material'

import langHook from '@hooks/localHook'
import { certificateLang } from '@langs/index'

import './index.less'

interface BlockchainProps {
  chain: string
}

export default ({ chain }: BlockchainProps): JSX.Element => {
  const local = langHook()
  return (
    <Card sx={{ mb: 6 }}>
      <CardContent>
        <Typography variant="h6">
          {local(certificateLang.blockChainI)}
        </Typography>
        <div className="blockchain">
          <div className="blockchain_left">
            {local(certificateLang.blockChain)}
          </div>
          <div className="blockchain_right">{chain}</div>
        </div>
        {/* <div className="blockchain">
          <div className="blockchain_left">TXID</div>
          <a className="blockchain_right" href="#" target="_blank">
            {contractAddr}
          </a>
        </div> */}
      </CardContent>
    </Card>
  )
}
