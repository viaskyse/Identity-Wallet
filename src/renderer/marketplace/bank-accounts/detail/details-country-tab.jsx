import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles, Typography, Grid, List, ListItem } from '@material-ui/core';
import { incorporationsOperations, incorporationsSelectors } from 'common/incorporations';
import { PageLoading, sanitize } from '../../common';
import 'flag-icon-css/css/flag-icon.css';

const styles = theme => ({
	countryName: {
		textAlign: 'center',
		marginBottom: '2em'
	},
	details: {
		width: '50%',
		marginLeft: '0',
		'& h5': {
			fontWeight: 'normal',
			display: 'inline-block',
			fontSize: '14px'
		},
		'& div': {
			display: 'inline-block'
		},
		'& h5.value': {
			color: '#93B0C1',
			marginLeft: '1em',
			fontWeight: 'bold'
		}
	},
	countryInfo: {
		marginTop: '50px'
	},
	flag: {
		width: '45%',
		'& span': {
			float: 'right'
		}
	},
	tabContainer: {
		width: '100%',
		padding: '2em 0',
		color: '#FFFFFF',
		'& p': {
			marginBottom: '1.5em',
			lineHeight: '1.4em'
		},
		'& strong': {
			fontWeight: 'bold',
			color: theme.palette.secondary.main,
			display: 'block',
			padding: '0',
			borderBottom: '1px solid #435160',
			marginBottom: '0.5em',
			marginTop: '0em'
		},
		'& ul': {
			listStyle: 'outside',
			lineHeight: '1.4em',
			marginLeft: '1.5em',
			marginBottom: '1.5em'
		},
		'& ul li': {
			lineHeight: '1.4em',
			marginBottom: '0.5em'
		},
		'& a': {
			color: theme.palette.secondary.main
		}
	}
});

class BankingCountryTabComponent extends Component {
	componentDidMount() {
		if (!this.props.country) {
			this.props.dispatch(
				incorporationsOperations.loadIncorporationsCountryOperation(this.props.countryCode)
			);
		}
	}
	render() {
		const { classes, country, jurisdiction } = this.props;
		return (
			<div className={classes.tabContainer}>
				{!country && <PageLoading />}
				{!!country && (
					<React.Fragment>
						<Typography variant="h1" gutterBottom className={classes.countryName}>
							{country.name}
						</Typography>
						<Grid container justify="flex-start" alignItems="flex-start">
							<div className={classes.details}>
								<List>
									<ListItem>
										<Typography variant="h5" gutterBottom>
											Country Code
										</Typography>
										<Typography variant="h5" gutterBottom className="value">
											{country.code}
										</Typography>
									</ListItem>
									<ListItem>
										<Typography variant="h5" gutterBottom>
											Area
										</Typography>
										<Typography variant="h5" gutterBottom className="value">
											{country.areaInSqKm} km&sup2;
										</Typography>
									</ListItem>
									<ListItem>
										<Typography variant="h5" gutterBottom>
											Capital
										</Typography>
										<Typography variant="h5" gutterBottom className="value">
											{country.capital}
										</Typography>
									</ListItem>
									<ListItem>
										<Typography variant="h5" gutterBottom>
											Continent
										</Typography>
										<Typography variant="h5" gutterBottom className="value">
											{country.continentName}
										</Typography>
									</ListItem>
									<ListItem>
										<Typography variant="h5" gutterBottom>
											Currency
										</Typography>
										<Typography variant="h5" gutterBottom className="value">
											{country.currencyCode}
										</Typography>
									</ListItem>
									<ListItem>
										<Typography variant="h5" gutterBottom>
											Population
										</Typography>
										<Typography variant="h5" gutterBottom className="value">
											{country.population}
										</Typography>
									</ListItem>
								</List>
							</div>
							<div className={classes.flag}>
								<span
									style={{ display: 'block', fontSize: '200px' }}
									className={`flag-icon flag-icon-${country.code.toLowerCase()}`}
								/>
							</div>
						</Grid>
						<div className={classes.countryInfo}>
							<div
								dangerouslySetInnerHTML={{
									__html: sanitize(jurisdiction['Country Details'])
								}}
							/>
						</div>
					</React.Fragment>
				)}
			</div>
		);
	}
}

BankingCountryTabComponent.propTypes = {
	countryCode: PropTypes.string,
	country: PropTypes.object,
	jurisdiction: PropTypes.object
};

const mapStateToProps = (state, props) => {
	return {
		country: incorporationsSelectors.getCountry(state, props.countryCode)
	};
};

const styledComponent = withStyles(styles)(BankingCountryTabComponent);
const BankingCountryTab = connect(mapStateToProps)(styledComponent);

export { BankingCountryTab };
export default BankingCountryTab;