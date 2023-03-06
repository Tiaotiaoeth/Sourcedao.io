import Abstract from '@api/axios/index'
import { API_HOST, IPFS_HOST } from '@api/config'
import type { ExamJson } from '@components/Exam/Take'

class Center extends Abstract {

  baseURL = API_HOST

  async exams(hashs: string[]) {

    const exams: Promise<ExamJson>[] = []
    hashs.forEach((hash) => {
      const url = `/ipfs/${hash}`
      exams.push(this.getReq<ExamJson>({ url }))
    })

    return Promise.all(exams)
  }

  async uploadImage(content: string) {
    const url = `/storage/uploadImage`
    const baseURL = IPFS_HOST
    const data = { content }
    return this.postReq<string>({ url, baseURL, data })
  }
  // async uploadImage(file: File) {
  //   const url = `/api/v0/add`
  //   const baseURL = IPFS_HOST
  //   const data = { file }
  //   const headers = {'Content-Type': 'multipart/form-data;charset=UTF-8'}
  //   return this.postReq<string>({ url, baseURL, data, headers })
  // }

  async imgBase64(hash: string) {
    const url = `/ipfs/${hash}`
    const res = await this.getReq<BlobPart>({ url, headers: { responseType: 'blob' } })
    const blob = new Blob([res])
    const reader = new window.FileReader()
    reader.readAsDataURL(blob)

    return new Promise((resolve) => reader.onloadend = () => resolve(reader.result))
  }

}

// 单列模式返回对象
let instance
export default (() => {
  if (instance) return instance
  instance = new Center()
  return instance
})()