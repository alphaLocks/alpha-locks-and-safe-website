class TAAYoast {


    constructor() {
        this.observation_list = {};

        this.init_observation_list();

        this.start_observations();
        this.solutions = taa_yoast_vars.solutions;

        for (let key in this.solutions) {
            if (!this.solutions[key]['class_name']) {
                continue;
            }

            this.solutions[key]['handler'] = new window[this.solutions[key]['class_name']](key, this.solutions[key], this.observation_list);
        }
    }

    start_observations() {
        for (let key in this.observation_list) {
            const observe_data = this.observation_list[key];

            const event = new CustomEvent(observe_data['event_name'], {
                detail: {},
                bubbles: false,
                cancelable: true,
                composed: false,
            });

            const target_node = observe_data['node'];
            // Options for the observer (which mutations to observe)
            const config = {attributes: false, childList: true, subtree: true};

            // Callback function to execute when mutations are observed
            const callback = (mutationList, observer) => {
                target_node.dispatchEvent(event);
            }

            // Create an observer instance linked to the callback function
            const observer = new MutationObserver(callback);

            // Start observing the target node for configured mutations
            observer.observe(target_node, config);
        }
    }


    init_observation_list() {
        this.observation_list = {
            "seo_analysis": {
                "node": document.querySelector('#yoast-seo-analysis-collapsible-metabox').closest('div'),
                "event": 'taa_yoast_seo_analysis'
            }
        };
    }

    reinit_all_buttons(){
        for (let key in this.solutions) {
            this.solutions[key]['handler'].init();
        }
    }

    static get_post_title() {
        return wp.data.select("core/editor").getEditedPostAttribute('title');
    }

    static update_post_title(title) {
        wp.data.dispatch('core/editor').editPost({title: title});
    }
}

function taa_start_yoast(count) {

    if (count === 0) {
        return;
    }

    if (document.querySelector('#wpseo_meta') && document.querySelector("#editor")) {
        if (document.querySelector('#yoast-seo-analysis-collapsible-metabox') === null) {
            setTimeout(function () {
                taa_start_yoast(count--);
            }, 1000)
        } else {
            window.taa_yoast = new TAAYoast();
        }
    }
}

jQuery(document).ready(function () {
    taa_start_yoast(10);
});

