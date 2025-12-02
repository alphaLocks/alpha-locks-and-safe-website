const two_worker_font_actions = (typeof self !== "undefined" && typeof self.two_font_actions_setting !== "undefined") ?
    self.two_font_actions_setting :
    "not_load";
const two_worker_base_url = two_get_worker_base();
let two_css_length = 0;
let two_connected_css_length = 0;
let two_uncritical_fonts = null;
let two_uncritical_fonts_status = false;
if(two_worker_font_actions == "not_load" || two_worker_font_actions == "exclude_uncritical_fonts"){
    two_uncritical_fonts_status = true;
}

self.addEventListener("message", function(e) {
    two_css_length = e.data.css.length;
    if(!e.data.critical_data.critical_css || !e.data.critical_data.critical_fonts){
        two_uncritical_fonts_status = false;
    }
    if(e.data.font.length>0){
        two_fetch_inbg(e.data.font, "font");
    }
    if(e.data.js.length>0){
        two_fetch_inbg(e.data.js, "js");
    }
    if(e.data.excluded_js.length>0){
        two_fetch_inbg(e.data.excluded_js, "js" , true);
    }
    if(e.data.css.length>0){
        two_fetch_inbg(e.data.css, "css");
    }
}, false);

function two_fetch_inbg(data, type, excluded_js = false) {
    for(let i in data){
        if(typeof data[i].url != "undefined"){
            data[i].url = two_normalize_asset_url(data[i].url);
            if(type === "font" && typeof data[i].main_url !== "undefined"){
                data[i].main_url = two_normalize_asset_url(data[i].main_url);
            }
            if(!data[i].url){
                continue;
            }
            const requestUrl = data[i].url;
            var modifiedScript = null;
            if(type === "js" && typeof data[i].exclude_blob != "undefined" && data[i].exclude_blob){
                modifiedScript = {
                    id: i,
                    status: 'ok',
                    type: type,
                    url: data[i].url,
                    uid:data[i].uid
                };
                two_send_worker_data(modifiedScript);
                continue;
            }



            fetch(requestUrl, {mode:'no-cors',redirect: 'follow'}).then((r) => {
                if (!r.ok || r.status!==200) {
                    throw Error(r.statusText);
                }
                if(two_uncritical_fonts_status && type== "css"){
                    return (r.text());
                }else{
                    return (r.blob());
                }
            }).then((content_) => {
                let sheetURL = "";
                if(two_uncritical_fonts_status && type == "css"){
                    sheetURL = two_create_blob(content_);
                }else{
                    sheetURL = URL.createObjectURL(content_);
                }
                modifiedScript = null;
                if(type == "css"){
                    modifiedScript = {
                        id: i,
                        type: type,
                        status: 'ok',
                        media: data[i].media,
                        url: sheetURL,
                        uid:data[i].uid,
                        original_url: data[i].url,
                        two_uncritical_fonts:two_uncritical_fonts,
                    };
                }else if(type == "js"){
                    modifiedScript = {
                        id: i,
                        status: 'ok',
                        type: type,
                        url: sheetURL,
                        uid:data[i].uid
                    };
                }else if(type == "font"){
                    modifiedScript = {
                        status: 'ok',
                        type: type,
                        main_url: data[i].url,
                        url:sheetURL,
                        font_face:data[i].font_face
                    };
                }
                if(excluded_js){
                    modifiedScript.excluded_from_delay = true;
                }
                two_send_worker_data(modifiedScript);
            }).catch(function(error) {
                console.log("error in fetching: "+error.toString()+", bypassing "+requestUrl);
                fetch(requestUrl, {redirect: 'follow'}).then((r) => {
                    if (!r.ok || r.status!==200) {
                        throw Error(r.statusText);
                    }
                    if(two_uncritical_fonts_status && type== "css"){
                        return (r.text());
                    }else{
                        return (r.blob());
                    }
                }).then((content_) => {
                    let sheetURL = "";
                    if(two_uncritical_fonts_status && type == "css"){
                        sheetURL = two_create_blob(content_);
                    }else{
                        sheetURL = URL.createObjectURL(content_);
                    }
                    var modifiedScript = null;
                    if(type == "css"){
                        modifiedScript = {
                            id: i,
                            type: type,
                            status: 'ok',
                            media: data[i].media,
                            url: sheetURL,
                            uid:data[i].uid,
                            original_url: data[i].url,
                            two_uncritical_fonts:two_uncritical_fonts,
                        };
                    }else if(type == "js"){
                        modifiedScript = {
                            id: i,
                            status: 'ok',
                            type: type,
                            url: sheetURL,
                            uid:data[i].uid
                        };
                    }else if(type == "font"){
                        modifiedScript = {
                            status: 'ok',
                            type: type,
                            main_url: data[i].url,
                            url:sheetURL,
                            font_face:data[i].font_face
                        };
                    }
                    if(excluded_js){
                        modifiedScript.excluded_from_delay = true;
                    }
                    two_send_worker_data(modifiedScript);
                }).catch(function(error) {
                    console.log("error in fetching no-cors: "+error.toString()+", bypassing "+requestUrl);
                    try {
                        console.log("error in fetching: "+error.toString()+", sending XMLHttpRequest"+requestUrl);
                        let r = new XMLHttpRequest;
                        if(two_uncritical_fonts_status && type== "css"){
                            r.responseType = "text";
                        }else{
                            r.responseType = "blob";
                        }
                        r.onload = function (content_) {
                            let sheetURL = "";
                            if(two_uncritical_fonts_status && type == "css"){
                                sheetURL = two_create_blob(content_.target.response);
                            }else{
                                sheetURL = URL.createObjectURL(content_.target.response);
                            }
                            if(r.status !== 200){
                                two_XMLHttpRequest_error(excluded_js, data[i], type, i);
                                return;
                            }
                            console.log("error in fetching: "+error.toString()+", XMLHttpRequest success "+requestUrl);
                            let modifiedScript = null;
                            if(type == "css"){
                                modifiedScript = {
                                    id: i,
                                    type: type,
                                    status: 'ok',
                                    media: data[i].media,
                                    url: sheetURL,
                                    uid:data[i].uid,
                                    two_uncritical_fonts:two_uncritical_fonts,
                                };
                            }else if(type == "js"){
                                modifiedScript = {
                                    id: i,
                                    type: type,
                                    status: 'ok',
                                    url: sheetURL,
                                    uid:data[i].uid
                                };
                            }else if(type == "font"){
                                modifiedScript = {
                                    type: type,
                                    status: 'ok',
                                    main_url: data[i].url,
                                    url: sheetURL,
                                    font_face:data[i].font_face
                                };
                            }
                            if(excluded_js){
                                modifiedScript.excluded_from_delay = true;
                            }
                            two_send_worker_data(modifiedScript);
                        };
                        r.onerror = function () {
                            two_XMLHttpRequest_error(excluded_js, data[i], type, i)
                        };
                        r.open("GET", requestUrl, true);
                        r.send();

                    } catch (e) {
                        console.log("error in fetching: "+e.toString()+", running fallback for "+requestUrl);
                        var modifiedScript = null;
                        if(type == "css" || type == "js"){
                            modifiedScript = {
                                id: i,
                                type: type,
                                status: 'error',
                                url: data[i].url,
                                uid:data[i].uid
                            };
                        }else if(type == "font"){
                            modifiedScript = {
                                type: type,
                                status: 'error',
                                url: data[i].url,
                                font_face:data[i].font_face
                            };
                        }
                        if(excluded_js){
                            modifiedScript.excluded_from_delay = true;
                        }
                        two_send_worker_data(modifiedScript);
                    }
                });
            });
        }
    }
}

