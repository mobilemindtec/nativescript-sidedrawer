package com.telerik.sidedrawer;

import android.support.v4.view.ViewCompat;
import android.support.v4.view.ViewPropertyAnimatorCompat;
import android.view.View;

public class SlideInOnTopTransition
        extends DrawerTransitionBase
{
    protected void animateOpenLeft(View mainContent, View drawerContent, View fadeLayer)
    {
        int drawerWidth = drawerContent.getMeasuredWidth();
        ViewCompat.setTranslationX(drawerContent, -drawerWidth * (1.0F - getProgress()));
        ViewCompat.animate(drawerContent).translationX(0.0F).setDuration(getDuration()).setInterpolator(getInterpolator()).withEndAction(this);
    }

    protected void animateCloseLeft(View mainContent, View drawerContent, View fadeLayer)
    {
        int drawerWidth = drawerContent.getMeasuredWidth();
        ViewCompat.animate(drawerContent).translationX(-drawerWidth).setDuration(getDuration()).withEndAction(this).setInterpolator(getInterpolator());
    }

    protected void animateOpenRight(View mainContent, View drawerContent, View fadeLayer)
    {
        int drawerWidth = drawerContent.getMeasuredWidth();
        ViewCompat.setTranslationX(drawerContent, drawerWidth * (1.0F - getProgress()));
        ViewCompat.animate(drawerContent).translationX(0.0F).setDuration(getDuration()).setInterpolator(getInterpolator()).withEndAction(this);
    }

    protected void animateCloseRight(View mainContent, View drawerContent, View fadeLayer)
    {
        int drawerWidth = drawerContent.getMeasuredWidth();
        ViewCompat.animate(drawerContent).translationX(drawerWidth).setDuration(getDuration()).withEndAction(this).setInterpolator(getInterpolator());
    }

    protected void animateOpenTop(View mainContent, View drawerContent, View fadeLayer)
    {
        int drawerHeight = drawerContent.getMeasuredHeight();
        ViewCompat.setTranslationY(drawerContent, -drawerHeight * (1.0F - getProgress()));
        ViewCompat.animate(drawerContent).translationY(0.0F).setDuration(getDuration()).setInterpolator(getInterpolator()).withEndAction(this);
    }

    protected void animateCloseTop(View mainContent, View drawerContent, View fadeLayer)
    {
        int drawerHeight = drawerContent.getMeasuredHeight();
        ViewCompat.animate(drawerContent).translationY(-drawerHeight).setDuration(getDuration()).withEndAction(this).setInterpolator(getInterpolator());
    }

    protected void animateOpenBottom(View mainContent, View drawerContent, View fadeLayer)
    {
        int drawerHeight = drawerContent.getMeasuredHeight();
        ViewCompat.setTranslationY(drawerContent, drawerHeight * (1.0F - getProgress()));
        ViewCompat.animate(drawerContent).translationY(0.0F).setDuration(getDuration()).setInterpolator(getInterpolator()).withEndAction(this);
    }

    protected void animateCloseBottom(View mainContent, View drawerContent, View fadeLayer)
    {
        int drawerHeight = drawerContent.getMeasuredHeight();
        ViewCompat.animate(drawerContent).translationY(drawerHeight).setDuration(getDuration()).withEndAction(this).setInterpolator(getInterpolator());
    }

    protected void setProgressLeft(float value, View mainContent, View drawerContent, View fadeLayer)
    {
        int drawerWidth = drawerContent.getMeasuredWidth();
        ViewCompat.setTranslationX(drawerContent, drawerWidth * (value - 1.0F));
    }

    protected void setProgressRight(float value, View mainContent, View drawerContent, View fadeLayer)
    {
        int drawerWidth = drawerContent.getMeasuredWidth();
        ViewCompat.setTranslationX(drawerContent, drawerWidth * (1.0F - value));
    }

    protected void setProgressTop(float value, View mainContent, View drawerContent, View fadeLayer)
    {
        int drawerHeight = drawerContent.getMeasuredHeight();
        ViewCompat.setTranslationY(drawerContent, drawerHeight * (value - 1.0F));
    }

    protected void setProgressBottom(float value, View mainContent, View drawerContent, View fadeLayer)
    {
        int drawerHeight = drawerContent.getMeasuredHeight();
        ViewCompat.setTranslationY(drawerContent, drawerHeight * (1.0F - value));
    }

    public String toString()
    {
        return "SlideInOnTop";
    }
}