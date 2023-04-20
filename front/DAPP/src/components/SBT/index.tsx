import React, { forwardRef } from 'react'

import { useAppSelector } from '@store/index'

import { scoreGrade, dateTimeConversion } from '@utils/index'

import './index.less'

import AddressImg from '@images/sbt/address.png'
import MaskImg from '@images/sbt/mask.png'

export interface SBTProps {
  score: number
  name: string
  org: string
  level: number
}

export default forwardRef<HTMLDivElement, SBTProps>(
  ({ score, name, org, level }, ref): JSX.Element => {
    const { accountAddress } = useAppSelector((store) => store.wallet)

    const time = new Date().getTime()
    const year = dateTimeConversion(time, 'YYYY')
    const month = dateTimeConversion(time, 'MMM')
    const day = dateTimeConversion(time, 'DD')

    const date = `${day}th ${month}, ${year}`

    return (
      <div className="sbt" ref={ref}>
        <p className="sbt_text">This is to certify the degree of</p>
        <h6 className="sbt_name">{name} Level({level})</h6>
        <p className="sbt_sourc">{scoreGrade(score).toLocaleUpperCase()}</p>
        <div className="sbt_addressImg">
          <img src={AddressImg} alt="" />
        </div>
        <p className="sbt_address">{accountAddress}</p>
        <div className="sbt_bottom">
          <div className="sbt_bottom_date">{date}</div>
          <div className="sbt_bottom_org">{org.toLocaleUpperCase()}</div>
          <img src={MaskImg} className="sbt_bottom_mask" />
        </div>
      </div>
    )
  }
)
