import React from 'react'
import { utils } from 'ethers'

import { Skeleton } from '@mui/material'

import langHook from '@hooks/localHook'
import { introduceLang } from '@langs/index'

import './index.less'

interface MetaProps {
  examSBTMeta: string[]
}

export default ({ examSBTMeta }: MetaProps): JSX.Element => {
  const local = langHook()

  return (
    <>
      <div className="row">
        <div className="row_left">{local(introduceLang.ci)}</div>
        <div className="row_right">
          {examSBTMeta[0] ? (
            examSBTMeta[0]
          ) : (
            <Skeleton variant="text" sx={{ width: 100, fontSize: '12px' }} />
          )}
        </div>
      </div>
      <div className="row">
        <div className="row_left">{local(introduceLang.duration)}</div>
        <div className="row_right">
          {examSBTMeta[1] ? (
            examSBTMeta[1] + local(introduceLang.mins)
          ) : (
            <Skeleton variant="text" sx={{ width: 100, fontSize: '12px' }} />
          )}
        </div>
      </div>
      <div className="row">
        <div className="row_left">{local(introduceLang.noq)}</div>
        <div className="row_right">
          {examSBTMeta[2] ? (
            examSBTMeta[2] + local(introduceLang.question)
          ) : (
            <Skeleton variant="text" sx={{ width: 100, fontSize: '12px' }} />
          )}
        </div>
      </div>
      <div className="row">
        <div className="row_left">{local(introduceLang.vp)}</div>
        <div className="row_right">
          {examSBTMeta[3] ? (
            (parseInt(examSBTMeta[3]) / 12) + local(introduceLang.year)
          ) : (
            <Skeleton variant="text" sx={{ width: 100, fontSize: '12px' }} />
          )}
        </div>
      </div>
      <div className="row">
        <div className="row_left">{local(introduceLang.fee)}</div>
        <div className="row_right">
          {examSBTMeta[4] ? (
            utils.formatEther(examSBTMeta[4])
          ) : (
            <Skeleton variant="text" sx={{ width: 100, fontSize: '12px' }} />
          )}
        </div>
      </div>
    </>
  )
}
