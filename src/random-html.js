import seedrandom from 'seedrandom';


const randomTagName = (options, state) => {
  return 'div'; // TODO
};


const randomProps = (options, state) => {
  return {}; // TODO
};


const generate = (options, state) => {
  var result = {};

  result.name = randomTagName(options, state);
  result.props = randomProps(options, state);

  var cntChildren = (undefined !== options.maxHeight && state.height == options.maxHeight)
      ? 0
      : (state.rng() * (options.maxWidth + 1))|0;

  result.children = (!cntChildren)
    ? ["text"]
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

const encodeEntity = c => {
  switch(c.charCodeAt(0)) {
  case code_apos: return '&apos;';
  case code_quot: return '&quot;';
  case code_lt:   return '&lt;';
  case code_gt:   return '&gt;';
  case code_amp:  return '&amp;';
  }
};


/** Transform intermediate structure to HTML-string

   @arg {Object} options - User-provided options to renderer.
   @arg {bool} options.ident - Whether to pretty-print HTML.
   @arg {bool} options.encodeEntities - Whether to encode XML(!)
   entities.
   @arg {Object} s - The structure in question.

   @return {string} HTML.
*/
const renderHTML = options => s => ((prefix, newline) => (typeof s == 'string')
  ? prefix + (options.encodeEntities ? s.replace(/['"<>&]/g, encodeEntity): s) + newline
  : (prefix + '<' + s.name
     + (Object.keys(s.props).map(key => ' ' + key + '="' + s.props[key] + '"')).join('')
     + '>' + newline
     + s.children.map(renderHTML(Object.assign({}, options, {prefix: prefix + '  '}))).join('')
     + prefix + '</' + s.name + '>' + newline))(
  (options && options.ident ? (undefined === options.prefix ? '' : options.prefix) : '')
, (options && options.ident ? '\n' : ''));



/** Generate random html snippet.

   @arg {Object} [userOptions] - User-provided parameters.

   @arg {number} [userOptions.maxHeight] - Maximum number of nested
   tags.

   @arg {number} [userOptions.maxWidth = 3] - Maximum number of
   children for each node.

   @arg {Object} [userOptions.rng = seedrandom(Math.random())] -
   Pseudo random number generator. If not specified, one with random
   seed will be used.

   @return {string} HTML snippet.
*/
const randomHTML = (userOptions) => {
  var defaultOptions = {
    maxWidth: 3
  };
  var options = Object.assign({}, defaultOptions, userOptions || {});

  var state = {
    height: 0
  , rng: seedrandom(options.seed || Math.random())
  };

  return renderHTML(true)(generate(options, state));
};


export {randomHTML, renderHTML}
