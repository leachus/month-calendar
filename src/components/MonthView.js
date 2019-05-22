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

import { AppUrl, UseStaticData } from '../App';
import axios from 'axios';
import { EventData } from '../data';

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
					top: 0;
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
	`
};

function params(data) {
	return Object.keys(data).map((key) => `${key}=${encodeURIComponent(data[key])}`).join('&');
}

export default function MonthView() {
	const classes = useStyles();
	const [
		currentDate,
		setCurrentDate
	] = useState(moment());

	const [
		calendarYear,
		setCalendarYear
	] = useState(moment().year());

	const [
		showList,
		setShowList
	] = useGlobal('showList');

	const [
		group
	] = useGlobal('group');

	const [
		calendarData,
		setCalendarData
	] = useState([]);

	const [
		myShifts
	] = useGlobal('myShifts');

	const [
		userId
	] = useGlobal('userId');

	useEffect(
		() => {
			getCalenderEventsFromServer(calendarYear, group.id).then((data) => setCalendarData(data));
		},
		[
			group,
			calendarYear
		]
	);

	useEffect(
		() => {
			if (showList) {
				try {
					document.getElementById(`date-index-${currentDate.format('D') - 1}`).scrollIntoView();
				} catch (e) {}
			}
		},
		[
			showList
		]
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
		if (activeStartDate.getFullYear() !== calendarYear) {
			setCalendarYear(activeStartDate.getFullYear());
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
								const events = byDate(date);
								return (
									<div className="events">
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
						onActiveDateChange={handleActiveDateChange}
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
						{[
							...Array(currentDate.daysInMonth()).keys()
						].map((dateNum) => {
							const thisDate = moment(currentDate).date(dateNum + 1);
							const events = byDate(thisDate);

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

function getCalenderEventsFromServer(currentYear, groupId) {
	const data = {
		sd: `01-01-${currentYear}`,
		ed: `12-31-${currentYear}`,
		groupId: groupId
	};
	return new Promise((resolve, reject) => {
		if (UseStaticData) {
			resolve(EventData);
			return;
		}
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
						reject();
					}
					return;
				}

				resolve(response.data);
				// console.log('json data', response.data);
				// setCalendarData(response.data);
			})
			.catch(() => {
				alert('There was an error fetching calendar events. Check your connection and try again.');
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
	} else if (date.isSame(end, 'day')) {
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
