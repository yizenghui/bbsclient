<template>
	<view v-if="!islogin">
		
		<view class="cu-bar">
			<view class="action">
				
				您好,欢迎加入我们!!!
			</view>
			<view class="action">
				<button class="cu-btn line-green shadow" open-type="getUserInfo"	@getuserinfo="getUserInfo">
					立即加入
				</button>
			</view>
		</view>
		
	</view>
</template>
<script>
import Vue from 'vue';
import api from '../common/api.js'
export default {
	
  props: {
	isguest: Number,
  },
  data() {
    return { 
		islogin:false,
		showloginbox:false,
	};
  },
  watch:{
	isguest(n){
		if(n){
			this.showloginbox = true
		}
	}
  },
  methods: {
	//获取用户数据
	getUserInfo(e) {
		if(!e.detail.userInfo || !e.detail.userInfo.nickName){
			this.showloginbox = false
			this.islogin = false
			Vue.prototype.isguest = 1
			uni.showToast({ title:'您已拒绝授权', icon: "none" });
			uni.$emit('updategueststatus', {})
		}else{
			this.showloginbox = false
			this.islogin = true
			Vue.prototype.isguest = 0
			api.AsyncUserData(e.detail)
			uni.showToast({ title:'欢迎您', icon: "none" });
			uni.$emit('updategueststatus', {})
		}
	},
	hideModal(){
		this.showloginbox = false
	},
	showModal(){
		this.showloginbox = true
	}
  },
  created() {
	  
  }
};
</script>

<style scoped>
	
	
	.loginbtn{
		height:inherit;
		background-color: inherit;
	}
</style>
