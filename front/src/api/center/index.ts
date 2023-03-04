import Abstract from '@api/axios/index'
import { API_HOST } from '@api/config'
import type { ExamJson } from '@components/Exam/Take'

class Center extends Abstract {

  baseURL = API_HOST

  async exams(hashs: string[]) {
    
    const exams: Promise<ExamJson>[] = []
    hashs.forEach((hash) => {
      const url = `/ipfs/${hash}`
      exams.push(this.getReq<ExamJson>({url}))
    })

    return Promise.all(exams)
  }

}

// 单列模式返回对象
let instance
export default (() => {
  if (instance) return instance
  instance = new Center()
  return instance
})()