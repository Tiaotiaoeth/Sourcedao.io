import React, { useState, useEffect } from 'react'

import { Skeleton } from '@mui/material'

// import { catImg } from '@utils/ipfs'

import { centerApi } from '@api/index'

interface CoverProps {
  picContent: string
  examId: string
  handleCLickSBT: (examId: string) => void
}

export default ({
  examId,
  picContent,
  handleCLickSBT,
}: CoverProps): JSX.Element => {
  const [cover, setCover] = useState('')

  useEffect(() => {
    // catImg(picContent).then((res) => {
    //   setCover(res)
    // })

    centerApi.imgBase64(picContent).then((res) => {
      setCover(res)
    })
  }, [])
  return (
    <>
      {cover ? (
        <img
          className="row_box_sbt"
          src={cover}
          onClick={() => handleCLickSBT(examId)}
        />
      ) : (
        <Skeleton variant="rounded" width={150} height={196} />
      )}
    </>
  )
}
