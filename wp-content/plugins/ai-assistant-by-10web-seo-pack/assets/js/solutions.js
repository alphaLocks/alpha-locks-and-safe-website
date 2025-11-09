class YoastSolutionTAA {

    constructor(action_name, solution_data, observation_data) {
        this.action_name = action_name;
        this.endpoint = solution_data['endpoint'];
        this.yoast_url = solution_data['yoast_url'];
        this.solution_category = solution_data['solution_category'];
        this.button_title = solution_data['button_title'];
        this.params = solution_data['params'];
        this.requirements = solution_data['requirements'];
        this.tooltip = solution_data['tooltip'];

        this.yoast_section_container = observation_data[this.solution_category]['node'];
        this.event_name = observation_data[this.solution_category]['event_name'];
        this.button_cont_id = "taa_yoast_" + this.action_name;
        this.button_id = "taa_yoast_btn_" + this.action_name;
        this.yoast_suggestion_element = null;
        this.google_preview_button = document.querySelector("#yoast-snippet-editor-metabox");

        this.button_should_be_disabled = false;
        this.button = null;
        this.button_container = null;

        this.keyword_input = document.querySelector("#focus-keyword-input-metabox");
        this.button_template = document.querySelector("#twai-simple-button-template").innerHTML;

        this.meta_description_element = null;
        this.seo_title_element = null;

        this.wp_data_subscribe_timeout = null;


        this.init();

        let self = this;
        this.yoast_section_container.addEventListener(this.event_name, function () {
            self.init();
        });

        wp.data.subscribe(function () {
            if (self.wp_data_subscribe_timeout !== null) {
                return;
            }

            self.wp_data_subscribe_timeout = setTimeout(function () {
                self.init();
                self.wp_data_subscribe_timeout = null;
            }, 1000);

        });

        this.google_preview_button.addEventListener('click', function () {
            setTimeout(function () {
                self.init();
            }, 90);
        })
    }

    init() {

        this.meta_description_element = this.get_meta_description_element();
        this.seo_title_element = document.querySelector("#yoast-google-preview-title-metabox");

        if (!this.need_solution()) {
            this.button = null;
            return;
        }

        this.check_requirement();

        if (!this.button || this.button.isConnected === false) {
            this.add_button();
        }else{
            this.change_tooltip();
        }

        this.maybe_disable_button();
        this.bind_scrollto();
    }

    bind_scrollto() {
        let self = this;
        jQuery(".twai-tooltip a").on("click", function () {
            // Change the tab.
            if ( self.solution_category == "seo_analysis" ) {
                jQuery("#wpseo-meta-tab-content").trigger("click");
            }
            else if ( self.solution_category == "readability" ) {
                jQuery("#wpseo-meta-tab-readability").trigger("click");
            }
            let scrollto = jQuery(this).data("scrollto");
            // Get the first block in the content.
            if ( scrollto == 'block' ) {
                scrollto = "#block-" + wp.data.select('core/block-editor').getBlocks()[0]['clientId'];
            }
            self.scroll_to_element(document.querySelector(scrollto));
            document.querySelector(scrollto).focus({preventScroll: true});
        });
    }

    add_button() {
        this.init_button_html();
        this.yoast_suggestion_element.classList.add("twai-yoast-suggestion-element");
        this.yoast_suggestion_element.appendChild(this.button_container);
        this.add_click_event();
    }

    add_click_event() {
        let self = this;
        jQuery(this.button).on('click', function () {
            if (!jQuery(this).hasClass("twai-button-locked") && !jQuery(this).hasClass("twai-button-disabled")) {
                self.click();
            }
        });
    }

    click() {
        taa_button_loading(true, this.button);
        this.request();
    }

    disable_button() {
        this.button.classList.add("twai-button-disabled");
    }

    enable_button() {
        this.button.classList.remove("twai-button-disabled");
    }

    request() {
        let self = this;
        let req = new RestRequest(this.endpoint, this.get_request_body(), "POST", function (success) {

            self.response(success['data']['output']);

        }, function (err) {
            taa_button_loading(false);
        }, function (a) {
            taa_button_loading(false);
        });

        req.taa_send_rest_request();
    }

    need_solution() {
    }

    get_request_body() {
    }

    response(output) {
    }

    get_post_title() {
        return TAAYoast.get_post_title();
    }

    update_post_title(title) {
        TAAYoast.update_post_title(title);
    }

    get_keyphrase() {
        return this.keyword_input.value.trim();
    }

    get_short_keyphrase() {
        let short_keyphrase = true;
        this.yoast_section_container.querySelectorAll('a').forEach(function (el) {
            if (el.href && el.href.startsWith('https://yoa.st/33i')) {
                try {
                    if (window.getComputedStyle(el.closest('li').querySelector('svg')).getPropertyValue('fill') !== 'rgb(122, 208, 58)') {
                        short_keyphrase = false;
                    }
                } catch (e) {

                }
            }
        });
        return short_keyphrase;
    }


    update_keyphrase(text) {
        let self = this;
        this.scroll_to_element(this.keyword_input);

        taa_text_animation(text, function (text_part) {
            if (text_part !== null) {
                self.keyword_input.value = text_part;
            } else {
                window.YoastSEO.store.dispatch({
                    type: 'WPSEO_SET_FOCUS_KEYWORD',
                    keyword: text,
                });
                self.reinit_all_buttons()
            }
        }, 60, 1);

    }

    get_meta_description() {
        return wp.data.select('yoast-seo/editor').getDescription().trim();
    }

    update_meta_description(output) {
        this.update_google_preview_data("description", output);
    }

    get_seo_title() {
        return wp.data.select('yoast-seo/editor').getSeoTitle().trim();
    }

    update_seo_title(output) {
        this.update_google_preview_data("title", output);
    }

    maybe_disable_button() {
        // If there is an action in progress.
        if ( typeof twai_inprogress != "undefined" && twai_inprogress ) {
            if (jQuery(twai_inprogress).attr('id') === this.button_id) {
                if (twai_inprogress.isConnected === false) {
                    taa_button_loading(true, this.button);
                }
                return;
            }
            this.button.classList.add("twai-button-locked");
        }


        if (this.button_should_be_disabled) {
            this.disable_button();
        } else {
            this.enable_button();
        }
    }

    check_requirement() {
        this.button_should_be_disabled = false;

        let request_params = this.get_request_body();
        let params = this.params;
        if ( typeof this.requirements !== "undefined" ) {
            params = {...this.params, ...this.requirements};
            let request_requirements = {"short_keyphrase": this.get_short_keyphrase()};
            request_params = {...request_params, ...request_requirements};
        }
        let disable = false;
        for (let param_name in params) {
            if (params[param_name]['required'] && !request_params[param_name]) {
                disable = true;
                break;
            }
        }

        if (disable === true) {
            this.button_should_be_disabled = true;
        }
    }

    scroll_to_element(element) {
        try {
            element.scrollIntoView({behavior: "smooth", block: 'center'});
        } catch (e) {

        }
    }

    init_button_html() {
        let tmp = document.createElement("div");
        tmp.innerHTML = this.button_template;

        this.button_container = tmp.children[0];
        this.button_container.id = this.button_cont_id;
        this.button = this.button_container.querySelector('.twai-button');
        this.button.id = this.button_id;
        this.button.querySelector('.twai-button-text').innerText = this.button_title;
        this.change_tooltip();
    }

    change_tooltip(){
        if (this.button.querySelector(".twai-tooltip") == null) {
            return;
        }
        let request_params = this.get_request_body();
        let params = this.params;
        if ( typeof this.requirements !== "undefined" ) {
            params = {...this.params, ...this.requirements};
            let request_requirements = {"short_keyphrase": this.get_short_keyphrase()};
            request_params = {...request_params, ...request_requirements};
        }

        for ( let param_name in params ) {
            this.button.querySelector(".twai-tooltip").classList.add("taa-hidden");
            this.button.querySelector("#twai_" + param_name).classList.add("taa-hidden");
            if (params[param_name]['required'] && !request_params[param_name]) {
                this.button.querySelector(".twai-tooltip").classList.remove("taa-hidden");
                this.button.querySelector("#twai_" + param_name).classList.remove("taa-hidden");
            }
        }
    }

    get_meta_description_element() {
        try {
            return document.querySelectorAll('section')[2].querySelectorAll('.yst-replacevar')[1].querySelector('.yst-replacevar__label');
        } catch (e) {
            return null;
        }
    }

    update_google_preview_data(field_name, text) {
        let self = this;

        if (this.google_preview_button.getAttribute("aria-expanded") === "false") {
            this.google_preview_button.click();
            setTimeout(() => change_data(), 100);
        } else {
            change_data();
        }


        function change_data() {

            let google_preview = {
                "description": {
                    "element_to_scroll": self.meta_description_element,
                    "animation_speed": 20
                },
                "title": {
                    "element_to_scroll": self.seo_title_element,
                    "animation_speed": 60
                }
            };

            self.scroll_to_element(google_preview[field_name]['element_to_scroll']);

            taa_text_animation(text, function (text_part) {
                if (text_part !== null) {
                    let data = {};
                    data[field_name] = text_part;

                    let meta_data = {type: "SNIPPET_EDITOR_UPDATE_DATA", data: data};
                    window.YoastSEO.store.dispatch(meta_data);
                } else {
                    let data = {};
                    data[field_name] = text;
                    wp.data.dispatch("yoast-seo/editor").updateAnalysisData(data)
                    self.reinit_all_buttons();
                }
            }, google_preview[field_name]['animation_speed'], 1);
        }
    }

    reinit_all_buttons() {
        window.taa_yoast.reinit_all_buttons();
    }

}

