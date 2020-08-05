<template>
	<view v-if="shownotice">

		<view v-if="notices.length==1" class="cu-bar light bg-orange">
			<view class="action">
				<text class="cuIcon-notification text-orange"></text>
			</view>
			<view class="content text-left" style="position:inherit;width: 100%; pointer-events:inherit" vertical="true" autoplay="true" circular="true"
			 interval="3000">
				<view @tap="goto(notices[0].wxto)" class="text-gray text-cut text-left">{{notices[0].title}}</view>
			</view>
			<view class="action" @tap="hideNotice">
				<text class="cuIcon-close "></text>
			</view>
		</view>

		<view v-if="notices.length>1" class="cu-bar light bg-orange">
			<view class="action">
				<text class="cuIcon-notification text-orange"></text>
			</view>
			<swiper class="content text-left" style="position:inherit;width: 100%; pointer-events:inherit" vertical="true" autoplay="true" circular="true"
			 interval="3000">
				<swiper-item class="text-left" v-for="(item, index) in notices" @tap="goto(item.wxto)" :key="index">
					<view class="text-gray text-cut">{{item.title}}</view>
				</swiper-item>
			</swiper>
			<view class="action" @tap="hideNotice">
				<text class="cuIcon-close "></text>
			</view>
		</view>


	</view>
</template>
<script>
	import Vue from 'vue';
	export default {

		props: {
			notices: Array,
		},
		data() {
			return {
				shownotice: true,
			};
		},
		// watch:{
		// notices(n){
		// 	if(n){
		// 		this.shownotice = true
		// 	}
		// }
		// },
		methods: {
			goto(url) {
				if (url) uni.navigateTo({
					url: url
				})
			},
			hideNotice() {
				this.shownotice = false
				Vue.prototype.notices = []
			}
		},
		created() {

		}
	};
</script>

<style scoped>
	.loginbtn {
		height: inherit;
		background-color: inherit;
	}
</style>
