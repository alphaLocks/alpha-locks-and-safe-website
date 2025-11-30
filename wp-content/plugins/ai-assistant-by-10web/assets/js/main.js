class RestRequest {
    constructor(route, params, method, success_callback, fail_callback, error_callback) {
        this.success_callback = success_callback;
        this.fail_callback = fail_callback;
        this.error_callback = error_callback;
        this.route = route;
        this.params = params;
        this.method = method;
    }

    taa_send_rest_request() {

        if (taa_admin_vars.limitation_expired == "1") {
            this.show_limit_error();
            this.fail_callback({'data': 'plan_limit_exceeded'});
            return;
        }

        this.taa_rest_request(this.route, this.params, this.method, function (that) {
            that.get_ai_data();
        });
    }

    taa_rest_request(route, params, method, callback) {

        let rest_route = taa_admin_vars.rest_route + "/" + route;
        let form_data = null;
        if (params) {
            form_data = new FormData();
            for (let param_name in params) {
                form_data.append(param_name, params[param_name]);
            }
        }

        fetch(rest_route, {
            method: method,
            headers: {
                'X-WP-Nonce': taa_admin_vars.ajaxnonce
            },
            body: form_data,
        })
            .then((response) => response.json())
            .then((data) => {
                if (data['success']) {
                    this.data = data;
                    callback(this);
                } else {
                    this.fail_result(data);
                }
            }).catch((error) => {
            this.error_callback(error);
        });
    }

    fail_result(err) {
        if (err.data == "plan_limit_exceeded") {
            this.show_limit_error();
        } else {
            this.show_notif_popup(err.data);
        }
        this.fail_callback(err);
    }

    get_ai_data() {
        let self = this;
        setTimeout(function () {
            self.taa_rest_request('ai_output', null, "GET", function (success) {
                success = success.data;

                if (success['data']['status'] !== 'done') {
                    self.get_ai_data();
                } else {
                    taa_button_loading(false);
                    if (!success['data']['output']) {
                        self.show_notif_popup("something_wrong");
                        self.fail_callback(success);
                    } else {
                        self.success_callback(success);
                    }
                }
            })
        }, 3000);
    }

    show_notif_popup(notif_key) {
        if (typeof taa_admin_vars.popup_data[notif_key] === "undefined") {
            notif_key = "something_wrong";
        }
        let data = taa_admin_vars.popup_data[notif_key];
        let twai_popup = jQuery(".twai-popup-notif");
        twai_popup.attr('data-twai-notif', notif_key);
        jQuery(".twai-popup-layout").removeClass("twai-hidden");
        twai_popup.find(".twai-popup-notif-title").text(data.title);
        twai_popup.find(".twai-popup-notif-text").text(data.text);
        twai_popup.find(".twai-popup-notif-button").text(data.button);
        if (data.action != '') {
            twai_popup.find(".twai-popup-notif-button").attr("href", data.action);
        }
        if (data.target_blank == "1") {
            twai_popup.find(".twai-popup-notif-button").attr("target", "_blank");
        }
        twai_popup.removeClass("twai-hidden");
    }

    show_limit_error() {
        if (taa_admin_vars.plan == 'Free') {
            this.show_notif_popup('free_limit_reached');
        } else {
            this.show_notif_popup('plan_limit_reached');
        }
    }
}

function taa_draw_score_circle(that) {
    var score = parseInt(jQuery(that).data('score'));
    var size = parseInt(jQuery(that).data('size'));
    var thickness = parseInt(jQuery(that).data('thickness'));
    var color = '#323A45';
    var _this = that;
    jQuery(_this).circleProgress({
        value: score / 100,
        size: size,
        startAngle: -Math.PI / 4 * 2,
        lineCap: 'round',
        emptyFill: "#E4E4E4",
        thickness: thickness,
        fill: {
            color: color
        }
    }).on('circle-animation-progress', function (event, progress) {
        let content = Math.round(score * progress);
        jQuery(that).find('.taa-score-circle-animated').html(content + '%').css({"color": color});
        jQuery(that).find('canvas').html(Math.round(score * progress));
    });

}

function taa_text_animation(word, callback, speed = 10, offset_inc = 15) {
    // setInterval can take less than 10, so speed value can't be less than 10

    let offset = 0;
    let interval = setInterval(function () {
        if (offset >= word.length) {
            clearInterval(interval);
            callback(null);
        } else {
            offset += offset_inc;
            let part = word.substr(0, offset);
            callback(part);
        }
    }, speed);
}

/* Play intro video */
function taa_playVideo(e) {
    jQuery(this).get(0).play();
}

/* Play intro video */
function taa_pauseVideo(e) {
    jQuery(this).get(0).pause();
}

// The button which is in progress.
let twai_inprogress = false;

/**
 * Add/remove loading to the AI button.
 *
 * @param enable
 */
function taa_button_loading(enable, that) {
    if ( enable ) {
        jQuery(".twai-button").addClass("twai-button-locked");
        if ( typeof that == "undefined" ) {
            that = jQuery(".twai-button");
        }
        else {
            jQuery(that).removeClass("twai-button-locked");
            twai_inprogress = that;
        }
        jQuery(that).removeClass("twai-button").addClass("twai-button-loading");
    }
    else {
        jQuery(".twai-button-loading").removeClass("twai-button-loading").addClass("twai-button");
        jQuery(".twai-button-locked").removeClass("twai-button-locked");
        twai_inprogress = false;
    }
}

