import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, Typography, List, Divider, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { useGlobal } from 'reactn';

const useStyles = makeStyles((theme) => ({
	list: {
		width: 250
	},
	listHeader: {
		padding: theme.spacing(1, 2),
		fontSize: '150%'
	}
}));

function AppDrawer(props) {
	const [ open, setOpen ] = useGlobal('sidebarOpen');
	const [ group, setGroup ] = useGlobal('group');
	const [ groups, setGroups ] = useGlobal('groups');

	const classes = useStyles();

	return (
		<Drawer
			open={open}
			onClose={() => {
				setOpen(false);
			}}
		>
			<div
				className={classes.list}
				role="presentation"
				onClick={() => {
					setOpen(false);
				}}
			>
				<Typography className={classes.listHeader} componant="p">
					Groups:
				</Typography>
				<Divider />
				<List>
					{groups.map((g, index) => (
						<ListItem
							selected={group.id == g.id}
							button
							key={g.id}
							onClick={() => {
								setGroup({ ...g });
							}}
						>
							{/* <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon> */}
							<ListItemText primary={g.name} />
						</ListItem>
					))}
				</List>
			</div>
		</Drawer>
	);
}

export default AppDrawer;
