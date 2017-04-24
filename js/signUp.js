(function(){

	var regs = [
		/^1\d{10}$/,
		/^\d{6}$/,
		/^\S{6,}$/
	];

	var errorMsgs = [
		'请输入11位的手机号',
		'请输入6位数字验证码',
		'请输入您的登录密码'
	];

	var verifyForm = function(){
		var isValid = true;

		$('.signUp-input-box').each(function(i){
			var val = $(this).val();

			if( !regs[i].test(val) ){
				alert( errorMsgs[i] );
				isValid = false;
				return false;
			}

		});

		return isValid;
	}

	var timeCycle = function(elem){
		var TIME_MAX = 60;

		var currTime = TIME_MAX;

		elem.addClass('hasSend');
		var timer = setInterval(function(){
			currTime--;

			if( currTime < 0 ){
				elem.text( '重新获取验证码' );
				elem.removeClass('hasSend');
				clearInterval(timer);
			}else{
				elem.text( currTime + '秒后重新获取' );
			}
		}, 1000);
	};

	//测试 http://test.paykee.cn/ums/TransEntry
//生产 https://www.paykee.cn/ums/TransEntry
// 'http://192.168.2.188:8156/ass/TransEntry'
	// 接口信息
	var URL = 'http://test.paykee.cn/ass/TransEntry',
		merId = getUrlParam('merId'),
		referMp = getUrlParam('referMp');
		registWay = getUrlParam('registWay');
		qrCodeSeq = getUrlParam('qrCodeSeq');

	// 获取验证码
	$('.signUp-verify').on('click', function(){
		var self = $(this);

		// 验证手机
		var phone = $('.signUp-input-phone').val();
		if( !regs[0].test(phone) ){
			alert( errorMsgs[0] );
			return;
		}

		// if( (!merId) || (!referMp) ){
		// 	alert('URL参数错误！');
		// 	return;
		// }

		if( self.hasClass('hasSend') ) return;

		// 倒计时
		timeCycle(self);

		// 获取验证码
		post('checkMpAndCode', [
			{merId: merId},
			{usrMp: phone}
		]);
	});

	// 查看密码
	var signUpPass = $('.signUp-pass')[0];
	$('.signUp-eye').on('click', function(){
		var self = $(this);

		if( self.hasClass('active') ){
			self.removeClass('active');
			signUpPass.setAttribute('type', 'password');
		}else{
			self.addClass('active');
			signUpPass.setAttribute('type', 'text');
		}
		
	});

	//下拉--城市
	$('#citySel').on('click', function(){
		$('#cityList').show();
		$('.city-list').empty();
		$.each(city, function (k, p) { 
		    var option = "<li data="+ p.cityCode +"><a>" + p.cityName + "</a></li>";
		    $('.city-list').append(option);
		});
	});
	$('.city-list').on('click','li', function(){
		var val = $(this).html();
		var attr = $(this).attr('data');
		$('#citySel').html(val);
		$('#citySel').attr('data', attr);
		$('#plotSel').html('请选择小区');
		$('.shadow').hide();
	});
	//下拉--小区
	$('#plotSel').on('click', function(){
		$('#plotList').show();
		$('.plot-list').empty();
		var attr = $('#citySel').attr('data');
		$.each(community, function (k, p) { 
			if(p.cityCode == attr){
				var option = "<li data="+ p.communityCode +"><a>" + p.communityName + "</a></li>";
		    	$('.plot-list').append(option);
			}		    
		});
	});
	$('.plot-list').on('click','li', function(){
		var val = $(this).html();
		var attr = $(this).attr('data');
		$('#plotSel').html(val);
		$('#plotSel').attr('data', attr);
		$('.shadow').hide();
	});
	//关闭下拉
	$('.pop-close').on('click',function(){
		$('.shadow').hide();
	});

	// 提交表单
	$('.signUp-submit').on('click', function(){
		var city = $('#citySel').attr('data'),
				community = $('#plotSel').attr('data');
		console.log(city+','+community);
		var verifyResult = verifyForm();

		// if( (!merId) || (!referMp) ){
		// 	alert('URL参数错误！');
		// 	return;
		// }

		if(verifyResult){
			var phone = $('.signUp-input-phone').val(),
				authCode = $('.signUp-input-verify').val(),
				loginPwd = $('.signUp-pass').val(),
				city = $('#citySel').attr('data'),
				community = $('#plotSel').attr('data');

			post('usrRegist', [
				{merId: merId},
				{usrMp: phone},
				{loginPwd: md5Signature(loginPwd)},
				{authCode: authCode},
				{referMp: referMp},
				{appPlatform: '03'},
				{innerAccount: ''},
				{city: city},
				{community: community},
				{registWay: registWay},
				{qrCodeSeq: qrCodeSeq}
			], function(){
				location.href = 'signUpSuccess.html';
			});
		}
	});

	function getUrlParam(name) {
		if(name == 'merId' || name == 'referMp' || name == 'registWay' || name == 'qrCodeSeq'){
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
			var r = window.location.search.substr(1).match(reg);  //匹配目标参数
			if (r != null) return unescape(r[2]);
			return ''; //返回参数值
		}
		return null;
    }

	function md5UpperCase32(string){
		return md5(string).toUpperCase();
	}

	function md5Signature(){
		var md5key = 'UNISOaivA03028dH17Q3STeeUk3Z3lUnW95382hBFT1193iym1C0Ns13mn9P6Wbe';
		var string = '';

		for(var i = 0, l = arguments.length; i < l; i++){
			string += arguments[i] + '';
		}

		return md5UpperCase32(string + md5key);
	}

	function post(type, para, sFn, fFn){
		var data = {};
			reqData = {},
			signatureList = [];

		for(var i = 0, l = para.length; i < l; i++){
			for(key in para[i]){
				reqData[key] = para[i][key];
				if(key !== 'registWay'){
					signatureList.push(para[i][key]);
				}				
			}
		}
		//console.log(signatureList);

		reqData.chkValue = md5Signature.apply(null, signatureList);

		data.cmdId = type;
		data.reqData = JSON.stringify(reqData);

		$.ajax({
			url: URL,
			type: 'POST',
			dataType: 'json',
			data: data,
			complete: function(xhr, status){
				
			},
			success: function(result, status, xhr){
				console.log(result.transStat);
				if(result.transStat == 'S'){
					if(sFn) sFn();
				}else{
					alert(result.respMsg);
				}
				
			},
			error: function(xhr, status, error){
				alert('网络错误');
			}
		});
	}

})();