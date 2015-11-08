//Сбор параметров
;var dataParams = (function(){

    var params = {
        originX        : 0,
        originY        : 0,
        transparency      : 1,
        isPattern      : false,
        x                 : 0,
        y                 : 0,
        originalImage  : "",
        watermarkImage : ""
    };
    var _addOriginX = function(){
        params.originX = parseInt($('#moveX').val());
    };
    var _addOriginY  = function(){
        params.originY =  parseInt($('#moveY').val());
    };
    var _addTransparency = function(x){
        params.transparency= x;
    };
    var _addOriginalImage = function(x){
        params.originalImage= x;
    };
    var _addWatermarkImage = function(x){
        params.watermarkImage= x;
    };
    var _addIsPattern = function(x){
        var radios = $("input[type=radio]");
        for (var i= 0; i< radios.length; i++) {
            if (radios[i].checked && radios[i].name === "tiling") {
                params.isPattern=radios[i].value;
            }
        }
    };
    var _addX = function(x){
        params.x= x;
    };
    var _addY = function(x){
        params.y= x;
    };

    var _getData = function(){
        _addOriginX();
        _addOriginY();
        _addIsPattern();
        return params;
    }

    return {
        getData            : _getData,
        addOriginX          : _addOriginX,
        addOriginY          : _addOriginY,
        addTransparency     : _addTransparency,
        addOriginalImage    : _addOriginalImage,
        addWatermarkImage   : _addWatermarkImage,
        addIsPattern        : _addIsPattern,
        addX                : _addX,
        addY                : _addY,

    }

})();

//Скачать изображение, передача информации на backend
var submitForm = (function(){
    var init = function () {
        _setUpListners();
    };
    var _setUpListners = function() {
        $('#submit').on('click', function(e) {
            e.preventDefault();
            console.log (dataParams.getData());
            var url ='./php/download.php',
                defObj = _ajax(dataParams.getData(), url);

            if(defObj) {
                defObj.done(function(ans){
                    if (ans.status === 'OK') {
                       console.log('ok');
                       window.location = ans.link; // Link to file
                    } else{
                       console.log('не ok');
                    }
                })
            }

        });
    };
    var _ajax = function (data, url) {
        return  $.ajax({
            url: url,
            type: 'POST',
            dataType: 'JSON',
            data: data
        }).fail(function(){
            console.log('На сервере произошла ошибка.');
        });
    };
    return {
        init: init
    }
})();
if ($('#submit')) { submitForm.init(); };


//Прозрачность марки
var OpacitySlider = (function(){
    var _setUpListners = function() {
        $( "#slider" ).slider({'value':100, 'range': 'min'}).on( "slide", function( event, ui ) {
        var opacity = ui.value/100;
        dataParams.addTransparency(opacity);
        $('.mainMark,.flagHolder').css('opacity', opacity);
        $('input[name="opacity"]').val(opacity*100);
      });
    };
    var init = function () {
        _setUpListners();

    };
    return {
        init: init
    };
})();
if ($('#slider')) { OpacitySlider.init(); };