function two_get_worker_base(){
    if(typeof self === "undefined" || typeof self.location === "undefined"){
        return "";
    }
    if(self.location.origin && self.location.origin !== "null"){
        return self.location.origin;
    }
    if(self.location.href){
        const href = self.location.href;
        if(href.indexOf("blob:") === 0){
            try{
                return new URL(href.substring(5)).origin;
            }catch (e) {
            }
        }
        try{
            return new URL(href).origin;
        }catch (e) {
        }
    }
    return "";
}

function two_normalize_asset_url(url){
    if(!url || typeof url !== "string"){
        return url;
    }
    if(/^(?:https?:|data:|blob:)/i.test(url)){
        return url;
    }
    if(url.indexOf("//") === 0){
        const protocol = (self.location && self.location.protocol) ? self.location.protocol : "https:";
        return protocol + url;
    }
    if(!two_worker_base_url){
        return url;
    }
    try{
        return new URL(url, two_worker_base_url).toString();
    }catch (e) {
        return url;
    }
}


function two_XMLHttpRequest_error(excluded_js , data_i, type, i){
    console.log("error in fetching: XMLHttpRequest failed "+data_i.url);
    var modifiedScript = null;
    if(type == "css" || type == "js"){
        modifiedScript = {
            id: i,
            type: type,
            status: 'error',
            url: data_i.url,
            uid:data_i.uid
        };
    }else if(type == "font"){
        modifiedScript = {
            type: type,
            status: 'error',
            url: data_i.url,
            font_face:data_i.font_face
        };
    }
    if(excluded_js){
        modifiedScript.excluded_from_delay = true;
    }
    two_send_worker_data(modifiedScript);
}

function two_create_blob(str){
    two_uncritical_fonts = "";
    const regex = /@font-face\s*\{(?:[^{}])*\}/sig;
    str = str.replace(regex, function (e){
        if(e.includes("data:application")){
            return e;
        }
        two_uncritical_fonts += e;
        return "";
    });
    let blob_data = new Blob([str], {type : "text/css"});
    let sheetURL = URL.createObjectURL(blob_data);
    return sheetURL;
}

function two_send_worker_data(data){
    if(data.type == "css"){
        two_connected_css_length++;
        data.length = two_css_length;
        data.connected_length = two_connected_css_length;
    }
    self.postMessage(data)
}

