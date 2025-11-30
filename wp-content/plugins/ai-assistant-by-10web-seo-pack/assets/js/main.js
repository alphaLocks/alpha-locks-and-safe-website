/**
 * Run ajax action to install/activate the main plugin.
 *
 * @param that object
 */
function taa_install_main_plugin(that) {
    if (jQuery(that).hasClass("taa-disable-link")) {
        return false;
    }
    jQuery(that).addClass('taa-disable-link');
    jQuery(that).html('<div class="taa-loader"></div>');
    jQuery.ajax({
        url: ajaxurl,
        type: "POST",
        dataType: "text",
        data: {
            action: "taa",
            task: "install_plugin",
            taa_nonce: taa.nonce
        },
        success: function( response ) {
            let json_index = response.indexOf("{\"success");
            if( json_index > -1 ) {
                response = response.substring(json_index);
                response = JSON.parse(response);
                if (response.success) {
                    window.location.reload();
                }
            }
        },
        complete: function () {
            jQuery(that).removeClass('taa-disable-link');
            jQuery(that).html(taa.button_text);
        }
    });
}