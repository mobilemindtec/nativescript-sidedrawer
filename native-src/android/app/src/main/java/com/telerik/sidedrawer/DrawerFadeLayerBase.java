package com.telerik.sidedrawer;

import android.content.Context;
import android.view.View;
import android.widget.FrameLayout;

public class DrawerFadeLayerBase
        extends FrameLayout
        implements DrawerFadeLayer
{
    public DrawerFadeLayerBase(Context context)
    {
        super(context);
    }

    public void show()
    {
        setVisibility(View.VISIBLE);
    }

    public void hide()
    {
        setVisibility(View.GONE);
    }

    public View view()
    {
        return this;
    }
}