// creates and returns new horizontal pipe
const createHorizontalPipe = function() {
    const pipe = document.createElement("div");
    pipe.classList.add("page-navigation__horizontal-pipe");
    return pipe;
}

// creates and returns new vertical pipe
const createVerticalPipe = function(heightToRemove) {
    const pipe = document.createElement("div");
    pipe.classList.add("page-navigation__vertical-pipe");
    pipe.style.height = `calc(100% - ${heightToRemove}px + .8rem)`;
    return pipe;
}

// creates and adds pipes to page navigation
export const addPipes = function(ul, firstItemVisited = false) {
    // iterate over all children of ul element
    for (let child of ul.children) {
        if (child.tagName === "A") {
            // set that first item was visited
            if (!firstItemVisited) {
                firstItemVisited = true;
                continue;
            }
            // create new horizontal pipe and append it to 'a' element
            const pipe = createHorizontalPipe();
            child.appendChild(pipe);
            continue;
        }
        else if (child.tagName === "UL") {
            // get last child (li)
            const lastChild = child.lastElementChild;
            // get child (a) of last child (li)
            const itemEl = lastChild.firstElementChild;
            // create new vertical pipe and append it to child (ul)
            let pipe = createVerticalPipe(lastChild.clientHeight-itemEl.clientHeight/2);
            child.appendChild(pipe);
        }
        // call recursively addPipes function for child
        addPipes(child, firstItemVisited);
    }
}

// resizes pipes in page navigation
export const resizePipes = function(ul) {
    // iterate over all children of element
    for (let child of ul.children) {
        if (child.tagName === "UL") {
            // get last child (li)
            const lastChild = child.children.length === 1 ? child.firstElementChild : child.children[child.children.length-2];
            // get child (a) of last child (li)
            const itemEl = lastChild.firstElementChild;
            // get pipe and change height
            let pipe = child.lastElementChild;
            pipe.style.height = `calc(100% - ${lastChild.clientHeight-itemEl.clientHeight/2}px + .8rem)`;
        }
        // call recursively resizePipes function for child
        resizePipes(child);
    }
}

// represents node in heading tree
class Node {
    constructor(element) {
        this.element = element;
        this.children = null;
    }
}

// returns sorted tree containing hieararchy of headings found in passed element
export const getSortedHeadingTree = function(pageEl) {
    // get all headings on page
    const primaryHeading = pageEl.querySelector("h1");
    const secondaryHeadings = Array.from(pageEl.getElementsByTagName("h2")).sort((el1, el2) => el1.offsetTop - el2.offsetTop);
    const tertiaryHeadings = Array.from(pageEl.getElementsByTagName("h3")).sort((el1, el2) => el1.offsetTop - el2.offsetTop);

    // i - for secondary headings, j - for tertiary headings
    let i = 0, j = 0;
    const rootNode = new Node(primaryHeading);
    // here will be stored current secondary heading
    let current = rootNode;

    // iterate over all secondary and tertiary headings
    while (i < secondaryHeadings.length || j < tertiaryHeadings.length) {
        if (secondaryHeadings[i] && (!tertiaryHeadings[j] || secondaryHeadings[i].offsetTop < tertiaryHeadings[j].offsetTop)) {
            if (!rootNode.children) rootNode.children = [];
            // set secondary headings as current
            current = new Node(secondaryHeadings[i]);
            // add secondary heading as root's (h1) child
            rootNode.children.push(current);
            i++;
        } else if (tertiaryHeadings[j]) {
            // set tertiary heading as current's child
            if (!current.children) current.children = [];
            current.children.push(new Node(tertiaryHeadings[j]));
            j++;
        }
    }

    // return root node - h1 (sorted heading tree)
    return rootNode;
}

// function to scroll parent to child
export const scrollParentToChild = function(parent, child) {
    // Where is the parent on page
    let parentRect = parent.getBoundingClientRect();
    // What can you see?
    let parentViewableArea = {
        height: parent.clientHeight,
        width: parent.clientWidth
    };

    // Where is the child
    let childRect = child.getBoundingClientRect();
    // Is the child viewable?
    let isViewable = (childRect.top >= parentRect.top) && (childRect.bottom <= parentRect.top + parentViewableArea.height);

    // if you can't see the child try to scroll parent
    if (!isViewable) {
        // Should we scroll using top or bottom? Find the smaller ABS adjustment
        const scrollTop = childRect.top - parentRect.top;
        const scrollBot = childRect.bottom - parentRect.bottom;
        if (Math.abs(scrollTop) < Math.abs(scrollBot)) {
            // we're near the top of the list
            parent.scrollTop += scrollTop - 8;
        } else {
            // we're near the bottom of the list
            parent.scrollTop += scrollBot + 8;
        }
    }
}