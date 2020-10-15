var commonModule = require("./sidedrawer-common")

require("utils/module-merge").merge(commonModule, exports)

var utils = require("utils/utils")
var platform = require("platform")


var layout = require("ui/layouts/grid-layout")
var contentView = require("ui/content-view")
var view = require("ui/core/view")
var app = require("application")
var frameModule = require("ui/frame")

var mainScreen =  UIScreen.mainScreen
var sharedApplication =  UIApplication.sharedApplication
var clearColor = UIColor.clearColor
var blackColor = UIColor.blackColor
var blueColor = UIColor.blueColor

var majorVersion = utils.ios.MajorVersion;

var MMSideDrawer = UIViewController.extend({

    initWithViewContentContentWidthMarginPositionHasActionBarOwner: function(
        contentWidth, 
        margin, 
        position, 
        hasActionBar, 
        owner){
        
        this._owner = owner
        var self = this.super.init()

        this._contentWidth = contentWidth
        this._margin = margin
        this._position = position
        this._hasActionBar = hasActionBar
        this._isOpen = false

        if(this._margin == 0 && this._contentWidth > 0)
            this._margin = mainScreen.bounds.size.width - this._contentWidth

        return self
    },

    setDraweContent: function(contentView){
        this._contentView = contentView
    },

    viewDidLoad: function(){
    },

    getView: function(){
        return this.super.view
    }, 

    makeDrawerView: function(){


        var frame = this.super.view.frame

        if(!this._fixedOpned){
            var btnCloseMenuOverlay = UIButton.alloc().initWithFrame(CGRectMake(frame.origin.x, frame.origin.y, frame.size.width, frame.size.height))
            btnCloseMenuOverlay.backgroundColor = clearColor
            btnCloseMenuOverlay.addTargetActionForControlEvents(this, "onCloseMenuClick", UIControlEventTouchUpInside)
            this.super.view.addSubview(btnCloseMenuOverlay)
        }
        

        this._uiSize = frame.size
        this._controller = frameModule.topmost().ios.controller

        this._statusBarHeight = sharedApplication.statusBarFrame.size.height

        if(this._hasActionBar)
            this._actionBarHeight = this._controller.navigationBar.frame.size.height        
        else
            this._actionBarHeight = 0        

        this._topHeight = this._statusBarHeight + this._actionBarHeight


        var margin = this._uiSize.width - this._contentWidth
        
        var contentViewHeight = this._uiSize.height - this._topHeight
        var superViewWidth = this._fixedOpned ? this._uiSize.width - this._contentWidth : this._uiSize.width

        if(this._position == 'left'){
            this.super.view.frame = CGRectMake(0, this._topHeight, superViewWidth, contentViewHeight)
            this._contentView.frame = CGRectMake(0, 0, this._contentWidth, contentViewHeight)        
            
        }
        else{            
            this.super.view.frame = CGRectMake(this._fixedOpned ? margin : 0, this._topHeight, superViewWidth, contentViewHeight)        
            this._contentView.frame = CGRectMake(this._fixedOpned ? 0 : margin, 0, this._contentWidth, contentViewHeight)                    
        }

        this._contentView.layer.masksToBounds = false        

        this.super.view.backgroundColor = UIColor.colorWithRedGreenBlueAlpha(0.0, 0.0, 0.0, 0.0)
        this.super.view.opaque = false


        var v = UIView.alloc().initWithFrame(this._contentView.frame)
        v.backgroundColor = blackColor
        v.addSubview(this._contentView)

        this.super.view.addSubview(v)

        this._controller.view.addSubview(this.super.view)
        this.super.view.layoutIfNeeded()


        if(!this._fixedOpned){

            var myframe = this.super.view.frame

            if(this._position == 'left'){
                this.super.view.frame = CGRectMake(20-frame.size.width, this._topHeight, frame.size.width, frame.size.height)
            }else{
                this.super.view.frame = CGRectMake(frame.size.width-20, this._topHeight, frame.size.width, frame.size.height)
            }

            this._backViewRecognizer = UIPanGestureRecognizer.alloc().initWithTargetAction(this, "backViewSwipeHandle")
            this._backViewRecognizer.numberOfTouchesRequired = 1
            btnCloseMenuOverlay.addGestureRecognizer(this._backViewRecognizer)


            this._drawerRecognizer = UIPanGestureRecognizer.alloc().initWithTargetAction(this, "drawerSwipeHandle")
            this._drawerRecognizer.numberOfTouchesRequired = 1
            this._contentView.addGestureRecognizer(this._drawerRecognizer)

        } 


    },

    backViewSwipeHandle: function(sender){

        var origin = this.super.view.frame.origin
        var size = this.super.view.frame.size
        var left = false        

        if (sender.state == UIGestureRecognizerStateBegan) {

            this._startBackViewSwipeLocation = sender.locationInView(this.super.view)

        }else if(sender.state == UIGestureRecognizerStateChanged){

            var stopLocation = sender.locationInView(this.super.view)
            var dx = stopLocation.x - this._startBackViewSwipeLocation.x
            var newX = origin.x + dx

            if(this._position == 'left'){
                if(newX > 0)
                    return
            }else{
                if(newX < 0)
                    return
            }

            this._dragged = true
            this.super.view.frame = CGRectMake(newX, origin.y, size.width, size.height)
            this.super.view.layoutIfNeeded()

        }else if (sender.state == UIGestureRecognizerStateEnded) {
            if(!this._dragged)
                return

            this._dragged = false

            this.onDradEnd()
        }
    },

    onDradEnd:  function(){
        var x = this.super.view.frame.origin.x
        var limitWidth = this._contentView.frame.size.width
        var limit = limitWidth * 0.50        

        if(x < -1)
            x =  limitWidth - (x * -1)
        else
            x =  limitWidth - x

        if(x < 0)
            x *= -1

        if(this._position == 'left'){
            if(!this._isOpen && x > limit){
                this.onOpenMenu()    
            }if(this._isOpen && x < limit){
                this.onCloseMenuClick()
            }else{
                if(this._isOpen)
                    this.onOpenMenu()
                else
                    this.onCloseMenuClick()                        
            }                
        }else{
            if(!this._isOpen && x > limit){
                this.onOpenMenu()    
            }if(this._isOpen && x < limit){
                this.onCloseMenuClick()
            }else{
                if(this._isOpen)
                    this.onOpenMenu()
                else
                    this.onCloseMenuClick()                        
            }                
        }        
    },

    drawerSwipeHandle: function(sender){

        var origin = this.super.view.frame.origin
        var size = this.super.view.frame.size
        var left = false

        if (sender.state == UIGestureRecognizerStateBegan) {

            this._startBackViewSwipeLocation = sender.locationInView(this.super.view)

        }else if(sender.state == UIGestureRecognizerStateChanged){

            var stopLocation = sender.locationInView(this.super.view)
            var dx = stopLocation.x - this._startBackViewSwipeLocation.x
            var newX = origin.x + dx

            if(this._position == 'left'){
                if(newX > 0)
                    return
            }else{
                if(newX < this._margin)
                    return
            }

            this._dragged = true
            this.super.view.frame = CGRectMake(newX, origin.y, size.width, size.height)
            this.super.view.layoutIfNeeded()

        }else if (sender.state == UIGestureRecognizerStateEnded) {
            if(!this._dragged)
                return

            this._dragged = false

            this.onDradEnd()
        }
    },


    setMargin: function(margin){
        this._margin = margin
    },

    setPosition: function(position){
        this._position = position
    },

    setHasActionBar: function(hasActionBar){
        this._hasActionBar = hasActionBar
    },

    isOpen: function(){
        return this._isOpen
    },

    setFixedOpened: function(value){
        this._fixedOpned = value
    },

    onSlideMenuButtonPressed: function(sender){

        if(this._isOpen){
            this.onCloseMenuClick()
        }else{
            this.onOpenMenu()
        }
    },

    onOpenMenu: function(){

        this.fireEvent(commonModule.SideDrawer.drawerOpeningEvent)

        var self = this

        var f = this.super.view.frame

        UIView.animateWithDurationAnimationsCompletion(0.3, function(){

                self.super.view.backgroundColor = UIColor.colorWithRedGreenBlueAlpha(0.0, 0.0, 0.0, 0.3)

                self.super.view.frame = CGRectMake(0, self._topHeight, f.size.width, f.size.height)

            }, function(){}
        )

        this._isOpen = true

        this.fireEvent(commonModule.SideDrawer.drawerOpenedEvent)
    },

    onCloseMenuClick: function(button){

        this.fireEvent(commonModule.SideDrawer.drawerClosingEvent)

        var f = this.super.view.frame
        var self = this

        UIView.animateWithDurationAnimationsCompletion(0.3, function(){

            self.super.view.backgroundColor = UIColor.colorWithRedGreenBlueAlpha(0.0, 0.0, 0.0, 0.0)

            if(self._position == 'left'){
                self.super.view.frame = CGRectMake(20 - f.size.width, self._topHeight, f.size.width, f.size.height)
            }else{
                self.super.view.frame = CGRectMake(f.size.width - 20, self._topHeight, f.size.width, f.size.height)
            }
            //self.super.view.layoutIfNeeded()
        }, function(){
            //self.super.view.removeFromSuperview()
            //self.super.removeFromParentViewController()
        })

        this._isOpen = false

        this.fireEvent(commonModule.SideDrawer.drawerClosedEvent)
    },

    fireEvent: function(eventName){
        if (this._owner.hasListeners(eventName)) {
            var args = {
                eventName: eventName,
                object: this._owner,
                returnValue: false
            }
            this._owner.notify(args)
        }
    }


}, {
    name: "MMSideDrawer",
    exposedMethods: {
        onSlideMenuButtonPressed: { returns: interop.types.void, params: [ interop.types.int32 ] },
        onCloseMenuClick: { returns: interop.types.void, params: [ UIButton ] },
        backViewSwipeHandle: { returns: interop.types.void, params: [ UIPanGestureRecognizer ] },
        drawerSwipeHandle: { returns: interop.types.void, params: [ UIPanGestureRecognizer ] },

    }
})

