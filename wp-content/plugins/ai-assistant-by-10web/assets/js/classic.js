( function( $ ) {
  var AIButtonApp = {

    cacheElements() {
      let self = this;

      self.cache = {};

      self.cache.$button_cont = $( '#twai-button-cont' );
      self.cache.$button = self.cache.$button_cont.find( '#twai-button' );
      self.cache.$action = self.cache.$button_cont.find( '.twai-list-item' );
      self.cache.enabled = false;

      self.cache.visual_editor = true;
      if (typeof(tinyMCE) != "undefined") {
        if (tinyMCE.activeEditor == null || tinyMCE.activeEditor.isHidden() != false) {
          self.cache.visual_editor = false;
        }
      }

      self.buildPanel();

      self.bindEvents();
    },

    buildPanel() {
      let self = this;

      // Show/hide the button on page load depends on the editor mode.
      if ( self.cache.visual_editor ) {
        self.cache.$button_cont.removeClass("hidden").addClass("twai-inline");;
      }
      else {
        self.cache.$button_cont.addClass("hidden").removeClass("twai-inline");;
      }

      // Show/hide the button on page load depends on the editor mode.
      $("#content-tmce").on("click", function () {
        self.cache.$button_cont.removeClass("hidden").addClass("twai-inline");;
      });
      $("#content-html").on("click", function () {
        self.cache.$button_cont.addClass("hidden").removeClass("twai-inline");
      });
    },

    bindEvents() {
      let self = this;

      self.cache.$action.on('click', function () {
        taa_button_loading(true, jQuery(this).closest(".twai-button"));
        jQuery(".twai-button-enabled").removeClass("twai-button-enabled");

        let slug = jQuery(this).data("value");
        let data = self.get_selection_data();
        let ob = new RestRequest("core/" + slug, {"prompt": data.selectionText}, "POST", function ( success ) {
          let output = success['data']['output'];
          if (slug == "outline") {
            self.add_outline_block(data.index, output);
          } else {
            self.add_paragraph_block(data.index, output);
          }
        }, function(err) {
          taa_button_loading(false);
        }, function(err) {
          taa_button_loading(false);
        });

        ob.taa_send_rest_request();
      });

      self.cache.$button.on( 'mouseenter', function() {
        self.cache.enabled = tinyMCE.activeEditor.selection.getContent() ? true : false;
        if (self.cache.enabled) {
          self.cache.$button.removeClass("twai-button-disabled").addClass("twai-button-enabled");
        }
        else {
          self.cache.$button.removeClass("twai-button-enabled").addClass("twai-button-disabled");
        }
      } );
    },

    init() {
      this.cacheElements();
    },

    // Run flick effect on the given text.
    wordFlick (word, index, blockId, multiple, wordArray, i) {
      let node = tinymce.activeEditor.dom.select('[id="' + blockId + '"]');
      word = node[0].textContent;
      let self = this,
        offset = 0,
        speed = 10, // setInterval can take less than 10
        step = (word.length > 200 ? 15 : 3);

      let interval = setInterval(function () {
        if (offset >= word.length) {
          // Stop the effect on the end of the text.
          clearInterval(interval);

          if ( multiple == true ) {
            // Deselect the text.
            tinymce.activeEditor.selection.collapse();
            self.add_heading_block(tinymce.activeEditor.selection.getBookmark(), wordArray, ++i);
          }
          taa_button_loading(false);
          // Show word usage tooltip.
          taa_show_word_usage();
        }
        else {
          offset += step;

          let part = word.substr(0, offset);
          // Insert the text under the selected text with animation.
          node[0].textContent = part;
          node[0].removeAttribute("style");
          node[0].removeAttribute("id");
          // Select the text.
          tinyMCE.activeEditor.selection.select(node[0]);
          // Scroll to the text.
          node[0].scrollIntoView({behavior: "instant", block: "center", inline: "nearest"});
        }
      }, speed);
    },

    // Get selected text data.
    get_selection_data() {
      let selectionText = tinyMCE.activeEditor.selection.getContent();
      if ( selectionText !== "" ) {
        // Deselect the text.
        tinymce.activeEditor.selection.collapse();
        return {
          blockID: 0,
          selectionText: selectionText,
          index: tinymce.activeEditor.selection.getBookmark(),
        };
      }
      return "";
    },

    // Add new paragraph under the selected text.
    add_paragraph_block( index, content ) {
      tinymce.activeEditor.selection.moveToBookmark(index);
      content = '<p id="block-' + 0 + '" style="display: none;">' + content + '</p>';
      window.parent.send_to_editor( content );

      // Run the flick animation on the generated text.
      this.wordFlick(content, index, "block-" + 0, false);
    },

    // Add new outline in given position.
    add_outline_block( index, content ) {
      let self = this;
      let contentArray = content.split('\n');
      if ( contentArray.length == 1 ) {
        contentArray = content.split('•');
      }
      if ( contentArray.length == 1 ) {
        contentArray = content.split(' - ');
      }

      self.add_heading_block(index, contentArray, 0);
    },

    // Add a heading block and run an animation.
    add_heading_block (index, contentArray, i) {
      let self = this;
      if ( typeof contentArray[i] !== "undefined" ) {
        let value = contentArray[i];
        if (value.charAt(0) === '•' || value.charAt(0) === '-') {
          value = value.substring(1);
        }
        value = value.trim();
        if ( value != "" ) {
          tinymce.activeEditor.selection.moveToBookmark(index);
          content = '<h2 id="block-' + 0 + '" style="display: none;">' + value + '</h2>';
          window.parent.send_to_editor( content );

          // Run the flick animation on the generated text.
          self.wordFlick(value, index, "block-" + 0, true, contentArray, i);
        }
      }
    },

  };


  $( function() {
    AIButtonApp.init();
  } );
}( jQuery ) );