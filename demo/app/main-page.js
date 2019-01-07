
var app = require("application")
var frameModule = require("ui/frame");
var observableModule = require("data/observable");
require("./nativescript-sidedrawer")
var drawer

var viewModel = observableModule.fromObject({
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
  },],
  'state': false,
  'message': 'status 0'
})

var i = 0

exports.loaded = (args) => {
    var page = args.object;
    page.bindingContext = viewModel;
    drawer = page.getViewById("sideDrawer")
}

exports.onOpen = () => {
	drawer.toggleDrawerState()
}

exports.onTap = () => {
  viewModel.set('state', !viewModel.get('state'))
  i++
  viewModel.set('message', 'status ' + i)
}

exports.drawerOpening = () => {
	console.log("drawerOpening")
}

exports.drawerOpened = () => {
	console.log("drawerOpened")
}

exports.drawerClosing = () => {
	console.log("drawerClosing")
}

exports.drawerClosed = () => {
	console.log("drawerClosed")
}

exports.onItemTap = (args) => {
  console.log(`item tap ${args.index}`);
}
