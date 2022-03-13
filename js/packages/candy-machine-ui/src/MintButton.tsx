import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import { CandyMachineAccount } from './candy-machine';
import { CircularProgress } from '@material-ui/core';
import { GatewayStatus, useGateway } from '@civic/solana-gateway-react';
import { useEffect, useState } from 'react';
import { debuglog } from 'util';

export const CTAButton = styled(Button)`
  width: 100%;
  height: 60px;
  margin-top: 10px;
  margin-bottom: 5px;
  background: linear-gradient(180deg, #604ae5 0%, #813eee 100%);
  color: white;
  font-size: 16px;
  font-weight: bold;
`; // add your own styles here

export const MintButton = ({
  onMint,
  candyMachine,
  isMinting,
}: {
  onMint: () => Promise<void>;
  candyMachine?: CandyMachineAccount;
  isMinting: boolean;
}) => {
  debuglog("is minting active" + candyMachine?.state.isActive)

  const { requestGatewayToken, gatewayStatus } = useGateway();
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (gatewayStatus === GatewayStatus.ACTIVE && clicked) {
      onMint();
      setClicked(false);
    }
  }, [gatewayStatus, clicked, setClicked, onMint]);

  const getMintButtonContent = () => {
    if (candyMachine?.state.isSoldOut) {
      return 'SOLD OUT';
    } else if (isMinting) {
      return <CircularProgress />;
    } else if (candyMachine?.state.isPresale) {
      return 'PRESALE MIdNT';
    }

    if (candyMachine?.state.isActive) {
      if (candyMachine?.state.gatekeeper) {
        return 'MINT Token';    
      } else {
        return 'NO GATE KEEPER';  
      }
    } else {
      return 'NOT ACTIVE';
    }
  };

  return (
    <CTAButton
      disabled={
        candyMachine?.state.isSoldOut ||
        isMinting ||
        !candyMachine?.state.isActive
      }
      /*
      onClick={async () => {
        debuglog("is minting active")
        setClicked(true);
        debuglog("is minting clicked")
        await onMint();
        debuglog("is waited")
        setClicked(false);
      }}
      */
      onClick={async () => {
        debuglog("is minting Clicked")
        setClicked(true);
        debuglog("isActive" + candyMachine?.state.isActive)
        debuglog("isActive" + candyMachine?.state.gatekeeper)
        if (candyMachine?.state.isActive || candyMachine?.state.gatekeeper) {
          debuglog("111111")
          if (gatewayStatus === GatewayStatus.ACTIVE) {
            debuglog("222222")
            setClicked(true);
          } else {
            debuglog("3333333")
            await requestGatewayToken();
          }
        } else {
          debuglog("4444444")
          await onMint();
          debuglog("5555555")
          setClicked(false);
        }
      }}
      variant="contained"
    >
      {getMintButtonContent()}
    </CTAButton>
  );
};
