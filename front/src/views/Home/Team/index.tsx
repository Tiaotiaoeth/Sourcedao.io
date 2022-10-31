import React, { useEffect } from 'react'

import { motion, useAnimationControls } from 'framer-motion'

import { homeLang } from '@langs/index'

import langHook from '@hooks/langHook'

import './index.less'

import leadImg from '@img/home/lead.png'
import williamImg from '@img/home/william.png'
import raymondcoderImg from '@img/home/raymondcoder.png'
import lineImg from '@img/home/line.png'
import logo from '@img/home/team_logo.png'

interface TeamProps {
  routerIndex: number
}

export default ({ routerIndex }: TeamProps): JSX.Element => {

  const lang = langHook()

  const headerImgControls = useAnimationControls()

  useEffect(() => {
    if (routerIndex !== 2) return
    // headerImgControls.set({ scale: 0 })
    // headerImgControls.start({ scale: 1 })
    headerImgControls.set({ scale: 0, rotate: 0 })
    headerImgControls.start({ scale: 1, rotate: 360 })
  }, [routerIndex])

  return (
    <div className="home_team">
      <div className="home_team_content">
        <div className="h_t_c_title">{lang(homeLang.team_title)}</div>
        <div className="h_t_c_sub_title">{lang(homeLang.team_sub_title)}</div>
        <ul className="h_t_c_team">
          <li className='h_t_c_t_li h_t_c_t_li_william'>
            <div className="h_t_c_t_l_top">
              <motion.img
                className='h_t_c_t_l_t_header_img'
                src={williamImg}
                initial={{ scale: 0 }}
                animate={headerImgControls}
                transition={{
                  duration: 0.4,
                  delay: 0.5,
                  ease: 'linear'
                }}
              />
              <div className="h_t_c_t_l_t_title">
                Co-Founder william.eth
              </div>
              <img className="h_t_c_t_l_t_line" src={lineImg} alt="" />
            </div>
            <div className="h_t_c_t_l_text">
              <p>
                <span>{lang(homeLang.team_william_text1_outline)}</span>
                {lang(homeLang.team_william_text1)}
              </p>
              <p>
                {lang(homeLang.team_william_text2)}
                <span>{lang(homeLang.team_william_text2_outline)}</span>
              </p>
              <p>{lang(homeLang.team_william_text3)}</p>
            </div>
          </li>
          <li className='h_t_c_t_li h_t_c_t_li_lead'>
            <div className="h_t_c_t_l_top">
              <motion.img
                className='h_t_c_t_l_t_header_img'
                src={leadImg}
                initial={{ scale: 0 }}
                animate={headerImgControls}
                transition={{
                  duration: 0.4,
                  delay: 0.4,
                  ease: 'linear'
                }}
              />

              <div className="h_t_c_t_l_t_title">
                Lead Founder tiaotiao.eth
              </div>
              <img className="h_t_c_t_l_t_line" src={lineImg} alt="" />
            </div>
            <div className="h_t_c_t_l_text">
              <p>
                {lang(homeLang.team_lead_text1_before)}
                <span>{lang(homeLang.team_lead_text1_outline)}</span>
                {lang(homeLang.team_lead_text1_after)}
              </p>
              <p>
                {lang(homeLang.team_lead_text2)}
                <span>{lang(homeLang.team_lead_text2_outline)}</span>
              </p>
            </div>
          </li>
          <li className='h_t_c_t_li h_t_c_t_li_raymondcoder'>
            <div className="h_t_c_t_l_top">
              <motion.img
                className='h_t_c_t_l_t_header_img'
                src={raymondcoderImg}
                initial={{ scale: 0 }}
                animate={headerImgControls}
                transition={{
                  duration: 0.4,
                  delay: 0.5,
                  ease: 'linear'
                }}
              />
              <div className="h_t_c_t_l_t_title">
                Co-Founder raymondcoder.bit
              </div>
              <img className="h_t_c_t_l_t_line" src={lineImg} alt="" />
            </div>
            <div className="h_t_c_t_l_text">
              <p>
                <span>{lang(homeLang.team_raymondcoder_text1_outline)}</span>
                {lang(homeLang.team_raymondcoder_text1)}
              </p>
              <p>
                {lang(homeLang.team_raymondcoder_text2_before)}
                <span>{lang(homeLang.team_raymondcoder_text2_outline)}</span>
                {lang(homeLang.team_raymondcoder_text2_after)}
              </p>
              <p>{lang(homeLang.team_raymondcoder_text3)}</p>
            </div>
          </li>
        </ul>
        <div className="h_t_c_logo">
          <img src={logo} alt="" />
        </div>
      </div>
    </div>
  )
}
