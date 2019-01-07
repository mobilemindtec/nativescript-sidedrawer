package com.telerik.sidedrawer;

public abstract interface DrawerChangeListener
{
    public abstract boolean onDrawerOpening(SideDrawer paramRadSideDrawer);

    public abstract void onDrawerOpened(SideDrawer paramRadSideDrawer);

    public abstract boolean onDrawerClosing(SideDrawer paramRadSideDrawer);

    public abstract void onDrawerClosed(SideDrawer paramRadSideDrawer);
}
