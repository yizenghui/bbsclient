<template>
		<view v-if="!isload">
			<cu-custom :bgColor="bgcolor"  :isBack="true">
				<block slot="content">用户主页</block>
			</cu-custom>
			
			<view class="flex padding-xl bg-white">
				<view>
					<view class=" cu-avatar round lg" style="font-size:0;overflow:hidden;">
						<open-data type="userAvatarUrl"></open-data>
					</view>
					<!-- <image class=" cu-avatar round lg" :src="user.avatar" ></image> -->
				</view>
				<view class="flex-sub padding-lr">
					<view class="text-bold text-xl">
						<!-- {{user.name}} -->
						<open-data type="userNickName"></open-data>
					</view>
					<view class="margin-top-sm text-xl text-gray">
						ID:{{me.id}} 
					</view>
				</view>
				<!-- <view class="text-red" @tap="goto('/pages/user/cash')">余额提现</view> -->
			</view>
			
			
			<view class="cu-list menu card-menu margin-top">
				
				<view class="cu-item arrow" @tap="goto('/pages/user/posts')">
					<view class="content">
						<text class="">我的作品</text>
					</view>
				</view>
			
			</view>
			
			<view class="contactbox padding text-center margin-top">
				<button class="cu-btn content text-gray" open-type="contact">
					<text class="">联系客服</text>
				</button>
			</view>
	</view>
</template>

<script>
	import Vue from 'vue'
	import api from '../../common/api.js';
	export default {
		
		data() {
			return {
				isload:1,
				lock_at:'',
				me:[],
				bgcolor:this.bgcolor,
				topiccolor:this.topiccolor,
				reward_adid:this.reward_adid,
				videoAd:null,
				rewardAdIsLoad:false,
				isIpx: this.isIpx
			}
		},
		async onShow() {
			// todo 计算时间 
		},
		
		async onLoad(p) {
			this.me = await api.GetMe()
			this.isload = 0
		},
		methods: {
			goto(url){
				uni.navigateTo({
					url:url
				})
			}
		},
		
		onShareAppMessage(e) {
			let title = '免版权图'
			let page = '/pages/index/index?fromid='+this.fromid
			let cover = ''
		    return {
		        title: title,
		        path: page,
				imageUrl: cover
		    }
		},
		
	}
</script>

<style>

	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}
.cu-list.menu-avatar>.cu-item:after, .cu-list.menu>.cu-item:after{
	/* border: none; */
}
.flex .cu-btn{
	height:inherit;
	background-color: inherit;
}

	
	.contactbox button.content {
		background-color: inherit;
	}
</style>
