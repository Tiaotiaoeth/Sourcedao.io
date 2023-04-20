import React, { useEffect } from 'react'

import { useSwiper } from 'swiper/react'

import { motion, useAnimationControls } from 'framer-motion'

import { homeLang } from '@langs/index'

import langHook from '@hooks/langHook'

import './index.less'

import arrowImg from '@img/home/arrow.png'
import leadImg from '@img/home/lead.png'
import williamImg from '@img/home/william.png'
import raymondcoderImg from '@img/home/raymondcoder.png'
import lineImg from '@img/home/line.png'
import logo from '@img/home/team_logo.png'

interface TeamProps {
  routerIndex: number
}

const initial = { y: 402 }

const transition = {
  duration: 0.8,
  delay: 0.4,
  ease: 'linear'
}

export default ({ routerIndex }: TeamProps): JSX.Element => {

  const swiper = useSwiper()

  const lang = langHook()

  const titleControls = useAnimationControls()
  const teamControls = useAnimationControls()

  useEffect(() => {
    if (routerIndex !== 2) return
    // title
    titleControls.set({ opacity: 0 })
    titleControls.start({ opacity: 1 })
    // team
    teamControls.set(initial)
    teamControls.start({ y: 0 })
  }, [routerIndex])

  return (
    <div className="home_team">
      <div className="home_team_content">
        <motion.div
          className="h_t_c_title"
          initial={{ opacity: 0 }}
          animate={titleControls}
          transition={transition}
        >
          {lang(homeLang.team_title)}
        </motion.div>
        <motion.div
          className="h_t_c_sub_title"
          initial={{ opacity: 0 }}
          animate={titleControls}
          transition={transition}
        >
          {lang(homeLang.team_sub_title)}
        </motion.div>
        <div className="h_t_c_team_cover">
          <motion.ul
            className="h_t_c_team"
            initial={initial}
            transformTemplate={({ y }) => `translateY(${y})`}
            animate={teamControls}
            transition={transition}
          >
            <li className='h_t_c_t_li h_t_c_t_li_william'>
              <div className="h_t_c_t_l_top">
                <img className='h_t_c_t_l_t_header_img' src={williamImg} />
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
                <img className='h_t_c_t_l_t_header_img' src={leadImg} />
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
                <img className='h_t_c_t_l_t_header_img' src={raymondcoderImg} />
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
          </motion.ul>
        </div>
        <div className="h_t_c_logo">
          <img src={logo} alt="" />
        </div>
      </div>
      <div className="home_road_arrow" onClick={() => swiper.slideNext()}>
        <img src={arrowImg} alt="" />
      </div>
    </div>
  )
}
