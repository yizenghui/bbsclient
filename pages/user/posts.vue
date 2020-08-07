<template>
	<view >
		<cu-custom :bgColor="bgcolor"  :isBack="true">
			<block slot="content">我的作品</block>
		</cu-custom>
		
		
		<view v-if="list.length>0" class="cu-card dynamic no-card margin-bottom-sm"  v-for="(item,index) in list" :index="index" :key="index" >
		
		
		
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
			
						
		</view>
		
		
		<view v-if="isload" class="padding text-center text-gray">正在加载</view>
			
		<view v-if="!isload && list.length == 0" class="padding text-center text-gray">暂无数据</view>
		
		<view v-if="!isload && list.length != 0&& nomore" class="padding text-center text-gray">没有更多了</view>
		
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
				fromid:this.fromid,
				isguest:this.isguest,
				authorize:this.authorize,
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
			this.isload = 1
			this.list = await this.fetch(this.page,this.limit)
			this.isguest = Vue.prototype.isguest
			this.authorize = Vue.prototype.authorize
			this.bgcolor = Vue.prototype.bgcolor
			this.topiccolor = Vue.prototype.topiccolor
			this.isload = 0
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
			async fetch(page,limit){
				return await api.GetUserPosts(page,limit)
			}
		},
		
		onShareAppMessage(e) {
			let title = Vue.prototype.share_title?Vue.prototype.share_title:'BBS BASE'
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
				let list = await this.fetch(this.page+1,this.limit)
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
			this.list = await this.fetch(this.page,this.limit)
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
