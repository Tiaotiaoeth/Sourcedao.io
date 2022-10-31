import React, { useEffect } from 'react'

import { useSwiper } from 'swiper/react'

import { motion, useAnimationControls } from 'framer-motion'

import { homeLang } from '@langs/index'

import langHook from '@hooks/langHook'

import './index.less'

import arrowImg from '@img/home/arrow.png'

import roadImg from '@img/home/road.png'

interface RoadProps {
  routerIndex: number
}

export default ({ routerIndex }: RoadProps): JSX.Element => {
  const swiper = useSwiper()

  const lang = langHook()

  const roadControls = useAnimationControls()
  const leftTextControls = useAnimationControls()
  const rightTextControls = useAnimationControls()

  useEffect(() => {
    switch (routerIndex) {
      case 0:
        roadControls.set({ y: 100, opacity: 0 })
        roadControls.start({ y: 0, opacity: 1 })
        break
      case 1:
        // left
        leftTextControls.set({ x: -370 })
        leftTextControls.start({ x: 0 })
        // right
        rightTextControls.set({ x: 500 })
        rightTextControls.start({ x: 0 })
        break

      default:
        break
    }
  }, [routerIndex])

  return (
    <div className="home_road">
      <motion.div
        className="home_road_content"
        initial={{ y: 100, opacity: 0 }}
        transformTemplate={({ y }) => `translateY(${y})`}
        animate={roadControls}
        transition={{
          duration: 0.6,
          delay: 0.4,
          ease: 'linear'
        }}
      >
        <div className="h_r_c_title">{lang(homeLang.road_title)}</div>
        <div className="h_r_c_sub_title">{lang(homeLang.road_sub_title)}</div>
        <div className="h_r_c_road">
          <div className="h_r_c_r_bg_left"></div>
          <div className="h_r_c_r_bg_right"></div>
          <img src={roadImg} alt="" />
          <div className="h_r_c_r_setp h_r_c_r_setp1">
            <motion.div
              initial={{ x: -370 }}
              transformTemplate={({ x }) => `translateX(${x})`}
              animate={leftTextControls}
              transition={{
                duration: 0.6,
                delay: 0.4,
                ease: 'linear'
              }}
            >
              <div className="h_r_c_r_s_title">{lang(homeLang.road_setp_1_title)}</div>
              <div className="h_r_c_r_s_text">{lang(homeLang.road_setp_1_1)}</div>
              <div className="h_r_c_r_s_text">{lang(homeLang.road_setp_1_2)}</div>
              <div className="h_r_c_r_s_text">{lang(homeLang.road_setp_1_3)}</div>
            </motion.div>
          </div>
          <div className="h_r_c_r_setp h_r_c_r_setp2">
            <motion.div
              initial={{ x: 500 }}
              transformTemplate={({ x }) => `translateX(${x})`}
              animate={rightTextControls}
              transition={{
                duration: 0.4,
                delay: 0.5,
                ease: 'linear'
              }}
            >
              <div className="h_r_c_r_s_title">{lang(homeLang.road_setp_2_title)}</div>
              <div className="h_r_c_r_s_text">{lang(homeLang.road_setp_2_1)}</div>
              <div className="h_r_c_r_s_text">{lang(homeLang.road_setp_2_2)}</div>
              <div className="h_r_c_r_s_text">{lang(homeLang.road_setp_2_3)}</div>
              <div className="h_r_c_r_s_text">{lang(homeLang.road_setp_2_3)}</div>
            </motion.div>
          </div>
          <div className="h_r_c_r_setp h_r_c_r_setp3">
            <motion.div
              initial={{ x: -370 }}
              transformTemplate={({ x }) => `translateX(${x})`}
              animate={leftTextControls}
              transition={{
                duration: 0.4,
                delay: 0.6,
                ease: 'linear'
              }}
            >
              <div className="h_r_c_r_s_title">{lang(homeLang.road_setp_3_title)}</div>
              <div className="h_r_c_r_s_text">{lang(homeLang.road_setp_3_1)}</div>
              <div className="h_r_c_r_s_text">{lang(homeLang.road_setp_3_2)}</div>
              <div className="h_r_c_r_s_text">{lang(homeLang.road_setp_3_3)}</div>
            </motion.div>
          </div>
          <div className="h_r_c_r_setp h_r_c_r_setp4">
            <motion.div
              initial={{ x: 500 }}
              transformTemplate={({ x }) => `translateX(${x})`}
              animate={rightTextControls}
              transition={{
                duration: 0.4,
                delay: 0.7,
                ease: 'linear'
              }}
            >
              <div className="h_r_c_r_s_title">{lang(homeLang.road_setp_4_title)}</div>
              <div className="h_r_c_r_s_text">{lang(homeLang.road_setp_4_1)}</div>
              <div className="h_r_c_r_s_text">{lang(homeLang.road_setp_4_2)}</div>
              <div className="h_r_c_r_s_text">{lang(homeLang.road_setp_4_3)}</div>
            </motion.div>
          </div>
        </div>
      </motion.div>
      <div className="home_road_arrow" onClick={() => swiper.slideNext()}>
        <img src={arrowImg} alt="" />
      </div>
    </div>
  )
}
