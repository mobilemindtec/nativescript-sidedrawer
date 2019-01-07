package com.telerik.sidedrawer;

import android.content.Context;
import android.content.res.Resources;
import android.graphics.Color;
import android.graphics.Rect;
import android.os.Parcelable;
import android.util.AttributeSet;
import android.util.TypedValue;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.widget.FrameLayout;
import java.util.ArrayList;

public class SideDrawer
        extends FrameLayout
        implements DrawerTransitionEndedListener
{
    private ArrayList<DrawerChangeListener> changeListeners = new ArrayList();
    private DrawerLocation drawerLocation = DrawerLocation.LEFT;
    private DrawerTransition drawerTransition;
    private View mainContent;
    private View drawerContent;
    private boolean isOpen;
    private int drawerSize;
    private boolean isLocked;
    private FrameLayout drawerContainer;
    private FrameLayout mainContainer;
    private DrawerTransition defaultTransition = new SlideInOnTopTransition();
    private DrawerFadeLayer fadeLayer;
    private DrawerFadeLayer defaultFadeLayer;
    private int touchTargetThreshold;
    private boolean tapOutsideToClose = true;
    private boolean onDown;
    private boolean closeOnBackPress = true;
    private MotionEvent previousEvent;
    private float openThreshold;

    public SideDrawer(Context context)
    {
        this(context, null);
    }

    public SideDrawer(Context context, AttributeSet attrs)
    {
        super(context, attrs);

        this.touchTargetThreshold = Math.round(getDimen(1, 20.0F));
        this.defaultFadeLayer = new DrawerFadeLayerBase(context);
        this.defaultFadeLayer.view().setBackgroundColor(Color.TRANSPARENT);
        this.defaultTransition.setFadeLayer(resolveFadeLayer().view());
        this.defaultTransition.setLocation(this.drawerLocation);
        setFocusableInTouchMode(true);
    }

    private static float getDimen(int type, float dimen)
    {
        return TypedValue.applyDimension(type, dimen, Resources.getSystem().getDisplayMetrics());
    }

    public void setCloseOnBackPress(boolean value)
    {
        this.closeOnBackPress = value;
    }

    public boolean getCloseOnBackPress()
    {
        return this.closeOnBackPress;
    }

    public void addChangeListener(DrawerChangeListener listener)
    {
        this.changeListeners.add(listener);
    }

    public void removeChangeListener(DrawerChangeListener listener)
    {
        this.changeListeners.remove(listener);
    }

    public DrawerFadeLayer getFadeLayer()
    {
        return this.fadeLayer;
    }

    public void setFadeLayer(DrawerFadeLayer value)
    {
        if (value == this.fadeLayer) {
            return;
        }
        this.fadeLayer = value;
        resolveTransition().setFadeLayer(resolveFadeLayer().view());

        setMainContent(this.mainContent);
    }

    public boolean getTapOutsideToClose()
    {
        return this.tapOutsideToClose;
    }

    public void setTapOutsideToClose(boolean value)
    {
        this.tapOutsideToClose = value;
    }

    public int getTouchTargetThreshold()
    {
        return this.touchTargetThreshold;
    }

    public void setTouchTargetThreshold(int value)
    {
        this.touchTargetThreshold = value;
    }

    public void setDrawerLocation(DrawerLocation value)
    {
        if (this.drawerLocation == value) {
            return;
        }
        resolveTransition().setLocation(value);

        setIsOpen(false);

        this.drawerLocation = value;

        setDrawerContent(this.drawerContent);
    }

    public DrawerLocation getDrawerLocation()
    {
        return this.drawerLocation;
    }

    public void setIsLocked(boolean value)
    {
        this.isLocked = value;
    }

    public boolean getIsLocked()
    {
        return this.isLocked;
    }

    public int getDrawerSize()
    {
        return this.drawerSize;
    }

    public void setDrawerSize(int value)
    {
        if (value < 0) {
            throw new IllegalArgumentException("Value cannot be less than 0.");
        }
        this.drawerSize = value;

        setDrawerContent(this.drawerContent);
    }

    public void setMainContent(int resId)
    {
        LayoutInflater inflater = (LayoutInflater)getContext().getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        setMainContent(inflater.inflate(resId, null));
    }

    public void setMainContent(View value)
    {
        if (this.mainContent != null)
        {
            this.mainContainer.removeAllViews();
            removeView(this.mainContainer);
        }
        this.mainContent = value;
        if (value != null)
        {
            this.mainContainer = new FrameLayout(getContext());
            this.mainContainer.addView(this.mainContent);

            DrawerFadeLayer fadeLayer = resolveFadeLayer();
            this.mainContainer.addView(fadeLayer.view());
            if (!this.isOpen) {
                fadeLayer.hide();
            }
            addView(this.mainContainer);
        }
        if (this.drawerContainer != null) {
            this.drawerContainer.bringToFront();
        }
        resolveTransition().setMainContent(this.mainContainer);
    }

    public View getMainContent()
    {
        return this.mainContent;
    }

    public void setDrawerContent(int resId)
    {
        LayoutInflater inflater = (LayoutInflater)getContext().getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        setDrawerContent(inflater.inflate(resId, null));
    }

    public void setDrawerContent(View value)
    {
        if (this.drawerContent != null)
        {
            this.drawerContainer.removeView(this.drawerContent);
            removeView(this.drawerContainer);
        }
        this.drawerContent = value;
        if (value != null)
        {
            this.drawerContainer = new FrameLayout(getContext());
            this.drawerContainer.setClickable(true);
            if (!this.isOpen) {
                this.drawerContainer.setVisibility(View.INVISIBLE);
            }
            this.drawerContainer.addView(value);

            int mainDimension = this.drawerSize == 0 ? -2 : this.drawerSize;
            FrameLayout.LayoutParams params;
            if ((this.drawerLocation == DrawerLocation.TOP) || (this.drawerLocation == DrawerLocation.BOTTOM)) {
                params = new FrameLayout.LayoutParams(-1, mainDimension);
            } else {
                params = new FrameLayout.LayoutParams(mainDimension, -1);
            }
            params.gravity = getGravity();
            addView(this.drawerContainer, params);
        }
        resolveTransition().setDrawerContent(this.drawerContainer);
    }

    public View getDrawerContent()
    {
        return this.drawerContent;
    }

    public boolean getIsOpen()
    {
        return this.isOpen;
    }

    public void setIsOpen(boolean value, boolean animate)
    {
        if (value == this.isOpen) {
            return;
        }
        if (this.drawerContent == null) {
            return;
        }
        if ((value) && (notifyOpening())) {
            return;
        }
        if ((!value) && (notifyClosing())) {
            return;
        }
        this.isOpen = value;
        if (this.isOpen) {
            openDrawerCore(animate);
        } else {
            closeDrawerCore(animate);
        }
    }

    public void setIsOpen(boolean value)
    {
        setIsOpen(value, true);
    }

    public DrawerTransition getDrawerTransition()
    {
        return this.drawerTransition;
    }

    public void setDrawerTransition(DrawerTransition value)
    {
        if (this.drawerTransition == value) {
            return;
        }
        this.drawerTransition = value;

        DrawerTransition actualTransition = resolveTransition();
        actualTransition.setFadeLayer(resolveFadeLayer().view());
        actualTransition.setLocation(this.drawerLocation);

        setMainContent(this.mainContent);
        setDrawerContent(this.drawerContent);
        if (this.isOpen) {
            post(new Runnable()
            {
                public void run()
                {
                    SideDrawer.this.resolveTransition().setProgress(1.0F);
                }
            });
        }
    }

    public boolean onKeyUp(int keyCode, KeyEvent event)
    {
        if ((!this.closeOnBackPress) || (this.isLocked) || (!this.isOpen)) {
            return super.onKeyUp(keyCode, event);
        }
        setIsOpen(false);

        return true;
    }

    public boolean onTouchEvent(MotionEvent event)
    {
        return (onGesture(event)) || (super.onTouchEvent(event));
    }

    public boolean onInterceptTouchEvent(MotionEvent event)
    {
        return (onGesture(event)) || (super.onInterceptTouchEvent(event));
    }

    protected void onAttachedToWindow()
    {
        super.onAttachedToWindow();
    }

    protected boolean onGesture(MotionEvent event)
    {
        if (this.isLocked) {
            return false;
        }
        switch (event.getAction())
        {
            case 0:
                return handleOnDown(event);
            case 1:
                return handleOnUp(event);
            case 2:
                return handleOnMove(event);
        }
        return false;
    }

    protected boolean handleOnDown(MotionEvent event)
    {
        this.onDown = true;
        this.previousEvent = MotionEvent.obtain(event);
        if (this.isOpen) {
            this.openThreshold = 0.8F;
        } else {
            this.openThreshold = 0.2F;
        }
        if (this.isOpen)
        {
            if (isOutsideTap(event)) {
                return true;
            }
        }
        else if (shouldOpen(event))
        {
            this.drawerContainer.setVisibility(View.VISIBLE);
            resolveFadeLayer().show();
            resolveTransition().setProgress(0.05F);
            return true;
        }
        return false;
    }

    protected boolean handleOnUp(MotionEvent event)
    {
        this.previousEvent = null;
        if (this.onDown)
        {
            this.onDown = false;
            if (this.isOpen)
            {
                if (isOutsideTap(event))
                {
                    if (this.tapOutsideToClose)
                    {
                        closeDrawerCore(true);
                        this.isOpen = false;
                        return true;
                    }
                }
                else {
                    return false;
                }
            }
            else
            {
                resolveTransition().setProgress(0.0F);
                return false;
            }
        }
        if (this.isOpen) {
            openDrawerCore(true);
        } else {
            closeDrawerCore(true);
        }
        this.onDown = false;
        return true;
    }

    protected boolean handleOnMove(MotionEvent event)
    {
        if (this.previousEvent != null)
        {
            float xDelta = Math.abs(event.getX() - this.previousEvent.getX());
            float yDelta = Math.abs(event.getY() - this.previousEvent.getY());
            if ((xDelta < 10.0F) && (yDelta < 10.0F)) {
                return false;
            }
        }
        return (this.drawerContainer.getVisibility() == View.VISIBLE) && (handlePan(event));
    }

    protected boolean handlePan(MotionEvent event)
    {
        this.onDown = false;

        float xDelta = event.getX() - this.previousEvent.getX();
        float yDelta = event.getY() - this.previousEvent.getY();

        float absXDelta = Math.abs(xDelta);
        float absYDelta = Math.abs(yDelta);
        if (((this.drawerLocation == DrawerLocation.LEFT) || (this.drawerLocation == DrawerLocation.RIGHT)) && (absYDelta > absXDelta)) {
            return false;
        }
        if (((this.drawerLocation == DrawerLocation.TOP) || (this.drawerLocation == DrawerLocation.BOTTOM)) && (absXDelta > absYDelta)) {
            return false;
        }
        float progress = 0.0F;
        switch (this.drawerLocation)
        {
            case LEFT:
                progress = xDelta / this.drawerContent.getMeasuredWidth();
                break;
            case RIGHT:
                progress = -xDelta / this.drawerContent.getMeasuredWidth();
                break;
            case TOP:
                progress = yDelta / this.drawerContent.getMeasuredHeight();
                break;
            case BOTTOM:
                progress = -yDelta / this.drawerContent.getMeasuredHeight();
        }
        DrawerTransition transition = resolveTransition();
        transition.setProgress(transition.getProgress() + progress);

        this.isOpen = (transition.getProgress() > this.openThreshold);
        this.previousEvent = MotionEvent.obtain(event);
        return true;
    }

    private boolean shouldOpen(MotionEvent event)
    {
        switch (this.drawerLocation)
        {
            case LEFT:
                return event.getX() <= this.touchTargetThreshold;
            case RIGHT:
                return event.getX() >= getMeasuredWidth() - this.touchTargetThreshold;
            case TOP:
                return event.getY() <= this.touchTargetThreshold;
            case BOTTOM:
                return event.getY() >= getMeasuredHeight() - this.touchTargetThreshold;
        }
        return false;
    }

    private boolean isOutsideTap(MotionEvent event)
    {
        Rect rect = new Rect();
        this.drawerContainer.getHitRect(rect);

        return !rect.contains(Math.round(event.getX()), Math.round(event.getY()));
    }

    public void onTransitionEnded(DrawerTransition transition)
    {
        transition.removeTransitionEndedListener(this);
        if (this.isOpen)
        {
            notifyOpened();
        }
        else
        {
            this.drawerContainer.setVisibility(View.INVISIBLE);
            resolveFadeLayer().hide();
            notifyClosed();
        }
    }

    protected void openDrawerCore(boolean animate)
    {
        this.drawerContainer.setVisibility(View.VISIBLE);

        resolveFadeLayer().show();

        final DrawerTransition transition = resolveTransition();
        if (!animate)
        {
            post(new Runnable()
            {
                public void run()
                {
                    transition.setProgress(1.0F);
                }
            });
            notifyOpened();
            return;
        }
        transition.addTransitionEndedListener(this);
        transition.animateOpen();
    }

    protected void closeDrawerCore(boolean animate)
    {
        final DrawerTransition transition = resolveTransition();
        if (!animate)
        {
            this.drawerContainer.setVisibility(View.INVISIBLE);
            resolveFadeLayer().hide();
            post(new Runnable()
            {
                public void run()
                {
                    transition.setProgress(0.0F);
                }
            });
            notifyClosed();
            return;
        }
        transition.addTransitionEndedListener(this);
        transition.animateClose();
    }

    protected DrawerFadeLayer resolveFadeLayer()
    {
        if (this.fadeLayer == null) {
            return this.defaultFadeLayer;
        }
        return this.fadeLayer;
    }

    protected DrawerTransition resolveTransition()
    {
        if (this.drawerTransition != null) {
            return this.drawerTransition;
        }
        return this.defaultTransition;
    }

    private int getGravity()
    {
        switch (this.drawerLocation)
        {
            case LEFT:
                return 3;
            case RIGHT:
                return 5;
            case TOP:
                return 48;
            case BOTTOM:
                return 80;
        }
        return 0;
    }

    protected void notifyOpened()
    {
        DrawerChangeListener[] listeners = new DrawerChangeListener[this.changeListeners.size()];
        this.changeListeners.toArray(listeners);
        for (DrawerChangeListener listener : listeners) {
            listener.onDrawerOpened(this);
        }
    }

    protected void notifyClosed()
    {
        DrawerChangeListener[] listeners = new DrawerChangeListener[this.changeListeners.size()];
        this.changeListeners.toArray(listeners);
        for (DrawerChangeListener listener : listeners) {
            listener.onDrawerClosed(this);
        }
    }

    protected boolean notifyOpening()
    {
        boolean result = false;

        DrawerChangeListener[] listeners = new DrawerChangeListener[this.changeListeners.size()];
        this.changeListeners.toArray(listeners);
        for (DrawerChangeListener listener : listeners) {
            if (listener.onDrawerOpening(this)) {
                result = true;
            }
        }
        return result;
    }

    protected boolean notifyClosing()
    {
        boolean result = false;

        DrawerChangeListener[] listeners = new DrawerChangeListener[this.changeListeners.size()];
        this.changeListeners.toArray(listeners);
        for (DrawerChangeListener listener : listeners) {
            if (listener.onDrawerClosing(this)) {
                result = true;
            }
        }
        return result;
    }

    protected Parcelable onSaveInstanceState()
    {
        Parcelable parcelable = super.onSaveInstanceState();
        return new SideDrawerState(this, parcelable);
    }

    protected void onRestoreInstanceState(Parcelable state)
    {
        SideDrawerState drawerState = (SideDrawerState)state;
        super.onRestoreInstanceState(drawerState.getSuperState());

        restoreState(drawerState);
    }

    protected void restoreState(SideDrawerState state)
    {
        this.isLocked = state.getIsLocked();
        this.drawerLocation = state.getDrawerLocation();
        this.touchTargetThreshold = state.getTouchTargetThreshold();
        this.tapOutsideToClose = state.getTapOutsideToClose();
        setIsOpen(state.getIsOpen(), false);
        setDrawerTransition(state.getTransition());
    }
}