//Загрузка основного изображения
var FileUploadJQ = (function(){

    var _setUpListners = function() {
        $('#fileuploadImage').fileupload({
        dataType: 'json',
        progressall: function (e, data) {
            var progress = '<div id="progress"></div>';
            $('.main-bl').css('position', 'relative').prepend(progress)
        var progress = parseInt(data.loaded / data.total * 100, 10);
        $('#progress').css({
            'height': '17px',
            'background-image':'url(img/progressbar.gif)',
            'position':'absolute',
            'top':'75px',
            'left':'26px',
            'max-width':'648px',
            'border-radius': '7px'
        }).css('width', progress + '%');
    },
    add:function (e,data) {
        //console.log('add ready')
        data.submit();
    },
        done: function (e, data) {
            var nameFile = data.result.files[0].name,
                urlFile = data.result.files[0].url;
            dataParams.addOriginalImage(urlFile);
            $('#progress').remove();
            $('#fileuploadImage').attr('disabled', 'disabled');
            $('input[name="aim-img"]').val(nameFile)
                $('.mainImg').text(nameFile);
                $('#watermark').removeAttr('disabled');
                $('body').append('<img src="'+ urlFile +'" class="mainIMG">');
                $(".mainIMG").hide().on('load', function(event) {
                    var width = $(this).width();
                    var height = $(this).height();
                    $('.aim-img').append('<div class="mainIMGHolder"></div>').css('position', 'relative');
                    if(width > 648 || height > 648){
                    if(width > height){
                        var finalSize = (width/height);
                        _setUpListners2();
                        $('.mainIMGHolder').css({
                            'width': '648px',
                            'height': 648/finalSize+'px',
                            'background': 'url('+ urlFile +')',
                            'background-size':'contain',
                            'overflow':'hidden',
                            'position':'absolute',
                            'top':'0',
                            'bottom':'0',
                            'left':'0',
                            'right':'0',
                            'margin':'auto'
                        });
                    } else {
                         var finalSize = (height/width);
                         _setUpListners2();
                         $('.mainIMGHolder').css({
                            'height': '533px',
                            'width': 533/finalSize+'px',
                            'background': 'url('+ urlFile +')',
                            'background-size':'contain',
                            'overflow':'hidden',
                            'position':'absolute',
                            'top':'0',
                            'bottom':'0',
                            'left':'0',
                            'right':'0',
                            'margin':'auto'
                        });
                    }
                    } else {
                        _setUpListners2();
                       $('.mainIMGHolder').css({
                            'height': height,
                            'width': width,
                            'background': 'url('+ urlFile +')',
                            'background-size':'contain',
                            'overflow':'hidden',
                            'position':'absolute',
                            'top':'0',
                            'bottom':'0',
                            'left':'0',
                            'right':'0',
                            'margin':'auto'
                        });
                    }

                        
                });
        }
    });
    };

     var _setUpListners2 = function() {
        $('#watermark').fileupload({
        dataType: 'json',
         progressall: function (e, data) {
            var progress = '<div id="progress"></div>';
            $('.main-bl').css('position', 'relative').prepend(progress)
        var progress = parseInt(data.loaded / data.total * 100, 10);
        $('#progress').css({
            'height': '17px',
            'background-image':'url(img/progressbar.gif)',
            'position':'absolute',
            'top':'75px',
            'left':'26px',
            'max-width':'648px',
            'border-radius': '7px'
        }).css('width', progress + '%');
    },
    add:function (e,data) {
        //console.log('add ready')
        if($('.flagHolder').length){
            $('.flagHolder, #vertical, #horizontal').remove();
        }

        data.submit();
    },
        done: function (e, data) {
                $('#progress').remove();
                var nameFile = data.result.files[0].name,
                urlFile = data.result.files[0].url;
                dataParams.addWatermarkImage(urlFile);
                $('#progress').remove(); 
                $('.mainWatermark').text(nameFile);
                $('input[name="watermark"]').val(nameFile);
                var buff = 0;
                if(!($('.mainMark').length)){
                    buff = 1;
                }
                if($('.mainMark').length){// || $('.flag').length){
                    $('.mainMark').remove();
                    // $('.flagHolder').remove();
                    // $('.flag').remove();
                }
                $('.mainIMGHolder').append('<img src="'+ urlFile +'" class="mainMark">');
                $('.mainMark').css({left : '0', top : '0'});
                Coordin.drag($('.mainMark'));
                $('#moveX').val('0');
                $('#moveY').val('0');
                $( "#slider" ).slider({'value':100})
                $(".mainMark").hide().css({
                    'position': 'absolute',
                    'cursor':'move'
                }).on('load', function(event) {
                    var width = $(this).width();
                    var height = $(this).height();
                    if(width > 648 || height > 648){
                    if(width > height){
                        $(this).css('width', '100%').show('fast').draggable({containment:'parent'});
                        ZAMOS.init(width,height,nameFile);
                    } else {
                         $(this).css('height', '100%').show('fast').draggable({containment:'parent'});
                         ZAMOS.init(width,height,nameFile);
                    }
                    } else {
                        $(this).show('fast').draggable({containment:'parent'});
                        ZAMOS.init(width,height,nameFile);                        
                    }
                    //___________I_____________//

                    if (buff === 1){
                        Coordin.init();
                    }
                    //___________I____________//
                    
                });

        }
    });
    };


    var init = function () {
        _setUpListners();

    };


    return {
        init: init
    };

})();
if ($('#fileuploadImage')) { FileUploadJQ.init(); };

