// Generated by CoffeeScript 1.9.2

/**
@license Sticky-kit v1.1.2 | WTFPL | Leaf Corcoran 2015 | http://leafo.net
 */

var StickInParent = function(opts) {
  var doc, elm, enable_bottoming, fn, i, inner_scrolling, len, manual_spacer, offset_top, outer_width, parent_selector, recalc_every, sticky_class;
  if (opts == null) {
    opts = {};
  }
  sticky_class = opts.sticky_class, inner_scrolling = opts.inner_scrolling, recalc_every = opts.recalc_every, parent_selector = opts.parent, offset_top = opts.offset_top, manual_spacer = opts.spacer, enable_bottoming = opts.bottoming;
  if (offset_top == null) {
    offset_top = 0;
  }
  if (parent_selector == null) {
    parent_selector = void 0;
  }
  if (inner_scrolling == null) {
    inner_scrolling = true;
  }
  if (sticky_class == null) {
    sticky_class = "is_stuck";
  }
  doc = $(document);
  if (enable_bottoming == null) {
    enable_bottoming = true;
  }
  outer_width = function(el) {
    var computed, w;
    if (window.getComputedStyle) {
      computed = window.getComputedStyle(el);
      w = parseFloat(computed.getPropertyValue("width")) + parseFloat(computed.getPropertyValue("margin-left")) + parseFloat(computed.getPropertyValue("margin-right"));
      if (computed.getPropertyValue("box-sizing") !== "border-box") {
        w += parseFloat(computed.getPropertyValue("border-left-width")) + parseFloat(computed.getPropertyValue("border-right-width")) + parseFloat(computed.getPropertyValue("padding-left")) + parseFloat(computed.getPropertyValue("padding-right"));
      }
      return w;
    } else {
      return el.getWidth() +
        parseInt(el.getStyle("padding-left"), 10) +
        parseInt(el.getStyle("padding-right"), 10) +
        parseInt(el.getStyle("margin-left"), 10) +
        parseInt(el.getStyle("margin-right"), 10);
    }
  };
  fn = function(elm, padding_bottom, parent_top, parent_height, top, height, el_float, detached) {
    var bottomed, detach, fixed, last_pos, last_scroll_height, offset, parent, recalc, recalc_and_tick, recalc_counter, spacer, tick;
    if (elm.readAttribute("sticky_kit")) {
      return;
    }
    elm.writeAttribute("sticky_kit", true);
    last_scroll_height = document.body.getHeight();
    parent = elm.up();
    // if (parent_selector != null) {
    //   parent = parent.closest(parent_selector);
    // }
    if (!parent) {
      throw "failed to find stick parent";
    }
    fixed = false;
    bottomed = false;
    spacer = manual_spacer != null ? manual_spacer && elm.closest(manual_spacer) : new Element("div");
    if (spacer) {
      spacer.setStyle('position', elm.getStyle('position'));
    }
    recalc = function() {
      var border_top, padding_top, restore;
      if (detached) {
        return;
      }
      last_scroll_height = document.body.getHeight();
      border_top = parseInt(parent.getStyle("border-top-width"), 10);
      border_top = isNaN(border_top) ? 0 : border_top; // IE10 returns 'medium'
      padding_top = parseInt(parent.getStyle("padding-top"), 10);
      padding_bottom = parseInt(parent.getStyle("padding-bottom"), 10);
      parent_top = parent.cumulativeOffset().top + border_top + padding_top;
      parent_height = parent.getHeight();
      if (fixed) {
        fixed = false;
        bottomed = false;
        if (manual_spacer == null) {
          spacer.insert({
            after: elm
          });
          spacer.remove();
        }
        elm.setStyle({
          position: "static",
          top: "auto",
          width: "",
          bottom: "auto"
        }).removeClassName(sticky_class);
        restore = true;
      }
      top = elm.cumulativeOffset().top - (parseInt(elm.getStyle("margin-top"), 10) || 0) - offset_top;
      height = elm.getDimensions().height + parseInt(elm.getStyle("margin-top"), 10) + parseInt(elm.getStyle("margin-bottom"), 10);
      el_float = elm.getStyle("float");
      if (spacer) {
        spacer.setStyle({
          width: outer_width(elm) + 'px',
          height: height + 'px',
          display: elm.getStyle("display"),
          "vertical-align": elm.getStyle("vertical-align"),
          "float": el_float
        });
      }
      if (restore) {
        return tick();
      }
    };
    recalc();
    // if (height === parent_height) {
    //   return;
    // }
    last_pos = void 0;
    offset = offset_top;
    recalc_counter = recalc_every;
    tick = function() {
      var css, delta, recalced, scroll, will_bottom, win_height;
      if (detached) {
        return;
      }
      recalced = false;
      if (recalc_counter != null) {
        recalc_counter -= 1;
        if (recalc_counter <= 0) {
          recalc_counter = recalc_every;
          recalc();
          recalced = true;
        }
      }
      if (!recalced && document.body.getHeight() !== last_scroll_height) {
        recalc();
        recalced = true;
      }
      scroll = document.viewport.getScrollOffsets().top;
      if (last_pos != null) {
        delta = scroll - last_pos;
      }
      last_pos = scroll;
      if (fixed) {
        if (enable_bottoming) {
          will_bottom = scroll + height + offset > parent_height + parent_top;
          if (bottomed && !will_bottom) {
            bottomed = false;
            elm.setStyle({
              position: "fixed",
              bottom: "auto",
              top: offset + 'px'
            }).fire("sticky_kit:unbottom");
          }
        }
        if (scroll < top) {
          fixed = false;
          offset = offset_top;
          if (manual_spacer == null) {
            if (el_float === "left" || el_float === "right") {
              spacer.insert({
                after: elm
              });
            }
            spacer.remove();
          }
          css = {
            position: "static",
            width: "",
            top: "auto"
          };
          elm.setStyle(css).removeClassName(sticky_class).fire("sticky_kit:unstick");
        }
        if (inner_scrolling) {
          win_height = document.body.getHeight();
          if (height + offset_top > win_height) {
            if (!bottomed) {
              offset -= delta;
              offset = Math.max(win_height - height, offset);
              offset = Math.min(offset_top, offset);
              if (fixed) {
                elm.setStyle({
                  top: offset + "px"
                });
              }
            }
          }
        }
      } else {
        if (scroll > top) {
          fixed = true;
          css = {
            position: "fixed",
            top: offset + 'px'
          };
          css.width = elm.getStyle("box-sizing") === "border-box" ?
            elm.getWidth() + parseInt(elm.getStyle("padding-left"), 10) + parseInt(elm.getStyle("padding-right"), 10) + "px"
              : elm.getWidth() + "px";
          elm.setStyle(css).addClassName(sticky_class);
          if (manual_spacer == null) {
            elm.insert({
              after: spacer
            });
            if (el_float === "left" || el_float === "right") {
              spacer.insert({
                bottom: elm
              });
            }
          }
          elm.fire("sticky_kit:stick");
        }
      }
      if (fixed && enable_bottoming) {
        if (will_bottom == null) {
          will_bottom = scroll + height + offset > parent_height + parent_top;
        }
        if (!bottomed && will_bottom) {
          bottomed = true;
          if (parent.getStyle("position") === "static") {
            parent.setStyle({
              position: "relative"
            });
          }
          return elm.setStyle({
            position: "absolute",
            bottom: padding_bottom + 'px',
            top: "auto"
          }).fire("sticky_kit:bottom");
        }
      }
    };
    recalc_and_tick = function() {
      recalc();
      return tick();
    };
    detach = function() {
      detached = true;
      document.stopObserving("touchmove", tick);
      document.stopObserving("scroll", tick);
      document.stopObserving("resize", recalc_and_tick);
      $(document.body).stopObserving("sticky_kit:recalc", recalc_and_tick);
      elm.stopObserving("sticky_kit:detach", detach);
      elm.writeAttribute("sticky_kit", false);
      elm.setStyle({
        position: "static",
        bottom: "auto",
        top: "auto",
        width: ""
      });
      parent.setStyle("position", "static");
      if (fixed) {
        if (manual_spacer == null) {
          if (el_float === "left" || el_float === "right") {
            spacer.insert({
              after: elm
            });
            // elm.insertAfter(spacer);
          }
          spacer.remove();
        }
        return elm.removeClassName(sticky_class);
      }
    };
    document.observe("touchmove", tick);
    document.observe("scroll", tick);
    document.observe("resize", recalc_and_tick);
    $(document.body).observe("sticky_kit:recalc", recalc_and_tick);
    elm.observe("sticky_kit:detach", detach);
    return setTimeout(tick, 0);
  };
  return {
    stick: function(el) {
      fn(el);
    }
  };
};
