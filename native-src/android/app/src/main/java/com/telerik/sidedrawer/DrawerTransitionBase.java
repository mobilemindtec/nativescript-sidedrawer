package com.telerik.sidedrawer;

import android.os.Parcel;
import android.support.v4.view.ViewCompat;
import android.view.View;
import android.view.animation.DecelerateInterpolator;
import android.view.animation.Interpolator;
import java.util.ArrayList;

public abstract class DrawerTransitionBase
        implements DrawerTransition, Runnable
{
    private ArrayList<DrawerTransitionEndedListener> endedListeners = new ArrayList();
    private long duration = 500L;
    private Interpolator interpolator = new DecelerateInterpolator(2.0F);
    private float fadeLayerOpacity = 0.6F;
    private View mainContent;
    private View drawerContent;
    private View fadeLayer;
    private DrawerLocation location = DrawerLocation.LEFT;
    private float progress;
    private boolean opening;
    private boolean closing;

    public void saveInstanceState(Parcel parcel, int flags)
    {
        parcel.writeFloat(this.fadeLayerOpacity);
        parcel.writeLong(this.duration);
    }

    public void restoreInstanceState(Parcel parcel)
    {
        this.fadeLayerOpacity = parcel.readFloat();
        this.duration = parcel.readLong();
    }

    public void setMainContent(View value)
    {
        this.mainContent = value;
    }

    public void setDrawerContent(View value)
    {
        this.drawerContent = value;
    }

    public void setFadeLayer(View value)
    {
        this.fadeLayer = value;
    }

    public void setLocation(DrawerLocation value)
    {
        this.location = value;
    }

    public void setProgress(float value)
    {
        if (value > 1.0F) {
            value = 1.0F;
        }
        if (value < 0.0F) {
            value = 0.0F;
        }
        this.progress = value;

        ViewCompat.setAlpha(this.fadeLayer, value * getFadeLayerOpacity());
        switch (this.location)
        {
            case LEFT:
                setProgressLeft(value, this.mainContent, this.drawerContent, this.fadeLayer);
                break;
            case RIGHT:
                setProgressRight(value, this.mainContent, this.drawerContent, this.fadeLayer);
                break;
            case TOP:
                setProgressTop(value, this.mainContent, this.drawerContent, this.fadeLayer);
                break;
            case BOTTOM:
                setProgressBottom(value, this.mainContent, this.drawerContent, this.fadeLayer);
        }
    }

    public float getProgress()
    {
        return this.progress;
    }

    public long getDuration()
    {
        return this.duration;
    }

    public void setDuration(long value)
    {
        this.duration = value;
    }

    public void setInterpolator(Interpolator value)
    {
        this.interpolator = value;
    }

    public Interpolator getInterpolator()
    {
        return this.interpolator;
    }

    public void addTransitionEndedListener(DrawerTransitionEndedListener listener)
    {
        this.endedListeners.add(listener);
    }

    public void removeTransitionEndedListener(DrawerTransitionEndedListener listener)
    {
        this.endedListeners.remove(listener);
    }

    public float getFadeLayerOpacity()
    {
        return this.fadeLayerOpacity;
    }

    public void setFadeLayerOpacity(float value)
    {
        this.fadeLayerOpacity = value;
    }

    public void animateOpen()
    {
        this.opening = true;
        ViewCompat.setAlpha(this.fadeLayer, getProgress() * this.fadeLayerOpacity);
        switch (this.location)
        {
            case LEFT:
                animateOpenLeft(this.mainContent, this.drawerContent, this.fadeLayer);
                break;
            case RIGHT:
                animateOpenRight(this.mainContent, this.drawerContent, this.fadeLayer);
                break;
            case TOP:
                animateOpenTop(this.mainContent, this.drawerContent, this.fadeLayer);
                break;
            case BOTTOM:
                animateOpenBottom(this.mainContent, this.drawerContent, this.fadeLayer);
        }
        ViewCompat.animate(this.fadeLayer).alpha(this.fadeLayerOpacity).setDuration(this.duration).setInterpolator(this.interpolator);
    }

    public void animateClose()
    {
        this.closing = true;
        ViewCompat.animate(this.fadeLayer).alpha(0.0F).setDuration(this.duration).setInterpolator(this.interpolator);
        switch (this.location)
        {
            case LEFT:
                animateCloseLeft(this.mainContent, this.drawerContent, this.fadeLayer);
                break;
            case RIGHT:
                animateCloseRight(this.mainContent, this.drawerContent, this.fadeLayer);
                break;
            case TOP:
                animateCloseTop(this.mainContent, this.drawerContent, this.fadeLayer);
                break;
            case BOTTOM:
                animateCloseBottom(this.mainContent, this.drawerContent, this.fadeLayer);
        }
    }

    protected abstract void animateOpenLeft(View paramView1, View paramView2, View paramView3);

    protected abstract void animateOpenRight(View paramView1, View paramView2, View paramView3);

    protected abstract void animateOpenTop(View paramView1, View paramView2, View paramView3);

    protected abstract void animateOpenBottom(View paramView1, View paramView2, View paramView3);

    protected abstract void animateCloseLeft(View paramView1, View paramView2, View paramView3);

    protected abstract void animateCloseRight(View paramView1, View paramView2, View paramView3);

    protected abstract void animateCloseTop(View paramView1, View paramView2, View paramView3);

    protected abstract void animateCloseBottom(View paramView1, View paramView2, View paramView3);

    protected abstract void setProgressLeft(float paramFloat, View paramView1, View paramView2, View paramView3);

    protected abstract void setProgressRight(float paramFloat, View paramView1, View paramView2, View paramView3);

    protected abstract void setProgressTop(float paramFloat, View paramView1, View paramView2, View paramView3);

    protected abstract void setProgressBottom(float paramFloat, View paramView1, View paramView2, View paramView3);

    public void run()
    {
        onEnded();
    }

    protected void onEnded()
    {
        if (this.opening) {
            setProgress(1.0F);
        }
        if (this.closing) {
            setProgress(0.0F);
        }
        this.opening = false;
        this.closing = false;
        DrawerTransitionEndedListener[] listeners = new DrawerTransitionEndedListener[this.endedListeners.size()];
        this.endedListeners.toArray(listeners);
        for (DrawerTransitionEndedListener listener : listeners) {
            listener.onTransitionEnded(this);
        }
    }
}