//Режим замощения изображений
var ZAMOS = (function(){
    var init = function (width,height,file) {
        var mainIMGHolderWidth = screen.width*2;
        var mainIMGHolderHeight = screen.height*2;
        var flagWidth = width;
        var flagHeight = height;
        var mainIMGHolderArea = mainIMGHolderWidth * mainIMGHolderHeight;
        var flagArea = flagWidth * flagHeight;
        var integer = (mainIMGHolderArea/flagArea);
        $('label[for="true"]').on('click', function() {
            $('#moveX').val(0);
            $('#moveY').val(0);
            $( "#slider" ).slider({'value':100});
            $('.mainMark').hide().removeClass('mainMark').addClass('flag');
        //console.log(mainIMGHolderArea);
        //console.log(flagArea);
        //console.log(mainIMGHolderArea/flagArea);
            $('.mainIMGHolder').append('<div class="flagHolder"></div>');
            $('.flagHolder').css({
                'position': 'absolute',
                'width': mainIMGHolderWidth+'px',
                'height': mainIMGHolderHeight+'px',
                'border':'1px solid green',
                'top': -1*screen.height+'px',
                'left':-1*screen.width+'px',
                'cursor':'move',
                'font-size':'0'
            }).draggable();
            dataParams.addX($('.flagHolder').css('left'));
            dataParams.addY($('.flagHolder').css('top'));


            $('.flagHolder').hide();
            $('.flagHolder:last-child').show('500');
            for(var i = 0;i<=integer;i++){
            $('.flagHolder').append('<img src="server/php/files/'+ file +'" class="flag">');                
            }

            $('#moveX').on('keyup', function() {
                var z = $('#moveX').val();
                //console.log(z);
                $('.flag').css('border-bottom', z+'px solid transparent');
                
            });

            $('#moveY').on('keyup', function() {
                var z = $('#moveY').val();
                //console.log(z);
                $('.flag').css('border-left', z+'px solid transparent');
                
            });
            
        });


    };
    return {
        init: init
    };

})();

//_________________________________I_________________________//

