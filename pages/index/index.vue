<template>
	<view >
		
		<cu-custom :bgColor="bgcolor" :isBack="false">
			
			<block slot="left">
				<view class="flex">
					
					<view @tap="showSearch" class="cuIcon-search" :class="[showSearchBox?'text-gray':'text-white']"></view>
					<!-- <view @tap="showSearch" class="cuIcon-moneybag text-white margin-left"></view> -->
					
				</view>
			</block>
			
			<block slot="content" >
				<view @tap="gototop">
						
					<block v-if="categories.length>1"  v-for="(item,index) in categories" :key="index" >
						<block  @tap="toggleSort" v-if="item.id==cateid">
							{{item.name}} <text class="cuIcon-title"></text> {{orderby!='rank'?'最新':'热门'}}
						</block>
					</block>
					
					<block v-if="categories.length ==0">
						加载中
					</block>
				</view>
			</block>
			<block slot="right" style="z-index: 2;">
				<view class="action" style="pointer-events:inherit;">
					<view @tap="goto('/pages/user/index')" class="cuIcon-my text-white margin-left"></view>
					
					<!-- <view class="cu-load load-cuIcon" :class="isload?'loading':'over'"></view> -->
				</view>
			</block>
		</cu-custom>
		<notice v-if="notices.length>0" :notices="notices" />
		<scroll-view  v-if="categories.length>1" scroll-x class="bg-white nav solids-bottom">
			<view class="flex text-center">
				<view  v-for="(item,index) in categories" :key="index" class="cu-item flex-sub" :class="item.id==cateid?'text-'+topiccolor+' cur':''">
					<view  @tap="toggleSort" v-if="item.id==cateid">
						<text v-if="orderby!='rank'" class='cuIcon-new'></text>
						<text v-if="orderby=='rank'" class='cuIcon-rank'></text>
						{{item.name}}
					</view>
					<view  @tap="cate(item)" v-if="item.id!=cateid">
						{{item.name}}
					</view>
				</view>
			</view>
		</scroll-view>
		
		
		<login v-if="isguest" :isguest="isguest" />
		
		
		
		
		
		<form v-if="showSearchBox" @submit="formSearchSubmit">
			<view class="cu-bar search">
			  <view class='search-form round'>
				<text class="icon-search"></text>
				<input class="padding-lr" :value="searchInput" name="searchInput" type="text" placeholder="请输入关键字" ></input>
			  </view>
			  <view class='action'>
				<button class='cu-btn shadow-blur round' :class="[bgcolor]"  formType="submit">搜索</button>
			  </view>
			</view>
		</form>
		
		<view v-if="list.length>0" class="cu-card dynamic no-card margin-bottom-sm"  v-for="(item,index) in list" :index="index" :key="index" >
		
		
			<navigator class="cu-item shadow" :url="'/pages/post/info?id='+item.id">
				<view  v-if=" item.user_id " class="cu-list menu-avatar">
					<view class="cu-item">
						<view class="cu-avatar round lg" :style="[{'background-image':'url('+item.user.avatar+')'}]">
						</view>
						
						<view class="content flex-sub">
							<view>
							{{item.user.name}} 
							<text v-if="item.user.gender==1" class="text-blue cuIcon-male" ></text> 
							<text v-if="item.user.gender==2" class="text-pink cuIcon-female" ></text> 
							</view>
							<view class="text-gray text-sm flex justify-between">
								{{item.time}}
							</view>
						</view>
						<view v-if="item.user.wechat||item.user.mobile"  class="action text-xxl"  @tap.stop="" >
							<text v-if="item.user.wechat"  @tap="showuserwechat(item.user)" class="cuIcon-weixin text-green margin-right-xs"></text>
							<text v-if="item.user.mobile" @tap="showusercontact(item.user)" class="cuIcon-phone text-red margin-right-xs"></text>
						</view>
					</view>
				</view>
				
				<view  v-if="item.showall" class="text-content margin-top-sm"  style="white-space: pre-wrap; max-height: inherit;">
					{{item.isshowall?item.allbody:item.body}} <text v-if="!item.isshowall" class="text-gray"  @tap.stop="" @tap="showall(item)">展开</text>
				</view>
				
				<view  v-if="!item.showall" class="text-content margin-top-sm"  style="white-space: pre-wrap; max-height: inherit;">
					{{item.body}}
				</view>
				<view v-if="item.images.length>0" class="grid flex-sub padding-lr" :class="item.images.length>1?'col-3 grid-square':'col-1'" >
					<view  v-for="(image,index2) in item.images" 
					:index="index2" :key="index2" class="bg-img" :class="item.images.length==1?'only-img':''" 
					:style="[{'background-image':'url('+image+')'}]">
					<!--   @tap.stop=""  @tap="preview(image,item.images)" -->
					</view>
				</view>
				
				
				
				<view v-if="item.allow_interaction" class="flex text-center text-gray padding"  @tap.stop="">
					<view class="flex-sub" @tap="toggleLikePost(item)" >
						<text class=" margin-lr-xs" :class="[item.userliked?'cuIcon-appreciatefill':'cuIcon-appreciate']" ></text> {{item.liked}}
					</view>
					
					<view v-if="item.commented!=-1" class="flex-sub" @tap="goto('/pages/post/info?id='+item.id)">
						<text class="cuIcon-comment margin-lr-xs"></text> {{item.commented}}
					</view>
				</view>
				
				
			</navigator>
			
						
		</view>
		
		
		<view v-if="isload" class="padding text-center text-gray">正在加载</view>
			
		<view v-if="!isload && list.length == 0" class="padding text-center text-gray">暂无数据</view>
		
		<view v-if="!isload && list.length != 0&& nomore" class="padding text-center text-gray">没有更多了</view>
		
		<view @tap="goto('/pages/post/create?cateid='+cateid)"  v-if="authorize" class="ftadd round  text-xsl" style="height: 86rpx;width: 86rpx;">
			<text class="cuIcon-roundaddfill" :class="['text-'+topiccolor]" style="font-size: 86rpx; "></text>
		</view>
		
		<view v-if="isIpx" class="cu-tabbar-height"></view>
	</view>
