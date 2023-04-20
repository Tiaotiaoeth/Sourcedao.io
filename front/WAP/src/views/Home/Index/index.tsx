import React, { useEffect, SyntheticEvent } from 'react'

import { motion, useAnimationControls } from 'framer-motion'

import { homeLang } from '@langs/index'

import langHook from '@hooks/langHook'

import './index.less'


import source_daoImg from '@img/home/index/source_dao.png'

interface IndexProps {
  routerIndex: number
}

const initial = { opacity: 0 }

const transition = {
  duration: 0.8,
  delay: 0.4,
  ease: 'linear'
}

export default ({ routerIndex }: IndexProps): JSX.Element => {


  const lang = langHook()

  const logoControls = useAnimationControls()
  const titleControls = useAnimationControls()
  const sbuTitleControls = useAnimationControls()
  const buttonControls = useAnimationControls()

  useEffect(() => {
    if (routerIndex !== 0) return

    // logo img
    logoControls.set(initial)
    logoControls.start({ opacity: 1 })
    // title
    titleControls.set(initial)
    titleControls.start({ opacity: 1 })
    // sub title
    sbuTitleControls.set(initial)
    sbuTitleControls.start({ opacity: 1 })
    // button
    buttonControls.set(initial)
    buttonControls.start({ opacity: 1 })

  }, [routerIndex])

  const handleLaunch = (event: SyntheticEvent<EventTarget>) => {
    event.preventDefault()
    alert(lang(homeLang.coming))
  }

  return (

    <div className="home_index">
      <motion.img
        className="home_index_sd"
        src={source_daoImg}
        initial={initial}
        animate={logoControls}
        transition={transition}
      />
      <h6 className="home_index_title">
        <motion.div
          initial={initial}
          animate={titleControls}
          transition={transition}
        >
          {lang(homeLang.title)}
        </motion.div>
      </h6>
      <div className="home_index_sub_title">
        <motion.div
          initial={initial}
          animate={sbuTitleControls}
          transition={transition}
        >
          {lang(homeLang.sub_title)}
        </motion.div>
      </div>
      <motion.div
        className="home_index_buttons"
        initial={initial}
        animate={buttonControls}
        transition={transition}
      >
        <motion.a
          href="#"
          className="h_i_b_launch"
          onClick={handleLaunch}
          whileTap={{ scale: 1.2 }}
        >
          {lang(homeLang.launch_btn)}
        </motion.a>
        <motion.a
          href="https://www.notion.so/sourcedao/Source-Dao-Notion-Space-4fdd7046bc584bdeaab29b8ee805febd"
          className="h_i_b_paper"
          whileTap={{ scale: 1.2 }}
        >
          {lang(homeLang.paper_btn)}
        </motion.a>
      </motion.div>
    </div>
  )
}
