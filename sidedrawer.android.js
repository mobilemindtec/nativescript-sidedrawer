var common = require("./sidedrawer-common")
var utils = require("utils/utils")
var platform = require("platform")

require("utils/module-merge").merge(common, exports)

var SideDrawer = (function (_super) {
    __extends(SideDrawer, _super)
    function SideDrawer() {
        _super.call(this)
    }

    SideDrawer.prototype.createNativeView = function () {


        this._android = new com.telerik.sidedrawer.SideDrawer(this._context)


        var w = this.drawerContentSize > 0 ? this.drawerContentSize : platform.screen.mainScreen.widthPixels / platform.screen.mainScreen.scale
        var size = (utils.layout.getDisplayDensity() * w) - (utils.layout.getDisplayDensity() * this.drawerMargin)

        this._android.setDrawerSize(size)

        var that = new WeakRef(this)
        this._android.addChangeListener(new com.telerik.sidedrawer.DrawerChangeListener({
            onDrawerOpening: function (drawer) {
                if (that.get().hasListeners(common.SideDrawer.drawerOpeningEvent)) {
                    var args = {
                        eventName: common.SideDrawer.drawerOpeningEvent,
                        object: that.get(),
                        returnValue: false
                    }
                    that.get().notify(args)
                    if (args.returnValue) {
                        return args.returnValue
                    }
                }
                return false
            },
            onDrawerOpened: function (drawer) {
                if (that.get().hasListeners(common.SideDrawer.drawerOpenedEvent)) {
                    var args = {
                        eventName: common.SideDrawer.drawerOpenedEvent,
                        object: that.get()
                    }
                    that.get().notify(args)
                }
            },
            onDrawerClosing: function (drawer) {
                if (that.get().hasListeners(common.SideDrawer.drawerClosingEvent)) {
                    var args = {
                        eventName: common.SideDrawer.drawerClosingEvent,
                        object: that.get(),
                        returnValue: false
                    }
                    that.get().notify(args)
                    if (args.returnValue) {
                        return args.returnValue
                    }
                }
                return false
            },
            onDrawerClosed: function (drawer) {
                if (that.get().hasListeners(common.SideDrawer.drawerClosedEvent)) {
                    var args = {
                        eventName: common.SideDrawer.drawerClosedEvent,
                        object: that.get()
                    }
                    that.get().notify(args)
                }
            }
        }))

        if (this.drawerPosition == 'left') {
          this._android.setDrawerLocation(com.telerik.sidedrawer.DrawerLocation.LEFT)
        }else{
          this._android.setDrawerLocation(com.telerik.sidedrawer.DrawerLocation.RIGHT)
        }

        this.nativeView = this._android

        return this.nativeView
    }

    Object.defineProperty(SideDrawer.prototype, "android", {
        get: function () {
            return this._android
        },
        enumerable: true,
        configurable: true
    })

    Object.defineProperty(SideDrawer.prototype, "_nativeView", {
        get: function () {
            return this._android
        },
        enumerable: true,
        configurable: true
    })

    SideDrawer.prototype._onDrawerSizeChanged = function (oldValue, newValue) {


      var data = {
        newValue: newValue,
        oldValue: oldValue
      }

      if (!this.android) {
          return
      }

      if (data.newValue) {

          var w = java.lang.Integer.valueOf(data.newValue) > 0 ? java.lang.Integer.valueOf(data.newValue) : platform.screen.mainScreen.widthPixels / platform.screen.mainScreen.scale
          var size = (utils.layout.getDisplayDensity() * w) - (utils.layout.getDisplayDensity() * this.drawerMargin)

          var size = (utils.layout.getDisplayDensity() * w) - (utils.layout.getDisplayDensity() * this.drawerMargin)
          this.android.setDrawerSize(size)
      }
    }
    SideDrawer.prototype._onDrawerMarginChanged = function (oldValue, newValue) {

      var data = {
        newValue: newValue,
        oldValue: oldValue
      }

      if (!this.android) {
          return
      }
      if (data.newValue) {

          var w = this.drawerContentSize > 0 ? this.drawerContentSize : platform.screen.mainScreen.widthPixels / platform.screen.mainScreen.scale
          var size = (utils.layout.getDisplayDensity() * w) - (utils.layout.getDisplayDensity() * this.drawerMargin)

          var size = (utils.layout.getDisplayDensity() * w) - (utils.layout.getDisplayDensity() * java.lang.Integer.valueOf(this.newValue))
          this.android.setDrawerSize(size)
      }
    }
    SideDrawer.prototype._onDrawerPositionChanged = function (oldValue, newValue) {

      var data = {
        newValue: newValue,
        oldValue: oldValue
      }

      if (!this.android) {
          return
      }
      if (data.newValue == 'left') {
          this.android.setDrawerLocation(com.telerik.sidedrawer.DrawerLocation.LEFT)
      }else{
        this.android.setDrawerLocation(com.telerik.sidedrawer.DrawerLocation.RIGHT)
      }
    }
    SideDrawer.prototype._onDrawerContentChanged = function (oldValue, newValue) {

      var data = {
        newValue: newValue,
        oldValue: oldValue
      }

      if (data.oldValue) {
          this._removeView(data.oldValue)
      }
      if (data.newValue) {
          this._addView(data.newValue)
      }
    }
    SideDrawer.prototype._onMainContentChanged = function (oldValue, newValue) {

      var data = {
        newValue: newValue,
        oldValue: oldValue
      }

      if (data.oldValue) {
          this._removeView(data.oldValue)
      }
      if (data.newValue) {
          this._addView(data.newValue)
      }
    }

    SideDrawer.prototype._addViewToNativeVisualTree = function (child) {
        if (this._android && child.android) {
            if (this.mainContent === child) {
                this._android.setMainContent(child.android)
                return true
            }
            if (this.drawerContent === child) {
                this._android.setDrawerContent(child.android)
                return true
            }
        }
        return false
    }
    SideDrawer.prototype._removeViewFromNativeVisualTree = function (child) {
        if (this._android && child.android) {
            if (this.mainContent === child) {
                this._android.setMainContent(null)
                child._isAddedToNativeVisualTree = false
            }
            if (this.drawerContent === child) {
                this._android.setDrawerContent(null)
                child._isAddedToNativeVisualTree = false
            }
        }
    }
    SideDrawer.prototype.closeDrawer = function () {
        if (this.android) {
            this.android.setIsOpen(false)
            _super.prototype.closeDrawer.call(this)
        }
    }
    SideDrawer.prototype.showDrawer = function () {
        if (this.android) {
            this.android.setIsOpen(true)
            _super.prototype.showDrawer.call(this)
        }
    }
    return SideDrawer
})(common.SideDrawer)
exports.SideDrawer = SideDrawer