var Coordin = (function () {

    var init = function(){
        _setupListener();
    };
    var _setupListener = function(){
        //console.log('ilia');
        //$(".mainMark").on('drag', _drag);
        $('#moveY').on('change', _setCoordinY);
        $('#moveX').on('change', _setCoordinX);
        $('.position__choose-increase').on('click', _increas);
        $('.position__choose-reduce').on('click', _reduce);
        $('.choose-position__item').on('click', _positionRadio);
    };

    var _positionRadio = function(){
      var item = $(this).attr('data-item'),
          img = $('.mainMark'),//  Моя правка
          layer=$('.mainIMGHolder'),
          img_width= parseInt(img.css('width')),
          layer_width=parseInt(layer.css('width')),
          img_height= parseInt(img.css('height')),
          layer_height=parseInt(layer.css('height')),
          center_width = (layer_width - img_width)/2,
          center_hight =(layer_height - img_height)/2,
          inp_x = $('#moveX'),
          inp_y = $('#moveY');


        //console.log('click');
        //console.log(item);
        switch (parseInt(item)){
            case 0:
                //img.css({'left': '0' , 'top': '0'});
                img.stop(true,true).animate(
                    {
                        'left': '0',
                        'top': '0'
                    },
                    1000
                );
                inp_x.val(0);
                inp_y.val(0);
                break;
            case 1:
                //img.css({'left': center_width, 'top': '0'});
                img.stop(true,true).animate(
                    {
                        'left': center_width,
                        'top': '0'
                    },
                    1000
                );
                inp_x.val(center_width);
                inp_y.val(0);
                break;
            case 2:
                //img.css({'left': layer_width-img_width , 'top': '0'});
                img.stop(true,true).animate(
                    {
                        'left': layer_width-img_width,
                        'top': '0'
                    },
                    1000
                );
                inp_x.val(layer_width-img_width);
                inp_y.val(0);
                break;
            case 3:
                //img.css({'left': '0' , 'top': center_hight});
                img.stop(true,true).animate(
                    {
                        'left': '0',
                        'top': center_hight
                    },
                    1000
                );
                inp_x.val(0);
                inp_y.val(center_hight);
                break;
            case 4:
                //img.css({'left': center_width , 'top': center_hight});
                img.stop(true,true).animate(
                    {
                    'left': center_width,
                    'top': center_hight
                    },
                    1000
                );
                inp_x.val(center_width);
                inp_y.val(center_hight);
                break;
            case 5:
                //img.css({'left': layer_width-img_width , 'top': center_hight});
                img.stop(true,true).animate(
                    {
                        'left': layer_width-img_width,
                        'top': center_hight
                    },
                    1000
                );
                inp_x.val(layer_width-img_width);
                inp_y.val(center_hight);
                break;
            case 6:
                //img.css({'left': '0' , 'top': layer_height-img_height});
                img.stop(true,true).animate(
                    {
                        'left': '0',
                        'top': layer_height-img_height
                    },
                    1000
                );
                inp_x.val(0);
                inp_y.val(layer_height-img_height);
                break;
            case 7:
                //img.css({'left': center_width , 'top': layer_height-img_height});
                img.stop(true,true).animate(
                    {
                        'left': center_width,
                        'top': layer_height-img_height
                    },
                    1000
                );
                inp_x.val(center_width);
                inp_y.val(layer_height-img_height);
                break;
            case 8:
                //img.css({'left': layer_width-img_width , 'top': layer_height-img_height});
                img.stop(true,true).animate(
                    {
                        'left': layer_width-img_width,
                        'top': layer_height-img_height
                    },
                    1000
                );
                inp_x.val(layer_width-img_width);
                inp_y.val(layer_height-img_height);
                break;
            default :
                //console.log('hz')
        }

    };

    var _increas = function(){
        //console.log('increas');
        var inp = $(this).closest('.input-group_count').find('input'),
            img=$('.mainMark'),
            layer=$('.mainIMGHolder'),
            img_width= parseInt(img.css('width')),
            layer_width=parseInt(layer.css('width')),
            img_height= parseInt(img.css('height')),
            layer_height=parseInt(layer.css('height'));
        if (inp.attr('id') === 'moveX'){
            var coordin = $('.mainMark').css('left'),
                coordin_inc = parseInt(coordin) + 10,
                pos = coordin_inc +'px';

            if ((coordin_inc)<= (layer_width - img_width)) {
                $('.mainMark').css('left', pos);
                inp.val(coordin_inc);
            }
            if ((coordin_inc)>= (layer_width - img_width)) {
                $('.mainMark').css('left', layer_width - img_width);
                inp.val(layer_width - img_width);
            }
        }
        if (inp.attr('id') === 'moveY'){
            var coordin = $('.mainMark').css('top'),
                coordin_inc = parseInt(coordin) + 10,
                pos = coordin_inc +'px';
            if ((coordin_inc)<= (layer_height - img_height)) {
                 $('.mainMark').css('top' , pos);
                inp.val(coordin_inc);
            }
            if ((coordin_inc)>= (layer_height - img_height)) {
                $('.mainMark').css('top' , layer_height - img_height);
                inp.val(layer_height - img_height);
            }
        }

    };
    var _reduce = function(){
        //console.log('reduce');
        var inp = $(this).closest('.input-group_count').find('input');
        if (inp.attr('id') === 'moveX'){
            var coordin = $('.mainMark').css('left'),
                coordin_red = parseInt(coordin) - 10,
                pos = coordin_red +'px';
            if(coordin_red >= 0) {
                $('.mainMark').css('left', pos);
                inp.val(coordin_red);
            }
            if(coordin_red <=0){
                $('.mainMark').css('left', '0');
                inp.val('0');
            }
        }
        if (inp.attr('id') === 'moveY'){
            var coordin = $('.mainMark').css('top'),
                coordin_red = parseInt(coordin) - 10,
                pos = coordin_red +'px';
            if(coordin_red >= 0) {
                $('.mainMark').css('top', pos);
                inp.val(coordin_red);
            }
            if(coordin_red <=0){
                $('.mainMark').css('top', '0');
                inp.val('0');
            }
        }

    };

    var _setCoordinY = function () {

        var $this = $(this),
            coordin = $(this).val(),
            position = coordin +'px',
            img=$('.mainMark'),
            layer=$('.mainIMGHolder'),
            img_height= parseInt(img.css('height')),
            layer_height=parseInt(layer.css('height'));
        if(coordin <= (layer_height - img_height) || coordin >= 0){
            $('.mainMark').css('top' , position);
        }
        if(coordin >= (layer_height - img_height)){
            $('.mainMark').css('top' , layer_height - img_height);
            $this.val(layer_height - img_height);
        }
        if(coordin < 0){
            $('.mainMark').css('top' , '0');
            $this.val('0');
        }
    };
    var _setCoordinX = function () {

        var $this = $(this),
            coordin = $(this).val(),
            img=$('.mainMark'),
            layer=$('.mainIMGHolder'),
            position = coordin +'px',
            img_width= parseInt(img.css('width')),
            layer_width=parseInt(layer.css('width'));

        if(coordin <= (layer_width - img_width) || coordin >= 0){
            $('.mainMark').css('left' , position);
        }
        if(coordin >= (layer_width - img_width)){
            $('.mainMark').css('left' , layer_width - img_width);
            $this.val(layer_width - img_width);
        }
        if(coordin < 0){
            $('.mainMark').css('left' , '0');
            $this.val('0');
        }
    };
    var drag = function($this){
        $this.on('drag', _drag);
    };
    var _drag = function() {
        //console.log('drag');
        var moveX = $('#moveX'),
            moveY = $('#moveY');

        $(this).draggable({
            drag: function (event, ui) {
                moveX.val(ui.position.left);
                moveY.val(ui.position.top);
                //console.log(ui.position.left);
                //console.log(ui.position.top);
                //ui.position.top = y;
            }
        });
    };

    return{
        init : init,
        drag: drag
    }
})();

