import Vue from 'vue';
import config from './config.js'

// HTTP工具类
export default class http {
	// 封闭request请求
    static async request (method, url, data) {
        const param = {
            url: url,
            method: method,
            data: data
        };
		// 如果没有全局token
        if (!Vue.prototype.token) {
			uni.showLoading({
				title: '请求签名',
				mask: false
			});
            let [err,loginCode] = await uni.login({ provider: 'weixin'});
            const signpParam = {
                url: Vue.prototype.baseUrl + '/gettoken',
                method: 'GET',
				header: {
				'content-type': 'application/json'  // 
				},
                data: {code: loginCode.code, fromid:Vue.prototype.fromid,version:Vue.prototype.version}
            };
			const [err2,signData]= await uni.request(signpParam);
            if (this.isSuccess(signData)) {
				Vue.prototype.appid = signData.data.appid;
                Vue.prototype.token = signData.data.token;
                Vue.prototype.uid = signData.data.uid;
                Vue.prototype.authorize = signData.data.authorize;
                Vue.prototype.isguest = signData.data.isguest;
				Vue.prototype.share_title = signData.data.share_title;
				Vue.prototype.share_cover = signData.data.share_cover;
				if(signData.data.topiccolor) Vue.prototype.topiccolor = signData.data.topiccolor;
				if(signData.data.bgcolor) Vue.prototype.bgcolor = signData.data.bgcolor;
			
				uni.hideLoading();
				// todo 进黑屋子
				if(Vue.prototype.lock_at){
					
					uni.showModal( {
						title: '封号提醒',
						content: '您已经被封号，无法使用！',
						showCancel:false
					} )
					return false
				}
            } else {
                throw this.requestException(signData);
				// todo 提醒出错
            }
        }
		param.header = {'Authorization': 'Bearer '+ Vue.prototype.token, 'Accept':'application/json', 'Fromid':Vue.prototype.fromid}
		
        
		
        const [err3,res] = await uni.request(param);

        // console.log(res);
        if (this.isSuccess(res)) {
            return res.data;
        } else {
			if(res.data.message == "Token has expired" || res.data.message == 'Token Signature could not be verified.'){ // token 过期了
				Vue.prototype.token = ""
				uni.showLoading({
					title: '请求签名',
					mask: false
				});
				let [err2,loginCode2] = await uni.login({ provider: 'weixin'});
				const signpParam2 = {
				    url: Vue.prototype.baseUrl + '/gettoken',
				    method: 'GET',
					header: {
					'content-type': 'application/json'  // 
					},
				    data: {code: loginCode2.code, fromid:Vue.prototype.fromid,version:Vue.prototype.version}
				};
				const [err22,signData2]= await uni.request(signpParam2);
				if (this.isSuccess(signData2)) {
				    Vue.prototype.token = signData2.data.token;
					
					uni.hideLoading();
					// todo 进黑屋子
					if(Vue.prototype.lock_at){
						uni.showModal( {
							title: '封号提醒',
							content: '您已经被封号，无法使用！',
							showCancel:false
						} )
						return false
					}
				} else {
				    throw this.requestException(signData);
					// todo 提醒出错
				}
				param.header = {'Authorization': 'Bearer '+ Vue.prototype.token, 'Accept':'application/json', 'Fromid':Vue.prototype.fromid}
				
				
				
				const [err32,res2] = await uni.request(param);
				
				// console.log(res);
				if (this.isSuccess(res2)) {
				    return res2.data;
				}
			}
			// todo 检查是否 401 如果是,重新发起请求
			uni.showToast({ title: res.data.message, icon: "none" });
            throw this.requestException(res);
        }
    }

  /**
   * 判断请求是否成功
   */
    static isSuccess (res) {
        const wxCode = res.statusCode;
    // 微信请求错误
        if (wxCode !== 200) {
            return false;
        }
        return true;
    }

  /**
   * 异常
   */
    static requestException (res) {
        const error = {};
        error.statusCode = res.statusCode;
        const wxData = res.data;
        const serverData = wxData.data;
        if (serverData) {
            error.serverCode = wxData.code;
            error.message = serverData.message;
            error.serverData = serverData;
        }
        return error;
    }

    static get (url, data) {
        return this.request('GET', url, data);
    }

    static put (url, data) {
        return this.request('PUT', url, data);
    }

    static post (url, data) {
        return this.request('POST', url, data);
    }

    static patch (url, data) {
        return this.request('PATCH', url, data);
    }

    static delete (url, data) {
        return this.request('DELETE', url, data);
    }
}
