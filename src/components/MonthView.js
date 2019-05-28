import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import {
	Container,
	Box,
	Icon,
	Chip,
	Paper,
	Typography,
	List,
	ListSubheader,
	ButtonBase,
	IconButton
} from '@material-ui/core';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import { useGlobal } from 'reactn';

import { UseStaticData, LoginUrl } from '../App';
import axios from 'axios';
import { EventData } from '../data';

//ko
const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		backgroundColor: theme.palette.background.paper,
		position: 'relative',
		marginTop: '5px',
		maxWidth: '550px',
		marginLeft: 'auto',
		marginRight: 'auto'
	},
	listSection: {
		backgroundColor: 'inherit'
	},
	ul: {
		backgroundColor: 'inherit',
		padding: 0
	},
	subheader: {
		color: '#111',
		padding: theme.spacing(1, 2),
		alignSelf: 'flex-start',
		flexBasis: '85px'
	},
	listedEvent: {
		padding: theme.spacing(1, 2),
		backgroundColor: theme.palette.secondary.light,
		color: 'white',
		margin: theme.spacing(0.5, 1)
	}
}));

const CalContent = styled.div`
	white-space: nowrap;
	font-size: 10px;
	background-color: #444;
	color: white;
	padding: 2px 4px 2px 4px;
	margin: 0 0 1px 0;
	border-radius: 6px;
	overflow: hidden;
	text-overflow: clip;
`;

const Overflow = css`
	background-color: transparent;
	color: #222;
`;

const myBackground = 'background-color: #333;';

const ListViewStyles = {
	dayContainer: css`
		display: flex;
		margin-bottom: 12px;
	`,
	eventsContainer: css`
		display: flex;
		flex-flow: column;
		flex-grow: 1;
	`,
	listedEvent: (mine) => {
		return css`
			${mine ? myBackground : ''};
		`;
	}
};

const Styles = {
	container: css`
		padding: 0;
		padding-left: 0;
		padding-right: 0;
		margin: auto;
	`,
	chip: (mine) => {
		return css`
			margin-bottom: 2px;
			height: 22px;
			cursor: pointer;
			span {
				padding-left: 8px;
			}

			${mine ? myBackground : ''};
		`;
	}
};

const CalendarStyles = css`
	border: none;
	width: auto;
	font-family: monospace !important;
	margin: 5px 5px 0 5px;
	abbr[title] {
		text-decoration: none;
	}
	.react-calendar__month-view__days {
		.react-calendar__tile {
			padding: 28px 6px 0 1.5px;
			background: none;
			border: solid .5px #ccc !important;
			border-left: none !important;
			border-top: none !important;
			font-family: monospace;
			position: relative;
			abbr {
				display: inline-block;
				padding: 6px;
				margin: 0 auto 4px auto;
				position: absolute;
				top: 5px;
				left: 50%;
				transform: translateX(-50%);
			}
			&:nth-child(7n) {
				border-right: none !important;
			}
			&:nth-child(n + 29) {
				border-bottom: none !important;
			}
		}

		.react-calendar__tile--active {
			background-color: #e1e1e1;
			&:hover {
				background-color: #e1e1e1;
			}
			abbr {
				color: rgba(0, 0, 0, 0.87);
			}
		}
		.react-calendar__tile--now {
			abbr {
				background-color: #444;
				color: white;
				border-radius: 50%;
			}
		}
	}
`;
export default function MonthView() {
	const classes = useStyles();
	const [ currentDate, setCurrentDate ] = useState(moment());

	const [ calendarMonth, setCalendarMonth ] = useState(moment().startOf('month'));

	const [ showList, setShowList ] = useGlobal('showList');

	const [ group ] = useGlobal('group');

	const [ calendarData, setCalendarData ] = useState([]);

	const [ myShifts ] = useGlobal('myShifts');

	const [ userId ] = useGlobal('userId');

	useEffect(
		() => {
			if (group.id > 0)
				getCalenderEventsFromServer(calendarMonth, group.id).then((data) => setCalendarData(data));
		},
		[ group, calendarMonth ]
	);

	useEffect(
		() => {
			if (showList) {
				try {
					document.getElementById(`date-index-${currentDate.format('D') - 1}`).scrollIntoView();
				} catch (e) {}
			}
		},
		[ showList ]
	);

	function onClickDay(value) {
		setCurrentDate(moment(value));
		setShowList(true);
	}

	//wrapper that passes the needed arguments to simplify the call in the jsx
	function byDate(date) {
		return calendarEventsByDate(calendarData, date, myShifts, userId);
	}

	function handleActiveDateChange({ activeStartDate, view }) {
		if (activeStartDate.getMonth() !== calendarMonth.month()) {
			setCalendarMonth(moment(activeStartDate).startOf('month'));
		}
	}

	return (
		<Container css={Styles.container}>
			<Box my={4} style={{ margin: 0 }}>
				{!showList && (
					<Calendar
						calendarType="US"
						tileContent={({ date, view }) => {
							if (view == 'month') {
								return <TileContent events={byDate(date)} date={date} userId={userId} />;
							}
						}}
						onActiveDateChange={handleActiveDateChange}
						onClickDay={onClickDay}
						value={currentDate.toDate()}
						css={CalendarStyles}
						minDetail={'year'}
						prev2Label={null}
						prevLabel={
							<IconButton>
								<Icon fontSize="large" color="primary">
									keyboard_arrow_left
								</Icon>
							</IconButton>
						}
						nextLabel={
							<IconButton>
								<Icon fontSize="large" color="primary">
									keyboard_arrow_right
								</Icon>
							</IconButton>
						}
						next2Label={null}
					/>
				)}

				{showList && (
					<List className={classes.root} subheader={<li />}>
						{[ ...Array(currentDate.daysInMonth()).keys() ].map((dateNum) => {
							const thisDate = moment(currentDate).date(dateNum + 1);
							const events = byDate(thisDate);

							if (events.length == 0) return null;

							return (
								<li
									id={`date-index-${dateNum}`}
									key={`section-${dateNum}`}
									className={classes.listSection}
								>
									<ul className={classes.ul} css={ListViewStyles['dayContainer']}>
										<ListSubheader className={classes.subheader}>
											<Typography
												css={css`
													font-size: 75%;
													color: #444;
													text-transform: uppercase;
												`}
											>
												{thisDate.format('ddd')}
											</Typography>
											<Typography>{thisDate.format('MMM D')}</Typography>
										</ListSubheader>
										<div css={ListViewStyles.eventsContainer}>
											{byDate(thisDate).map((event) => (
												<Paper
													className={classes.listedEvent}
													css={ListViewStyles.listedEvent(event.USER_ID == userId)}
													color="secondary"
												>
													<Typography>{eventName(event)}</Typography>
													<Typography css={css`color: #ccc;`}>
														{listedEventDateText(
															thisDate,
															event.START_DATE,
															event.END_DATE
														)}
													</Typography>
												</Paper>
											))}
										</div>
									</ul>
								</li>
							);
						})}
					</List>
				)}
			</Box>
		</Container>
	);
}

