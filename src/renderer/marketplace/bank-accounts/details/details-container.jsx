import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { MarketplaceBankAccountsComponent } from '../common/marketplace-bank-accounts-component';
import { pricesSelectors } from 'common/prices';
import { kycSelectors, kycOperations } from 'common/kyc';
import { walletSelectors } from 'common/wallet';
import { withStyles } from '@material-ui/core/styles';
import { BankingDetailsPage } from './details-page';
import { marketplaceSelectors } from 'common/marketplace';

const styles = theme => ({});
const MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH = '/main/marketplace-bank-accounts';

class BankAccountsDetailContainer extends MarketplaceBankAccountsComponent {
	state = {
		tab: 'types',
		loading: false
	};

	async componentDidMount() {
		await this.loadRelyingParty({ rp: 'banking', authenticated: false });
	}

	manageApplicationsRoute = () => {
		return `/main/selfkeyIdApplications`;
	};

	payRoute = () => {
		const { countryCode, accountCode, templateId } = this.props.match.params;
		return `${MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH}/pay/${accountCode}/${countryCode}/${templateId}`;
	};

	checkoutRoute = () => {
		const { countryCode, accountCode, templateId } = this.props.match.params;
		return `${MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH}/checkout/${accountCode}/${countryCode}/${templateId}`;
	};

	onBackClick = () => this.props.dispatch(push(MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH));

	onTabChange = tab => this.setState({ tab });

	// Status bar component allows for an action button on the right
	// This handler processes the action for that button
	onStatusActionClick = () => {
		const { rp } = this.props;
		if (rp && rp.authenticated && this.userHasApplied()) {
			if (this.applicationCompleted() || this.applicationWasRejected()) {
				this.props.dispatch(push(this.manageApplicationsRoute()));
			} else if (this.applicationRequiresAdditionalDocuments()) {
				this.redirectToKYCC(rp);
			} else if (!this.userHasPaid()) {
				this.props.dispatch(push(this.payRoute()));
			} else if (!this.userHasSelectedBankPreference()) {
				this.props.dispatch(push(this.selectBankRoute()));
			}
		}
		return null;
	};

	onApplyClick = () => {
		const { rp, wallet } = this.props;
		const selfkeyIdRequiredRoute = '/main/marketplace-selfkey-id-required';
		const selfkeyDIDRequiredRoute = '/main/marketplace-selfkey-did-required';
		const authenticated = true;

		// When clicking the start process,
		// we check if an authenticated kyc-chain session exists
		// If it doesn't we trigger a new authenticated rp session
		// and redirect to checkout route
		// The loading state is used to disable the button while data is being loaded
		this.setState({ loading: true }, async () => {
			if (!wallet.isSetupFinished) {
				return this.props.dispatch(push(selfkeyIdRequiredRoute));
			}
			if (!wallet.did) {
				return this.props.dispatch(push(selfkeyDIDRequiredRoute));
			}
			if (!rp || !rp.authenticated) {
				await this.props.dispatch(
					kycOperations.loadRelyingParty(
						'incorporations',
						authenticated,
						this.checkoutRoute(),
						this.cancelRoute()
					)
				);
			} else {
				await this.props.dispatch(push(this.checkoutRoute()));
			}
		});
	};

	buildResumeData = banks => {
		const data = banks[0].data;
		return [
			[
				{
					name: 'Min. Initial Deposit',
					value: data.minDeposit,
					highlighted: true
				},
				{
					name: 'Min. Monthly Balance',
					value: data.minMonthlyBalance,
					highlighted: true
				}
			],
			[
				{
					name: 'Personal Visit Required',
					value: data.personalVisitRequired ? 'Yes' : 'No',
					highlighted: true
				},
				{
					name: 'Time to open',
					value: data.timeToOpen,
					highlighted: true
				}
			],
			[
				{
					name: 'Cards',
					value: data.cards ? data.cards.join(' ') : '',
					highlighted: true
				}
			]
		];
	};

	render() {
		const { banks, keyRate, kycRequirements, country } = this.props;
		const bank = banks[0];
		const { price } = bank;
		const { region } = bank.data;
		console.log(bank);
		return (
			<BankingDetailsPage
				applicationStatus={this.getApplicationStatus()}
				loading={this.state.loading || this.props.isLoading}
				country={country}
				countryCode={country.code}
				price={price}
				tab={this.state.tab}
				onTabChange={this.onTabChange}
				keyRate={keyRate}
				region={region}
				banks={banks}
				resume={this.buildResumeData(banks)}
				canOpenBankAccount={this.canApply(price)}
				startApplication={this.onApplyClick}
				kycRequirements={kycRequirements}
				templateId={this.props.match.params.templateId}
				onBack={this.onBackClick}
				onStatusAction={this.onStatusActionClick}
			/>
		);
	}
}

BankAccountsDetailContainer.propTypes = {
	banks: PropTypes.object,
	isLoading: PropTypes.bool,
	keyRate: PropTypes.number
};

const mapStateToProps = (state, props) => {
	const { accountCode, countryCode, templateId } = props.match.params;
	const authenticated = true;
	console.log(state);
	return {
		banks: marketplaceSelectors.selectBanksByAccountCode(state, accountCode),
		country: marketplaceSelectors.selectCountryByCode(state, countryCode),
		isLoading: marketplaceSelectors.isLoading(state),
		keyRate: pricesSelectors.getRate(state, 'KEY', 'USD'),
		rp: kycSelectors.relyingPartySelector(state, 'flagtheory_banking'),
		rpShouldUpdate: kycSelectors.relyingPartyShouldUpdateSelector(
			state,
			'flagtheory_banking',
			authenticated
		),
		kycRequirements: kycSelectors.selectRequirementsForTemplate(
			state,
			'flagtheory_banking',
			templateId
		),
		wallet: walletSelectors.getWallet(state)
	};
};

const styledComponent = withStyles(styles)(BankAccountsDetailContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as BankAccountsDetailContainer };
