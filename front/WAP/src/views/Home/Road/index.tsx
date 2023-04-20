import React, { useEffect, useState } from 'react'

import { motion, useAnimationControls } from 'framer-motion'

import { homeLang } from '@langs/index'

import langHook from '@hooks/langHook'

import './index.less'

import roadLineImg from '@img/home/road_map/road_line.png'

interface RoadProps {
  routerIndex: number
}

const initial = { y: '100%' }

const transition = {
  duration: 0.8,
  delay: 0.2,
  ease: 'linear'
}

export default ({ routerIndex }: RoadProps): JSX.Element => {

  const lang = langHook()

  const roadControls = useAnimationControls()
  const textControls = useAnimationControls()

  const [currentRoat, setCurrentRoat] = useState(0)

  useEffect(() => {
    if (routerIndex !== 1) return

    roadControls.set({ opacity: 0 })
    roadControls.start({ opacity: 1 })
    // text
    setCurrentRoat(0)
    textControls.set(initial)
    textControls.start({ y: 0 })

  }, [routerIndex])

  useEffect(() => {
    // text
    textControls.set(initial)
    textControls.start({ y: 0 })
  }, [currentRoat])

  const roadMap = [
    (
      <>
        <div className="h_r_m_b_s_title">{lang(homeLang[`road_setp_1_title`])}</div>
        <div className="h_r_m_b_s_text">{lang(homeLang[`road_setp_1_1`])}</div>
        <div className="h_r_m_b_s_text">{lang(homeLang[`road_setp_1_2`])}</div>
        <div className="h_r_m_b_s_text">{lang(homeLang[`road_setp_1_3`])}</div>
      </>
    ),
    (
      <>
        <div className="h_r_m_b_s_title">{lang(homeLang[`road_setp_2_title`])}</div>
        <div className="h_r_m_b_s_text">{lang(homeLang[`road_setp_2_1`])}</div>
        <div className="h_r_m_b_s_text">{lang(homeLang[`road_setp_2_2`])}</div>
        <div className="h_r_m_b_s_text">{lang(homeLang[`road_setp_2_3`])}</div>
        <div className="h_r_m_b_s_text">{lang(homeLang[`road_setp_2_4`])}</div>
      </>
    ),
    (
      <>
        <div className="h_r_m_b_s_title">{lang(homeLang[`road_setp_3_title`])}</div>
        <div className="h_r_m_b_s_text">{lang(homeLang[`road_setp_3_1`])}</div>
        <div className="h_r_m_b_s_text">{lang(homeLang[`road_setp_3_2`])}</div>
        <div className="h_r_m_b_s_text">{lang(homeLang[`road_setp_3_3`])}</div>
      </>
    ),
    (
      <>
        <div className="h_r_m_b_s_title">{lang(homeLang[`road_setp_4_title`])}</div>
        <div className="h_r_m_b_s_text">{lang(homeLang[`road_setp_4_1`])}</div>
        <div className="h_r_m_b_s_text">{lang(homeLang[`road_setp_4_2`])}</div>
        <div className="h_r_m_b_s_text">{lang(homeLang[`road_setp_4_3`])}</div>
      </>
    ),
  ]

  return (
    <motion.div
      className="home_road"
      initial={{ opacity: 0 }}
      animate={roadControls}
      transition={transition}
    >
      <div className="home_road_title">{lang(homeLang.road_title)}</div>
      <div className="home_road_sub_title">{lang(homeLang.road_sub_title)}</div>
      <div className="home_road_map">
        {
          roadMap.map((item, index) => {
            return (
              <div className="h_r_m_button" key={index}>
                <motion.div className="h_r_m_b_icon" onClick={() => setCurrentRoat(index)} whileTap={{ scale: 1.2 }}>
                  {currentRoat === index && (
                    <>
                      <div className="h_r_m_b_i_triangle"></div>
                      <img src={roadLineImg} alt="" className="h_r_m_b_i_line" />
                    </>
                  )}
                </motion.div>
                {currentRoat === index && (
                  <div className="h_r_m_b_setp">
                    <motion.div
                      initial={initial}
                      transformTemplate={({ y }) => `translateY(${y})`}
                      animate={textControls}
                      transition={transition}
                    >
                      {item}
                    </motion.div>
                  </div>
                )}
              </div>
            )
          })
        }
      </div>
    </motion.div>
  )
}
