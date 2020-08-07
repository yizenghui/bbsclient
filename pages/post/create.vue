<template>
	<view>
		<cu-custom :bgColor="bgcolor" :isBack="true">
			<block  slot="backText">
				 {{fromid?'首页':'返回'}}
			</block>
			<block slot="content">{{create_title}}</block>
		</cu-custom>
		
		<notice v-if="notices.length>0" :notices="notices" />
		
		
		<login v-if="isguest" :isguest="isguest" />
		
		<block v-if="!isguest" >
				
			<scroll-view  v-if="authorize && categories.length>1" scroll-x class="bg-white nav">
					<view class="flex text-center">
						<block v-for="(item,index) in categories" :key="index">
							<view  @tap="cate(item)" v-if="item.id" class="cu-item flex-sub" :class="item.id==cateid?'text-'+topiccolor+' cur':''">
								{{item.name}}
							</view>
						</block>
					</view>
				</scroll-view>
				
				
				
			<form v-if="authorize" @submit="formSubmit">
				
				
				<input type="text" hidden=true name="cateid" :value="cateid" />
				<input type="text" hidden=true name="version" :value="version" />
				
				<view class="cu-form-group">
					<textarea style="height: 9.6em;display: block;" maxlength="-1" name="body" :value="body" placeholder="这一刻想说的..."></textarea>
				</view>
				
				<input type="text" hidden=true name="images" :value="images"  maxlength="-1" />
				
				<view class="cu-form-group">
					<view class="grid col-3 grid-square flex-sub">
						<view class="bg-img" v-for="(item,index) in images" :key="index" @tap="ViewImage" :data-url="images[index]">
						 <image :src="images[index]" mode="aspectFill"></image>
							<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
								<text class='cuIcon-close'></text>
							</view>
						</view>
						<view class="solids" @tap="ChooseImage" v-if="images.length<=8">
							<text class='cuIcon-cameraadd'></text>
						</view>
					</view>
				</view>
				
			
				<view v-if="(rule_name&&rule_url ) || (private_rule_name&&private_rule_url)" class="padding text-gray">
					发布代表您已同意《<text class="text-red" @tap="goto(rule_url)">{{rule_name}}</text>
					<block  v-if="rule_name&&rule_url && private_rule_name&&private_rule_url"> & </block><text v-if="private_rule_name&&private_rule_url" class="text-red" @tap="goto(private_rule_url)">{{private_rule_name}}</text>
					》
				</view>
				
				
				<view class="padding flex flex-direction">
					<button class="cu-btn lg" :class=[bgcolor] formType="submit">发布</button>
				</view>
			</form>
			
			<block v-if="!authorize" >
				<view class="text-center ">
					
					<view class="bg-img" :style="[{'background-image':'url('+guide_post_poster+')','height':poster_height}]">
					</view>
					<view class="text-xl margin-top">
						
						{{guide_post_title}}
					</view>
					<view class="text-xl margin-top text-gray">
						{{guide_post_subtitle}}
					</view>
					<button class="margin-top cu-btn bg-red" open-type="contact">
						<text class="cuIcon-service margin-lr-xs"></text>联系管理员
					</button>
				</view>
			</block>
		</block>
		
		<view v-if="show_service_btn" class="ftkf round text-xsl" style="height: 86rpx;width: 86rpx;">
			<button  open-type="contact" >
				<text class="cuIcon-message"  :class="['text-'+topiccolor]" style="font-size: 86rpx; "></text>
			</button>
		</view>
	</view>
</template>

<script>
	import api from '../../common/api.js';
	import Vue from 'vue';
	var  graceChecker = require("../../common/graceChecker.js");
	var _self;
	export default {
		data() {
			return {
				cateid:0,
				images: [],
				body: '',
				version:this.version,
				fromid:0,
				canpost:1,
				isguest:this.isguest,
				authorize:this.authorize,
				upload_api: this.uploadApi,
				categories:this.categories,
				bgcolor:this.bgcolor,
				topiccolor:this.topiccolor,
			};
		},
		methods: {
			
			updategueststatus(){
				this.isguest = Vue.prototype.isguest
			},
			goto(url){
				if(url)
				uni.navigateTo({
					url:url
				})
			},
			cate(item){
				this.cateid = item.id
			},
		
			ChooseImage() {
				
				uni.chooseImage({
					count: 9 - this.images.length, //默认9
					sizeType: ['original'], //可以指定是原图还是压缩图，默认二者都有 'original', 'compressed'
					sourceType: ['camera'], //从相册选择 'album','camera'
					success: (res) => {
						res.tempFilePaths.forEach((item,index)=>{
							uni.showLoading({title:"上传中"});
							var uploadTask2 = uni.uploadFile({
								url: _self.upload_api,
								filePath: item,
								fileType: 'image',
								name: 'file',
								dataType: 'json',
								success: function (uploadFileRes) {
									// 上传成功后返回服务器端保存的路径
									var jsondata = JSON.parse(uploadFileRes.data)
									if( jsondata.err ==0 ){
										_self.images.push(jsondata.file_path)
										uni.hideLoading();
									}else{
										uni.showToast({
											title:jsondata.msg,
											icon:'none'
										})
									}
									// console.log(jsondata)
								}
							 });
						})
						// if (this.images.length != 0) {
						// 	this.images = this.images.concat(res.tempFilePaths)
						// } else {
						// 	this.images = res.tempFilePaths
						// }
					}
				});
			},
			
			ViewImage(e) {
				uni.previewImage({
					urls: this.images,
					current: e.currentTarget.dataset.url
				});
			},
			
			DelImg(e) {
				this.images.splice(e.currentTarget.dataset.index, 1)
			},
			
			async formSubmit(e) {
				if(!this.canpost){
					uni.showToast({ title: '重复提交 ', icon: "none" });
					return;
				} 	
				var rule = [
					{name:"cateid", checkType : "int", checkRule:"0,", errorMsg:"请选择类别"},
					{name:"body", checkType : "notnull", errorMsg:"请填写正文内容"},
				];
				//进行表单检查
				var checkRes = graceChecker.check(e.detail.value, rule);
				if(!checkRes){
					uni.showToast({ title: graceChecker.error, icon: "none" });
					return 
				}
				this.canpost = 0 
				uni.showLoading({
					title:'提交中'
				});
				let data = await api.PostPostData(e.detail.value)
				uni.hideLoading()
				// cateid
				if(data.err){
					uni.showToast({ title: data.msg+":"+data.err_msg, icon: "none" });
				}
				uni.showToast({ title: data.msg, icon: "none"});
				setTimeout(function() {
					uni.navigateBack({  
						delta: 1  
					});
				}, 1500)
			},
		},
		
		async onLoad(p) {
			_self = this
			
			this.user = await api.GetMe()
			if(p.cateid){
				this.cateid = p.cateid
			}
			if(this.categories.length == 0){
				this.categories = await api.GetCategories()
				Vue.prototype.categories = this.categories
				this.isguest = Vue.prototype.isguest
				this.authorize = Vue.prototype.authorize
				this.bgcolor = Vue.prototype.bgcolor
				this.topiccolor = Vue.prototype.topiccolor
			}
			if( this.isguest ){ //回调登录
				uni.$once('updategueststatus',this.updategueststatus)
			}
		}
	}
</script>

<style>
	.yapp {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		overflow: auto;
	}
	.ypage{
		 min-height: 100%; display: flex; flex-direction: column;
	}
	.ypagebody{
		flex: auto;
	}
	.yfoot{
		text-align: center;
	}
	.cu-form-group .title {
		min-width: calc(4em + 15px);
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
</style>
