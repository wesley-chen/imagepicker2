/**
 * Provides the ImageInfo class used by the ImagePicker
 * 
 * @namespace ImagePicker
 * @class ImagePicker.ImageInfo
 * @constructor
 * @param {Number}
 *            UUID
 * @param {HTMLElement}
 *            image element
 * @param {Number}
 *            the top of image (absolute position)
 */
ImageInfo = function(id, image, imageTop) {

    this.id = id;
    this.url = image.src;
    this.height = image.height;
    this.width = image.width;
    this.top = imageTop;
    this.tabTitle = "";
    this.fileSize = 0;
    this.visible = true;

    this.nameFromURL = this.url.substring(this.url.lastIndexOf('/') + 1, this.url.length);
    this.nameFromURL = decodeURIComponent(this.nameFromURL);

    this.fileExt = "jpg";
    this.setFileName(this.nameFromURL);
    this.outputFile = null;

    console.log("Created %O", this);
};

ImageInfo.prototype = {

    setFileName : function(newFileName) {
        var reg = /(.+)\.(\w*)/;
        var result = reg.exec(newFileName);
        if (result != null) {
            this.fileName = result[1];
            this.fileExt = result[2];
        } else {
            this.fileName = newFileName;
        }
    },

    getFileNameExt : function() {
        return this.fileName + (this.fileExt == null ? "" : ("." + this.fileExt));
    },

    toString : function() {
        return "Image:[id=" + this.id + ", name=" + this.fileName + ", ext=" + this.fileExt + "]";
    }
};

function initImages(images) {
    if (images) {
        for ( var i in images) {
            images[i].visible = true;
        }
    }
}

function createDomainFilter(images) {

    var getKeywordFunc = function(img) {
        return extractDomain(img.url);
    };

    return new Filter("Domain", images, getKeywordFunc);
}

function extractDomain(url) {
    if (url == null || url.length == 0) {
        return "";
    }

    var startIdx = url.indexOf('://');
    if (startIdx == -1) {
        return "Local";
    }
    var remainingUrl = url.substr(startIdx + 3, url.length);
    var endIdx = remainingUrl.indexOf('/');
    endIdx = (endIdx == -1 ? remainingUrl.length - 1 : endIdx);
    var domain = remainingUrl.substr(0, endIdx)

    var simpleDomains = [];
    var domainParts = domain.split('.');
    for ( var i in domainParts) {
        if (domainParts[i] == "www" || domainParts[i] == "com" || domainParts[i] == "org" || domainParts[i] == "net"
                || domainParts[i] == "info" || domainParts[i] == "cn") {
            continue;
        }
        simpleDomains.push(domainParts[i]);
    }

    return simpleDomains.join(".");
}

function createTypeFilter(images) {

    var getKeywordFunc = function(img) {
        return img.fileExt.toUpperCase();
    };

    return new Filter("Image Type", images, getKeywordFunc);
}

function Filter(name, images, getKeywordFunc) {

    this.name = name;

    // Init FilterTag
    this.tags = [];
    this.tagOther = null;

    var groups = groupBy(images, getKeywordFunc);

    // Collect Top 3 tags
    var otherCount = 0;
    for ( var i in groups) {
        if (i < 3) { // selected Top 3
            this.tags.push(groups[i]);
        } else {
            otherCount += groups[i].matchedCount
        }
    }

    // Add "Other" tag if have
    if (otherCount > 0) {
        this.tagOther = new FilterTag("Other", otherCount, true);
        this.tags.push(this.tagOther);
    }

    // Init On click event handler
    this.onClickFunc = function(keyword) {
        // toggle
        var tags = this.tags;
        for ( var i in tags) {
            if (tags[i].keyword == keyword) {
                tags[i].enabled = !tags[i].enabled;
            }
        }
    };

    // Init match() function
    this.matchFunc = function(img) {

        for ( var i in this.tags) {
            if (this.tags[i] == this.tagOther) {
                continue;
            }
            var keyword = this.tags[i].keyword;
            if (img.keywords.indexOf(keyword) > -1) {
                return this.tags[i].enabled;
            }
        }

        if (this.tagOther != null) {
            return this.tagOther.enabled;
        }

        return true;
    };
}

function FilterTag(keyword, matchedCount, enabled) {
    this.keyword = keyword;
    this.matchedCount = matchedCount;
    this.enabled = enabled;
}

function groupBy(images, getKeywordFunc) {

    var tags = []; // FilterTag array

    if (images) {
        for ( var i in images) {
            var keyword = getKeywordFunc(images[i]);
            if (images[i].keywords == null) {
                images[i].keywords = [];
            }
            images[i].keywords.push(keyword);

            var filterTag = null;
            for ( var j in tags) {
                if (tags[j].keyword == keyword) {
                    filterTag = tags[j];
                    break;
                }
            }

            if (filterTag == null) {
                filterTag = new FilterTag(keyword, 1, true);
                tags.push(filterTag);
            } else {
                filterTag.matchedCount = filterTag.matchedCount + 1;
            }
        }
    }

    tags.sort(function(a, b) {
        return -(a.matchedCount - b.matchedCount);
    })

    return tags;
}

function Container(name, keyCode, mouseAction) {
    this.name = name;
    this.keyCode = keyCode;
    this.mouseAction = mouseAction;
    this.images = [];
}