/**
 * Get the new data about word usage and show notification during 2 seconds.
 */
function taa_show_word_usage() {
    jQuery.ajax({
        url: ajaxurl,
        type: "POST",
        dataType: 'text',
        data: {
            action: "get_word_usage",
            ajax_nonce: taa_admin_vars.ajaxnonce
        },
        success: function (response) {
            let json_index = response.indexOf("{\"success");
            if (json_index > -1) {
                response = response.substring(json_index);
                response = JSON.parse(response);
                if (response.success) {
                    jQuery("#twai_alreadyUsed").html(response.data.alreadyUsed);
                    jQuery("#twai_planLimit").html(response.data.planLimit);
                    if ( response.data.alreadyUsed && response.data.planLimit ) {
                        jQuery("#twai-button").addClass("twai-button-notif");
                        setTimeout(function () {
                            jQuery("#twai-button").removeClass("twai-button-notif");
                        }, 2000);
                    }
                }
            }
        }
    });
}

/*
 * Install/activate the plugin.
 * @param that object
 */
function taa_install_plugin(that) {
    if (jQuery(that).hasClass("taa-disable-link")) {
        return false;
    }
    jQuery(that).addClass('taa-disable-link');

    let plugin_zip_name = jQuery(that).data("zip_name");
    let plugin_file = jQuery(that).data("file");
    jQuery.ajax({
            url: ajaxurl,
            type: "POST",
            dataType: 'text',
            data: {
            action: "install_plugin",
            plugin_zip_name: plugin_zip_name,
            plugin_file: plugin_file,
            ajax_nonce: taa_admin_vars.ajaxnonce
        },
        success: function (response) {
            let json_index = response.indexOf("{\"success");
            if( json_index > -1 ) {
                response = response.substring(json_index);
                response = JSON.parse(response);
                if (response.success) {
                    // Adding 'Active' text to the bottom of container
                    jQuery(that).after(jQuery(".taa-row:first-child .taa-section-text.taa-section-text-semi").clone()).html();
                    jQuery(that).parent(".taa-plugin-not-active").removeClass("taa-plugin-not-active").addClass("taa-plugin-active");
                    // Clone and append installing plugin container to the active plugins container
                    jQuery('.taa-active-container').append(jQuery(that).closest(".taa-row").clone()).html();
                    jQuery(".taa-active-container .taa-download-plugin-link").remove();
                    jQuery(that).closest(".taa-row").remove();
                    if (jQuery('.taa-not-active-container .taa-row').length == 0) {
                        jQuery('.taa-not-active-container').remove();
                    }
                }
            }
        },
        complete: function () {
            jQuery(that).removeClass('taa-disable-link');
        }
    });
}

function taa_show_how_to_use_popup() {
    jQuery(".twai-how_to_use-layout, .twai-how_to_use-container").removeAttr("style").removeClass("twai-hidden");
}

jQuery(document).ready(function () {
    jQuery('.taa-score-circle').each(function () {
        taa_draw_score_circle(jQuery(this));
    });

    jQuery(".twai-popup-close, .twai-popup-layout, .twai-popup-notif-button").on("click", function () {
        /* In case of button has href need to keep popup opened as link opens in new tab */
        if (typeof jQuery(this).attr('href') != 'undefined' && jQuery(this).attr('href') != '') {
            return;
        }
        jQuery(".twai-popup-layout").addClass("twai-hidden");
        jQuery(".twai-popup-notif").addClass("twai-hidden");
    });

    jQuery(document).on("click", ".twai-how_to_use-popup-button, .twai-how_to_use-layout, .twai-skip", function () {
        jQuery(".twai-how_to_use-layout, .twai-how_to_use-container").addClass("twai-hidden");
    });

    jQuery(document).on("click", ".twai-how_to_use-button", function () {
        taa_show_how_to_use_popup();
    });

    /* Play intro video on hover */
    jQuery(document).on( "mouseover", ".taa-video-container video", taa_playVideo )
      .on( "mouseout", ".taa-video-container video", taa_pauseVideo );

    /* Open popup and show intro video */
    jQuery(document).on("click", ".taa-video-container",function () {
        let video_src = jQuery(this).parent().find("source").attr("src");
        let poster_src = jQuery(this).parent().find("video").attr("poster");
        jQuery(".taa-video-popup source").attr("src", video_src);
        jQuery(".taa-video-popup video").attr("poster", poster_src);
        jQuery(".taa-video-popup video")[0].load();
        jQuery(".taa-video-popup-layout, .taa-video-popup").removeClass("taa-hidden");
    })

    /* Close video popup */
    jQuery(".taa-video-popup-layout").on("click", function () {
        jQuery(".taa-video-popup-layout, .taa-video-popup").addClass("taa-hidden");
        jQuery(".taa-video-popup source").attr("src", "");
    })

    jQuery(".taa-download-plugin-link").on("click", function (e) {
        taa_install_plugin(this);
    });
});
