import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'

import { getProjects } from '../actions/projectActions'
import { openSideMenu, closeSideMenu } from '../actions/UIActions'

const drawerWidth = 240

class AppLayout extends React.Component {
	state = {
    	anchor: 'left',
	}
	
	componentDidMount = () => {
		this.props.getProjects()
	}

	handleDrawerOpen = () => {
		this.props.openSideMenu()
	}

	handleDrawerClose = () => {
		this.props.closeSideMenu()
	}

	handleChangeAnchor = event => {
    	this.setState({
    		anchor: event.target.value,
    	})
	}
	
	getHeaderStyle = () => {
		const path = window.location.pathname
		if (path.indexOf('project') !== -1 || path.indexOf('create') !== -1 ) {
			return {
				backgroundImage: 'linear-gradient(to right, #434863, #004d7a, #0089a5, #00c6a8, #87ff59)'
			}
		}
		return {
			backgroundImage: 'linear-gradient(to right, #051937, #434863, #7e7f92, #bbbac5, #fafafa)',
		}
	}
	
	render() {
    	const { classes, theme, isSideMenuOpen } = this.props
    	const { anchor } = this.state
    	const drawer = (
    		<Drawer
	    		variant="persistent"
	    		anchor={anchor}
	    		open={isSideMenuOpen}
	    		classes={{
	    			paper: classes.drawerPaper,
	    		}}
    		>
    		<div className={classes.drawerHeader}>
    			<IconButton onClick={this.handleDrawerClose}>
    			{theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
    			</IconButton>
    		</div>
    		{ this.props.menuContent }
    		</Drawer>
    	)

    	let before = null
    	let after = null

    	if (anchor === 'left') {
    		before = drawer
    	} else {
    		after = drawer
    	}

    	return (
    		<div className={classes.root}>
	    		<div className={classes.appFrame}>
	    			<AppBar
						style={this.getHeaderStyle()}
		    			className={classNames(classes.appBar, {
		    				[classes.appBarShift]: isSideMenuOpen,
		    				[classes[`appBarShift-${anchor}`]]: isSideMenuOpen,
		    			})}
	    			>
	    			<Toolbar disableGutters={!isSideMenuOpen}>
	    				<IconButton
		    				color="inherit"
		    				aria-label="Open drawer"
		    				onClick={this.handleDrawerOpen}
		    				className={classNames(classes.menuButton, isSideMenuOpen && classes.hide)}
	    				>
	    				<MenuIcon />
	    				</IconButton>
	    				<Typography 
							className={classes.headerTitle}
							variant="title"
							color="inherit" 
							noWrap
						>
	    					Cloudfound
	    				</Typography>
	    			</Toolbar>
	    			</AppBar>
	    			{before}
	    			<main
		    			className={classNames(classes.content, classes[`content-${anchor}`], {
		    				[classes.contentShift]: isSideMenuOpen,
		    				[classes[`contentShift-${anchor}`]]: isSideMenuOpen,
		    			})}
	    			>
		    			<div className={classes.drawerHeader} />
						<div className={classes.bodyContent}>
							{ this.props.bodyContent }
						</div>
	    			</main>
	    			{after}
	    		</div>
    		</div>
    	)
	}
}

const styles = theme => ({
	root: {
		height: '100%',
		flexGrow: 1,
	},
	appFrame: {
    	height: '100%	',
    	zIndex: 1,
    	overflow: 'auto',
    	position: 'relative',
    	display: 'flex',
    	width: '100%',
	},
	appBar: {
    	position: 'fixed',
    	transition: theme.transitions.create(['margin', 'width'], {
    		easing: theme.transitions.easing.sharp,
    		duration: theme.transitions.duration.leavingScreen,
    	}),
		// backgroundColor: '#1a73e8', //'#000000fc',
	    
		// backgroundImage: 'linear-gradient(to right, #051937, #004d7a, #0089a5, #00c6a8, #66ff88)', // brighter right
		// backgroundImage: 'linear-gradient(to right, #051937, #004d7a, #0089a5, #00c6a8, #87ff59)', // default
		backgroundImage: 'linear-gradient(to right, #434863, #004d7a, #0089a5, #00c6a8, #87ff59)', // brighter left
	    backgroundImage: 'linear-gradient(to right, #051937, #434863, #7e7f92, #bbbac5, #fafafa)',
	},
	appBarShift: {
    	width: `calc(100% - ${drawerWidth}px)`,
    	transition: theme.transitions.create(['margin', 'width'], {
    		easing: theme.transitions.easing.easeOut,
    		duration: theme.transitions.duration.enteringScreen,
    	}),
	},
	'appBarShift-left': {
        marginLeft: drawerWidth,
	},
	'appBarShift-right': {
        marginRight: drawerWidth,
	},
	menuButton: {
    	marginLeft: 12,
    	marginRight: 20,
	},
	headerTitle: {
		fontWeight: 300,
		letterSpacing: '8px',
	},
 	hide: {
    	display: 'none',
	},
	drawerPaper: {
    	position: 'fixed',
		height: '100vh',
    	width: drawerWidth,
		border: 'none',
		boxShadow: '8px 5px 23px -8px rgba(0,0,0,0.07)',
	},
	drawerHeader: {
    	display: 'flex',
    	alignItems: 'center',
    	justifyContent: 'flex-end',
    	// padding: '0 8px',
    	...theme.mixins.toolbar,
	},
	content: {
    	flexGrow: 1,
    	// backgroundColor: theme.palette.background.default,
		
    	padding: 0, //theme.spacing.unit * 3,
    	transition: theme.transitions.create('margin', {
    		easing: theme.transitions.easing.sharp,
    		duration: theme.transitions.duration.leavingScreen,
    	}),
	},

	'content-left': {
        // marginLeft: -drawerWidth,
	},
	'content-right': {
        marginRight: -drawerWidth,
	},
	contentShift: {
    	transition: theme.transitions.create('margin', {
    		easing: theme.transitions.easing.easeOut,
    		duration: theme.transitions.duration.enteringScreen,
    	}),
	},
	'contentShift-left': {
        marginLeft: drawerWidth,
	},
	'contentShift-right': {
        marginRight: 0,
	},
})

AppLayout.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
	isSideMenuOpen: state.UIReducer.isSideMenuOpen
})

const mapDispatchToProps = dispatch => ({
	getProjects: () => dispatch(getProjects()),
	openSideMenu: () => dispatch(openSideMenu()),
	closeSideMenu: () => dispatch(closeSideMenu()),
})

export default withStyles(styles, { withTheme: true })(
	connect(mapStateToProps, mapDispatchToProps)(AppLayout)
)