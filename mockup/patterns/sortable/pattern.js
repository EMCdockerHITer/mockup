/* Sortable pattern.
 *
 * Options:
 *    selector(string): Selector to use to draggable items in pattern ('li')
 *    dragClass(string): Class to apply to original item that is being dragged. ('item-dragging')
 *    cloneClass(string): Class to apply to cloned item that is dragged. ('dragging')
 *    drop(function, string): Callback function or name of callback function in global namespace to be called when item is dropped ('')
 *
 * Documentation:
 *    # Default
 *
 *    {{ example-1 }}
 *
 *    # Table
 *
 *    The patttern needs to be defined on the direct parent element of the elements to be sorted.
 *    Heads up: A <tbody> would be added to the table by browser automatically.
 *    The pattern needs to be defined on the <tbody> then.
 *
 *    {{ example-2 }}
 *
 * Example: example-1
 *    <ul class="pat-sortable">
 *      <li>One</li>
 *      <li>Two</li>
 *      <li>Three</li>
 *    </ul>
 *
 * Example: example-2
 *    <table class="table table-stripped">
 *      <tbody class="pat-sortable" data-pat-sortable="selector:tr;">
 *        <tr>
 *          <td>One One</td>
 *          <td>One Two</td>
 *        </tr>
 *        <tr>
 *          <td>Two One</td>
 *          <td>Two Two</td>
 *        </tr>
 *        <tr>
 *          <td>Three One</td>
 *          <td>Three Two</td>
 *        </tr>
 *      </tbody>
 *    </table>
 *
 */

define(["jquery", "pat-base", "Sortable"], function ($, Base, Sortable) {
  "use strict";

  var SortablePattern = Base.extend({
    name: "sortable",
    trigger: ".pat-sortable",
    parser: "mockup",
    defaults: {
      selector: "li",
      dragClass: "item-dragging",
      cloneClass: "dragging",
      drop: undefined, // callback function or name of global function
    },
    init: function () {
      var sortable = new Sortable.default(this.$el[0], {
        draggable: this.options.selector,
      });
      sortable.on(
        "sortable:start",
        function (data) {
          // TODO: ??? API seems to be quite different from the docs
          var $orig_el = $(data.dragEvent.data.originalSource);
          var $el = $(data.dragEvent.data.source);
          $orig_el.addClass(this.options.dragClass);
          $el.addClass(this.options.cloneClass);
        }.bind(this)
      );

      sortable.on(
        "sortable:stop",
        function (data) {
          var $orig_el = $(data.dragEvent.data.originalSource);
          var $el = $(data.dragEvent.data.source);
          $orig_el.removeClass(this.options.dragClass);
          $el.removeClass(this.options.cloneClass);
          if (!this.options.drop) {
            return;
          }
          var cb = this.options.drop;
          if (typeof cb === "string") {
            cb = window[this.options.drop];
          }
          cb($el, data.newIndex - data.oldIndex);
        }.bind(this)
      );
    },
  });

  return SortablePattern;
});
