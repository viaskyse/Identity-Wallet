import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ethGasStationInfoOperations } from 'common/eth-gas-station';
import { marketplacesOperations, marketplacesSelectors } from 'common/marketplaces';
import { Popup } from './popup';
import { DepositContent } from './deposit-content';

const mapStateToProps = state => {
	return {
		tx: marketplacesSelectors.currentTransactionSelector(state)
	};
};

class DepositPopupComponent extends Component {
	componentDidMount() {
		this.props.dispatch(ethGasStationInfoOperations.loadData());
		this.props.dispatch(marketplacesOperations.loadTransactions());
		this.props.dispatch(marketplacesOperations.loadStakes());
	}

	async handleConfirmAction(gasPrice) {
		await this.props.dispatch(
			marketplacesOperations.updateCurrentTransactionAction({ gasPrice })
		);
		await this.props.dispatch(marketplacesOperations.confirmStakeTransaction());
	}

	render() {
		const { closeAction, tx } = this.props;
		if (!tx.gasPriceEstimates.safeLow) {
			return <div>Loading</div>;
		}
		return (
			<Popup closeAction={closeAction}>
				<DepositContent
					minGasPrice={tx.gasPriceEstimates.safeLow}
					maxGasPrice={tx.gasPriceEstimates.fast}
					defaultValue={tx.gasPriceEstimates.avarage}
					gasLimit={tx.gasLimit}
					fiat={tx.fiat}
					fiatRate={tx.fiatRate}
					onCancel={closeAction}
					onConfirm={gasLimit => this.handleConfirmAction(gasLimit)}
				/>
			</Popup>
		);
	}
}

export const MarketplaceDepositPopup = connect(mapStateToProps)(DepositPopupComponent);

export default MarketplaceDepositPopup;
