$(function () {

    // tree菜单
    var arr = [];
    var length = $('.icon').length;
    var newSrc = [];
    var cAct = 0; //选中li的index
    for (var i = 0; i < length; i++) {
        arr[i] = $('.icon').eq(i).attr('src');
        newSrc[i] = arr[i].replace('1', '2');
    }
    $('.icon').eq(0).attr('src', '../images/menu/home02.png');
    $('.nav-sidebar li .collapsed').mouseenter(function () {
        var index = $(this).parent().index();
        if ($(this).parent().hasClass('active')) {
            return;
        }
        cAct = $('.active').index();
        $(this).find('.icon').attr('src', newSrc[index]);
    }).click(function () {
        var index = $(this).parent().index();
        if ($(this).parent().hasClass('active')) {
            return;
        }
        $('.select').attr('src', arr[cAct]).removeClass('select');
        $(this).find('.icon').attr('src', newSrc[index]).addClass('select');
    }).mouseleave(function () {
        var index = $(this).parent().index();
        if ($(this).parent().hasClass('active')) {
            return;
        }
        $(this).find('.icon').attr('src', arr[index]);
    })
    $('.nav-sidebar li').click(function (e) {
        if($(this).hasClass('logout')){
            return;
        }
        if ($(this).hasClass('first-li')) {
            var index = $(this).index();
            $(this).addClass('active').siblings().removeClass('active');
            $('.select').attr('src', arr[cAct]).removeClass('select');
            $(this).find('.icon').attr('src', newSrc[index]).addClass('select');
        } else {
            $('.first-li ul li').removeClass('active');
            $(this).addClass('active');
        }

        $(this).find('.icon_down').toggleClass('open');
        if ($(this).closest('li').attr('data-href') != '#') {
            $('iframe').attr('src', $(this).closest('li').attr('data-href') + '.html');
            $('.first-li a').removeClass('bg_active');
            return;
        }

    })

    $('.nav-list a').click(function (e) {
        e.stopPropagation();
        $('.nav-list a').removeClass('bg_active');
        $(this).addClass('bg_active');
        if ($(this).closest('li').attr('data-href') != '#') {
            $('iframe').attr('src', $(this).closest('li').attr('data-href') + '.html');
            return;
        }
    })

    $('.name').text(userInfo.mail);

    /******退出*******/
    $('#logout').click(function(){
        deltaGoAjax('user/logout',{},function(data){
            localStorage.removeItem('userInfo');
            localStorage.removeItem('token');
            window.top.location = '../index.html';
        })
    })

    /*******快捷操作*******/

    function sidebarShow() {
        $('.navbar-menu').off('click');
        var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        $($('#my-iframe')[0].contentDocument).off('click');
        if (w <= 768) {
            $('.sidebar').hide();
            $('.navbar-menu').click(function () {
                $('.sidebar').toggle();
                return false;
            })
            $($('#my-iframe')[0].contentDocument).on('click', function () {
                $('.sidebar').hide();
                $('.navbar-collapse').removeClass('in');
            });
            $('.nav-list li').click(function () {
                $('.sidebar').hide();
            })
        } else {
            $('.sidebar').show();
            $('.navbar-menu').off('click');
        }
    }

    // sidebarShow()
    $('#my-iframe').load(function () {
        sidebarShow()
    })
    $(window).resize(function () {
        sidebarShow();
    });
})