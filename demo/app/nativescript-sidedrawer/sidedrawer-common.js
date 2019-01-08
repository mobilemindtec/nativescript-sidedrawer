
var view = require("ui/core/view");
var layout = require("ui/layouts/grid-layout");

var SideDrawerLocation;

var SideDrawer = (function (_super) {
    __extends(SideDrawer, _super);
    function SideDrawer() {
        _super.call(this);
        this._isOpen = false;
    }
    SideDrawer.prototype.onDrawerMarginChanged = function (oldValue, newValue) {
        this._onDrawerMarginChanged(oldValue, newValue);
    };
    SideDrawer.prototype.onDrawerContentSizeChanged = function (oldValue, newValue) {
        this._onDrawerContentSizeChanged(oldValue, newValue);
    };
    SideDrawer.prototype.onMainContentPropertyChanged = function (oldValue, newValue) {
        this._onMainContentChanged(oldValue, newValue);
    };
    SideDrawer.prototype.onDrawerContentPropertyChanged = function (oldValue, newValue) {
        this._onDrawerContentChanged(oldValue, newValue);
    };
    SideDrawer.prototype.onDrawerPositionChanged = function (oldValue, newValue) {
        this._onDrawerPositionChanged(oldValue, newValue);
    };
    SideDrawer.prototype.onDrawerHasActionBarChanged = function (oldValue, newValue) {
        this._onDrawerHasActionBarChanged(oldValue, newValue);
    };
    SideDrawer.prototype.onDrawerFixeOpenedPropertyChanged = function (oldValue, newValue) {
        this._onDrawerFixeOpenedPropertyChanged(oldValue, newValue);
    };

    SideDrawer.prototype._onMainContentChanged = function (oldValue, newValue) { };

    SideDrawer.prototype._onDrawerContentChanged = function (oldValue, newValue) { };

    SideDrawer.prototype._onDrawerContentSizeChanged = function (oldValue, newValue) { };

    SideDrawer.prototype._onDrawerMarginChanged = function (oldValue, newValue) { };

    SideDrawer.prototype._onDrawerPositionChanged = function (oldValue, newValue) { };

    SideDrawer.prototype._onDrawerHasActionBarChanged = function (oldValue, newValue) { };
    
    SideDrawer.prototype._onDrawerFixeOpenedPropertyChanged = function (oldValue, newValue) { };

    SideDrawer.prototype.showDrawer = function () {};
    
    SideDrawer.prototype.closeDrawer = function () {};

    SideDrawer.prototype.getIsOpen = function () {
        var androidIsOpen = false;
        var iosIsOpen = false;
        if (this.android) {
            androidIsOpen = this.android.getIsOpen();
        }
        if (this.ios) {
            iosIsOpen = this.drawer.isOpen()
        }
        var result = androidIsOpen || iosIsOpen;
        if (result) {
            return result;
        }
        return false;
    };
    SideDrawer.prototype.toggleDrawerState = function () {
        if (this.getIsOpen()) {
            this.closeDrawer();
        }
        else {
            this.showDrawer();
        }
    };
    Object.defineProperty(SideDrawer.prototype, "_childrenCount", {
        get: function () {
            var count = 0;
            if (this.drawerContent) {
                count++;
            }
            if (this.mainContent) {
                count++;
            }
            return count;
        },
        enumerable: true,
        configurable: true
    });

    SideDrawer.prototype.eachChildView = function (callback) {
        if (this.mainContent) {
            callback(this.mainContent);
        }
        if (this.drawerContent) {
            callback(this.drawerContent);
        }
    };

    Object.defineProperty(SideDrawer.prototype, "android", {
        get: function () {
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideDrawer.prototype, "ios", {
        get: function () {
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideDrawer.prototype, "drawer", {
        get: function () {
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    SideDrawer.drawerOpeningEvent = "drawerOpening";
    SideDrawer.drawerOpenedEvent = "drawerOpened";
    SideDrawer.drawerClosingEvent = "drawerClosing";
    SideDrawer.drawerClosedEvent = "drawerClosed";
    return SideDrawer;
})(view.View);

exports.drawerPositionProperty = new view.Property({
    name: "drawerPosition",
    defaultValue: 'left',
    valueChanged: function (target, oldValue, newValue) {
        target.onDrawerPositionChanged(oldValue, newValue)
    }
});

exports.drawerMarginProperty = new view.Property({
    name: "drawerMargin",
    defaultValue: 0,
    valueChanged: function (target, oldValue, newValue) {
        
        if(typeof newValue === 'string')
            newValue = parseInt(newValue) || 0

        target.onDrawerMarginChanged(oldValue, newValue)
    }
});

exports.drawerContentSizeProperty = new view.Property({
    name: "drawerContentSize",
    defaultValue: 270,
    valueChanged: function (target, oldValue, newValue) {

        if(typeof newValue === 'string')
            newValue = parseInt(newValue) || 270

        target.onDrawerContentSizeChanged(oldValue, newValue)
    }
});

exports.mainContentProperty = new view.Property({
    name: "mainContent",
    defaultValue: undefined,
    valueChanged: function (target, oldValue, newValue) {
        target.onMainContentPropertyChanged(oldValue, newValue)
    }
});

exports.drawerContentProperty = new view.Property({
    name: "drawerContent",
    defaultValue: undefined,
    valueChanged: function (target, oldValue, newValue) {
        target.onDrawerContentPropertyChanged(oldValue, newValue)
    }
});

exports.drawerFixeOpenedProperty = new view.Property({
    name: "drawerFixeOpened",
    defaultValue: false,
    valueChanged: function (target, oldValue, newValue) {

        if(typeof newValue === 'string')
            newValue = newValue == 'true'

        target.onDrawerFixeOpenedPropertyChanged(oldValue, newValue)
    }
});

exports.drawerhasActionBarPoperty = new view.Property({
    name: "drawerHasActionBar",
    defaultValue: false,
    valueChanged: function (target, oldValue, newValue) {

        if(typeof newValue === 'string')
            newValue = newValue == 'true'

        target.onDrawerHasActionBarChanged(oldValue, newValue)
    }
});





exports.drawerPositionProperty.register(SideDrawer);
exports.drawerMarginProperty.register(SideDrawer);
exports.drawerContentSizeProperty.register(SideDrawer);
exports.mainContentProperty.register(SideDrawer);
exports.drawerContentProperty.register(SideDrawer);
exports.drawerFixeOpenedProperty.register(SideDrawer);
exports.drawerhasActionBarPoperty.register(SideDrawer);

exports.SideDrawer = SideDrawer;
