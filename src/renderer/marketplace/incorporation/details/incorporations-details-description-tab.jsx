import React from 'react';
import { withStyles } from '@material-ui/styles';
import { sanitize } from '../../common';
import { primary } from 'selfkey-ui';

const styles = theme => ({
	tabContainer: {
		width: '100%',
		padding: theme.spacing(4, 0),
		color: '#FFFFFF',
		'& p': {
			marginBottom: theme.spacing(3),
			lineHeight: '1.4em'
		},
		'& strong': {
			fontWeight: 'bold',
			color: theme.palette.secondary.main,
			display: 'block',
			padding: theme.spacing(0),
			marginBottom: theme.spacing(1),
			marginTop: theme.spacing(0)
		},
		'& ul': {
			listStyle: 'outside',
			lineHeight: '1.4em',
			marginLeft: theme.spacing(3),
			marginBottom: theme.spacing(3)
		},
		'& ul li': {
			lineHeight: '1.4em',
			marginBottom: theme.spacing(1)
		},
		'& a': {
			color: primary
		}
	}
});

const IncorporationsDescriptionTab = withStyles(styles)(({ classes, program }) => (
	<div className={classes.tabContainer}>
		<div
			dangerouslySetInnerHTML={{
				__html: sanitize(
					program.data.description
						? program.data.description
						: program.data.en.introduction
				)
			}}
		/>
	</div>
));

export { IncorporationsDescriptionTab };
export default IncorporationsDescriptionTab;
