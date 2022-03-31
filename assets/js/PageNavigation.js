import { addPipes, resizePipes, getSortedHeadingTree, scrollParentToChild } from "./pageNavigationHelpers.js";

// determines offset from top part of viewport
const HIGHLIGHT_OFFSET = 80;

// VARIABLES
const pageNav = document.getElementById("page-nav");
const headingTree = getSortedHeadingTree(document.querySelector("main"));
let highlightedItem = null;
let canScrollIntoView = true;

// FUNCTIONS
// returns nearest heading from view
const getCurrentHeading = function(tree, windowY) {
    // traverse tree
    if (tree.children) {
        // here will be saved node with nearest heading
        let current = null;
        // find node with nearest heading to view
        for (let child of tree.children) {
            if (child.element.offsetTop < windowY) {
                current = child;
            } else {
                break;
            }
        }
        // if node with nearest heading was found, keep traversing and then return
        if (current) {
            current = getCurrentHeading(current, windowY);
            return current;
        }
    }
    // if there are no children, parent is returned
    return tree;
}

// called on scroll event
const handleScroll = function() {
    // get window position
    const windowY = window.scrollY;

    // get nearest heading
    const current = getCurrentHeading(headingTree, windowY+HIGHLIGHT_OFFSET);

    // find appropriate navigation item
    const navItem = pageNav.querySelector(`a[href="#${current.element.id}"]`);
    // change highlighted item if necessary
    if (highlightedItem !== navItem) {
        // unhighlight previously highlighted item
        if (highlightedItem) highlightedItem.classList.remove("page-navigation__item--highlighted");
        // highlight new item
        highlightedItem = navItem;
        highlightedItem.classList.add("page-navigation__item--highlighted");
        // scroll to highlighted item
        if (canScrollIntoView) scrollParentToChild(document.querySelector(".page-navigation"), highlightedItem);
    }
}

// called on window resize
const handleResize = function() {
    resizePipes(pageNav);
    // resizePipes(document.querySelector(".page-navigation"));
}


// SETUP CODE
addPipes(pageNav);
window.addEventListener("scroll", handleScroll);
handleScroll();
// prevents scrolling highlighted item into view if user selected new item
pageNav.addEventListener("click", () => {
    canScrollIntoView = false;
    setTimeout(() => canScrollIntoView = true, 1000);
});
window.addEventListener("resize", handleResize);