import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';

import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import { Slide, Button, Toolbar, AppBar } from '@material-ui/core';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import AppDrawer from './AppDrawer';
import { useGlobal } from 'reactn';

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1
	},
	menuButton: {
		marginRight: theme.spacing(2)
	},
	title: {
		flexGrow: 1,
		whiteSpace: 'nowrap',
		textOverflow: 'ellipsis',
		overflowX: 'hidden'
	}
}));

function HideOnScroll(props) {
	const { children, window } = props;
	const trigger = useScrollTrigger();
	return (
		<Slide appear={false} direction="down" in={!trigger}>
			{children}
		</Slide>
	);
}

HideOnScroll.propTypes = {
	children: PropTypes.node.isRequired,
	// Injected by the documentation to work in an iframe.
	// You won't need it on your project.
	window: PropTypes.func
};

function TheAppBar() {
	const classes = useStyles();
	const [ open, setOpen ] = useGlobal('sidebarOpen');
	const [ showList, setShowList ] = useGlobal('showList');
	const [ myShifts, setMyShifts ] = useGlobal('myShifts');
	const [ group ] = useGlobal('group');
	return (
		<React.Fragment>
			<HideOnScroll>
				<AppBar>
					<Toolbar>
						<IconButton
							onClick={() => {
								if (showList) {
									setShowList(false);
								} else {
									setOpen(true);
								}
							}}
							edge="start"
							className={classes.menuButton}
							color="inherit"
							aria-label="Menu"
						>
							{!showList && <MenuIcon />}
							{showList && <KeyboardArrowLeft />}
						</IconButton>
						<Typography variant="h6" className={classes.title}>
							{group.name}
						</Typography>
						<Button
							onClick={() => {
								setMyShifts(!myShifts);
							}}
							color="inherit"
						>
							{!myShifts ? 'All Shifts' : 'My Shifts'}
						</Button>
					</Toolbar>
				</AppBar>
			</HideOnScroll>
			<AppDrawer />
		</React.Fragment>
	);
}

export default TheAppBar;
