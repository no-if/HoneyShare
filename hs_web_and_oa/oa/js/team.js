$(function(){
    var Request = new Object();
    Request = GetRequest();
    var setId = Request["id"];

    var idArr = [userId]; //查看的id
    var nowPage = 0; //当前的层数

    deltaGoAjax('team/myTeam/'+userId,'',myTeam,'get');

    function myTeam(data){

        var data = setList(data.tree,0);
        addTree(data);
    }
    var teamlevels = 3;
    function setList(obj,level){
        if(level<teamlevels){
            if(obj.childs == null){
                obj.childs = [];
                for(var i =0;i<2;i++){
                    obj.childs[i] = {};
                    if(obj.name == '点击增加' || obj.name == '-'){
                        obj.childs[i].name = "-";
                        obj.childs[i].act = 'not';
                    }else{
                        obj.childs[i].name = "点击增加";
                        obj.childs[i].act = 'add';
                        obj.childs[i].parentId = obj.userId;
                    }

                    obj.childs[i].level = 100;
                    obj.childs[i].userId = (obj.userId +'1'+ i);

                    obj.childs[i].region = i;
                    if(level<teamlevels-1){
                        obj.childs[i].childs = null;
                    }
                }
            }else if(obj.childs.length<2){
                if(obj.childs[0].childs){

                }else{
                    obj.childs[0].child = null;
                }

                if(obj.childs[0].region==0){
                    var team = {};
                    team.name = "点击增加";
                    team.act = 'add';
                    team.parentId = obj.userId;
                    team.level = 100;
                    team.userId = obj.userId + '1';
                    team.region = 1;
                    if(level<teamlevels-1){
                        team.childs = null;
                    }
                    obj.childs.push(team);
                }else{
                    var team = {};
                    team.name = "点击增加";
                    team.parentId = obj.userId;
                    team.act = 'add';
                    team.level = 100;
                    team.userId = obj.userId + '1';
                    team.region = 0;
                    if(level<teamlevels-1){
                        team.childs = null;
                    }
                    obj.childs.unshift(team);
                }
            }
            level++;
            obj.childs.forEach(function(item,val){
                if(level==teamlevels){
                    item.childs = null
                }
                if(item.childs){}else{
                    item.childs = null;
                }
                item = setList(item,level)
            })
        }
        return obj;
    }



    function addTree(data){
        $('.team_sel').html('');
        if(data.level == null || data.level == 0){
            var background = 'url(../../images/fit_logo/grade0.png)';
        }else{
            var background = 'url(../../images/fit_logo/grade'+data.level+'.png)';
        }

        var str =   '<div class="team_item_box">'+
            '<i style="background-image:'+background+'"></i>'+
            '<p>FIT'+data.userId+'</p>'+
            '</div>'+
            '<div class="one_line"></div>'+
            '<div class="two_line"></div>';

            str +=  '<ul class="team_level_box FIT'+data.userId+'">'+
                '<li class="left"></li>'+
                '<li class="right"></li>'+
                '</ul>';
        $('.team_sel').append(str);


        addTreeL(data.childs,'FIT'+data.userId);

        addTreeL(data.childs[0].childs,'FIT'+data.childs[0].userId);
        addTreeL(data.childs[1].childs,'FIT'+data.childs[1].userId);

        addTreeL(data.childs[0].childs[0].childs,'FIT'+data.childs[0].childs[0].userId,'1');
        addTreeL(data.childs[0].childs[1].childs,'FIT'+data.childs[0].childs[1].userId,'1');
        addTreeL(data.childs[1].childs[0].childs,'FIT'+data.childs[1].childs[0].userId,'1');
        addTreeL(data.childs[1].childs[1].childs,'FIT'+data.childs[1].childs[1].userId,'1');
    }




    function addTreeL(data,obj,last){
        if(data[0].level == 100){
            var background = 'url(../../images/fit_logo/add.png)';
        }else if(data[0].level == null || data[0].level == 0){
            var background = 'url(../../images/fit_logo/grade0.png)';
        }else{
            var background = 'url(../../images/fit_logo/grade'+data[0].level+'.png)';
        }
        var str =   '<div class="team_item_box '+((data[0].act) || 'look')+'" data-region="'+data[0].region+'" data-id="'+data[0].userId+'" data-parentId="'+data[0].parentId+'">'+
            '<i style="background-image:'+background+'"></i>'+
            '<p>'+(data[0].name || ('FIT'+data[0].userId))+'</p>'+
            '</div>';

            if(last != 1){
                str += '<div class="one_line"></div>'+
                    '<div class="two_line"></div>';
            }


                str +=  '<ul class="team_level_box FIT'+data[0].userId+'">'+
                    '<li class="left"></li>'+
                    '<li class="right"></li>'+
                    '</ul>';


        $('.team_sel').find('.'+obj).children('.left').append(str);
        addTreeR(data,obj,last);
    }

    function addTreeR(data,obj,last) {
        if(data[1].level == 100){
            var background = 'url(../../images/fit_logo/add.png)';
        }else if(data[1].level == null || data[1].level == 0){
            var background = 'url(../../images/fit_logo/grade0.png)';
        }else{
            var background = 'url(../../images/fit_logo/grade'+data[1].level+'.png)';
        }
        var str = '<div class="team_item_box '+((data[1].act) || 'look')+'" data-region="'+data[1].region+'" data-id="'+data[1].userId+'" data-parentId="'+data[1].parentId+'">' +
            '<i style="background-image:' + background + '"></i>' +
            '<p>'+(data[1].name || ('FIT'+data[1].userId))+ '</p>' +
            '</div>' ;
        if(last != 1){
            str += '<div class="one_line"></div>'+
                '<div class="two_line"></div>';
        }
            str += '<ul class="team_level_box FIT' + data[1].userId + '">' +
                '<li class="left"></li>' +
                '<li class="right"></li>' +
            '</ul>';

        $('.team_sel').find('.' + obj).children('.right').append(str);
    }

    /**
     *新增用户
     *如果setId存在,则为安置用户操作，否则为注册用户或子账号操作
     **/
    $('.team_sel').on('click','.add',function(){
        var parentId = $(this).attr('data-parentId');
        var region = $(this).attr('data-region');
        if(setId){
            var setData = {
                userId: setId,
                parentId: parentId,
                region: region
            };
            deltaGoAjax('user/arrangeUser',setData,arrangeUserOk)
        }else{
            window.location.href = 'add_agent.html?parentId='+parentId+'&region='+region;
        }

    })

    function arrangeUserOk(data){
        if(data.respCode == 200){
            errorMsg('用户安置成功!');
            deltaGoAjax('team/myTeam/'+idArr[nowPage],'',myTeam,'get');
        }
    }

    /*******查看用户********/
    $('.team_sel').on('click','.look',function(){
        var id = $(this).attr('data-id');
        deltaGoAjax('team/myTeam/'+id,'',myTeam,'get');
        idArr.push(id);
        nowPage++;
    })

    /*******搜索用户********/
    $('.search').click(function(){
        if($('.search_id').val() == ''){
            return;
        }else{
            var id = $('.search_id').val();
            deltaGoAjax('team/myTeam/'+id,'',myTeam,'get');
            idArr.push($('.search_id').val());
            nowPage++;
        }
    })
    $('.back').click(function(){
        if(nowPage == 0){
            return;
        }else{
            idArr.pop();
            nowPage--;
            deltaGoAjax('team/myTeam/'+idArr[nowPage],'',myTeam,'get');
        }
    })


})
