import Vue from 'vue'
import http from './http.js'
import config from './config.js'
export default class base {
    static baseUrl = config.base_api; // 主数据API接口，单机或单机做数据服务实现列表收录或者资源搜索、用户签名
    static cloudUrl = config.base_api; // 云API接口，方便后期用负载均衡等方式优化实现多机采集
    static get = http.get.bind(http);
    static put = http.put.bind(http);
    static post = http.post.bind(http);
    static delete = http.delete.bind(http);
}
