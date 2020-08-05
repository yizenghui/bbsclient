<template>
	<view>
		<view class="cu-modal" :class="show_support_box?'show':''">
			<view class="cu-dialog">
				<view class="bg-img" :style="[{'background-image':'url('+support_poster+')','height':poster_height}]">
					<view class="cu-bar justify-end text-white">
						<view class="action" @tap="hideSupporModal">
							<text class="cuIcon-close "></text>
						</view>
					</view>
				</view>
				
				<view class="cu-bar bg-white" >
					
					<view class="action margin-0 flex-sub solid-left" @tap="gotosupport">了解一下</view>
					
					<!-- <text class="text-gray" @tap="gotosupport()">由预知鸟工作室提供技术支持</text> -->
				</view>
			</view>
		</view>
		
		<view style="show_support?'display:block':'display:none'" class="text-center  padding-xs">
			<!-- <navigator target="miniProgram" app-id="wx7543142ce921d8e3" extra-data="" path="pages/index/index?channel=bbs" class="text-gray">
				由预知鸟工作室提供技术支持
			</navigator> -->
			<text class="text-gray" @tap="showSupportModal">由预知鸟工作室提供技术支持</text>
		</view>
		
	</view>
	
</template>
<script>
import Vue from 'vue';
export default {
	data() {
	  return {
			show_support:this.show_support,
			show_support_box:false,
			poster_height:this.poster_height,
			support_poster:'',
		};
	},
	methods:{
		showSupportModal(){
			this.support_poster = Vue.prototype.support_poster
			this.show_support_box = true
		},
		hideSupporModal(){
			this.show_support_box = false
		},
		gotosupport(){
			uni.navigateToMiniProgram({
			  appId: 'wx7543142ce921d8e3',
			  path: 'pages/index/index?channel=bbs',
			  extraData: {
				  appid:Vue.prototype.appid,
				  uid:Vue.prototype.uid
			  },
			  success(res) {
			    // 打开成功
				// console.log('gotosupport',Vue.prototype.appid,Vue.prototype.uid)
			  }
			})
		}
	}
};
</script>

<style scoped>
	
</style>
