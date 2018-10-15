/**
 * Created by Administrator on 2018/6/14.
 */
$(function(){
    $('.first_li').addClass('li_fit'+userInfo.id);
    $('.first_li > .fit_ul').addClass('ul_fit'+userInfo.id);
    $('.first_li > .list_box').attr('data-id',userInfo.id).text('FIT'+userInfo.id+' - '+matching_arr[userInfo.level]);
    var ajaxData = {
        id: ''
    };

    /*****点击查看下级******/
    var lookId; //当前点击的用户id
    var lookIdObj = {};
    $('.first_li').on('click','.list_box',function(){
        lookId = $(this).attr('data-id');
        if($(this).hasClass('on')){
            $(this).removeClass('on');
            $(this).siblings('.fit_ul').eq(0).hide();
        }else{
            $(this).addClass('on');
            $(this).siblings('.fit_ul').eq(0).show();
        }
        if(!lookIdObj[lookId]){
            lookIdObj[lookId] = lookId;
            ajaxData.id = lookId;
            getList();
        }else{

        }
    })

    function getList(){
        fitAjax('team/getDevelopMember',ajaxData,getListOK);
    }
    function getListOK(data){
        var str = '';
        $.each(data.data,function(k,val){
            str += '<li class="li_fit'+val.userId+'">'+
                        '<div data-id="'+val.userId+'" class="list_box">'+
                            'FIT'+val.userId+' - '+(val.mealName ||'')+''+
                        '</div>'+
                        '<ul class="fit_ul ul_fit'+val.userId+'"></ul>'+
                    '</li>';
        })
        $('.box').find('.ul_fit'+lookId).append(str).show();
    }
})