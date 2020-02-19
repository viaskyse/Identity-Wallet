import React, { PureComponent } from 'react';
import { WarningShieldIcon } from 'selfkey-ui';
import { Popup } from '../../common/popup';
import { Typography, withStyles, Button, Grid } from '@material-ui/core';

const styles = theme => ({
	title: {
		marginBottom: '17px'
	},
	buttonContainer: {
		marginTop: '10px'
	}
});

class WalletExportWarningComponent extends PureComponent {
	render() {
		const { classes, onCancel, onExport } = this.props;
		return (
			<Popup open={true} text="Step 1: Privacy" closeAction={onCancel} displayLogo>
				<Grid container direction="row" justify="flex-start" alignItems="stretch">
					<Grid item xs={2}>
						<WarningShieldIcon />
					</Grid>
					<Grid item xs>
						<Grid
							container
							direction="column"
							justify="flex-start"
							alignItems="stretch"
							spacing={8}
						>
							<Grid item>
								<Typography variant="body2" gutterBottom>
									We are about to dipslay a QR Code for you, which represents your
									private Key. Just to be safe, please make sure there is nobody
									behind you who can view and steal this code.
								</Typography>
							</Grid>
							<Grid item className={classes.buttonContainer}>
								<Grid container direction="row" spacing={16}>
									<Grid item>
										<Button variant="contained" size="large" onClick={onExport}>
											It&apos;s safe, Continue
										</Button>
									</Grid>
									<Grid item>
										<Button variant="outlined" size="large" onClick={onCancel}>
											Cancel
										</Button>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Popup>
		);
	}
}

export const WalletExportWarning = withStyles(styles)(WalletExportWarningComponent);

export default WalletExportWarning;