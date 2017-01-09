import seedrandom from 'seedrandom';

// Bob Floyd's algorithm
const randomSample = (m, n, rng) => {
  var used = Array(n);

  for (let i = n - m; i < n; ++i) {
    let r = (rng() * (i + 1))|0;
    r = (used[r]) ? i : r;
    used[r] = true;
  }

  return used
    .map((f, i) => f ? i : undefined)
    .filter(i => undefined !== i);
};

const randomText = (options, state) => {
  return 'text'; // TODO
};

const randomTagName = (options, state) => {
  return 'div'; // TODO
};


const allProps = ['foo', 'bar', 'baz', 'qux', 'quux', 'corge', 'grault', 'garply'];

const randomProps = (options, state) => {
  var result = {};

  var cntProps = (state.rng() * (options.maxProps + 1))|0;
  randomSample(cntProps, allProps.length, state.rng).forEach(i => {
    result[allProps[i]] = randomText(options, state);
  });

  return result;
};


const generate = (options, state) => {
  var result = {};

  result.name = randomTagName(options, state);
  result.props = randomProps(options, state);

  var cntChildren = (undefined !== options.maxHeight && state.height == options.maxHeight)
      ? 0
      : (state.rng() * (options.maxWidth + 1))|0;

  result.children = (!cntChildren)
    ? [randomText(options, state)]
    : [...Array(cntChildren).keys()].map(_ => generate(options, Object.assign({}, state, {
      height: 1 + state.height
    , parent: result.name
    })));
    
  return result;
};

const code_apos = "'".charCodeAt(0);
const code_quot = '"'.charCodeAt(0);
const code_lt   = '<'.charCodeAt(0);
const code_gt   = '>'.charCodeAt(0);
const code_amp  = '&'.charCodeAt(0);
const code_bang = '!'.charCodeAt(0);

const encodeEntity = c => {
  switch(c.charCodeAt(0)) {
  case code_apos: return '&apos;';
  case code_quot: return '&quot;';
  case code_lt:   return '&lt;';
  case code_gt:   return '&gt;';
  case code_amp:  return '&amp;';
  }
};


/** Transform intermediate structure to HTML-string.

   @arg {Object} [options] - User-provided options to renderer.

   @arg {bool} [options.ident = false] - Whether to pretty-print HTML.

   @arg {bool} [options.encodeEntities = false] - Whether to encode
   XML(!) entities.

   @arg {Object} s - The structure in question.

   @return {string} HTML.
*/
const renderHTML = options => s => ((prefix, newline) => (typeof s == 'string')
  ? prefix + (options.encodeEntities ? s.replace(/['"<>&]/g, encodeEntity): s) + newline
  : (s.name.toLowerCase() == '!doctype') ? (prefix + '<' + s.name + ' ' + s.children[0] + '>')
  : (s.name == '!--') ? (prefix + '<!--' + s.children[0] + '-->')
  : (prefix + '<' + s.name
     + (Object.keys(s.props).map(key => ' ' + key + '="' + s.props[key] + '"')).join('')
     + '>' + newline
     + s.children.map(renderHTML(Object.assign({}, options, {prefix: prefix + '  '}))).join('')
     + prefix + '</' + s.name + '>' + newline))(
  (options && options.ident ? (undefined === options.prefix ? '' : options.prefix) : '')
, (options && options.ident ? '\n' : ''));


/** Generate random html represented as object.

   @arg {Object} [userOptions] - User-provided parameters.

   @arg {number} [userOptions.maxHeight] - Maximum number of nested
   tags.

   @arg {number} [userOptions.maxWidth = 3] - Maximum number of
   children for each node.

   @arg {number} [userOptions.maxProps = 0] - Maximum number of
   properties for each node.

   @arg {Object} [userOptions.rng = seedrandom(Math.random())] -
   Pseudo random number generator. If not specified, one with random
   seed will be used.

   @return {Object} HTML snippet.
*/
const randomHTMLObject = (userOptions) => {
  var defaultOptions = {
    maxWidth: 3
  , maxProps: 0
  };

  var options = Object.assign({}, defaultOptions, userOptions || {});

  var state = {
    height: 0
  , rng: seedrandom((undefined !== options.seed) ? options.seed : Math.random())
  };

  return generate(options, state);
};


/** Generate random html snippet.
   @arg {Object} [generateOptions] - User-provided parameters (as in
   `randomHTMLObject`).

   @arg {Object} [renderOptions] - User-provided parameters (as in
   `renderHTML`).

   @return {string} HTML snippet.
*/
const randomHTML = (generateOptions, renderOptions) => {
  return renderHTML(renderOptions)(randomHTMLObject(generateOptions));
};


export {randomHTML, randomHTMLObject, renderHTML}
