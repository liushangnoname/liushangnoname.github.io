(function () {
  function initializePublicationSwitcher() {
    var buttons = document.querySelectorAll('.publication-toggle');
    var views = document.querySelectorAll('.publication-view');
    var chronologicalList = document.getElementById('publications-chronological-list');
    var topicPapers = document.querySelectorAll('#publications-topic ol > li');

    function arxivSequence(paper) {
      var arxivLink = paper.querySelector('a[href*="arxiv.org/abs/"]');
      var match = arxivLink && arxivLink.href.match(/\/abs\/(\d+\.\d+)/);

      return match ? parseInt(match[1].replace('.', ''), 10) : 0;
    }

    function wrapTldr(paper) {
      var italicText = paper.querySelectorAll('i');
      var tldrLabel = null;

      for (var i = 0; i < italicText.length; i += 1) {
        if (italicText[i].textContent.trim() === 'TL;DR:') {
          tldrLabel = italicText[i];
          break;
        }
      }

      if (!tldrLabel) {
        return;
      }

      var paragraph = tldrLabel.parentNode;
      var wrapper = document.createElement('span');
      var node = tldrLabel;
      paragraph.insertBefore(wrapper, tldrLabel);
      wrapper.className = 'paper-tldr';

      while (node) {
        var nextNode = node.nextSibling;
        wrapper.appendChild(node);
        node = nextNode;
      }
    }

    for (var topicIndex = 0; topicIndex < topicPapers.length; topicIndex += 1) {
      wrapTldr(topicPapers[topicIndex]);
    }

    var chronologicalPapers = Array.prototype.slice.call(topicPapers);
    chronologicalPapers.sort(function (paperA, paperB) {
      return arxivSequence(paperB) - arxivSequence(paperA);
    });

    for (var paperIndex = 0; paperIndex < chronologicalPapers.length; paperIndex += 1) {
      chronologicalList.appendChild(chronologicalPapers[paperIndex].cloneNode(true));
    }

    function showView(viewName) {
      var targetId = 'publications-' + viewName;

      for (var i = 0; i < views.length; i += 1) {
        views[i].hidden = views[i].id !== targetId;
      }

      for (var j = 0; j < buttons.length; j += 1) {
        var isActive = buttons[j].getAttribute('data-publication-view') === viewName;
        buttons[j].classList.toggle('active', isActive);
        buttons[j].setAttribute('aria-pressed', isActive ? 'true' : 'false');
      }
    }

    for (var i = 0; i < buttons.length; i += 1) {
      buttons[i].disabled = false;
      buttons[i].addEventListener('click', function () {
        showView(this.getAttribute('data-publication-view'));
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePublicationSwitcher);
  } else {
    initializePublicationSwitcher();
  }
}());
