import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.scss';
import TheAppBar from './components/TheAppBar';
import MonthView from './components/MonthView';
import { Toolbar } from '@material-ui/core';
import { setGlobal, getGlobal, useGlobal } from 'reactn';
import Cookies from 'js-cookie';
import axios from 'axios';
import moment from 'moment';
import { Groups } from './data';

export const AppUrl = 'https://mbmd.microbloggingmd.com/';

export const UseStaticData = true;

setGlobal({
	sidebarOpen: false,
	showList: false,
	group: { id: 0, name: '' },
	groups: [],
	userId: Cookies.get('LAST_VALID_USER'),
	myShifts: false,
	currentDate: moment()
});

axios.defaults.withCredentials = true;

function App() {
	const [ group, setGroup ] = useGlobal('group');
	const [ groups, setGroups ] = useGlobal('groups');
	const [ loading, setLoading ] = useState(true);

	useEffect(() => {
		fetchGroups();
	}, []);

	useEffect(
		() => {
			if (groups.length > 0) {
				console.log('groups has changed and is longer than 0', groups);
				setGroup({ ...groups[0] });
				setLoading(false);
				console.log('set loading to false!');
			}
		},
		[ groups ]
	);

	function fetchGroups() {
		if (UseStaticData) {
			setGroups([ ...Groups ]);
			return;
		}
		axios
			.get(`${AppUrl}templates/GetCallboardGroups`)
			.then((response) => {
				console.log('groups response: ', response);
				if (response.status !== 200) {
					if (response.status === 401) {
						window.location.href = `${AppUrl}login.aspx?ReturnUrl=${document.URL}`;
					} else {
						alert('There was an error fetching groups data. Check your connection and try again. 1');
						setLoading(false);
					}
					return;
				}
				setGroups([ ...response.data ]);
			})
			.catch(() => {
				alert('There was an error fetching groups data. Check your connection and try again. 2');
				setLoading(false);
			});
	}
	return (
		<React.Fragment>
			<TheAppBar />
			<Toolbar />
			{loading && <div>LOADING...</div>}
			{!loading && <MonthView />}
		</React.Fragment>
	);
}

export default App;
