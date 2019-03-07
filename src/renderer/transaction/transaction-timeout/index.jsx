import React, { Component } from 'react';
import { Typography, Button, Grid, withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import history from 'common/store/history';
import Popup from '../../common/popup';
import { appSelectors } from 'common/app';
import { HourGlassLargeIcon } from 'selfkey-ui';
import { kycOperations } from 'common/kyc';

const styles = theme => ({});

class TransactionTimeout extends Component {
	componentDidMount() {
		this.clearRelyingParty();
	}
	clearRelyingParty = async () => {
		// Clear relying party session after an application failure
		await this.props.dispatch(kycOperations.clearRelyingPartyOperation());
	};
	handleClose = () => {
		history.getHistory().goBack();
	};
	render() {
		const typeText = this.props.hardwareWalletType === 'ledger' ? 'Ledger' : 'Trezor';
		const text = `${typeText} Timed Out`;
		return (
			<Popup open={true} closeAction={this.handleClose} text={text}>
				<Grid
					container
					direction="row"
					justify="flex-start"
					alignItems="flex-start"
					spacing={40}
				>
					<Grid item xs={2}>
						<HourGlassLargeIcon />
					</Grid>
					<Grid item xs={10}>
						<Grid
							container
							direction="column"
							justify="flex-start"
							alignItems="flex-start"
							spacing={40}
						>
							<Grid item>
								<Typography variant="body1">
									You did not confirm this transaction on your {typeText} so it
									was not sent to the network. Please try again and confirm the
									transaction on your device.
								</Typography>
							</Grid>
							<Grid item>
								<Button
									color="secondary"
									variant="outlined"
									onClick={this.handleClose}
								>
									BACK
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Popup>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		hardwareWalletType: appSelectors.selectApp(state).hardwareWalletType
	};
};

export default connect(mapStateToProps)(withStyles(styles)(TransactionTimeout));
