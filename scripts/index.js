function randomSample(arr, n) {
  let arr_shuf = arr.sort(() => 0.5 - Math.random());
  return arr_shuf.slice(0, n);
}

var tabId;
window.onload = () => {
  var resetButton = document.getElementById('trash');
  resetButton.addEventListener('click', () => reset());
  if (localStorage.getItem('apiKey') === null) {
    var apiInput = document.createElement('input');
    apiInput.placeholder = 'Your Pinboard API token'
    var apiInputButton = document.createElement('button');
    apiInputButton.innerHTML = "Login";
    apiInputButton.addEventListener('click', () => {
      localStorage.setItem('apiKey', apiInput.value);
      chrome.tabs.reload(tabId);
    });
    var loginDiv = document.getElementById("login");
    loginDiv.appendChild(apiInput);
    loginDiv.appendChild(apiInputButton);
  } else {
    chrome.tabs.query({
        currentWindow: true,
        active: true
      },
      t => {
        chrome.runtime.sendMessage(t[0].id, () => {});
        tabId = t[0].id;
      });
  }
}

function reset() {
  localStorage.clear();
  chrome.tabs.reload(tabId);
}

chrome.runtime.onMessage.addListener(
  function (req, sender, sendResponse) {
    if(req.status != 'FETCHED' && tabId == req.tabId){
      var cont = document.getElementById('content');
      var statusMsg = document.createElement('p');
      statusMsg.id = 'status';
      if(req.status == 'FETCHING'){
        statusMsg.innerHTML = 'Fetching bookmarks...'
      } else {
        statusMsg.innerHTML = 'Something went wrong :(';
      }
      cont.appendChild(statusMsg);
    }
    if (localStorage.getItem('apiKey') != null && tabId == req.tabId) {
      var links = req.links;
      links = randomSample(links, 10);
      var cont = document.getElementById('content');
      cont.innerHTML = '';
      var cont2 = document.getElementById('content2');
      cont2.innerHTML = '';
      buildDiv(cont,links.slice(0,5));
      buildDiv(cont2,links.slice(5,10));      
    }
    sendResponse({});
    return true;
  }
);

function buildDiv(cont,links)
{
  console.log(links);
  
  for (var c in links) {

    var linkDiv = document.createElement('div');
    linkDiv.className = 'link-div';

    var desc = document.createElement('a');
    var br = document.createElement('br');
    desc.className = 'link-desc';
    desc.innerHTML = links[c].description;

    linkDiv.appendChild(desc);
    linkDiv.appendChild(br);

    var extra = document.createElement('p');
    extra.className = 'link-extra';
    extra.innerHTML = links[c].extended;

    linkDiv.appendChild(extra);

    console.log(links[c].hash);
    console.log(links[c].hash.slice(0,12));

    // https://pinboard.in/u:ghijklmno/b:3eb92143348a
    // 1ed11c04c293ebf3a3592fd3be4262bc
    // 654aeecd9a719bae345cb7dbedc1f986
    // 654aeecd9a719bae345cb7dbedc1f986
    https://pinboard.in/u:ghijklmno/b:654aeecd9a71

    var br2 = document.createElement('br');
    var edit = document.createElement('a');
    edit.className = "pin-link";
    edit.target = '_blank';
    edit.innerHTML = 'edit';
    edit.href = "https://pinboard.in/u:ghijklmno/b:"+links[c].hash.slice(0,12);

    // "https://pinboard.in/search/u:ghijklmno?query="+links[c].description;
    // 

    linkDiv.appendChild(edit);

    var spacer = document.createElement('span');
    spacer.innerHTML = ' | ';
    linkDiv.appendChild(spacer);

    var linkElement = document.createElement('a');
    linkElement.className = "pin-link";
    if (links[c].href.length > 50) {
      linkElement.innerHTML = links[c].href.slice(0, 40) + '...';
    } else {
      linkElement.innerHTML = links[c].href;
    }
    linkElement.href = links[c].href;
    desc.href = links[c].href;
    desc.target = '_blank';
    linkElement.target = '_blank';

    linkDiv.appendChild(linkElement);
    cont.appendChild(linkDiv);
  }
}