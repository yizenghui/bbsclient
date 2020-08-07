<template name="home">
	<view>
		
	
		<cu-custom :bgColor="bgcolor" :isBack="true">
			<block  slot="backText">
				 {{fromid?'首页':'返回'}}
			</block>
		</cu-custom>
		<view class="cu-modal bottom-modal" :class="showShareStatus?'show':''" @tap="hideShare">
				<view class="cu-dialog">
					<view class="padding">
						<view class="flex">
							<button class="flex-sub content" open-type="share">
								<text class="cuIcon-messagefill"></text><view>发会话</view>
							</button>
							<button class="flex-sub content" @tap="showQrcode">
								<text class="cuIcon-qrcode"></text>
								<view>二维码</view>
							</button>
							<button class="flex-sub content" @tap="showPoster">
								<text class="cuIcon-pic"></text><view>微海报</view>
							</button>
						</view>
					</view>
				</view>
			</view>
			
		
		
		
		<block  v-if="post && post.id && post.user.name">
			
			<notice v-if="notices.length>0" :notices="notices" />
			
			<login v-if="isguest" :isguest="isguest" />
			
			
			<view class="cu-card dynamic no-card margin-bottom-sm"  >
				<view class="cu-item shadow">
					<view v-if=" post.user_id "  class="cu-list menu-avatar">
						<view class="cu-item">
							<view class="cu-avatar round lg" :style="[{'background-image':'url('+post.user.avatar+')'}]"></view>
							
							<view class="content flex-sub">
								<view>{{post.user.name}} 
									<text v-if="post.user.gender==1" class="text-blue cuIcon-male" ></text> 
									<text v-if="post.user.gender==2" class="text-pink cuIcon-female" ></text> 
								</view>
								<view class="text-gray text-sm flex justify-between">
									{{post.time}}
								</view>
							</view>
							
						</view>
					</view>
					
					<view class="text-content margin-top-sm" style="white-space: pre-wrap; max-height: inherit; ">
						{{post.allbody?post.allbody:post.body}}
					</view>
					
					<view v-if="post.images.length>0" class="grid flex-sub padding-lr" :class="post.images.length>1?'col-3 grid-square':'col-1'">
						<view  v-for="(image,index2) in post.images" @tap="preview(image,post.images)"
						:index="index2" :key="index2" class="bg-img" :class="post.images.length==1?'only-img':''" 
						:style="[{'background-image':'url('+image+')'}]">
						</view>
					</view>
					
					<view  v-if="post.allow_interaction"  class="flex text-center text-gray padding"  @tap.stop="">
						<view class="flex-sub" @tap="toggleLikePost(post)" >
							 <text class=" margin-lr-xs" :class="[post.userliked?'cuIcon-appreciatefill':'cuIcon-appreciate']" ></text> {{post.liked}}
						</view>
						<view v-if="post.commented!=-1" class="flex-sub">
							 <text class="cuIcon-comment margin-lr-xs"></text> {{post.commented}}
						</view>
						<view class="flex-sub" @tap="doPostAction(post)">
							 <text class="cuIcon-share margin-lr-xs"></text>
						</view>
						
					</view>
					
					
					
				</view>
				
			</view>
			
			
			
			<view  class="cu-modal" :class="[showInputBoxStatus?'show':'']" @tap='hideInputBox'>
			  <view class="cu-dialog padding"  @tap.stop>
				<view class="rpcm text-left text-gray">
					{{reply_content}}
				</view>
				<view class="cu-form-group text-left">
				  <textarea  v-if="showInputBoxStatus" fixed="true" maxlength="-1" @input="inputComment" :placeholder="inputPlaceholder"></textarea>
				</view>
				
				<view class="cu-bar margin-top">
				  <button v-if="commentInput" class='cu-btn bg-green shadow' @tap="postComment()" >评论</button>
				  <button v-if="!commentInput" class='cu-btn bg-gray shadow' disabled >评论</button>
				</view>
			  </view>
			</view>
			
			
			<block v-if="post.commented!=-1" >
				<view class="cu-bar bg-white solid-bottom">
				  <view class='action'  @tap="toggleSort">
					   <text v-if="orderby!='rank'" class='cuIcon-new text-green'></text>
					   <text v-if="orderby=='rank'" class='cuIcon-rank text-red'></text>
					   {{orderby=='rank'?'精彩评论':'最新评论'}}
				  </view>
				  <view class='action'>
					<button class='cu-btn shadow' :class="[bgcolor]" @tap="showInputBox('')" >写评论</button>
				  </view>
				</view>
				<view class="cu-card dynamic no-card" v-if="comments.length">
				  <view class="cu-item shadow">
				   
					<view class="cu-list menu menu-avatar comment solids-top">
						<block  v-for="(item,index) in comments" :key="index">
							<view class="cu-item">
							<view class="cu-avatar round" :style="[{'background-image':'url('+item.user.avatar+')'}]"></view>
							<view class='content'>
							  <view class='text-grey flex justify-between'>
								  <view> 
									{{item.user.name}}
									  <text v-if="item.user.gender==1" class="text-blue cuIcon-male" ></text> 
									  <text v-if="item.user.gender==2" class="text-pink cuIcon-female" ></text>
									  <text v-if="item.user.id==post.user.id" class="text-orange" >楼</text>
								  </view>
							  
							  </view>
							  <view class='text-gray text-content text-df'>
								{{item.body}}
							  </view>
							   <view class='bg-gray padding-sm radius margin-top-sm  text-sm' v-if="item.quote">
								<view>
								  <view>{{item.quote.user_name}}：</view>
								  <view>{{item.quote.body}}</view>
								</view>
							  </view>
							   <view class='margin-top-sm flex justify-between'>
								<view class="text-gray">
									
								<text  @tap="toggleLikeComment(item)"  :class="[item.userliked?'cuIcon-appreciatefill':'cuIcon-appreciate']"></text>
								<text @tap="toggleLikeComment(item)" class="margin-left-xs">{{item.liked}}</text>
								<text @tap="showInputBox(item)"  class="cuIcon-messagefill margin-left-sm"></text>
								<text @tap="showInputBox(item)"  class="margin-left-xs">{{item.commented}}</text> 
								
								</view>
								<view class='text-gray text-df'>
								{{item.time}}
								</view>
							  </view>
							</view> 
						
						</view>
						
					  </block>
					  
		
					</view>
				
				  </view>
				</view>
				
				<view class="cu-list menu text-center" v-if="isload!=1 && !comments.length">
				  <view class="cu-item">
					<view class="content">
					  <text class="text-grey">暂无评论</text>
					</view>
				  </view>
				</view>
				
				
				
				<!-- <view v-if="isload && comments.length && isload!=1" class="padding text-center text-gray">没有更多了</view> -->
				
			</block>
			
			
		</block>
		
	
		
		<view v-if="isIpx" class="cu-tabbar-height"></view>
	</view>
