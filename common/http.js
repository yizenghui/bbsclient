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
                Vue.prototype.show_author_card = signData.data.show_author_card;
                Vue.prototype.uploadApi = signData.data.uploadApi; // 注:每个用户都由后台控制图片上传接口
				Vue.prototype.grid_adid = signData.data.grid_adid;
				Vue.prototype.banner_adid = signData.data.banner_adid;
				Vue.prototype.video_adid = signData.data.video_adid;
				Vue.prototype.screen_adid = signData.data.screen_adid;
				Vue.prototype.reward_adid = signData.data.reward_adid;
                Vue.prototype.authorize = signData.data.authorize;
                Vue.prototype.isguest = signData.data.isguest;
                Vue.prototype.lock_at = signData.data.lock_at;
				Vue.prototype.tips_login = signData.data.tips_login;
				Vue.prototype.login_poster = signData.data.login_poster;
				Vue.prototype.rule_name = signData.data.rule_name;
				Vue.prototype.rule_url = signData.data.rule_url;
				Vue.prototype.private_rule_name = signData.data.private_rule_name;
				Vue.prototype.private_rule_url = signData.data.private_rule_url;
				Vue.prototype.can_edit_contact = signData.data.can_edit_contact;
				Vue.prototype.contact_guide_poster = signData.data.contact_guide_poster;
				Vue.prototype.wechat_guide_poster = signData.data.wechat_guide_poster;
				Vue.prototype.support_poster = signData.data.support_poster;
				Vue.prototype.share_title = signData.data.share_title;
				Vue.prototype.share_cover = signData.data.share_cover;
				Vue.prototype.create_title = signData.data.create_title;
				Vue.prototype.show_add_btn = signData.data.show_add_btn;
				Vue.prototype.show_service_btn = signData.data.show_service_btn;
				Vue.prototype.show_more = signData.data.show_more;
				Vue.prototype.show_link = signData.data.show_link;
				Vue.prototype.show_secret = signData.data.show_secret;
				Vue.prototype.link_label = signData.data.link_label;
				Vue.prototype.secret_label = signData.data.secret_label;
				Vue.prototype.show_linkman = signData.data.show_linkman;
				Vue.prototype.show_wechat = signData.data.show_wechat;
				Vue.prototype.show_mobile = signData.data.show_mobile;
				Vue.prototype.show_bio = signData.data.show_bio;
				Vue.prototype.show_video = signData.data.show_video;
				Vue.prototype.video_label = signData.data.video_label;
				
				Vue.prototype.integral_rule = signData.data.integral_rule;
				Vue.prototype.guide_post_title = signData.data.guide_post_title;
				Vue.prototype.guide_post_subtitle = signData.data.guide_post_subtitle;
				Vue.prototype.guide_post_poster = signData.data.guide_post_poster;
				Vue.prototype.poster_height = signData.data.poster_height;
				Vue.prototype.can_cash = signData.data.can_cash;
				
				if(signData.data.topiccolor) Vue.prototype.topiccolor = signData.data.topiccolor;
				if(signData.data.bgcolor) Vue.prototype.bgcolor = signData.data.bgcolor;
								
								
				if(signData.data.video_adlt) Vue.prototype.video_adlt = signData.data.video_adlt;
				if(signData.data.video_adlm) Vue.prototype.video_adlm = signData.data.video_adlm;			
				if(signData.data.grid_adlt) Vue.prototype.grid_adlt = signData.data.grid_adlt;
				if(signData.data.grid_adlm) Vue.prototype.grid_adlm = signData.data.grid_adlm;
				if(signData.data.banner_adlt) Vue.prototype.banner_adlt = signData.data.banner_adlt;
				if(signData.data.banner_adlm) Vue.prototype.banner_adlm = signData.data.banner_adlm;
				if(signData.data.screen_adlt) Vue.prototype.screen_adlt = signData.data.screen_adlt;
				if(signData.data.screen_adlm) Vue.prototype.screen_adlm = signData.data.screen_adlm;
				
				
				Vue.prototype.reward_adid = signData.data.reward_adid;
				Vue.prototype.notices = signData.data.notices;
				
				uni.hideLoading();
				// todo 进黑屋子
				if(Vue.prototype.lock_at){
					uni.navigateTo({
						url:'/pages/lock/index'
					})
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
				// 	Vue.prototype.appid = signData2.data.appid;
				//     Vue.prototype.uid = signData2.data.uid;
				//     Vue.prototype.authorize = signData2.data.authorize;
				//     Vue.prototype.isguest = signData2.data.isguest;
				//     Vue.prototype.lock_at = signData2.data.lock_at;
				// 	Vue.prototype.grid_adid = signData2.data.grid_adid;
				// 	Vue.prototype.banner_adid = signData2.data.banner_adid;
				// 	Vue.prototype.video_adid = signData2.data.video_adid;
				// 	Vue.prototype.screen_adid = signData2.data.screen_adid;
				// 	Vue.prototype.reward_adid = signData2.data.reward_adid;
				// 	Vue.prototype.tips_login = signData2.data.tips_login;
				// 	Vue.prototype.login_poster = signData2.data.login_poster;
				// 	Vue.prototype.rule_name = signData2.data.rule_name;
				// 	Vue.prototype.rule_url = signData2.data.rule_url;
				// 	Vue.prototype.private_rule_name = signData2.data.private_rule_name;
				// 	Vue.prototype.private_rule_url = signData2.data.private_rule_url;
				// 	Vue.prototype.can_edit_contact = signData2.data.can_edit_contact;
				// 	Vue.prototype.contact_guide_poster = signData2.data.contact_guide_poster;
				// 	Vue.prototype.wechat_guide_poster = signData2.data.wechat_guide_poster;
				// 	Vue.prototype.support_poster = signData2.data.support_poster;
				// 	Vue.prototype.share_title = signData2.data.share_title;
				// 	Vue.prototype.share_cover = signData2.data.share_cover;
				// 	Vue.prototype.create_title = signData2.data.create_title;
				// 	Vue.prototype.show_add_btn = signData2.data.show_add_btn;
				// 	Vue.prototype.show_service_btn = signData2.data.show_service_btn;
				// 	Vue.prototype.show_more = signData2.data.show_more;
				// 	Vue.prototype.show_link = signData2.data.show_link;
				// 	Vue.prototype.show_secret = signData2.data.show_secret;
				// 	Vue.prototype.link_label = signData2.data.link_label;
				// 	Vue.prototype.secret_label = signData2.data.secret_label;
				// 	Vue.prototype.show_linkman = signData2.data.show_linkman;
				// 	Vue.prototype.show_wechat = signData2.data.show_wechat;
				// 	Vue.prototype.show_mobile = signData2.data.show_mobile;
				// 	Vue.prototype.show_bio = signData2.data.show_bio;
				// 	Vue.prototype.show_video = signData2.data.show_video;
				// 	Vue.prototype.video_label = signData2.data.video_label;
				// 	Vue.prototype.guide_post_title = signData2.data.guide_post_title;
				// 	Vue.prototype.guide_post_subtitle = signData2.data.guide_post_subtitle;
				// 	Vue.prototype.guide_post_poster = signData2.data.guide_post_poster;
				// 	Vue.prototype.poster_height = signData2.data.poster_height;
				
				// 	if(signData2.data.topiccolor) Vue.prototype.topiccolor = signData2.data.topiccolor;
				// 	if(signData2.data.bgcolor) Vue.prototype.bgcolor = signData2.data.bgcolor;
				
					
				// 	Vue.prototype.reward_adid = signData2.data.reward_adid;
				// 	Vue.prototype.notices = signData2.data.notices;
					
					uni.hideLoading();
					// todo 进黑屋子
					if(Vue.prototype.lock_at){
						uni.navigateTo({
							url:'/pages/lock/index'
						})
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