function TileContent({ events, userId, date }) {
	console.log(userId);
	return (
		<ButtonBase
			className="events"
			css={css`
				display: inline-block;
				height: 100%;
				width: 100%;
				position: absolute;
				top: 0;
				left: 0;
				padding-top: 32px;
				box-sizing: border-box;
			`}
		>
			{events
				.slice(0, 3)
				.map((event, i) => (
					<Chip
						title={`${event.NAME}, ${moment(event.START_DATE).format('MM-DD HH:mm')} - ${moment(
							event.END_DATE
						).format('MM-DD HH:mm')} `}
						css={Styles.chip(event.USER_ID == userId)}
						color="secondary"
						label={eventName(event)}
						key={event.ID + date.toString()}
					/>
				))}
			{events.length > 3 && <CalContent css={Overflow}>+ {(events.length - 3).toString()} more</CalContent>}
		</ButtonBase>
	);
}

function mergeLikeEvents(data) {
	return data.reduce((merged, event, i) => {
		if (i == 0) {
			merged.push(event);
		} else {
			const prevEvent = merged[merged.length - 1];

			if (event.USER_ID == prevEvent.USER_ID && event.START_DATE == prevEvent.END_DATE) {
				//this event is needlessly separated into two events, we can merge them
				console.log('merging events');
				merged[merged.length - 1] = { ...prevEvent, END_DATE: event.END_DATE };
			} else {
				merged.push(event);
			}
		}

		return merged;
	}, []);
}

function getCalenderEventsFromServer(calendarMonth, groupId) {
	const data = {
		sd: calendarMonth.format('MM-DD-YYYY'),
		ed: moment(calendarMonth).endOf('month').format('MM-DD-YYYY'),
		groupId: groupId
	};
	return new Promise((resolve, reject) => {
		console.log('get cal events', data);
		if (UseStaticData) {
			resolve(mergeLikeEvents(EventData));
			return;
		}
		axios
			.get(`/ui/callboard/getCalendarEvents`, {
				params: data
			})
			.then((response) => {
				const merged = mergeLikeEvents(response.data);
				resolve(merged);
			})
			.catch((error) => {
				if (error.response && error.response.status === 401) {
					window.location.href = LoginUrl;
				} else {
					alert('There was an error fetching calendar events. Check your connection and try again.');
				}
				reject();
			});
	});
}

function calendarEventsByDate(data, date, myShifts, userId) {
	date = moment(date);

	return data.filter((event) => {
		const end = moment(event.END_DATE);

		if (end.hour() == 0) {
			//events that end at 12:00am, need to be considered as ending the day prior
			end.subtract(1, 'minute');
		}

		return (
			moment(event.START_DATE).isSameOrBefore(date, 'day') &&
			end.isSameOrAfter(date, 'day') &&
			(!myShifts || event.USER_ID == userId)
		);
	});
}

function listedEventDateText(date, start, end) {
	start = moment(start);
	end = moment(end);

	if (
		(date.isSame(start, 'day') && date.isSame(end, 'day')) ||
		(date.isSame(start, 'day') && end.hour() == 0 && end.day() - 1 == start.day())
	) {
		return <span>{`${start.format('hh:mm a')} - ${end.format('hh:mm a')}`}</span>;
	} else if (date.isSame(start, 'day')) {
		return (
			<span>
				{start.format('hh:mm a')}
				&nbsp;&nbsp;<Icon style={{ verticalAlign: 'middle' }}>arrow_forward</Icon>
			</span>
		);
	} else if (date.isSame(moment(end).subtract(1, 'minute'), 'day')) {
		return (
			<span>
				<Icon style={{ verticalAlign: 'middle' }}>arrow_back</Icon>
				&nbsp;&nbsp;{end.format('hh:mm a')}
			</span>
		);
	} else {
		return (
			<span>
				<Icon style={{ verticalAlign: 'middle' }}>arrow_back</Icon>&nbsp;&nbsp;<Icon style={{ verticalAlign: 'middle' }}>arrow_forward</Icon>
			</span>
		);
	}
}

function eventName(event) {
	if (event.ALL_USERS) {
		return '* All Users *';
	} else if (event.ON_DUTY_USERS) {
		return '* On-Duty Users *';
	} else if (event.USER_ID == 0) {
		return '** Unassigned **';
	} else {
		return event.NAME;
	}
}
