// Prevent null querySelector errors from extensions
(function() {
    const originalQuerySelector = Element.prototype.querySelector;
    Element.prototype.querySelector = function() {
        try {
            return originalQuerySelector.apply(this, arguments);
        } catch (e) {
            return null;
        }
    };

    // Also handle document.querySelector
    const originalDocQuerySelector = Document.prototype.querySelector;
    Document.prototype.querySelector = function() {
        try {
            return originalDocQuerySelector.apply(this, arguments);
        } catch (e) {
            return null;
        }
    };
})();
