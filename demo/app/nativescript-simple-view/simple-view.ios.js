
var utils = require("utils/utils")
var platform = require("platform")


var layout = require("ui/layouts/grid-layout")
var contentView = require("ui/content-view")
var view = require("ui/core/view")
var app = require("application")
var frameModule = require("ui/frame")

var mainScreen = utils.ios.getter(UIScreen, UIScreen.mainScreen)
var sharedApplication = utils.ios.getter(UIApplication, UIApplication.sharedApplication)
var clearColor = utils.ios.getter(UIColor, UIColor.clearColor)
var blackColor = utils.ios.getter(UIColor, UIColor.blackColor)
var blueColor = utils.ios.getter(UIColor, UIColor.blueColor)


var SimpleView = (function (_super) {

    __extends(SimpleView, _super)
    function SimpleView() {
        _super.apply(this, arguments) || this;

        console.log("SimpleView")

        this._ios = UIView.alloc().initWithFrame(mainScreen.bounds)

    }


    SimpleView.prototype._addViewToNativeVisualTree = function (child, atIndex) {

    	console.log("_addViewToNativeVisualTree")

        _super.prototype._addViewToNativeVisualTree.call(this, child, atIndex);

    		var controller = this.viewController;
        var content = child.nativeViewProtected;

        if (controller && !child.viewController) {
          child.viewController = view.ios.UILayoutViewController.initWithOwner(new WeakRef(child));
          var view = child.viewController.view;
          view.addSubview(child.nativeViewProtected);
          content = view;
        }

        if (child === this.mainContent) {
          this._ios.addSubview(content);
        }

        var childController = child.viewController;
        if (controller && childController) {
          controller.addChildViewController(childController);
        }

        
        return true        
    }

    SimpleView.prototype.onMainContentPropertyChanged = function (oldValue, newValue) {

    	console.log("onMainContentPropertyChanged")

      var data = {
        newValue: newValue,
        oldValue: oldValue
      }

      if(data.oldValue)
      	this._removeView(data.oldValue);

      if(data.newValue)
      	this._addView(data.newValue);
    }    

    Object.defineProperty(SimpleView.prototype, "_isRootView", {
        get: function () {
            return this.page ? false : true;
        },
        enumerable: true,
        configurable: true
    });

    SimpleView.prototype.disposeNativeView = function () {
        if (!this._isRootView) {
            this.page.off("navigatingFrom", this.onNavigatingFrom, this);
        }
    };


    Object.defineProperty(SimpleView.prototype, "_nativeView", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(SimpleView.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });

    SimpleView.prototype.onUnloaded = function () {
        _super.prototype.onUnloaded.call(this);
    };

    SimpleView.prototype.createNativeView = function () {
    	console.log("createNativeView")
    	//if (!this._isRootView)
    	//	this.page.on("navigatingFrom", this.onNavigatingFrom, this);

      return this.ios;
    };    

    Object.defineProperty(SimpleView.prototype, "_childrenCount", {
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

    SimpleView.prototype.eachChildView = function (callback) {
    	console.log("eachChildView")    	
    	if(this.mainContent)
      	callback(this.mainContent);
    }    

    SimpleView.prototype.onLayout = function (left, top, right, bottom) {

    	console.log("onLayout")

    	if(!this.viewController){
        var controller = frameModule.topmost().ios.controller
        var statusBarHeight = sharedApplication.statusBarFrame.size.height
        var actionBarHeight = (this.drawerHasActionBar) ? controller.navigationBar.frame.size.height : 0        
        var navBarHeight = actionBarHeight  + statusBarHeight
        var size = mainScreen.bounds.size

        var width = right - left;
        var height = bottom - top;

        
        var wp = utils.layout.toDevicePixels(size.width)
        var hp = utils.layout.toDevicePixels(size.height)
      
        this.mainContent.layout(0, 0, wp, hp);
      }
    }
    SimpleView.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        
        console.log("onMeasure")

        var controller = frameModule.topmost().ios.controller
        var statusBarHeight = sharedApplication.statusBarFrame.size.height
        var actionBarHeight = (this.drawerHasActionBar) ? controller.navigationBar.frame.size.height : 0
        var navBarHeight = actionBarHeight  + statusBarHeight
        
                
        var result = view.View.measureChild(this, this.mainContent, widthMeasureSpec, heightMeasureSpec);
        var width = utils.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = utils.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = utils.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = utils.layout.getMeasureSpecMode(heightMeasureSpec);
        var widthAndState = view.View.resolveSizeAndState(result.measuredWidth, width, widthMode, 0);
        var heightAndState = view.View.resolveSizeAndState(result.measuredHeight, height, heightMode, 0);
        this.setMeasuredDimension(widthAndState, heightAndState);


    }
    return SimpleView
})(view.View)
exports.SimpleView = SimpleView    


SimpleView.mainContentProperty = new view.Property({
    name: "mainContent",
    defaultValue: undefined,
    valueChanged: function (target, oldValue, newValue) {
    	console.log("mainContentProperty")
       target.onMainContentPropertyChanged(oldValue, newValue)
    }
});

SimpleView.mainContentProperty.register(SimpleView);