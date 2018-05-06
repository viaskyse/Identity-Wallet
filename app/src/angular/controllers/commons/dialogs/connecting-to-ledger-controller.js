'use strict';
const Wallet = requireAppModule('angular/classes/wallet');

function ConnectingToLedgerController($rootScope, $scope, $log, $q, $state, $mdDialog, CommonService, LedgerService) {
  'ngInject'

  $scope.connectionFailed = false;
  $scope.isConnecting = true;
  
  $scope.cancelConectToLedger = () => {
    //cancel current sended requests
    $mdDialog.cancel();
  };

  $scope.connectToLedger = () => {
    debugger;
    $scope.connectionFailed = false;
    $scope.isConnecting = true;

    $scope.isConnecting = false;

    LedgerService.connect().then(() => {
      // close the window and open... choose a ..
      
      LedgerService.getAccounts().then((accounts) => {
        debugger;
        if (!accounts || accounts.length == 0) {
          //TODO;
          return;
        }
        //TODO
        $scope.chooseAnAccount(accounts[0]);
        console.log('account1', accounts);
      }).catch(err => {
        console.log(err);
      });
      

    }).catch((err) => {
      $scope.isConnecting = false;
      $scope.connectionFailed = true;
    });
  };


  $scope.connectToLedger();


  /*


  let nextStep = (isSetupFinished) => {
        if (isSetupFinished) {
          $state.go('member.dashboard.main');
        } else {
          $state.go('guest.loading', { redirectTo: 'guest.create.step-5' });
        }
      };

   LedgerService.getAccounts().then((accounts) => {
        if (!accounts || accounts.length == 0) {
          //TODO;
          return;
        }
        //TODO
        $scope.chooseAnAccount(accounts[0]);
        console.log('account1', accounts);
      }).catch(err => {
        console.log(err);
      });

 $scope.chooseAnAccount = (address) => {


  
        $mdDialog.cancel();

        if (address.substring(0, 2) == '0x') {
          address = address.substring(2, address.length);
        }

        let importPromise = LedgerService.createWalletByAddress(address);
        importPromise.then((data) => {
          if (data.id) {
            $rootScope.wallet = new Wallet(data.id, null, data.publicKey, null, data.isLedger);

            let initialPromises = [];
            initialPromises.push($rootScope.wallet.loadIdAttributes());
            initialPromises.push($rootScope.wallet.loadTokens());

            $q.all(initialPromises).then((resp) => {
              nextStep(data.isSetupFinished);
            }).catch((error) => {
              CommonService.showToast('error', 'error');
            });
          } else {
            CommonService.showToast('error', 'error');
          }
        }).catch((error) => {
          $log.error(error);
        });

      };

  */
};

module.exports = ConnectingToLedgerController;
