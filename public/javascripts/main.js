'use strict';

$(document).ready(function() {
    $("label[for='min-price'] > span").html( $("#min-price").val() );
    $("#min-price").change(function(){
        $("label[for='min-price'] > span").html( $(this).val() );
    });

    $("label[for='max-price'] > span").html( $("#max-price").val() );
    $("#max-price").change(function(){
        $("label[for='max-price'] > span").html( $(this).val() );
    });

    $("#ads-filter-form").submit(function() {
        var url = '/?price='+$("#min-price").val()+'-'+$("#max-price").val();
        var tags = $('input[name="tags[]"]:checked');
        var name = $('input[name="name"]').val().trim();
        var sale = $('input[name="sale"]:checked').val();

        if( tags.length > 0 ) {
            url += '&tags=';
            let count = 0;
            tags.each(function() {
                if(count == 0) {
                    url += $(this).val();
                } else {
                    url += ','+$(this).val();
                }
                count ++;
            });
        }

        if( typeof(sale) !== 'undefined' ) {
            url += '&sale='+sale;
        }

        if( name.length > 0 ) {
            url += '&name='+name;
        }

        window.location.href = encodeURI(url);

        return false;
    });
});