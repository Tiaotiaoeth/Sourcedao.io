import React, { SyntheticEvent, useEffect } from 'react'

import { motion, useAnimationControls } from 'framer-motion'

import { homeLang } from '@langs/index'

import langHook from '@hooks/langHook'

import './index.less'


import lineImg from '@img/home/medium/line.png'
import communityImg from '@img/home/medium/community.png'
import titterImg from '@img/home/medium/titter.png'
import mailImg from '@img/home/medium/mail.png'
import partnerImg from '@img/home/medium/partner.png'
import logoImg from '@img/home/medium/logo.png'

interface MediumProps {
  routerIndex: number
}

const transition = {
  duration: 0.8,
  delay: 0.4,
  ease: 'linear'
}

export default ({ routerIndex }: MediumProps): JSX.Element => {

  const lang = langHook()

  const mediumControls = useAnimationControls()

  const handleLaunch = (event: SyntheticEvent<EventTarget>) => {
    event.preventDefault()
    alert(lang(homeLang.coming))
  }

  useEffect(() => {
    if (routerIndex !== 3) return

    mediumControls.set({ opacity: 0 })
    mediumControls.start({ opacity: 1 })
  }, [routerIndex])

  return (
    <motion.div
      className="home_medium"
      initial={{ opacity: 0 }}
      animate={mediumControls}
      transition={transition}
    >
      <div className="home_medium_title">
        {lang(homeLang.medium_title)}
      </div>
      <div className="home_medium_sub_title">
        {lang(homeLang.medium_contact)}
        <img src={lineImg} alt="" />
      </div>
      <div className="home_medium_button">
        <a href="#" onClick={handleLaunch}>
          <motion.img src={communityImg} whileTap={{ scale: 1.2 }} />
          <p>Join community</p>
        </a>
      </div>
      <div className="home_medium_button">
        <a href="https://twitter.com/dao_source" >
          <motion.img src={titterImg} whileTap={{ scale: 1.2 }} />
          <p>Follow Titter</p>
        </a>
      </div>
      <div className="home_medium_button">
        <a href="https://mail.google.com/mail" >
          <motion.img src={mailImg} whileTap={{ scale: 1.2 }} />
          <p>sourcedao.eth@imibao.net</p>
        </a>
      </div>
      <div className="home_medium_sub_title">
        {lang(homeLang.medium_partner)}
        <img src={lineImg} alt="" />
      </div>
      <div className="home_medium_button h_m_b_buidler">
        <a href="https://twitter.com/BuidlerDAO" >
          <motion.img src={partnerImg} whileTap={{ scale: 1.2 }} />
          <p>BUIDLER DAO</p>
        </a>
      </div>
      <div className="home_medium_logo">
        <img src={logoImg} alt="" />
      </div>
    </motion.div>
  )
}