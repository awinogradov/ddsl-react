'use strict';

const DDSL = require('xjst-ddsl/lib/ddsl');
const React = require('react');
const camelCase = require('camel-case');

const capitalizableDict = {
  acceptcharset: 'acceptCharset',
  accesskey: 'accessKey',
  allowfullscreen: 'allowFullScreen',
  allowtransparency: 'allowTransparency',
  autocomplete: 'autoComplete',
  autofocus: 'autoFocus',
  autoplay: 'autoPlay',
  cellpadding: 'cellPadding',
  cellspacing: 'cellSpacing',
  charset: 'charSet',
  classid: 'classID',
  class: 'className',
  classname: 'className',
  colspan: 'colSpan',
  contenteditable: 'contentEditable',
  contextmenu: 'contextMenu',
  crossorigin: 'crossOrigin',
  datetime: 'dateTime',
  enctype: 'encType',
  formaction: 'formAction',
  formenctype: 'formEncType',
  formmethod: 'formMethod',
  formnovalidate: 'formNoValidate',
  formtarget: 'formTarget',
  frameborder: 'frameBorder',
  htmlfor: 'htmlFor',
  for: 'htmlFor',
  httpequiv: 'httpEquiv',
  marginheight: 'marginHeight',
  marginwidth: 'marginWidth',
  maxlength: 'maxLength',
  mediagroup: 'mediaGroup',
  novalidate: 'noValidate',
  radiogroup: 'radioGroup',
  readonly: 'readOnly',
  rowspan: 'rowSpan',
  spellcheck: 'spellCheck',
  srcdoc: 'srcDoc',
  srcset: 'srcSet',
  tabindex: 'tabIndex',
  usemap: 'useMap',
  value: 'defaultValue',
  checked: 'defaultChecked'
};

module.exports = function (templates) {
  // REACT TRANSFORMATIONS IN RUNTIME
  const runtime = new DDSL({
    generateKeys: true,
    constructor: function (ddsl, js) {
      var props = null;
      if (ddsl[1]) {
        props = {};
        // capitalize react props
        Object.keys(ddsl[1]).forEach(function (key) {
          if (capitalizableDict[key]) {
            props[capitalizableDict[key]] = ddsl[1][key];
          } else {
            props[key] = ddsl[1][key];
          }
        });
        // objectify inline styles
        if (props.style) {
          props.style = props.style.split(';').reduce((ruleMap, ruleString) => {
            if (ruleString) {
              const rulePair = ruleString.split(/:(.+)/);
              ruleMap[camelCase(rulePair[0].trim())] = rulePair[1].trim();
            }
            return ruleMap;
          }, {});
        }
      }
      // bind events
      if (js) {
        props = Object.assign(props || {}, js);
      }
      // props are second argument
      ddsl[1] = props;
      // return react element to runtime
      return React.createElement.apply(
        React.createElement,
        ddsl
      );
    }
  });

  var ddslRuntime = {};
  runtime.compile(templates || '');
  runtime.exportApply(ddslRuntime);

  return ddslRuntime;
}
