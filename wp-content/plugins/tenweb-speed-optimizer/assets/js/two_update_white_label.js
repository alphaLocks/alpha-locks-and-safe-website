jQuery(document).ready(function($) {
    // Remove the link with class 'open-plugin-details-modal'
    $('.update-message a.open-plugin-details-modal').remove();

    // Remove the " or " text node (note the spaces)
    $('.update-message p').contents().filter(function() {
        return this.nodeType === 3 && this.nodeValue.trim() === 'or';
    }).remove();
});
