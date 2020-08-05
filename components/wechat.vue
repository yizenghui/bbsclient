<template>
	
	<view class="cu-modal" :class="showwechatbox?'show':''">
		<view class="cu-dialog">
			<view class="bg-img" :style="[{'background-image':'url('+wechat_guide_poster+')','height':poster_height}]">
				<view class="cu-bar justify-end text-white">
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close "></text>
					</view>
				</view>
			</view>
			<view class="cu-bar bg-white" >
				<view class="action text-gray"><text class="cuIcon-my"></text>{{user.linkman}}</view>
				<view class="action text-gray" @tap="copy(user.wechat)"><text class="cuIcon-weixin"></text>{{user.wechat}}</view>
			</view>
		</view>
	</view>
	
	
</template>
<script>
import Vue from 'vue';
import api from '../common/api.js'
export default {
	
  props: {
	showwechatbox: Boolean,
	user: Object,
  },
  data() {
    return { 
		wechat_guide_poster:this.wechat_guide_poster,
		poster_height:this.poster_height,
	};
  },
  watch:{
	
  },
  methods: {
	hideModal(){
		uni.$emit('hideuserwechat', {})
	},
	copy(text){
		uni.setClipboardData({
		    data: text,
		    success: function () {
				uni.$emit('hideuserwechat', {})
		    }
		});
	}
  }
};
</script>

<style scoped>
	
	
	.loginbtn{
		height:inherit;
		background-color: inherit;
	}
</style>