</template>

<script>
	import Vue from 'vue'
	import api from '../../common/api.js'
	var  graceChecker = require("../../common/graceChecker.js");
	export default {
		data() {
			return {
				isload:0,
				nomore:0,
				cateid:0,
				showreportbox:0,
				reportid:0,
				reporttype:'post',
				searchInput:'',
				list:[],
				showSearchBox:false,
				page:1,
				limit:20,
				orderby:'id',
				show_author_card:this.show_author_card,
				grid_adid:this.grid_adid,
				banner_adid:this.banner_adid,
				video_adid:this.video_adid,
				screen_adid:this.screen_adid,
				fromid:this.fromid,
				isguest:this.isguest,
				authorize:this.authorize,
				categories:this.categories,
				bgcolor:this.bgcolor,
				topiccolor:this.topiccolor,
				last: 0,
				isIpx: this.isIpx
			}
		},
		onShow(){
			this.isguest = Vue.prototype.isguest
			this.authorize = Vue.prototype.authorize
		},
		async onLoad(p) {
			if(p.cateid){
				this.cateid = p.cateid
			}
			if( p.keyword != undefined && p.keyword!='' ){
				this.searchInput = p.keyword
				this.showSearchBox = true
			}
			this.isload = 1
			if(this.categories.length == 0){
				this.categories = await api.GetCategories()
				Vue.prototype.categories = this.categories
				this.notices = Vue.prototype.notices
			}
			this.list = await this.fetch(this.cateid,this.page,this.searchInput,this.orderby,this.limit)
			this.isguest = Vue.prototype.isguest
			this.authorize = Vue.prototype.authorize
			this.bgcolor = Vue.prototype.bgcolor
			this.topiccolor = Vue.prototype.topiccolor
			
			this.isload = 0
			this.asyncUserData() // 同步用户个人信息
		},
		
		watch:{
		      async orderby(v){ // 更改排序方式
				this.isload = 1
				this.list = []
				this.page = 1
				this.list = await this.fetch(this.cateid,this.page,this.searchInput,this.orderby,this.limit)
				this.isload = 0
				this.nomore = 0
		      },
			  async cateid(v){ // 更改排序方式
				this.isload = 1
				this.list = []
				this.page = 1
				this.list = await this.fetch(v,this.page,this.searchInput,this.orderby,this.limit)
				this.isload = 0
				this.nomore = 0
			  },
		},
		methods: {
			
			gototop(e){ // 双击返回顶部
				var c = e.timeStamp;//当前点击的时间
				var L = this.last;//上一次点击的时间
				if(L>0){
					if(c-L<500){ // 作双击
						uni.pageScrollTo({
							scrollTop: 0,
							duration: 300
						});
					}
				}
				this.last = c
			},
			asyncUserData(){ //尝试同步用户个人信息
				var that = this
				uni.getUserInfo({
				  provider: 'weixin',
				  success: function (infoRes) {
					api.AsyncUserData(infoRes)
					// uni.showToast({ title:'欢迎您', icon: "none" });
				  },fail: function (infoRes){
				  	that.isguest = true
				  }
				});
			},
			
			async formSearchSubmit(e) {
				
				this.searchInput  =  e.detail.value.searchInput
				// console.log(this.searchInput)
				this.isload = 1
				this.page = 1
				this.list = await this.fetch(this.cateid,this.page,this.searchInput,this.orderby,this.limit)
				this.isload = 0
			},
			
			showall(item){
				item.isshowall = 1
			},
			goto(url){
				if(url){
					uni.navigateTo({
						url:url
					})
				}
			},
			toggleSort(){
				this.orderby = this.orderby =='rank' ? 'id' : 'rank'
			},
			cate(item){
				this.cateid = item.id
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
			},
			doPostAction(e){
				var that = this
				var index = e.currentTarget.dataset.index;
				var item = that.list[index]
				let gendername = 'Ta'
				if(item.user.gender == 1){
					gendername = '他'
				}else if(item.user.gender == 2){
					gendername = '她'
				}
				var item_list = []
				if( item.user.id==that.uid ){
					item_list =  [  '修改', '删除' ]
				}
				
				uni.showActionSheet({
				    itemList: item_list, // 功能操作
				    success: function (res) {
						if(res.tapIndex==0){
							uni.navigateTo({
								url:"/pages/post/update?id="+item.id
							})
						}else if(res.tapIndex==1){
							uni.showModal({
								title:'提示',
								content:'确认要删除吗？',
								success(res2) {
									if( res2.confirm ){
										api.DeletePost(item.id)
										that.list.splice(index,1)
									}
								}
							})
						}
				    },
				    fail: function (res) {
				        console.log(res.errMsg);
				    }
				});
			},
			async fetch(cateid,page,searchInput,orderby,limit){
				return await api.GetPosts(cateid,page,searchInput,orderby,limit)
			}
		},
		
		onShareAppMessage(e) {
			let title = Vue.prototype.share_title?Vue.prototype.share_title:'BBS基础框架'
			let cover = Vue.prototype.share_cover?Vue.prototype.share_cover:''
			let page = '/pages/index/index?cateid='+this.cateid+'&fromid='+Vue.prototype.uid
			
			if(this.searchInput){
				page = '/pages/index/index?cateid='+this.cateid+'&keyword='+encodeURIComponent(this.searchInput)+'&fromid='+Vue.prototype.uid
			}
			
			return {
		        title: title,
		        path: page,
				imageUrl: cover
		    }
		},
		// 到底加载更多
		async onReachBottom(){
			if(this.nomore == 0){	
				this.isload = 1
				let list = await this.fetch(this.cateid,this.page+1,this.searchInput,this.orderby,this.limit)
				if(list && list.length>0){
					this.nomore = 0
					this.page ++
					this.list.push(...list)
				}else{
					this.nomore = 1
					uni.showToast({ title:'到底了', icon: "none" });
				}
				this.isload = 0
			}
		},
		// 下拉刷新
		async onPullDownRefresh() {	
			this.isload = 1
			this.list = []
			this.page = 1
			this.list = await this.fetch(this.cateid,this.page,this.searchInput,this.orderby,this.limit)
			this.isload = 0
			this.nomore = 0
			uni.stopPullDownRefresh()
		}
	}
</script>

<style>
.cu-list.menu-avatar>.cu-item:after, .cu-list.menu>.cu-item:after{
	border: none;
}
.flex .cu-btn{
	height:inherit;
	background-color: inherit;
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

.ftadd{
	position: fixed;
	bottom: 90px;
	right: 20px;
}

.cu-list.menu-avatar>.cu-item .content.flex-sub {
width: calc(100% - 96rpx - 160rpx - 20rpx);

}

</style>
