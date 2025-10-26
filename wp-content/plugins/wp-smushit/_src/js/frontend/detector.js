import unique from 'unique-selector';
import getXPath from 'get-xpath';

export class SmushLCPDetector {
	onLCP(data) {
		const element = data?.entries[0]?.element;
		const imageUrl = data?.attribution?.url;
		if (!element || !imageUrl) {
			return;
		}

		const selector = unique(element);
		const xpath = getXPath(element, {ignoreId: true});
		const body = {
			url: window.location.href,
			data: JSON.stringify({
				selector: selector,
				selector_xpath: xpath,
				selector_id: element?.id,
				selector_class: element?.className,
				image_url: imageUrl,
				background_data: this.getBackgroundDataForElement(element),
			}),
			nonce: smush_detector.nonce,
			is_mobile: smush_detector.is_mobile,
			data_store: JSON.stringify(smush_detector.data_store),
			previous_data_version: smush_detector.previous_data_version,
			previous_data_hash: smush_detector.previous_data_hash,
		};

		const xhr = new XMLHttpRequest();
		xhr.open('POST', smush_detector.ajax_url + '?action=smush_handle_lcp_data', true);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		const urlEncodedData = Object.keys(body)
			.map(key => encodeURIComponent(key) + "=" + encodeURIComponent(body[key]))
			.join("&");
		xhr.send(urlEncodedData);
	}

	getBackgroundDataForElement(element) {
		const computedStyle = window.getComputedStyle(element, null);
		const backgroundProps = [
			computedStyle.getPropertyValue("background-image"),
			getComputedStyle(element, ":after").getPropertyValue("background-image"),
			getComputedStyle(element, ":before").getPropertyValue("background-image")
		].filter((prop) => prop !== "none");
		if (backgroundProps.length === 0) {
			return null;
		}
		return this.getBackgroundDataForPropertyValue(backgroundProps[0]);
	}

	getBackgroundDataForPropertyValue(fullBackgroundProp) {
		let type = "background-image";
		if (fullBackgroundProp.includes("image-set(")) {
			type = "background-image-set";
		}
		if (!fullBackgroundProp || fullBackgroundProp === "" || fullBackgroundProp.includes("data:image")) {
			return null;
		}
		// IMPORTANT: the following regex is a copy of the one in the PHP function Parser::get_image_urls. Remember to keep them synced.
		const cssBackgroundUrlRegex = /((?:https?:\/|\.+)?\/[^'",\s()]+\.(jpe?g|png|gif|webp|svg|avif)(?:\?[^\s'",?)]+)?)\b/ig;
		const matches = [...fullBackgroundProp.matchAll(cssBackgroundUrlRegex)];
		let backgroundSet = matches.map((match) => match[1].trim());
		if (backgroundSet.length <= 0) {
			return null;
		}
		return {
			type: type,
			property: fullBackgroundProp,
			urls: backgroundSet,
		};
	}
}

(function () {
	let lcpEntry = null;
	let finalized = false;
	const initialViewportBottom = window.innerHeight;
	const pageLoadStartedAtTop = document?.documentElement?.scrollTop === 0;

	if (!pageLoadStartedAtTop || !('PerformanceObserver' in window)) {
		return;
	}

	const po = new PerformanceObserver((list) => {
		for (const entry of list.getEntries()) {
			if (isInInitialViewport(entry)) {
				lcpEntry = entry; // always keep the latest candidate
			}
		}
	});

	try {
		po.observe({type: 'largest-contentful-paint', buffered: true});
	} catch (e) {
		// not supported
	}

	function finalizeLCP() {
		if (finalized) {
			return;
		}
		finalized = true;

		if (lcpEntry) {
			const detector = new SmushLCPDetector();
			detector.onLCP({
				entries: [lcpEntry],
				attribution: {
					url: lcpEntry.url || '',
					element: lcpEntry.element || ''
				}
			});
		}

		if (po) {
			po.disconnect();
		}
	}

	function isInInitialViewport(entry) {
		const el = entry && entry.element;
		if (!el) {
			return true;
		}
		const rect = el.getBoundingClientRect();
		const elementTop = rect.top + window.scrollY;
		return elementTop <= initialViewportBottom;
	}

	// Finalize on first *trusted* user input
	['keydown', 'click', 'pointerdown', 'touchstart'].forEach((type) => {
		addEventListener(type, (event) => {
			if (event.isTrusted) {
				finalizeLCP();
			}
		}, {once: true, capture: true});
	});
})();