class YoastSolutionSEOAnalysisTAA extends YoastSolutionTAA {
    need_solution() {
        let self = this;
        let element = null

        if (!this.yoast_suggestion_element || this.yoast_suggestion_element.isConnected === false) {

            this.yoast_section_container.querySelectorAll('a').forEach(function (el) {
                if (el.href && el.href.startsWith(self.yoast_url)) {
                    element = el;
                }
            });

            if (!element) {
                return false;
            }

            this.yoast_suggestion_element = element.closest('li');
        }

        let svg_el = this.yoast_suggestion_element.closest('li').querySelector('svg');
        let svg_color = window.getComputedStyle(svg_el).getPropertyValue('fill');
        if (svg_color === 'rgb(122, 208, 58)') {
            return false
        } else {
            return true;
        }
    }
}

window.KeyphraseIntroTAA = class KeyphraseIntroTAA extends YoastSolutionSEOAnalysisTAA {

    constructor(action_name, solution_data, observation_data) {
        super(action_name, solution_data, observation_data);
        this.first_paragraph_index = 0;
    }

    get_request_body() {
        return {
            "intro": this.get_first_paragraph(),
            "keyphrase": this.get_keyphrase()
        }
    }

    response(output) {
        if (typeof AIGutenbergApp !== "undefined") {
            let ob = new AIGutenbergApp();
            ob.add_paragraph_block(this.first_paragraph_index, output)
        }
    }

    get_first_paragraph(blocks) {
        if ( typeof blocks == "undefined" ) {
            let blocks = wp.data.select('core/block-editor').getBlocks();
        }
        let text = "";
        let index = 0;

        if ( typeof blocks != "undefined" ) {
            blocks.every((block, key) => {
                if (block.attributes.content != "") {
                    if (block.name === "core/paragraph") {
                        text = block.attributes.content;
                        text = text.replace(/(<([^>]+)>)/gi, "").trim();
                        index = key;
                        return false;
                    }
                    else {
                        // If no paragraphs found, split on double linebreaks.
                        let originalContent = block.originalContent;
                        // Remove Table of Contents.
                        originalContent = this.excludeTableOfContentsTag(originalContent);
                        // Remove Estimated reading time.
                        originalContent = this.excludeEstimatedReadingTime(originalContent);
                        // Unify only non-breaking spaces and not the other whitespaces since a whitespace could signify a sentence break or a new line.
                        originalContent = this.unifyNonBreakingSpace(originalContent);
                        let originalContentBlocks = originalContent.split("\n\n");
                        if (originalContentBlocks.length > 0) {
                            originalContentBlocks.every(originalContentBlock => {
                                if (0 !== originalContentBlock.indexOf("<h")) {
                                    text = originalContentBlock;
                                    index = key;
                                    return false;
                                }
                            });
                        }
                    }
                }
                else if (block.innerBlocks.length > 0) {
                    this.get_first_paragraph(block.innerBlocks);
                    return true;
                }
            });
        }
        this.first_paragraph_index = index;
        return text;
    }

    excludeTableOfContentsTag( text ) {
        const tableOfContentsTagRegex = new RegExp( "(<div class='wp-block-yoast-seo-table-of-contents yoast-table-of-contents'>).*?(</div>)", "igs" );
        text = text.replace( tableOfContentsTagRegex, "" );
        return text;
    }

    excludeEstimatedReadingTime( text ) {
        const estimatedReadingTimeRegex = new RegExp( "<p class='yoast-reading-time__wrapper.*?</p>", "igs" );
        text = text.replace( estimatedReadingTimeRegex, "" );
        return text;
    }

    unifyNonBreakingSpace ( text ) {
        return text.replace( /&nbsp;/g, " " );
    };
}

