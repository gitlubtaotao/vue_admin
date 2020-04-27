// 获取下拉数据
import request from "@/utils/request";
const getSelectApi = (url,scope) => {
  const data = { scope: scope }
  return request({
    url: url,
    method: 'post',
    data
  })
}
export default getSelectApi
