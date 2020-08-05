<template>
	<view>
		 <!-- @tap="totop" -->
		<view class="cu-custom" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar shadow  fixed" :style="style" :class="[bgImage!=''?'none-bg text-white bg-img':'',bgColor]">
				<view class="action" @tap="BackPage" v-if="isBack && !FormID" style="pointer-events:inherit">
					<text class="cuIcon-back"></text>
					<slot name="backText"></slot>
				</view>
				<view class="action" @tap="BackHome" v-if="isBack && FormID" style="pointer-events:inherit">
					<text class="cuIcon-back"></text>
					<slot name="backText"></slot>
				</view>
				<view class="action" v-if="!isBack" style="pointer-events:inherit">
					<slot name="left"></slot>
				</view>
				<view class="content" style="pointer-events:inherit" :style="[{top:StatusBar + 'px'}]">
					<slot name="content"></slot>
				</view>
				<slot name="right"></slot>
			</view>
		</view>
		<!-- #ifndef MP-TOUTIAO -->
		<!-- #endif -->
		
	</view>
</template>

<script>
	import Vue from 'vue'
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				last: 0,
				FormID : this.fromid
			};
		},
		name: 'cu-custom',
		computed: {
			style() {
				var StatusBar= this.StatusBar;
				var CustomBar= this.CustomBar;
				var bgImage = this.bgImage;
				var style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
				
				if (this.bgImage) {
					style = `${style}background-image:url(${bgImage});`;
				}
				return style
			}
		},
		props: {
			bgColor: {
				type: String,
				default: ''
			},
			isBack: {
				type: [Boolean, String],
				default: false
			},
			bgImage: {
				type: String,
				default: ''
			},
		},
		methods: {
			
			totop(e){
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
			BackPage() {
				uni.navigateBack({
					delta: 1
				});
			},
			BackHome(){
				uni.redirectTo({
					url:'/pages/index/index'
				});
			}
		},
		
	}
</script>

<style>

</style>
