import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import {
	Container,
	Box,
	Button,
	Icon,
	Chip,
	Paper,
	Typography,
	List,
	ListItem,
	ListItemText,
	ListSubheader
} from '@material-ui/core';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import { useGlobal } from 'reactn';
import Cookies from 'js-cookie';
import { AppUrl } from '../App';
import axios from 'axios';

//ko
const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		backgroundColor: theme.palette.background.paper,
		position: 'relative'
	},
	listSection: {
		backgroundColor: 'inherit'
	},
	ul: {
		backgroundColor: 'inherit',
		padding: 0
	},
	subheader: {
		backgroundColor: theme.palette.grey[200],
		color: '#111',
		padding: theme.spacing(1, 2)
	},
	listedEvent: {
		padding: theme.spacing(2, 2),
		backgroundColor: theme.palette.secondary.light,
		color: 'white',
		margin: theme.spacing(2)
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

const Styles = {
	container: css`
		padding: 0;
		padding-left: 0;
		padding-right: 0;
		margin: auto;
	`,
	chip: css`
		margin-bottom: 2px;
		height: 22px;
		span {
			padding-left: 8px;
		}
	`,
	calendar: css`
		border: none;
		width: auto;
		font-family: monospace !important;
		abbr[title] {
			text-decoration: none;
		}
		.react-calendar__month-view__days {
			.react-calendar__tile {
				padding: 6px 6px 0 1.5px;
				background: none;
				border: solid .5px #ccc !important;
				border-left: none !important;
				border-top: none !important;
				font-family: monospace;
				abbr {
					display: inline-block;
					padding: 6px;
					margin-bottom: 4px;
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

		.react-calendar__navigation button:enabled:hover {
			background-color: transparent;
		}
	`
};

function params(data) {
	return Object.keys(data).map((key) => `${key}=${encodeURIComponent(data[key])}`).join('&');
}
export default function MonthView() {
	const classes = useStyles();
	const [ currentDate, setCurrentDate ] = useState(moment());

	const [ currentYear, setCurrentYear ] = useState(moment(currentDate).year());

	const [ showList, setShowList ] = useGlobal('showList');

	const [ group, setGroup ] = useGlobal('group');

	const [ calendarData, setCalendarData ] = useState([]);

	const [ myShifts, setMyShifts ] = useGlobal('myShifts');

	const [ userId, setUserId ] = useGlobal('userId');

	useEffect(
		() => {
			getCalenderEventsFromServer();
		},
		[ group ]
	);

	useEffect(
		() => {
			if (currentDate.year() !== currentYear) {
				setCurrentYear(currentDate.year());
				getCalenderEventsFromServer();
			} else {
				console.log('current year is current, no need to re-fetch data');
			}
		},
		[ currentDate ]
	);

	// useEffect(
	// 	() => {
	// 		const data = group.id == 7 ? CalData.neuroSurg : CalData.neurology;
	// 		setCalendarData(data);
	// 	},
	// 	[ group ]
	// );

	useEffect(
		() => {
			if (showList) {
				document.getElementById(`date-index-${currentDate.format('D') - 1}`).scrollIntoView();
			}
		},
		[ showList ]
	);
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
	function getCalenderEventsFromServer() {
		const data = {
			sd: moment(currentDate).startOf('year').format('MM-DD-YYYY'),
			ed: moment(currentDate).endOf('year').format('MM-DD-YYYY'),
			groupId: group.id
		};

		axios
			.get(`${AppUrl}ui/callboard/getCalendarEvents`, {
				withCredentials: true,
				params: data
			})
			.then((response) => {
				console.log('fetch response', response);
				if (response.status !== 200) {
					if (response.status === 401) {
						window.location.href = `${AppUrl}login.aspx?ReturnUrl=${document.URL}`;
					} else {
						alert('There was an error fetching calendar events. Check your connection and try again.');
					}
					return;
				}

				console.log('json data', response.data);
				setCalendarData(response.data);
			})
			.catch(() => {
				alert('There was an error fetching calendar events. Check your connection and try again.');
			});
	}

	function onClickDay(value) {
		setCurrentDate(moment(value));
		setShowList(true);
	}

	function calendarEventsByDate(data, date) {
		date = moment(date);
		return data.filter((event) => {
			return (
				moment(event.START_DATE).isSameOrBefore(date, 'day') &&
				moment(event.END_DATE).isAfter(date, 'day') &&
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
		} else {
			return (
				<span>
					<Icon style={{ verticalAlign: 'middle' }}>arrow_back</Icon>
					&nbsp;&nbsp;{end.format('hh:mm a')}
				</span>
			);
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
								const events = calendarEventsByDate(calendarData, date);
								console.log('events', events);
								return (
									<div>
										{events
											.slice(0, 3)
											.map((event) => (
												<Chip
													title={JSON.stringify(event)}
													css={Styles.chip}
													color="secondary"
													label={eventName(event)}
												/>
											))}
										{events.length > 3 && (
											<CalContent css={Overflow}>
												+ {(events.length - 3).toString()} more
											</CalContent>
										)}
									</div>
								);
							}
						}}
						//onChange={this.onChange}
						onClickDay={onClickDay}
						value={currentDate.toDate()}
						css={Styles.calendar}
						minDetail={'year'}
						prev2Label={null}
						prevLabel={
							<Icon fontSize="large" color="primary">
								keyboard_arrow_left
							</Icon>
						}
						nextLabel={
							<Icon fontSize="large" color="primary">
								keyboard_arrow_right
							</Icon>
						}
						next2Label={null}
					/>
				)}

				{showList && (
					<List className={classes.root} subheader={<li />}>
						{[ ...Array(currentDate.daysInMonth()).keys() ].map((dateNum) => {
							const thisDate = moment(currentDate).date(dateNum + 1);
							const events = calendarEventsByDate(calendarData, thisDate);

							if (events.length == 0) return null;

							return (
								<li
									id={`date-index-${dateNum}`}
									key={`section-${dateNum}`}
									className={classes.listSection}
								>
									<ul className={classes.ul}>
										<ListSubheader className={classes.subheader}>
											<Typography
												css={css`
													font-size: 75%;
													color: #444;
												`}
											>
												{thisDate.format('ddd')}
											</Typography>
											<Typography>{thisDate.format('MMM D')}</Typography>
										</ListSubheader>
										{calendarEventsByDate(calendarData, thisDate).map((event) => (
											<Paper className={classes.listedEvent} color="secondary">
												<Typography>{eventName(event)}</Typography>
												<Typography css={css`color: #ccc;`}>
													{listedEventDateText(thisDate, event.START_DATE, event.END_DATE)}
												</Typography>
											</Paper>
										))}
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
