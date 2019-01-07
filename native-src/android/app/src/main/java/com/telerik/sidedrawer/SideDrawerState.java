package com.telerik.sidedrawer;

import android.os.Parcel;
import android.os.Parcelable;
import android.os.Parcelable.Creator;
import android.view.View;

public class SideDrawerState
        extends View.BaseSavedState
{
    public static final Parcelable.Creator<SideDrawerState> CREATOR = new Parcelable.Creator()
    {
        public SideDrawerState createFromParcel(Parcel source)
        {
            return new SideDrawerState(source);
        }

        public SideDrawerState[] newArray(int size)
        {
            return new SideDrawerState[size];
        }
    };
    private SideDrawer drawer;
    private boolean tapOutside = false;
    private int touchTarget = 0;
    private DrawerLocation location;
    private boolean isLocked;
    private boolean isOpen;
    private String transitionTypeName;
    private DrawerTransition transition;
    private boolean closeOnBackPress;

    public SideDrawerState(SideDrawer drawer, Parcelable parentState)
    {
        super(parentState);

        this.drawer = drawer;
        this.tapOutside = drawer.getTapOutsideToClose();
        this.touchTarget = drawer.getTouchTargetThreshold();
        this.location = drawer.getDrawerLocation();
        this.isLocked = drawer.getIsLocked();
        this.isOpen = drawer.getIsOpen();
        this.transition = drawer.getDrawerTransition();
        if (this.transition != null) {
            this.transitionTypeName = this.transition.getClass().getName();
        }
        this.closeOnBackPress = drawer.getCloseOnBackPress();
    }

    public SideDrawerState(Parcel parcel)
    {
        super(parcel);
        this.tapOutside = ((Boolean)parcel.readValue(null)).booleanValue();
        this.touchTarget = parcel.readInt();
        this.location = ((DrawerLocation)parcel.readValue(null));
        this.isLocked = ((Boolean)parcel.readValue(null)).booleanValue();
        this.isOpen = ((Boolean)parcel.readValue(null)).booleanValue();
        this.transitionTypeName = parcel.readString();
        if (!this.transitionTypeName.isEmpty()) {
            try
            {
                Class transitionClass = Class.forName(this.transitionTypeName);
                this.transition = ((DrawerTransition)transitionClass.newInstance());
                this.transition.restoreInstanceState(parcel);
            }
            catch (ClassNotFoundException ex)
            {
                throw new Error(ex);
            }
            catch (InstantiationException ex)
            {
                throw new Error(ex);
            }
            catch (IllegalAccessException ex)
            {
                throw new Error(ex);
            }
        }
        this.closeOnBackPress = ((Boolean)parcel.readValue(null)).booleanValue();
    }

    public boolean getTapOutsideToClose()
    {
        return this.tapOutside;
    }

    public int getTouchTargetThreshold()
    {
        return this.touchTarget;
    }

    public DrawerLocation getDrawerLocation()
    {
        return this.location;
    }

    public boolean getIsLocked()
    {
        return this.isLocked;
    }

    public boolean getIsOpen()
    {
        return this.isOpen;
    }

    public DrawerTransition getTransition()
    {
        return this.transition;
    }

    public int describeContents()
    {
        super.describeContents();
        return 0;
    }

    public void writeToParcel(Parcel dest, int flags)
    {
        super.writeToParcel(dest, flags);
        dest.writeValue(Boolean.valueOf(this.drawer.getTapOutsideToClose()));
        dest.writeInt(this.drawer.getTouchTargetThreshold());
        dest.writeValue(this.drawer.getDrawerLocation());
        dest.writeValue(Boolean.valueOf(this.drawer.getIsLocked()));
        dest.writeValue(Boolean.valueOf(this.drawer.getIsOpen()));
        if (this.transitionTypeName != null) {
            dest.writeString(this.transitionTypeName);
        }
        dest.writeValue(Boolean.valueOf(this.closeOnBackPress));
    }
}