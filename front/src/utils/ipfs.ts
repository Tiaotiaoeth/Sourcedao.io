import { create, IPFSHTTPClient } from 'ipfs-http-client'

let _ipfs: IPFSHTTPClient | undefined = undefined

const createIpfs = async () => {
  if (_ipfs) return _ipfs
  return (_ipfs = await create({
    host: '15.152.36.175',
    port: 5001,
  }))
}

export const add = async (file: File): Promise<string> => {
  const ipfs = await createIpfs()

  try {
    const added = await ipfs.add(file)
    return added.cid.toString()
  } catch (error) {
    throw Error(error as string)
  }
}

export const cat = async <T>(cids: string[]): Promise<T[]> => {
  const ipfs = await createIpfs()
  const examJson: Promise<T>[] = []
  cids.forEach((cid) => {
    examJson.push(
      new Promise(async (resolve) => {
        for await (const chunks of ipfs.cat(cid)) {
          resolve(JSON.parse(utf8ArrayToStr(chunks)))
        }
      })
    )
  })

  return await Promise.all(examJson)
}

export const catImg = async (cid: string): Promise<string> => {
  const ipfs = await createIpfs()
  let _chunks: Uint8Array | undefined
  return new Promise(async (resolve) => {
    for await (const chunks of ipfs.cat(cid)) {
      if (!_chunks) {
        _chunks = chunks
      } else {
        _chunks = concatenate(_chunks, chunks)
      }
    }

    resolve(get_image(_chunks!))
  })
}

export const path = (hash: string): string =>
  `http://15.152.36.175:5001/ipfs/${hash}`

const utf8ArrayToStr = (array: Uint8Array): string => {
  const len = array.length
  let out, i, c, char2, char3

  out = ''

  i = 0
  while (i < len) {
    c = array[i++]
    switch (c >> 4) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        out += String.fromCharCode(c)
        break
      case 12:
      case 13:
        char2 = array[i++]
        out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f))
        break
      case 14:
        char2 = array[i++]
        char3 = array[i++]
        out += String.fromCharCode(
          ((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0)
        )
        break
    }
  }

  return out
}

const get_image = (array: Uint8Array): string => {
  const arrayBufferView = new Uint8Array(array)
  const blob = new Blob([arrayBufferView], { type: 'image/jpeg' })
  const urlCreator = window.URL || window.webkitURL
  const imageUrl = urlCreator.createObjectURL(blob)
  return imageUrl
}

const concatenate = (...arrays: Uint8Array[]) => {
  let totalLength = 0
  for (const arr of arrays) {
    totalLength += arr.length
  }
  const result = new Uint8Array(totalLength)
  let offset = 0
  for (const arr of arrays) {
    result.set(arr, offset)
    offset += arr.length
  }
  return result
}
