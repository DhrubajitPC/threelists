import { LoremIpsum } from "lorem-ipsum";

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4,
  },
  wordsPerSentence: {
    max: 16,
    min: 4,
  },
});

let list1,
  mainList,
  list2,
  btn1,
  btn2,
  feed1Timer,
  feed2Timer,
  classMap,
  selectedItem;

window.onload = function () {
  list1 = document.getElementsByClassName("list1")[0];
  mainList = document.getElementsByClassName("mainList")[0];
  list2 = document.getElementsByClassName("list2")[0];
  btn1 = document.getElementById("btn1");
  btn2 = document.getElementById("btn2");

  btn1.addEventListener("click", handleBtnClick);
  btn2.addEventListener("click", handleBtnClick);
  classMap = new Map([
    [list1, "list1-item"],
    [mainList, "mainList-item"],
    [list2, "list2-item"],
  ]);
};

function addItem(data, el) {
  const node = document.createElement("p");
  node.classList.add(classMap.get(el));
  node.innerText = data;
  node.addEventListener("click", handleItemClick);
  el.prepend(node);
}

function genFeed(feedNo, delay = 600) {
  const timer = setInterval(() => {
    const d = lorem.generateSentences(2);
    if (feedNo === 1) {
      addItem(d, list1);
      if (list1.children.length == 15) {
        list1.removeChild(list1.children[list1.children.length - 1]);
      }
    } else {
      addItem(d, list2);
      if (list2.children.length == 15) {
        list2.removeChild(list2.children[list2.children.length - 1]);
      }
    }
  }, delay);

  feedNo === 1 ? (feed1Timer = timer) : (feed2Timer = timer);
}

function clearTimers() {
  feed1Timer.clearInterval();
  feed2Timer.clearInterval();
}

function startFeed(feedNo) {
  feedNo === 1 ? genFeed(feedNo, 1600) : genFeed(feedNo, 1800);
}

function stopFeed(feedNo) {
  feedNo === 1 ? clearInterval(feed1Timer) : clearInterval(feed2Timer);
}

function handleBtnClick(ev) {
  if (ev.target.innerText.toLowerCase() === "start") {
    ev.target.id === "btn1" ? startFeed(1) : startFeed(2);
    ev.target.innerText = "Pause";
  } else {
    ev.target.id === "btn2" ? stopFeed(2) : stopFeed(1);
    ev.target.innerText = "Start";
  }
}

function handleItemClick(ev) {
  const item = ev.target;
  const itemDim = item.getBoundingClientRect();
  const node = item.cloneNode(true);
  node.classList.add("floating");
  document.body.appendChild(node);
  node.style.left =
    itemDim.left - parseInt(getComputedStyle(item).marginLeft, 10) + "px";
  node.style.top =
    itemDim.top - parseInt(getComputedStyle(item).marginTop, 10) + "px";
  item.remove();
  selectedItem = node;
  requestAnimationFrame(animate);
}

function animate() {
  const dim = mainList.getBoundingClientRect();
  selectedItem.style.top = dim.top + "px";
  selectedItem.style.left = dim.left + "px";
  selectedItem.addEventListener("transitionend", afterTransition);
}

function afterTransition(ev) {
  const selectedItem = ev.target;
  selectedItem.classList.remove("floating");
  selectedItem.remove();
  mainList.prepend(selectedItem);
}
