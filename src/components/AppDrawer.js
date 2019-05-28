import React, { useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, Typography, List, Divider, ListItem, ListItemText } from '@material-ui/core';
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
	const [ groups ] = useGlobal('groups');

	const classes = useStyles();
	useEffect(
		() => {
			try {
				if (open) {
					setTimeout(() => {
						let offset = document.querySelector('.MuiDrawer-modal .MuiDrawer-paper .Mui-selected')
							.offsetTop;
						document.querySelector('.MuiDrawer-modal .MuiDrawer-paper').scrollTop = offset;
					}, 50);
				}
			} catch (e) {
				console.error(e);
			}
		},
		[ group.id, open ]
	);
	return (
		<Drawer
			open={open}
			on
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
							<ListItemText primary={g.name} />
						</ListItem>
					))}
				</List>
			</div>
		</Drawer>
	);
}

export default AppDrawer;
