import React, { useEffect, SyntheticEvent } from 'react'

import { useSwiper } from 'swiper/react'

import { motion, useAnimationControls } from 'framer-motion'

import { homeLang } from '@langs/index'

import langHook from '@hooks/langHook'

import './index.less'

import arrowImg from '@img/home/arrow.png'
import source_daoImg from '@img/home/source_dao.png'

interface IndexProps {
  routerIndex: number
}

const transition = {
  duration: 0.8,
  delay: 0.4,
  ease: 'linear'
}

export default ({ routerIndex }: IndexProps): JSX.Element => {

  const swiper = useSwiper()

  const lang = langHook()

  const bgControls = useAnimationControls()
  const logoControls = useAnimationControls()
  const titleControls = useAnimationControls()
  const sbuTitleControls = useAnimationControls()
  const buttonControls = useAnimationControls()

  useEffect(() => {
    if (routerIndex !== 0) return
    // bg img
    bgControls.set({ opacity: 0 })
    bgControls.start({ opacity: 0.1 })
    // logo img
    logoControls.set({ opacity: 0, scale: 0 })
    logoControls.start({ opacity: 1, scale: 1 })
    // title
    titleControls.set({ y: 34 })
    titleControls.start({ y: 0 })
    // sub title
    sbuTitleControls.set({ y: -24 })
    sbuTitleControls.start({ y: 0 })
    // button
    buttonControls.set({ opacity: 0 })
    buttonControls.start({ opacity: 1 })

  }, [routerIndex])

  const handleLaunch = (event: SyntheticEvent<EventTarget>) => {
    event.preventDefault()
    alert(lang(homeLang.coming))
  }

  return (

    <div className="home_index">
      <div className="home_index_content">
        <motion.div
          className="h_i_c_bg"
          initial={{opacity: 0}}
          animate={bgControls}
          transition={{
            duration: 0,
            delay: 1.2,
            ease: 'linear'
          }}
        ></motion.div>
        <div className="h_i_c_logo"></div>
        <div className="h_i_c_text">
          <motion.img
            src={source_daoImg}
            initial={{ opacity: 0, scale: 0 }}
            animate={logoControls}
            transition={transition}
          />
          <h6>
            <motion.div
              initial={{ y: 34 }}
              transformTemplate={({ y }) => `translateY(${y})`}
              animate={titleControls}
              transition={transition}
            >
              {lang(homeLang.title)}
            </motion.div>
          </h6>
          <div>
            <motion.div
              initial={{ y: -24 }}
              transformTemplate={({ y }) => `translateY(${y})`}
              animate={sbuTitleControls}
              transition={transition}
            >
              {lang(homeLang.sub_title)}
            </motion.div>
          </div>
        </div>
        <motion.div
          className="h_i_c_buttons"
          initial={{ opacity: 0 }}
          animate={buttonControls}
          transition={transition}
        >
          <motion.a
            href="#"
            className="h_i_c_b_launch"
            whileHover={{ scale: 1.2 }}
            onClick={handleLaunch}
          >
            {lang(homeLang.launch_btn)}
          </motion.a>
          <motion.a
            href="https://www.notion.so/sourcedao/Source-Dao-Notion-Space-4fdd7046bc584bdeaab29b8ee805febd"
            className="h_i_c_b_paper"
            whileHover={{ scale: 1.2 }}
          >
            {lang(homeLang.paper_btn)}
          </motion.a>
        </motion.div>
      </div>
      <div className="home_index_arrow" onClick={() => swiper.slideNext()}>
        <img src={arrowImg} alt="" />
      </div>
    </div>
  )
}
