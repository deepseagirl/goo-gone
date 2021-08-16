function degoo(match, p1, p2, p3, p4, p5, offset, string) {
  return p1 + decodeURIComponent(p3).replaceAll(' ', '+') + p5;
}

const test    = /Please click <a href="(\/search\?.+?(?=">here<\/a>))">here<\/a> if you/g;
const str     = document.body.textContent;
const array   = [...str.matchAll(test)];
const cleaned = array[0][1].replaceAll('&amp;', '&');
const target  = new Request("https://www.google.com" + cleaned);
const re      = /(<a href=")(\/url\?q=)(http.+?(?=&amp;(?:sa|ved|usg)=))(&amp;(?:sa|ved|usg)=.+?(?="><[spandiv]{3,4}))("><[spandiv]{3,4} class="[A-Za-z\d ]+">.*?(?=<[spandiv]{3,4}))/g;

// thank u mozilla.org
var result     = fetch(target).then(response => response.body).then(rb => {
  const reader = rb.getReader();
  return new ReadableStream({
    start(controller) {
      function push() {
        reader.read().then(  ({done,value}) => {
        if (done) {
          controller.close();
          return;
        }
        controller.enqueue(value);
        push();
        })
      }
      push();
    }
  });
})
.then(stream => {
  return new Response(stream, { headers: { "Content-Type": "text/html" } }).text();
})
.then(result => {
  let newresult = result.replaceAll(re, degoo);
  document.body.innerHTML = newresult; // accidentally discards some parts of the dom that we want to keep ;-; fix next time
});