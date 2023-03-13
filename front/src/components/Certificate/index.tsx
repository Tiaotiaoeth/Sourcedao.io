import React, { useState, useEffect } from 'react'

import langHook from '@hooks/localHook'
import { certificateLang, examLang } from '@langs/index'

import { CSTLEVEL } from '@constants/exam'

import { examApi, centerApi } from '@api/index'

import { truncateMiddle, dateTimeConversion } from '@utils/index'
// import { catImg } from '@utils/ipfs'

import type { SourceDaoReward } from '@api/reward'

import './index.less'

export interface CertificateProps {
  sbt?: string
  data: SourceDaoReward
}

export default ({ sbt, data }: CertificateProps): JSX.Element => {
  
  const local = langHook()

  const [name, setName] = useState('')
  const [picContent, setPicContent] = useState('')

  useEffect(() => {
    examApi.getTypeName(data.qtype).then((res) => {
      setName(res)
    })
    // catImg(data.picContent).then((res) => {
    //   setPicContent(res)
    // })
    centerApi.imgBase64(data.picContent).then((res) => {
      setPicContent(res)
    })
  }, [])

  return (
    <div className="certificate">
      { (
        <>
          <img
            className="certificate_left"
            src={sbt || picContent}
          />
          <div className="certificate_right">
            <div className="certificate_right_name">
              {name}（
              {local(
                examLang[
                  (CSTLEVEL[data.qlevel] as unknown) as keyof typeof examLang
                ]
              )}
              ）
            </div>
            <div className="certificate_right_text"></div>
            <div className="certificate_right_title">
              {local(certificateLang.basic)}
            </div>
            <div className="certificate_right_row certificate_right_basic">
              <div className="c_r_b_box">
                <div className="c_r_b_b_text c_r_b_b_title">
                  {local(certificateLang.iInstitution)}
                </div>
                <div className="c_r_b_b_text">{data.org}</div>
              </div>
              <div className="c_r_b_box">
                <div className="c_r_b_b_text c_r_b_b_title">
                  {local(certificateLang.iTime)}
                </div>
                <div className="c_r_b_b_text">
                  {dateTimeConversion(data.time.toString())}
                </div>
              </div>
              <div className="c_r_b_box">
                <div className="c_r_b_b_text c_r_b_b_title">
                  {local(certificateLang.eTime)}
                </div>
                <div className="c_r_b_b_text">
                  {dateTimeConversion(
                    parseInt(data.time.toString()) +
                      parseInt(data.qduration.toString())
                  )}
                </div>
              </div>
            </div>
            <div className="certificate_right_title">
              {local(certificateLang.blockChainI)}
            </div>
            <div className="certificate_right_row certificate_right_clockChain">
              <div className="c_r_b_box">
                <div className="c_r_b_b_text c_r_b_b_title">
                  {local(certificateLang.blockChain)}
                </div>
                <div className="c_r_b_b_text">{data.chain}</div>
              </div>
              <div className="c_r_b_box">
                <div className="c_r_b_b_text c_r_b_b_title">
                  {local(certificateLang.tStandard)}
                </div>
                <div className="c_r_b_b_text">{data.protocol}</div>
              </div>
              <div className="c_r_b_box">
                <div className="c_r_b_b_text c_r_b_b_title">
                  {local(certificateLang.cAddress)}
                </div>
                <div className="c_r_b_b_text">
                  {truncateMiddle(data.contractAddr)}
                </div>
              </div>
              <div className="c_r_b_box">
                <div className="c_r_b_b_text c_r_b_b_title">
                  {local(certificateLang.tokenID)}
                </div>
                <div className="c_r_b_b_text">{data.id.toString()}</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
