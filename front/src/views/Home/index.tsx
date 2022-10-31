import React, { useState, useCallback, useEffect } from 'react'

import SwiperCore, { Mousewheel, FreeMode, Scrollbar } from 'swiper'

import { Swiper, SwiperSlide } from 'swiper/react'

import Header from '@components/Header'
import Footer from '@components/Footer'

import Index from './Index/index'
import Road from './Road'
import Team from './Team'

import snowflake from '@utils/snowflake'

import 'swiper/css'

import 'swiper/css/free-mode'
import 'swiper/css/scrollbar'

import './index.less'

SwiperCore.use([Mousewheel, FreeMode, Scrollbar])

export default (): JSX.Element => {
  const [routerIndex, setRouterIndex] = useState(0)

  const [swiperO, setSwiperO] = useState<SwiperCore>()

  const [swiperI, setSwiperI] = useState<SwiperCore>()

  const handleSwiperChange = (index: number) => {
    setRouterIndex(index)
    swiperO?.mousewheel.enable()
  }

  const handleSubSwiperChange = (index: number) => {
    const num = index === 0 ? 2 : 3
    setRouterIndex(num)
  }

  const handleSubSwiperScroll = async (isBeginning: boolean) => {
    if (!isBeginning) return swiperO?.mousewheel.disable()

    setTimeout(() => {
      swiperO?.mousewheel.enable()
    }, 300)
  }

  const toSlide = useCallback(
    (index: number) => {
      switch (index) {
        case 2:
          swiperO?.slideTo(2)
          swiperI?.slideTo(0)
          break
        case 3:
          swiperO?.slideTo(2)
          swiperI?.slideTo(1)
          break

        default:
          swiperO?.slideTo(index)
          break
      }
    },
    [swiperO, swiperI]
  )

  useEffect(() => {
    snowflake()
  }, [])

  return (
    <div className="home">
      <Header routerIndex={routerIndex} toSlide={toSlide} />
      <Swiper
        direction="vertical"
        slidesPerView="auto"
        speed={800}
        spaceBetween={40}
        mousewheel
        simulateTouch={false}
        scrollbar={{
          el: '.swiper-scrollbar',
        }}
        onSlideChange={(swiper) => handleSwiperChange(swiper.activeIndex)}
        onSwiper={(swiper) => setSwiperO(swiper)}
      >
        <SwiperSlide>
          <Index routerIndex={routerIndex} />
        </SwiperSlide>
        <SwiperSlide>
          <Road routerIndex={routerIndex} />
        </SwiperSlide>
        <SwiperSlide>
          <Swiper
            direction="vertical"
            slidesPerView="auto"
            mousewheel
            simulateTouch={false}
            nested
            autoHeight
            freeMode
            scrollbar={{
              draggable: true,
              hide: true,
            }}
            onSlideChange={(swiper) => handleSubSwiperChange(swiper.activeIndex)
            }
            onSwiper={(swiper) => setSwiperI(swiper)}
            onScroll={swiper => handleSubSwiperScroll(swiper.isBeginning)}

          >
            <SwiperSlide>
              <Team routerIndex={routerIndex} />
            </SwiperSlide>
            <SwiperSlide>
              <Footer />
            </SwiperSlide>
          </Swiper>
        </SwiperSlide>
      </Swiper>
      <canvas></canvas>
    </div>
  )
}