var SideDrawer = (function (_super) {

    __extends(SideDrawer, _super)
    function SideDrawer() {
        _super.call(this)            
        
        this._drawer = MMSideDrawer.alloc().initWithViewContentContentWidthMarginPositionHasActionBarOwner(
            this.drawerContentSize,
            this.drawerMargin,
            this.drawerPosition,
            this.drawerHasActionBar,            
            this
        )

        this._ios = UIView.alloc().initWithFrame(mainScreen.bounds)
        this._ios.backgroundColor = blackColor
    
    }

    Object.defineProperty(SideDrawer.prototype, "drawer", {
        get: function () {
            return this._drawer
        },
        enumerable: true,
        configurable: true
    })

    Object.defineProperty(SideDrawer.prototype, "_nativeView", {
        get: function () {
            return this._ios
        },
        enumerable: true,
        configurable: true
    })

    Object.defineProperty(SideDrawer.prototype, "_isRootView", {
        get: function () {
            return this.page ? false : true;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(SideDrawer.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });            


    SideDrawer.prototype._addViewToNativeVisualTree = function (child, atIndex) {
        _super.prototype._addViewToNativeVisualTree.call(this, child, atIndex);


        var content = child.nativeViewProtected

        if (child === this.mainContent) {
            
            this._ios.addSubview(content);

        }else if(child === this.drawerContent){
            this.drawer.setDraweContent(content)                        
            this.drawer.makeDrawerView()
        }
        
        return true        
    }

    SideDrawer.prototype._onDrawerContentSizeChanged = function (oldValue, newValue) {
      var data = {
        newValue: newValue,
        oldValue: oldValue
      }

      this.drawerContentSize = data.newValue
    }

    SideDrawer.prototype._onDrawerMarginChanged = function (oldValue, newValue) {
      var data = {
        newValue: newValue,
        oldValue: oldValue
      }

      this.drawerMargin = data.newValue
      if(this._ios)
        this._drawer.setMargin(this.drawerMargin)
    }

    SideDrawer.prototype._onDrawerPositionChanged = function (oldValue, newValue) {
      var data = {
        newValue: newValue,
        oldValue: oldValue
      }

      this.drawerPosition = data.newValue
      if(this._ios)
        this._drawer.setPosition(this.drawerPosition)
    }

    SideDrawer.prototype._onDrawerHasActionBarChanged = function (oldValue, newValue) {

      var data = {
        newValue: newValue,
        oldValue: oldValue
      }

      this.drawerHasActionBar = data.newValue
      if(this._ios)
        this._drawer.setHasActionBar(this.drawerHasActionBar)
    }

    SideDrawer.prototype._onMainContentChanged = function (oldValue, newValue) {

      var data = {
        newValue: newValue,
        oldValue: oldValue
      }

      if(data.oldValue)
        this._removeView(data.oldValue);

      if(data.newValue)
        this._addView(data.newValue);
    }

    SideDrawer.prototype._onDrawerContentChanged = function (oldValue, newValue) {

      var data = {
        newValue: newValue,
        oldValue: oldValue
      }

      if(data.oldValue)
        this._removeView(data.oldValue);

      if(data.newValue)
        this._addView(data.newValue);

    }

    SideDrawer.prototype._onDrawerFixeOpenedPropertyChanged = function(oldValue, newValue) {
        
      var data = {
        newValue: newValue,
        oldValue: oldValue
      }

      this._fixedOpned = newValue
      
      if(this._ios)
        this._drawer.setFixedOpened(data.newValue)

    }


    SideDrawer.prototype.createNativeView = function () {        
      return this.ios;
    };  
 

    SideDrawer.prototype.closeDrawer = function () {
        if (this._ios) {
            this._drawer.onCloseMenuClick()
        }
    }
    SideDrawer.prototype.showDrawer = function () {
        if (this._ios) {
            this._drawer.onSlideMenuButtonPressed()
        }
    }

    SideDrawer.prototype.eachChildView = function (callback) {
        if (this.mainContent) {
            callback(this.mainContent);
        }
        if (this.drawerContent) {
            callback(this.drawerContent);
        }
    }    

    SideDrawer.prototype.onLayout = function (left, top, right, bottom) {

        var width = right - left
        var height = bottom - top
        var screenWidth = width
        var screenHeight = height        
        var drawerSize = utils.layout.toDevicePixels(this.drawerContentSize)
        
        if (this.drawerPosition == 'top' || this.drawerPosition == 'bottom') {
            this.drawerContent.layout(0, 0, right, drawerSize)
        }
        else {
            this.drawerContent.layout(0, 0, drawerSize, bottom)
        }

        this.mainContent.layout(0, 0, width, height)
    }

    SideDrawer.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
                
        var pos = this.drawerPosition
        var drawerWidth = widthMeasureSpec;
        var drawerHeight = heightMeasureSpec;
        var drawerSize = utils.layout.toDevicePixels(this.drawerContentSize);
        if (this.drawerPosition == 'top' || this.drawerPosition == 'bottom') {
            view.View.measureChild(this, this.drawerContent, drawerWidth, utils.layout.makeMeasureSpec(drawerSize, utils.layout.EXACTLY));
        }
        else {
            view.View.measureChild(this, this.drawerContent, utils.layout.makeMeasureSpec(drawerSize, utils.layout.EXACTLY), drawerHeight);
        }
        var result = view.View.measureChild(this, this.mainContent, widthMeasureSpec, heightMeasureSpec);
        var width = utils.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = utils.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = utils.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = utils.layout.getMeasureSpecMode(heightMeasureSpec);
        var widthAndState = view.View.resolveSizeAndState(result.measuredWidth, width, widthMode, 0);
        var heightAndState = view.View.resolveSizeAndState(result.measuredHeight, height, heightMode, 0);
        this.setMeasuredDimension(widthAndState, heightAndState);


    }
    return SideDrawer
})(commonModule.SideDrawer)
exports.SideDrawer = SideDrawer
