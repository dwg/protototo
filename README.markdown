protototo
=========

by **Arni Einarsson** (dwg)  
<http://dwg.lighthouseapp.com/projects/37440-protototo>

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

    Dialog.alert('This is a dialog');

#### Getting confirmation
  
    Dialog.confirm('Are you sure?', function(yes) {
      if (yes) Dialog.alert('Good for you');
      else Dialog.alert('Boohoo');
    });

#### Prompting a question

    Dialog.prompt('What is your name?', function(answer) {
      if (answer) Dialog.alert('Hi, ' + answer);
      else Dialog.alert('How rude!');
    });

#### Loading ajax content

    new Dialog.Ajax('/path/to/content');

#### Doing something custom

    new Dialog.Base({
      content: '<form action="/login" method="post"><p><label for="login">Login</label><br/><input type="text" name="login" id="login"/></p><p><label for="password">Password</label><br/><input type="password" name="password" id="password"/></p></form>',
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

#### Options to dialogs

You can set protototo defaults via `DialogOptions`.

By default protototo assumes that asset paths are:

* /images/protototo
* /stylesheets/protototo

If you want these to be different you can specify options before loading
protototo:

    DialogOptions = {
      assetPrefix: '/your/prefix', 
      stylesheetPath: '/path/to/stylesheet.css', // will look in /your/prefix/path/to/stylesheet.css
      busyImage: '/path/to/ajax/working.gif' // will look in /your/prefix/path/to/ajax/working.gif
    };

Other default options for all dialogs (these are the actual defaults):

    DialogOptions = {
      overlayOpacity: 0.75,
      transitionDuration: 0.4,
      defaultWidth: 400,
      Buttons: {
        template: new Template('<a href="#" class="#{className}">#{text}</a>') // how to build buttons
      }
    };

Options you can pass to dialogs to override defaults:

* `width`: overrides the default width
* `modal`: true if you want to simulate a modal dialog
* `transitionDuration`: overrides the default transition time
* `buttons`: an array of button descriptions

Button descriptions depend on the template used to create buttons.
For a template like

    <a href="#" class="#{className}">#{text}</a>

the description should include at least `text` and optionally a `className`.
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

    <script type="text/javascript" src="path/to/prototype.js"></script>
    <script type="text/javascript" src="path/to/effects.js"></script>
    <script type="text/javascript" src="path/to/protototo.js"></script>

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