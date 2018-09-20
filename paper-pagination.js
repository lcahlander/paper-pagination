import {
  html,
  PolymerElement
} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';

/**
 * `paper-pagination`
 * Pagination for selecting which page of results to display.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class EmhPagination extends PolymerElement {
  static get template() {
    return html `
    <style>
      :host {
        display: block;
        --paper-icon-button: { width: 64px; height: 64px; }
        --paper-item: { border: 1px black; border-radius: 3px; }
      }
      td {
      text-align: center;
      }
      .paper-menu-0 {
        horizontal-align: center;
      }
      paper-item.paper-pagination {
        float: left;
      }
      paper-button.paper-pagination {
        float: left;
      }
      
    </style>
    <div class="container">
      <paper-listbox selected="{{currentPage}}" selected-attribute="page" id="paper-pagination-row">
        <template is="dom-repeat" items="[[pages]]" restamp="true">
          <paper-item raised class="paper-pagination"  hidden$="[[item.hidden]]"  page="[[item.page]]">[[displayPageNumber(item.page)]]</paper-item>
        </template>
      </paper-listbox>
      <template is="dom-if" if="{{showProperties}}">
        <div>
          <table style="background-color: lightgrey; width: 100%;">
            <thead>
              <tr>
                <th>page-size</th>
                <th>total</th>
                <th>range-size</th>
                <th>current-page</th>
                <th>offset</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{pageSize}}</td>
                <td>{{total}}</td>
                <td>{{rangeSize}}</td>
                <td>{{currentPage}}</td>
                <td>{{offset}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>
        `;
  }
  static get properties() {
    return {
      prop1: {
        type: String,
        value: 'bar-element',
      },
      /**
       * Shows the table below that shows the properties.
       */
      showProperties: {
        type: Boolean,
        value: false
      },
      /**
       * Number of items in a page of data.
       */
      pageSize: {
        type: Number,
        value: 10,
        observer: 'pageSizeChanged(offset, pageSize)'
      },
      /**
       * The total number of elements to be paginated.
       */
      total: {
        type: Number,
        observer: 'totalChanged'
      },
      /**
       *
       */
      pages: {
        type: Array,
        readOnly: true,
        computed: 'calculatePages(pageSize,total,currentPage)'
      },
      /**
       * The number of pages listed around the current page
       */
      rangeSize: {
        type: Number,
        value: 10
      },
      /**
       * The currently selected page
       */
      currentPage: {
        type: Number,
        value: 0,
        notify: true,
        observer: 'currentPageChanged'
      },
      /**
       * The offset in the list of items at the beginning of the selected page.
       */
      offset: {
        type: Number,
        value: 1,
        notify: true,
        observer: 'offsetChanged'
      }
    };
  }

  created() {
    super.created();
    this.updating = true;
  }

  ready() {
    super.ready();
    this.updating = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.updating = false;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.updating = true;
  }

  displayPageNumber(x) {
    return x + 1;
  }
  pageSizeChanged(offset, pageSize) {
    if (this.updating) return;
    this.updating = true;
    if (pageSize && offset)
      this.currentPage = (offset - 1) / pageSize;
    else
      this.currentPage = 0;
    this.updating = false;
  }
  totalChanged() {
    if (this.updating) return;
    this.updating = true;
    if ((this.offset == null) || (this.offset >= this.total)) {
      this.currentPage = 0;
      this.offset = 1;
    } else {
      this.currentPage = (this.offset - 1) / this.pageSize;
    }
    this.updating = false;
  }
  currentPageChanged() {
    if (this.updating) return;
    this.updating = true;
    this.offset = (this.currentPage * this.pageSize) + 1;
    this.updating = false;
  }
  offsetChanged() {
    if (this.updating) return;
    this.updating = true;
    this.currentPage = (this.offset - 1) / this.pageSize;
    this.updating = false;
  }
  calculatePages(size, total, current_page) {
    function start_link($p, $g, $n) {
      var $s = $p - Math.floor($n / 2);
      if ($s < 1) {
        return 1;
      }
      var $max_s = $g - ($n - 1);
      if ($s > $max_s) {
        return $max_s;
      }
      return $s;
    }
    var totalPage = this.pageCount = Math.ceil(total / size);
    var result = [];
    var startRange = start_link(current_page, totalPage, this.rangeSize);
    var endRange = Math.min(totalPage, (startRange + this.rangeSize));
    for (var i = 0; i < totalPage; i++) {
      var hidden = (i != 0 && i < startRange || i > endRange && i != (this.pageCount - 1));
      result.push({
        page: i,
        value: i,
        hidden: hidden
      });
    }
    return result;
  }

}

window.customElements.define('paper-pagination', EmhPagination);
