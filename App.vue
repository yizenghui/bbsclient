<script>
	import Vue from 'vue'
	import config from './common/config.js'
	export default {
		onLaunch: function(p) {
			uni.getSystemInfo({
				success: function(e) {
					// #ifndef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
					};
					// #endif

					// #ifdef MP-WEIXIN
					Vue.prototype.StatusBar = e.statusBarHeight;
					let custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					// #endif		

					
					if (e.model.search('iPhone X') != -1){
						Vue.prototype.isIpx = true;
					}else{
						Vue.prototype.isIpx = false;
					}
				}
			})

			// 主题色 
			Vue.prototype.topiccolor = config.topiccolor;
			Vue.prototype.bgcolor = config.bgcolor;

			Vue.prototype.scene = p.scene;
			Vue.prototype.fromid = 0;
			Vue.prototype.authorize = 0; //授权发帖子
			if(p.query.fromid) Vue.prototype.fromid = p.query.fromid
			
			Vue.prototype.uid = 0;
			// Vue.prototype.token = uni.getStorageSync('token');
			Vue.prototype.appid = '';
			Vue.prototype.grid_adid = '';
			Vue.prototype.banner_adid = '';
			Vue.prototype.video_adid = '';
			Vue.prototype.screen_adid = '';
			Vue.prototype.reward_adid = '';
			Vue.prototype.token = '';
			Vue.prototype.isguest = 0; //标志是游客 默认不是（如果是游客，控制展示登录框）
			Vue.prototype.lock_at = 0;
			Vue.prototype.baseUrl = config.base_api
			Vue.prototype.version = config.version
			Vue.prototype.uploadApi = config.upload_api
			Vue.prototype.categories = []
			Vue.prototype.tips_login = '请登录';
			Vue.prototype.login_poster = '';
			Vue.prototype.rule_name = '';
			Vue.prototype.rule_url = '';
			Vue.prototype.private_rule_name = '';
			Vue.prototype.private_rule_url = '';
			Vue.prototype.can_edit_contact = '';
			Vue.prototype.contact_guide_poster = '';
			Vue.prototype.wechat_guide_poster = '';
			Vue.prototype.support_poster = '';
			Vue.prototype.create_title = '发布';
			Vue.prototype.share_title = ''; //强制分享标题
			Vue.prototype.share_cover = ''; //强制分享封面图
			
			Vue.prototype.show_author_card = 0; //显示作者卡片
			Vue.prototype.show_add_btn = 0; //展示发布按钮
			Vue.prototype.show_service_btn = 0; //展示客服按钮
			Vue.prototype.show_more = 0;
			Vue.prototype.show_link = 0;
			Vue.prototype.show_secret = 0;
			Vue.prototype.show_linkman = 0;
			Vue.prototype.show_wechat = 0;
			Vue.prototype.show_mobile = 0;
			Vue.prototype.show_bio = 0;
			Vue.prototype.show_video = 0;
			Vue.prototype.integral_rule = '好友注册、下载图片时，你会获得积分。';
			Vue.prototype.link_label = '外链';
			Vue.prototype.secret_label = '密令';
			Vue.prototype.video_label = '视频';
			Vue.prototype.guide_post_title = '';
			Vue.prototype.guide_post_subtitle = '';
			Vue.prototype.guide_post_poster = '';
			Vue.prototype.poster_height = ''; // 控制所有海报高度
			
			Vue.prototype.show_support = true; //支持技术支持
			
			Vue.prototype.video_adlt = 10;
			Vue.prototype.video_adlm = 2;
			Vue.prototype.grid_adlt = 10;
			Vue.prototype.grid_adlm = 4;
			Vue.prototype.banner_adlt = 10;
			Vue.prototype.banner_adlm = 6;
			Vue.prototype.screen_adlt = 10;
			Vue.prototype.screen_adlm = 7;
			Vue.prototype.can_cash = 0;
			
			Vue.prototype.notices = [];
			
		}

	}
</script>

<style>
	@import "colorui/main.css";
	@import "colorui/icon.css";

	.nav-list {
		display: flex;
		flex-wrap: wrap;
		padding: 0px 40upx 0px;
		justify-content: space-between;
	}

	.nav-li {
		padding: 30upx;
		border-radius: 12upx;
		width: 45%;
		margin: 0 2.5% 40upx;
		background-image: url(https://cdn.nlark.com/yuque/0/2019/png/280374/1552996358352-assets/web-upload/cc3b1807-c684-4b83-8f80-80e5b8a6b975.png);
		background-size: cover;
		background-position: center;
		position: relative;
		z-index: 1;
	}

	.nav-li::after {
		content: "";
		position: absolute;
		z-index: -1;
		background-color: inherit;
		width: 100%;
		height: 100%;
		left: 0;
		bottom: -10%;
		border-radius: 10upx;
		opacity: 0.2;
		transform: scale(0.9, 0.9);
	}

	.nav-li.cur {
		color: #fff;
		background: rgb(94, 185, 94);
		box-shadow: 4upx 4upx 6upx rgba(94, 185, 94, 0.4);
	}

	.nav-title {
		font-size: 32upx;
		font-weight: 300;
	}

	.nav-title::first-letter {
		font-size: 40upx;
		margin-right: 4upx;
	}

	.nav-name {
		font-size: 28upx;
		text-transform: Capitalize;
		margin-top: 20upx;
		position: relative;
	}

	.nav-name::before {
		content: "";
		position: absolute;
		display: block;
		width: 40upx;
		height: 6upx;
		background: #fff;
		bottom: 0;
		right: 0;
		opacity: 0.5;
	}

	.nav-name::after {
		content: "";
		position: absolute;
		display: block;
		width: 100upx;
		height: 1px;
		background: #fff;
		bottom: 0;
		right: 40upx;
		opacity: 0.3;
	}

	.nav-name::first-letter {
		font-weight: bold;
		font-size: 36upx;
		margin-right: 1px;
	}

	.nav-li text {
		position: absolute;
		right: 30upx;
		top: 30upx;
		font-size: 52upx;
		width: 60upx;
		height: 60upx;
		text-align: center;
		line-height: 60upx;
	}

	.text-light {
		font-weight: 300;
	}

	@keyframes show {
		0% {
			transform: translateY(-50px);
		}

		60% {
			transform: translateY(40upx);
		}

		100% {
			transform: translateY(0px);
		}
	}

	@-webkit-keyframes show {
		0% {
			transform: translateY(-50px);
		}

		60% {
			transform: translateY(40upx);
		}

		100% {
			transform: translateY(0px);
		}
	}
</style>
