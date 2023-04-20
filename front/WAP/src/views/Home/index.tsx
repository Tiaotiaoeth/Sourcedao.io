import React, { useState, useCallback, useEffect } from 'react'

import SwiperCore from 'swiper'

import { Swiper, SwiperSlide } from 'swiper/react'

import { LangContext } from './langContext'

import Header from '@components/Header'

import Index from './Index/index'
import Road from './Road'
import Team from './Team'
import Medium from './Medium'

import { LANG, SOURCE_LANG_LOCAL } from '@constants/lang'

import snowflake from '@utils/snowflake'

import 'swiper/css'

import './index.less'

import arrowImg from '@img/home/arrow.png'


export default (): JSX.Element => {
  const [lang, setLang] = useState<LANG>((((window.localStorage.getItem(SOURCE_LANG_LOCAL) as unknown) as LANG) || LANG.en_us))

  const [routerIndex, setRouterIndex] = useState(0)

  const [swiper, setSwiper] = useState<SwiperCore>()

  const toSlide = useCallback((index: number) => swiper?.slideTo(index), [swiper])

  useEffect(() => {
    snowflake()
  }, [])

  return (
    <div className="home">
      <LangContext.Provider value={{ lang, setLang }}>
        <Header routerIndex={routerIndex} toSlide={toSlide} />
        <Swiper
          direction="vertical"
          slidesPerView="auto"
          speed={800}
          onSlideChange={(swiper) => setRouterIndex(swiper.activeIndex)}
          onSwiper={(swiper) => setSwiper(swiper)}
        >
          <SwiperSlide>
            <Index routerIndex={routerIndex} />
          </SwiperSlide>
          <SwiperSlide>
            <Road routerIndex={routerIndex} />
          </SwiperSlide>
          <SwiperSlide>
            <Team routerIndex={routerIndex} />
          </SwiperSlide>
          <SwiperSlide>
            <Medium routerIndex={routerIndex} />
          </SwiperSlide>
        </Swiper>
      </LangContext.Provider>
      {
        routerIndex < 3 && <div className="home_arrow" onClick={() => swiper?.slideNext()}>
          <img src={arrowImg} alt="" />
        </div>
      }
      <canvas></canvas>
    </div>
  )
}
