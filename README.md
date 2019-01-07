# nativescript-sidedrawer

demo -> demo app

### how to use xml

```
  	<drawer:SideDrawer 
  		id="sideDrawer"  
  		drawerPosition="left" 
  		drawerMargin="50"
  		drawerOpening="drawerOpening"
  		drawerOpened="drawerOpened"
  		drawerClosing="drawerClosing"
  		drawerClosed="drawerClosed">

  		<drawer:SideDrawer.drawerContent>
  			<StackLayout backgroundColor="#2980b9">  				
				 <ListView items="{{ sidebarItems }}">
				    <ListView.itemTemplate>
				       <GridLayout columns="auto, auto" style="padding: 10 10;">
				       		<Image src="{{ icon }}" col="0" style="width: 40;"/>
				       		<Label text="{{ title }}" col="1" style="color: #2c3e50; margin-left: 15;" />
				       </GridLayout>
				    </ListView.itemTemplate>
				 </ListView>  				
  			</StackLayout>
  		</drawer:SideDrawer.drawerContent>

  		<drawer:SideDrawer.mainContent>
  			<StackLayout>
  				<Label text="mainContent" />
  			</StackLayout>
  		</drawer:SideDrawer.mainContent>

  	</drawer:SideDrawer>
```

### how to use js

```
var viewModel = new observableModule.Observable({
  'sidebarItems': [{
  	icon: '~/res/icon.png',
  	title: 'Option A',
  },{
  	icon: '~/res/icon.png',
  	title: 'Option B',
  },{
  	icon: '~/res/icon.png',
  	title: 'Option C',
  },{
  	icon: '~/res/icon.png',
  	title: 'Option D',
  },]
})
var drawer

exports.loaded = function(args) {
    var page = args.object;     
    page.bindingContext = viewModel;
    drawer = page.getViewById("sideDrawer")    
}

exports.onOpen = function(){	
	drawer.toggleDrawerState()
}

exports.drawerOpening = function(){
	console.log("drawerOpening")
}

exports.drawerOpened = function(){
	console.log("drawerOpened")	
}

exports.drawerClosing = function(){
	console.log("drawerClosing")	
}

exports.drawerClosed = function(){
	console.log("drawerClosed")
}
```


https://github.com/mobilemindtec/nativescript-sidedrawer/blob/master/ios.png
