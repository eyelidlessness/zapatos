// animated heading

window.addEventListener('load', function () {
  Array.prototype.slice.call(document.querySelectorAll('h1 .extra-vowels')).forEach(function (vowel) {
    Object.assign(vowel.style, { top: '0px', opacity: 1 });
  });
});

// tocbot

tocbot.init({
  tocSelector: '#toc',
  contentSelector: '#content',
  headingSelector: 'h1, h2, h3, h4',
  includeHtml: true,
});

var
  toc = document.getElementById('toc'),
  showTocMsg = 'Menu »',
  hideTocMsg = '« Menu';

toc.insertAdjacentHTML('beforebegin', '<a href="#" id="toc-toggle">' + showTocMsg + '</a>')

document.addEventListener('click', function (e) {
  var target = e.target;
  if (target.id === 'toc-toggle') {
    e.preventDefault();
    if (toc.style.display === 'block') {
      toc.style.display = 'none';
      target.innerText = showTocMsg;
    } else {
      toc.style.display = 'block';
      target.innerText = hideTocMsg;
    }
  }
});

// SQL/result sections

var
  sqlstuff = Array.prototype.slice.call(document.getElementsByClassName('sqlstuff')),
  showSQLMsg = '▸ Show generated SQL, results',
  hideSQLMsg = '▾ Hide generated SQL, results';

sqlstuff.forEach(function (s) {
  s.style.display = 'none';
  s.insertAdjacentHTML('beforebegin', '<p><a class="sqltoggle" href="#">' + showSQLMsg + '</a></p>');
});

document.addEventListener('click', function (e) {
  var target = e.target;

  if (target.className === 'sqltoggle') {
    e.preventDefault();
    var sqlstuff = target.parentElement.nextElementSibling;

    if (sqlstuff.style.display === 'block') {
      sqlstuff.style.display = 'none';
      target.innerText = showSQLMsg;

    } else {
      sqlstuff.style.display = 'block';
      target.innerText = hideSQLMsg;
    }
  }
});

// TS sections / monaco

require.config({ paths: { 'vs': './monaco/vs' } });

var
  runnables = Array.prototype.slice.call(document.getElementsByClassName('runnable'))
    .filter(r => !r.className.match(/\bnorun\b/)),
  showImportsMsg = '▸ Show imports',
  hideImportsMsg = '▾ Hide imports';

runnables.forEach(function (runnable) {
  runnable.insertAdjacentHTML('afterbegin',
    '<a class="openmonaco" href="#" title="See this in embedded VS Code">Explore types »</a>' +
    '<a class="toggleimports" href="#">' + showImportsMsg + '</a>');
});

document.body.insertAdjacentHTML('afterbegin',
  '<div id="monaco-overlay"><div id="ts-editor"></div><a id="closemonaco" href="#">×</a></div>');

document.addEventListener('click', function (e) {
  var target = e.target;

  if (target.className === 'openmonaco') {
    e.preventDefault();
    var
      importsElement = target.nextElementSibling.nextElementSibling,
      codeElement = target.nextElementSibling.nextElementSibling.nextElementSibling,
      code = importsElement.innerText.trim() + '\n\n' +
        '(async () => {  // no support for top-level await in Monaco 0.20, TS 3.7\n' +
        codeElement.innerText.trim().replace(/^/gm, '  ') +
        '\n})();';

    if (!window.monaco) require(['vs/editor/editor.main'], function () {
      var
        ts = monaco.languages.typescript,
        tsDefs = ts.typescriptDefaults;

      tsDefs.setCompilerOptions({
        strict: true,
        target: ts.ScriptTarget.ES2017,
      });
      for (var file in zapatosBundle) tsDefs.addExtraLib(zapatosBundle[file], `file:///${file}`);

      var
        editor = document.getElementById('ts-editor'),
        commonOpts = {
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontFamily: 'source-code-pro',
          fontSize: 15,
          theme: 'vs-dark',
          automaticLayout: true,  // resize with host <div>
        },
        uri = monaco.Uri.parse(`file:///main.ts`),
        model = monaco.editor.createModel('/* nothing */', 'typescript', uri),
        opts = Object.assign({ model: model }, commonOpts);

      window.activeMonacoEditor = monaco.editor.create(editor, opts);
      openMonaco(code);
    });

    else openMonaco(code); // without waiting

  } else if (target.id === 'closemonaco') {
    e.preventDefault();

    var overlay = document.getElementById('monaco-overlay');
    overlay.style.display = 'none';

  } else if (target.className === 'toggleimports') {
    e.preventDefault();

    var importsDiv = target.parentElement.children[2];
    if (importsDiv.style.display === 'block') {
      importsDiv.style.display = 'none';
      target.innerText = showImportsMsg;

    } else {
      importsDiv.style.display = 'block';
      target.innerText = hideImportsMsg;
    }
  }
});

function openMonaco(code) {
  var
    overlay = document.getElementById('monaco-overlay'),
    editor = window.activeMonacoEditor;

  overlay.style.display = 'block';
  editor.setValue(code);
  editor.layout();
}
