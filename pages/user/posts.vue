<template>
	<view >
		<cu-custom :bgColor="bgcolor"  :isBack="true">
			<block slot="content">我的作品</block>
		</cu-custom>
		
		
		<view v-if="list.length>0" class="cu-card dynamic no-card margin-bottom-sm"  v-for="(item,index) in list" :index="index" :key="index" >
		
			<!-- #ifdef MP-WEIXIN -->
			<ad v-if="video_adid && video_adlt && index%video_adlt==video_adlm" :unit-id="video_adid" ad-type="video" ad-theme="white"></ad>
			<ad v-if="banner_adid && banner_adlt && index%banner_adlt==banner_adlm" :unit-id="banner_adid" ></ad>
			<ad v-if="grid_adid && grid_adlt && index%grid_adlt==grid_adlm" :unit-id="grid_adid" ad-type="grid" grid-opacity="0.8" grid-count="5"  ad-theme="white"></ad>
			<!-- #endif -->	
		
			<navigator class="cu-item shadow" :url="'/pages/post/info?id='+item.id">
				
				
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
					<view class="flex-sub">
						<block v-if="item.pageview>0" >
							<text class="margin-lr-xs cuIcon-attention"></text> {{item.pageview}}
						</block>
						<block v-if="item.liked>0" >
							<text class=" margin-lr-xs cuIcon-appreciate"></text> {{item.liked}}
						</block>
						<block v-if="item.download>0" >
							<text class=" margin-lr-xs cuIcon-down"></text> {{item.download}}
						</block>
						<block v-if="item.reward>0" >
							<text class=" margin-lr-xs cuIcon-refund"></text> {{item.reward}}
						</block>
						<block v-if="item.commented!=-1 && item.commented>0" >
							<text class="cuIcon-comment margin-lr-xs"></text> {{item.commented}}
						</block>
					</view>
					<view class="flex-sub" @tap="goto('/pages/post/update?id='+item.id)" :data-index="index">
						<text class="cuIcon-edit margin-lr-xs"></text> 修改
					</view>
					<view class="flex-sub" @tap="doPostDelectAction" :data-index="index">
						<text class="cuIcon-delete margin-lr-xs"></text> 删除
					</view>
				</view>
				
				
			</navigator>
			
			<view v-if="item.user.bio" class="bg-white padding text-gray solids-top">{{item.user.bio}}</view>
			
						
		</view>
		
		
		<view v-if="isload" class="padding text-center text-gray">正在加载</view>
			
		<view v-if="!isload && list.length == 0" class="padding text-center text-gray">暂无数据</view>
		
		<view v-if="!isload && list.length != 0&& nomore" class="padding text-center text-gray">没有更多了</view>
		
		<view v-if="show_service_btn" class="ftkf round text-xsl" style="height: 86rpx;width: 86rpx;">
			<button  open-type="contact" >
				<text class="cuIcon-message"  :class="['text-'+topiccolor]" style="font-size: 86rpx; "></text>
			</button>
		</view>
		<view @tap="goto('/pages/post/create?cateid='+cateid)"  v-if="show_add_btn" class="ftadd round  text-xsl" style="height: 86rpx;width: 86rpx;">
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
				show_add_btn:this.show_add_btn,
				show_service_btn:this.show_service_btn,
				notices:this.notices,
				bgcolor:this.bgcolor,
				topiccolor:this.topiccolor,
				video_adlt:this.video_adlt,
				video_adlm:this.video_adlm,
				grid_adlt:this.grid_adlt,
				grid_adlm:this.grid_adlm,
				banner_adlt:this.banner_adlt,
				banner_adlm:this.banner_adlm,
				screen_adlt:this.screen_adlt,
				screen_adlm:this.screen_adlm,
				interstitialAd:null,
				last: 0,
				isIpx: this.isIpx
			}
		},
		onShow(){
			this.notices = Vue.prototype.notices
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
			
			this.list = await this.fetch(this.cateid,this.page,this.searchInput,this.orderby,this.limit)
			this.isguest = Vue.prototype.isguest
			this.authorize = Vue.prototype.authorize
			this.show_add_btn = Vue.prototype.show_add_btn
			this.show_service_btn = Vue.prototype.show_service_btn
			this.bgcolor = Vue.prototype.bgcolor
			this.topiccolor = Vue.prototype.topiccolor
			this.grid_adid = Vue.prototype.grid_adid
			this.banner_adid = Vue.prototype.banner_adid
			this.video_adid = Vue.prototype.video_adid
			this.screen_adid = Vue.prototype.screen_adid
			this.show_author_card = Vue.prototype.show_author_card
			
			this.video_adlt = Vue.prototype.video_adlt
			this.video_adlm = Vue.prototype.video_adlm
			this.grid_adlt = Vue.prototype.grid_adlt
			this.grid_adlm = Vue.prototype.grid_adlm
			this.banner_adlt = Vue.prototype.banner_adlt
			this.banner_adlm = Vue.prototype.banner_adlm
			this.screen_adlt = Vue.prototype.screen_adlt
			this.screen_adlm = Vue.prototype.screen_adlm
			if(this.screen_adid != null){
				// 在页面中定义插屏广告
				let interstitialAd = null
				
				// 在页面onLoad回调事件中创建插屏广告实例
				if (wx.createInterstitialAd) {
				  interstitialAd = wx.createInterstitialAd({
					adUnitId: this.screen_adid
				  })
				  interstitialAd.onLoad(() => {})
				  interstitialAd.onError((err) => {})
				  interstitialAd.onClose(() => {})
				}
				this.interstitialAd = interstitialAd
			}
			this.isload = 0
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
			
			gototop(e){
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
			
			doPostDelectAction(e){
				var that = this
				var index = e.currentTarget.dataset.index;
				var item = that.list[index]
				
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
				var item_list =  [ '修改', '删除' ]
				
				
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
						}else if(res.tapIndex==5){
							// console.log('other action',id);
						}
				    },
				    fail: function (res) {
				        console.log(res.errMsg);
				    }
				});
			},
			loadscreen(){
				this.screen_adlm ++
				if(this.screen_adlm == this.screen_adlt){
					this.screen_adlm = 0
					// #ifdef MP-WEIXIN
					if (this.interstitialAd) {
					  this.interstitialAd.show().catch((err) => {
						console.error(err)
					  })
					}
					// #endif
				}
			},
			async fetch(cateid,page,searchInput,orderby,limit){
				this.loadscreen()
				return await api.GetPosts(cateid,page,searchInput,orderby,limit)
			}
		},
		
		onShareAppMessage(e) {
			let title = Vue.prototype.share_title?Vue.prototype.share_title:'免版权图'
			let cover = Vue.prototype.share_cover?Vue.prototype.share_cover:''
			let page = '/pages/index/index?fromid='+Vue.prototype.uid
			
			return {
		        title: title,
		        path: page,
				imageUrl: cover
		    }
		},
		
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
