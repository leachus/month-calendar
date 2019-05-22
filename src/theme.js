import { createMuiTheme } from '@material-ui/core/styles';
import { green, blue, red, deepPurple, grey } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme({
	palette: {
		primary: blue,
		secondary: deepPurple,
		error: {
			main: red.A400
		},
		background: {
			default: '#fff'
		}
	}
});

export default theme;
