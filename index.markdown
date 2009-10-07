---
layout: default
title: by Arni Einarsson
---
## DESCRIPTION:

An implementation of lightbox style dialogs to replace native browser
dialogs (alert, confirm, prompt).

## FEATURES/PROBLEMS:

* Sprocketized
* Effects are optional
* Customizable via css and asset paths
* Easily extendable
* Unit tested

## SYNOPSIS:

#### Showing simple alerts

<pre><code class="javascript">
$alert('This is a dialog');
</code></pre>

#### Getting confirmation

<pre><code class="javascript">
$confirm('Are you sure?', function(yes) {
  if (yes) $alert('Good for you');
  else $alert('Boohoo');
});
</code></pre>

#### Prompting a question

<pre><code class="javascript">
$prompt('What is your name?', function(answer) {
  if (answer) $alert('Hi, ' + answer);
  else $alert('How rude!');
});
</code></pre>

#### Loading ajax content

<pre><code class="javascript">
new Dialog.Ajax('/path/to/content');
</code></pre>

#### Doing something custom

<pre><code class="javascript">
new Dialog.Base({
  content: '&lt;form action="/login" method="post">&lt;p>&lt;label for="login">Login&lt;/label>&lt;br/>&lt;input type="text" name="login" id="login"/>&lt;/p>&lt;p>&lt;label for="password">Password&lt;/label>&lt;br/>&lt;input type="password" name="password" id="password"/>&lt;/p>&lt;/form>',
  buttons: [
    {text: 'Login', close: false, onclick: function(event) {
      event.stop();
      event.element().up('.dialog').down('form').submit();
    }},
    {text: 'Cancel', close: true, onclick: Event.stopper}
  ],
  afterShow: function() {
    Dialog.current().contents.down('input').activate();
  }
});
</code></pre>

#### Options to dialogs

You can set protototo defaults via `DialogOptions`.

By default protototo assumes that asset paths are:

* /images/protototo
* /stylesheets/protototo

If you want these to be different you can specify options before loading
protototo:

<pre><code class="javascript">
DialogOptions = {
  assetPrefix: '/your/prefix', 
  stylesheetPath: '/path/to/stylesheet.css', // will look in /your/prefix/path/to/stylesheet.css
  busyImage: '/path/to/ajax/working.gif' // will look in /your/prefix/path/to/ajax/working.gif
};
</code></pre>

Other default options for all dialogs (these are the actual defaults):

<pre><code class="javascript">
DialogOptions = {
  overlayOpacity: 0.75,
  transitionDuration: 0.4,
  defaultWidth: 400,
  Buttons: {
    template: new Template('&lt;a href="#" class="#{className}">#{text}&lt;/a>') // how to build buttons
  }
};
</code></pre>

Options you can pass to dialogs to override defaults:

* `width`: overrides the default width
* `modal`: true if you want to simulate a modal dialog
* `transitionDuration`: overrides the default transition time
* `buttons`: an array of button descriptions

Button descriptions depend on the template used to create buttons.
The description should at least include the attributes needed to fill the
template, a default className is provided.

Additionally each button description accepts

* `close`: true if you want the button to close the dialog
* `onclick`: a function to execute when the button is clicked

## REQUIREMENTS:

* Prototype 1.6.1
* Script.aculo.us effects 1.8.2 (preferred but not required)

## INSTALL:

* Download <http://cloud.github.com/downloads/dwg/protototo/protototo-v1.0.tar.gz>
* Extract tar ball
* Copy the contents of dist to your server

Then include the following in the html where you want protototo:

<pre><code class="html">
&lt;script type="text/javascript" src="path/to/prototype.js">&lt;/script>
&lt;script type="text/javascript" src="path/to/effects.js">&lt;/script>
&lt;script type="text/javascript" src="path/to/protototo.js">&lt;/script>
</code></pre>

## LICENSE:

(The MIT License)

Copyright (c) 2009 Arni Einarsson <arni.dwg@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.