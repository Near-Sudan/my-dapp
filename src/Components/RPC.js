import ReactJson from "react-json-view";
import { uuid } from "uuidv4";
import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Menu, Row, Input, Select, Divider, Image } from "antd";
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";
import {
  useBalance,
  useContractLoader,
  useContractReader,
  useGasPrice,
  useOnBlock,
  useUserProviderAndSigner,
  usePoller,
} from "eth-hooks";


export default function RPC(){
const [bundle, setBundle] = useState();
  const [flashbotsRpc, setFlashbotsRpc] = useState();
  const [flashbotsBundleQuery, setFlashbotsBundleQuery] = useState();
  const [bundleUuid, setBundleUuid] = useState();

  usePoller(async () => {
    try {
      if (bundleUuid) {
        const bundle = await fetch(flashbotsBundleQuery);
        const bundleJson = await bundle.json();
        console.log({ bundleJson });
        if (bundleJson.rawTxs) {
          setBundle(bundleJson?.rawTxs.reverse());
        }
      }
    } catch (e) {
      console.log(e);
    }
  }, 3000);

  useEffect(() => {
    console.log("new bundle");
    setFlashbotsRpc("https://rpc.flashbots.net?bundle=" + bundleUuid);
    setFlashbotsBundleQuery("https://rpc.flashbots.net/bundle?id=" + bundleUuid);
  }, [bundleUuid]);


  return (
    <div className="app">
     <h1>Get Ξther Get RPC </h1>
            <Input
              value={bundleUuid}
              onChange={e => {
                setBundleUuid(e.target.value);
              }}
            />
	    <br />
            <Button
              onClick={() => {
                const newUuid = uuid();
                setBundleUuid(newUuid);
              }}
            >
              Get new RPC
            </Button>
	   <br />
          <div>{flashbotsRpc}</div>
         <Divider />
       {bundle && (
              <div class="center" style={{ width: "50%" }}>
                <ReactJson src={bundle} />
                <Button
                  onClick={async () => {
                    try {
                      const res = await fetch('https://ip3z9fy5va.execute-api.us-east-1.amazonaws.com/dev/relay', {

                        method: 'POST',
                        headers: {
                          'Accept': 'application/json',
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({signedTransactions: bundle})
                      })
                      
                      const resJson = await res.json()
                      console.log({resJson})
                        console.log("bundles submitted");
                    } catch (error) {
                      console.log({error})
                    }
                  }}
                >
                  Submit Bundle
                </Button>
              </div>
            )}

            <Divider />
     </div>
  );
}