</template>

<script>
	import api from '../../common/api.js'
	import Vue from 'vue';
	var  graceChecker = require("../../common/graceChecker.js");
	export default {
		name: "basics",
		data() {
			return {
			  id:0,
			  limit:10,
			  isload:1,
			  cate:'post',
			  orderby:'rank',
			  StatusBar:0,
			  CustomBar:0,
			  Custom:0,
			  page:0,
			  lockid:0,
			  showlockbox:0,
			  showShareStatus:0,
			  comment_status:-1,
			  contactuser:[],
			  me:[],
			  post:[],
			  comments:[],
			  showInputBoxStatus:false,
			  commentInput:"",
			  reply_id:"",
			  reply_content:"",
			  inputPlaceholder:"",
			  isguest:this.isguest,
			  authorize:this.authorize,
			  upload_api: this.uploadApi,
			  categories:this.categories,
			  fromid:0,
			  isIpx:this.isIpx,
			  bgcolor:this.bgcolor,
			  topiccolor:this.topiccolor,
			};
		},
		watch:{
		      async orderby(v){ // 更改排序方式
		        this.isload = 1
		        this.comments = []
		        this.comments = await api.GetComments(this.id, 1, v, this.limit)
		        this.page = 2
		        this.isload = 0
		      }
		},

		methods: {
			
			hideShare(){
				this.showShareStatus = false
			},
			
			preview(image,images){
				uni.previewImage({
					current:image,
					urls:images
				})
			},
			
			toggleLikePost (item){
				if(item.userliked){
				  item.userliked = false
				  item.liked --
				  api.UnLikePost(item.id)
				}else{
				  item.userliked = true
				  item.liked ++
				  api.LikePost(item.id)
				}
				// console.log(item);
			},
			doPostAction(item){
				// console.log(item)
				
				var that = this
				let gendername = 'Ta'
				if(item.user.gender == 1){
					gendername = '他'
				}else if(item.user.gender == 2){
					gendername = '她'
				}
				
				var item_list = ['分享',]
				if(item.user.id==that.uid){
					item_list =  ['分享','修改', '删除' ]
				}
				
				uni.showActionSheet({
					itemList: item_list, // gendername+'的名片','关注',
					success: function (res) {
						if(res.tapIndex==0){
							that.showShareStatus = true
						}else if(res.tapIndex==1){
							uni.navigateTo({
								url:"/pages/post/update?id="+item.id
							})
						}else if(res.tapIndex==2){
							uni.showModal({
								title:'提示',
								content:'确认要删除吗？',
								success(res2) {
									if( res2.confirm ){
										api.DeletePost(item.id)
										uni.showModal({
											title:'提醒',
											content:'删除成功！',
											showCancel:false,
											success(res3) {
												uni.navigateTo({
													url:"/pages/index/index"
												})
											}
										})
										
									}
								}
							})
						}else{
							console.log('other action',item.id);
						}
					},
					fail: function (res) {
						console.log(res.errMsg);
					}
				});
			
			},
			async showInputBox(item){
				
				if(!item){
				  this.reply_id = 0
				  this.reply_content = '评论'+this.post.user.name+':"'+this.post.body+'"'
				}else{
				  this.reply_id = item.id
				  this.reply_content = '引用'+item.user.name+'"'+item.body+'"'
				}
				  // console.log('item',index,item)
				this.showInputBoxStatus = true 
				
				var inputPlaceholder = '在这里输入评论'
				var count = inputPlaceholder.length
				var that = this
				var timer1 = setInterval(function () {
				  if (count == 1) {
					clearInterval(timer1);
				  }
				  count--;
				  that.inputPlaceholder = inputPlaceholder.substring(0,inputPlaceholder.length - count)
				}, 200)
			},
			async hideInputBox(){
				this.inputPlaceholder = ''
				this.showInputBoxStatus = false
			},
			
			async showQrcode(){
				var qrcodeURL = api.GetPostQrcode(this.post.id,Vue.prototype.uid)
				// console.log('showQrcode',qrcodeURL)
				uni.previewImage({
				current: qrcodeURL, // 当前显示图片的http链接
				urls: [qrcodeURL] // 需要预览的图片http链接列表
				})
			},
			async showPoster(){
				var qrcodeURL = api.GetPostPoster(this.id,Vue.prototype.uid)
				console.log('showQrcode',qrcodeURL)
				uni.previewImage({
				current: qrcodeURL, // 当前显示图片的http链接
				urls: [qrcodeURL] // 需要预览的图片http链接列表
				})
			},
			async toggleSort(){
				this.orderby = this.orderby =='rank' ? 'id' : 'rank'
			},
			
			toggleLikeComment (item){
				if(item.userliked){
				  item.userliked = false
				  item.liked --
				  api.UnLikeComment(item.id)
				}else{
				  item.userliked = true
				  item.liked ++
				  api.LikeComment(item.id)
				}
				// console.log(item);
			},
			
			async postComment(){
				let comment = await api.Comment(this.id, this.commentInput, this.reply_id)
				if(comment.id){
				  this.comments = [comment, ...this.comments]
				  this.reply_id = 0
				  this.commentInput = ''
				  this.reply_content = ''
				  this.showInputBoxStatus = false
				  uni.showToast({ title: '发布评论成功！', icon:"none", duration: 1000 });
				}else{
				  uni.showToast({ title: '发布评论失败，请稍候再试或联系系统管理员！', icon:"none", duration: 2000 });
				}
			},
			inputComment(e) {
				this.commentInput = e.detail.value
			},
			goto(url){
				uni.navigateTo({
					url:url
				})
			}
		},
		
		
		computed: {
			
			style() {
				var StatusBar= this.StatusBar;
				var CustomBar= this.CustomBar;
				var style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
				return style
			}
		},
		
		
		onShareAppMessage(e) {
			let title = this.post.share_title?this.post.share_title: this.post.user.name+'的帖子'
			let page = '/pages/post/info?id='+this.post.id+'&fromid='+Vue.prototype.uid
			let cover = this.post.share_cover?this.post.share_cover:''
		    return {
		        title: title,
		        path: page,
				imageUrl: cover
		    }
		},
		async onPullDownRefresh() {
			this.isload = 1
			this.comments = []
			this.comments =  await api.GetComments(this.id, 1, this.cate,this.sort)
			this.page = 2;
			this.isload = 0
			uni.stopPullDownRefresh()
		},
	
		async onLoad(query) {
			this.isload = 1
			this.id = query.id // 先走它
			if( query.fromid ){
				this.fromid = query.fromid
			}
			
			if(query.scene){ //如果是分享来的，获取分享参数，第一个是资源ID，第二个是分享人id
				var scenedata = query.scene.split("%2C")
				if(scenedata[0]) this.id = scenedata[0]
				if(scenedata[1]) Vue.prototype.fromid = scenedata[1]
			}
			this.post = await api.GetPostInfo(this.id)
			
			
			if(this.post.commented != -1){
				this.comment_status = 1
				this.comments = await api.GetComments(this.id, 1, this.orderby, this.limit)
			}
			if(this.categories.length == 0){
				this.categories = await api.GetCategories()
				Vue.prototype.categories = this.categories
				this.isguest = Vue.prototype.isguest
				this.authorize = Vue.prototype.authorize
				this.bgcolor = Vue.prototype.bgcolor
				this.topiccolor = Vue.prototype.topiccolor
			}
			this.page = 2
			this.isload = 0
		},
		
		async onReachBottom() {
			if(this.post.commented == -1){
				return
			}
			this.isload = 1
			let comments = await api.GetComments(this.id, this.page, this.orderby,this.limit)
			if(comments.length){
				this.page ++
				this.comments = [...this.comments,...comments]
				this.isload = 0
			}else{
				this.isload = 2
				uni.showToast({ title:'到底了', icon: "none" });
			}
		},
	}
</script>

<style>
	.rpcm{
	  line-height:100rpx;
	  font-size:28rpx;
	  text-overflow:ellipsis;
	  white-space:nowrap;
	  overflow:hidden;
	  width:100%;
	}
	
	.cu-list.menu-avatar>.cu-item .content.flex-sub {
	width: calc(100% - 96rpx - 160rpx - 20rpx);
	
	}
	
	
	
	.cu-dialog uni-button:after{
		border: none;
		background-color: inherit;
	}
	.cu-dialog button.content {
		background-color: inherit;
	}
	.cu-dialog button.content::after{
		border: none;
	}
	
	.ftkf{
		position: fixed;
		bottom: 30px;
		right: 20px;
	}
	.ftkf button{
		margin-left:0;
		margin-right:0;
		padding-left:0;
		padding-right:0;
		height:inherit;
		line-height:inherit;
		background-color: inherit;
	}
	
	.ftkf button::after{
		border:none
	}
	
	
	
	.contactbox button.content {
		background-color: inherit;
	}
</style>
