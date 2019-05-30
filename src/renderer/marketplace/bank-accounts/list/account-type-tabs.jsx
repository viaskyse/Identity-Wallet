import React from 'react';
import { withStyles, Tabs, Tab, Typography } from '@material-ui/core';
const styles = theme => ({
	tabContent: {
		marginTop: '15px',
		marginBottom: '15px'
	}
});

export const BankingAccountTypeTabs = withStyles(styles)(
	({ classes, accountType, onAccountTypeChange }) => {
		return (
			<React.Fragment>
				<Tabs value={accountType} onChange={(evt, value) => onAccountTypeChange(value)}>
					<Tab id="personalType" value="personal" label="Personal Accounts" />
					<Tab id="businessType" value="business" label="Corporate Accounts" />
					<Tab id="privateType" value="private" label="Private Banking" />
				</Tabs>
				{accountType === 'personal' && (
					<Typography
						id="personalView"
						variant="body2"
						color="secondary"
						className={classes.tabContent}
					>
						Personal account refers to the account owned by an individual or a couple if
						it{"'"}s a joint{'-'}account. That type of account is intended to reflect
						the person{"'"}s banking needs and obligations and is not transferrable.
					</Typography>
				)}
				{accountType === 'business' && (
					<Typography
						id="businessView"
						variant="body2"
						color="secondary"
						className={classes.tabContent}
					>
						Corporate Accounts
					</Typography>
				)}
				{accountType === 'private' && (
					<Typography
						id="privateView"
						variant="body2"
						color="secondary"
						className={classes.tabContent}
					>
						Private Banking
					</Typography>
				)}
			</React.Fragment>
		);
	}
);

export default BankingAccountTypeTabs;