if ($('.choose-position')) {
    $(function () {
        //console.log('create-radio');
        var child = $('.choose-position').children().each(function (key, val) {
            $(this).attr('data-item', key);
        });
        //console.log(child);
    });
};
//_________________________________I_________________________//

var main2 = (function(){
    var _increas2 = function(){
        
        var inp = $(this).closest('.input-group_count').find('input');
        if (inp.attr('id') === 'moveX'){
            //console.log(1)
            var coordin = $('.flag').css('border-bottom-width');

            var coordin_inc = parseInt(coordin) + 1,
                pos = coordin_inc;
            $('.flag').css('border-bottom' , pos+'px solid transparent');
            inp.val(pos);

            $('#vertical').css({
                'margin-top': (-1*pos)/2+'px',
                'height': pos+'px'
            });

        }
        if (inp.attr('id') === 'moveY'){
            var coordin = $('.flag').css('border-left-width'),
                coordin_inc = parseInt(coordin) + 1,
                pos = coordin_inc;
            $('.flag').css('border-left' , pos+'px solid transparent');
            inp.val(pos);

            $('#horizontal').css({
                'margin-left': (-1*pos)/2+'px',
                'width': pos+'px'
            });
        }

    };

    var _reduce2 = function(){
        var inp = $(this).closest('.input-group_count').find('input');
        if (inp.attr('id') === 'moveX'){
            var coordin = $('.flag').css('border-bottom-width'),
                coordin_inc = parseInt(coordin) - 1;
            var pos = coordin_inc;
            $('.flag').css('border-bottom' , pos+'px solid transparent');
            if(pos <= 0){
                inp.val(0);
            } else {
                inp.val(pos);
            }

             $('#vertical').css({
                'margin-top': (-1*pos)/2+'px',
                'height': pos+'px'
            });



        }
        if (inp.attr('id') === 'moveY'){
            var coordin = $('.flag').css('border-left-width'),
                coordin_inc = parseInt(coordin) - 1;
            var pos = coordin_inc;
            $('.flag').css('border-left' , pos+'px solid transparent');
            if(pos <= 0){
                inp.val(0);
            } else {
                inp.val(pos);
            }
            $('#horizontal').css({
                'margin-left': (-1*pos)/2+'px',
                'width': pos+'px'
            });


        }

    };

    var _redCross = function() {
            // console.log($(this).css('left'))
            // console.log($(this).css('top'))

            $('.choose-position').css('position', 'relative').prepend('<div id="vertical"></div> <div id="horizontal"></div>');
        $('#vertical').css({
            'position': 'absolute',
            'top':'50%',
            'left': '1px',
            'width':'100px',
            'background-color':'#e3736c'
        });
        $('#horizontal').css({
            'position': 'absolute',
            'top':'0',
            'left': '50%',
            'width':'0',
            'height':'100%',
            'background-color':'#e3736c'
        });
        main2.init()

    };

    var init = function () {
        // _redCross();
        $('.radio__tiling_true').on('click',_redCross);
        $('.position__choose-increase').on('click', _increas2);
        $('.position__choose-reduce').on('click', _reduce2);
    };


    return {
        init: init
    };

})();
if ($('.position__choose-increase') && $('.position__choose-reduce') && $('.flagHolder')) { main2.init(); };