window.KeyphraseLengthTAA = class KeyphraseLengthTAA extends YoastSolutionSEOAnalysisTAA {

    get_request_body() {
        return {
            "keyphrase": this.get_keyphrase()
        }
    }

    response(output) {
        this.update_keyphrase(output)
    }
}

window.KeyphraseInMetaDescriptionTAA = class KeyphraseInMetaDescriptionTAA extends YoastSolutionSEOAnalysisTAA {

    get_request_body() {
        return {
            "keyphrase": this.get_keyphrase(),
            "text": this.get_meta_description()
        }
    }

    response(output) {
        this.update_meta_description(output)
    }
}

window.KeyphraseInTitleTAA = class KeyphraseInTitleTAA extends YoastSolutionSEOAnalysisTAA {

    get_request_body() {
        return {
            "keyphrase": this.get_keyphrase(),
            "title": this.get_seo_title(),
        }
    }

    response(output) {
        this.update_seo_title(output)
    }
}

window.TitleLengthTAA = class TitleLengthTAA extends YoastSolutionSEOAnalysisTAA {

    get_request_body() {
        return {
            "keyphrase": this.get_keyphrase(),
            "title": this.get_seo_title(),
        }
    }

    response(output) {
        this.update_seo_title(output)
    }
}

window.RephraseMetaDescriptionTAA = class RephraseMetaDescriptionTAA extends YoastSolutionSEOAnalysisTAA {

    get_request_body() {
        return {
            'keyphrase': this.get_keyphrase(),
            "text": this.get_meta_description()
        }
    }

    response(output) {
        this.update_meta_description(output)
    }
}

window.GenerateMetaDescriptionTAA = class GenerateMetaDescriptionTAA extends YoastSolutionTAA {
    add_button() {
        this.init_button_html();

        if (this.meta_description_element) {
            let prev_element = this.meta_description_element;
            prev_element.parentNode.insertBefore(this.button_container, prev_element.nextSibling);
        }

        this.add_click_event();
    }

    get_headings(levels) {
        let headings = [];
        let blocks = wp.data.select("core/editor").getBlocks();
        for (let block of blocks) {
            if (block['name'] === "core/heading" && levels.includes(block['attributes']['level'])) {
                let content = block['attributes']['content'];
                let tmp = document.createElement("div");
                tmp.innerHTML = content;
                headings.push(tmp.innerText.trim());
            }
        }
        return headings;
    }

    get_request_body() {
        let title = this.get_seo_title();
        if (!title) {
            title = this.get_post_title();
        }

        return {
            "keyphrase": this.get_keyphrase(),
            'subheadings': this.get_headings([2, 3]).join('\n'),
            'title': title
        }
    }

    response(output) {
        this.update_meta_description(output)
    }

    need_solution() {
        return true;
    }
}


