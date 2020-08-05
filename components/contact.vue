<template>
	
	<view class="cu-modal" :class="showcontactbox?'show':''">
		<view class="cu-dialog">
			<view class="bg-img" :style="[{'background-image':'url('+contact_guide_poster+')','height':poster_height}]">
				<view class="cu-bar justify-end text-white">
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close "></text>
					</view>
				</view>
			</view>
			
			<view class="cu-bar bg-white" >
				<view class="action text-gray"><text class="cuIcon-my"></text>{{user.linkman}}</view>
				<view class="action text-gray" @tap="tel(user.mobile)"><text class="cuIcon-phone"></text>{{user.mobile}}</view>
			</view>
		</view>
	</view>
	
	
</template>
<script>
import Vue from 'vue';
import api from '../common/api.js'
export default {
	
  props: {
	showcontactbox: Boolean,
	user: Object,
  },
  data() {
    return { 
		poster_height:this.poster_height,
		contact_guide_poster:this.contact_guide_poster,
	};
  },
  watch:{
	
  },
  methods: {
	hideModal(){
		uni.$emit('hideusercontact', {})
	},
	tel(text){
		uni.makePhoneCall({
			phoneNumber: text
		});
		uni.$emit('hideusercontact', {})
	},
	copy(text){
		uni.setClipboardData({
		    data: text,
		    success: function () {
				uni.$emit('hideusercontact', {})
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
