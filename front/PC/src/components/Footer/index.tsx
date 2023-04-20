import React, { SyntheticEvent } from 'react'

import { homeLang, footerLang } from '@langs/index'

import { motion } from 'framer-motion'

import langHook from '@hooks/langHook'

import './index.less'

import logo from '@img/footer/logo.png'
import community from '@img/footer/community.png'
import titter from '@img/footer/titter.png'
import mail from '@img/footer/mail.png'
import partner from '@img/footer/partner.png'

export default (): JSX.Element => {

  const lang = langHook()

  const handleLaunch = (event: SyntheticEvent<EventTarget>) => {
    event.preventDefault()
    alert(lang(homeLang.coming))
  }

  return (
    <div className="footer">
      <div className="footer_w">
        <div className="footer_w_content">
          <div className="f_w_c_logo">
            <img src={logo} alt="" />
            <motion.a
              href="https://www.notion.so/sourcedao/Source-Dao-Notion-Space-4fdd7046bc584bdeaab29b8ee805febd"
              className="f_w_c_paper"
              whileHover={{ scale: 1.2 }}
            >
              {lang(homeLang.paper_btn)}
            </motion.a>
          </div>
          <div className="f_w_c_contact">
            <div className="f_w_c_c_title">{lang(footerLang.contact)}</div>
            <div className="f_w_c_c_links">
              <a href="#" onClick={handleLaunch}>
                <motion.img src={community} whileHover={{ scale: 1.2 }} />
                <p>Join community</p>
              </a>
              <a href="https://twitter.com/dao_source">
                <motion.img src={titter} whileHover={{ scale: 1.2 }} />
                <p>Follow Titter</p>
              </a>
              <a href="https://mail.google.com/mail">
                <motion.img src={mail} whileHover={{ scale: 1.2 }} />
                <p>sourcedao.eth@imibao.net</p>
              </a>
            </div>
          </div>
          <div className="f_w_c_partner">
            <div className="f_w_c_p_title">{lang(footerLang.partner)}</div>
            <a href="https://twitter.com/BuidlerDAO">
              <motion.img src={partner} whileHover={{ scale: 1.2 }} />
              <p>BUIDLER DAO</p>
            </a>
          </div>
        </div>
        <div className="footer_w_copyright">@2022 Sourcedao.io</div>
      </div>
    </div>
  )
}
