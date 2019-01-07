package com.telerik.sidedrawer;

import android.os.Parcel;
import android.view.View;
import android.view.animation.Interpolator;

public abstract interface DrawerTransition
{
    public abstract void animateOpen();

    public abstract void animateClose();

    public abstract void addTransitionEndedListener(DrawerTransitionEndedListener paramDrawerTransitionEndedListener);

    public abstract void removeTransitionEndedListener(DrawerTransitionEndedListener paramDrawerTransitionEndedListener);

    public abstract void setDuration(long paramLong);

    public abstract long getDuration();

    public abstract void setInterpolator(Interpolator paramInterpolator);

    public abstract Interpolator getInterpolator();

    public abstract void setFadeLayerOpacity(float paramFloat);

    public abstract float getFadeLayerOpacity();

    public abstract void setProgress(float paramFloat);

    public abstract float getProgress();

    public abstract void setMainContent(View paramView);

    public abstract void setDrawerContent(View paramView);

    public abstract void setFadeLayer(View paramView);

    public abstract void setLocation(DrawerLocation paramDrawerLocation);

    public abstract void saveInstanceState(Parcel paramParcel, int paramInt);

    public abstract void restoreInstanceState(Parcel paramParcel);
}