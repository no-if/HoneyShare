$(function(){
	var Request = new Object();
	Request = GetRequest();
	var code = Request["code"];

	var resData = {   //注册参数

	};

    if(code){
        resData.inviteCode = code;
        resData.arrangement = 1;
        $('.reg_user_referee,.reg_set_type').hide();
    }

	/*******注册********/

	// 发送手机验证码
	$('.reg_code .get').click(function(){
		sendCode();
	})

	function sendCode(){
		if($('.reg_user_phone input').val() == ''){
			errorMsg('请输入手机号');
		}else{
			time();
			deltaGoAjax('user/sendSMS',{phone:$(".reg_user_phone .zone_list").find("option:selected").text()+$('.reg_user_phone input').val()},beforeRegister);
		}
	}

	var timerId;
	function time(){
		var time = 60;
		$(".get").off('click');
		timerId = setInterval(function(){
			$(".get").text(time + "秒");
			time --;
			if(time == -1){
				clearInterval(timerId);
				$(".get").text('获取');
				$('.get').click(function(){
					sendCode();
				})
			};
		},1000);
	}
	function beforeRegister(data){
		errorMsg('验证码发送成功');
		$('.next_btn').click(function(){
			if($('.reg_user_name input').val() == '' || //用户名
			$('.reg_user_phone input').val() == '' || //手机号
			$('.reg_password input').val() == '' || //密码
			$('.reg_ensure_password input').val() == '' || //确认密码 
			$('.code_input').val() == '') //手机验证码)
			{
				errorMsg('请完善信息');
			}else if($('.reg_password input').val() != $('.reg_ensure_password input').val()){
				errorMsg('两次输入密码不一致');
			}else{
				var data = {
					code: $('.code_input').val(),//手机验证码
					phone: $(".reg_user_phone .zone_list").find("option:selected").text()+$('.reg_user_phone input').val()//手机号
				};
				deltaGoAjax('user/smsCheck',data,smsCheckOk)
			}
		})
	}



	function smsCheckOk(data){
        if(data.respCode == 103){
            errorMsg('验证码已过期，请重新获取!');
        }else if(data.respCode == 104){
            errorMsg('验证码错误!');
        }else{
            resData.userName = $('.reg_user_name input').val();
            resData.password = $('.reg_password input').val();
            resData.phone = $(".reg_user_phone .zone_list").find("option:selected").text()+$('.reg_user_phone input').val();

            $('.register').hide();
            $('.reg_next').show();
        }
	}

    $('.reg_ok').click(function(){
        if($('.reg_user_email input').val() == ''){
            errorMsg('请输入邮箱!');
        }else if($('.reg_id_number input').val() == ''){
            errorMsg('请输入证件号码!');
        }else{
            if(!code){
                if($('.reg_user_referee input').val() == ''){
                    errorMsg('请输入推荐人!');
                }else if($('.set_type').val() == 0){
                    errorMsg('请选择安置方式!');
                }else{
                    resData.referrerId = $('.reg_user_referee input').val();
                    resData.arrangement = $('.set_type').val()-1;
                }
            }

            resData.email = $('.reg_user_email input').val();
            resData.cardCode = $('.reg_id_number input').val();
            resData.cardType = $('.idno_type').val();
            deltaGoAjax('user/register',resData,regist);
        }
    })

    function regist(data){
        if(data.respCode == 136){
            errorMsg('该邮箱已注册!');
        }else if(data.respCode == 103){
            errorMsg('用户已存在!');
        }else if(data.respCode == 111 || data.respCode == 153 || data.respCode == 137){
            errorMsg('推荐人ID不存在!');
        }else if(data.respCode == 143){
            errorMsg('推荐人账号未激活!');
        }else if(data.respCode == 121){
            errorMsg('手机号已注册!');
        }else if(data.respCode == 122){
            errorMsg('身份证号已注册!');
        }else if(data.respCode == 144){
            errorMsg('身份证号码格式错误!');
        }else if(data.respCode == 200){
            errorMsg('注册成功!');
            setTimeout(function(){
                window.location.href = '../index.html';
            },2000)
        }


    }


    $('.back').click(function(){
        $('.register').show();
        $('.reg_next').hide();
    })

	$('.loginBtn').click(function(){
		window.location.href = '../index.html';
	})
	
})