//Fadeloader (красивишная загрузка страницы)
$('body').fadeloader({
    mode: 'children',
    fadeSpeed : 1500,
    displayType : 'block',
    easeLoad : 'easeInOutBack',
    onComplete : ''
});

//div на квадраты
// var RadioSquare = (function(){
//     var init = function(){
//         //console.log('draw init');
//         _setupListener();
//     };

//     var _setupListener = function (){
//          $('#true').on('click', _drawing);
//          $('#moveX').on('keyup', _incHeight);
//          $('#moveY').on('keyup', _incWidth);
//         // $('.position__choose-increase').on('click' , _button);
//     };

//     var _button = function(){
//         var inp = $(this).closest('.input-group_count').find('input');
//         if (inp.attr('id') === 'moveX'){
//             //console.log('inc height');
//             _incHeight();
//         }
//         if (inp.attr('id') === 'moveY'){
//             //console.log('inc width');
//             _incWidth();
//         }


//     };
//     var _incHeight = function(){
//         var marg_top = $(this).val()/ 2,
//             otst_top = (51 - marg_top)+'px',
//             height = (marg_top*2)+'px';
//         $('#horizontal').css({height : height , top : otst_top});

//     };
//     var _incWidth = function(){
//         var marg_left = $(this).val()/ 2,
//             otst_left = (51 - marg_left)+'px',
//             width = (marg_left*2)+'px';
//         $('#vertical').css({width : width , left : otst_left});

//     };
//     var _drawing = function(){

//             //console.log('draw');
//         var marg_top= ($('#moveX').val())/ 2,
//             marg_left= ($('#moveY').val())/ 2,
//             otst_left = (51 - marg_left)+'px',
//             otst_top = (51 - marg_top)+'px',
//             width = (marg_left*2)+'px',
//             height = (marg_top*2)+'px';
//         $('.choose-position').css({position : 'relative', overflow: 'hidden'}).append('<div id="vertical"></div><div id="horizontal"></div>');
//         $('#vertical').css({ position : 'absolute', top : '0', left: otst_left,  'background-color': '#f97e76', width: width, height : '100%'});
//         $('#horizontal').css({ position : 'absolute', top : otst_top, left: '0',  'background-color': '#f97e76', width: '91.5%', height : height});

//     };
//     return{
//         init : init
//     }
// })();

// if ($('input[name = "tiling"]').length){
//     RadioSquare.init();
// }

