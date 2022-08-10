import { useEffect } from "react";
import { useDispatch } from "react-redux";
import config from "../config.json";

import {
  loadProvider,
  loadNetwork,
  loadAccount,
  loadToken,
} from "../store/interactions";

function App() {
  const dispatch = useDispatch();

  const loadBlockchainData = async () => {
    await loadAccount(dispatch);

    // Connect Ethers to blockchain
    const provider = loadProvider(dispatch);
    const chainId = await loadNetwork(provider, dispatch);

    // Token Smart Contract
    const token = await loadToken(
      provider,
      config[chainId].DApp.address,
      dispatch
    );
    console.log(token.address);
    const symbol = await token.symbol();
    console.log(symbol);
  };

  useEffect(() => {
    loadBlockchainData();
  });

  return (
    <div>
      {/* Navbar */}

      <main className="exchange grid">
        <section className="exchange__section--left grid">
          {/* Markets */}

          {/* Balance */}

          {/* Order */}
        </section>
        <section className="exchange__section--right grid">
          {/* PriceChart */}

          {/* Transactions */}

          {/* Trades */}

          {/* OrderBook */}
        </section>
      </main>

      {/* Alert */}
    </div>
  );
}

export default App;
