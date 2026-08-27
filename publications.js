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

    function prepareTldr(paper, paperIndex) {
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
      var toggle = document.createElement('button');
      var paperView = paper.closest('.publication-view');
      var tldrId = paperView.id + '-tldr-' + paperIndex;
      var arxivLink = paper.querySelector('a[href*="arxiv.org/abs/"]');
      var insertionPoint = arxivLink && arxivLink.nextSibling;
      var breakBeforeTldr = tldrLabel.previousElementSibling;
      var node = tldrLabel;

      if (breakBeforeTldr && breakBeforeTldr.tagName === 'BR') {
        paragraph.removeChild(breakBeforeTldr);
      }

      paragraph.insertBefore(wrapper, tldrLabel);
      wrapper.className = 'paper-tldr';
      wrapper.id = tldrId;
      wrapper.hidden = true;

      while (node) {
        var nextNode = node.nextSibling;
        wrapper.appendChild(node);
        node = nextNode;
      }

      toggle.type = 'button';
      toggle.className = 'paper-tldr-toggle';
      toggle.textContent = 'TL;DR ▾';
      toggle.setAttribute('aria-controls', tldrId);
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Show TL;DR');

      if (insertionPoint) {
        paragraph.insertBefore(toggle, insertionPoint.nextSibling);
      } else {
        paragraph.insertBefore(toggle, wrapper);
      }
    }

    var chronologicalPapers = Array.prototype.slice.call(topicPapers);
    chronologicalPapers.sort(function (paperA, paperB) {
      return arxivSequence(paperB) - arxivSequence(paperA);
    });

    for (var paperIndex = 0; paperIndex < chronologicalPapers.length; paperIndex += 1) {
      chronologicalList.appendChild(chronologicalPapers[paperIndex].cloneNode(true));
    }

    var allPapers = document.querySelectorAll('.publication-view ol > li');
    for (var allPaperIndex = 0; allPaperIndex < allPapers.length; allPaperIndex += 1) {
      prepareTldr(allPapers[allPaperIndex], allPaperIndex);
    }

    var tldrToggles = document.querySelectorAll('.paper-tldr-toggle');
    for (var toggleIndex = 0; toggleIndex < tldrToggles.length; toggleIndex += 1) {
      tldrToggles[toggleIndex].addEventListener('click', function () {
        var isExpanded = this.getAttribute('aria-expanded') === 'true';
        var tldr = document.getElementById(this.getAttribute('aria-controls'));

        tldr.hidden = isExpanded;
        this.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
        this.setAttribute('aria-label', isExpanded ? 'Show TL;DR' : 'Hide TL;DR');
        this.textContent = isExpanded ? 'TL;DR ▾' : 'TL;DR ▴';
      });
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
