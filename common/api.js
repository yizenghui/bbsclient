
import Vue from 'vue';
import base from './base';

/**
 * 通用接口功能
 */
export default class comm extends base {
	
	
	/**
	 * 获得二级好友
	 * @param {Number} page
	 */
	static async GetTeamTwo(page) {
	  return await this.get(`${this.baseUrl}/teamtwo`, {page:page, version:Vue.prototype.version})
	}
	
	/**
	 * 获得一级好友
	 * @param {Number} page
	 */
	static async GetTeamOne(page) {
	  return await this.get(`${this.baseUrl}/teamone`, {page:page, version:Vue.prototype.version})
	}
	
	/**
	 * 获得所有好友
	 * @param {Number} page
	 */
	static async GetAllTeam(page) {
	  return await this.get(`${this.baseUrl}/allteam`, {page:page, version:Vue.prototype.version})
	}
	
	/**
	 * 获取作者作品被下载奖励
	 * @param {Number} page
	 */
	static async GetAuthorDown(page) {
	  return await this.get(`${this.baseUrl}/authordown`, {page:page, version:Vue.prototype.version})
	}
	
	/**
	 * 获取用户下载奖励
	 * @param {Number} page
	 */
	static async GetUserDown(page) {
	  return await this.get(`${this.baseUrl}/userdown`, {page:page, version:Vue.prototype.version})
	}
	
	/**
	 * 获取一级好友下载分成
	 * @param {Number} page
	 */
	static async GetFromDown(page) {
	  return await this.get(`${this.baseUrl}/fromdown`, {page:page, version:Vue.prototype.version})
	}
	
	/**
	 * 获取二级好友下载分成
	 * @param {Number} page
	 */
	static async GetAncestorDown(page) {
	  return await this.get(`${this.baseUrl}/ancestordown`, {page:page, version:Vue.prototype.version})
	}
	
	/**
	 * 获取所有下载分成奖励
	 * @param {Number} page
	 */
	static async GetAllDown(page) {
	  return await this.get(`${this.baseUrl}/alldown`, {page:page, version:Vue.prototype.version})
	}
	
	/**
	 * 获取提现订单
	 * @param {Number} page
	 */
	static async GetOrder(page) {
	  return await this.get(`${this.baseUrl}/orders`, {page:page, version:Vue.prototype.version})
	}
	
	/**
	 * 获取视频数据
	 */
	static async GetVideo(url) {
		return await this.get(`${this.baseUrl}/video`,{url:url,version:Vue.prototype.version});
	}
	
	/**
	 * 获取二维码
	 */
	static GetPostQrcode(postid,uid) {
		return `${this.baseUrl}/qrcode?postid=${postid}&uid=${uid}`;
	}
	
	
	
	/**
	 * 获取微海报
	 */
	static GetPostPoster(id,uid) {
		return `${this.baseUrl}/poster/${uid}/${id}`;
	}
	/**
	 * 获取所有分类
	 */
	static async GetCategories() {
		const url = `${this.baseUrl}/categories`;
		return await this.get(url,{version:Vue.prototype.version});
	}
	
	/**
	 * 获取post
	 */
	static async GetPostData(id) {
		const url = `${this.baseUrl}/posts/${id}/data`;
		return await this.get(url);
	}
	
	/**
	 * 修改数据
	 */
	static async UpdatePostData(data) {
		const url = `${this.baseUrl}/updateposts`;
		return await this.post(url,data);
	}
	
	/**
	 * 删除数据
	 */
	static async DeletePost(id) {
		const url = `${this.baseUrl}/posts/${id}/delete`;
		return await this.delete(url);
	}
	
	/**
	 * 获取最近更新内容
	 */
	static async GetPosts(cateid, page, keyword, orderby, limit) {
		const url = `${this.baseUrl}/posts`;
		return await this.get(url, {cateid:cateid, page:page,q:keyword, orderby:orderby, limit:limit,version:Vue.prototype.version});
	}
	
	/**
	 * 获取cash
	 */
	static async GetCashs() {
		return await this.get(`${this.baseUrl}/cashs`,{version:Vue.prototype.version});
	}
	
	/**
	 * 进行提现
	 */
	static async GoCash(cashid) {
		return await this.get(`${this.baseUrl}/gocash/${cashid}`, {version:Vue.prototype.version});
	}
	/**
	 * 获取post
	 */
	static async GetPostInfo(id) {
		const url = `${this.baseUrl}/posts/${id}`;
		return await this.get(url);
	}
	
	
	/**
	 * 删除数据
	 */
	static async DeletePost(id) {
		const url = `${this.baseUrl}/posts/${id}/delete`;
		return await this.delete(url);
	}
	/**
	 * 获取密令
	 */
	static async DownPost(id) {
		const url = `${this.baseUrl}/posts/${id}/down`;
		return await this.get(url);
	}
	
	/**
	 * 免费获取密令
	 */
	static async FreeDownPost(id) {
		const url = `${this.baseUrl}/posts/${id}/freedown`;
		return await this.get(url);
	}
	
	// 获得
	static async GetComments(id, page, orderby, limit) {
	  return await this.get(`${this.baseUrl}/posts/${id}/comments`, {page:page, orderby:orderby, limit:limit,version:Vue.prototype.version})
	}
		
	// 发布评论
	static async Comment(id, text, replyID) {
	  return await this.post(`${this.baseUrl}/posts/${id}/comments`, {reply_id: replyID, body: text})
	}
		
	/**
	 * 获取当前登录用户
	 */
	static async GetMe() {
		const url = `${this.baseUrl}/getme`;
		return await this.get(url,{version:Vue.prototype.version});
	}
		
	/**
	 * 关小黑屋
	 */
	static async LockUser(userid) {
		const url = `${this.baseUrl}/lockuser`;
		return await this.get(url,{userid:userid});
	}
	
	/**
	 * 举报评论
	 */
	static async ReplyComment(data) {
		const url = `${this.baseUrl}/reply/comment`;
		return await this.post(url,data);
	}
	/**
	 * 举报
	 */
	static async ReplyPost(data) {
		const url = `${this.baseUrl}/reply/post`;
		return await this.post(url,data);
	}
	/**
	 * 举报用户
	 */
	static async ReplyUser(data) {
		const url = `${this.baseUrl}/reply/user`;
		return await this.post(url,data);
	}
	/**
	 * 点赞帖子
	 */
	static async LikePost(postid) {
		const url = `${this.baseUrl}/posts/${postid}/like`;
		return await this.get(url);
	}
	
	/**
	 * 取消点赞帖子
	 */
	static async UnLikePost(postid) {
		const url = `${this.baseUrl}/posts/${postid}/unlike`;
		return await this.get(url);
	}
	
	/**
	 * 点赞评论
	 */
	static async LikeComment(postid) {
		const url = `${this.baseUrl}/comments/${postid}/like`;
		return await this.get(url);
	}
	
	/**
	 * 取消点赞评论
	 */
	static async UnLikeComment(postid) {
		const url = `${this.baseUrl}/comments/${postid}/unlike`;
		return await this.get(url);
	}
	
	/**
	 * 添加数据
	 */
	static async PostPostData(data) {
		const url = `${this.baseUrl}/posts`;
		return await this.post(url,data);
	}
	
	
	/**
	 * 举报
	 */
	static async PostReportData(data) {
		const url = `${this.baseUrl}/reports`;
		return await this.post(url,data);
	}
	
	
	/**
	* 同步用户数据
	*/
	static async AsyncUserData(user) {
		return this.post(`${this.baseUrl}/asyncuserdata`, {ed: user.encryptedData, iv: user.iv})
	}
}
