import React, { useEffect, useState } from 'react'

import { motion, useAnimationControls } from 'framer-motion'

import { homeLang } from '@langs/index'

import langHook from '@hooks/langHook'

import './index.less'

import leadImg from '@img/home/team/lead.png'
import williamImg from '@img/home/team/william.png'
import raymondcoderImg from '@img/home/team/raymondcoder.png'
import lineImg from '@img/home/team/line.png'

interface TeamProps {
  routerIndex: number
}

const initial = { y: '100%' }

const transition = {
  duration: 0.8,
  delay: 0.4,
  ease: 'linear'
}

export default ({ routerIndex }: TeamProps): JSX.Element => {

  const lang = langHook()

  const titleControls = useAnimationControls()
  const teamControls = useAnimationControls()

  const [currentHeader, setCurrentHeader] = useState(1)

  useEffect(() => {
    if (routerIndex !== 2) return
    // title
    titleControls.set({ opacity: 0 })
    titleControls.start({ opacity: 1 })
    // team
    setCurrentHeader(1)
    teamControls.set(initial)
    teamControls.start({ y: 0 })
  }, [routerIndex])

  useEffect(() => {
    // team
    teamControls.set(initial)
    teamControls.start({ y: 0 })
  }, [currentHeader])

  const team = [
    {
      className: 'h_t_h_william',
      img: williamImg,
      title: 'Co-Founder william.eth',
      text: (
        <>
          <p>
            <span>{lang(homeLang.team_william_text1_outline)}</span>
            {lang(homeLang.team_william_text1)}
          </p>
          <p>
            {lang(homeLang.team_william_text2)}
            <span>{lang(homeLang.team_william_text2_outline)}</span>
          </p>
          <p>{lang(homeLang.team_william_text3)}</p>
        </>
      ),
    },
    {
      className: 'h_t_h_lead',
      img: leadImg,
      title: 'Lead Founder tiaotiao.eth',
      text: (
        <>
          <p>
            {lang(homeLang.team_lead_text1_before)}
            <span>{lang(homeLang.team_lead_text1_outline)}</span>
            {lang(homeLang.team_lead_text1_after)}
          </p>
          <p>
            {lang(homeLang.team_lead_text2)}
            <span>{lang(homeLang.team_lead_text2_outline)}</span>
          </p>
        </>
      ),
    },
    {
      className: 'h_t_h_raymondcoder',
      img: raymondcoderImg,
      title: 'Co-Founder raymondcoder.bit',
      text: (
        <>
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
        </>
      ),
    },
  ]

  return (
    <div className="home_team">
      <motion.div
        className="home_team_title"
        initial={{ opacity: 0 }}
        animate={titleControls}
        transition={transition}
      >
        {lang(homeLang.team_title)}
      </motion.div>
      <motion.div
        className="home_team_sub_title"
        initial={{ opacity: 0 }}
        animate={titleControls}
        transition={transition}
      >
        {lang(homeLang.team_sub_title)}
      </motion.div>

      <motion.ul
        className="home_team_header_img"
        initial={{ opacity: 0 }}
        animate={titleControls}
        transition={transition}
      >
        {
          team.map((item, index) => {
            return (
              <li
                className={['h_t_h_li', item.className, currentHeader === index ? 'h_t_h_current' : ''].join(' ')}
                key={index}
                onClick={() => setCurrentHeader(index)}
              >
                <img className='h_t_h_l_header_img' src={item.img} />
                <div className="h_t_h_l_title">
                  {item.title}
                </div>
                <img className="h_t_h_l_line" src={lineImg} alt="" />
              </li>
            )
          })
        }
      </motion.ul>
      <div className="home_team_cover">
        <motion.div
          className="h_t_c_text"
          initial={initial}
          transformTemplate={({ y }) => `translateY(${y})`}
          animate={teamControls}
          transition={transition}
        >
          {team[currentHeader].text}
        </motion.div>
      </div>
    </div>
  )
}
