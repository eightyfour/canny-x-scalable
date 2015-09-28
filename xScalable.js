(function () {

    xScalable = function () {

        /**
         * Better is to calculate the percentage so that all other div element are scaled with % and end up in 100%
         * * and only scale others if result will be above 100%  (y)
         * * use percentage instead of px
         * * calculate correct percentage dependence on the actual sibling with
         * * scale row height instead of item height - item can have 100% height
         * *
         * Evaluate:
         *  * if this possible to detect that the Ctrl key is pressed? So it's possible on mousedown to enable drag and drop
         *      to move the div to another section. Actually the Ctrl doesn't trigger the keypress event.
         * @param node
         * @param siblingNodes
         */
        function handleScale(node, siblingNodes, containerWidth) {
            var pressed = false;

            function setWidthOfOthers(widthToAdd, heightToAdd, fullWidth) {
                siblingNodes.forEach(function (node) {
                    var width = node.offsetWidth + widthToAdd,
                        height = node.offsetHeight + heightToAdd,
                        p = (width / containerWidth) * 100;

                    node.style.width  = p + '%';
                    node.style.height = height;
                });
            }

            node.addEventListener('mousedown', function (e) {
                pressed = true;
                console.log('scalable:mousedown', e);
            });
            node.addEventListener('mouseup', function (e) {
                pressed = false;

                console.log('scalable:mouseup', e);
            });
            node.addEventListener('mousemove', function (e) {
                var x = e.movementX,
                    y = e.movementY * 2,
                    fullWidth;
                if (x > 0) {
    //                x *= 2;
                }
                // 100 - x
                // fullWidth - actual
                if (pressed) {
                    fullWidth = getCalculatedWidth(siblingNodes) + node.offsetWidth;
                    console.log('scalable:mousemove', x);

                    (function setNodeWidthInPercentage() {
                        var width = node.offsetWidth + x,
                            height = node.offsetHeight + y,
                            p = (width / containerWidth) * 100;
                        node.style.width = p + '%';
                        node.style.height = height;
                    }());

                    if (fullWidth >= containerWidth) {
                        setWidthOfOthers(-x, y, fullWidth);
                    } else if (x < 0) {
                        setWidthOfOthers(-x, y, fullWidth);
                    } else if (y !== 0) {
                        setWidthOfOthers(0, y, fullWidth);
                    }
                }
            });
            node.addEventListener('mouseout', function (e) {
                pressed = false;
                console.log('scalable:mouseout', e);
            });
        }
        function getCalculatedWidth(nodes) {
            var width = 0;
            nodes.forEach(function (sibling) {
                width += sibling.offsetWidth;
            })
            return width;
        }
        function scaleRowItems (node) {
            var width = node.offsetWidth,
                children = [].slice.call(node.children);
            console.log('scalable:container width:', width);
            for (var i = 0; i < children.length; i++) {
                var child = children[i],
                    allOtherChildrensOfThisRow = [].slice.call(node.children);
                // remove this node from all others
                [].splice.call(allOtherChildrensOfThisRow, i, 1);

                handleScale(child, allOtherChildrensOfThisRow, width);

            }
    //        [].slice.call(node.children).forEach(function (child) {
    //            var allOtherChildrensOfThisRow = [].slice.call(node.children);
    //            handelScale(child, );
    //        })

    //        TODO continue with scale row height...

            return {
                setFullWidth : function () {
                    // TODO
                },
                addSibling : function (node) {
                    // TODO
                },
                removeSibling : function (node) {
                    // TODO
                },
                removeNode : function (node) {
                    // TODO
                    node.remove();
                }
            }
        }

        return {
            add : function (node, attr) {
                if (attr === 'row') {
                    scaleRowItems(node);
                }
            }
        }
    };
    // export as module or bind to global
    if (typeof module !== 'undefined' && module.hasOwnProperty('exports')) {
        module.exports = xScalable();
    } else {
        canny.add('xScalable', xScalable);
    }
}());
