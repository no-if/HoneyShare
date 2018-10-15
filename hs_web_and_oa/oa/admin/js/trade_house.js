/**
 * Created by Administrator on 2018/6/9.
 */
$(function(){
    $('.btn').click(function(){
        if($('.number').val() == '' || $('.number').val() == 0 || $('.number').val()%1000 != 0){
            errorMsg('挂卖数量必须为1000的倍数!');
            return;
        }else if($('.trdePass').val() == ''){
            errorMsg('请输入交易密码!');
            return;
        }else{
            var data = {
                userId: userId,
                number: $('.number').val(),
                payPass: $('.trdePass').val()
            };
            deltaGoAjax('auction/sellCash',data,sellTokenOk);
        }
    })
    function sellTokenOk(data){
        if(data.respCode == 126){
            errorMsg('交易密码错误!');
        }else{
            errorMsg('CP挂卖成功!');
            $('.number').val('');
            $('.trdePass').val('');
            getCashList();
            reloadUserInfo();
            setTimeout(function(){
                $('.fit_num',parent.document).text(moneyToFloat(userInfo.coin));
                $('.cp_num',parent.document).text(moneyToFloat(userInfo.cash));
                $('.rp_num',parent.document).text(moneyToFloat(userInfo.register));
            },1000)
        }
    }

    var tableType = 0; //当前查看列表  0购买cp 1确认卖出
    $('.btn1').click(function(){
        $('.btn1').removeClass('select');
        $(this).addClass('select');
        tableType = $(this).index();
        $('.cpTable').hide().eq(tableType).show();
        getCashList();
    })


    var parmas1 = {
        pageNo: 1,
        pageSize: 20
    };
    var parmas2 = {
        pageNo: 1,
        pageSize: 20
    };
    getCashList();
    function getCashList(){
        if(tableType == 0){
            deltaGoAjax('auction/getCashList',parmas1,getCashListOk);
        }else{
            deltaGoAjax('auction/getSoldList',parmas2,getCashListOk);
        }

    }

    var statusData = ['','','交易中','','','','申请取消','','驳回取消申请'];
    function getCashListOk(data){
        $('.tradeCpList,.sellCpList').find('.childrenTr').remove();
        $('.pagination').html('');
        $('.btm_text').hide();
        if(data.dataList.length == 0){
            $('.btm_text').show();
            return;
        }
        var str = '';
        if(tableType == 0){
            $.each(data.dataList,function(k,val){
                if(val.userId == userInfo.id){
                    var btnClass = "backBuy";
                    var btnText = "撤回";

                }else{
                    var btnClass = "buyAct";
                    var btnText = "购买";
                }
                var bgClass = (k%2 == 0 ? 'odd' : 'even');
                str += '<tr class="childrenTr '+bgClass+'">'+
                        '<td>'+(val.time)+'</td>'+
                        '<td>FIT'+val.userId+'</td>'+
                        '<td>'+moneyToFloat(val.number)+'</td>'+
                        '<td>'+
                            '<span class="tabAct '+btnClass+'" data-userId="'+val.userId+'" data-id="'+val.id+'"  data-number="'+val.number+'" data-no="'+val.No+'">'+btnText+'</span>'+
                        '</td>'+
                    '</tr>';
            })
            $('.tradeCpList').append(str);
            allPage = page(data,$('.pagination'),parmas1.pageNo);
        }else{
            $.each(data.dataList,function(k,val){
                var bgClass = (k%2 == 0 ? 'odd' : 'even');
                str += '<tr class="childrenTr '+bgClass+'">'+
                        '<td>'+(val.time)+'</td>'+
                        '<td>FIT'+val.buyUserId+'</td>'+
                        '<td>'+moneyToFloat(val.number)+'</td>'+
                        '<td>'+statusData[val.state]+'</td>'+
                        '<td>'+
                            '<span class="tabAct look" data-src="'+val.picture+'">查看</span>'+
                        '</td>'+
                        '<td>';
                if(val.state != 6){
                    str += '<span class="tabAct sellOk" data-id="'+val.id+'" data-buyUserId="'+val.buyUserId+'" data-number="'+val.number+'">确认</span>'+
                        '<span class="tabAct sellCancel" data-id="'+val.id+'" data-buyUserId="'+val.buyUserId+'" data-number="'+val.number+'">申请取消</span>';
                }
                str += '</td>'+
                    '</tr>';
            })
            $('.sellCpList').append(str);
            allPage = page(data,$('.pagination'),parmas1.pageNo);

        }
    }


    $('.pagination').on('click','.starLi',function(){  //首页
        if(tableType == 0){
            parmas1.pageNo = '1';
        }else if(tableType == 1){
            parmas2.pageNo = '1';
        }
        getCashList();
    })
    $('.pagination').on('click','.numberLi',function(){ //随意页
        if(tableType == 0){
            parmas1.pageNo = $(this).text();
        }else if(tableType == 1){
            parmas2.pageNo = $(this).text();
        }
        getCashList();
    })
    $('.pagination').on('click','.lastLi',function(){ //尾页
        if(tableType == 0){
            parmas1.pageNo = allPage;
        }else if(tableType == 1){
            parmas2.pageNo = allPage;
        }
        getCashList();
    })
    $('.pagination').on('click','.gotoPageBtn',function(){ //跳转到
        var gotoPageNum = $('.gotoPage').val();
        if(gotoPageNum == ''){
            return;
        }else if(gotoPageNum > $(this).attr('data-page')){
            gotoPageNum = $(this).attr('data-page');
        }
        if(tableType == 0){
            parmas1.pageNo = gotoPageNum;
        }else if(tableType == 1){
            parmas2.pageNo = gotoPageNum;
        }
        getCashList();
    })


    /******用户购买cp******/
    $('.tradeCpList').on('click','.buyAct',function(){
        window.location.href = 'buy_cash.html?userId='+$(this).attr('data-userId')+'&no='+$(this).attr('data-no')+'&number='+$(this).attr('data-number')+'&id='+$(this).attr('data-id');
    })

    /******用户撤回cp挂卖******/
    $('.tradeCpList').on('click','.backBuy',function(){
        deltaGoAjax('auction/cancelSell',{id:$(this).attr('data-id')},cancelSell);
    })
    function cancelSell(data){
        if(data.respCode == 200){
            errorMsg('撤回成功!');
            getCashList();
            reloadUserInfo();
            setTimeout(function(){
                $('.fit_num',parent.document).text(moneyToFloat(userInfo.coin));
                $('.cp_num',parent.document).text(moneyToFloat(userInfo.cash));
                $('.rp_num',parent.document).text(moneyToFloat(userInfo.register));
                $('.updata_zz').hide();
            },1000)
        }
    }

    /******查看凭证******/
    $('.sellCpList').on('click','.look',function(){
        $('.buy_img_zz').show();
        $('.buy_img').attr('src',$(this).attr('data-src'));
    })
    $('.buy_img_box_cancle').click(function(){
        $('.buy_img_zz').hide();
    })

    var trade_type = 1; // 1确认交易  2申请取消交易
    /******申请取消交易******/
    var cancelData = {}; //申请取消交易参数
    $('.sellCpList').on('click','.sellCancel',function(){
        $('.updata_zz').show();
        trade_type = 2;
        $('.reason_box').show();
        $('.uadata_title').text('申请取消交易');
        $('.buyUserId').val('FIT'+$(this).attr('data-buyUserId'));
        $('.buyNumber').val(moneyToFloat($(this).attr('data-number')));
        cancelData.id = $(this).attr('data-id');
    })

    /******用户确认卖出CP******/
    var confirmData = {};  //确认卖出cp参数

    $('.sellCpList').on('click','.sellOk',function(){
        $('.updata_zz').show();
        trade_type = 1;
        $('.reason_box').hide();
        $('.uadata_title').text('确认卖出CP');
        $('.buyUserId').val('FIT'+$(this).attr('data-buyUserId'));
        $('.buyNumber').val(moneyToFloat($(this).attr('data-number')));
        confirmData.auctionId = $(this).attr('data-id');

    })
    $('.btn_ok').click(function(){
        if($('.trade_pass').val() == ''){
            errorMsg('请输入交易密码!')
        }else{
            if(trade_type == 1){
                confirmData.payPass = $('.trade_pass').val();
                deltaGoAjax('auction/confirm',confirmData,confirmOk);
            }else{
                if($('#reason').val() == ''){
                    errorMsg('请输入取消原因!');
                }else{
                    cancelData.payPass = $('.trade_pass').val();
                    cancelData.reason = $('#reason').val();
                    deltaGoAjax('auction/applyForCancel',cancelData,applyForCancel);
                }
            }
        }
    })
    function confirmOk(data){
        if(data.respCode == 200){
            errorMsg('成功卖出CP!');
            getCashList();
            reloadUserInfo();
            setTimeout(function(){
                $('.fit_num',parent.document).text(moneyToFloat(userInfo.coin));
                $('.cp_num',parent.document).text(moneyToFloat(userInfo.cash));
                $('.rp_num',parent.document).text(moneyToFloat(userInfo.register));
                $('.updata_zz').hide();
            },1000)
        }else if(data.respCode == 126){
            errorMsg('交易密码错误!');
        }
    }
    function applyForCancel(data){
        if(data.respCode == 200){
            errorMsg('申请取消交易成功!');
            $('.updata_zz').hide();
            getCashList();
        }
    }

    $('.updata_cancle,.btn_cancel').click(function(){
        $('.updata_zz').hide();
    })
})